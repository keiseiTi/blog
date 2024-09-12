---
layout: about
title: Koa系列-Response Transformation：koa-res
date: 2019-04-01 14:54:02
tags: koa
category: Koa
---

代码比较简单，干净。主要是控制responseBody的数据。

首先判断 `options.custom` 是不是一个函数，若不是则提示类型错误。

然后如果存在 `ctx._returnRaw` 为 `true`，则直接返回 `ctx.body` 。

<!-- more -->

否则，

```javascript
const status = ctx.status
const data = ctx.body
// 忽略 method = option and status = 404
if (ctx.method.toLowerCase !== 'option' && status !== 404) {
  ctx.body = {
    ok: true,
    data: data,
    version: options.version || version || '1.0.0',
    now: new Date()
  }
  if (custom) {
    Object.assign(ctx.body, custom(ctx))
  }
  ctx.status = status
}
```

如果应用运行错误，则在 `ctx.body` 中加入 `statck: e.stack` 。

配置了 `options.debug = true` ，则不显示 `ctx.body.stack` 。