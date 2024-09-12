---
layout: about
title: 每周npm模块源码解读：cross-env
date: 2018-09-23 14:43:24
tags: NPM
category: npm
---


**周2018.9.17 ~ 2018.9.23**

##### 前言

模块名：`cross-env`

github: https://github.com/kentcdodds/cross-env

描述：可以用单个命令去设置node的环境变量，并且不用考虑操作平台的区别

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

首先通过一个 `parseCommand` 函数来解析命令行，返回环境参数、命令和命令参数。

再通过函数 `getEnvVars` 得到node的环境变量，函数执行过程是在平台windows上转化了变量（看了个半懂）。

最后就是通过模块 `cross-spwan` 来执行最终得到的命令。添加事件监听器来处理一些信号，以便来停止进程。

##### 结语

正则不太好，导致部分正则匹配难以看懂。不过能懂得其模块思想。主要是通过解析转化命令行，再通过 `cross-spawn` 来执行最终的命令行。