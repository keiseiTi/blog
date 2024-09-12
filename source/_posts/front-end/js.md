---
title: js基本知识
date: 2019-05-21 10:22:21
tags: 面试
category: front-end
---


### 防抖和节流

#### 防抖

触发高频事件后 n 秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间。

```javascript
// 这个是用来获取当前时间戳的
function now() {
  return +new Date()
}
/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
function debounce (func, wait = 50, immediate = true) {
  let timer, context, args

  // 延迟执行函数
  const later = () => setTimeout(() => {
    // 延迟函数执行完毕，清空缓存的定时器序号
    timer = null
    // 延迟执行的情况下，函数会在延迟函数中执行
    // 使用到之前缓存的参数和上下文
    if (!immediate) {
      func.apply(context, args)
      context = args = null
    }
  }, wait)

  // 这里返回的函数是每次实际调用的函数
  return function(...params) {
    // 如果没有创建延迟执行函数（later），就创建一个
    if (!timer) {
      timer = later()
      // 如果是立即执行，调用函数
      // 否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params)
      } else {
        context = this
        args = params
      }
    // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
    // 这样做延迟函数会重新计时
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}
```

<!-- more -->

#### 节流

高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率。

```javascript
/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。
 *                                如果想忽略结尾函数的调用，传入{trailing: false}
 *                                两者不能共存，否则函数不能执行
 * @return {function}             返回客户调用函数
 */
_.throttle = function (func, wait, options) {
  var context, args, result;
  var timeout = null;
  // 之前的时间戳
  var previous = 0;
  // 如果 options 没传则设为空对象
  if (!options) options = {};
  // 定时器回调函数
  var later = function () {
    // 如果设置了 leading，就将 previous 设为 0
    // 用于下面函数的第一个 if 判断
    previous = options.leading === false ? 0 : _.now();
    // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    // 获得当前时间戳
    var now = _.now();
    // 首次进入前者肯定为 true
    // 如果需要第一次不执行函数
    // 就将上次时间戳设为当前的
    // 这样在接下来计算 remaining 的值时会大于0
    if (!previous && options.leading === false) previous = now;
    // 计算剩余时间
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 如果当前调用已经大于上次调用时间 + wait
    // 或者用户手动调了时间
    // 如果设置了 trailing，只会进入这个条件
    // 如果没有设置 leading，那么第一次会进入这个条件
    // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
    // 其实还是会进入的，因为定时器的延时
    // 并不是准确的时间，很可能你设置了2秒
    // 但是他需要2.2秒才触发，这时候就会进入这个条件
    if (remaining <= 0 || remaining > wait) {
      // 如果存在定时器就清理掉否则会调用二次回调
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      // 判断是否设置了定时器和 trailing
      // 没有的话就开启一个定时器
      // 并且不能不能同时设置 leading 和 trailing
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
```

### 变量提升\函数提升

js 在正式执行之前先进行了一次预编译，在这个过程中，将变量声明和函数声明提升至当前作用域的最顶端，然后进行接下来的处理。

在 ES6 中，`let` 和 `const` 所声明的变量有暂时性死区，不存在变量提升；并且不能重复已存在的变量，声明变量的作用域是块级的。

**注：同名函数和变量，在提升阶段，函数会覆盖变量，但是会被变量赋值之后覆盖。**

### 作用域

表示变量或函数起作用的区域，指代了它们在什么样的上下文中执行，亦即上下文执行环境。

js 的函数作用域有全局作用域，函数作用域，块级作用域（ES6)。

### 作用域链

是由当前环境与上层环境的一系列作用域共同组成，它保证了当前执行环境对符合访问权限的变量和函数的有序访问。

### 闭包

是指有权访问另一个函数作用域中变量的函数

如：

```javascript
function A() {
  const a = 1;
  return function B(b) {
    return a + b;
  }
}
const b = A();
b(2);
```

[深入贯彻闭包思想，全面理解JS闭包形成过程](https://segmentfault.com/a/1190000009886713#articleHeader2)

### 原型

对于所有对象（`null` 除外）在创建的时候就会与之关联另一个对象，这个对象就是原型，每一个对象都会从原型"继承"属性。

对于函数对象，除了 `__proto__` 属性之外，还有 `prototype` 属性，当一个函数被用作构造函数来创建实例时，该函数的 `prototype` 属性值将被作为原型赋值给所有对象实例（也就是设置实例的 `__proto__` 属性）。

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const person = new Person('person', 13);

console.log(person.__proto__ === Person.prototype); // true

console.log(Person.prototype.Constructor === Person); // true

console.log(person.Constructor === Person); // true
```

> 每个实例的 Constructor 属性指向它的构造函数。
>
> 每个实例的 _proto_ 属性指向它的实例原型。
>
> 每个构造函数的原型的 Constructor 属性指向它的构造函数。

### 原型链

当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。

![alt 原型链](https://user-images.githubusercontent.com/17822028/57208740-ec1e4700-7007-11e9-9f4c-1b13added162.png)

```javascript
// 函数 Object 的原型   函数 Function 的原型
Object.prototype      Function.prototype
// 函数 Object 的 Constructor 属性值是 Function
Object.Constructor === Function
// 函数 Object 的 __proto__ 属性值是函数 Function 的原型
Object.__proto__ === Function.prototype
// 函数 Object 的原型是对象，它没有原型
Object.prototype.__proto__ === null
// 函数 Object 的原型的 Constructor属性是函数 Object
Object.prototype.Constructor === Object
// 函数 Function 的 Constructor 属性值是 Function
Function.Constructor === Function
// 函数 Function 的原型是函数 Function 的原型
Function.__proto__ === Function.prototype
// 函数 Function 的原型的 __proto__ 属性是函数 Object 的原型
Function.prototype.__proto__ === Object.prototype
// 函数 Function 的原型的 Constructor属性是函数 Function
Function.prototype.Constructor === Function
```

### 继承

### new 运算符

`new` 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

`new` 关键字会进行如下的操作：

1. 创建一个空的简单 JavaScript 对象（即 {}）；
2. 链接该对象（即设置该对象的构造函数）到另一个对象 ；
3. 将步骤1新创建的对象作为 `this` 的上下文 ；
4. 如果该函数没有返回对象，则返回 `this`。

```javascript
// ES6
// 借助 Object.setPrototypeOf
function new2(Constructor, ...args) {
  const obj = {};
  Object.setPrototypeOf(obj, Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return typeof result === 'object' ? result : obj;
}
// 借助 Object.create
function new2(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return typeof result === 'object' ? result : obj;
}
// ES5
function new2() {
  var obj = {};
  var Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var result = Constructor.apply(obj, arguments);
  return typeof result === 'object' ? result : obj;
};
```

### 函数参数值传递

ECMAScript 中所有函数的参数都是按值传递的。

也就是说，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样。

[JavaScript深入之参数按值传递](https://github.com/mqyqingfeng/Blog/issues/10)

### this 指向问题

1.`this` 永远指向一个对象

2.`this` 的指向完全取决于函数调用的位置

#### Function.prototype.bind

能显示的将当前函数与指定的对象绑定，并返回一个新函数，这个新函数无论以什么样的方式调用，其 `this` 永远指向绑定的对象。

#### Function.prototype.call 和 Function.prototype.apply

使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。

它们只有一个区别，就是 `call()` 方法接受的是一个参数列表，而 `apply()` 方法接受的是一个包含多个参数的数组。

不过使用 `apply` 和 `call` 的时候仍然需要注意，如果目录函数本身是一个绑定了 `this` 对象的函数，那 `apply` 和 `call` 不会像预期那样执行。

#### ES6箭头函数

箭头函数没有自己的 `this` 绑定。箭头函数中使用的 `this`，其实是直接包含它的那个函数或函数表达式中的 `this`。

### 实现 call、apply、bind

#### call

```javascript
Function.prototype.call2 = function (context) {
  if(context)
  context = context || window;
  context.__fn__ = this;
  var args = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']')
  }
  var result = eval('context.__fn__(' + args + ')');
  delete context.__fn__
  return result
}
// ES6
Function.prototype.call2 = function (context, ...args) {
  context = context || window;
  const fn = Symbol()
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
}
```

#### apply

```javascript
Function.prototype.apply2 = function (context, arr) {
  context = context || window;
  context.fn = this;
  var result;
  if (!arr) {
    result = context.fn();
  }
  else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push('arr[' + i + ']');
    }
    result = eval('context.fn(' + args + ')')
  }
  delete context.fn
  return result;
}
// ES6
Function.prototype.apply2 = function (context,args) {
  context = context || window;
  const fn = Symbol()
  context[fn] = this;
  const result = context[fn](args);
  delete context[fn];
  return result;
}
```

#### bind

```javascript
Function.prototype.bind = function (oThis) {
  if (typeof this !== 'function') {
    // closest thing possible to the ECMAScript 5
    // internal IsCallable function
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }
  var aArgs = Array.prototype.slice.call(arguments, 1);
  var fToBind = this;
  var fNOP = function () { };
  var fBound = function () {
    // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
    var bindArgs = Array.prototype.slice.call(arguments);
    // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
    return fToBind.apply(this instanceof fBound ? this : oThis, aArgs.concat(bindArgs));
  };
  // 维护原型关系
  if (this.prototype) {
    // Function.prototype doesn't have a prototype property
    fNOP.prototype = this.prototype;
  }
  // 下行的代码使fBound.prototype是fNOP的实例,因此
  // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
  fBound.prototype = new fNOP();
  return fBound;
};
```

[JavaScript深入之call和apply的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)
[JavaScript深入之bind的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)

### 深拷贝、浅拷贝问题（immutable是怎么实现的？）

#### 浅拷贝

- `for...in + hasOwnProperty`

- `array.slice`

- `array.concat`

- `[...arr]`

- `object.assign`

- `{...obj}`

`Object.assign` 还有一些注意的点是:

1. 不会拷贝对象继承的属性
2. 不可枚举的属性
3. 属性的数据属性/访问器属性
4. 可以拷贝 Symbol 类型

#### 深拷贝

- `JSON.parse(JSON.stringify(obj))`

通过 `JSON.stringify` 实现深拷贝有几点要注意：

1. 拷贝的对象的值中如果有函数，undefined，symbol 则经过 `JSON.stringify()` 序列化后的 JSON 字符串中这个键值对会消失
2. 无法拷贝不可枚举的属性，无法拷贝对象的原型链
3. 拷贝 Date 引用类型会变成字符串
4. 拷贝 RegExp 引用类型会变成空对象
5. 对象中含有 NaN、Infinity 和 -Infinity，则序列化的结果会变成 null
6. 无法拷贝对象的循环应用

##### 实现深拷贝

```javascript
function clone(source) {
  const target = {};
  for (const i in source) {
    if (source.hasOwnProperty(i)) {
      if (typeof source[i] === 'object') {
        target[i] = clone(source[i]); // 注意这里
      } else {
        target[i] = source[i];
      }
    }
  }
  return target;
}
```

但以上有几个问题。

1. 没有对参数做检验
2. 判断是否对象的逻辑不够严谨
3. 没有考虑数组的兼容
4. 源对象内部 `循环引用` 的问题
5. 当对象中有 `undefined` , `functionn` , `symbol` 等数据类型的时，没有对其做处理

**[lodash深拷贝的实现](https://github.com/lodash/lodash/blob/master/.internal/baseClone.js)**

**[深入探究Immutable.js的实现机制（一）](https://juejin.im/post/5b9b30a35188255c6418e67c)
**[深入探究Immutable.js的实现机制（二）](https://juejin.im/post/5ba4a6b75188255ca1537b19)

### Typed Array

`TypedArray` 对象描述一个底层的二进制数据缓存区的一个类似数组（array-like）视图。

[TypedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

### 0.2 + 0.1 不等于 0.3 问题（浮点数精度）

Javascript 使用 Number 类型表示数字（整数和浮点数），遵循 `IEEE754` 标准通过64位来表示一个数字。

在计算时，计算机无法直接对十进制的数字进行运算，所以先按照 `IEEE754` 的标准转化成相应的二进制，然后进行对阶运算。

```
// 0.1 和 0.2 都转化成二进制后再进行运算
0.00011001100110011001100110011001100110011001100110011010 +
0.0011001100110011001100110011001100110011001100110011010 =
0.0100110011001100110011001100110011001100110011001100111

// 转成十进制正好是 0.30000000000000004
```

精度损失可能出现在进制转化和对阶运算过程中，只要在这两步中产生了精度损失，计算结果就会出现偏差。

[JavaScript 浮点数陷阱及解法](https://github.com/camsong/blog/issues/9)

### 什么是 iterator ？for of ？

遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

Iterator 的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排列；三是 ES6 创造了一种新的遍历命令 `for...of` 循环，Iterator 接口主要供 `for...of` 消费。

Iterator 的遍历过程是这样的。

（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

（2）第一次调用指针对象的 `next` 方法，可以将指针指向数据结构的第一个成员。

（3）第二次调用指针对象的 `next` 方法，指针就指向数据结构的第二个成员。

（4）不断调用指针对象的 `next` 方法，直到它指向数据结构的结束位置。

一个数据结构只要部署了 `Symbol.iterator` 属性，就被视为具有 iterator 接口，就可以用 `for...of `循环遍历它的成员。也就是说，`for...of` 循环内部调用的是数据结构的 `Symbol.iterator` 方法。

`for...of` 循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象（比如 `arguments` 对象、DOM NodeList 对象）、Generator 对象，以及字符串。

[Iterator 和 for...of 循环](http://es6.ruanyifeng.com/#docs/iterator)

### es6 其他特性用过吗？（Class、Map、Set、Decorator 等分别考察）

[阮一峰《ECMAScript6 入 门》](http://es6.ruanyifeng.com/#README)

### promise 实现原理（怎么实现 promise all、race、finally 等？）

```javascript
// Promise.all
Promise.all = function (promiseFns) {
  return new Promise((resolve, reject) => {
    let values = [];
    let count = 0;
    for (let [i, p] of promiseFns.entries()) {
      this.resolve(p).then(res => {
        values[i] = res;
        count++;
        if (count === promiseFns.length) resolve(values)
      }, err => {
        reject(err)
      })
    }
  })
}
// Promise.race
Promise.race = function (promiseFns) {
  return new Promise((resolve, reject) => {
    for (let p of promiseFns) {
      this.resolve(p).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    }
  })
}
// Promise.finally
Promise.prototype.finally = function (cb) {
  return this.then(
    value => Promise.resolve(cb()).then(() => value),
    reason => Promise.resolve(cb()).then(() => { throw reason })
  )
}
```

[剖析Promise内部结构](https://github.com/xieranmaya/blog/issues/3)

### Generator 又是什么？

是 ES6 提供的一种异步编程解决方案，执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

### async await 知识点（await 的作用，async 返回的是什么）

`async` 函数是 Generator 函数的语法糖。

异步变成解决方案，以同步方式写异步代码。

`async` 函数对 Generator 函数的改进，体现在以下四点。

1. 内置执行器
2. 更好的语义
3. 更广的适用性
4. async 返回值是 Promise

### event loop

[参考](https://juejin.im/post/5aab2d896fb9a028b86dc2fd)

### 输入 URL，浏览器的执行过程又是怎么样的？

[参考](https://segmentfault.com/a/1190000013662126?from=timeline)

### v8 垃圾回收机制

[参考](https://yuchengkai.cn/docs/frontend/#v8-%E4%B8%8B%E7%9A%84%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E6%9C%BA%E5%88%B6)

### 堆、栈、队列是什么？都有什么区别？有什么应用？

在 JS 中，栈内存一般储存基础数据类型，堆内存一般储存引用数据类型。

对象放在 heap（堆）里，常见的基础类型和函数放在 stack（栈）里，函数执行的时候在栈里执行。

队列是先进先出的一种数据结构。栈和队列都可以用数组模拟。

栈：

- 存储基础数据类型
- 按值访问
- 存储的值大小固定
- 由系统自动分配内存空间
- 空间小，运行效率高
- 先进后出，后进先出

堆:

- 存储引用数据类型
- 按引用访问
- 存储的值大小不定，可动态调整
- 主要用来存放对象
- 空间大，但是运行效率相对较低
- 无序存储，可根据引用直接获取
