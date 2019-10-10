---
title: Impala配置自动同步Hive元数据
tags:
  - 大数据
  - CDH
  - Impala
  - 元数据
comments: true
categories:
  - 大数据
img: ''
cover: false
date: 2019-09-10 15:12:15
updated: 2019-09-10 15:12:15
password:
summary: Impala同步Hive元数据是一大问题，好在CDH6.3.0推出了自动同步的配置
---
### 原理解释
Impala使用Catalog服务进行元数据的管理，Catalog使用StateStore进行元数据同步分发到各个Impalad服务。
Impala使用两个元数据：
* 来自Hive Metastore的目录信息
* 来自NameNode的文件元数据。

在通过非Impala操作修改数据时（如：Hive操作、Spark操作Hive、HDFS直接操作表文件等），Impala是无感知的，此时需要在Impala端进行手动刷新元数据，手动刷新有两种方式:
* [REFRESH](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/impala_refresh.html#refresh)
* [INVALIDATE METADATA](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/impala_invalidate_metadata.html)

### 问题描述
由于全局刷新`invalidate metadata`语句会丢弃所有的元数据，导致没有更新的表再次查询也会去拉取元数据（造成延迟），所以不能采用这种方式（官网不推荐）。
所以只能使用`invalidate metadata [表名]`或者`refresh [表名]`的方式。但是这样会有一个问题，需要知道表名，

### 配置步骤
1. 查看`impala catalog server web UI`
`/metrics`
`events`
发现只有一个`events-processor.status`为`DISABLED`
2. 在impala配置中找 `Catalog Server 命令行参数高级配置代码段（安全阀） `
加入 `--hms_event_polling_interval_s=1`（短横线中间不能有空格）
3. 此时直接重启impala会报错
4. 进入hive配置页面
勾选 `启用数据库中的存储通知`
在搜索框输入`hive-site.xml`
在 `hive-site.xml 的 Hive Metastore Server 高级配置代码段（安全阀）` 中添加两个值
Name: hive.metastore.notifications.add.thrift.objects
Value: true
Name: hive.metastore.alter.notifications.basic
Value: false

在 `hive-site.xml 的 Hive 服务高级配置代码段（安全阀）` 中添加
Name: hive.metastore.dml.events
Value: true

在 `hive-site.xml 的 Hive 客户端高级配置代码段（安全阀）` 中添加
Name: hive.metastore.dml.events
Value: true

### 剩余的坑