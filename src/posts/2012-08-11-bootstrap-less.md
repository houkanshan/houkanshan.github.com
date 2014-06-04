### 两个感觉：
1. less不是个很好的东西 2. bootsrap结合less自己用着就挺好~  
      


### less的缺点
自己偶尔发现的，所以肯定也不能说是致命缺点，但是在有诸多css扩展语言的环境下足以影响我对它的好感。。。

#### 输出代码冗余：

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

#### import只支持同级目录

毕竟less是支持服务器和客户端编译的，或许很难在客户端应用上目录远程文件的目远程文件的目录结构，所以只能应用同级目录，然而除了调试估计也没谁会让浏览器去编译less，
这就给服务器上管理less文件带来一些麻烦。

#### 生成的类名不能在less中复用

碰到的情况是：

    @var: 'css';
    (~" .compiled-@{var}") {
        color: red;
    }
    .use-compiled-css {
        .compiled-css;
    }

只前4行输出的是.compiled-css\{...\}，(测试的时候如果用客户端的方式编译就直接失败了。)
加上后面的东西后就编译失败。
碰到这个情况的时候本来是想把bootstrap的grid直接作为组件mixin在布局里面的，结果发现grid的span1~12是用代码生成的，这些样式集不能在less中复用。。。


#### 官方提供的预处理器太弱

其实上面的问题都出在预处理器上，官方给的预处理器只支持单个文件的单次编译，以bootstrap为例，要做到再linux上watch到reset.less文件的更改后编译boostrap.less输出bootstrap.css到上级目录，
目前似乎只能自己用node写脚本。。。

#### mixin的做法容易造成选择器过长

我不知道 “body #nav ul li a” 这样的选择器会造成多大的性能影响，但这种总是可以避免的。

而如果是用滥mixin就很有可能不经意就造成生成了这样的选择器。不过一般代码风格好的人都会注意控制嵌套层次，所以倒还不是大问题~


### bootstrap + less

意思是直接基于bootstrap的less版本开发，我还是觉得bootstrap的样式只适合开发原型，但是觉得它的reset.less(normalize.css), type.less, variables.less, mixins.less等都是很值得参考的less方案，而且它的grid系统也很好用，所以拿来自己用其实挺好的。

#### 为什么用bootstrap的less？

因为它提供了一个less的厍，我觉的css往预处理器发展是必然的，什么oocss之类的解决方案都应该基于预处理器，css具有一定的编程性后就应该有一些厍出现，尽可能屏蔽浏览器差异，减少代码冗余，简化开发，样式内容分离。唉，听起来挺美好，也悲伤的。


有些要注意的地方~

#### 哪些可以拿来用？

reset.less, variables.less, type.less, mixins.less可以直接用，也可以做适当裁剪，这里最有用的应该还是mixins.less, 把她们import了之后就可以在自定的样式里mixin了。另外bootstrap里Base CSS的部分也可以用，基于tabName的就没必要了。不要用Components里面的组件，因为她们大多是基于html上下文的，这样html的结构会受到css的限制，造成没必要的耦合。grids也用不了，这个主要是受less预处理器的限制，而且它也基于html上下文。



#### 文件组织和修改

single page app好说，所有文件全部import到一起输出一个css就好，网站的话就看这个网站的层级了。我的做法是合并了通常css文件中的reset和common，直接输出成一个全站的common文件。然后每个页面一个独立的css输出。

在less的文件这一层，首先是reset模块，reset.less, type.less。这个编译出来基本就是一个常用的reset.css了

然后是components模块，包括variables.less，mixins.less, 因为这个模块需要再很多文件里被import，所以要求单独编译这个模块不能产生css代码，也就是说里面的所有样式集都应该以Variables/Parametric Mixins的形式存在，所以需要对mixins做部分修改和删减。

第三是需要用的bootstrap样式厍，比如buttons，forms，tables，需要的就可以直接import进入

以上面两个模块为基础，首先是一个common.less：

    /* components(include variables.less, mixins.less) */
    @import "components.less";
    
    /* reset */
    @import "reset.less";
    @import "type.less";

    /* bootstrap style sets */
    @import "tables.less";
    ...
    
    /* common style */
	...

然后每种页面私有的样式集：

    /* components(include variables.less, mixins.less) */
    @import "components.less";

    /* page style */
   

以上，请指责。
