---
layout: about
title: 每周npm模块源码解读：meow
date: 2018-10-09 16:52:29
tags: NPM
category: npm
---

**周2018.10.8 ~ 2018.10.14**

##### 前言

模块名：`meow`

github: https://github.com/sindresorhus/meow

描述：以较简单的方式供使用者开发node命令行

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

最开始是正确处理promise的错误，防止没有 `.catch()` 时的静默处理（可以使用process的事件 `unhandledRejection` 代替）。

判断是否存在 `helpMessage` ，若无，则使 `helpMessage` 为空。使用 `Object.assign` 复制一个新的 `options` 对象。

当选项中的 `booleanDefault` 来使 `options.flag` 里的属性type的类型为 `boolean` 并且不存在属性default，给default赋值 `options.booleanDefault` 。

把转化好的 `minimistFlags` 又浅拷贝到变量 `minimistoptions` ，接着驼峰转化。可能使用的是 `yargs` , 要转化命令行带的参数。

接着标准化package.json的数据，设置进程名称。如果设置了选择的 `description` 则加入到 `helpMessage` 中。

定义了两个方法 `showHelp` 和 `showVersion` ，用来打印 `helpMessage` 和 `version` 并退出该进程。

##### 结语

较少的代码量就提供了开发node命令行的功能，适用于小型的命令行开发。