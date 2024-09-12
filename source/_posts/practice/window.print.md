---
layout: about
title: window.print -> 浏览器打印
date: 2019-05-14 10:49:38
tags: 
---

## 问题描述

这是一个 `React` 单页项目。

需求是需要打印页面的某一部分内容。

之前是别人写的，具体办法是将该部分内容取出来，通过 `document.innerHTML = 打印内容` ， 然后调用 `window.print` 方法，最后是通过 `location.reload` 刷新页面。

但由于打印操作结束后，需要刷新页面，对用户体验不好，故此放弃这种方法。

```html
<div id='preview'>打印内容</div>
```

```javascript
document.body.innerHTML = document.getElementById('preview').innerHTML;
window.print();
location.reload();
```

**注：**

为什么不将 `document.body` 先赋值给个变量，等打印结束后再重新赋值给 `document.body` ？

这是因为，在 `React` 组件上声明的事件最终绑定到了 `document` 这个 `dom` 节点上。所以将 `document.body` 先赋值给个变量之后再赋值给 `document.body`，实际上已经没有了 `React 事件` ，之后的页面操作都将无效。

<!-- more -->

## 如何解决

我的解决思路是，新建一个浏览器窗口，将内容和样式都复制到新的窗口上进行打印。

```javascript
// 新建一个浏览器窗口
const printViewWin = window.open('', 'printView');
// 得到打印内容
const str = this.createPrintHtml();
// 通过 document.write 将内容写入到文档中
printViewWin.document.write(str);
// 关闭向当前文档的数据写入
printViewWin.document.close();

/*
 * 因为使用的 webpack ，所以会有生产和开发环境
 * 在开发环境中，所有的样式都将以 <style> 的形式展示
 * 而在生成环境中，则将样式分类到不同的 <link> 中
 * 并且需要用到 window.onload
 * 这是因为需要等待 link 的样式文件下载完成后才可以去执行 window.print，不然没有打印样式
 * window.print 能阻塞页面其他操作
 * 点击 取消/打印，关闭该页面，返回原页面
 */
function createPrintHtml(){
  let str
  if (process.env.NODE_ENV === '"development"') {
    // 获取全部 <style>
    str = "<!DOCTYPE html><head><meta charset='utf-8'>" + 
      '<script>window.onload=function(){window.print();window.close()}</script>' + 
      '<style>' +
      Array.from(window.document.querySelectorAll('style')).map(n => n.innerText).join('') +
      '</style></head><body>' +
      window.document.getElementById('preview').innerHTML +
      '</body></html>';
  } else {
    // 获取全部 <linkn>
    str = "<!DOCTYPE html><head><meta charset='utf-8'>" + 
      '<script>window.onload=function(){window.print();window.close()}</script>' +
      window.document.head.innerHTML.match(/href="(.*?)"/gi).filter(_ => _.endsWith('css"')).map(n => n.slice(6)).map(n => n.slice(0, -1)).map(_ => `<link rel="stylesheet" type="text/css" href="${location.origin + _}" >`).join('') +
      '</head><body>' +
      window.document.getElementById('preview').innerHTML +
      '</body></html>';
  }
  return str
}
```

## 小结

为什么不使用 `ref` 来获取打印内？

可以使用。但还是直接获取 `dom` 节点 。因为在这个需求中，只需要得到打印内容，不需要对组件进行其他操作。

`document.write` 可以将写入的字符中按 `HTML` 解析，然后需要手动关闭文档流。

`document.write` 的使用问题？

在此场景中，`document.write` 可以去使用。但也可以使用 `appendChild` 等方法，将样式和内容注入到新窗口的文档中。