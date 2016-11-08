为什么要写博客呢。。。因为我发现其实写的时候才是在认真总结啊~ 这是个利用自己的虚荣心学习的机会。。。

--------------------------------------------

关于scss(sass)我觉得它比less也就好用个100倍的样子吧~

嗯，其实就是上次说的[less的缺点](http://houkanshan.github.com/2012/08/11/bootstrap-less/)，scss基本没有。。

不过有个不足就是scss没有名字空间的用法。其实也无所谓，用 %xxx 这样的伪选择器代替就可以了~

我超喜欢他的@extend（[doc](http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#extend)）6，
因为他会将所有用了@extend的选择器放一起写，这样可以减掉很多冗余的代码。类似：

    .a {font:red}
    .b {@extend .a}
    .c {@extend .b}

输出：

    .a, .b, .c {font:red}

这样去做，处理那些重用次数很多的hide, bfc, pull-left/right等样式组件以及重用量大的模块，就能省掉很多代码了~ （是不是有点强迫症 = =?）

然后发现一个很可能是严重的问题，假设页面中有40个元素要hide，如果这样用的话，就会出现。。。

    .a, .b, ...好累啊不写了..., .at, .au { display:none; }

感觉好恐怖啊，首先想到的是会不会影响效率，你想一个元素a的样式，一下在这里声明，一下在那里声明(我要看css样式计算和渲染的算法！哪里有？)

于是做了个测试。一个是500个元素的样式分散的声明（test1）(
[css](https://github.com/houkanshan/test-demo/blob/gh-pages/css-render-test/test1.css), 
[scss](https://github.com/houkanshan/test-demo/blob/gh-pages/css-render-test/scss/test1.scss)
)，
另一个是500个元素的样式独立的声明（test2）(
[css](https://github.com/houkanshan/test-demo/blob/gh-pages/css-render-test/test2.css), 
[scss](https://github.com/houkanshan/test-demo/blob/gh-pages/css-render-test/scss/test1.scss)
)

测试结果是：
#### test1

[页面在此](http://houkanshan.github.com/test-demo/css-render-test/test1.html)

![test1](https://docs.google.com/drawings/pub?id=1VubjFo4T0RL3eQr460iGnRlPYx9EEHtKAkgmdxokB_g&w=688&h=298)

#### test2

[页面在此](http://houkanshan.github.com/test-demo/css-render-test/test2.html)

![test2](https://docs.google.com/drawings/pub?id=1tEK6Iufvobo9YMZ-S-PGMa4bt6GFiOXwKwQ6UeIB0Nk&w=688&h=302)

可以看到，分散声明(test1)只是在recalcute上时间比独立声明(test2)要长，而test2主要落后在下载上，而且注意我这还只是本地测试~

所以用@extend应该是不用担心在性能上的问题了~ 不过在F12调试的时候会比较囧，
去掉某个属性(比如hide)前面的勾勾的时候可能就把其他的全都取消了(之前被hide的全都显示出来了)。。。

  
  
嗯，scss的另一个特点(可能的问题?)就是他的伪选择器（@extend-Only Selectors），Begin with %

比如说：

    %mod { height: 20px; width: 20px; }
    .a { @extend %mod; }
    .b { @extend %mod; }

    .c {
        %mod {
            background: $dddddd;
        }
    }

如果吧%mod换成.mod，一切都很好说，但因为%mod是不会输出的，所以 .c %mod 这样的选择器就被换成了

    .c .a, .c .b { ... }

而以后每次对%mod内容的增加，只要是涉及不同的选择器规则，就会成倍的输出选择器了耶~

虽然之前都说性能影响不是很大，但是就跟coffeescript一样，我觉得过度依赖预处理技巧输出代码的问题就在于调试。

欣赏一下！

![mass css selector](https://docs.google.com/drawings/pub?id=1hYLG2o46FDSoSqS9MeWeH4ecLi0p0qxWSEBI3gcIj74&w=346&h=213)

嗯，也不能随便下定论，先试试，看到底调试的问题大不大。。。


以上，请指责。
