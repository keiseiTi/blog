---
layout: about
title: Koa系列-Compression：koa-compress
date: 2019-01-18 11:18:29
tags: koa
category: Koa
---

使用该库进行压缩，有以下几个条件，若哪一条不能通过，则不需要进行压缩。

1.必须得有 `body`
2.响应头是否已经发送或者响应是否已经结束
3.是否设置了 `compress = false`
4.请求方法不能是 `HEAD`
5.判断状态码是否不能包含消息体
6.响应头是否已经存在 `Content-Encoding`
7.筛选响应体的类型
8.是否可以设置 `acceptsEncodings('gzip','deflate','identity')`
9.内容编码为 `identity`
10.响应内容大小是否小与设置值

最后即使用 `gzip` or `defalte` 进行压缩传输。

参考：[http协议中的Content-Encoding](https://blog.csdn.net/u014569188/article/details/78912446)

