---
layout: about
title: 每周npm模块源码解读：dateFormat
date: 2018-10-31 10:43:38
tags: NPM
category: npm
---

**周2018.10.29 ~ 2018.11.4**

##### 前言

模块名：`anywhere`

github: https://github.com/felixge/node-dateformat

描述：以相对较小的size提供了功能更完整的dataFormat

适合人群：至少看过一遍源码

<!-- more -->

##### 正文
 
主要是通过字符串方法 `replace` 使用正则来替换字符最后返回值。

首先定义了三个正则用来替换字符。接着判断参数的类型是否正确。

然后通过传入的参数是否使用utc或者gmt。接着去定义转化字符的值。

并且还可以去定义短词字符串来快速执行日期转化以及本地化日名、月名和AM/PM等。

##### 结语

没看过其他操作时间的类库，但这个类库的功能还是相对比较完善，最重要的是size很小。

