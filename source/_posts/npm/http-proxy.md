---
layout: about
title: 每周npm模块源码解读：http-proxy
date: 2018-9-30 21:50:09
tags: NPM
category: npm
---

**补 周2018.9.24 ~ 2018.9.30**

##### 前言

模块名：`http-proxy`

github: https://github.com/nodejitsu/node-http-proxy

描述：是一个http代理库并支持websocket。适用于反向代理和负载均衡

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

在函数 `ProxyServer` 上定义属性并赋值为代理的实例。当使用 `http-proxy` 时，类 `ProxyServer` 会继承 `EventEmitter3` ，选项 `perpendPath` 默认为true。

定义了类属性 `web` 、`proxyRequest` 、 `ws` 和 `proxyWebsocketRequest` 并赋值为创建正确的代理函数（web,websocket）。

定义类属性 `webPasses` 和 `wsPasses` ，分明是web和websocket的pass集合。

接着注册了一个 `error` 的监听器。以及5个类方法。

方法 `onError` ：在触发 `error` 事件时，执行的此方法。

方法 `listen` ：创建一个http、https或者websocket的服务器。

方法 `close` ：关闭服务器接着去执行回调。

方法 `before` 和 `after` ：去判断默认的passes是否存在传入的passName，若不存在则报错。

用户可以选项来选择是http,https或者是websocket。以http举例：

当用户开启代理，发起请求，会执行一个自定义函数。选项中的 `target` 和 `forward` 的值会被解析。接着去执行每一个pass。

`deleteLength` ：如果请求方法为delete或者options并且请求头’content-length‘存在，则将’content-length‘赋值为‘0’，并且删除请求头属性‘transfer-encoding’。

`timeout` ：设置了选项 `timeout` ，则会去判断该请求是否超时。

`Xheaders` ：设置了选项 `xfwd` 为 true，则会在请求头中添加‘x-forwarded-for’、‘x-forwarded-port’、‘x-forwarded-proto’和‘x-forwarded-host’属性。

`stream` ：在此方法中通过流，执行代理。判断选项是否有 `forward` ，有则定义一个 `http.request` ，然后创建 `forwardError` ，接着将请求或者选项中的 `buffer` 用流的方式去传入这个请求。

新建一个已 `target` 的 `http.request` ，注册事件 `socket` ，判断选项的 `proxyTimeout` ，来设置代理超时执行函数。

注册事件 `aborted` ，创建 `proxyError` 错误处理函数。将请求或者选项中的 `buffer` 用流的方式去传入这个 `proxyReq` 请求。

注册 `respone` 事件，并在该事件触发时，执行回调。判断响应是否存在 `headersSent` 和 选项中的 `selfHandleResponse` ，如分明为不存在或者为false，则执行 `webOutcgoing` 里的passes。

最后通过流传送响应值，关闭连接。

##### 结语

不太复杂，但涉及到了http,https,websocket，有很多值得学习的点，如代理的‘x-forwarded’等。这个模块是7年前就开始了，还是有一些写法让小白迷惑。

除基本类型外，js一切皆为对象。

