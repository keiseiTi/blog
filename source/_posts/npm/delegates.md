---
layout: about
title: 每周npm模块源码解读：delegates
date: 2018-12-22 16:11:05
tags: NPM
category: npm
---

**周2018.12.17 ~ 2018.12.23**

##### 前言

模块名：`delegates`

github: https://github.com/tj/node-delegates

描述：方法和访问器委托的工具

适合人群：至少看过一遍源码

<!-- more -->

##### 正文
 
用函数的形式调用，实则是用 `new` 来实例。

`Delegate(proto, target)` ：实例构造函数 `Delegator` 。

`Delegate.auto(proto, targetProto, targetProp)` ：实例构造函数 `Delegator` ,然后使用 `Object.getOwnPropertyNames` 来得到 `targetProto` 的自身属性的属性名（包括不可枚举但不包括Symbol值作为名称的属性）。将通过 `Object.getOwnPropertyDescriptor` 得到 `taegetProto` 的每个属性的描述符，接着是数据描述符还是存取描述符，进行相应的操作。

`Delegate#method(name)` ：将 `target` 的此方法挂载到 `proto` 上。

`Delegate#getter(name)` ：使用 `__defineGetter__` 将属性挂载到 `proto` 上。使用 `Object.defineProperty`

`Delegate#setter(name)` ：使用 `__defineSetter__` 将属性挂载到 `proto` 上。

`Delegate#access(name)` ：连着使用 `getter` 和 `setter`。

`Delegate#fluent(name)` ：判断调用时，参数是否是 `undefined` ,是则返回该属性对应值，不是则去设置该属性的值。

##### 结语

学习了，学习了，结合 `koa` 的 `context` 可以更加了解。