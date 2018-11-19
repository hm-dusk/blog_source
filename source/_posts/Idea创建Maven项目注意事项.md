---
title: Idea创建Maven项目注意事项
date: 2016-07-23 17:15:19
updated: 2016-07-23 17:15:19
categories: 
  - Java
  - Maven
tags: [maven,idea,编辑器]
---
新建项目的时候选择maven项目。
<!-- more -->
![](http://ot87uvd34.bkt.clouddn.com/idea%E5%88%9B%E5%BB%BAMaven%E9%A1%B9%E7%9B%AE%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9/1.png)
接着下一步，这里需要注在Properties中添加一个参数`archetypeCatalog=internal`，不加这个参数，在maven生成骨架的时候将会非常慢，有时候直接卡住。
>>来自网上的解释：
>>*archetypeCatalog*表示插件使用的archetype元数据，不加这个参数时默认为remote，local，即中央仓库archetype元数据，由于中央仓库的archetype太多了所以导致很慢，指定internal来表示仅使用内部元数据。

![](http://ot87uvd34.bkt.clouddn.com/2.png)
这样，在初始化maven项目的时候就不会被卡住了。
