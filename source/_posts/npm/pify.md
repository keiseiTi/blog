---
layout: about
title: 每周npm模块源码解读：pify
date: 2018-10-23 13:54:37
tags: NPM
category: NPM
---

**周2018.10.22 ~ 2018.10.28**

##### 前言

模块名：`pify`

github: https://github.com/sindresorhus/pify

描述：将回调函数promise化，也就是回调函数可以使用then、catch

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

首先通过 `Object.assign` 返回新的配置选项，然后判断pify的第一个参数的类型。如类型不正确，则报错。

如果第一个参数的类型是函数，则创建一个函数，根据 `excludeMain` 来判断是用它本身自己还是promise化的回调。

如果第一个参数的类型是对象，则创建一个新的对象，这个对象的原型为这个对象的原型。接着去遍历第一个参数(对象)，通过三表表达式判断对象的每个Key是否为函数和一个筛选函数，如果为true，则将这个函数promise化，否则直接返回该值。

函数 `processFn` 就是将回调函数promise化。先创建Promsise函数，然后在其通过配置选项处理参数。最后通过 `fn.apply(this.args)` 来执行。


##### 结语

node中的大部分异步函数可以用模块pify来promise化。