---
layout: post
title: "CSS & HTML 笔记"
description: "CSS & HTML 笔记"
category: 
tags: ['css', 'html']
---
{% include JB/setup %}

----------------------------

There is no emotion, there is peace.

----------------------------

##HTML

### quotation (HTML4)

`<q>` for inline (short) quotations.   
`<blockquote>` for specifies a section that is quoted from *another* source

### font-style (HTML4)

`<em>`	Renders as emphasized text  
`<strong>`	Defines important text  
`<dfn>`	Defines a definition term  
`<code>`	Defines a piece of computer code  
`<samp>`	Defines sample output from a computer program  
`<kbd>`	Defines keyboard input  
`<var>`	Defines a variable  
`<i>` tag can be used to indicate a technical term, a phrase from another language, a thought, or a ship name, etc.  

These Element-style has nothing special except the **font**

### document change (HTML4)
`<ins>` tag defines a text that has been inserted into a document.  
`<del>` tag defines text that has been **deleted(replaced)** from a document.  
`<s>` element is redefined in HTML5, and is now used to define text that is **no longer correct**.(注意del和s的区别)  
`<mark>` tag defines marked text.  

### form
`<label>` both using `for` attribute or just include `input` tag will work.  

### other HTML4
`<cite>` defines the title of a work   
`<bdo>`  used to override the current text direction.  

### other HTML5
`<figcaption>` tag defines a caption for a `<figure>` element.  
`<hgroup>` element is used to group a set of `<h1>` to `<h6>` elements, when a heading has multiple levels (subheadings)(主标题\副标题).  
`<keygen>` tag specifies a key-pair generator field used for forms.(用于不对称加密)  
`<output>` tag represents the result of a calculation (like one performed by a script).   
`<time>` tag defines either a time (24 hour clock), or a date in the Gregorian calendar, optionally with a time and a time-zone offset.  
`<wbr>` Word Break Opportunity specifies where in a text it would be ok to add a line-break.  

----------------------

## CSS 

> 以下是*CSS: The Definition Guide*的读书笔记

### 第48页

属性选择器：

`[foo^="bar"]`   bar开头

`[foo$="bar"]`   bar结尾

`[foo*="bar"]`   有bar字串

`[foo~="bar"]`   有bar单词

`[foo|="bar"]`   有bar或者bar-开头

`[foo="bar"]` 无法选择 `<div foo="bar other">`,

=只能是精确选择 `[foo="bar other"]`

支持： IE6不支持以上的‘子串’选择器

另：IE6不支持 \> 和 + 选择器

-------------------------------------------

a的伪类：

:link   *未访问*链接

:visited: 访问过链接

:focus: 输入焦点

:hover: 指针停留

:active: 输入激活元素

LoveHate 中间插入 focus

------------------------------------------------------

伪类：

`LoVeHAte, focus, first-child, :lang()`

伪类可结合, `:link:hover`

伪元素：

`first-line, first-letter, before, after`

伪元素是会创造一个伪的元素并选择，伪类只选择不创造

伪元素的可用属性是有限的。P67



### 第76页

应用到body元素的背景样式可以传递到html元素，反向继承了，是特例。

html没有背景时，body的background被html拿走，body不渲染background。

字体是会继承的，因此要小心

`body, table, th, td {font-size: .8em}  // 继承bug这里说的不是很清楚 P77`

这样的写法，会导致更小的size。

`CSS2 中 内联 与 id 同权重。 CSS2.1中，内联在ID后一位(1,0,0,0)`



### 第99页

inherit是唯一共有的关键字。(但仍不能把他当成默认属性来用)



### 第110页

bolder是设置一个最接近当前weight的更粗的字体，如果没有更粗，就是最接近的数值(+100至900)，如果weight计算的是200，而下一个weight值是300，那bolder就是300。

如果200是最粗的了，那么bolder后就是300，且表现没有区别.

缩放失控：

`ul { font-size: .8em; }`

如果存在ul的嵌套，就会导致越来越小。

-----------------------------------------------------

font-size:

x-large, xx-large, x-small, xx-small, large, small, medium

都是绝对的大小，存在一个缩放因子以medium为基准计算大小，

缩放因子通常是1.5或1.0~1.2

medium是默认字体大小，浏览器统一，与标签无关。

------------------------------------------------------

font-weight 控制粗细 支持number

font-style 有normal, italic(斜体), oblique(倾斜文本), 

font-variant 只有一个特殊关键字就是 small-caps -> 小型大写字母

font-stretch 字体拉伸, 不支持number， 在chrome上测试不支持

font-size-adjust 当不是首选字体时，乘这个值 / 可用字体的方面值(普遍不支持)

------------------------------------------------------

`font: [[ <font-style> || <font-variant> || <font-weight>]?<font-size>[/<line-height>]?<font-family>] | caption | icon | menu | message-box | small-caption | status-bar | inherit`

`||` 表示1个或多个

`|`  表示单选

font-size 相对父元素计算，line-height 相对font-size计算

直接用font设置时，忽略的属性全会被重置。

使用后面的caption, icon...时，会根据用户系统设置应用字体。

-------------------------------

字体匹配：

1 打开字体数据库

2 构建字体属性列表，首先选择font-family，根据，如果完全匹配(属性满足)就使用，否则：

  1 首先根据font-style匹配，没有则失败(这个可以计算，应该不会失败)

  2 根据font-variant匹配，应该也不会失败，不支持的浏览器应该会直接忽略(不确定)

  3 根据font-weight匹配，转数字的问题，不会失败

  4 根据font-size匹配，客户端会有一个错误范围的限制

3 未匹配，就在在font-family中找下一个

4 找完了还是没有，就搜索另一个候选的font-family

5 还是没有找到，选择默认字体，使其尽可能正常显示





### 第136页

text-indent: 内部inline元素首行缩进

块级元素（显然因为inline是没有宽度的）

百分比相对于块的宽度计算

*可继承*: 对百分比的处理是，直接继承计算值。而不是百分比值(不会再计算)。

--

text-align: 

块级元素（block才有宽度）

可继承

--  

line-height: inline-box的高度

所有元素: 

百分比相对于font-size计算

可继承: 对em和百分比将继承计算值，对number将直接继承，也就是会再计算

--

verical-align

行内元素和 表 单元格

不可继承

百分比相对于line-height计算

baseline: 元素的baseline与父元素的baseline对齐，没有baseline的(图片、表单、其他替换元素)，底端对齐

sub, super: 相对baseline下降、上升

bottom: inline-box的底端与line-box底端对齐

text-bottom: 让bottom只对文本有效，非文本将生成一个由父元素font-size得到的文本框，再底端对齐

middle: inline-box的中点与父元素baseline上方0.5ex对齐，通常1ex==.5em。准确的应该是x-height的值。

`<percentage>`: baseline(或替换元素的底)与父元素的baseline升高(+)或降低(-) line-height * 百分比

`<length>`: baseline(或替换元素的底)与父元素的baseline升高(+)或降低(-) length

由`<percentage><length>`设置的对齐会导致line-box的高度变化

--

word-spacing, letter-spacing: 

可继承，将继承计算值，不会再计算

不能为percentage，因为没有分母

指定letter-spacing后text-aligin就不会影响letter间隔

指定了word-spacing还是可能会受text-align的影响(待确定)

--

text-transform



### 第161页

white-space:

    normal              去掉多余的空格，\n换成\s，在边界换行

    pre                    \s 不被忽略（空格和回车），边界不换行

    nowrap              去掉多余空格，\n换成\s，边界不换行

    pre-wrap (2.1)  保留\n, 空格合并, 边界换行

    pre-line   (2.1)   \s全保留，边界换行

------------------------------------- origin ---------------------------------------

normal

This value directs user agents to collapse sequences of white space, and break lines as necessary to fill line boxes.

pre

This value prevents user agents from collapsing sequences of white space. Lines are only broken at preserved newline characters.

nowrap

This value collapses white space as for 'normal', but suppresses line breaks within text.

pre-wrap

This value prevents user agents from collapsing sequences of white space. Lines are broken at preserved newline characters, and as necessary to fill line boxes.

pre-line

This value directs user agents to collapse sequences of white space. Lines are broken at preserved newline characters, and as necessary to fill line boxes.





### 第171页

width, margin-left, margin-right, padding-left, padding-right, border-right, border-left

他们的计算值必须等于父节点的宽度(margin-right的等级最低)



对width, margin-left, margin-right:

0 个 auto:

如果属性都设置为非auto值，即 overconstrained ，margin-right就会被强制设为auto

1 个 auto:

对从左向右读的语言

margin-left, width, 中有一个设置为auto，其他全为定值，那么auto值将会填充父节点

2 个 auto:

2个margin为auto, 居中

margin+width为auto， width填满，margin为0

3 个 auto:

margin为0， width填满

总之就是：

margin-left可以定位，

width会尽量填满，

margin-right起到约束width的为auto时的填满作用

（还是不准确）

margin的percentage是根据width计算的。



### 第189页

匿名文本：未包含在行内元素中的文本，等价于外部设置了一个虚拟的`<line>`标签

block元素的margin有效，会撑开行框。可见inline-box是不会与内部的margin合并的。

（注意block在inline是不规范的，这里可以考虑inline-block和img）

inline的margin-left/right也不会合并

inline元素不存在margin-top，所以inline的margin无效，inline内的inline即使设置margin，由于无效，所以也撑不开。

行内框 -\> line-height

内容区 -\> font-size

行间距 -\> line-height - font-size / 2 (行间距可以为负数)

inline-block, img元素的baseline是box的底部(margin-bottom以下)



### 第270页

background-postion

定位是相对于padding的内边界，但是内容会延伸到margin的内边界

两个关键字，水平(left, right)、垂直(top, bottom)，如果出现了一个关键字，则认为另一个是center。

`<percentage>`

前水平，后垂直，定位方式为：背景图片的a%, b% 位置与容器区域的a%, b%对齐，造成了0%, 0%在左上角，100%, 100%在右下角(而不是溢出)

--

background-attachment:

scroll (default)

fixed (注意是相对可视域定位而不是容器)

inhert



### 第291页

浮动一个‘简单的’非替换元素，必须有width，否则默认会压缩元素使之 -> 0

规则：

1 浮动元素的top不能超出

2 float:left的left不成超出left，float:right的right不能超出right

3 浮动元素之间不能重合（BFC）

4 浮动元素的顶端不能比之前所有浮动元素或者block元素的顶端更高(浮动元素也会形成行框，可以假设这个行框是0高的)（这条就造成ABC，AB左浮，C右浮，B换行了，C不能与A同高）

5 浮动元素不能超出之前包含浮动元素的行框的顶端，（即浮动元素不会堆到段落上面，同时文本不能完全被浮动元素挤掉，否则浮动元素就得挤到下一行）。

6 尽可能高

7 尽可能浮left/right

(6,7主要对换行，通常的行为是，垂直位置先挤到下一行，低于前一个浮动，水平位置上再向左/右平移，不能再上移/下移)

---

不可滥用浮动



### 第301页

float + 负margin

对文档中文本产生的效果不确定。(待测试)



### 第302页

浮动元素在满足规则的情况下重叠时：

1 inline-box 与 float 重叠， border, text, background 在 float 之上

2 box 与 float 重叠，border, background 在 float 之下， text 在之上

--

clear

引入一个清除区域(clearance), 来排斥浮动元素



### 第309页

relative的containing block还是原来的block，它是相对自己的

absolute的containing block是相对于最近的absolute，relative父节点，或者根

--

absolute是相对于内容区，不相对padding



### 第327页

top / bottom / left / right :

auto 元素的这个属性会保持static状态的值(优先级更低，比如left: auto, right: 1px, 那就是到右边了，left: auto, right: auto就是保持原位了)

--

left + margin-left + border-left-width + padding-left + width + padding-right + border-right-width + margin-right + right = ContainingBlockWidth

![width](https://docs.google.com/drawings/pub?id=13E7NLY3v93cEOLr3JSYdMz-4KmtdXYYfK3CSQQ4y-rE&w=1440&h=700)

--

如果left, width, right均为auto，那么会得到左边界原位，width收缩到合适。

--

如果，left, right, width均为定值(必须满足, 否则还是定位)，那么margin: 0 auto;的时候可以居中。(abosolute会形成块级元素，relative不会)

--

如果，left, right同时不为auto，则将left优先。（过度受限）

如果left，margin-left同时有，将会在基础上算margin，参见上面的公式。

如果left, margin-right同时有，将不会增加margin，因为right是auto的(或者过度受限)

---

垂直定位方式与水平类似。

而且由于脱离了文档流(相当于拥有了独立的垂直空间，与水平情况下的block元素类似)可以用margin: auto 0;来居中。



    .vertical-center {

      position: absolute;

      top: 0;  // not auto

      bottom: 0; // not auto

      margin: auto 0;

    }



--

对于可替换元素，区别就在于他的height和width在auto的情况下是默认为原始大小的。

（对于block而言，width: auto会使他填满区域）

所以可以直接margin: 0 auto来居中，不需要设置width。

在absolute的情况下，也可以直接margin: auto 0;来垂直居中。

（垂直下，对于非替换元素，top/bottom: 非auto会拉伸height，再看下面规则）

------------------

非替换元素

如果width/height为auto，他们的长度会尽量填充(优先级低于margin, padding, left/right, 他会被他们压缩)

对替换元素

如果width/height为auto，他们的长度会为初始长度(不会尽量拉伸)

-------------------



### 第338页

z-index: 

relative，absolute都有 CSS3中有opacity，

--

auto: 不建立新的层叠上下文(z-index:0)，与父级相同。

非auto: 指定了z-index就会创建*自己的*叠放上下文。所有子元素设置的z-index都将会在这个z-index级别内。就是9, -100， 8, 1; 这样的东西的结果是9里面的-100就是在8里面的1上面~

对于body下的z-index, 因为body不会创建叠放上下文，且z-index:0, 那么如果一个z-index: -1; 就应该会在body之下。同时由于2.1要求：元素不会叠放在其叠放上下文的背景之下。

注意：

[http://www.w3.org/TR/CSS2/visuren.html#z-index](http://www.w3.org/TR/CSS2/visuren.html#z-index)

The root element forms the root stacking context. Other stacking contexts are generated by any positioned element (including relatively positioned elements) having a computed value of 'z-index' other than 'auto'. 

--

[http://www.w3.org/TR/CSS2/visuren.html#z-index](http://www.w3.org/TR/CSS2/colors.html#background-properties)

user agents must instead use the computed value of the background properties from that element's first HTML "BODY" element or XHTML "body" element child when painting backgrounds for the canvas, and must not paint a background for that child element. 

情况是由于body设置的background被html拿去了，而body没有了。而html作为root element存在一个stacking context，因此这时z-index: -1000是不会被遮盖的(实际上在body后面)。

而如果同时设置了body和html的background，那么z-index: -1000就会被body的background挡住了！

----

好乱。。。就自己看吧。。

