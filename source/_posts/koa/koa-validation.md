---
layout: about
title: Koa系列-Middleware：koa-validation
date: 2019-06-20 10:05:26
tags: koa
category: Koa
---

`koa-validation` 可以用来验证请求体的内容格式。具体的验证是通过 `Joi` 来实现。

现在来看一下源码吧。

```javascript
module.exports = (schema = {}) => {
  // 判断在 schema 中是否有 opt
  const { opt = {} } = schema;
  // 通过 lodash.defaultsDeep 合并配置选项
  const options = _.defaultsDeep(opt, {
    allowUnknown: true,
  });
  return async (ctx, next) => {
    const defaultValidateKeys = ['body', 'query', 'params'];
    // 找到需要验证的字段
    const needValidateKeys = _.intersection(defaultValidateKeys, Object.keys(schema));
    const errors = [];
    needValidateKeys.find((item) => {
      // 找出验证的对象
      const toValidateObj = item === 'body' ? ctx.request.body : ctx[item];
      // 验证内容
      const result = Joi.validate(toValidateObj, schema[item], options);
      // 验证失败
      if (result.error) {
        errors.push(result.error.details[0]);
        return true;
      }
      // 验证成功继续验证
      _.assignIn(toValidateObj, result.value);
      return false;
    });

    if (errors.length !== 0) {
      throw new ValidationError(errors);
    }
    await next();
  };
};
```

<!-- more -->

除此之外还有一个自定义验证错误 `ValidationError`。

确实不复杂，但是建议单独使用 `Joi` 会更灵活。