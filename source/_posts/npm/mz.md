---
layout: about
title: 每周npm模块源码解读：mz
date: 2018-12-27 22:43:13
tags: NPM
category: npm
---

**周2018.12.24 ~ 2018.12.30**

##### 前言

模块名：`mz`

github: https://github.com/normalize/mz

描述：将node.js的某些模块promisify化

适合人群：至少看过一遍源码

<!-- more -->

##### 正文
 
    现在的node最新稳定版本10.15.0，已经提供了把node模块promisify的函数了。

将 `fs`, `dns`, `zlib`, `crypto`, `readline`, `child_process` 这些模块的方法promisify化。

主要是借助 `thenify-all` 和 `any-promise` 的帮助。

有两点需要注意的：

一个是模块 `fs` ，重写了 `fs.exits`。但该方法已经废弃了。该方法实则使用是调用 `fs.stat`。

另外一个是模块 `readline` ，重写了 `readline.Interface`。兼容以前的版本？覆盖 `question` ，在这边使用了 `promise`。

##### 结语

在那个年代，把常用的node模块promisfy还是很有用的。