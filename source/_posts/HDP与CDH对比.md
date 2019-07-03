---
title: HDP与CDH对比
tags:
  - 大数据
  - HDP
  - CDH
comments: true
categories:
  - 大数据
  - 选型
thumbnail: ''
date: 2019-07-03 14:25:43
updated: 2019-07-03 14:25:43
password:
---
Hortonworks HDP与Cloudera CDH对比。
<!-- more -->
### CDH版本说明

#### CDH6.X组件版本对应

https://www.cloudera.com/documentation/enterprise/6/release-notes/topics/rg_cdh_6_packaging.html

#### CDH5.X组件版本对应

https://www.cloudera.com/documentation/enterprise/release-notes/topics/cdh_vd_cdh_package_tarball.html

#### Impala版本说明

Impala在3.1之后才支持ORC格式HDFS文件，目前最高版本为3.2，CDH6.1对应的Impala版本为3.1，CDH6.2对应的Impala版本为3.2

#### Docker QuickStart版本说明

Cloudera Quickstart和HDP的sandbox类似，都是单机版的供学习交流使用的大数据集群。
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

### HDP与CDH的区别

#### 版本更新对比

HDP版本更新较快，因为Hortonworks内部大部分员工都是apache代码贡献者，尤其是Hadoop 2.0的贡献者。

CDH版本更新比Apache版本慢。

目前Apache社区Hadoop最新版本：3.2.0

目前CDH最新版支持Hadoop版本：3.0.0

目前HDP最新版支持Hadoop版本：3.1.1

#### 原装支持组件对比

| 必要组件                                   | HDP                     | CDH                                |
| ------------------------------------------ | ----------------------- | ---------------------------------- |
| Zookeeper                                  | √                       | √                                  |
| HDFS                                       | √                       | √                                  |
| Yarn/MapReduce                             | √                       | √                                  |
| Hive                                       | √                       | √                                  |
| HBase                                      | √                       | √                                  |
| Phoenix                                    | √（最高支持5.0）        | ×（需要单独配置，最高支持版本1.3） |
| Spark                                      | √                       | √                                  |
| Zeppelin                                   | √                       | ×（需要自己编译安装）              |
| Oozie                                      | √                       | √                                  |
| Sqoop1                                     | √                       | √                                  |
| Sqoop2                                     | ×                       | √                                  |
| Kafka                                      | √                       | √                                  |
| Flink                                      | ×                       | ×                                  |
| Kerberos                                   | √                       | √                                  |
| **次要组件**                               | **HDP**                 | **CDH**                            |
| Tez                                        | √                       | ×                                  |
| Druid                                      | √                       | ×                                  |
| Knox                                       | √                       | ×                                  |
| Ranger                                     | √                       | ×                                  |
| Storm                                      | √                       | ×                                  |
| Ambari                                     | √                       | ×                                  |
| Nifi                                       | √                       | ×                                  |
| Cloudera Manager                           | ×                       | √                                  |
| HBase Indexer（方便在Solr中建立HBase索引） | ×                       | √                                  |
| [Hue](https://github.com/cloudera/hue/tree/cdh6.2.0)                                        | ×                       | √                                  |
| Impala                                     | ×（需要单独安装）       | √                                  |
| **其他组件**                               | **HDP**                 | **CDH**                            |
| Solr                                       | √                       | √                                  |
| Flume                                      | √（HDP3.0之后不再支持） | √                                  |
| Pig                                        | √                       | ×（CDH6.X不再支持）                |
| Avro                                       | ×                       | √                                  |

### CDH免费版和企业版区别

[官网参考地址](https://www.cloudera.com/content/dam/www/marketing/resources/datasheets/cloudera-enterprise-datasheet.pdf.landing.html)
![免费版和企业版功能对比图](http://image.hming.org/HDP与CDH对比/CDH免费版和付费版功能对比图.png)
