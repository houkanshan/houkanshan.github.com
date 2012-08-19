---
layout: post
title: "bootstrap+less"
description: "bootstrap+less"
category: 
tags: [bootstrap, less, css]
---
{% include JB/setup %}

##两个感觉：

1. less不是个好东西，它很相对而言更简单
2. bootsrap自己用着就很好~


##less的缺点

自己偶尔发现的，所以肯定也不能说是致命缺点，但是在有诸多css扩展语言的环境下足以影响我对它的好感。。。

### 输出代码冗余：

对于这样结构的less代码：

    .class {
        /* some style */
    }
    .A {
        .class;
        /* other for A */
    }
    .B {
        .class;
        /* other for B */
    }

直觉上就想到这样输出正好可以压缩：

    .class, .A, .B {
        /* some style */
    }

    .A {
        /* other for A */
    }
    .B {
        /* other for B */
    }

然而less预处理器却非要把.class的样式重复三遍输出，纯写css可能还会注意点代码的复用，结果用less的时候想到可以用mixin结果反而比纯写css还多了些没必要的代码。

### import只支持同级目录

毕竟less是支持服务器和客户端编译的，或许很难在客户端应用上目录远程文件的目远程文件的目录结构，所以只能应用同级目录，然而除了调试估计也没谁会让浏览器去编译less，
这就给服务器上管理less文件带来一些麻烦。

### 生成的类名不能在less中复用

碰到的情况是：

    @var: 'css';
    (~" .compiled-@{var}") {
        color: red;
    }
    .use-compiled-css {
        .compiled-css;
    }

只前4行输出的是.compiled-css{...}，(测试的时候如果用客户端的方式编译就直接失败了。)
加上后面的东西后就编译失败。
碰到这个情况的时候本来是想把bootstrap的grid直接作为组件mixin在布局里面的，结果发现grid的span1~12是用代码生成的，这些样式集不能在less中复用。。。


### 官方提供的预处理器太弱

其实上面的问题都出在预处理器上，官方给的预处理器只支持单个文件的单次编译，以bootstrap为例，要做到再linux上watch到reset.less文件的更改后编译boostrap.less输出bootstrap.css到上级目录，
目前似乎只能自己用node写脚本。。。

### mixin的做法容易造成选择器过长

我不知道 “body #nav ul li a” 这样的选择器会造成多大的性能影响，但这种总是可以避免的。

而如果是用滥mixin就很有可能不经意就造成生成了这样的选择器。不过一般代码风格好的人都会注意控制嵌套层次，所以倒还不是大问题~


## bootstrap + less


