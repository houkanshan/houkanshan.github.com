*[Stonert](https://github.com/houkanshan/stonert)* & *[Stormic](https://github.com/houkanshan/stormic)* are two music visualisation projects make by Processing.

<p>
<iframe width="560" height="315" src="//www.youtube.com/embed/cJ_yJjVNTRI?rel=0" frameborder="0" allowfullscreen alt="Stormic demo, on youtube"></iframe>
</p>

<p>
<iframe width="560" height="315" src="//www.youtube.com/embed/jUjYWAIbi4M?rel=0" frameborder="0" allowfullscreen alt="Stonert demo, on youtube"></iframe>
</p>

*Stormic* comes first, with my idea of “flowing stones” reading after the book *[The Nature of Code](http://natureofcode.com/)* ([@豆瓣](http://book.douban.com/subject/20452058/)) written by *Daniel Shiffman*. And the code of particle systems comes from this book. 

![Screenshot of Stormic](https://houkanshan.github.io/stormic/daily/5.1.png)

![Nature Of Code, best Processing book ever read](http://cl.ly/Vxy9/Image%202014-06-07%20at%2010.06.25%20PM.png)

*Stormic* is not keep up well with music, you can find that sometimes it has not reaction when an obviously beat comes. Because creating particle cost a lot of CPU, I have to limit the count of the particles, by the same time I have to find out the right beat. I’m failed to make them works well.

----

So it comes the *Stonert*. Different from *Stormic*, *Stonert* is not based on particle system (In fact there is still a tiny particle system to simulate the wind). “Stone” will created once when program load, then they just act follow the FFT stream. It’s easy.

![Screenshot of Stonert](https://houkanshan.github.io/stonert/daily/7.1.png)

At last I have some basic experience after these project: 

1. Sometimes visualising **random** things is easier than ordered things. Since random is always uniform, and ordered things sometimes not, music for example.

2. For music visualisation works, rhythm is the most important thing. As a beginner, once your works has got — no matter by hands or by code — and follow rhythm, your works is half done.

3. Do not make 3D works with Processing. I think Processing is not made specifically for 3D works. For example I’m failed to make my 3D work support Macbook’s Retina display. Also the 3rd party libraries for Processing is old, limited and hard to be found.