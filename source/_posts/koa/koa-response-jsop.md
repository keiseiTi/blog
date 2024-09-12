---
layout: about
title: Koa系列-JSON and JSONP Responses：koa-response-jsop
date: 2019-01-17 11:21:55
tags: koa
category: Koa
---

这个库的具体实现是将koa实例传入函数jsonp，在contenxt上挂载一个新函数jsonp，来达到效果。

参考：[jsonp原理](https://segmentfault.com/a/1190000009742074)