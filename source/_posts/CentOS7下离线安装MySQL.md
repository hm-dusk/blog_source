---
title: CentOS7下离线安装MySQL/Mariadb
tags:
  - MySQL
  - Mariadb
  - Linux
comments: true
categories:
  - 数据库
img: 'http://47.106.179.244/logo/mysql.png'
date: 2018-12-08 14:22:14
updated: 2020-11-20 16:24:14
password:
summary: CentOS7下离线安装MySQL/Mariadb
---
## 安装Mariadb
### 配置离线yum源
配置了离线yum源之后就可以直接用yum命令进行安装，非常方便。
参考：[Linux制作离线yum源](http://blog.hming.org/2019/03/29/linux-zhi-zuo-chi-xian-yum-yuan/)

### 安装Mariadb
直接用yum命令进行安装server

```bash
yum -y install mariadb-server
```

### 修改配置文件（可选）
修改配置文件`/etc/my.cnf`为以下内容

```bash
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
transaction-isolation = READ-COMMITTED
# Disabling symbolic-links is recommended to prevent assorted security risks;
# to do so, uncomment this line:
symbolic-links = 0
# Settings user and group are ignored when systemd is used.
# If you need to run mysqld under a different user or group,
# customize your systemd unit file for mariadb according to the
# instructions in http://fedoraproject.org/wiki/Systemd

key_buffer = 16M
key_buffer_size = 32M
max_allowed_packet = 32M
thread_stack = 256K
thread_cache_size = 64
query_cache_limit = 8M
query_cache_size = 64M
query_cache_type = 1

max_connections = 550
#expire_logs_days = 10
#max_binlog_size = 100M

#log_bin should be on a disk with enough free space.
#Replace '/var/lib/mysql/mysql_binary_log' with an appropriate path for your
#system and chown the specified folder to the mysql user.
#建议单独磁盘装binlog，并且修改目录拥有者为mysql
log_bin=/var/lib/mysql/mysql_binary_log
#日志超过3天自动过期
expire_logs_days = 3

#In later versions of MariaDB, if you enable the binary log and do not set
#a server_id, MariaDB will not start. The server_id must be unique within
#the replicating group.
server_id=1

binlog_format = mixed

read_buffer_size = 2M
read_rnd_buffer_size = 16M
sort_buffer_size = 8M
join_buffer_size = 8M

# InnoDB settings
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit  = 2
innodb_log_buffer_size = 64M
innodb_buffer_pool_size = 4G #内存大小根据实际情况调整，该值超过物理内存会导致Mariadb无法启动
innodb_thread_concurrency = 8
innodb_flush_method = O_DIRECT
innodb_log_file_size = 512M

[mysqld_safe]
log-error=/var/log/mariadb/mariadb.log
pid-file=/var/run/mariadb/mariadb.pid

#
# include all files from the config directory
#
!includedir /etc/my.cnf.d
```

### 启动Mariadb，并加入开机自启动

```bash
systemctl start mariadb
systemctl enable mariadb
```

### 初始化Mariadb

```bash
[root@cdh cdh6.3.0]# mysql_secure_installation
...
Enter current password for root (enter for none): #第一次直接回车
OK, successfully used password, moving on...
...
Set root password? [Y/n] Y
New password: # 设置root密码
Re-enter new password: 
...
Remove anonymous users? [Y/n] Y
...
Disallow root login remotely? [Y/n] N
...
Remove test database and access to it [Y/n] Y
...
Reload privilege tables now? [Y/n] Y
...
All done!  If you've completed all of the above steps, your MariaDB
installation should now be secure.

Thanks for using MariaDB!
```

## 安装MySQL
### 下载社区版离线安装包
本文为`mysql-5.7.24-1.el7.x86_64.rpm-bundle.tar`
下载路径：[https://dev.mysql.com/downloads/mysql/5.7.html#downloads](https://dev.mysql.com/downloads/mysql/5.7.html#downloads)
1. 选择适合CentOS的版本
![下载页面1](http://47.106.179.244/centos7下安装mysql/下载页面1.png)
2. 跳过登录直接下载
![下载页面2](http://47.106.179.244/centos7下安装mysql/下载页面2.png)

### 卸载系统自带的mariadb-lib
```bash
[root@hadoopmaster opt]# rpm -qa|grep mariadb
mariadb-libs-5.5.56-2.el7.x86_64
[root@hadoopmaster opt]# rpm -e --nodeps mariadb-libs-5.5.56-2.el7.x86_64
```

### 解压mysql
1. 使用[rz 命令](http://http://blog.hming.org/2018/08/15/Linux%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/#rz%E4%B8%8Esz%EF%BC%88%E4%B8%8A%E4%BC%A0%E3%80%81%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%EF%BC%89)上传文件到服务器
2. 解压
```bash
[root@hadoopmaster mysql]# tar -xf mysql-5.7.24-1.el7.x86_64.rpm-bundle.tar
[root@hadoopmaster mysql]# ls
mysql-5.7.24-1.el7.x86_64.rpm-bundle.tar
mysql-community-client-5.7.24-1.el7.x86_64.rpm
mysql-community-common-5.7.24-1.el7.x86_64.rpm
mysql-community-devel-5.7.24-1.el7.x86_64.rpm
mysql-community-embedded-5.7.24-1.el7.x86_64.rpm
mysql-community-embedded-compat-5.7.24-1.el7.x86_64.rpm
mysql-community-embedded-devel-5.7.24-1.el7.x86_64.rpm
mysql-community-libs-5.7.24-1.el7.x86_64.rpm
mysql-community-libs-compat-5.7.24-1.el7.x86_64.rpm
mysql-community-minimal-debuginfo-5.7.24-1.el7.x86_64.rpm
mysql-community-server-5.7.24-1.el7.x86_64.rpm
mysql-community-server-minimal-5.7.24-1.el7.x86_64.rpm
mysql-community-test-5.7.24-1.el7.x86_64.rpm
```

### 安装
使用`rpm -ivh`命令依次进行安装
按顺序安装以下软件包
```bash
mysql-community-common-5.7.24-1.el7.x86_64.rpm
mysql-community-libs-5.7.24-1.el7.x86_64.rpm
mysql-community-client-5.7.24-1.el7.x86_64.rpm
mysql-community-server-5.7.24-1.el7.x86_64.rpm
```
有时可能需要安装以下包
```bash
mysql-community-libs-compat-5.7.24-1.el7.x86_64.rpm
```

安装具体如下
```bash
[root@hadoopmaster mysql]# rpm -ivh mysql-community-common-5.7.24-1.el7.x86_64.rpm 
警告：mysql-community-common-5.7.24-1.el7.x86_64.rpm: 头V3 DSA/SHA1 Signature, 密钥 ID 5072e1f5: NOKEY
准备中...                          ################################# [100%]
正在升级/安装...
   1:mysql-community-common-5.7.24-1.e################################# [100%]
[root@hadoopmaster mysql]# rpm -ivh mysql-community-libs-5.7.24-1.el7.x86_64.rpm 
警告：mysql-community-libs-5.7.24-1.el7.x86_64.rpm: 头V3 DSA/SHA1 Signature, 密钥 ID 5072e1f5: NOKEY
准备中...                          ################################# [100%]
正在升级/安装...
   1:mysql-community-libs-5.7.24-1.el7################################# [100%]
[root@hadoopmaster mysql]# rpm -ivh mysql-community-client-5.7.24-1.el7.x86_64.rpm 
警告：mysql-community-client-5.7.24-1.el7.x86_64.rpm: 头V3 DSA/SHA1 Signature, 密钥 ID 5072e1f5: NOKEY
准备中...                          ################################# [100%]
正在升级/安装...
   1:mysql-community-client-5.7.24-1.e################################# [100%]
[root@hadoopmaster mysql]# rpm -ivh mysql-community-server-5.7.24-1.el7.x86_64.rpm
警告：mysql-community-server-5.7.24-1.el7.x86_64.rpm: 头V3 DSA/SHA1 Signature, 密钥 ID 5072e1f5: NOKEY
准备中...                          ################################# [100%]
正在升级/安装...
   1:mysql-community-server-5.7.24-1.e################################# [100%]
```

> 注意：安装mysql-community-server-5.7.24-1.el7.x86_64.rpm时可能会遇到问题:`
> ```bash
> [root@hadoopmaster mysql]# rpm -ivh mysql-community-server-5.7.24-1.el7.x86_64.rpm 
> 警告：mysql-community-server-5.7.24-1.el7.x86_64.rpm: 头V3 DSA/SHA1 Signature, 密钥 ID 5072e1f5: NOKEY
> 错误：依赖检测失败：
>    libaio.so.1()(64bit) 被 mysql-community-server-5.7.24-1.el7.x86_64 需要
>    libaio.so.1(LIBAIO_0.1)(64bit) 被 mysql-community-server-5.7.24-1.el7.x86_64 需要
>    libaio.so.1(LIBAIO_0.4)(64bit) 被 mysql-community-server-5.7.24-1.el7.x86_64 需要
>    net-tools 被 mysql-community-server-5.7.24-1.el7.x86_64 需要
> ```
> 解决办法：
> ```bash
> 1）缺少libaio
> [root@hadoopmaster mysql]# yum -y install libaio
> 2）缺少net-tools
> [root@hadoopmaster mysql]# yum -y install net-tools
> ```

### 初始化数据库
初始化后会在`/var/log/mysqld.log`生成随机密码
```bash
[root@hadoopmaster mysql]# mysqld --initialize
[root@hadoopmaster mysql]# cat /var/log/mysqld.log
2018-12-08T07:53:52.970182Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
2018-12-08T07:53:54.251035Z 0 [Warning] InnoDB: New log files created, LSN=45790
2018-12-08T07:53:54.313973Z 0 [Warning] InnoDB: Creating foreign key constraint system tables.
2018-12-08T07:53:54.388855Z 0 [Warning] No existing UUID has been found, so we assume that this is the first time that this server has been started. Generating a new UUID: 68ce693c-fabe-11e8-a2ff-000c298184c2.
2018-12-08T07:53:54.389442Z 0 [Warning] Gtid table is not ready to be used. Table 'mysql.gtid_executed' cannot be opened.
2018-12-08T07:53:54.390177Z 1 [Note] A temporary password is generated for root@localhost: qHQHahCw(7n)
```
最后一串随机字符串为初始密码，本文中为`qHQHahCw(7n)`

### 修改配置文件（可选）


```bash
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
transaction-isolation = READ-COMMITTED
# Disabling symbolic-links is recommended to prevent assorted security risks;
# to do so, uncomment this line:
symbolic-links = 0

key_buffer_size = 32M
max_allowed_packet = 32M
thread_stack = 256K
thread_cache_size = 64
query_cache_limit = 8M
query_cache_size = 64M
query_cache_type = 1

max_connections = 550
#expire_logs_days = 10
#max_binlog_size = 100M

#log_bin should be on a disk with enough free space.
#Replace '/var/lib/mysql/mysql_binary_log' with an appropriate path for your
#system and chown the specified folder to the mysql user.
#建议单独磁盘装binlog，并且修改目录拥有者为mysql
log_bin=/var/lib/mysql/mysql_binary_log
#日志超过3天自动过期
expire_logs_days = 3

#In later versions of MySQL, if you enable the binary log and do not set
#a server_id, MySQL will not start. The server_id must be unique within
#the replicating group.
server_id=1

binlog_format = mixed

read_buffer_size = 2M
read_rnd_buffer_size = 16M
sort_buffer_size = 8M
join_buffer_size = 8M

# InnoDB settings
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit  = 2
innodb_log_buffer_size = 64M
innodb_buffer_pool_size = 4G #内存大小根据实际情况调整，该值超过物理内存会导致MySQL无法启动
innodb_thread_concurrency = 8
innodb_flush_method = O_DIRECT
innodb_log_file_size = 512M

[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

sql_mode=STRICT_ALL_TABLES
```

### 修改用户及用户组，启动mysql数据库
修改mysql数据库目录的所属用户及其所属组，然后启动mysql数据库
```bash
[root@hadoopmaster mysql]# chown mysql:mysql /var/lib/mysql -R
[root@hadoopmaster mysql]# systemctl start mysqld.service
[root@hadoopmaster mysql]# systemctl status mysqld.service
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: active (running) since 六 2018-12-08 15:59:12 CST; 6s ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 23162 ExecStart=/usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid $MYSQLD_OPTS (code=exited, status=0/SUCCESS)
  Process: 23145 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 23165 (mysqld)
   CGroup: /system.slice/mysqld.service
           └─23165 /usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid

12月 08 15:59:10 hadoopmaster systemd[1]: Starting MySQL Server...
12月 08 15:59:12 hadoopmaster systemd[1]: Started MySQL Server.
```

### 设置开机自启动
查看是否开启开机自启动
```bash
[root@hadoopmaster mysql-install]# systemctl list-unit-files | grep mysqld
mysqld.service                                enabled 
mysqld@.service                               disabled
```
`注意：mysql5.7.23安装后已默认设置为开机启动，如果没有设置，可以使用下面命令设置为开机启动`
```bash
[root@hadoopmaster mysql]# systemctl enable mysqld.service
```

### 登录，更改root用户密码
登录mysql，更改root用户密码`（系统强制要求，否则不能操作mysql）`
```bash
[root@hadoopmaster mysql-install]# mysql -uroot -p'qHQHahCw(7n)'
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.24

Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> set password=password('1234');
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.00 sec)
```

## 远程登录授权
命令为：
`grant all privileges on *.* to 'root'@'%' identified by '1234' with grant option;`
`flush privileges;`
> `*.*` 表示授权任何库任何表，如果想只授权test库的user表可以写为：`test.user`
> `'root'@'%'` 其中root表示以root用户授权，`@`为连接符，`%`表示匹配所有的主机，如果想单独给某主机授权，可以将`%`替换为需要授权的主机`ip地址`
> `'1234'` 表示授权访问的密码，可以自行设置密码 
> 设置授权后需要用`flush privileges`命令刷新一下

示例：
```bash
mysql> grant all privileges on *.* to 'root'@'%' identified by '1234' with grant option;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```