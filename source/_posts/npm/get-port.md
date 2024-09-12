---
layout: about
title: 每周npm模块源码解读：get-port
date: 2018-12-10 23:11:15
tags: NPM
category: npm
---

**周2018.12.10 ~ 2018.12.16**

##### 前言

模块名：`get-port`

github: https://github.com/sindresorhus/get-port

描述：随即找到一个可用的端口或则检查端口是否可以使用

适合人群：至少看过一遍源码

<!-- more -->

##### 正文
 
首先根据 `option` 来判断是判断端口是否可用还是随机得到一个可用的端口。

```
module.exports = options => options ?
  getPort(options).catch(() => getPort({port: 0})) :
  getPort({port: 0});
```

`options.port` 的类型得为数字或者数组，如果不是，也可以进行 `getPort({port: 0}))` 。

但会出现一个错误即是 `UnhandledPromiseRejectionWarning` 。

最后是通过函数`isAvailable` 来得到或者判断端口可否使用。

函数 `getPort`

```javascript
const getPort = (options = {}) => new Promise((resolve, reject) => {
  if (typeof options.port === 'number') {
    options.port = [options.port];
  }
  <!-- 操作端口号 -->
  options.port.reduce((seq, port) => {
    return seq.catch(() => {
      return isAvailable(Object.assign({}, options, {port}))
        .then(port => port)
        .catch(Promise.reject.bind(Promise));
    });
  }, Promise.reject()).then(resolve).catch(reject);
});
```


##### 结语

学习了node模块net的使用。