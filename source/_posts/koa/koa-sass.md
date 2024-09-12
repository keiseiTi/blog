---
layout: about
title: Koa系列CSS Preprocessor：koa-sass
date: 2019-03-11 17:39:21
tags: koa
category: Koa
---

```javascript
module.exports = ({ mountAt, src, dest, importPaths = [] }) => {
  // 判断mountAt后缀是否为'/' ，若是则去掉
  mountAt = mountAt.substr(-1) === '/' ? mountAt.slice(0, -1) : mountAt;
  // 同步判断是否存在dest，若不存在则创建
  if (fs.existsSync(dest) === false) {
    fs.mkdirsSync(dest);
  }

  return (ctx, next) => {
    // 解析ctx.path.slice(mountAt.length)
    const subPath = path.parse(ctx.path.slice(mountAt.length));
    // 得到.scss路径
    const srcFile = path.join(src, subPath.dir, subPath.name + '.scss');
    // 判断srcFile是否存在，并且后缀名不能为.css
    if (fs.existsSync(srcFile) === false || subPath.ext !== '.css') {
      return next();
    }
    // 得到目标路径
    const destFile = path.join(dest, subPath.dir, subPath.base);
    // 通过node-sass提供的renderSync返回结果
    const result = sass.renderSync({
      file: srcFile,
      importer: nodeSassGlobImporter(),
      includePaths: importPaths
    });
    // 同步写入
    fs.writeFileSync(destFile, result.css);
    // 最后通过koa-mount koa-static
    return mount(mountAt, serveStatic(dest))(ctx, next);
  };
}
```

首选是判断需要解析的文件，接着解析路径，然后得到源 `.scss` 文件路径，再接着重新得到目标文件路径，然后通过 `node-sass` 提供的renderSync执行 `.scss` 结果。然后写入，最后通过 `koa-mount` 和 `koa-static` 解析静态资源。