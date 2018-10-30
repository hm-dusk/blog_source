---
title: 使用Phoenix操作HBase
tags:
  - 大数据
  - HBase
  - Phoenix
comments: true
categories:
  - 大数据
  - HBase
date: 2018-10-30 20:09:11
updated: 2018-10-30 20:09:11
password:
---
使用Phoenix操作HBase
<!-- more -->
### 1.下载与HBase版本兼容的Phoenix
`apache-phoenix-4.14.0-HBase-1.2-bin.tar.gz`
[下载地址](http://phoenix.apache.org/download.html)

### 2.解压
复制`phoenix-4.14.0-HBase-1.2-server.jar`到`hbase/lib`下并分发

### 3.重启HBase
```bash
[root@hadoopmaster bin]# stop-hbase.sh
...
[root@hadoopmaster bin]# start-hbase.sh
...
```

### 4.使用sqlline.py命令行终端
运行`phoenix/bin/sqlline.py`脚本，连接zookeeper
```bash
[root@hadoopmaster bin]# pwd
/home/phoenix/bin
[root@hadoopmaster bin]# ./sqlline.py hadoop001:2181
```
**报错：**
```bash
Error: SYSTEM.CATALOG (state=08000,code=101)
org.apache.phoenix.exception.PhoenixIOException: SYSTEM.CATALOG
    at org.apache.phoenix.util.ServerUtil.parseServerException(ServerUtil.java:144)
    at org.apache.phoenix.query.ConnectionQueryServicesImpl.metaDataCoprocessorExec(ConnectionQueryServicesImpl.java:1379)
    at org.apache.phoenix.query.ConnectionQueryServicesImpl.metaDataCoprocessorExec(ConnectionQueryServicesImpl.java:1343)
    at org.apache.phoenix.query.ConnectionQueryServicesImpl.getTable(ConnectionQueryServicesImpl.java:1560)
    at org.apache.phoenix.schema.MetaDataClient.updateCache(MetaDataClient.java:643)
    ...
    at sqlline.SqlLine.start(SqlLine.java:398)
    at sqlline.SqlLine.main(SqlLine.java:291)
Caused by: org.apache.hadoop.hbase.TableNotFoundException: SYSTEM.CATALOG
    at org.apache.hadoop.hbase.client.ConnectionManager$HConnectionImplementation.locateRegionInMeta(ConnectionManager.java:1283)
    at org.apache.hadoop.hbase.client.ConnectionManager$HConnectionImplementation.locateRegion(ConnectionManager.java:1181)
    at org.apache.hadoop.hbase.client.ConnectionManager$HConnectionImplementation.locateRegion(ConnectionManager.java:1165)
    ...
    at org.apache.phoenix.query.ConnectionQueryServicesImpl.metaDataCoprocessorExec(ConnectionQueryServicesImpl.java:1362)
    ... 31 more
```
> **解决方案：**
> 查看hdfs中`/hbase/data/default/`目录下是否有`SYSTEM.*`等文件。如果没有，则：
> 1. 停止HBase，保留zookeeper启动
> 2. 执行`hbase clean --cleanZk`命令
> 3. 重新启动HBase，使用Phoenix连接
> 参考链接：[stackoverflow](https://stackoverflow.com/questions/33176081/org-apache-hadoop-hbase-tablenotfoundexception-system-catalog-exception-with-ph)

### 5.连接成功
```bash
[root@hadoopmaster bin]# ./sqlline.py hadoop001:2181
Setting property: [incremental, false]
Setting property: [isolation, TRANSACTION_READ_COMMITTED]
issuing: !connect jdbc:phoenix:hadoop001:2181 none none org.apache.phoenix.jdbc.PhoenixDriver
Connecting to jdbc:phoenix:hadoop001:2181
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/home/apache-phoenix-4.14.0-HBase-1.2-bin/phoenix-4.14.0-HBase-1.2-client.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/opt/hadoop/hadoop-2.7.6/share/hadoop/common/lib/slf4j-log4j12-1.7.10.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
18/10/30 03:59:49 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Connected to: Phoenix (version 4.14)
Driver: PhoenixEmbeddedDriver (version 4.14)
Autocommit status: true
Transaction isolation: TRANSACTION_READ_COMMITTED
Building list of tables and columns for tab-completion (set fastconnect to true to skip)...
133/133 (100%) Done
Done
sqlline version 1.2.0
0: jdbc:phoenix:hadoop001:2181>|
```

### 6.基本操作（常用命令）
```bash
//查看帮助
$sqlline>!help
//列出连接
$sqlline>!list
//显式表
$sqlilne>!tables
//列出所有列
$sqlline>!columns myns.test
//创建表
$sqlline>create table ns1.test(id integer primary key ,name varchar,age integer) ;
//插入数据和更新数据
$sqlline>upsert into myns.test(id,name,age) values(1,’tom’,12)
//删除
$sqlline>delete from myns.test where id = 1 ; 
//条件查询
$sqlline>select * from myns.test where name like ‘t%’ ;
```


