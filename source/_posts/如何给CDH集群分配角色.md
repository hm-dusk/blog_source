---
title: 如何给CDH集群分配角色
tags:
  - 大数据
  - CDH
  - 角色分配
comments: true
categories:
  - 大数据
img: ''
cover: false
date: 2019-08-27 13:57:27
updated: 2019-08-27 13:57:27
password:
summary: 本文主要介绍由Cloudera Manager管理的CDH集群的角色划分
---
> 本文转载自微信公众号Hadoop实操：《如何给Hadoop集群划分角色》

参考官网：[Recommended Cluster Hosts and Role Distribution](https://www.cloudera.com/documentation/enterprise/latest/topics/cm_ig_host_allocations.html)

### 1.文档编写目的

Fayson在之前的文章中介绍过《CDH网络要求(Lenovo参考架构)》，《如何为Hadoop集群选择正确的硬件》和《CDH安装前置准备》，而我们在搭建Hadoop集群时，还一件很重要的事就是如何给集群分配角色。

本文主要介绍由Cloudera Manager管理的CDH集群的角色划分。实际部署你可能还需要考虑工作负载的类型和数量，真实要部署的哪些服务，硬件资源，配置，以及其他因素。当你使用Cloudera Manager的安装向导来安装CDH时，CM会根据主机的可用资源，自动的分配角色到各台主机，边缘节点除外。你可以在向导中使用"自定义角色分配 - Customize Role Assignments"来更改这些默认划分，当然你也可以以后再使用Cloudera Manager来增加或修改角色分配。

在介绍角色划分时，我们首先来看看有哪几种主要的角色：

1.**管理节点（Master Hosts）**：主要用于运行Hadoop的管理进程，比如HDFS的NameNode，YARN的ResourceManager。

2.**工具节点（Utility Hosts）**:主要用于运行非管理进程的其他进程，比如Cloudera Manager和Hive Metastore。

3.**边缘节点（Edge Hosts）**：用于集群中启动作业的客户端机器，边缘节点的数量取决于工作负载的类型和数量。

4.**工作节点（Worker Hosts）**：主要用于运行DataNode以及其他分布式进程，比如ImpalaD。

本文会从测试/开发集群（小于10台），小规模集群（10-20台），中小规模集群（20-50台），中等规模集群（50-100台），大型集群（100-200台），超大规模集群（200-500台），巨型规模集群（500台以上）来分别讲述角色划分。以下角色划分场景都不包括Kafka，Kafka角色我们一般都会采用单独的机器部署。

### 2.集群角色划分

#### 2.1.小于10台

一般用于测试/开发集群，我们建议至少5台机器，没有高可用。一个管理节点主要用于安装NameNode和ResourceManager，工具节点和边缘节点复用一个，主要用于安装Cloudera Manager等，剩余3-7台工作节点。
![](http://47.106.179.244/如何给CDH集群分配角色/小于10台.jpeg)

#### 2.2.10-20台

这是最小规模的生产系统，必须启用高可用。我们会用2个管理节点用于安装2个NameNode，一个工具节点用于安装Cloudera Manager等，如果机器充足或者Hue/HiveServer2/Flume的负载特别高，可以考虑独立出边缘节点用于部署这些角色，否则也可以跟Cloudera Manager复用。最后还剩下7-17个工作节点。
![](http://47.106.179.244/如何给CDH集群分配角色/10-20台.jpeg)


注：根据实际情况选择是否需要单独的边缘节点。

MySQL主备参考《如何实现CDH元数据库MySQL的主备》，《如何实现CDH元数据库MySQL的主主互备》和《如何实现CDH元数据库MySQL的高可用》

OpenLDAP主备参考《3.如何实现OpenLDAP的主主同步》

Kerberos主备参考《如何配置Kerberos服务的高可用》

#### 2.3.20-50台

这是中小规模的生产集群，必须启用高可用，与小规模集群角色划分差别不大。我们会用3个管理节点用于安装NameNode和Zookeeper等，一个工具节点用于安装ClouderaManager等，如果机器充足或者Hue/HiveServer2/Flume的负载特别高，可以考虑独立出边缘节点用于部署这些角色，否则也可以跟Cloudera Manager复用。最后还剩下16-46个工作节点。
![](http://47.106.179.244/如何给CDH集群分配角色/20-50台.jpeg)


注：根据实际情况选择是否需要单独的边缘节点。

Zookeeper和JournalNode需配置专有的数据盘

MySQL主备参考《如何实现CDH元数据库MySQL的主备》，《如何实现CDH元数据库MySQL的主主互备》和《如何实现CDH元数据库MySQL的高可用》

OpenLDAP主备参考《3.如何实现OpenLDAP的主主同步》

Kerberos主备参考《如何配置Kerberos服务的高可用》

HiveServer2和Impala Daemon的负载均衡参考《如何使用HAProxy实现Impala的负载均衡》，《如何使用HAProxy实现HiveServer2负载均衡》，《如何使用HAProxy实现Kerberos环境下的Impala负载均衡》，《如何使用Nginx实现Impala负载均衡》和《如何使用Zookeeper实现HiveServer2的HA》

#### 2.4.50-100台

这是中等规模的生产集群，必须启用高可用。我们会用3个管理节点用于安装NameNode和Zookeeper等，一个工具节点用于安装Cloudera Manager，一个工具节点用于安装ClouderaManagement Service和Navigator等。使用三个节点安装Hue/HiveServer2/Flume，作为边缘节点，使用两个节点安装负载均衡软件比如F5或者HAProxy并配置为KeepAlive的主主模式，该负载均衡可同时用于HiveServer2和Impala Daemon。最后还剩下42-92个工作节点。
![](http://47.106.179.244/如何给CDH集群分配角色/50-100台.jpeg)


注：Zookeeper和JournalNode需配置专有的数据盘

MySQL主备参考《如何实现CDH元数据库MySQL的主备》，《如何实现CDH元数据库MySQL的主主互备》和《如何实现CDH元数据库MySQL的高可用》

OpenLDAP主备参考《3.如何实现OpenLDAP的主主同步》

Kerberos主备参考《如何配置Kerberos服务的高可用》

HiveServer2和Impala Daemon的负载均衡参考《如何使用HAProxy实现Impala的负载均衡》，《如何使用HAProxy实现HiveServer2负载均衡》，《如何使用HAProxy实现Kerberos环境下的Impala负载均衡》，《如何使用Nginx实现Impala负载均衡》和《如何使用Zookeeper实现HiveServer2的HA》

#### 2.5.100-200台

属于大规模的生产集群，必须启用高可用。我们会用5个管理节点用于安装NameNode和Zookeeper等，1个工具节点用于安装Cloudera Manager，再使用4个工具节点分别安装HMS，Activity Monitor，Navigator等。使用3个以上节点安装Hue/HiveServer2/Flume，作为边缘节点，使用2个节点安装负载均衡软件比如F5或者HAProxy并配置为KeepAlive的主主模式，该负载均衡可同时用于HiveServer2和Impala Daemon。最后还剩下85-185个工作节点。
![](http://47.106.179.244/如何给CDH集群分配角色/100-200台.jpeg)


注：Zookeeper和JournalNode需配置专有的数据盘

Kudu Master不超过3个

Kudu Tablet Server不超过100个

MySQL主备参考《如何实现CDH元数据库MySQL的主备》，《如何实现CDH元数据库MySQL的主主互备》和《如何实现CDH元数据库MySQL的高可用》

OpenLDAP主备参考《3.如何实现OpenLDAP的主主同步》

Kerberos主备参考《如何配置Kerberos服务的高可用》

HiveServer2和Impala Daemon的负载均衡参考《如何使用HAProxy实现Impala的负载均衡》，《如何使用HAProxy实现HiveServer2负载均衡》，《如何使用HAProxy实现Kerberos环境下的Impala负载均衡》，《如何使用Nginx实现Impala负载均衡》和《如何使用Zookeeper实现HiveServer2的HA》

#### 2.6.200-500台

属于超大规模的生产集群，必须启用高可用。我们会用7个管理节点用于安装NameNode和Zookeeper等，1个工具节点用于安装Cloudera Manager，再使用7个工具节点分别安装HMS，Activity Monitor，Navigator等。使用3个以上节点安装Hue/HiveServer2/Flume，作为边缘节点，使用2个节点安装负载均衡软件比如F5或者HAProxy并配置为KeepAlive的主主模式，该负载均衡可同时用于HiveServer2和Impala Daemon。最后还剩下180-480个工作节点。
![](http://47.106.179.244/如何给CDH集群分配角色/200-500台.jpeg)


注：Zookeeper和JournalNode需配置专有的数据盘

Kudu Master不超过3个

Kudu Tablet Server不超过100个

MySQL主备参考《如何实现CDH元数据库MySQL的主备》，《如何实现CDH元数据库MySQL的主主互备》和《如何实现CDH元数据库MySQL的高可用》

OpenLDAP主备参考《3.如何实现OpenLDAP的主主同步》

Kerberos主备参考《如何配置Kerberos服务的高可用》

HiveServer2和Impala Daemon的负载均衡参考《如何使用HAProxy实现Impala的负载均衡》，《如何使用HAProxy实现HiveServer2负载均衡》，《如何使用HAProxy实现Kerberos环境下的Impala负载均衡》，《如何使用Nginx实现Impala负载均衡》和《如何使用Zookeeper实现HiveServer2的HA》

#### 2.7.500台以上

属于巨型规模的生产集群，必须启用高可用。我们会用20个管理节点用于安装NameNode和Zookeeper等，1个工具节点用于安装Cloudera Manager，再使用7个工具节点分别安装HMS，Activity Monitor，Navigator等。使用3个以上节点安装Hue/HiveServer2/Flume，作为边缘节点，使用2个节点安装负载均衡软件比如F5或者HAProxy并配置为KeepAlive的主主模式，该负载均衡可同时用于HiveServer2和Impala Daemon。最后还剩下至少467个工作节点。
![](http://47.106.179.244/如何给CDH集群分配角色/500台以上.jpeg)


注：这个规模的规划仅供参考，这种巨型规模的生产集群的角色划分依赖因素非常多，比如是否考虑NN和RM的联邦等

Zookeeper和JournalNode需配置专有的数据盘

Kudu Master不超过3个

Kudu Tablet Server不超过100个

MySQL主备参考《如何实现CDH元数据库MySQL的主备》，《如何实现CDH元数据库MySQL的主主互备》和《如何实现CDH元数据库MySQL的高可用》

OpenLDAP主备参考《3.如何实现OpenLDAP的主主同步》

Kerberos主备参考《如何配置Kerberos服务的高可用》

HiveServer2和Impala Daemon的负载均衡参考《如何使用HAProxy实现Impala的负载均衡》，《如何使用HAProxy实现HiveServer2负载均衡》，《如何使用HAProxy实现Kerberos环境下的Impala负载均衡》，《如何使用Nginx实现Impala负载均衡》和《如何使用Zookeeper实现HiveServer2的HA》

如果你玩的Hadoop集群节点数不在本文范围内，那你肯定不是在玩大数据，或者超过了Fayson的能力范围。


