---
title: CentOS7下离线安装MySQL
tags:
  - MySQL
  - Linux
comments: true
categories:
  - 数据库
thumbnail: 'http://image.hming.org/logo/mysql.png'
date: 2018-12-08 14:22:14
updated: 2019-7-22 15:06:59
password:
---
CentOS7下离线安装MySQL
<!-- more -->
### 下载社区版离线安装包
本文为`mysql-5.7.24-1.el7.x86_64.rpm-bundle.tar`
下载路径：[https://dev.mysql.com/downloads/mysql/5.7.html#downloads](https://dev.mysql.com/downloads/mysql/5.7.html#downloads)
1. 选择适合CentOS的版本
![下载页面1](http://image.hming.org/centos7下安装mysql/下载页面1.png)
2. 跳过登录直接下载
![下载页面2](http://image.hming.org/centos7下安装mysql/下载页面2.png)

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
### 远程登录授权
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