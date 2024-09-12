---
layout: about
title: 每周npm模块源码解读：configstore
date: 2018-12-04 14:24:05
tags: NPM
category: npm
---

**补周2018.11.26 ~ 2018.12.2**

##### 前言

模块名：`configstore`

github: https://github.com/yeoman/configstore

描述：一个能读取和持久化配置的模块

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

类 `Configstore` 有三个参数 `packageName` , `defaults` 和 `options` 。

`packageName` 表示记录该实例的一个标记。

`defaults` 表示初始化默认的配置。

`options` 表示一些选项配置。

首先得到存储路径，然后判断是否有 `defaults` 来初始化默认配置。

存储路径的判断是根据选项配置，如果定义了 `globalConfigPath` 为 true,则存储为 `packageName/config.json` ，否则为 `configstore/packageName.json` 。

最后根据 `option.configPath` 是否存在来判断是采用 `configPath` 还是默认的路径。

接着就是将类 `Configstore` 实例化，有一些实例方法。如set,get,has,delete,clear等方法。

这些方法主要用到了模块 `dot-prop` 用作数据操作。

##### 结语

可以联想localStorage，sessionStorage的原理。