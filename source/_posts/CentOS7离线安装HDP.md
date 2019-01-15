---
title: CentOS7离线安装HDP
tags:
  - 大数据
  - HDP
  - 离线安装
comments: true
categories:
  - 大数据
  - HDP
thumbnail: ''
date: 2019-01-09 20:07:15
updated: 2019-1-15 20:40:20
password:
---
CentOS7离线安装HDP，Ambari版本：2.7.3.0，HDP版本：3.1.0.0
<!-- more -->
参考链接：[hdp-hadoop离线安装](https://blog.csdn.net/qq_35094452/article/details/81329003)
### 环境准备
#### 配置免密登录
配置免密码登录教程请点击[这里](http://blog.cyanide.top/2018/09/16/Linux%E9%9B%86%E7%BE%A4%E9%85%8D%E7%BD%AE%E5%85%8D%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95/)
#### 关闭防火墙
```shell
# 查看防火墙状态
firewall-cmd --state
# 临时关闭
systemctl stop firewalld
# 禁止开机启动
systemctl disable firewalld
```
#### 关闭selinux
不关闭可能导致Apache http服务无法访问。
1. 即时生效
```shell
setenforce 0
```
2. 永久有效
修改 `/etc/selinux/config` 文件中的 `SELINUX=""` 为 `disabled` ，然后重启。

#### 安装jdk、Python（所有节点）、MySQL（安装一个即可）
1. 配置java环境教程点击[这里](http://blog.cyanide.top/2018/09/14/Linux%E4%B8%8B%E5%AE%89%E8%A3%85Java/)
2. 安装/更新Python `yum -y install python`
3. 离线安装MySQL教程点击[这里](http://blog.cyanide.top/2018/12/08/CentOS7%E4%B8%8B%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85MySQL/)
新建数据库hive、ambari（为后续安装做准备）。
```bash
mysql> create database hive;
Query OK, 1 row affected (0.00 sec)

mysql> create database ambari;
Query OK, 1 row affected (0.00 sec)
```
#### 下载离线包（包含HDP、ambari、HDP-UTILS、HDP-GPL（非必须））
[Ambari-2.7.3.0下载地址](https://docs.hortonworks.com/HDPDocuments/Ambari-2.7.3.0/bk_ambari-installation/content/ambari_repositories.html)
[HDP-3.1.0.0相关包下载地址](https://docs.hortonworks.com/HDPDocuments/Ambari-2.7.3.0/bk_ambari-installation/content/hdp_31_repositories.html)
**`注意：ambari包大小1.9G左右，HDP包8.7G左右，请确保保存路径有足够空间`**
#### 安装httpd服务（Apache服务，ambari-server节点安装即可）
**注意：selinux未关闭可能导致Apache服务地址403。**
```bash
[root@hdp001 ~]# yum -y install httpd
[root@hdp001 ~]# service httpd restart
Redirecting to /bin/systemctl restart httpd.service
```
访问服务器80端口，查看httpd服务是否开启。
**注意：配置信息如端口、映射路径可以通过编辑`/etc/httpd/conf/httpd.conf`文件进行修改**
#### 将压缩包解压到/var/www/html/下
**注意：**
1.如果httpd映射路径修改过，则以修改后的为准。
2.解压后一共约11G左右大小，请确保有足够空间。
--------------------------------------------------------------------这里用ll -h显示大小
```bash
[root@hdp001 ambari]# pwd
/var/www/html/ambari
[root@hdp001 ambari]# ls
ambari-2.7.3.0-centos7.tar.gz  HDP-3.1.0.0-centos7-rpm.tar.gz  HDP-UTILS-1.1.0.22-centos7.tar.gz
# 解压...
[root@hdp001 ambari]# ls
ambari ambari-2.7.3.0-centos7.tar.gz  HDP HDP-3.1.0.0-centos7-rpm.tar.gz  HDP-UTILS HDP-UTILS-1.1.0.22-centos7.tar.gz
```
访问服务器80端口相应/ambari/地址，可以访问到文件和文件夹即可
### 制作本地源
1. 安装工具
    ```bash
    [root@hdp001 ambari]# yum -y install createrepo
    [root@hdp001 ambari]# createrepo ./
    ```
2. 修改repo源文件
    ```bash
    [root@hdp001 ambari]# vim ambari/centos7/2.7.3.0-139/ambari.repo
    ```
    修改`baseurl`与`gpgkey`值为Apache httpd服务能访问到的地址，如下：
    ```bash
    #VERSION_NUMBER=2.7.3.0-139
    [ambari-2.7.3.0]
    #json.url = http://public-repo-1.hortonworks.com/HDP/hdp_urlinfo.json
    name=ambari Version - ambari-2.7.3.0
    baseurl=http://192.168.0.148:80/ambari/ambari/centos7/2.7.3.0-139
    gpgcheck=1
    gpgkey=http://192.168.0.148:80/ambari/ambari/centos7/2.7.3.0-139/RPM-GPG-KEY/RPM-GPG-KEY-Jenkins
    priority=1
    ```
    HDP源修改方式同上
    ```bash
    [root@hdp001 ambari]# vim HDP/centos7/3.1.0.0-78/hdp.repo
    ```
    ```bash
    #VERSION_NUMBER=3.1.0.0-78
    [HDP-3.1.0.0]
    name=HDP Version - HDP-3.1.0.0
    baseurl=http://192.168.0.148:80/ambari/HDP/centos7/3.1.0.0-78
    gpgcheck=1
    gpgkey=http://192.168.0.148:80/ambari/HDP/centos7/3.1.0.0-78/RPM-GPG-KEY/RPM-GPG-KEY-Jenkins
    enabled=1
    priority=1
    
    [HDP-UTILS-1.1.0.22]
    name=HDP-UTILS Version - HDP-UTILS-1.1.0.22
    baseurl=http://192.168.0.148:80/ambari/HDP-UTILS/centos7/1.1.0.22
    gpgcheck=1
    gpgkey=http://192.168.0.148:80/ambari/HDP-UTILS/centos7/1.1.0.22/RPM-GPG-KEY/RPM-GPG-KEY-Jenkins
    enabled=1
    priority=1
    ```
    将repo文件拷贝到`/etc/yum.repos.d/`目录
    ```bash
    [root@hdp001 ambari]# cp ambari/centos7/2.7.3.0-139/ambari.repo /etc/yum.repos.d/
    [root@hdp001 ambari]# cp HDP/centos7/3.1.0.0-78/hdp.repo /etc/yum.repos.d/
    ```
3. 清除yum缓存
    ```bash
    [root@hdp001 ambari]# yum clean all
    ...
    [root@hdp001 ambari]# yum makecache
    ...
    [root@hdp001 ambari]# yum repolist
    ...
    ```
4. 将repo文件拷贝到子节点
    ```bash
    scp...
    ```
### 安装Ambari-server
本次安装使用第三方数据库MySQL模式，默认为PostgreSQL模式（生产环境不推荐）。
需提前准备好MySQL数据库连接jar包，[MySQL连接驱动包下载方法](http://blog.cyanide.top/2018/12/09/MySQL%E8%BF%9E%E6%8E%A5%E9%A9%B1%E5%8A%A8%E5%8C%85%E4%B8%8B%E8%BD%BD%E6%96%B9%E6%B3%95/)
#### 初始化设置
```bash
[root@master1 ~]# ambari-server setup
Using python  /usr/bin/python
Setup ambari-server
Checking SELinux...
SELinux status is 'disabled'
Customize user account for ambari-server daemon [y/n] (n)? y      
Enter user account for ambari-server daemon (root):
Adjusting ambari-server permissions and ownership...
Checking firewall status...
Checking JDK...
Do you want to change Oracle JDK [y/n] (n)? y
[1] Oracle JDK 1.8 + Java Cryptography Extension (JCE) Policy Files 8
[2] Custom JDK
==============================================================================
Enter choice (1): 2
WARNING: JDK must be installed on all hosts and JAVA_HOME must be valid on all hosts.
WARNING: JCE Policy files are required for configuring Kerberos security. If you plan to use Kerberos,please make sure JCE Unlimited Strength Jurisdiction Policy Files are valid on all hosts.
Path to JAVA_HOME: /home/jdk
Validating JDK on Ambari Server...done.
Check JDK version for Ambari Server...
JDK version found: 8
Minimum JDK version is 8 for Ambari. Skipping to setup different JDK for Ambari Server.
Checking GPL software agreement...
GPL License for LZO: https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
Enable Ambari Server to download and install GPL Licensed LZO packages [y/n] (n)? 
Completing setup...
Configuring database...
Enter advanced database configuration [y/n] (n)? y
Configuring database...
==============================================================================
Choose one of the following options:
[1] - PostgreSQL (Embedded)
[2] - Oracle
[3] - MySQL / MariaDB
[4] - PostgreSQL
[5] - Microsoft SQL Server (Tech Preview)
[6] - SQL Anywhere
[7] - BDB
==============================================================================
Enter choice (3): 3
Hostname (192.168.0.148): 
Port (148): 3306
Database name (ambari): 
Username (root): 
Enter Database Password (Y6tSMwsz8e): 
Re-enter password: 
Configuring ambari database...
Configuring remote database connection properties...
WARNING: Before starting Ambari Server, you must run the following DDL directly from the database shell to create the schema: /var/lib/ambari-server/resources/Ambari-DDL-MySQL-CREATE.sql
Proceed with configuring remote database connection properties [y/n] (y)? y
Extracting system views...
.....
Ambari repo file contains latest json url http://public-repo-1.hortonworks.com/HDP/hdp_urlinfo.json, updating stacks repoinfos with it...
Adjusting ambari-server permissions and ownership...
Ambari Server 'setup' completed successfully.

```
根据提示执行DDL语句
```bash
[root@master1 ~]#mysql -uroot -p***
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 5.7.24 MySQL Community Server (GPL)

Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> use ambari;
Database changed
mysql> source /var/lib/ambari-server/resources/Ambari-DDL-MySQL-CREATE.sql;
...
...
```
#### 启动ambari-server
```bash
[root@master1 ~]# ambari-server start
Using python  /usr/bin/python
Starting ambari-server
Ambari Server running with administrator privileges.
Organizing resource files at /var/lib/ambari-server/resources...
Ambari database consistency check started...
Server PID at: /var/run/ambari-server/ambari-server.pid
Server out at: /var/log/ambari-server/ambari-server.out
Server log at: /var/log/ambari-server/ambari-server.log
Waiting for server start........................
Server started listening on 8080

DB configs consistency check: no errors and warnings were found.
Ambari Server 'start' completed successfully.
```
#### 访问服务器8080端口
安装agent时报错：
```bash
...
Connection to node1 closed.
SSH command execution finished
host=node1, exitcode=0
Command end time 2019-01-15 15:52:22

Registering with the server...
Registration with the server failed.
```
解决方法：
报错的节点编辑文件：`/etc/ambari-agent/conf/ambari-agent.ini`，将hostname修改为正确值
```bash
...
[server]
hostname=master1
url_port=8440
secured_url_port=8441
connect_retry_delay=10
max_reconnect_retry_delay=30
...
```
### 使用HDP
#### HDP安装路径
HDP各组件默认安装目录：/usr/hdp/版本号
