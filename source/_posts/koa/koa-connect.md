---
layout: about
title: Koa系列-Middleware：koa-connect
date: 2019-06-12 10:29:37
tags: koa
category: Koa
---

很简单的一个中间件，用来转化 `connect` 和 `Express` 的中间件在 koa 上的使用。

直接分析代码。

```javascript
// 处理 connect，直接返回 next()
function noCallbackHandler(ctx, connectMiddleware, next) {
  connectMiddleware(ctx.req, ctx.res)
  return next()
}

// 处理 Express，使用 Promise来处理 next
function withCallbackHandler(ctx, connectMiddleware, next) {
  return new Promise((resolve, reject) => {
    connectMiddleware(ctx.req, ctx.res, err => {
      if (err) reject(err)
      else resolve(next())
    })
  })
}

// 输出的中间件
function koaConnect(connectMiddleware) {
  // 根据传入的函数的参数判断是哪个框架
  const handler = connectMiddleware.length < 3
    ? noCallbackHandler
    : withCallbackHandler
  return function koaConnect(ctx, next) {
    return handler(ctx, connectMiddleware, next)
  }
}

module.exports = koaConnect
```