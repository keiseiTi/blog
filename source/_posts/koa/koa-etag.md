---
layout: about
title: Koa系列-Caching：koa-etag
date: 2019-01-20 15:25:34
tags: koa
category: Koa
---

有以下几种情况不能使用 `etag`：

1.没有响应实体
2.已设置了 `etag`
3.http状态码不是 `2xx`
4.响应实体是 `stream` 类型，没有具体路径也不行

最后是使用了包 `etag` 生成具体的 `etag`

参考: [浏览器缓存](https://www.cnblogs.com/etoah/p/5579622.html)