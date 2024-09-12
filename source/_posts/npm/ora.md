---
layout: about
title: 每周npm模块源码解读：ora
date: 2018-09-13 22:00:55
tags: NPM
category: npm
---

**补 周2018.9.3 ~ 2018.9.9**

##### 前言

模块名：`ora`

github: https://github.com/sindresorhus/ora

描述：提供更友好的配置式的终端spinner

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

定义了类 `ora` ，并定义了其成员变量和成员方法。

成员变量用一种可配置的形式来实现整个类该如何显示。如颜色，文字，光标的隐藏，每个多少时间换一个 `frame` 也就是 `spinner` 的形式。

成员方法则提供了 `start` , `stop` , `succeed` 和 `warn` 等。
`spinner` 的变化是通过一个 `setInterval` 来实现，通过流的形式打印到终端上。

总体来说比较简单，但细细发现有很多东西可以学习，模块 `readline` , `process` , `TTY` ，虽然无法准确的了解每个细节，但也知道了一些。并且整个类的设计也是可以学习的。


##### 结语

仔细阅读了源码，发现作者考虑的很周到，也试过用 `ora` 进行 `webpack` 打包的标志。
思考了一下如果自己去实现呢，估摸着也就，`start` 和 `stop` 了，估计也不会用 `class` 的方式。