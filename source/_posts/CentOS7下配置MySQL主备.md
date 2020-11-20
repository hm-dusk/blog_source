---
title: CentOS7下配置MySQL主备
tags:
  - MySQL
  - Linux
comments: true
categories:
  - 数据库
cover: false
top: false
toc: true
img: ''
date: 2020-11-20 15:33:37
updated: 2020-11-20 15:33:37
author:
password:
summary: CentOS7.6配置MySQL主备模式，Mariadb同理
keywords: MySQL,主备
---
参考文章：
[Hadoop实操：0619-MySQL5.7.22主从配置](https://mp.weixin.qq.com/s?__biz=MzI4OTY3MTUyNg==&mid=2247497728&idx=1&sn=db180d0b7ef75c15c66b80d3d8691344&chksm=ec292809db5ea11f9ecdd7d48f81d887f5961f4e5e41cf6dca7c4a46ff9120a4c886e3e327a4&scene=21#wechat_redirect)
[Hadoop实操：如何实现CDH元数据库MySQL的主备](https://mp.weixin.qq.com/s?__biz=MzI4OTY3MTUyNg==&mid=2247484806&idx=1&sn=04714c756e0999ec68785a916f9bdbe3&chksm=ec2ad58fdb5d5c9960d690402cab9d010bda3c7c6e8ec2d9687f73771508dd67bd4a9cb8f6f7&scene=21#wechat_redirect)

之前介绍过如何在CentOS7下离线安装安装MySQL/Mariadb（参考[CentOS7下离线安装MySQL/Mariadb](http://blog.hming.org/2018/12/08/centos7-xia-chi-xian-an-zhuang-mysql/)）
在生产环境中，尤其是MySQL作为Hadoop集群元数据库时，数据库的主从配置显得尤为重要。

### 环境要求

* 两个节点均已安装好MySQL/Mariadb
* 两个节点安装的MySQL/Mariadb版本必须一致
* 主节点必须开启bin-log日志

### 本文示例环境
| 主机名 | 节点类型 | 节点ip          | MySQL版本      | 用户名/密码 |
| ------ | -------- | --------------- | -------------- | ----------- |
| cdh1   | 主节点   | 192.168.136.112 | 5.5.60-MariaDB | root/1234   |
| cdh2   | 从节点   | 192.168.136.113 | 5.5.60-MariaDB | root/1234   |

### 配置过程
#### 历史数据同步（可选）
如果配置主备之前主数据库已经有数据了，则需要手动同步数据到备数据库。
##### 1.锁定主数据库
锁定后，只允许读取不允许写入，这样做的目的是防止备份过程中或备份完成后有新数据插入，导致备份数据与主数据不一致。

```bash
MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| hue                |
| metastore          |
| mysql              |
| oozie              |
| performance_schema |
| scm                |
| sentry             |
+--------------------+
8 rows in set (0.02 sec)

MariaDB [(none)]> flush tables with read lock;
Query OK, 0 rows affected (0.00 sec)

MariaDB [(none)]> create database test;
ERROR 1223 (HY000): Can't execute the query because you have a conflicting read lock
```
> 重启MySQL后锁定失效

##### 2.备份数据
在主节点使用`mysqldump`将需要备份的库导出到sql文件

```bash
[root@cdh1 ~]# mysqldump -uroot -p1234 hue > hue.sql
[root@cdh1 ~]# mysqldump -uroot -p1234 metastore > metastore.sql
[root@cdh1 ~]# mysqldump -uroot -p1234 oozie > oozie.sql
[root@cdh1 ~]# mysqldump -uroot -p1234 scm > scm.sql
[root@cdh1 ~]# mysqldump -uroot -p1234 sentry > sentry.sql
[root@cdh1 ~]# ls | grep sql
hue.sql
metastore.sql
oozie.sql
scm.sql
sentry.sql
[root@cdh1 ~]# 
```

在从节点将备份的sql导入（`需要先创建库`）

```bash
[root@cdh2 ~]# mysql -uroot -p1234 hue < hue.sql 
[root@cdh2 ~]# mysql -uroot -p1234 metastore < metastore.sql 
[root@cdh2 ~]# mysql -uroot -p1234 oozie < oozie.sql 
[root@cdh2 ~]# mysql -uroot -p1234 scm < scm.sql 
[root@cdh2 ~]# mysql -uroot -p1234 sentry < sentry.sql 
[root@cdh2 ~]# 
```

#### Master/Slave配置
##### 1.配置主节点
修改主节点配置文件`vim /etc/my.cnf`，增加/修改如下配置并重启服务：

```bash
log-bin=/var/lib/mysql/mysql_binary_log
server-id=112
binlog_format=MIXED
```
> 配置说明：
> **log-bin**：开启二进制日志，日志文件前缀
> **server-id**：数据库服务的唯一标识确保标识不重复，一般设置为服务器ip的末尾数
> **binlog-format**：设置Mysql binlog记录日志的格式（格式含：Statement、MIXED、ROW），MySQL默认使用的是Statement，推荐使用MIXED。

##### 2.配置从节点
修改从节点配置文件`vim /etc/my.cnf`，增加/修改如下配置并重启服务：

```bash
log-bin=/var/lib/mysql/mysql_binary_log
server-id=113
```

#### 同步用户设置
1. 在cdh1主MySQL上创建一个mysnc用户（用户名密码均为：mysync），并配置权限

```bash
MariaDB [(none)]> GRANT REPLICATION SLAVE ON *.* TO 'mysync'@'192.168.%' IDENTIFIED BY 'mysync';
Query OK, 0 rows affected (0.01 sec)

MariaDB [(none)]> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.00 sec)
```

2. 查看cdh1 MySQL二进制日志File与Position

```bash
MariaDB [(none)]> show master status;
+-------------------------+----------+--------------+------------------+
| File                    | Position | Binlog_Do_DB | Binlog_Ignore_DB |
+-------------------------+----------+--------------+------------------+
| mysql_binary_log.000012 |     7114 |              |                  |
+-------------------------+----------+--------------+------------------+
1 row in set (0.00 sec)
```

3. 在cdh2从MySQL上执行如下SQL

```sql
change master to
master_host='192.168.136.112',
master_user='mysync',
master_password='mysync',
master_log_file='mysql_binary_log.000012',
master_log_pos=7114;

start slave;
```

```bash
MariaDB [(none)]> change master to
    -> master_host='192.168.136.112',
    -> master_user='mysync',
    -> master_password='mysync',
    -> master_log_file='mysql_binary_log.000012',
    -> master_log_pos=7114;
Query OK, 0 rows affected (0.02 sec)

MariaDB [(none)]> start slave;
Query OK, 0 rows affected (0.00 sec)
```

4. 在cdh2从MySQL上查看Slave状态

```bash
MariaDB [(none)]> show slave status \G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.168.136.112
                  Master_User: mysync
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql_binary_log.000012
          Read_Master_Log_Pos: 38426
               Relay_Log_File: mariadb-relay-bin.000002
                Relay_Log_Pos: 536
        Relay_Master_Log_File: mysql_binary_log.000012
             Slave_IO_Running: Yes
            Slave_SQL_Running: No
              Replicate_Do_DB: 
          Replicate_Ignore_DB: 
           Replicate_Do_Table: 
       Replicate_Ignore_Table: 
      Replicate_Wild_Do_Table: 
  Replicate_Wild_Ignore_Table: 
                   Last_Errno: 1032
                   Last_Error: Could not execute Update_rows event on table scm.CM_VERSION; Can't find record in 'CM_VERSION', Error_code: 1032; handler error HA_ERR_END_OF_FILE; the event's master log mysql_binary_log.000012, end_log_pos 7456
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 7114
              Relay_Log_Space: 32144
              Until_Condition: None
               Until_Log_File: 
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File: 
           Master_SSL_CA_Path: 
              Master_SSL_Cert: 
            Master_SSL_Cipher: 
               Master_SSL_Key: 
        Seconds_Behind_Master: NULL
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error: 
               Last_SQL_Errno: 1032
               Last_SQL_Error: Could not execute Update_rows event on table scm.CM_VERSION; Can't find record in 'CM_VERSION', Error_code: 1032; handler error HA_ERR_END_OF_FILE; the event's master log mysql_binary_log.000012, end_log_pos 7456
  Replicate_Ignore_Server_Ids: 
             Master_Server_Id: 112
1 row in set (0.00 sec)
```