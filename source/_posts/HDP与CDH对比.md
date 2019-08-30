---
title: HDP与CDH对比
tags:
  - 大数据
  - HDP
  - CDH
comments: true
categories:
  - 大数据
img: ''
date: 2019-07-03 14:25:43
updated: 2019-7-19 11:22:22
password:
summary: Hortonworks HDP与Cloudera CDH对比。
---
### HDP与CDH的对比

#### 版本更新对比

HDP版本更新较快，因为Hortonworks内部大部分员工都是apache代码贡献者，尤其是Hadoop 2.0的贡献者。

CDH版本更新比Apache版本慢。

目前Apache社区Hadoop最新版本：3.2.0

目前CDH最新版支持Hadoop版本：3.0.0

目前HDP最新版支持Hadoop版本：3.1.1

#### 架构对比
##### CDH
![](http://image.hming.org/HDP与CDH对比/CDH架构.png)

##### HDP
![](http://image.hming.org/HDP与CDH对比/HDP架构.png)

#### 原装支持组件对比

![](http://image.hming.org/HDP与CDH对比/组件对比.png)
* CDH支持的存储组件更丰富
* HDP支持的数据分析组件更丰富
* HDP对多维分析及可视化有了支持，引入Druid和Superset
* HDP的HBase数据使用Phoenix的jdbc查询；CDH的HBase数据使用映射Hive到Impala的jdbc查询（CDH6.2支持Phoenix5），但分析数据可以存储Impala内部表，提高查询响应
* 多维分析Druid纳入集群，会方便管理；但可视化工具Superset可以单独安装使用
* CDH没有时序数据库，HDP将Druid作为时序数据库使用

#### 安全权限模块对比
1. HDP
包含Ranger组件，即使在没有Kerberos的情况下，也能作一些简单的权限分配管理。由于100%开源，所以支持Ldap+Kerberos+Ranger的权限配置方式，分配权限简单易用。另外，Kerberos配置具有向导式界面。

2. CDH
包含Sentry组件，Sentry与Ranger差别较大，Sentry没有图像化界面，只负责同步组件间的ACL授权。Cloudera express免费版只支持集成Kerberos，需要Ldap支持的需要企业版（[CDH免费版和企业版区别对比](#CDH免费版和企业版区别)）。

#### 运维管理对比
##### HDP
采用Apache Ambari进行统一管理，Ambari2.7之后的版本相对2.6有很大的改动，2.6个人看来也不够人性化，2.7界面布局更加人性化。
1. Ambari不支持中文，整个管理页面都是英文呈现。
2. 组件比较重要的基本配置都以图形化的方式呈现，比直接配文字版体验效果好。
![](http://image.hming.org/HDP与CDH对比/HDP配置界面1.png)
![](http://image.hming.org/HDP与CDH对比/HDP配置界面2.png)
鼠标hover到配置项上面会有该项配置的说明。
![](http://image.hming.org/HDP与CDH对比/HDP配置界面2-1.png)
3. 其他配置都是按照节点（如下图中的NameNode）、配置文件（如下图中的Advanced hdfs-site）来进行组织的，方便运维人员快速定位。另外配置有版本记录，可以回退到任意版本。
![](http://image.hming.org/HDP与CDH对比/HDP配置界面3.png)
4. 组件界面可以直接看到该组件的哪些服务以及服务情况，右边就有该服务的快速链接，下图为Yarn的界面。
![](http://image.hming.org/HDP与CDH对比/HDP组件界面1.png)
5. 部分组件可以看到链接地址，比如Hive。
![](http://image.hming.org/HDP与CDH对比/HDP组件界面2.png)
6. Ambari服务本身不支持高可用。


##### CDH
采用Cloudera Manager（下文统一用cm代替）进行统一管理。
1. cm可以根据浏览器配置进行语言选择，支持中文。
![](http://image.hming.org/HDP与CDH对比/CDH配置界面0.png)
2. 配置界面左边将所有配置按照范围、类别、状态进行分类，也能很方便的找到配置。
![](http://image.hming.org/HDP与CDH对比/CDH配置界面2.png)
右边提供每个配置的说明，点看可以看到各项配置的说明。
![](http://image.hming.org/HDP与CDH对比/CDH配置界面2-1.png)
3. 配置版本控制免费版不支持
参考官网：[Viewing and Reverting Configuration Changes](https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_mc_revert_configs.html)
4. 组件服务的快速链接在tab页上
![](http://image.hming.org/HDP与CDH对比/CDH配置界面3.png)
5. cm服务可以配置高可用
参考官网：[Installing and Configuring Cloudera Manager Server for High Availability](https://www.cloudera.com/documentation/enterprise/6/6.2/topics/admin_cm_ha_server.html)
6. cm支持数据加密，无论是静态加密或保护数据传输，但是可惜的是免费版cm支持很有限。另外加密前官方强烈建议安装Kerberos
参考官网：[Encryption Overview](https://www.cloudera.com/documentation/enterprise/6/6.2/topics/sg_enc_overview.html)
![](http://image.hming.org/HDP与CDH对比/CDH加密配置页面.png)

### CDH版本说明

#### CDH6.X组件版本对应

https://www.cloudera.com/documentation/enterprise/6/release-notes/topics/rg_cdh_6_packaging.html

#### CDH5.X组件版本对应

https://www.cloudera.com/documentation/enterprise/release-notes/topics/cdh_vd_cdh_package_tarball.html

#### Impala版本说明

Impala在3.1之后才支持ORC格式HDFS文件，目前最高版本为3.2，CDH6.1对应的Impala版本为3.1，CDH6.2对应的Impala版本为3.2

#### Docker QuickStart版本说明

Cloudera `Quickstart`和HDP的`sandbox`类似，都是单机版的供学习交流使用的大数据集群。
目前Docker版启动的quickstart CDH版本最新为**5.13.0**，对应部分组件版本为：

| **组件**        | **组件包版本**                             | **压缩包下载地址**                                           | **版本发布说明**                                             | **更改文件**                                                 |
| --------------- | ------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | :----------------------------------------------------------- |
| Apache Hadoop   | hadoop-2.6.0+cdh5.13.0+2639                | [Tarball](https://archive.cloudera.com/cdh5/cdh/5/hadoop-2.6.0-cdh5.13.0.tar.gz) | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/hadoop-2.6.0-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/hadoop-2.6.0-cdh5.13.0.CHANGES.txt) |
| Hadoop Mrv1     | hadoop-0.20-mapreduce-2.6.0+cdh5.13.0+2639 | (none)                                                       | (none)                                                       | (none)                                                       |
| Hbase           | hbase-1.2.0+cdh5.13.0+411                  | [Tarball](https://archive.cloudera.com/cdh5/cdh/5/hbase-1.2.0-cdh5.13.0.tar.gz) | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/hbase-1.2.0-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/hbase-1.2.0-cdh5.13.0.CHANGES.txt) |
| Apache Hive     | hive-1.1.0+cdh5.13.0+1269                  | [Tarball](https://archive.cloudera.com/cdh5/cdh/5/hive-1.1.0-cdh5.13.0.tar.gz) | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/hive-1.1.0-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/hive-1.1.0-cdh5.13.0.CHANGES.txt) |
| Hue             | hue-3.9.0+cdh5.13.0+7079                   | [Tarball](https://archive.cloudera.com/cdh5/cdh/5/hue-3.9.0-cdh5.13.0.tar.gz) | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/hue-3.9.0-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/hue-3.9.0-cdh5.13.0.CHANGES.txt) |
| Apache Impala   | impala-2.10.0+cdh5.13.0+0                  | (none)                                                       | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/impala-2.10.0-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/impala-2.10.0-cdh5.13.0.CHANGES.txt) |
| Apache Kudu     | kudu-1.5.0+cdh5.13.0+0                     | (none)                                                       | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/kudu-1.5.0-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/kudu-1.5.0-cdh5.13.0.CHANGES.txt) |
| Apache Oozie    | oozie-4.1.0+cdh5.13.0+458                  | [Tarball](https://archive.cloudera.com/cdh5/cdh/5/oozie-4.1.0-cdh5.13.0.tar.gz) | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/oozie-4.1.0-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/oozie-4.1.0-cdh5.13.0.CHANGES.txt) |
| Cloudera Search | search-1.0.0+cdh5.13.0+0                   | [Tarball](https://archive.cloudera.com/cdh5/cdh/5/search-1.0.0-cdh5.13.0.tar.gz) | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/search-1.0.0-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/search-1.0.0-cdh5.13.0.CHANGES.txt) |
| Apache Solr     | solr-4.10.3+cdh5.13.0+519                  | [Tarball](https://archive.cloudera.com/cdh5/cdh/5/solr-4.10.3-cdh5.13.0.tar.gz) | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/solr-4.10.3-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/solr-4.10.3-cdh5.13.0.CHANGES.txt) |
| Apache Spark    | spark-1.6.0+cdh5.13.0+530                  | [Tarball](https://archive.cloudera.com/cdh5/cdh/5/spark-1.6.0-cdh5.13.0.tar.gz) | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/spark-1.6.0-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/spark-1.6.0-cdh5.13.0.CHANGES.txt) |
| Apache Sqoop    | sqoop-1.4.6+cdh5.13.0+116                  | [Tarball](https://archive.cloudera.com/cdh5/cdh/5/sqoop-1.4.6-cdh5.13.0.tar.gz) | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/sqoop-1.4.6-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/sqoop-1.4.6-cdh5.13.0.CHANGES.txt) |
| Apache Sqoop2   | sqoop2-1.99.5+cdh5.13.0+46                 | [Tarball](https://archive.cloudera.com/cdh5/cdh/5/sqoop2-1.99.5-cdh5.13.0.tar.gz) | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/sqoop2-1.99.5-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/sqoop2-1.99.5-cdh5.13.0.CHANGES.txt) |
| Zookeeper       | zookeeper-3.4.5+cdh5.13.0+118              | [Tarball](https://archive.cloudera.com/cdh5/cdh/5/zookeeper-3.4.5-cdh5.13.0.tar.gz) | [Release notes](https://archive.cloudera.com/cdh5/cdh/5/zookeeper-3.4.5-cdh5.13.0.releasenotes.html) | [Changes](https://archive.cloudera.com/cdh5/cdh/5/zookeeper-3.4.5-cdh5.13.0.CHANGES.txt) |

### CDH免费版和企业版区别

![免费版和企业版功能对比图](http://image.hming.org/HDP与CDH对比/CDH免费版和付费版功能对比图.png)
注：
1.snmp traps：SNMP是指简单网络管理协议，trap是它规定的一种通信方式，用于被管理的设备主动向充当管理者的设备报告自己的异常信息。

[官网参考地址](https://www.cloudera.com/content/dam/www/marketing/resources/datasheets/cloudera-enterprise-datasheet.pdf.landing.html)
截图来自[CSDN](https://blog.csdn.net/levy_cui/article/details/51143092)
![](http://image.hming.org/HDP与CDH对比/官网表1.jpg)
![](http://image.hming.org/HDP与CDH对比/官网表2.jpg)


### CDH官方文档地址（基于6.2.x版本）
安装教程：[https://www.cloudera.com/documentation/enterprise/6/6.2/topics/installation.html](https://www.cloudera.com/documentation/enterprise/6/6.2/topics/installation.html)  

Impala安装要求：[https://www.cloudera.com/documentation/enterprise/6/6.2/topics/impala_prereqs.html](https://www.cloudera.com/documentation/enterprise/6/6.2/topics/impala_prereqs.html)  

集群所使用端口：[https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_ig_ports.html](https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_ig_ports.html)  

集群组件服务主机分配建议：[https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_ig_host_allocations.html](https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_ig_host_allocations.html)  

定制化安装（离线安装）：[https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_ig_custom_installation.html](https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_ig_custom_installation.html)  

Cloudera Manager API：[https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_intro_api.html](https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_intro_api.html)  

基于裸金属部署参考文档：[https://www.cloudera.com/documentation/other/reference-architecture/topics/ra_bare_metal_deployment.html](https://www.cloudera.com/documentation/other/reference-architecture/topics/ra_bare_metal_deployment.html)  

Cloudera Manager常见问题（FAQ）[https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_faqs.html](https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_faqs.html)  

CHD各组件服务依赖项[https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_ig_service_dependencies.html](https://www.cloudera.com/documentation/enterprise/6/6.2/topics/cm_ig_service_dependencies.html)