---
layout: about
title: Koa系列-Analytics：koa-analytics
date: 2019-03-27 14:15:29
tags: koa
category: Koa
---

主要是来收集应用的数据，分析应用的数据。使用了模块 `snippet` 。

并通过 `combined-stream` 将 `ctx.body` 和 分析应用带js的 `html` 文件合并在一起，作为响应。

如果没有 `ctx.body` 和 `content-type !== 'html` 则直接返回