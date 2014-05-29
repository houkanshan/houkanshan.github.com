
CSS应该是作为一种配置文件存在的，对HTML而言就是显示样式的配置。
其实上次听讲座也听到说配置文件配置文件根据使用场景可以尝试多种格式，CSS的语法就是一种。
当时没太听明白，只是想想觉得类似XML\HTML这种树形结构的数据应该都可以用CSS的语法(主要是选择器的特性)来进行配置的。

继续说CSS本身，我所看到的设置样式的方式大概有两种：

* 通过预先配置的css文件来设置样式。

* 通过js修改dom属性。

然而第二种并不是全局有效的，我觉得不能算是配置。

其实还有一种应该也是在入门的时候就有的概念，就是直接写**embedded-style-sheet(嵌套样式表，页内样式表)**的css来达到一种脚本化CSS的效果，但与直接改dom属性相比，这个是全局有效的。

在传统的网页上，直接修改元素的样式很方便，也没什么问题。但是到WebApp上，由于需要屏幕适配，并且有大量元素的增删操作，
单纯依靠Fluid Layout或者media queries不一定能解决问题。
于是就看到了很多在元素创建之后的element style设置。

如果在每次创建的时候设置还不是大问题，那么当窗口大小变化的时候，还是会碰到问题。因为这有一个全局感知resize，计算新样式并向下通知的过程。设计的好，这应该是个自顶向下的流程，否则可能就乱了。

然而如果创建一个embedded-style-sheet去维护这些配置，问题就简单了。

于是做了个叫DCSS的东西，比较简单，轻拍。
[https://github.com/houkanshan/dcss](https://github.com/houkanshan/dcss)

主要接口是Dcss.rule()，实现了：

    rule('.selector')

    rule('.selector', 'color')

    rule('.selector', 'color', 'black')

    rule('.selector', {'color': 'black', 'background':'white'})
     
前两个是getter, 后面是setter.

还有一个没做：

    rule({'.selector1': {'color': 'black', 'background':'white'}, '.selector2':{'color':'blue'}})



另外还有json2css, css2json两个接口

发现一个响应式实现中的可能碰到的问题就是，所有的响应式都是先resize再render的，在resize和render之间元素还是会保持原来的样式，
如果这个时候是窗口缩小，而页面布局的时候没有留下这个缓冲空间，就会出现一次抖动(主要是对float和inline这种自适应方式的)。
代码里的index.html里面就出现了这种情况。

然后打算过几天，把DianTv2的代码改一下~ 不过那个比较简单，有问题也看不出来。


----------------------------------------

关于json & css的互转，还有一个实现： [https://github.com/aramkocharyan/CSSJSON](https://github.com/aramkocharyan/CSSJSON)



很好奇的测试了下几种字符串分割的效率问题。

[http://jsperf.com/string-split-houkanshan](http://jsperf.com/string-split-houkanshan)

结果是性能上：split(string) >> match(regexp) > split(regexp) >> regexp.exec(string)

![split test](https://docs.google.com/drawings/pub?id=1nSp_-WbH6E4oRfumYWKhSHNEc1qOMcIDDDEnn7yvgw8&w=930&h=466)

测试的时候考虑的主要是平常的用法，应为exec的循环方法不一样，所以加上了循环，并没有做什么优化，本来期望的是差异不大的。
但结果是，能用split分割的时候尽量用split(string)，不行的话就用match，再不行的话才用exec。

而这个实现用的是最慢的exec+递归，优势是他能支持media选择器，也就是多层规则。但是我不需要，
我只要能实现一个类似$.css()的方法就行了，因此直接用了split套两层循环实现。

正则虽然很猛，熟练了估计会很无敌。但应用中还是要看场合，字符串分割我觉得就没必要了，而且对我这种菜鸟要读正则太耗时了。。。

（不过已经几次笔试的时候碰到正则的大题了，做的都不怎么样，囧）


----------------------------------------

今天真是个神奇的日子。

早上赶去参加某公司的面试，一开始自我介绍就自曝说转前端半年，于是就有点被bs的感觉，后来面试官哥哥(叔叔?)问我是不是主要写JS，我补充说还写CSS的。

的。。。

然后就看到他一脸很无语的感觉。于是我也满脸黑线了，开始怀疑我是不是投错岗位了。。。
毕竟我觉得我应该是个CSS\JS各一半，设计\网络各一半，后端1/5的人的(数学不好...算不清)

总之又是一次很没感觉的面试，很多该说的地方表现的太含蓄了。。。

回来收到小kk豆油的问我豆瓣的情况~ 然后还不停安慰我。忍不住翻出一张旧照片看了一阵，唔，真好。

![旧照片](https://docs.google.com/drawings/pub?id=1UiYFbsChBatVkMondOCaWeXIHzwVA61uKCdP-12d3tY&w=545&h=100)

*旧照片*

后来发现饭卡掉了，这对一个死宅来说真是不容易。嗯，可能是在某公司面试前坐地上看书的时候掉的。
希望是一个武大的孩子捡到我的饭卡，这样应该就可以省20块钱了~ 华师也行~ 地大也行~

后来我爸和我妈相继来电话，都跟我说    
> *即使去不了某植物公司没关系，还是要尽力争取去某动物公司*。   
而奇怪的地方就在于，以他们为首的我的所有家人，之前都是要我去保研的~ 

其实也不奇怪，是吧。

晚上渴的不行，又不巧手边是瓶没喝完的咖啡，更不巧的是我明天要交一堆不想做的设计，接下来就该去windows打开PS然后等太阳了。

谢谢各位。


以上，请指责。
