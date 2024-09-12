---
layout: about
title: 每周npm模块源码解读：cpy
date: 2018-09-16 16:09:36
tags: NPM
category: npm
---

**周2018.9.10 ~ 2018.9.16**

##### 前言

模块名：`cpy`

github: https://github.com/sindresorhus/cpy

描述：可以用更好的方式去一次性复制多个文件

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

使用模块 `arrify` 将源路径转化为数组形式，然后通过模块 `globby` 得到需要复制的相应文件。

使用了 `Promise.all` 以便多文件的同步复制，主要是每个文件都需要被复制成功或被失败。
然后通过事件监听器和触发器得到多文件复制的状态。

##### 结语

作者使用模块 `globby` 和 `cp-file` 实现了一次性复制多文件，然后通过事件监听器的形式与 `cp-file.on` 组合成了可以知道多文件复制的progress。
