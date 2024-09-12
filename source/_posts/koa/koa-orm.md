---
layout: about
title: Koa系列-Services：koa-orm
date: 2019-01-30 10:25:19
tags: koa
category: Koa
---

主要通过 `sequelize` 和 `squel` 来操作数据库。

参数 `configs` 可以是object或者是array，也就是可以有多个database实例。

`configs` 有一个属性是 `modelPath` ,用来导入 `model`

```javascript
module.exports = (sequelize, modelPath) => {
  const models = {};

  // Bootstrap models
  fs.readdirSync(modelPath) // 得是个文件夹，应该需要判断
    .forEach(function(file) {
      if (/\.js$/.test(file)) {
        const model = sequelize.import(join(modelPath, file));
        models[model.name] = model;
      }
    });

  Object.keys(models).forEach(function(modelName) {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  return models;
};
```

最后导出 `database` ，挂载到 `ctx.orm` 上。