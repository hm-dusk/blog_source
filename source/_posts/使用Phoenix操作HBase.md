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
updated: 2018-12-18 11:12:53
password:
thumbnail: 'http://image.cyanide.top/logo/phoenix+hbase.png'
---
使用Phoenix操作HBase
<!-- more -->
HBase集群环境搭建参考：[CentOS7下搭建HBase集群+HBase基本操作](http://blog.cyanide.top/2018/12/15/CentOS7%E4%B8%8B%E6%90%AD%E5%BB%BAHBase%E9%9B%86%E7%BE%A4+HBase%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C/)
### 下载与HBase版本兼容的Phoenix
`apache-phoenix-4.14.1-HBase-1.4-bin.tar.gz`
下载地址：[http://archive.apache.org/dist/phoenix/](http://archive.apache.org/dist/phoenix/)

### 解压
复制`phoenix-4.14.1-HBase-1.4-server.jar`到`hbase/lib`下并分发到从节点
```bash
[root@hadoopmaster phoenix]# pwd
/home/phoenix
[root@hadoopmaster phoenix]# cp phoenix-4.14.1-HBase-1.4-server.jar /home/hbase/lib/
//分发
[root@hadoopmaster phoenix]# scp phoenix-4.14.1-HBase-1.4-server.jar hadoop001:/home/hbase/lib/
phoenix-4.14.1-HBase-1.4-server.jar                     100%   40MB  60.4MB/s   00:00    
[root@hadoopmaster phoenix]# scp phoenix-4.14.1-HBase-1.4-server.jar hadoop002:/home/hbase/lib/
phoenix-4.14.1-HBase-1.4-server.jar                     100%   40MB  55.1MB/s   00:00    
```
### 重启HBase
```bash
[root@hadoopmaster bin]# stop-hbase.sh
...
[root@hadoopmaster bin]# start-hbase.sh
...
```

### 使用sqlline.py命令行终端
运行`phoenix/bin/sqlline.py`脚本，连接zookeeper
```bash
[root@hadoopmaster bin]# pwd
/home/phoenix/bin
[root@hadoopmaster bin]# ./sqlline.py hadoopmaster:2181
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

### 连接成功
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
0: jdbc:phoenix:hadoopmaster:2181>|
```

### 开启schema对应namespace
**Phoenix默认使用的是HBase中default名字空间（namespace），如果要用自定义的namespace，Phoenix中与之对应的是schema的概念，但是默认是关闭的，需要单独配置。**
1. 在`hbase/conf/hbase-site.xml`、`phoenix/bin/hbase-site.xml`两个文件中增加以下代码：
```xml
    <property>
      <name>phoenix.schema.isNamespaceMappingEnabled</name>
      <value>true</value>
    </property>
    <property>
      <name>phoenix.schema.mapSystemTablesToNamespace</name>
      <value>true</value>
    </property>
```
2. 如果HBase是分布式，则需要将文件分发到其他节点
（最好是将该文件也复制到`phoenix/bin/`保证客户端与服务端的一致性）
```bash
[root@hadoopmaster conf]# scp hbase-site.xml hadoop001:/home/hbase/conf/
hbase-site.xml                              100% 1569     2.2MB/s   00:00    
[root@hadoopmaster conf]# scp hbase-site.xml hadoop002:/home/hbase/conf/
hbase-site.xml                              100% 1569     1.6MB/s   00:00    
```
3. 重启HBase，重新连接
**`报错：Error: ERROR 726 (43M10):  Inconsistent namespace mapping properties. Ensure that config phoenix.schema.isNamespaceMappingEnabled is consistent on client and server. (state=43M10,code=726)`**
```bash
[root@hadoopmaster conf]#sqlline.py hadoopmaster:2181
Setting property: [incremental, false]
Setting property: [isolation, TRANSACTION_READ_COMMITTED]
issuing: !connect jdbc:phoenix:hadoopmaster:2181 none none org.apache.phoenix.jdbc.PhoenixDriver
Connecting to jdbc:phoenix:hadoopmaster:2181
18/12/18 09:41:04 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Error: ERROR 726 (43M10):  Inconsistent namespace mapping properties. Ensure that config phoenix.schema.isNamespaceMappingEnabled is consistent on client and server. (state=43M10,code=726)
java.sql.SQLException: ERROR 726 (43M10):  Inconsistent namespace mapping properties. Ensure that config phoenix.schema.isNamespaceMappingEnabled is consistent on client and server.
	at org.apache.phoenix.exception.SQLExceptionCode$Factory$1.newException(SQLExceptionCode.java:494)
	at org.apache.phoenix.exception.SQLExceptionInfo.buildException(SQLExceptionInfo.java:150)
	at org.apache.phoenix.query.ConnectionQueryServicesImpl.checkClientServerCompatibility(ConnectionQueryServicesImpl.java:1310)
	at org.apache.phoenix.query.ConnectionQueryServicesImpl.ensureTableCreated(ConnectionQueryServicesImpl.java:1154)
	at org.apache.phoenix.query.ConnectionQueryServicesImpl.createTable(ConnectionQueryServicesImpl.java:1491)
	at org.apache.phoenix.schema.MetaDataClient.createTableInternal(MetaDataClient.java:2725)
	at org.apache.phoenix.schema.MetaDataClient.createTable(MetaDataClient.java:1114)
	at org.apache.phoenix.compile.CreateTableCompiler$1.execute(CreateTableCompiler.java:192)
	at org.apache.phoenix.jdbc.PhoenixStatement$2.call(PhoenixStatement.java:408)
	at org.apache.phoenix.jdbc.PhoenixStatement$2.call(PhoenixStatement.java:391)
	at org.apache.phoenix.call.CallRunner.run(CallRunner.java:53)
	at org.apache.phoenix.jdbc.PhoenixStatement.executeMutation(PhoenixStatement.java:390)
	at org.apache.phoenix.jdbc.PhoenixStatement.executeMutation(PhoenixStatement.java:378)
	at org.apache.phoenix.jdbc.PhoenixStatement.executeUpdate(PhoenixStatement.java:1806)
	at org.apache.phoenix.query.ConnectionQueryServicesImpl$12.call(ConnectionQueryServicesImpl.java:2536)
	at org.apache.phoenix.query.ConnectionQueryServicesImpl$12.call(ConnectionQueryServicesImpl.java:2499)
	at org.apache.phoenix.util.PhoenixContextExecutor.call(PhoenixContextExecutor.java:76)
	at org.apache.phoenix.query.ConnectionQueryServicesImpl.init(ConnectionQueryServicesImpl.java:2499)
	at org.apache.phoenix.jdbc.PhoenixDriver.getConnectionQueryServices(PhoenixDriver.java:255)
	at org.apache.phoenix.jdbc.PhoenixEmbeddedDriver.createConnection(PhoenixEmbeddedDriver.java:150)
	at org.apache.phoenix.jdbc.PhoenixDriver.connect(PhoenixDriver.java:221)
	at sqlline.DatabaseConnection.connect(DatabaseConnection.java:157)
	at sqlline.DatabaseConnection.getConnection(DatabaseConnection.java:203)
	at sqlline.Commands.connect(Commands.java:1064)
	at sqlline.Commands.connect(Commands.java:996)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at sqlline.ReflectiveCommandHandler.execute(ReflectiveCommandHandler.java:38)
	at sqlline.SqlLine.dispatch(SqlLine.java:809)
	at sqlline.SqlLine.initArgs(SqlLine.java:588)
	at sqlline.SqlLine.begin(SqlLine.java:661)
	at sqlline.SqlLine.start(SqlLine.java:398)
	at sqlline.SqlLine.main(SqlLine.java:291)
sqlline version 1.2.0
```
`原因：hbase和Phoenix配置不一致导致，需要将上述两个地方的文件都作修改。`

### 基本操作（常用命令）
**注意：HBase是大小写敏感，Phoenix操作时需要添加双引号，如果不添加双引号的话会统一转换成大写**
```bash
//查看帮助
$sqlline> !help
//列出连接
$sqlline> !list
//显式表
$sqlilne> !tables
//列出所有列
$sqlline> !columns myns.test
//创建schema（相当于数据库）
$sqlline> create schema wndb;
//删除表结构
$sqlline> drop table "test";
//创建表
$sqlline> create table "ns1"."test"(id integer primary key ,name varchar,age integer) ;
//创建表并指定列族
$sqlline> create table "ns1"."test"(id integer primary key ,"cf1".name varchar,"cf2".age integer) ;
//插入数据和更新数据
$sqlline> upsert into "myns"."test"(id,name,age) values(1,'tom',12)
//删除
$sqlline> delete from "myns"."test" where id = 1 ; 
//条件查询
$sqlline> select * from "myns"."test" where name like 't%' ;
```


