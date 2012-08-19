---
layout: page
title: Houkanshan's Blog
tagline: 
---
{% include JB/setup %}

{% for post in site.posts limit:5 %}
<section class="content">
    <h1 class="title page-header">
        <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a>
    </h1>
    <div class="row">
        <div class="span8">
            <p>{{ post.date | date_to_string }}</p>
            {{ post.content }}
        </div>
    </div>
</section>
{% endfor %}
