---
title: Maven使用Hortonworks依赖包
tags:
  - Maven
  - 大数据
  - HDP
  - Hortonworks
comments: true
categories:
  - 大数据
  - HDP
thumbnail: ''
date: 2019-01-12 11:32:16
updated: 2019-01-12 11:32:16
password:
---
在项目中连接HDP时，会出现HortonWorks的Maven依赖包下载不了的情况，本文提供解决方案。
<!-- more -->
参考链接：[where can i find HDP maven Repos](https://community.hortonworks.com/questions/74655/where-can-i-find-hdp-maven-repos.html)
在项目中连接HDP时，会出现HortonWorks的Maven依赖包下载不了的情况，只需要在pom.xml中添加如下代码：
```xml
<repositories>
    <repository>
        <releases>
            <enabled>true</enabled>
        </releases>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
        <id>hortonworks.extrepo</id>
        <name>Hortonworks HDP</name>
        <url>http://repo.hortonworks.com/content/repositories/releases</url>
    </repository>

    <repository>
        <releases>
            <enabled>true</enabled>
        </releases>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
        <id>hortonworks.other</id>
        <name>Hortonworks Other Dependencies</name>
        <url>http://repo.hortonworks.com/content/groups/public</url>
    </repository>
</repositories>
```
另外，在[mvnrepository官网](https://mvnrepository.com)最新版可能没有更新，可以去[HortonWorks依赖包官网](http://repo.hortonworks.com/content/repositories/releases)查看最新版本