---
layout: about
title: Koa系列-Session：koa-session
date: 2019-05-08 09:50:54
tags: koa
category: Koa
---


```javascript
module.exports = function(opts, app) {
  // 判断参数类型
  if (opts && typeof opts.use === 'function') {
    [ app, opts ] = [ opts, app ];
  }
  if (!app || typeof app.use !== 'function') {
    throw new TypeError('app instance required: `session(opts, app)`');
  }
  // 格式化选项
  opts = formatOpts(opts);
  // 将 ContextSession 实例挂载到 app.context 上, session 和 sessionOptions 属性也挂载到 app.context
  // 在操作过程中，使用的是 ctx.session ，实际上是对 ContextSession 实例的操作
  extendContext(app.context, opts);

  return async function session(ctx, next) {
    // 实例 ContextSession
    const sess = ctx[CONTEXT_SESSION];
    // 判断是否使用外部的 store
    if (sess.store) await sess.initFromExternal();
    try {
      await next();
    } catch (err) {
      throw err;
    } finally {
      if (opts.autoCommit) {
        await sess.commit();
      }
    }
  };
};
```

<!-- more -->

当设置了 `ctx.session.views = 1` 时，

在类 `ContextSession`中即 `set` 方法：

```javascript
// 设置 session 的值
set(val) {
  // 当val === null 的情况下，清空 session
  if (val === null) {
    this.session = false;
    return;
  }
  if (typeof val === 'object') {
    // use the original `externalKey` if exists to avoid waste storage
    this.create(val, this.externalKey);
    return;
  }
  throw new Error('this.session can only be set as null or an object.');
}
```

类 `ContextSession` ，方法 `get`

```javascript
get() {
  const session = this.session;
  // 已经存在
  if (session) return session;
  // 没有设置
  if (session === false) return null;
  // cookie session store
  if (!this.store) this.initFromCookie();
  return this.session;
}
```

类 `ContextSession` ，方法 `create`

```javascript
create(val, externalKey) {
  debug('create session with val: %j externalKey: %s', val, externalKey);
  // 如果需要外部存储库，如 Redis, MongoDB 或者 DBs ，需要一个外部的key
  if (this.store) this.externalKey = externalKey || this.opts.genid();
  // 一旦重新设置了 会话状态 ,就会实例一个 Session，这个才是用来操作 会话状态
  this.session = new Session(this, val);
}
```

类 `Session` 会话状态模型的作用是操作 会话状态值

```javascript
class Session {
  constructor(sessionContext, obj) {
    // ContextSession实例
    this._sessCtx = sessionContext;
    // ctx
    this._ctx = sessionContext.ctx;
    // 如果没有值，则是第一次的情况
    if (!obj) {
      this.isNew = true;
    } else {
      // 筛选值
      for (const k in obj) {
        // restore maxAge from store
        if (k === '_maxAge') this._ctx.sessionOptions.maxAge = obj._maxAge;
        else if (k === '_session') this._ctx.sessionOptions.maxAge = 'session';
        else this[k] = obj[k];
      }
    }
  }
  ...
  ...
}
```

类 `ContextSession` ，方法 `initFromCookie`

```javascript
// 初始化 session 从 cookie 上
initFromCookie() {
  debug('init from cookie');
  const ctx = this.ctx;
  const opts = this.opts;
  // koa的方法
  const cookie = ctx.cookies.get(opts.key, opts);
  // 不存在去创建
  if (!cookie) {
    this.create();
    return;
  }
  let json;
  debug('parse %s', cookie);
  try {
    // 解析 cookie
    json = opts.decode(cookie);
  } catch (err) {
    debug('decode %j error: %s', cookie, err);
    if (!(err instanceof SyntaxError)) {
      // 清空 cookie 以防下次请求不在出错
      ctx.cookies.set(opts.key, '', opts);
      // ctx.onerror will unset all headers, and set those specified in err
      err.headers = {
        'set-cookie': ctx.response.get('set-cookie'),
      };
      throw err;
    }
    this.create();
    return;
  }
  debug('parsed %j', json);
  if (!this.valid(json)) {
    this.create();
    return;
  }
  this.create(json);
  this.prevHash = util.hash(this.session.toJSON());
}
```

还有三个比较重要的方法

类 `ContextSession` ，方法 `commit`

```javascript
async commit() {
  const session = this.session;
  const opts = this.opts;
  const ctx = this.ctx;
  // 不被允许
  if (undefined === session) return;

  // 移除 session
  if (session === false) {
    await this.remove();
    return;
  }

  const reason = this._shouldSaveSession();
  debug('should save session: %s', reason);
  if (!reason) return;

  if (typeof opts.beforeSave === 'function') {
    debug('before save');
    opts.beforeSave(ctx, session);
  }
  const changed = reason === 'changed';
  await this.save(changed);
}
```

类 `ContextSession` ，方法 `_shouldSaveSession`

```javascript
// 根据规则，判断是否需要存储 session
_shouldSaveSession() {
  const prevHash = this.prevHash;
  const session = this.session;

  // 强制存储
  if (session._requireSave) return 'force';

  // 是新的用户的并且是没有被操作过的就不做任何事
  const json = session.toJSON();
  if (!prevHash && !Object.keys(json).length) return '';

  // 如果 session 已经改变就去存储
  const changed = prevHash !== util.hash(json);
  if (changed) return 'changed';

  //  如果已设置 opts.rolling，就去存储
  if (this.opts.rolling) return 'rolling';

  // 如果 opts.renew 和 session 将要到期，就去存储
  if (this.opts.renew) {
    const expire = session._expire;
    const maxAge = session.maxAge;
    if (expire && maxAge && expire - Date.now() < maxAge / 2) return 'renew';
  }

  return '';
}
```

类 `ContextSession` ，方法 `save`

```javascript
async save(changed) {
  const opts = this.opts;
  const key = opts.key;
  const externalKey = this.externalKey;
  let json = this.session.toJSON();
  // 检查是否到期
  let maxAge = opts.maxAge ? opts.maxAge : ONE_DAY;
  if (maxAge === 'session') {
    opts.maxAge = undefined;
    json._session = true;
  } else {
    json._expire = maxAge + Date.now();
    json._maxAge = maxAge;
  }
  // 存储外部的store
  if (externalKey) {
    debug('save %j to external key %s', json, externalKey);
    if (typeof maxAge === 'number') {
      // 确保 store的过期时间
      maxAge += 10000;
    }
    await this.store.set(externalKey, json, maxAge, {
      changed,
      rolling: opts.rolling,
    });
    if (opts.externalKey) {
      opts.externalKey.set(this.ctx, externalKey);
    } else {
      this.ctx.cookies.set(key, externalKey, opts);
    }
    return;
  }

  debug('save %j to cookie', json);
  json = opts.encode(json);
  debug('save %s', json);

  this.ctx.cookies.set(key, json, opts);
}
```

总结一下：

这是一个管理会话状态的一个 `Koa` 中间件，并且可以引入其他的存储方式，如 `Redis` 和 `MongoDB` 等。

