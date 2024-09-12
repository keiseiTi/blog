---
layout: about
title: Koa系列-Documentation：koa-joi-swagger
date: 2018-12-14 11:18:51
tags: koa
category: Koa
---

这个中间件主要是用来搭建 api 文档管理的网站，用到了 `swagger-ui` 作为页面 UI， `joi` 用做管理 js 对象的验证器。

首先是用 `joi.extend` 扩展了对象，字符和数字新的 joi 实例。

然后选择是用 v3 还是 v2 的 `swagger-ui` ，得到最终渲染的模板 html。

最后对描述 api 的内容进行转化，生成验证规则，得到最终的 api 文档管理。

这个中间件挺老了，并且用法也不太方便，而且现在市面上也出现了挺多优秀的 api 文档管理系统。

所以就大概就了解其实现思路。