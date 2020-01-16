---
title: '''使用Zookeeper实现HiveServer2的HA'''
tags:
  - 大数据
  - CDH
  - Hive
  - Zookeeper
comments: true
categories:
  - 大数据
img: ''
cover: false
date: 2020-01-16 17:10:18
updated: 2020-01-16 17:10:18
password:
summary: 本文环境：CDH6.3.0，Hive2.1.1，Zookeeper3.4.5
---
本文主要讲述如何使用Zookeeper实现HiveServer2的HA
### 配置过程

#### 修改hive配置
登录Cloduera Manager，进入Hive服务，在配置中搜索`hive-site.xml`，找到`hive-site.xml 的 HiveServer2 高级配置代码段（安全阀）`，增加如下配置（Zookeeper地址修改为当前的地址）

```xml
<property>
    <name>hive.server2.support.dynamic.service.discovery</name>
    <value>true</value>
</property>
<property>
    <name>hive.server2.zookeeper.namespace</name>
    <value>hiveserver2_zk</value>
</property>
<property>
    <name>hive.zookeeper.quorum</name>
    <value>master1:2181,master2:2181,master3:2181</value>
</property>
<property>
    <name>hive.zookeeper.client.port</name>
    <value>2181</value>
</property>
```
修改后点击保存

#### 重启hive服务
根据提示重启hive服务

### 测试是否配置成功
#### 查看Zookeeper注册情况
用zookeeper-client命令进入zookeeper查看hiveserver2_zk节点下所有HiveServer2节点是否注册成功

```bash
[zk: localhost:2181(CONNECTED) 1] ls /hiveserver2_zk
[serverUri=master3.segma.tech:10000;version=2.1.1-cdh6.3.0;sequence=0000000001, serverUri=master2.segma.tech:10000;version=2.1.1-cdh6.3.0;sequence=0000000000]
```

#### 使用连接地址测试连接
连接地址格式为：
```bash
jdbc:hive2://<zookeeper quorum>/<dbName>;ServiceDiscoveryMode=zookeeper;zooKeeperNameSpace=hiveserver2_zk
```
> 数据库名可以为空

用beeline测试连接情况：
```bash
[root@master1 ~]# beeline 
WARNING: Use "yarn jar" to launch YARN applications.
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/mnt/disk/opt/cloudera/parcels/CDH-6.3.0-1.cdh6.3.0.p0.1279813/jars/log4j-slf4j-impl-2.8.2.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/mnt/disk/opt/cloudera/parcels/CDH-6.3.0-1.cdh6.3.0.p0.1279813/jars/slf4j-log4j12-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
Beeline version 2.1.1-cdh6.3.0 by Apache Hive
beeline> !connect jdbc:hive2://master1:2181,master2:2181,master3:2181/default;serviceDiscoveryMode=zooKeeper;zooKeeperNamespace=hiveserver2_zk
Connecting to jdbc:hive2://master1:2181,master2:2181,master3:2181/default;serviceDiscoveryMode=zooKeeper;zooKeeperNamespace=hiveserver2_zk
Enter username for jdbc:hive2://master1:2181,master2:2181,master3:2181/default: hvie
Enter password for jdbc:hive2://master1:2181,master2:2181,master3:2181/default: 
20/01/16 16:02:33 [main]: INFO jdbc.HiveConnection: Connected to master2.segma.tech:10000
Connected to: Apache Hive (version 2.1.1-cdh6.3.0)
Driver: Hive JDBC (version 2.1.1-cdh6.3.0)
Transaction isolation: TRANSACTION_REPEATABLE_READ
0: jdbc:hive2://master1:2181,master2:2181> show databases;
INFO  : Compiling command(queryId=hive_20200116160255_735faaf6-18dd-4de0-8a11-6e12aae92dff): show databases
INFO  : Semantic Analysis Completed
INFO  : Returning Hive schema: Schema(fieldSchemas:[FieldSchema(name:database_name, type:string, comment:from deserializer)], properties:null)
INFO  : Completed compiling command(queryId=hive_20200116160255_735faaf6-18dd-4de0-8a11-6e12aae92dff); Time taken: 1.007 seconds
INFO  : Executing command(queryId=hive_20200116160255_735faaf6-18dd-4de0-8a11-6e12aae92dff): show databases
INFO  : Starting task [Stage-0:DDL] in serial mode
INFO  : Completed executing command(queryId=hive_20200116160255_735faaf6-18dd-4de0-8a11-6e12aae92dff); Time taken: 0.025 seconds
INFO  : OK
+----------------+
| database_name  |
+----------------+
| default        |
+----------------+
1 row selected (1.403 seconds)
```