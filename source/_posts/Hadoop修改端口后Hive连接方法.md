---
title: Hadoop修改端口后Hive连接方法
tags:
  - Hadoop
  - 大数据
  - Hive
comments: true
categories:
  - 大数据
  - Hive
date: 2018-11-16 14:31:10
updated: 2018-11-19 19:48:44
password:
thumbnail: 'http://image.cyanide.top/logo/hadoop.jpg'
---
Hadoop修改端口后，hive继续操作会报错，找不到HDFS，此时需要到元数据库中（本文为mysql）修改对应数据
<!-- more -->
元数据库mysql里面两张表：
DBS ： Hive数据仓库的路径
SDS ： Hive每张表对应的路径
找到对应路径端口，修改