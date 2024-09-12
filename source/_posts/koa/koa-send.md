---
layout: about
title: Koa系列-File Serving：koa-send
date: 2018-12-24 09:59:35
tags: koa
category: Koa
---

一个例子，具体的用法可以看文档：

```javascript
app.use(async (ctx) => {
  await send(ctx, ctx.path, { root: __dirname + '/public' });
})
```

选项中的 `root` 表示以哪个文件夹作为静态资源文件夹，若不传则以当前文件夹为静态资源文件夹。

函数 `decode` 用于解码由 `encodeURIComponent` 方法或者其它类似方法编码的部分统一资源标识符（URI）。

选项中的 `hidden` 来隐藏 `.xx` 格式的文件，避免显示它们。

`gizp` , `brotli` 以及 `extensions` 用来传输特殊压缩格式的文件。

接着去判断该请求路径的文件，是否存在。存在的话，并且 `options.index` 是存在，则自动打开该文件。

并且可以去设置响应头，但 `setHeaders` 一定得为函数。

最后用流的方式传输文件。

在其中可以去设置响应头 `Last-Modified` 和 `Cache-Control`。

总体来说，继续学习吧。