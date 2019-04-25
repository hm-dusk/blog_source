---
title: SandBox-HDP使用详解
tags:
  - 大数据
  - HDP
  - SandBox
comments: true
categories:
  - 大数据
  - SandBox
thumbnail: 'http://image.hming.org/logo/sandbox.png'
date: 2019-04-04 09:36:23
updated: 2019-04-04 09:36:23
password:
---
SandBox HDP版本3.0.1
<!-- more -->
官方文档介绍得非常详细，本文提取一些关键点作介绍，参考官网教程：
[Sandbox Docs](https://hortonworks.com/tutorial/hortonworks-sandbox-guide/section/1/)
[Sandbox Port Forwards](https://hortonworks.com/tutorial/hortonworks-sandbox-guide/section/3/)
[Sandbox Architecture](https://hortonworks.com/tutorial/sandbox-architecture/)
[Learning the Ropes of the HDP Sandbox](https://hortonworks.com/tutorial/learning-the-ropes-of-the-hortonworks-sandbox/)
### SandBox是什么
> The Sandbox is a straightforward, pre-configured, learning environment that contains the latest developments from Apache Hadoop, specifically the Hortonworks Data Platform (HDP). The Sandbox comes packaged in a virtual environment that can run in the cloud or on your personal machine. The Sandbox allows you to learn and explore HDP on your own.

SandBox是Hortonworks提供的单机版HDP或HDF环境，主要用于测试和学习使用，对于没有服务器集群又想使用HDP/HDF的情况，SandBox是不二之选。
另外，SandBox里面内置了`DAS（Data Analytics Studio）`，非SandBox版本是没有这个的，需要购买Hortonworks服务才的获取到安装包。
SandBox提供三种安装方式：`VirtualBox虚拟机`、`VMware虚拟机`、`Docker容器`。
本文主要针对讲SandBox-HDP，HDF安装使用和HDP大致相同。
安装教程参考：
[安装SandBox HDP（Docker版）](http://blog.hming.org/2019/04/02/安装SandBox-HDP（Docker版）)
[安装SandBox HDP（VMware版）](http://blog.hming.org/2019/04/02/安装SandBox-HDP（VMware版）)

### 环境准备
一个运行中的SandBox-HDP 3.0.1
### web访问
1080端口为sandbox容器web服务端口，可以通过浏览器访问该端口，得到以下界面：
![sandbox页面](http://image.hming.org/sandbox-hdp使用详解/sandbox页面.png)
左侧launch dashboard直接进入ambari管理界面，登录admin账号需要进入容器修改ambari管理员密码
右侧则是一些链接，包括ambari管理地址、Ranger地址、DAS地址等

4200端口则提供了一个浏览器访问命令行的接口：
![浏览器访问hdp容器](http://image.hming.org/sandbox-hdp使用详解/浏览器访问hdp容器.png)
使用`root`登录，默认密码为`hadoop`，第一次登录会提示修改root密码，对密码强度会有要求
### 登录到HDP环境主机
在运行docker的主机上可以通过`2222`端口登录到HDP docker主机中，也可以通过`docker exec`命令进入
在其他机器上想登录到HDP主机就只能通过SSH了
```bash
# SSH登录需要输入密码，root初始密码为hadoop
[root@sandbox opt]# ssh 127.0.0.1 -p 2222
root@127.0.0.1`s password: 
Last login: Thu Apr  4 08:22:27 2019 from 172.18.0.3
[root@sandbox-hdp ~]# 

# docker命令可以直接进入
[root@sandbox opt]# docker exec -it sandbox-hdp /bin/bash
[root@sandbox-hdp /]# 
```
### 登录到Ambari界面
默认提供的账户，更多账号信息参考[官网](https://hortonworks.com/tutorial/learning-the-ropes-of-the-hortonworks-sandbox/#login-credentials)

|用户|密码|
|:--:|:--:|
|admin|参考[重置管理员密码](http://blog.hming.org/2019/04/04/SandBox-HDP使用详解/#重置Ambari管理员密码)|
|maria_dev|maria_dev|
|raj_ops|raj_ops|
|holger_gov|holger_gov|
|amy_ds|amy_ds|

### 重置Ambari管理员密码
1. 以root用户登录到HDP主机
```bash
[root@sandbox opt]# ssh 127.0.0.1 -p 2222
root@127.0.0.1`s password: 
Last login: Thu Apr  4 08:22:27 2019 from 172.18.0.3
[root@sandbox-hdp ~]# 
```
2. 运行`ambari-admin-password-reset`命令，根据提示修改密码
```bash
[root@sandbox-hdp /]# ambari-admin-password-reset
Please set the password for admin: 
Please retype the password for admin: 

The admin password has been set.
Restarting ambari-server to make the password change effective...

Using python  /usr/bin/python
Restarting ambari-server
Waiting for server stop...
Ambari Server stopped
Ambari Server running with administrator privileges.
Organizing resource files at /var/lib/ambari-server/resources...
Ambari database consistency check started...
Server PID at: /var/run/ambari-server/ambari-server.pid
Server out at: /var/log/ambari-server/ambari-server.out
Server log at: /var/log/ambari-server/ambari-server.log
Waiting for server start....................................................................................................
DB configs consistency check: no errors and warnings were found.
ERROR: Exiting with exit code 1. 
REASON: Server not yet listening on http port 8080 after 90 seconds. Exiting.
```
> 可能会遇到报错
  `ERROR: Exiting with exit code 1. 
   REASON: Server not yet listening on http port 8080 after 90 seconds. Exiting.`
  这是由于SandBox中所有服务都在一个节点上，启动Ambari比较慢，超过了90秒，实际上这个错不会有任何影响
  可以通过编辑`/etc/ambari-server/conf/ambari.properties`文件，添加一行`server.startup.web.timeout = 150`来增加超时时间的方法解决
  
3. 执行命令后Ambari服务会重启，然后就可以通过新的admin密码登录Ambari

### 新增host映射
Ambari中有些内部链接是通过`sandbox-hdp.hortonworks.com`域名去访问的，比如`HDFS NameNode UI`
可以在需要访问的主机上增加host映射方便访问

### 数据库初始密码
#### MySQL
内置MySQL使用的是Hive新建的MySQL，初始密码为`hortonworks1`
#### PostgreSQL
查看ambari用户的密码，默认为bigdata
```bash
[root@sandbox-hdp ~]# grep "password" /etc/ambari-server/conf/ambari.properties
server.jdbc.rca.user.passwd=/etc/ambari-server/conf/password.dat
server.jdbc.user.passwd=/etc/ambari-server/conf/password.dat
[root@sandbox-hdp ~]# cat /etc/ambari-server/conf/password.dat 
bigdata
```
使用ambari用户登录postgreSQL
```bash
[root@sandbox-hdp ~]# psql -U ambari -W
Password for user ambari: 
psql (9.6.11)
Type "help" for help.

ambari=> 
```
登录ambari postgreSQL查找密码
```bash
[root@sandbox-hdp ~]# psql -U ambari -W
Password for user ambari: 
psql (9.6.11)
Type "help" for help.

ambari=> select config_id,type_name,config_data from clusterconfig where type_name='hive-site';
```
在结果里查找内容：javax.jdo.option.ConnectionPassword

### 常见错误
#### 远程向HDFS上传文件失败问题
参照[SandBox HDFS上传文件失败问题](http://blog.hming.org/2019/04/16/SandBox-HDFS%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6%E5%A4%B1%E8%B4%A5%E9%97%AE%E9%A2%98/)