---
layout: about
title: Koa系列-Livereload：koa-livereload
date: 2019-03-13 11:27:27
tags: koa
category: Koa
---

```javascript
function livereload(opts) {
  // 选项
  opts = opts || {};
  // 端口
  var port = opts.port || 35729;
  // livereload.js文件的路径
  var src = opts.src || "' + (location.protocol || 'http:') + '//' + (location.hostname || 'localhost') + ':" + port + "/livereload.js?snipver=1";
  var snippet = "\n<script type=\"text/javascript\">document.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')</script>\n";
  return (ctx, next) => next().then(() => {
    // content-type 不是 text/html 则返回
    if (ctx.response.type && !ctx.response.type.includes('html')) return;
    // 实际请求路径在排除路径中，则返回
    if (opts.excludes) {
      var path = ctx.path;
      if (opts.excludes.some(exclude => path.startsWith(exclude))) return;
    }

    // Buffer处理，转化为字符串
    if (Buffer.isBuffer(ctx.body)) {
      ctx.body = ctx.body.toString();
    }

    // string处理，在</body>之前增加snippet
    if (typeof ctx.body === 'string') {
      // 已经存在livereload.js 则返回
      if (ctx.body.match(/livereload.js/)) return;
      ctx.body = ctx.body.replace(/<\/body>/, snippet + "<\/body>");
    }

    // stream处理，通过模板StreamInjecter处理
    if (ctx.body && typeof ctx.body.pipe === 'function') {
      var injecter = new StreamInjecter({
        matchRegExp : /(<\/body>)/,
        inject : snippet,
        replace : snippet + "$1",
        ignore : /livereload.js/
      });
      var size = +ctx.response.header['content-length'];

      if (size) ctx.set('Content-Length', size + Buffer.byteLength(snippet));
      ctx.body = ctx.body.pipe(injecter);
    }
  });
}
```

应用程序的热更新，现在已经有了很好的选择，如 `koa-webpack` , `nodemon`, `pm2` 等。