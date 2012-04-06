---
layout: page
title: Houkanshan's Blog
tagline: 
---
{% include JB/setup %}

<ul class="posts">
  {% for post in site.posts limit:5 %}
    <li><h1 class="title"><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></h1>
    <span>{{ post.date | date_to_string }}</span>
    <div>{{ post.content }}</div></li>
  {% endfor %}
</ul>
