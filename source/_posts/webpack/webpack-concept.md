---
layout: about
title: webpack-concept
date: 2019-05-20 11:18:54
tags: [webpack]
category: webpack
---

## Entry/Output

### 入口

**entry** 指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的，默认值是 `./src/index.js`。

### 出口

**output** 属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。主要输出文件的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist` 文件夹中。

<!-- more -->

## loader

loader 用于对模块的源代码进行转换。loader 可以使你在 `import` 或"加载"模块时预处理文件。因此，loader 类似于其他构建工具中“任务（task）”，并提供了处理前端构建步骤的强大方法。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS文件！

`module.rules` 允许在 webpack 配置中指定多个 loader。 这种方式是展示 loader 的一种简明方式，并且有助于使代码变得简洁和易于维护。loader 从右到左地取值（evaluate）/执行（execute）。

## plugin

插件是 webpack 的强大功能。webpack 自身也是构建于，在 webpack 配置中用到的相同的插件系统之上！

插件目的在于解决 loader 无法实现的其他事。

## webpack-dev-server

webpack-dev-server 是 webpack 官方提供的一个小型 Express 服务器。使用它可以为 webpack 打包生成的资源文件提供 web 服务。

webpack-dev-server 主要提供两个功能：

- 为静态文件提供服务
- 自动刷新和热替换（HMR）

## tree-shaking

tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块语法的`静态结构`特性。

## code splitting

代码分离是 webpack 中最引人注目的特性之一。此特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

## compare rollup

Rollup 的开发理念是利用 ES2015 模块的巧妙设计，尽可能高效地构建精简且易分发的 JavaScript 库。而其它的模块打包器（包括 Webpack在内）都是通过将模块分别封装进函数中，然将这些函数通过能在浏览器中实现的 require 方法打包，最后依次处理这些函数。在你需要实现按需加载的时候，这种做法非常的方便，但是这样做引入了很多无关代码，比较浪费资源。

在开发应用时使用 Webpack，开发库时使用 Rollup。

## other

webpack4 提供了 `mode` 选项，告知 webpack 使用相应环境的内置优化， 有这三个值，`none` , `development` , `production`。