---
layout: about
title: 每周npm模块源码解读：ms
date: 2018-11-07 11:20:20
tags: NPM
category: npm
---

**周2018.11.5 ~ 2018.11.11**

##### 前言

模块名：`ms`

github: https://github.com/zeit/ms

描述：方便的转化将各种时间转化为毫秒，也可以将毫秒转化为其他时间

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

有两个参数，第一个是需要转化的值val，第二个是配置选项options。

首先判断val的类型，如果是字符串并且长度大于0，就执行函数 `parse`。如果是数字并且不是NaN，接着判断options.long是否为true，如果为true，就执行函数 `fmtLong` ，否则执行函数 `fmtShot`。

函数 `parse` ：用正则来匹配val出结果，然后通过 `switch case` ，返回最终毫秒数。

函数 `fmtShort` ：首先通过 `Math.abs` 返回val的绝对值，然后判断是大于天的毫秒数，还是大于小时的毫秒数等的判断，最终返回正确的值。

函数 `fmtLong` ：和函数 `fmtShort` 一样，区别于改变了后缀词以及判断是否为复数。

##### 结语

学习到了，简单，但感觉看这个源码很舒服。