---
title: css基本知识
date: 2019-05-06 11:22:21
tags: 面试
category: front-end
---

### CSS盒模型

盒模型分为 W3C 标准盒模型和 IE 盒模型。

#### W3C标准盒模型

```
属性 width，height 只包含内容 content，不包含 border 和 padding。
```

#### IE盒模型

```
属性 width，height 包含 border 和 padding，指的是 content + padding + border。
```

#### box-sizing属性

```
是用来控制元素的盒子模型的解析模式，默认为 content-box
content-box：W3C 的标准盒子模型，设置元素的 height/width 属性指的是 content 部分的高/宽
border-box：IE 传统盒子模型，设置元素的 height/width 属性指的是 content + border + padding 部分的高/宽
```

**注意：**

- 编写页面代码时应尽量使用标准的W3C模型（需在页面中声明 DOCTYPE 类型），这样可以避免多个浏览器对同一页面的不兼容。

- 因为若不声明 DOCTYPE 类型，IE浏览器会将盒子模型解释为 IE 盒子模型，FireFox 等会将其解释为 W3C 盒子模型；若在页面中声明了 DOCTYPE 类型，所有的浏览器都会把盒模型解释为 W3C 盒模型。

<!-- more -->

### CSS选择器有哪些？

```
元素选择器   // elementname（元素名称）
类选择器   // .classname（类名）
ID选择器   // #idname（ID名）
通配选择器   // *
属性选择器   // [属性=值]
相邻兄弟选择器   // A + B
普通兄弟选择器   // A ~ B
子选择器   //  A > B
后代选择器   // A B 
伪类选择器   // :hover，:not等
```

[不建议使用通配选择器，因为它是性能最低的一个 CSS 选择器](http://www.stevesouders.com/blog/2009/06/18/simplifying-css-selectors/)

### 选择器的优先级

优先级的计算首先是 **选择器权重** 的优先级计算，然后是 **声明先后顺序** 的优先级计算。

由于 CSS 来源有多种，所以浏览器需要一种方法来确定哪些样式应该应用于给定的元素。为此，浏览器使用一个名为 特殊性 **（specificity）** 的公式，它计算选择器中使用的标记、类、id 和属性选择器的数值，以及 `!important` 声明的数值。

通过内联 `style` 属性在元素上定义的样式被赋予一个等级，该等级优先于 `<style>` 块或外部样式表中的任何样式。如果 Web 开发人员使用 `!important` 某个值，则该值将胜过任何 CSS，无论其位置如何，除非还有 `!important` 内联。

同一级别的个数，数量多的优先级高，假设同样即比较下一级别的个数。至于各级别的优先级例如以下：

**!important > 内联 > ID > 类 > 标签 | 伪类 | 属性选择 > 伪对象 > 通配符 > 继承**

选择器的特殊性由选择器本身的组件确定，特殊性值表述为5个部分：

`!important` ，`Style attribute` ，`ID` ，`Class,pseudo-class attribute` ，`Elements`

(1)、对于选择器中给定的各个 !important 属性值，加 1，0，0，0，0 。

(2)、对于元素内联样式 style 属性值，加 0，1，0，0，0 。

(3)、对于选择器中给定的各个 ID 属性值，加 0，0，1，0，0 。

(4)、对于选择器中给定的各个类属性值、属性选择器或伪类，加 0，0，0，1，0 。

(5)、对于选择器中给定的各个元素和伪元素，加 0，0，0，0，1 。伪元素是否具有特殊性？在这方面CSS2有些自相矛盾，不过CSS2.1很清楚的指出，伪元素具有特殊性，而且特殊性为 0，0，0，0，1，同元素特殊性相同。

(6)、结合符(+ > [] ^= $= 等等特殊符号)和通配符(*)对特殊性没有任何贡献，此外通配符的特殊性为 0，0，0，0，0。全是 0 有什么意义呢？当然有意义！子元素继承祖先元素的样式根本没有特殊性，因此当出现这种情况后，通配符选择器定义的样式声明也要优先于子元素继承来的样式声明。因为就算特殊性是0，也比没有特殊性可言要强。

**注意：**

W3C文档[选择器权重的计算](https://www.w3.org/TR/selectors/#specificity-rules)。

    A selector’s specificity is calculated for a given element as follows:

    1. count the number of ID selectors in the selector (= A)
    2. count the number of class selectors, attributes selectors, and pseudo-classes in the selector (= B)
    3. count the number of type selectors and pseudo-elements in the selector (= C)
    ignore the universal selector

    If the selector is a selector list, this number is calculated for each selector in the list. For a given matching process against the list, the specificity in effect is that of the most specific selector in the list that matches.

### link引入样式和@import的区别

#### 从属关系的区别
`@import` 是 CSS 提供的语法规则，只有导入样式表的作用；`link` 是 HTML 提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。

#### 加载顺序区别
加载页面时，`link` 标签引入的 CSS 被同时加载；`@import` 引入的 CSS 将在页面加载完毕后被加载。

#### 兼容性区别
`@import` 是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别；`link` 标签作为 HTML 元素，不存在兼容性问题。

#### DOM可控性区别
可以通过 JS 操作 DOM ，插入 `link` 标签来改变样式；由于 DOM 方法是基于文档的，无法使用 `@import` 的方式插入样式。

#### 权重区别
`link` 引入的样式权重大于 `@import` 引入的样式。

### Flexbox（弹性布局）

该布局模型的目的是提供一种更加高效的方式来对容器中的条目进行布局、对齐和分配空间。在传统的布局方式中，block 布局是把块在垂直方向从上到下依次排列的；而 inline 布局则是在水平方向来排列。弹性盒布局并没有这样内在的方向限制，可以由开发人员自由操作。

采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称"项目"。

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做 `main start` ，结束位置叫做 `main end` ；交叉轴的开始位置叫做 `cross start` ，结束位置叫做 `cross end`。

项目默认沿主轴排列。单个项目占据的主轴空间叫做 `main size` ，占据的交叉轴空间叫做 `cross size` 。

#### 容器属性

**flex-direction**：决定了主轴的方向，默认值是 row 。

```
row：主轴方向为水平方向，起点在左端；
row-reverse：主轴方向为水平方向，起点在右端
column：主轴方向为竖直方向，起点在上端
column：主轴方向为竖直方向，起点在下端
```

**flex-wrap**：决定容器内项目是否可换行，默认值 nowrap 。

```
nowrap：不换行，项目尺寸会随之调整
wrap：超出换行，且第一行在上方
wrap-reverse：超出换行，且第一行在下方
```

**flex-flow**：是 flex-direction 和 flex-wrap  的简写，其默认值为row nowrap 。

**justify-content**：定义了项目在主轴上的对齐方式，默认值为 flex-start 。

```
flex-start：左对齐
flex-end：右对齐
center：居中
space-between：两端对齐，把剩余空间等分成间隙
space-around：每个项目两侧的间隔相等
```

**align-items**：定义了项目在交叉轴上的对齐方式，默认值为 stretch 。

```
stretch：如果项目没有设置高度或者为auto，将占满整个容器的高度
flex-start：交叉轴起点对齐
flex-end：交叉轴终点对齐
center：中点对齐
baseline：项目的第一行文字的基线对齐
```

**container**：定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用，默认值为 stretch 。。

```
flex-start：与交叉轴的起点对齐。
flex-end：与交叉轴的终点对齐。
center：与交叉轴的中点对齐。
space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
stretch：轴线占满整个交叉轴。
```

#### 项目属性

**order**：定义项目在容器中的排列顺序，数值越小排列越靠前，默认值为0。

**flex-basis**：定义了在分配多余空间之前，项目占据主轴空间，浏览器根据这个属性，计算主轴是否有多余空间，默认值为auto，即项目本身的宽高。

**flex-grow**：定义项目的放大比例，默认值为0，即若果存在剩余空间，也不放大。

**flex-shrink**：定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。

**flex**：是 flex-grow 、flex-shrink 、flex-basis 三个属性的缩写。

**align-self**：允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性。默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch 。

### grid（网格布局）

CSS 网格布局引入了二维网格布局系统，可用于布局页面主要的区域布局或小型组件。

网格是一组相交的水平线和垂直线，它定义了网格的列和行。我们可以将网格元素放置在与这些行和列相关的位置上。

CSS网格布局具有以下特点：

- 固定的位置和弹性的轨道的大小节

- 元素位置

- 创建额外的轨道来包含元素

- 对齐控制

- 控制重叠内容

采用网格布局的区域，称为"容器"（container）。容器内部采用网格定位的子元素，称为"项目"（item）。

#### 容器属性

**grid-template-columns**：定义每一列的列宽。

**grid-template-rows**：定义每一行的行高。

（1）`repeat` 函数，该函数的作用是，简化重复的值，也可以重复某种模式。如： 

`grid-template-columns: 100px 100px 100px` = `grid-template-cloumns:repeat(3, 100px)` 。

（2）`autofill` 关键字，如果希望每一行（或每一列）容纳尽可能多的单元格，这时可以使用auto-fill关键字表示自动填充。如：

最外层容器宽度 `1000px` ，`grid-template-columns: repeat(autofill ,200px)` 。表示每列宽度 `200px`，然后自动填充，直到容器不能放置更多的列。

（3）`fr` 关键字，表示行与列的比例关系，如：

`grid-template-columns: 1fr 2fr 1fr` 。表示该行分为 `3` 列。第二列的宽度是第一列和第四列的2倍。

`fr` 也可以跟长度单位搭配使用，如：

`grid-template-cloumns：100px 1fr 2fr` 。表示第一行的宽度为 `100px` ，剩余的宽度，第三行占了 `2/3` ，第二行占了 `1/3` 。

（4）`minmax` 函数，该函数的作用是产生一个长度范围，表示长度就在这个范围之中。它接受两个参数，分别为最小值和最大值，如：

`grid-template-columns: 1fr 1fr minmax(100px, 1fr)` 。表示第三列的宽度大于等于 `100px` ，小与等于 `1fr` 。

（5）`auto` 关键字， 表示由浏览器自己决定长度。

`grid-template-columns: 100px auto 100px` 。第二列的宽度，基本上等于该列单元格的最大宽度，除非单元格内容设置了 `min-width` ，且这个值大于最大宽度。

（6）网格线名称，`grid-template-columns` 属性和 `grid-template-rows` 属性里面，还可以使用方括号，指定每一根网格线的名字，方便以后的引用，如：

`grid-template-columns: [c1] 100px [c2] 100px [c3] auto`

**grid-cloumns-gap**：表示列的间距。

**grid-rows-gap**：表示行的间距。

**grid-gap**：`grid-column-gap` 和 `grid-row-gap`的合并简写形式，`grid-grap: <grid-row-gap> <grid-column-gap>` 。

```
根据最新标准，上面三个属性名的 grid-前缀 已经删除，
grid-column-gap 和 grid-row-gap 写成 column-gap 和 row-gap ，grid-gap 写成 gap 。

chrome66就已经支持该标准。
```

**grid-template-area**：用于定义区域。

**grid-auto-flow**：行与列的项目的顺序，默认值为 row。

```
row: 先行后列
column：先列后行
row dense 和 column dense：用于某些项目指定位置以后，剩下的项目怎么自动放置。
```

**justify-items**：设置单元格内容的水平位置（左中右）。

**align-items**：设置单元格内容的垂直位置（上中下）。

```
start：对齐单元格的起始边缘。
end：对齐单元格的结束边缘。
center：单元格内部居中。
stretch：拉伸，占满单元格的整个宽度（默认值）。
```

**place-items**：属性是 `align-items` 属性和 `justify-items` 属性的合并简写形式。

`place-items: <align-items> <justify-items>` ，如果省略第二个值，则浏览器认为与第一个值相等。

**justify-content**：是整个内容区域在容器里面的水平位置（左中右）。

**align-content**：是整个内容区域的垂直位置（上中下）。

```
start：对齐容器的起始边框。
end：对齐容器的结束边框。
center：容器内部居中。
stretch：项目大小没有指定时，拉伸占据整个网格容器。
space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍。
space-between：项目与项目的间隔相等，项目与容器边框之间没有间隔。
space-evenly：项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔。
```

**place-content**：属性是 `align-content` 属性和 `justify-content` 属性的合并简写形式。

`place-content: <align-content> <justify-content>` ，如果省略第二个值，则浏览器认为与第一个值相等。

**grid-auto-columns** 和 **grid-auto-rows** ：

`grid-auto-columns` 属性和 `grid-auto-rows` 属性用来设置，浏览器自动创建的多余网格的列宽和行高。
它们的写法与 `grid-template-columns` 和 `grid-template-rows` 完全相同。
如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高。

**grid-template**：是 `grid-template-columns` 、`grid-template-rows` 和 `grid-template-areas` 这三个属性的合并简写形式。

**grid**：是 `grid-template-rows` 、`grid-template-columns` 、`grid-template-areas` 、 `grid-auto-rows` 、`grid-auto-columns` 、 `grid-auto-flow` 这六个属性的合并简写形式。

#### 项目属性

**grid-column-start** ， **grid-column-end** ， **grid-row-start** ， **grid-row-end** ：

项目的位置是可以指定的，具体方法就是指定项目的四个边框，分别定位在哪根网格线。

```
grid-column-start属性：左边框所在的垂直网格线
grid-column-end属性：右边框所在的垂直网格线
grid-row-start属性：上边框所在的水平网格线
grid-row-end属性：下边框所在的水平网格线
```

这四个属性的值还可以使用 `span` 关键字，表示"跨越"，即左右边框（上下边框）之间跨越多少个网格。

使用这四个属性，如果产生了项目的重叠，则使用 `z-index` 属性指定项目的重叠顺序。

**grid-column**：是 `grid-column-start` 和 `grid-column-end` 的合并简写形式。

**grid-row**：是 `grid-row-start` 属性和 `grid-row-end` 的合并简写形式。如何使用，

```
.item-1 {
  grid-column: 1 / 3;
}
// 表示项目 .item-1 占据从第一根列线和第三个根列线。
```

这两个属性之中，也可以使用span关键字，表示跨越多少个网格。

斜杠以及后面的部分可以省略，默认跨越一个网格。

**grid-area**：指定项目放在哪一个区域。还可用作 `grid-row-start` 、`grid-column-start` 、`grid-row-end` 、`grid-column-end` 的合并简写形式，直接指定项目的位置。

```
.item {
  grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
}
```

**justify-self**：设置单元格内容的水平位置（左中右），跟 `justify-items` 属性的用法完全一致，但只作用于单个项目。

**align-self**：设置单元格内容的垂直位置（上中下），跟 `align-items` 属性的用法完全一致，也是只作用于单个项目。

```
start：对齐单元格的起始边缘。
end：对齐单元格的结束边缘。
center：单元格内部居中。
stretch：拉伸，占满单元格的整个宽度（默认值）。
```

如果省略第二个值，place-self属性会认为这两个值相等。

### BFC

BFC（Block formatting context）直译为"块级格式化上下文"。它是一个独立的渲染区域，只有 Block-level box 参与， 它规定了内部的 Block-level Box 如何布局，并且与这个区域外部毫不相干。

布局规则如下：

```
内部的盒会在垂直方向一个接一个排列（可以看作 BFC 中有一个的常规流）
处于同一个 BFC 中的元素相互影响，可能会发生 margin collapse
每个元素的 margin box 的左边，与容器块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此
BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然
计算 BFC 的高度时，考虑 BFC 所包含的所有元素，连浮动元素也参与计算
浮动盒区域不叠加到 BFC 上
```

### 参考

- [浏览器解析 CSS 样式的过程](https://segmentfault.com/a/1190000018717319#articleHeader0)
- [真正理解"CSS选择器的优先级"](https://juejin.im/post/5abc4fd7f265da237b2228ee)
- [【CSS基础】Flex弹性布局](https://segmentfault.com/a/1190000013612496)
- [CSS Grid 网格布局教程](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)
- [BFC 神奇背后的原理](http://www.cnblogs.com/lhb25/p/inside-block-formatting-ontext.html)
