---
title: monaco editor 的使用经验总结 
date: 2024/9/10 23:59:54
---

<!-- # monaco editor 的使用经验总结  -->

## 前提

笔者一直在进行低代码平台的相关开发工作。前些日子接到了，组件的事件逻辑使用代码编辑器进行编写的需求。于是在网上进行了相关编辑器的调研后，最后选择了 `monaco editor` 。经过一段时间的摸索开发，目前基于低代码平台的代码编辑器已上线使用。这里简单分享下关于 `monaco editor` 的一些使用经验。

## 安装 & 配置

相关安装&配置的教程能在网上搜的到，这里就不展开了。简单说一下笔者遇到的坑。

笔者是在 `vite` 项目里使用 `monaco editor` 。按照网上的教程，引进 `monaco editor` 的相关 `worker` 后，能正常使用编辑器。但该项目部署发布成 `npm` 包后，由 webpack 相关的项目引入后就报错了。主要原因是 webpack 和 vite 对于代码处理机制的是不同的。通过调整相关 `worker` 的引入方式后，解决了这个问题。

`umi` 3.x 项目用 `npm` 包的形式提供 `monaco editor` 编辑器，在 4.x 的应用项目里使用。要区分使用 `monaco editor` 与 `monaco-editor-webpack-plugin` 的版本。

`umi` 3.x 的项目无法n使用高版本 `monaco editor` 。

## 高级功能

代码编辑器是基于低代码平台建设的，所以具有低代码平台的特色。

### addExtraLib——typescript 类型提示

通过 `addExtraLib` 可以添加 `ts` 类型声明，包括自定义的类型声明。当要注意的是，需要使用 `typescript` `language`。

![1.png](/assets/use-monaco-editor/1.png)

### registerCompletionItemProvider——代码补全

代码补全即输入字符后，根据上下文进行代码提示。

通常的做法是通过 `AST` 去分析代码后，进行相对应的模式匹配，但低代码平台对这块需求比较低，所以笔者的实现方案就相对比较简单了，根据输入的字符去匹配当前行这个字符前的内容，如果匹配到了，则进行相对应的代码提示。

### registerInlayHintsProvider——内联提示

思路是通过 `AST` 分析代码，得到相对应的 `tokens`，再计算出相对应需要提示的 `token` 的 `position` 即可。

![2.png](/assets/use-monaco-editor/2.png)

### registerEditorOpener——快捷跳转

低代码平台的代码编辑器会支持导入第三方的代码片段，所以需要在编辑器上进行相对应的跳转提示。网上查了一些资料后，最终选择使用 `registerEditorOpener` 。再搭配 `addOverlayWidget`，可以在控件里展示第三方代码。

![3.png](/use-monaco-editor/3.png)


## 总结

目前使用的 `monaco editor` 版本为 0.50.0，后续有新增的功能也会补充进来。