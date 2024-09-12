---
layout: about
title: 每周npm模块源码解读：@medv/prettyjson
date: 2018-11-14 14:04:00
tags: Npm
category: npm
---

**周2018.11.12 ~ 2018.11.18**

##### 前言

模块名：`@medv/prettyjson`

github: https://github.com/antonmedv/prettyjson

描述：美化JSON格式

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

有两个参数可以输入，第一个是值 `v`，第二个是缩进的空格。用模块 `chalk` 输出不同的颜色的值。

首先判断 `v` 类型 ：

`undefiend` ：如果是，返回 `void 0` ,实则是 `undefined` 。

值为 `null` ： 则返回值。

`number` 并且使用 `Numebr.isFinite` 为true：则返回值。

`boolean`： 如果是，返回值。

`string`：需要对其进行 `JSON.stringify` 然后在返回。

`array` ：使用了 `Generator` 函数，然后使用递归判断里面的值，并用模块 `indent-string` 缩进字符串。

`object` ： 同 `array` 。

如果都不能满足以上情况，则使用 `JSON.stringify`。

##### 结语

有以下知识点可以学习到：

`void 0` 的意思，ES6中Number的新方法，`Generator` 函数的用法，递归。

推荐阅读： https://juejin.im/post/5be5b9f8518825512f58ba0e