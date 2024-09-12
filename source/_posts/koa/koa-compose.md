---
layout: about
title: Koa系列-Utilities：koa-compose
date: 2019-04-15 11:51:07
tags:
---

中间件 `koa-compose` 是用来组合所有的中间件来依次执行。

首先先判断 `middleware` 的类型

```javascript
if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
for (const fn of middleware) {
  if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
}
```

<!-- more -->

然后开始依次调用中间件
```javascript
function (context, next) {
  // last called middleware #
  let index = -1
  // 执行第一个中间件
  return dispatch(0)
  function dispatch (i) {
    // 防止next被调用多次，即每次只允许一个next调用，否则就会有一些next被重复执行
    if (i <= index) return Promise.reject(new Error('next() called multiple times'))
    index = i
    let fn = middleware[i]
    // 若没有中间件，则返回next。或者中间件的顺序为中间件的长度时，返回next
    if (i === middleware.length) fn = next
    // 不存在fn，返回promise.resolve，接上 `.then(handleResponse).catch(onerror);`
    if (!fn) return Promise.resolve()
    try {
      // 下一个中间件的next=dispatch.bind(null, i + 1))，所以中间件会去执行await next()，实则去执行下一个中间件
      return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
```