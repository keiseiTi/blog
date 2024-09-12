---
layout: about
title: Koa系列-Security：koa-helmet
date: 2018-10-25 21:29:18
tags: koa
category: Koa
---

主要是通过 npm 包 `helemt` 来实现开发者的应用程序更加安全。 

`helemt` 主要是与另一个著名的 node.js Web 应该框架 `Express` 搭配使用。

现在是通过一个函数 `koaHelmetPromisify` 来使用，具体的写法对我来说有点小惊讶，有兴趣的小伙伴可以去看看。


`helment` 通过设置 Http 头来使应用程序更加安全：

`Content-Security-Policy` ：内容安全策略 (CSP) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 (XSS) 和数据注入攻击等。无论是数据盗取、网站内容污染还是散发恶意软件，这些攻击都是主要的手段。([参考1](http://www.ruanyifeng.com/blog/2016/09/csp.html)、[参考2](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP))

<!-- more -->

`X-DNS-Prefetch-Control` ：控制着浏览器的 DNS 预读取功能。 DNS 预读取是一项使浏览器主动去执行域名解析的功能，其范围包括文档的所有链接，无论是图片的，CSS 的，还是 JavaScript 等其他用户能够点击的 URL。([参考1](https://www.cloudxns.net/Support/detail/id/1273.html)、[参考2](https://developer.mozilla.org/zh-CN/docs/Controlling_DNS_prefetching)、[参考3](https://www.jianshu.com/p/c3a14a853c79))

`Expect-CT` ：允许站点选择性报告和/或执行证书透明度 (Certificate Transparency) 要求，来防止错误签发的网站证书的使用不被察觉。当站点启用 Expect-CT 头，就是在请求浏览器检查该网站的任何证书是否出现在公共证书透明度日志之中。([参考1](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Expect-CT)、[参考2](https://httpwg.org/http-extensions/expect-ct.html))

`Feature-Policy` ：标头提供了一种机制，允许和拒绝在其自己的框架中以及嵌入的iframe中使用浏览器功能。([参考1](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy)、[参考2](https://developers.google.com/web/updates/2018/06/feature-policy)、[参考3](https://wicg.github.io/feature-policy/#default-allowlists))

`X-Frame-Options` ：用来给浏览器指示允许一个页面可否在frame, < iframe > 或者 < object > 中展现的标记。网站可以使用此功能，来确保自己网站的内容没有被嵌到别人的网站中去，也从而避免了点击劫持 (clickjacking) 的攻击。([参考](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/X-Frame-Options))

`X-Powered-By` ：表明用于支持当前网页应用程序的技术 (例如：PHP)。([参考](http://www.qttc.net/201306340.html))

`Public-Key-Pins` ：是一种安全功能，它告诉 Web 客户端将特定加密公钥与某个 Web 服务器相关联，以降低使用伪造证书进行 MITM 攻击的风险。([参考1](https://developer.mozilla.org/en-US/docs/Web/HTTP/Public_Key_Pinning)、[参考2](https://imququ.com/post/http-public-key-pinning.html))

`Strict-Transport-Security` ：是一个安全功能，它告诉浏览器只能通过 HTTPS 访问当前资源，而不是 HTTP。([参考1](https://developer.mozilla.org/zh-CN/docs/Security/HTTP_Strict_Transport_Security)、[参考2](https://blog.wilddog.com/?page_id=1493)、[参考3](https://www.cnblogs.com/xiewenming/p/7298893.html))

`X-Download-Options` ：设置 noopen 为阻止 IE8 以上的用户在您的站点上下文中执行下载，指示浏览器不要直接在浏览器中打开下载，而是仅提供“保存”选项。([参考](https://rorsecurity.info/portfolio/new-http-headers-for-more-security))

`Cache-Control` ：通用消息头字段被用于在http 请求和响应中通过指定指令来实现缓存机制。缓存指令是单向的, 这意味着在请求设置的指令，在响应中不一定包含相同的指令。([参考](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control))

`Pragma` ：是一个在 HTTP/1.0 中规定的通用首部，这个首部的效果依赖于不同的实现，所以在“请求-响应”链中可能会有不同的效果。它用来向后兼容只支持 HTTP/1.0 协议的缓存服务器，与 Cache-Control: no-cache 效果一致。强制要求缓存服务器在返回缓存的版本之前将请求提交到源头服务器进行验证。([参考](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Pragma))

`Expires` ：响应头包含日期/时间， 即在此时候之后，响应过期。([参考](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Expires))

`Surrogate-Control` ：通过检查来自源服务器的响应中的缓存头来确定要缓存的内容。([参考1](https://www.w3.org/TR/edge-arch/)、[参考2](https://www.nuevocloud.com/documentation/getting-started/cache-headers-cache-control-surrogate-control-and-expires))

`X-Content-Type-Options` ：被服务器用来提示客户端一定要遵循在 Content-Type 首部中对  MIME 类型 的设定，而不能对其进行修改。这就禁用了客户端的 MIME 类型嗅探行。([参考1](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Content-Type-Options)、[参考2](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85))

`X-Permitted-Cross-Domain-Policies` ：为Web客户端提供了跨域处理数据的权限 (如Adobe Flash或Adobe Acrobat)。([参考](http://www.valencynetworks.com/blogs/x-permitted-cross-domain-policies/))

`Referrer-Policy` ：首部用来监管哪些访问来源信息，会在 Referer 中发送，应该被包含在生成的请求当中。([参考1](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referrer-Policy)、[参考2](https://linux.cn/article-5808-1.html))

`X-XSS-Protection` ：当检测到跨站脚本攻击 (XSS) 时，浏览器将停止加载页面。([参考1](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-XSS-Protection),[参考2](http://www.freebuf.com/articles/web/138769.html))

从这么多的 Http 头中看出，使用 `helemt` 对应用程序的安全性有了极大的保障。但也有一些不是必须的，就可以使用如 `helmet.contentSecurityPolicy` 单独来设置 Http 头。