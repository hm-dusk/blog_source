---
title: Tez以及Tez UI安装方法
tags:
  - 大数据
  - Tez
comments: true
categories:
  - 大数据
  - Tez
thumbnail: ''
date: 2019-01-03 15:16:17
updated: 2019-01-03 15:16:17
password:
---
Tez是一个基于Hadoop Yarn的新应用程序框架，可以执行一般数据处理任务的复杂有向非循环图。在许多方面，它可以被认为是map-reduce框架的一个更灵活和更强大的继承者。
<!-- more -->
本文Tez版本：0.9.1
### 安装Tez
[安装Tez 0.9.0](https://blog.csdn.net/YonJarLuo/article/details/78223843)
### Tez UI安装
[官方文档](http://tez.apache.org/tez-ui.html)
[yarn timeline server](http://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/TimelineServer.html)
大致步骤：
1. 安装tomcat（ui需要运行在tomcat下）
2. 将`tez-ui.war`包解压到tomcat中`webapp/tez-ui/`目录下
3. 修改`../tomcat/webapps/tez-ui/config/configs.env`文件指定timeline地址和resourceManager地址
4. 修改`tez-site.xml`文件，修改`yarn-site.xml`文件，使其支持timeline
5. 启动timeline，`yarn-daemon.sh start timelineserver`或者`yarn timelineserver`
6. 启动tomcat，访问`http://hadoopmaster:8080/tez-ui`地址