---
layout: post
title: "Test Parallex"
description: "test"
category: 
tags: []
---
{% include JB/setup %}

<script type="text/fake">
  // text sorption
  if (page.type === 'post') {
    var textSorption = new TextSorption({
      elems: $('h3'),
      slowDown: false,
      extraPoints: []
    })

    setTimeout(function(){
      textSorption.update()
    }, 5000)
    setTimeout(function(){
      textSorption.update()
    }, 20000)
    exports.textSorption = textSorption
  }
</script>

### 这个实现的不好。。。然后我要换一个

首页看不到, 需要点进文章看，
然后应该用translate3D定位以提升性能。
另外在移动上用fixed挺不好的貌似.

  
  

### Stop here 1

...

...

### Stop here 2

...

...

### Stop hero 3

...

...

### Stop here 4

...

...

### Stop here 5 

...

...

### Stop here 6

...

...

### Stop here again 7

...

...

### Stop here again 8

...

...

### Stop here again 9

...

...

### Stop here again 10

...

...

### Stop here again 11

...

...

