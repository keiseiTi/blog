---
layout: about
title: Koa系列-Body Parsing：koa-bodyparser
date: 2018-11-03 14:48:54
tags: koa
category: Koa
---

具体的 body 解析是基于模块 `co-body` ，而 `co-body` 是对模块 `raw-body` 更高级的封装。

首先是对配置项的操作，如自定义 JSON 检测函数 `detectJSON` ，自定义错误处理函数 `onerror` 等。

默认接受的请求类型是 `json` 和 `form` ，只有在能接受的类型下才可以执行下一步。

比较重要的一点是将选项 `returnRawBody` 默认为 true 且不能修改，是因为要返回的是解析后的值。

<!-- more -->

接着分别处理 `json` 、 `form` 和 `text` 的配置选项。然后与用户定义的 `extendTypes` 进行合并。

最后通过 `co-body` 进行处理。

该模块是对 `co-body` 进行封装以便在 koa2 中使用。在配置选项上比 `co-body` 的更加丰富。总体来说比较简单，但还是有疑问在。

为什么要对 `opts.detectJSON` ，`opts.onerror` 赋值给 `detectJSON` , `onerror` 之后重新赋值 `detectJSON` 。是因为后续对 `opts` 的操作不会不影响这两个函数吗？