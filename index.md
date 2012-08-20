---
layout: page
title: Houkanshan's Blog
tagline: 
---
{% include JB/setup %}

{% for post in site.posts limit:3 %}
<section class="post">
    <div class="hd">
        <h2>
            <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a>
        </h2>
        <span class="meta">{{ post.date | date_to_string }}</span>
    </div>
    <div class="bd">
        {{ post.content }}
    </div>
</section>
{% endfor %}
