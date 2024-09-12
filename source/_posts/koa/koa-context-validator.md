---
layout: about
title: Koa系列-Parameter Validation：koa-context-validator
date: 2018-11-05 13:42:07
tags: koa
category: Koa
---

Koa 的该类型中间件数量并不是很多，并且没有几个符合要求，目前这个中间件 `koa-context-validator` 达到要求。

具体的验证参数是模块 `joi` 提供的。

第一个参数 `schema` 是定义了需要验证的内容。如用 post 时，可以这么写，验证 body 中的 username 和 age。

```
app.use(validator({
  body: object().keys({
    username: string().required(),
    age: number().required(),
  }),
}));
```

<!-- more -->

第二个参数 `opts_` 则是 `joi.validate` 方法的参数 `options` 。

通过 `Object.assign` 将参数 opts 重新复制到另一个变量 opts 上。然后将 ctx 和 opts.context 重新赋值到 opts.context 上。 

接着遍历 schema，通过函数 `isContextOnlyKey` 判断是否有 key 等于 `params` ,决定需要验证的数据源是 `ctx` 或者 `ctx.request`。

方法 `validate` 已经被模块 `thenify` promiseify 了。所以在遍历中，验证每个 schema，然后放入到数组中。待遍历结束，通过 `Promise.all` 来判断每个 schema 是否已经验证通过。

关于参数验证的规则，看了 `joi` 的api文档，所提供的 api 足够完成常规的参数验证的需求。但个人还是比较喜欢中间件 `koa-validate` 的用法，可惜该模块只能在 Koa_v1 中使用。

业界也有其他比较好的参数验证的模块，如 `parameter` 等。