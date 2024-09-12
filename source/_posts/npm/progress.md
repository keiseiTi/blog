---
layout: about
title: 每周npm模块源码解读：progress
date: 2018-10-07 15:56:48
tags: NPM
category: npm
---
**周2018.10.1 ~ 2018.10.7**

##### 前言

模块名：`每周npm模块源码解读：progress`

github: https://github.com/visionmedia/node-progress

描述：提供在终端中灵活的进度条

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

首先定义了 `ProgressBar` 类，默认将 `process.stderr` 作为终端的输出，紧接着定义类属性。

该类有5个类方法，分明为 `tick` , `render` , `update` , `interrupt` 和 `terminate` 。着重讲述 `tick` 和 `render` 这两个方法。

方法 `tick` ：
设置属性 `renderThrottle` 值为0时，即立刻执行方法 `render` 。否则定义一个定时器，来执行方法 `render` 。如果当进度条完成时，执行 `terminate`。

方法 `render` ：
每一次定时器的执行的会生成表示进度条的字符，然后显示到终端上。是通过计算当前时刻已完成的和未完成的，然后通过字符串方法 `replace` 来替换。如果有自定义的token，也可以进行替换。

方法 `update` ：
作用是在进度条的过程中更新完成率和tokens，然后执行方法 `tick` 。每次 `update` 都会去重新去 `tick` 。

方法 `interrupt` ：
在此刻，输出message。实则是打断此刻的进度条输入信息。

方法 `terminate` ：

终止进度条。

##### 结语

较好理解，每个属性和方法都有较为清晰的理解。可以从中学到流与终端的搭配使用。

