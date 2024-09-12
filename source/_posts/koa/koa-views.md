---
layout: about
title: Koa系列-Templating：koa-views
date: 2019-02-11 14:54:06
tags: koa
category: Koa
---

这个中间件用于模板渲染，以包 `consolidate` 为默认的渲染引擎集合包，支持多种不同模板引擎。

```javascript
// 参数设置以及视图的地址，必须使用绝对地址
function viewsMiddleware(
  path,
  { engineSource = consolidate, extension = 'html', options = {}, map } = {} 
) {
  return function views(ctx,next) {
    // 判断是否存在render函数，有则跳过后续代码
    if(ctx.render) return next()
    ctx.response.render = ctx.render = function(relaPath,locals = {}) {
      // 包get-paths用来得到模板引擎视图的绝对路径
      return getPaths(path, relaPath, extension).then(paths => {
        ...
      })
    }
  }
}
```

之后就来决定是使用 `send` 返回默认 `.html` 文件还是需要使用模板引擎。

有个小细节就是，是否需要美化代码，是通过 `locals.pretty` 判断。