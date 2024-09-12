---
layout: about
title: 每周npm模块源码解读：tz-format
date: 2018-11-29 00:14:13
tags: NPM
category: npm
---

**补 周2018.11.19 ~ 2018.11.25**

##### 前言

模块名：`tz-format`

github: https://github.com/samverschueren/tz-format

描述：提供一种UTC时间的转化方法

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

该使用方法提供两个参数，一个是日期 `date` ，另外一个是UTC时间的偏移量 `offset` 。

首先判断 `data` 和 `offset` 的数据类型。

接着用方法 `getOffset` 得到当前的UTC偏移量。

然后判断 `offset` ，去设置 `date` 的分钟，用 `setMinutes` 方法，该方法的参数超过了合理范围，会相应的更新日期时间中的时间信息。

最后返回当前时间。

并且有一个辅助函数 `pad` 在参数小与10时添加前置0。

##### 结语

具体实现挺简单的，可以去看看。