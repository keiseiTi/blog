---
layout: about
title: 每周npm模块源码解读：inherits
date: 2018-12-06 14:02:14
tags: NPM
category: npm
---

**周2018.12.3 ~ 2018.12.9**

##### 前言

模块名：`inherits`

github: https://github.com/isaacs/inherits

描述：一种适用于node和浏览器的继承方法

适合人群：至少看过一遍源码

<!-- more -->

##### 正文

首先是 `require('util')` ,判断 `util.inherits` 是否为函数（判断是否在node环境），如果是，用此方法。

如果不是，throw错误，转而使用在浏览器中的继承方法。

一种是以 `Object.create` 实现继承（寄生组合式继承），另一种是判断 `Object.create` 不能使用时的垫片方法，实现 `Object.create` 的使用（寄生组合式继承）。

**js不同继承方式原理**

###### 原型链

利用原型让一个引用类型继承另一个引用类型的属性和方法

###### 借用构造函数

在子类型构造函数的内部调用超类型构造函数

###### 组合继承

使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承

###### 原型式继承

借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型

###### 寄生式继承

创建一个仅用于封装继承过程的函数，该 函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象

###### 寄生组合式继承

不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。本质上，就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型 的原型

##### 结语

可以从中学习javascript的继承方式

##### 附 `util.inherits` 源码：

```javascript
function inherits(ctor, superCtor) {

  if (ctor === undefined || ctor === null)
    throw new ERR_INVALID_ARG_TYPE('ctor', 'Function', ctor);

  if (superCtor === undefined || superCtor === null)
    throw new ERR_INVALID_ARG_TYPE('superCtor', 'Function', superCtor);

  if (superCtor.prototype === undefined) {
    throw new ERR_INVALID_ARG_TYPE('superCtor.prototype',
      'Function', superCtor.prototype);
  }
  Object.defineProperty(ctor, 'super_', {
    value: superCtor,
    writable: true,
    configurable: true
  });
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
}
```
