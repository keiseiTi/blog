---
layout: about
title: 每周npm模块源码解读：anywhere
date: 2018-10-17 22:20:38
tags: NPM
category: npm
---

**周2018.10.15 ~ 2018.10.21**

##### 前言

模块名：`anywhere`

github: https://github.com/JacksonTian/anywhere

描述：随时随地将你的当前目录变成一个静态文件服务器的根目录

适合人群：至少看过一遍源码

<!-- more -->

##### 正文
 
首先使用了模块 `minimist` 来解析参数。有两个参数是默认的，一个是端口号，另一个是静态文件的当前目录。

接着使用了模块 `connect` ，使用了两个中间件：

`serve-static` : 默认把 `process.cwd` 作为静态目录，以及请求该目录下 `index.html` 。

`serve-index` : 如果该目录下没有 `index.html` 文件，则将该目录下的文件列表作为请求返回值。

确定http端口号，以及https的端口号。得到当前ip的地址，或者是‘127.0.0.1’作为主机名。

创建http服务器，确定https服务器。

最后自动打开浏览器。

##### 结语

实用方便的一个静态服务器。
在做完静态页面的时候，想在手机上测试，就使用到了它，通过局域网，在手机上就能访问到了本地的文件。
但这个包可以做的更好。