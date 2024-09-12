---
layout: about
title: Koa系列-HTTP2：koa-server-push
date: 2019-01-13 21:35:40
tags: koa
category: Koa
---

在使用http2协议的情况下，开启server push之后，server通过X-Associated-Content header（X-开头的header都属于非标准的，自定义header）告知客户端会有新的内容推送过来。在用户第一次打开网站首页的时候，server将资源主动推送过来可以极大的提升用户体验。

该模板通过默认的文件名去读取内容，或者是设置读取内容的文件名。

通过设置http head的Link，添加代理。

参考：[http2的前生今世](https://github.com/amandakelake/blog/issues/35)