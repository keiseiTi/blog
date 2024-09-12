---
layout: about
title: Koa系列-Authentication：koa-passport
date: 2019-04-22 10:20:03
tags:
---

Koa的Passport中间件。

首先，阻止了 `passport` 的补丁，将 `__monkeypatchNode` 定义为一个没有作用的函数，因为这个是对 `Express` 和 `connect` 做的补丁，但 `koa` 不需要。

```javascript
// prevent passport from monkey patching
const connect = require('passport/lib/framework/connect')
connect.__monkeypatchNode = function() {}
```

<!-- more -->

然后自定义了 `Framework/koa` ，让 `password` 的框架为 `koa` 。

然后定义类 `KoaPassport` 继承 `Passport`。

作者重新自定义了 `initialize` 和 `authenticate` 中间件，用于搭配 `koa` 的使用。

```javascript
// 用于将 `expressMiddleware` promisify
function promisify(expressMiddleware) {
  return function(req, res) {
    return new Promise(function(resolve, reject) {
      expressMiddleware(req, res, function(err, result) {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }
}
```

函数 `initialize`

```javascript
function initialize(passport) {
  // 将原始 initialization 中间件 promisify
  const middleware = promisify(_initialize(passport))
  return function passportInitialize(ctx, next) {
    // 设置用户属性
    const userProperty = passport._userProperty || 'user'
    // 检查 ctx.req 上是否存在属性 userProperty，若不存在则去定义
    if (!ctx.req.hasOwnProperty(userProperty)) {
      Object.defineProperty(ctx.req, userProperty, {
        enumerable: true,
        get: function() {
          return ctx.state[userProperty]
        },
        set: function(val) {
          ctx.state[userProperty] = val
        }
      })
    }

    // 为Express的req对象创建模拟对象
    const req = createReqMock(ctx, userProperty)

    // 添加promise-base的login方法
    const login  = req.login
    ctx.login = ctx.logIn = function(user, options) {
      return new Promise((resolve, reject) => {
        login.call(req, user, options, err => {
          if (err) reject(err)
          else resolve()
        })
      })
    }

    // 将Passport请求扩展的别名添加到Koa的上下文中
    ctx.logout = ctx.logOut = req.logout.bind(req)
    ctx.isAuthenticated     = req.isAuthenticated.bind(req)
    ctx.isUnauthenticated   = req.isUnauthenticated.bind(req)

    return middleware(req, ctx).then(function() {
      return next()
    })
  }
}
```

函数 `createReqMock`

```javascript
exports.create = function(ctx, userProperty) {
  // 默认有properties，主要是用来扩展 ctx.request 方法和属性
  // 在req上新增userProperty属性
  const req = Object.create(ctx.request, properties)
  Object.defineProperty(req, userProperty, {
    enumerable: true,
    get: function() {
      return ctx.state[userProperty]
    },
    set: function(val) {
      ctx.state[userProperty] = val
    }
  })
  // 在req上新增ctx属性
  Object.defineProperty(req, 'ctx', {
    enumerable: true,
    get: function() {
      return ctx
    }
  })
  // 给 req 添加 passport 的 http.IncomingMessageExt 方法
  req.login = IncomingMessageExt.logIn
  req.logIn = IncomingMessageExt.logIn
  req.logout = IncomingMessageExt.logOut
  req.logOut = IncomingMessageExt.logOut
  req.isAuthenticated = IncomingMessageExt.isAuthenticated
  req.isUnauthenticated = IncomingMessageExt.isUnauthenticated
  return req
}
```

函数 `authorize`

```javascript
// 实则使用 authenticate ,在这之前先定义 assignProperty 为 account
function authorize(passport, name, options, callback) {
  options = options || {}
  options.assignProperty = 'account'
  return authenticate(passport, name, options, callback)
}
```

函数 `authenticate`

```javascript
function authenticate(passport, name, options, callback) {
  // 判断options的参数类型，规范化参数
  if (typeof options === 'function') {
    callback = options
    options  = {}
  }
  options = options || {}
  // 自定义回调函数，包层Promise来使用
  if (callback) {
    const _callback = callback
    callback = function(err, user, info, status) {
      try {
        Promise.resolve(_callback(err, user, info, status))
               .then(() => callback.resolve(false))
               .catch(err => callback.reject(err))
      } catch (err) {
        callback.reject(err)
      }
    }
  }
  // 将原始 authenticate 中间件 promisify
  const middleware = promisify(_authenticate(passport, name, options, callback))

  return function passportAuthenticate(ctx, next) {
    // this functions wraps the connect middleware
    // to catch `next`, `res.redirect` and `res.end` calls
    const p = new Promise((resolve, reject) => {
      // 模拟re对象
      const req = createReqMock(ctx, options.assignProperty || passport._userProperty || 'user')

      function setBodyAndResolve(content) {
        if (content) ctx.body = content
        resolve(false)
      }
      // 模拟res对象
      const res = {
        redirect: function(url) {
          ctx.redirect(url)
          resolve(false)
        },
        setHeader: ctx.set.bind(ctx),
        end: setBodyAndResolve,
        send: setBodyAndResolve,
        set statusCode(status) {
          ctx.status = status
        },
        get statusCode() {
          return ctx.status
        }
      }

      req.res = res

      // update the custom callback above
      if (callback) {
        callback.resolve = resolve
        callback.reject  = reject
      }

      // 因为passport适用于 Express 和 connect ，所以在 koa 上使用需要处理
      // Express，connect 的一些属性在 koa上没有，所以得模拟得到这些
      middleware(req, res).then(resolve, reject)
    })

    return p.then(cont => {
      // cont equals `false` when `res.redirect` or `res.end` got called
      // in this case, call next to continue through Koa's middleware stack
      if (cont !== false) {
        return next()
      }
    })
  }
}
```