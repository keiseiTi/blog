---
title: html基本知识
date: 2019-04-20 11:22:21
tags: 面试
category: front-end
---

### 元素

HTML 是一种描述 Web 文档结构和语义的语言；它由元素组成，每个元素可以有一些属性。网页中的内容通过 HTML 元素标记，如 `<img>` 、`<title>` 、`<p> ` 、`<div>` 等等。

#### 根元素

`<html>`

#### 文档元数据

元数据（Metadata）含有页面的相关信息，包括样式、脚本及数据，能帮助一些软件（例如 搜索引擎、浏览器 等等）更好地运用和渲染页面。对于样式和脚本的元数据，可以直接在网页里定义，也可以链接到包含相关信息的外部文件。


`<base>` , `<head>` , `<meta>` ,`<link>` , `<style>` , `<script>`

<!-- more -->

#### 分区根元素

`<body>`

#### 内容分区

内容分区元素允许你将文档内容从逻辑上进行组织划分。使用包括页眉(header)、页脚(footer)、导航(nav)和标题(h1~h6)等分区元素，来为页面内容创建明确的大纲，以便区分各个章节的内容。

`<main>` , `<aside>` , `<article>` , `<nav>` , `<section>` , `<header>` , `<footer>` , `<h1>` , `<h2>` , `<h3>` , `<h4>` , `<h5>` , `<h6>` , `<address>` 

#### 文本内容

使用 HTML 文本内容元素来组织在开标签 `<body>` 和闭标签 `</body>` 里的块或章节的内容。这些元素能标识内容的宗旨或结构，而这对于 accessibility 和 SEO 很重要。

`<blockquote>` , `<div>` , `<dl>` , `<dt>` , `<dd>` , `<figcaption>` , `<figure>` , `<hr>` , `<main>`  , `<p>` , `<pre>` , `<ul>` , `<li>` , `<ol>`

#### 内联文本语义

使用 HTML 内联文本语义（Inline text semantics）定义一个单词、一行内容，或任意文字的语义、结构或样式。

`<a>` , `<abbr>` , `<b>` , `<bid>` , `<bdo>` , `<br>` , `<cite>` , `<code>` , `<data>` , `<dfn>` , `<em>` , `<i>` , `<kbd>` , `<mark>` , `<q>` , `<ruby>` ,  `<rb>` , `<rp>` , `<rt>` , `<rtc>` , `<s>` , `<samp>` , `<small>` , `<span>` , `<strong>` , `<sub>` , `<sup>` , `<time>` , `<u>` , `<var>` , `<wbr>`

#### 图片和多媒体

HTML 支持各种多媒体资源，例如图像，音频和视频。

`<map>` , `<area>` , `<img>` , `<audio>` , `<video>` , `<track>`

#### 内嵌内容

常规的多媒体内容，HTML 可以包括各种其他的内容，即使它并不容易交互。

`<souce>` , `<picture>` , `<object>` , `<params>` , `<iframe>` , `<embed>`

#### 脚本

为了创建动态内容和 Web 应用程序，HTML 支持使用脚本语言，最突出的就是 JavaScript。某些元素支持此功能。

`<canvas>` , `<noscript>` , `<script>`

#### 编辑标识

这些元素能标示出某个文本被更改过的部分。

`<del>` , `<ins>`

#### 表格内容

这里的元素用于创建和处理表格数据。其他元素在 table 元素中可以出现一个或者更多。

`<table>` , `<caption>` , `<colgroup>` , `<col>` , `<thead>` , `<tbody>` , `<tr>` , `<th>` , `<td>` , `<tfoot>`

#### 表单

HTML 提供了许多可一起使用的元素，这些元素能用来创建一个用户可以填写并提交到网站或应用程序的表单。

`<button>` , `<datalist>` , `<fieldset>` , `<legend>` , `<form>` , `<label>` , `<meter>` , `<select>` , `<optgroup>` , `<option>` , `<output>` , `<progress>` , `<select>` , `<textarea>`

#### 交互元素

HTML 提供了一系列有助于创建交互式用户界面对象的元素。

`<details>` , `<summary>` , `<dialog>` , `<menu>` , `<menuitem>` (实验性)

#### Web 组件

Web 组件是一种与 HTML 相关联（HTML-related）的技术，简单来说，它允许创建自定义元素，并如同普通的 HTML 一样使用它们。此外，你甚至可以创建经过自定义的标准 HTML 元素。

`<template>` , `<slot>`


### 行内元素与块级元素

**内容**

一般情况下，行内元素只能包含数据和其他行内元素。

而块级元素可以包含行内元素和其他块级元素。这种结构上的包含继承区别可以使块级元素创建比行内元素更”大型“的结构。

**格式**

默认情况下，行内元素不会以新行开始，而块级元素会新起一行。

#### 行内元素

`<b>` , `<i>` , `<small>` 

`<abbr>` , `<cite>` , `<code>` , `<dfn>` , `<em>` , `<kbd>` , `<strong>` , `<samp>` , `<var>` 

`<a>` , `<br>` , `<img>` , `<map>` , `<object>` , `<q>` , `<script>` , `<span>` , `<sub>` , `<sup>` 

`<button>` , `<input>` , `<label>` , `<select>` , `<textarea>`

#### 块级元素

`<article>` , `<aside>` , `<audio>` , `<canvs>` , `<figure>` , `<figcaption>` , `<header>` ，`<footer>` , `<hgroup>` ，`<output>` , `<section>` ，`<video>`

`<address>` , `<blockquote>` ,  `<dl>` , `<dd>` , `<div>` , `<fieldset>` ，`<form>` ,  `<h1>` , `<h2>` , `<h3>` , `<h4>` , `<h5>` , `<h6>`  `<hr>` , `<noscript>` , `<ol>` , `<ul>` , `<p>` ,  `<pre>`  , `<table>`


### 属性

#### 常见属性

`accept` ：服务器接受内容或文件类型的列表。 

`action` ：表单信息提交的url地址，指向进行处理的程序。

`alt` ：在图片无法呈现时的替代文本。

`async` ：加载和渲染后续文档元素的过程将和 script.js 的加载与执行并行进行（异步）。

`autocomplete` ：表示该表单中是否可以由浏览器自动完成填值。

`autofocus` ：在网页加载后该元素应该自动聚焦。

`autoplay` ：audio或video应该自动播放。

`charset` ：申明该页面或脚本的字符编码。

`checked` ：指出该元素在页面加载后是否处于选中状态。

`content` ：标签 meta 的 http equiv或 name 关联的值。

`defer` ：加载后续文档元素的过程将和 script.js 的加载并行进行（异步），但是 script.js 的执行要在所有元素解析完成之后，DOMContentLoaded 事件触发之前完成。

`disabled` ：表示用户是否可以与元素交互。

`language` ：定义元素中使用的脚本语言。

`name` ：元素的名称。多用于 form。

`placeholder` ：向用户提供可在该字段中输入的内容的提示。

`readonly` ：用于指明用户无法修改控件的值。

`pattern` ：检查控件值的正则表达式。

`selected` ：定义将在页面加载时选择的值。

`src` ：可嵌入内容的URL。

`target` ：该属性指定在何处显示链接的资源。

`type` ：定义元素的类型。

`value` ：定义页面加载时，在元素内显示的默认值。

`height` ：元素的高度，适用于 canvas 等。

`width` ：元素的宽度，适用于 canvas 等。

`href` ：关联资源的URL。

`rows` ：定义textarea中的行数。

`rowspan` ：定义表格单元格应跨越的行数。

`colspan` ：定义表格单元格应跨越的列数。

`max` ：表示允许的最大值。

`mix` ：表示允许的最小值。

`maxlength` ：定义元素中允许的最大字符数。

`multiple` ：指示用户能否输入多个值。这个属性仅在type属性为email或file的时候生效。

`required` ：指示是否需要填写此元素。

#### 全局属性

`accesskey` ：提供了为当前元素生成键盘快捷键的提示。这个属性由空格分隔的字符列表组成。浏览器应该使用在计算机键盘布局上存在的第一个。

`autocapitalize` ：控制用户的文本输入是否和如何自动大写。

`class` ：一个以空格分隔的元素的类名（classes）列表，它允许 CSS 和 Javascript 通过类选择器 (class selectors) 或 DOM 方法 (document.getElementsByClassName) 来选择和访问特定的元素。

`contenteditable` ：一个枚举属性（enumerated attribute），表示元素是否可被用户编辑。 如果可以，浏览器会调整元素的部件（widget）以允许编辑。

`data-*` ：自定义数据属性，它赋予我们在所有 HTML 元素上嵌入自定义数据属性的能力，并可以通过脚本(一般指JavaScript) 与 HTML 之间进行专有数据的交换。

`dir` ：一个指示元素中文本方向的枚举属性。

`draggable` ：一种枚举属性，指示是否可以 使用 Drag and Drop API 拖动元素。

`dropzone` (实验性) ：枚举属性，指示可以使用Drag and Drop API在元素上删除哪些类型的内容。

`hidden` ：布尔属性，隐藏对应元素，即 display: block 。

`id` ：定义唯一标识符（ID），该标识符在整个文档中必须是唯一的。

`is` ：允许您指定标准HTML元素应该像已注册的自定义内置元素一样。

`itemid` ：是元素的唯一的全局标识符。itemid 属性只能为同时拥有 itemscope 和 itemtype 的元素指定。同时，itemid 只能为拥有 itemscope 的元素指定。

`itemprop` ：被用于向一个物体中添加属性。

`itemref` ： 提供了元素 id（并不是 itemid）的列表，并带有文档其它地方的额外属性。itemref 属性只能在指定了 itemscope 的元素上指定。

`itemscope` ：一个元素的 itemscope 属性会创建一个项，包含了一组与元素相关的键值对。

`itemtype` ：将会用于定义数据结构中的 itemprop（条目属性）。itemscope 用于设置词汇的生效范围，其中词汇在数据结构中由 itemtype 设置。

`lang` ：定义元素语言。这个语言是不可编辑元素写入的语言，或者可编辑元素应该写入的语言。

`slot` (实验性) ：将一个 shadow DOM shadow 树中的槽分配给一个元素， 带有 slot 属性的元素分配给由 `<slot>` 创建的槽，它的 name 属性的值匹配 slot 属性的值。

`spellcheck` (实验性) ：是否可以检查元素的拼写错误。

`style` ：含要应用于元素的CSS样式声明。

`tabindex` ：示其元素是否可以聚焦，以及它是否/在何处参与顺序键盘导航。

`title` ：包含表示与其所属元素相关信息的文本。当鼠标悬停在元素上面时，提示框显示的文本。

`translate` (实验性) ：被用来规定对应元素的属性值及其子文本节点内容，是否跟随系统语言作出对应的翻译变化。

除了这些属性之外，还存在以下全局属性

- xml:lang 和 xml:base ——两者都是从XHTML规范继承，但为了兼容性而被保留的。

- 多重aria-*属性，用于改善可访问性。

- 事件处理程序属性：onabort, onautocomplete, onautocompleteerror, onblur, oncancel, oncanplay, oncanplaythrough, onchange, onclick, onclose, oncontextmenu, oncuechange, ondblclick, ondrag, ondragend, ondragenter, ondragexit, ondragleave, ondragover, ondragstart, ondrop, ondurationchange, onemptied, onended, onerror, onfocus, oninput, oninvalid, onkeydown, onkeypress, onkeyup, onload, onloadeddata, onloadedmetadata, onloadstart, onmousedown, onmouseenter, onmouseleave, onmousemove, onmouseout, onmouseover, onmouseup, onmousewheel, onpause, onplay, onplaying, onprogress, onratechange, onreset, onresize, onscroll, onseeked, onseeking, onselect, onshow, onsort, onstalled, onsubmit, onsuspend, ontimeupdate, ontoggle, onvolumechange, onwaiting。


### 其他

HTML的媒体支持：audio 和 video 元素，WebM 和 MPEG H.264 AAC 编码格式被支持较好。
