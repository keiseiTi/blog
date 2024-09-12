---
layout: about
title: Koa系列-Rate Limiting：koa-ratelimit
date: 2018-11-06 13:51:07
tags: koa
category: Koa
---

该中间件是用来控制api请求的速率限制，用于数据库 `redis` ，基于模块 `ratelimiter` 。

关于 `Rate Limits` 有三个响应头，分别是：

`X-RateLimit-Remaining` ：当前速率限制窗口中的剩余请求数。

`X-RateLimit-Reset` ：当前速率限制窗口在UTC世界标准时中的重置时间。

`X-RateLimit-Limit` ：允许用户每小时的最大请求数。

<!-- more -->

有两个比较重要的配置选择， `id` 主要是用来区分用户，默认以用户 ip 作为区分，另外一个是 `db` ，是数据库 `redis` 的实例。

当实例 `ratelimiter` 并执行其方法时，会返回一个对象，包含四个属性 `total` ， `remaining` ， `reset` 和 `resetMs` 。

当 `remaining` 为0时，也就是剩余请求数为0时，响应头则添加 `Retry-After` ，并将状态码设置为429，并返回消息。

##### 参考

https://www.fullcontact.com/developer/docs/rate-limits/
https://developer.capsulecrm.com/v1/ratelimit/
https://blog.apisyouwonthate.com/what-is-api-rate-limiting-all-about-1819a390ab06