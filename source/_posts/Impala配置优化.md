---
title: Impala配置优化
tags:
  - 大数据
  - CDH
  - Impala
  - 优化
comments: true
categories:
  - 大数据
img: ''
cover: false
date: 2019-09-18 10:43:34
updated: 2019-09-18 10:43:34
password:
summary: impala配置优化，版本3.2.0+cdh6.3.0
---
参考官网文档：
Impala安装后的推荐配置[https://www.cloudera.com/documentation/enterprise/6/6.3/topics/impala_config_performance.html](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/impala_config_performance.html)

### HDFS快速读取
启用快速读取允许Impala直接从文件系统读取本地数据。不再需要通过DataNode进行通信，从而提高了性能。
cloudera manager进入impala配置页面，搜索`dfs.client.read.shortcircuit`，勾选后重启。

### 设置内存限制

### 设置连接超时时间

### 设置连接数

### 使用HDFS缓存
参考官网文档：
使用Impala时设置HDFS缓存[https://www.cloudera.com/documentation/enterprise/6/6.3/topics/impala_perf_hdfs_caching.html#hdfs_caching](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/impala_perf_hdfs_caching.html#hdfs_caching)

### 配置Impala负载均衡
参考官网文档：
[Using Impala through a Proxy for High Availability](https://docs.cloudera.com/documentation/enterprise/6/6.3/topics/impala_proxy.html)
参考微信公众hadoop实操文章：
[如何使用HAProxy实现Impala的负载均衡](https://mp.weixin.qq.com/s/LX4PTr4XcZEOwjZRytroCQ)

### Impala timestamp类型时区问题
参考微信公众hadoop实操文章：
[Hive中的Timestamp类型日期与Impala中显示不一致分析（补充）](https://cloud.tencent.com/developer/article/1078478)