---
layout: post
title: "bootstrap读后感"
description: "bootstrap读后感"
category: 
tags: [bootstrap, less, css]
---
{% include JB/setup %}


### 文件内容

#### bootstrap.less 

编译入口，加载所有less文件


####reset.less 

底层模块，基本没有less语法

与YUI相比没有margin:0; padding:0, 有html5标签,
只处理了一部分浏览器的默认样式，主要跟据新的标准对移动设备上的表单做了reset,
因为实际上具体的样式已经在其他模块定义好了，所以这里只需要统一一些重要的样式和解决一些浏览器bug即可


####variables.less

定义颜色，字体，icon，grid的配置变量


####mixins.less

定义基本样式单元，用于组合。包括基本布局(block-center, ie-inline-block), block形状，placeholder，text-overflow, 图片上hide-text,
font-family, CSS3样式, 渐变背景样式，组件基本样式：nav-divide, button-bg, popoverArw, Grid, 一些组件在定义时声明了namespace
（还有些看不懂要干嘛）


####scaffolding.less

29行，scaffolding听起来很吓人但其实这里只定义了body和a的样式


####grid.less

6行， 使用了mixins.less定义的grid组件中的.core和.fluid分别对应default grid system和fluid grid system. 


####layout.less

定义了.container 和 .container-fluid 一个是定宽，一个是fluid的

####type.less

用官方的话来说叫typography，算是排版？reset里没定义的h\*, ul/ol, dl等都在这里设置了样式


####code.less

顾名思义了，这里不明白为什么block-code的样式用pre而不是code. 难道code标签只是用于inline-code的

里面有个跨浏览器的pre样式，现在好像差不多都是这样写的：

    white-space: pre;       /* for ie6, 空格\t\n有效，不会边界自动换行, 与pre标签效果类似 */
    white-space: pre-wrap;  /* IE8, FF3.0, Opera8.0, Safari3.0, 加上了边界换行, 对non-CJK还是分词换行, CJK按字直接换行*/
    word-break: break-all;  /* IE5+ 其他不清楚，对non-CJK在边界上直接字母间打断换行 */
    word-wrap: break-word;  /* FF3.5, chrome1.0, IE5.5 Opera10.5, Safari1.0, non-CJK会优先分词换行，如果换行后还是超长，就会直接打断*/


####form.less

表单样式，不是很想看。。。不要随便改懂就好。。。


####table.less

表格样式，还是使用了大量:first-child, :last-child选择器去控制


####utilities.less
bootstrap.less里最后import的是这个，这里放了一些控制显示的组件，主要是用于js操作页面元素的。
之所以放最后应该是为了提升优先级，比如display:none/block，是很容易被优先级覆盖的。

很多网站有一个base.css的文件，里面除了reset和基本样式外还放了left,right,hidden这样的控制组件
实际上在实际控制的时候会出现优先级不够导致属性被覆盖的问题。不知道他们是怎么处理这个的。


####other

剩下的sprites.less, dropdown.less, wells.less, component-animations.less, 
buttons.less, button-groups.less, alerts.less, nav.less等等都顾名思义了，都主要是样式的定义。
使用的技巧光看也看不出什么。。。


###感觉 

其实平时用bootstrap也不多，一方面觉得它丑(我总是对很多东西有非常奇怪的审美，见谅。。。), 另一方面是不喜欢他的使用方式。
我并不指望用css工具厍的方式来完全屏蔽浏览器差异，bootstrap就没有做到，css更应该是模块化而不是组件化(我也不知道我在说什么，个人感觉这两者主要是粒度的差异)。
要想靠一个个class组合成一个效果局限性太大，我看过的用bootstrap作出来的网站，要么一看就知道是用bootstrap做出来的，要么只是用了它的一些布局组件和基本样式(button, table.etc)。
如果要bootstrap的样式与自定的样式混用的话，恐怕管理起来会很不方便，还不如全部自己写。毕竟css+html不是可执行代码，想把程序的复杂逻辑用在它上面是没有用的。


bootstrap就拿来做原型吧，毕竟css+html是处在设计和代码之间的东西，不能单纯用两者中的某种思考方式去考虑css+html。


以上，请指责。

