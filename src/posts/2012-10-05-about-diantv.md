（对了，不知道这里的图能不能在局域网显示，因为都是放在google doc上的，东西还是要放一起的好）


![DianTv](https://docs.google.com/drawings/pub?id=1bjQG8XPz1RAE5dRQ7BfShonpmfyNqvTQzsbmVUtVJn0&w=959&h=528)

[DianTv](https://github.com/houkanshan/DianTv)最初就是图里这个土东西。
简单的用Meteor写的东西，分量个端，一个是在电梯屏幕上打开的页面，另一个是其他电脑上
打开的。两个最大的不同就是一个可以编辑，而另一个不行。

可是我不喜欢用Meteor--总是不知道这样做会发生什么，也许是我接触的编程思想太少。
Meteor很酷，理念也很酷，可是我不想用它。如果要开始去理解一个框架，Meteor感觉还不适合。

于是就有了下面所示的另一个土东西，[DianTimes (DianTv2.0)](https://github.com/houkanshan/DianTv2)

![DianTv2](https://docs.google.com/drawings/pub?id=14aRS_iuU-6cRe_EcPARQ_jIAwYakJXY8PCZDa1Xd1jg&w=959&h=528)

一个特点是可以直接在显示的内容上编辑，编辑后保存直接显示效果，没有再次加载的过程~

(= =!)好吧。虽然换了个洋气的称呼还是不改他土的本质。DianTv从开始弄到让他上线大概花了一个礼拜，这个2从后台restful到前端完成居然花了1个月
(不对，其实前端的主要代码还是上个礼拜在90House弄的)！

其实把代码拿掉外部的厍也就1.5K多的样子。。。原因主要除了编码能力弱外，还有就是折腾的东西有点多，肯定是过度设计了的。

![framework](https://docs.google.com/drawings/pub?id=1AZHespKey-Wr9kFdbz-IxjzsfRG3bJVQDKfvgS3ZlJQ&w=1732&h=1133)

我一开始脑袋里就在想这个图，还觉得很美好。其实呢，呵呵。（虚线是继承关系，实线是依赖关系，点线是消息流，最上面是全局依赖）

最纠结的还是**Pub/Sub**（不要笑我！），一开始实在不知道这个看起来很好的东西该怎么用。

用一个全局的总线来广播把，怕效率低，更怕结构乱。
每个模块独立进行事件分发吧，又觉得其实就是调用关系，犯不着trigger(pub)一下，而且用多了调试起来很麻烦。(我觉得我是被一些教程误导了)

纠结了很久决定主要用pub/sub主要处理异步事件。大概是这样...

![pubsub](https://docs.google.com/drawings/pub?id=1ay4G7v8j7XICMj6AwzuTK552giuCpneFCzA_06C85R4&w=440)

直接调用最麻烦的还是异步/同步的问题，用pub/sub来解决。这个图主要是利用一条消息总线来连接不同模块，
每个模块**不直接依赖**其他模块，只需要一条消息总线，
并且**屏蔽同步异步的差异**, 每个模块自己需要处理的异步事件只是服务器连接、用户事件、模块功能调用。

实际上是把对其他模块的调用也当作一次服务器调用了，极端点的说不定还可以让核心模块提供一个类似URI格式的api (= =!) ，比如:

    Event.bind('res://people/houkanshan?type=get', this.kiss.bind(this));
    Event.trigger('req://people/houkanshan?type=get');
    

### Spine.js

这个核心代码(js)大概900行，但是我好像最多只用了400行。他的model类基本没有用上。而且我觉得实际上他的模块继承达不到要求啊。

还有我发现spine现在的代码，应该是已经跑不了*javascript web application*这本书里面的代码的了吧... ... 


### CSS3动画
CSS3动画主要的特点就是流畅(这个在移动应用上很重要[CSS3 vs jQuery Animations](http://dev.opera.com/articles/view/css3-vs-jquery-animations/))，
而且可叠加(比如变大和变小可以同时使用，结果就是向量加法~)，

但是CSS3动画有一个问题，就是他是异步的，我一开始以为要setTimeout来同步，越想越觉得不对，于是发现有animationend事件。。。
不过还是用animation.js还是用setTimeout写的，里面都是糊弄的。。。

要实现复杂的动画效果，就有个动画的编排问题，比如ABC的消失顺序是

    A(start)-------->A(done)
    ----->B(start)------------->B(done)
    ---------->C(start)------------------>C(done,callback)

这样就能实现一个比较平滑的尤上至下的渐隐效果。如果是帧动画来实现的话，直接定帧的效果就可以了，但如果用css动画就麻烦了，
应该要用到promise和pubsub来处理这个。而且我觉得，处理的好，这种异步的动画会比帧动画更有编码上的优势。。

我自己的都是瞎糊弄的，没啥。别的没有看，但我觉得Y大([http://www.douban.com/group/Dexter_Yy/](http://www.douban.com/group/Dexter_Yy/))
的[animate](http://dexteryy.github.com/OzJS/examples/animate/index.html)超帅。

（好吧，都忘了wind.js了）

另外css3动画要注意的是start状态和end状态的设置之间必须得有一次渲染过程，否则start被覆盖就直接就到end状态了，所以要用setTimeout(setEnd, 1)来等渲染。

不过我还是没清楚渲染的时机是怎么决定的。。。





以上，请指责。



