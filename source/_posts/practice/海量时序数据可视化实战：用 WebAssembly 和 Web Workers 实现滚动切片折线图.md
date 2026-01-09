---
title: 海量时序数据可视化实战：用 WebAssembly 和 Web Workers 实现滚动切片折线图
date: 2026-01-09 14:15:51
tags: 
---


## 背景

硬件设备在运行过程中会持续采集高频数据，并通过 ECharts 图表在 `Web` 页面上进行可视化展示。数据规模由采样率和采样时长共同决定：例如，当采样率为 250 Hz（即每秒采集 250 个数据点），持续采集 8 小时，将产生约 720 万个数据点。

这些原始数据还需经过滤波算法处理后才能用于有效分析和展示。然而，在浏览器中直接渲染如此大规模的时序数据，会导致页面卡顿、内存溢出，严重影响用户体验。

因此，需要一套高效、可交互的大数据可视化方案，在保证图表流畅性的同时，支持用户通过鼠标滚轮动态浏览不同时间段的数据切片。

> 为此，我们采用 WebAssembly 加速滤波计算，利用 Web Workers 实现数据预处理与分片加载，避免阻塞主线程，并结合 ECharts 的按需渲染能力，实现千万级时序数据的高性能、可交互可视化。
> 

## 滤波算法：C++库 `iir1` 编译成 WebAssembly

`iir1` 是一个高性能的无限脉冲响应（IIR）数字滤波器 C++ 库，广泛应用于音频处理、传感器信号去噪和科学数据分析等领域。它支持 Butterworth、Chebyshev 等多种经典滤波器类型，具有低延迟、高精度和极小内存占用的特点。

然而，浏览器无法直接运行 C++ 代码。为此，我们借助 Emscripten —— 一个成熟的 C/C++ 到 WebAssembly（Wasm）编译工具链 —— 将 `iir1` 编译为可在浏览器中高效执行的 .wasm 模块。

### **编译流程**

1. 安装 Emscripten 工具链；
2. 从 GitHub 获取 `iir1` 源码；
3. 使用 `emcc` 命令将其编译为 WebAssembly：编译后会生成两个文件：
    
    ```jsx
    emcc -I./iir1 -std=c++11 -O3 --bind -sWASM=1 -sMODULARIZE=1 -sEXPORT_NAME="createIIRFilterModule" -o build/wasm/iir_filter.js iir_filter_wasm.cpp iir1/iir/Biquad.cpp iir1/iir/Butterworth.cpp iir1/iir/Cascade.cpp iir1/iir/ChebyshevI.cpp iir1/iir/ChebyshevII.cpp iir1/iir/PoleFilter.cpp iir1/iir/RBJ.cpp iir1/iir/Custom.cpp
    ```
    
    - `iir_filter.wasm`：包含核心计算逻辑的二进制模块；
    - `iir_filter.js`：Emscripten 生成的“胶水代码”，用于加载和调用 `Wasm` 模块。

### **在前端项目中使用**

**方式一：通过 `<script>` 标签动态加载**

```jsx
const script = document.createElement('script');
script.src = 'iir_filter.js';
script.async = true;
document.head.appendChild(script);

script.onload = () => {
  const Module = window.createIIRFilterModule; // 假设导出名为 createIIRFilterModule
  Module().then(iirModule => {
    // iirModule 即为可调用的 iir1 API 集合
  });
};
```

**方式二：作为 ES 模块导入（推荐）**

```jsx
import createIIRFilterModule from './iir_filter.js';

const iirModule = await createIIRFilterModule();
// 可直接调用滤波函数
```

> 注意：构建工具对 `.wasm` 文件的支持需特别配置：
> 
> - **Webpack**：需在 `webpack.config.js` 中启用 `experiments.syncWebAssembly: true`；
> - **Vite**：通常原生支持，但建议将 `.wasm` 文件置于 `public/` 目录，或通过 `?url` 显式导入以确保正确加载。

通过上述方式，我们成功将高性能 C++ 滤波能力引入浏览器环境。

## 大数据处理：基于 Web Worker 的全量预处理与切片查询

面对 720 万点的原始时序数据，若采用“按需请求 + 虚拟滚动”策略，会导致用户在快速拖拽时出现明显延迟或空白，体验不佳。因此，我们选择一次性加载并预处理全部数据，再通过时间切片的方式按需渲染。

但把如此庞大的数据在主线程中进行处理，会严重阻塞 UI，造成页面卡顿甚至无响应。为此我们将整个数据处理流程移至 Web Worker 中执行。

### Worker 通信协议设计

我们在 Worker 中定义两类消息事件：

- `init`：主线程发送原始数据，Worker 执行建立时间索引等初始化操作；
- `slice`：主线程发送时间范围（如 `[startTime, endTime]`），Worker 返回对应的数据切片。

主线程则监听对应的响应事件：

- `init_done`：表示数据已加载并处理完毕；
- `slice_done`：返回指定时间段的过滤后数据点数组。

双方通过 `postMessage` / `onmessage` 进行异步通信，确保主线程始终保持响应。

```jsx
// 主线程示例
worker.postMessage({ type: 'init', rawData });
worker.onmessage = (e) => {
  const { type, payload } = e.data;
  if (type === 'init_done') {
    console.log('数据初始化完成');
  } else if (type === 'slice_done') {
    updateChart(payload); // 更新 ECharts 折线图
  }
};
```

## **滚动交互：基于鼠标拖拽的时间切片导航**

为了实现直观的“时间轴浏览”体验，我们在图表容器外层的 `<div>` 上监听鼠标事件：

- `mousedown`：记录起始位置；
- `mousemove`：实时计算拖拽偏移量（像素）；
- `mouseup`：结束拖拽。

根据拖拽距离与图表时间跨度的比例关系，动态计算出当前视窗对应的起始时间与结束时间。随后，将该时间区间通过 `postMessage` 发送给 Worker：

```jsx
worker.postMessage({
  type: 'slice',
  startTime: computedStart,
  endTime: computedEnd
});
```

Worker 接收到请求后，利用预建的索引快速截取对应数据段，并将结果回传。主线程收到 `slice_done` 后，立即更新 ECharts 的 `series.data`，实现毫秒级响应的平滑滚动浏览。

## **总结**

通过 WebAssembly 引入高性能滤波能力，结合 Web Workers 实现大数据的离屏处理与切片查询，再配合精准的鼠标拖拽交互逻辑，我们成功在浏览器中实现了 千万级时序数据的流畅、可交互可视化。