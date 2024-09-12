---
layout: about
title: Koa系列-Utilities：koa-convert
date: 2019-04-15 15:20:01
tags:
---

该中间件是用来转化 `koa legacy` 中间件。

`convert` 是用来将中间件(0.x & 1.x)转化为(2.x)

`convert.back` 是用来将中间件(2.x)转化为(0.x & 1.x)

`convert.compose` 是通过 `koa-compose` 来执行这些转化过的中间件。

<!-- more -->

```javascript
function convert (mw) {
  // 判断类型
  if (typeof mw !== 'function') {
    throw new TypeError('middleware must be a function')
  }
  // 是不是generator函数
  if (mw.constructor.name !== 'GeneratorFunction') {
    return mw
  }
  // 使用co转化
  const converted = function (ctx, next) {
    return co.call(ctx, mw.call(ctx, createGenerator(next)))
  }
  converted._name = mw._name || mw.name
  return converted
}
// 将 promise next 转化为 generator
function * createGenerator (next) {
  return yield next()
}
```

```javascript
convert.back = function (mw) {
  // 判断类型
  if (typeof mw !== 'function') {
    throw new TypeError('middleware must be a function')
  }
  // 是不是generator函数
  if (mw.constructor.name === 'GeneratorFunction') {
    return mw
  }
  //通过co转化promise middleware
  const converted = function * (next) {
    let ctx = this
    let called = false
    // 防止next被调用多次，即每次只允许一个next调用，否则就会有一些next被重复执行
      if (called) {
        return Promise.reject(new Error('next() called multiple times'))
      }
      called = true
      return co.call(ctx, next)
    }))
  }
  converted._name = mw._name || mw.name
  return converted
}
```

```javascript
convert.compose = function (arr) {
  if (!Array.isArray(arr)) {
    arr = Array.from(arguments)
  }
  // 通过koa-compose执行转化过的中间件
  return compose(arr.map(convert))
}
```