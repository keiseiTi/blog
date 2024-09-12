---
layout: about
title: Koa系列-Routing and Mounting：koa-router
date: 2019-5-29 14:00:24
tags: koa
category: Koa
---

    在 Node 应用中，路由是一个很重要的概念。

    路由用于确定应用程序如何响应对特定端点的客户机请求，包含一个 URI（或路径）和一个特定的 HTTP 请求方法（GET、POST 等）。

    每个路由可以具有一个或多个处理程序函数，这些函数在路由匹配时执行。

在 koa 中， `koa-router` 是一个功能丰富支持 `restful` 的路由中间件。

`koa-router` 有两个构造函数分别是 `Router` 和 `Layer` 。

函数 `Router` 是用来创建路由。

```javascript
function Router(opts) {
  // 如果是直接调用函数，则也会实例 Router
  if (!(this instanceof Router)) {
    return new Router(opts);
  }
  // 支持前缀
  this.opts = opts || {};
  // 请求方法
  this.methods = this.opts.methods || [
    'HEAD',
    'OPTIONS',
    'GET',
    'PUT',
    'PATCH',
    'POST',
    'DELETE'
  ];

  this.params = {};
  // 路由层集合
  this.stack = [];
};
```

<!-- more -->

然后是将每个 http 方法挂载到构造函数 Router 的原型上

```javascript
methods.forEach(function (method) {
  Router.prototype[method] = function (name, path, middleware) {
    var middleware;
    // 判断参数用来确定 name , path , middleware
    if (typeof path === 'string' || path instanceof RegExp) {
      middleware = Array.prototype.slice.call(arguments, 2);
    } else {
      middleware = Array.prototype.slice.call(arguments, 1);
      path = name;
      name = null;
    }
    // 来注册一个新的路由层
    this.register(path, [method], middleware, {
      name: name
    });

    return this;
  };
});
```

这样可以通过 `route.get('/',...)` 来实现对该路径的注册。

在 `koa-router` 中使用路由中间件也是很简单的，跟 `koa` 的使用方式一致，即通过 `use` 。

```javascript
Router.prototype.use = function () {
  var router = this;
  var middleware = Array.prototype.slice.call(arguments);
  var path;
  // 支持对不同路径的中间件形式
  if (Array.isArray(middleware[0]) && typeof middleware[0][0] === 'string') {
    middleware[0].forEach(function (p) {
      // 通过 apply 改变 this 指向，将多路径中间件转化成单路径中间件形式
      router.use.apply(router, [p].concat(middleware.slice(1)));
    });

    return this;
  }

  ...
  // 具体执行
  ...

  return this;
};
```

`koa-router` 也提供两个中间件分别为 `routes` 和 `allowedMethods` 。

函数 `routes` 用来匹配 `request url` 。

```javascript
Router.prototype.routes = Router.prototype.middleware = function () {
  var router = this;
  var dispatch = function dispatch(ctx, next) {
    debug('%s %s', ctx.method, ctx.path);
    var path = router.opts.routerPath || ctx.routerPath || ctx.path;
    // 匹配路径和请求方法相同的 router
    var matched = router.match(path, ctx.method);
    var layerChain, layer, i;

    ...
    ...

    if (!matched.route) return next();

    ...
    ...

    // 找到已匹配到的路由层
    layerChain = matchedLayers.reduce(function(memo, layer) {
      memo.push(function(ctx, next) {
        // 对 layer 做处理
        ctx.captures = layer.captures(path, ctx.captures);
        ctx.params = layer.params(path, ctx.captures, ctx.params);
        ctx.routerName = layer.name;
        return next();
      });
      // 把 layer 的中间件也推入其中
      return memo.concat(layer.stack);
    }, []);
    // 最后通过 koa-compse 执行一系列函数
    return compose(layerChain)(ctx, next);
  };

  dispatch.router = this;

  return dispatch;
};
```

函数 `allowedMethods` 是用来确认请求方法，以及当不满足时自定义错误处理

函数 `register` 是用来注册路由。

```javascript
Router.prototype.register = function (path, methods, middleware, opts) {
  opts = opts || {};
  var router = this;
  var stack = this.stack;
  // 支持数组路径
  if (Array.isArray(path)) {
    path.forEach(function (p) {
      router.register.call(router, p, methods, middleware, opts);
    });
    return this;
  }
  // 创建路由
  var route = new Layer(path, methods, middleware, {
    end: opts.end === false ? opts.end : true,
    name: opts.name,
    sensitive: opts.sensitive || this.opts.sensitive || false,
    strict: opts.strict || this.opts.strict || false,
    prefix: opts.prefix || this.opts.prefix || "",
    ignoreCaptures: opts.ignoreCaptures
  });
  
  ...
  ...

  stack.push(route);
  return route;
};
```

函数 `Layer` 用来初始化路由层。

```javascript
function Layer(path, methods, middleware, opts) {
  // opts 是被用来 path-to-regexp 的选项
  this.opts = opts || {};
  // 路由名称
  this.name = this.opts.name || null;
  // 该路由支持的 http verbs
  this.methods = [];
  // 路由匹配参数
  this.paramNames = [];
  // 中间件
  this.stack = Array.isArray(middleware) ? middleware : [middleware];
  // 该路由 http 方法支持 GET ，则天剑 HEAD
  methods.forEach(function(method) {
    var l = this.methods.push(method.toUpperCase());
    if (this.methods[l-1] === 'GET') {
      this.methods.unshift('HEAD');
    }
  }, this);

  // 确保中间件都是函数
  this.stack.forEach(function(fn) {
    var type = (typeof fn);
    if (type !== 'function') {
      throw new Error(
        methods.toString() + " `" + (this.opts.name || path) +"`: `middleware` "
        + "must be a function, not `" + type + "`"
      );
    }
  }, this);
  // 需要匹配的请求路径
  this.path = path;
  // 通过 pathToRegExp 将路径转化成正则
  this.regexp = pathToRegExp(path, this.paramNames, this.opts);

  debug('defined route %s %s', this.methods, this.opts.prefix + this.path);
};
```

除此之外， 构造函数 `Layer` 提供 `setPrefix` , `param` , `url` , `captures` , `params` , `match` 等方法，用来处理实际的请求路径及对应方法。

总结一下， `koa-router` 提供了较为丰富的实际使用方式，可以对应很多不同的场景，是值得在 koa 应用中使用的。