---
layout: about
title: Koa系列-i18n：koa-i18n
date: 2019-03-28 14:12:30
tags: koa
category: Koa
---

首先是使用了 `i18n-2` ，这个模块意指被设计给 `Express` 开箱即用。但这个模块是fork了 `i18n` 。所以想要看具体的配置用法，得去搜索 `i18n` 。除此之外，这个中间件必须得搭配 `koa-locale` 一起使用。

首先定义 `LOCALE_METHODS` ,其值的意思是有几种使用 `i18n` 的方式，分别是 `Subdomain` , `Cookie` , `Header` , `Query` , `Url` , `TL` 。

```javascript
const LOCALE_METHODS = [
  'Subdomain',
  'Cookie',
  'Header',
  'Query',
  'Url',
  'TLD'
]
const SET_PREFIX = 'setLocaleFrom'
const GET_PREFIX = 'getLocaleFrom'
```

然后再定义类 `I18n` 继承 `I18n2` ，通过配置选项得到 `modes` 和 `whitelist` 。

<!-- more -->

然后将 `LOCALE_METHODS` 通过循环将 `SET_PREFIX + val` 分别挂载到 `I18n.prototype` 。

```javascript
LOCALE_METHODS.forEach((m) => {
  Object.defineProperty(I18n.prototype, SET_PREFIX + m, {
    value: function () {
      let locale = getLocale(this.request[GET_PREFIX + m]())
      if (locale === this.getLocale()) return true
      if ((locale = filter(locale, this.locales))) {
        this.setLocale(locale)
        debug('Overriding locale from %s : %s', m.toLowerCase(), locale)
        return true
      }
    }
  })
})
```

定义函数 `ial`

在 `app.context` 上定义 `i18n` 属性，其 `get` 函数为类 `I18n` 的实例。
也给 `app.crequest` 上定义了 `i18n` 属性。

最后通过 `whitelist` 筛选出不需要的 `i18n` 。

```javascript
return function i18nMiddleware(ctx, next) {
  ctx.i18n.whitelist.some(key => {
    const customLocaleMethod = typeof key === 'function'
      && ctx.i18n.setLocale(key.apply(ctx))
    if (customLocaleMethod || ctx.i18n[SET_PREFIX + key]()) return true
  })
  return next()
}
```


```javascript
// 注册方法
function registerMethods(helpers, i18n) {
  I18n.resMethods.forEach(method => {
    helpers[method] = i18n[method].bind(i18n)
  })
}
// 得到当前locale值的小写
function getLocale(locale) {
  return (locale || '').toLowerCase()
}
// 筛选locale
function filter(locale, locales) {
  for (const k in locales) {
    if (locale === k.toLowerCase()) {
      return k
    }
  }
}

```