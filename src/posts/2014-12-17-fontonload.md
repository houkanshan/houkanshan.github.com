https://github.com/houkanshan/fontonload

fontonload 是一个跨浏览器的 web font 字体加载检测装置。使用时，需要修改自己的字体以保证检测成功。

看过目前市面上的几个类似库后，但或多或少有些问题：

1. [webfontloader](https://github.com/typekit/webfontloader) 体积大、功能强，对不支持 CSS Font Loading 的浏览器用定时器检测文字区域尺寸变化。
2. [fontloader](https://github.com/bramstein/fontloader) 原理同上，体积略大，功能略强，主要是完整实现了 CSS Font Load Events Module 的接口。但其尺寸检测也不可靠。
3. [fontfaceonload](https://github.com/zachleat/fontfaceonload) 原理同上，仅实现了加载检测功能，体积小。尺寸检测不可靠。
4. [FontLoader](https://github.com/smnh/FontLoader) 仅对 IE 6 – 9 使用定时器检测，对不支持 `document.fonts` 的浏览器构造一个复杂的、在字体加载时会触发 `scroll` 事件的检测元素进行检测，Nice。而且依赖 AdobeBlank 这个全空白字体进行对比，检测准确。但问题在于，AdobeBlank 这个字体通过 `@font-face` 的 `src: url( data-uri )` 的方式载入，占用体积，而且 data-uri 本身也有 FOUT 问题，需要避免。

所以 fontonload 的目的就是：
1. 对字体加载的检测，不使用定时器（加载超时的检测不算），而依赖浏览器触发事件。原因在 *smnh* 的文章中有说明。
2. 不依赖 AdobeBlank 且保证检测的准确性。
3. 只做检测字体加载这一件事

---

实现分三部分：

# 对支持 CSS Font Loading Module 的浏览器

直接使用 `document.fonts.load()` 预加载字体，这个接口返回 `Promise` 对象，非常好使。

```javascript
document.fonts.load('1em ' + fontname).then(success, fail)

```

# 对剩下的，能在容器尺寸变化时触发 `scroll` 事件的浏览器

按照 *smnh* 的测试结果，目前 IE6 – 9 外的大部分浏览器均在这个范围内。

不去构造 *smnh* 的复杂的可检测尺寸增加的测试容器，而直接使用简单的可检测尺寸减少的测试容器。

即，构造一个 1px × 1px , `overflow:hidden` 的元素，其内填入检测字符，并设置 `scrollLeft` 到右边缘。并设法让 web font 载入时，支撑容器的字符宽度减小，容器宽度随之减小，这样 `scrollLeft` 也随之减小，触发一次 `scroll` 事件。这完成了 *smnh* 文章中的第一个实验。问题在于如何保证 web font 载入后字符宽度减小。（使用水平滚动而非垂直滚动是为了防止 line-height 撑高高度）

这是这个方法的麻烦之处。需要修改 web font 中的 U+FFFD 字符为空字形。这样值使用 U+FFFD 作为测试字符进行检测，同时被测元素的宽度 (`scrollWidth`) 一定会缩至最小，保证检测的准确。

<a href="http://en.wikipedia.org/wiki/Specials_(Unicode_block)">U+FFFD (REPLACEMENT CHARACTER)</a> 位于 Unicode table 中的 Specials block，主要用途是展示当前字体中没有包含的字符，通常是出现了编码错误。所以可以认为这是一个正常网页中不会出现的字符而覆盖掉它。同时这个字符在各个平台中均有定义，因此可保证字体载入前容器被撑大。

Github 项目目录下的 patch.ttf 中在 U+FFFD 处定义了来自 AdobeBlank 的空字形，可使用字体编辑器将它复制进去。


![U+FFFD 在不同平台上的表现](/img/fontonload/fffd.png)


# 对 IE 6 – 9

IE 6 – 9 虽然不能自动触发 scroll 事件，但它们也具有别的浏览器不具备的特性：当字体有缓存时，没有 FOUT 问题。

也就是说，当有对应缓存时， @font-face 的 `url: src()` 规则的行为与 `url: local()` 类似。

首先尝试了用 `(new Image()).src = 'xxx.eot'`，但发现 IE 发现文件类型不是图片后，就会中断加载，提前触发 `onerror` ，这只在资源加载时间大于一定时间后才会出现。

于是接着尝试利用在 iframe 内定义 @font-face 的方式加载字体。这里又利用了「@font-face 会阻塞 window load event 触发」的特性。注意这个行为曾经在部分浏览器上不总如此，但目前除 Safari 的大部分浏览器上均是如此（显然我没怎么测试）。在 IE 6 – 9 上也是如此。

不过当用在 iframe 上时，又有些不同：

1. 在 IE 6 – 8 中，iframe 用 `document.write` 填充内容，会，`iframe.onload` 也会被 @font-face 阻塞
2. 在 IE 9 中， iframe 用 `document.write` 创建内容， iframe.onload 会在 `document.close()` 的时候立即触发，而不被 font-face 阻塞。如果将 `document.close` 放在 `setTimeout(,1)` 内，就会导致 font-face 阻塞 `iframe.onload` 的触发。
3. 在 IE 6 – 8 上，页面渲染会被 @font-face 的加载阻塞
4. 在 IE 6 – 8 上，页面渲染**不会**被用 2 的方式创建的 iframe 内的 @font-face 的加载阻塞
5. 在 IE 6 – 8 上，页面渲染**会**被用 3 的方法会导致整个页面被 iframe 内的 @font-face 阻塞，iframe 用 `setTimeout(,1)` 无用，除非设置较长时间
6. 在 IE9+ 上，页面渲染不会被 @font-face 的加载阻塞

IE 6 – 9 中，用 2 的方法得到的 network timeline（在 onload 时发出一个 img 请求，作为时间标记，）。可见， onload 分别在各自的字体被载入时触发，但 @font-face 的加载会被所有 iframe 中 @font-face 的加载阻塞（不确定原因）

![图中两个 404 请求为 onload 触发的标记](/img/fontonload/ie6-9-no-img.png)

但对 IE 6 – 9 有缓存情况下还有有问题。iframe 内的 @font-face 直接不请求了，使用缓存字体，而 parent 页面中还是会正常的请求了一次，并获得 304。这样 parent 中字体载入时间比 iframe 中晚，检测失败。如图

![onload 与 @face-face 的加载同时发生](/img/fontonload/ie6-9-no-img-failed.png)

于是在 iframe 中再加入一个 src 为字体文件的 img 对象来保证 iframe 中的请求被发出，如图

![第 5 / 6 行为 img 触发的请求](/img/fontonload/ie6-9-with-img.png)

![有缓存时，IE 9 的 network timeline](/img/fontonload/ie9-final.png)

最后，对 IE 9，字体的所有 url / src 都用带 `?#iefix` 可触请求。而对 IE 6 – 8 ，img 的 src 不带 `?#iefix`，这样才能发出 img 的请求。


再排除掉尚存的、不支持 web font 的浏览器： BlackBerry 5/6, Windows Phone 7/7.5, Opera Mini, Firefox 3.x-


竟然又写了这么长的水文…

# 相关：

[CSS Font Loading Module Level 3](http://dev.w3.org/csswg/css-font-loading/)

[Fighting the @font-face FOUT](http://www.paulirish.com/2009/fighting-the-font-face-fout/) by Paul Irish

[@font-face and performance](http://www.stevesouders.com/blog/2009/10/13/font-face-and-performance/) by Steve Souders

[Web font loading detection, without timers](http://smnh.me/web-font-loading-detection-without-timers/) by smnh

[Better @font-face with Font Load Events](https://dev.opera.com/articles/better-font-face/) by Zach Leatherman