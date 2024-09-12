---
layout: about
title: Koa系列-Error reporting：koa-error
date: 2019-03-11 09:50:10
tags: koa
category: Koa
---

```javascript
function error(opts) {
  ...
  ...
  return async function error(ctx,next) {
    ...
    ...
  }
}
```

选项 `opts` 有 `env` , `ctx` , `request` , `response` , `error` , `stack` ,` status` , `code` 这几个选项，可以覆盖默认参数。

通过模块引擎整合库 `consolidate` 可以选择不同的模板引擎。

返回的async函数，首先判断是否 `status` 为400，否则就根据 `ctx.accepts` 的值（'text','json','html')来执行相对应的代码。

若为 `html` ，则通过 `consolidate` 生成 `error html`。