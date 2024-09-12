---
layout: about
title: 每周npm模块源码解读：cp-file
date: 2018-09-11 23:55:50
tags: NPM
category: npm
---

**补 周2018.9.1 ~ 2018.9.2**

##### 前言

模块名：`cp-file`

github: https://github.com/sindresorhus/cp-file

描述：以流的方式异步复制文件和 `fs.copyFileSync()` 同步的方式，以及更友好的处理形式：如错误处理，和复制时的原地址和目标地址等

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

该模块总共有3个api，分明是 `cpFile` 、 `cpFile.sync` 和 `cpFile.on`。

在分析之前，得先分析下其他的。
1.错误处理: 引用模块 `nested-error-stacks` ,作者对其进行封装，以适合 `cp-file` 的使用。

2.文件处理: 引用模块 `graceful-fs` ，作者把这个模块进行了更高一层的封装，主要是通过模块 `pify` 使 `graceful-fs` 的回调 `promisify` 化，和对部分的方法进行了错误处理。

3.事件监听 `ProgressEmitter` : 给 `cpFile.on` 使用。

`cpFile(source, destination, [options])` :

使用 `fs.stat` 来判断该源文件是否存在，不存在则报错，存在就把该文件的 `stat` 的 `size` 写入事件监听器的实例 `progressEmitter` 中。
然后通过流的方式打开该文件，通过模块 `make-dir` 创建目标路径，在把源文件通过写入流把流传输到目标地址中，以达到复制文件的目的。

`cpFile.sync(source, destination, [options])`:

同步的方式有两种，原因是 `node 8.5.0` 提供了 `copyFileSync` 方法。

存在 `copyFileSync` 判断文件，调用api进行复制，修改已目标文件属性。

不存在 `copyFileSync` 使用 `readSync` 、`writeSync` 、 `openSync` 、`closeSync`等api进行操作。设定固定 `buffer` ，用 `while` 来循环判断是否已经完成复制。若完成，关闭读取文件，然后修改目标文件属性。

`cpFile.on('progress', handler)`:
在 `cpFile` 中，把文件的一些属性写入到事件监听器 `progressEmitter` 中，再通过 `emit` 触发 `progressEmitter` 的事件名 `progress` ,通过回调可以输出文件参数。

##### 结语

看似很简单，但仔细想想需要花费比作者更多的时间和精力去完成这个模块，并不一定能达到目前的使用效果和体验。
