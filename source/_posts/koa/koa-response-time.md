---
layout: about
title: Koa系列-Metrics：koa-response-time
date: 2019-03-27 13:30:29
tags: koa
category: Koa
---

总体来说比较简单，主要用到了 `process.hrtime` 这个方法。

```javascript
function responseTime(options) {
  let hrtime = options && options.hrtime;
  return function responseTime(ctx, next) {
    let start = process.hrtime();
    return next().then(() => {
      let delta = process.hrtime(start);
      // delata是纳秒级别的，所以要转微妙
      delta = delta[0] * 1000 + delta[1] / 1000000;
      if (!hrtime) {
        // 转为毫秒
        delta = Math.round(delta);
      }
      ctx.set('X-Response-Time', delta + 'ms');
    });
  };
}
```

参考 [process.hrtime](https://nodejs.org/dist/latest-v10.x/docs/api/process.html#process_process_hrtime_time)