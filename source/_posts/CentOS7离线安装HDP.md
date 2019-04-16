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
thumbnail: 'http://image.hming.org/logo/hdp.png'
date: 2019-01-09 20:07:15
updated: 2019-4-9 09:52:24
password:
---
CentOS7离线安装HDP，Ambari版本：2.7.3.0，HDP版本：3.1.0.0
<!-- more -->
### 本文环境
|节点|IP地址|
|:---:|:---:|
|hdp001|192.168.171.10|
|hdp002|192.168.171.11|
|hdp003|192.168.171.12|
### 环境准备
#### 磁盘准备
离线安装包共计10G左右，解压后共计11G左右，请保证有足够空间。
#### 配置免密登录
配置免密码登录教程请点击[这里](http://blog.hming.org/2018/09/16/Linux%E9%9B%86%E7%BE%A4%E9%85%8D%E7%BD%AE%E5%85%8D%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95/)
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
1. 配置java环境教程点击[这里](http://blog.hming.org/2018/09/14/Linux%E4%B8%8B%E5%AE%89%E8%A3%85Java/)
2. 安装/更新Python `yum -y install python`
3. 离线安装MySQL教程点击[这里](http://blog.hming.org/2018/12/08/CentOS7%E4%B8%8B%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85MySQL/)
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
> 注意：ambari包大小`1.81G`左右，HDP包`8.44G`左右，HDP-UTILS包`86.4M`左右，请确保保存路径有足够空间
#### 安装httpd服务（Apache服务，ambari-server节点安装即可）
> 注意：selinux未关闭可能导致Apache服务地址403。

```bash
[root@hdp001 ~]# yum -y install httpd
[root@hdp001 ~]# service httpd restart
Redirecting to /bin/systemctl restart httpd.service
```

访问服务器80端口，查看httpd服务是否开启。
> 注意：配置信息如端口、映射路径可以通过编辑`/etc/httpd/conf/httpd.conf`文件进行修改
#### 将压缩包解压到/var/www/html/下
> 注意：
> 1.如果httpd映射路径修改过，则以修改后的为准。
> 2.解压后一共约11G左右大小，请确保有足够空间。

```bash
[root@hdp001 ambari]# pwd
/var/www/html/ambari
[root@hdp001 html]# du -h -d 1
11G	./ambari
11G	.
[root@hdp001 ambari]# ls
ambari-2.7.3.0-centos7.tar.gz  HDP-3.1.0.0-centos7-rpm.tar.gz  HDP-UTILS-1.1.0.22-centos7.tar.gz
# 解压...
[root@hdp001 ambari]# ls
ambari ambari-2.7.3.0-centos7.tar.gz  HDP HDP-3.1.0.0-centos7-rpm.tar.gz  HDP-UTILS HDP-UTILS-1.1.0.22-centos7.tar.gz
```

访问服务器80端口相应/ambari/地址，可以访问到文件和文件夹即可
![](http://image.hming.org/CentOS7离线安装HDP/httpd访问ambari地址.png)
### 制作本地源
1. 修改repo源文件
    ```bash
    [root@hdp001 ambari]# vim ambari/centos7/2.7.3.0-139/ambari.repo
    ```
    修改`baseurl`与`gpgkey`值为Apache httpd服务能访问到的地址，如下：
    ```bash
    #VERSION_NUMBER=2.7.3.0-139
    [ambari-2.7.3.0]
    #json.url = http://public-repo-1.hortonworks.com/HDP/hdp_urlinfo.json
    name=ambari Version - ambari-2.7.3.0
    baseurl=http://hdp001:80/ambari/ambari/centos7/2.7.3.0-139
    gpgcheck=1
    gpgkey=http://hdp001:80/ambari/ambari/centos7/2.7.3.0-139/RPM-GPG-KEY/RPM-GPG-KEY-Jenkins
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
    baseurl=http://hdp001:80/ambari/HDP/centos7/3.1.0.0-78
    gpgcheck=1
    gpgkey=http://hdp001:80/ambari/HDP/centos7/3.1.0.0-78/RPM-GPG-KEY/RPM-GPG-KEY-Jenkins
    enabled=1
    priority=1
    
    [HDP-UTILS-1.1.0.22]
    name=HDP-UTILS Version - HDP-UTILS-1.1.0.22
    baseurl=http://hdp001:80/ambari/HDP-UTILS/centos7/1.1.0.22
    gpgcheck=1
    gpgkey=http://hdp001:80/ambari/HDP-UTILS/centos7/1.1.0.22/RPM-GPG-KEY/RPM-GPG-KEY-Jenkins
    enabled=1
    priority=1
    ```
    将repo文件拷贝到`/etc/yum.repos.d/`目录
    ```bash
    [root@hdp001 ambari]# cp ambari/centos7/2.7.3.0-139/ambari.repo /etc/yum.repos.d/
    [root@hdp001 ambari]# cp HDP/centos7/3.1.0.0-78/hdp.repo /etc/yum.repos.d/
    ```
2. 将repo文件拷贝到子节点
    ```bash
    [root@hdp001 ambari]# cd /etc/yum.repos.d/
    [root@hdp001 yum.repos.d]# pwd
    /etc/yum.repos.d
    [root@hdp001 yum.repos.d]# scp ambari.repo hdp002:/etc/yum.repos.d/
    ambari.repo                                                                 100%  329   467.5KB/s   00:00    
    [root@hdp001 yum.repos.d]# scp ambari.repo hdp003:/etc/yum.repos.d/
    ambari.repo                                                                 100%  329   510.4KB/s   00:00    
    [root@hdp001 yum.repos.d]# scp hdp.repo hdp002:/etc/yum.repos.d/
    hdp.repo                                                                    100%  483   570.3KB/s   00:00    
    [root@hdp001 yum.repos.d]# scp hdp.repo hdp003:/etc/yum.repos.d/
    hdp.repo                                                                    100%  483   352.4KB/s   00:00 
    ```
3. 每个节点清除yum缓存，重新建立缓存
    该环节遇到报错说明yum源配置不正确，检查一下所有repo文件
    ```bash
    [root@hdp001 ambari]# yum clean all
    ...
    [root@hdp001 ambari]# yum makecache
    ...
    [root@hdp001 ambari]# yum repolist
    ...
    ```
### 安装Ambari-server
本次安装使用第三方数据库MySQL模式，默认为PostgreSQL模式（生产环境不推荐）。
需提前准备好MySQL数据库连接jar包，[MySQL连接驱动包下载方法](http://blog.hming.org/2018/12/09/MySQL%E8%BF%9E%E6%8E%A5%E9%A9%B1%E5%8A%A8%E5%8C%85%E4%B8%8B%E8%BD%BD%E6%96%B9%E6%B3%95/)
#### Ambari-server节点（主节点）安装Ambari-server
```bash
[root@hdp001 ~]# yum -y install ambari-server
...
```
#### 初始化设置
使用`ambari-server setup`命令进行初始化操作。

> 以下代码段中`#(1)`类似标识为注解。

```bash
[root@hdp001 home]# ambari-server setup
Using python  /usr/bin/python
Setup ambari-server
Checking SELinux...
SELinux status is 'disabled'
Customize user account for ambari-server daemon [y/n] (n)? y  #(1)选择自定义配置
Enter user account for ambari-server daemon (root):  #(2)选择用户
Adjusting ambari-server permissions and ownership...
Checking firewall status...
Checking JDK...
[1] Oracle JDK 1.8 + Java Cryptography Extension (JCE) Policy Files 8
[2] Custom JDK
==============================================================================
Enter choice (1): 2  #(3)选择2，自定义jdk
WARNING: JDK must be installed on all hosts and JAVA_HOME must be valid on all hosts.
WARNING: JCE Policy files are required for configuring Kerberos security. If you plan to use Kerberos,please make sure JCE Unlimited Strength Jurisdiction Policy Files are valid on all hosts.
Path to JAVA_HOME: /home/jdk  #(4)输入自己安装的jdk路径
Validating JDK on Ambari Server...done.
Check JDK version for Ambari Server...
JDK version found: 8
Minimum JDK version is 8 for Ambari. Skipping to setup different JDK for Ambari Server.
Checking GPL software agreement...
GPL License for LZO: https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
Enable Ambari Server to download and install GPL Licensed LZO packages [y/n] (n)?   #(5)是否安装GPL，这里默认选择否
Completing setup...
Configuring database...
Enter advanced database configuration [y/n] (n)? y  #(6)高级数据库配置，选是
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
Enter choice (1): 3  #(7)选择MySQL
Hostname (localhost): hdp002  #(8)MySQL地址，这里选择hdp002主机上安装的MySQL
Port (3306):    #(9)MySQL端口，默认3306
Database name (ambari):     #(10)MySQL中数据库名称，默认ambari（之前步骤提前建好的）
Username (ambari): root     #(11)MySQL用户名
Enter Database Password (bigdata):  #(12)MySQL密码
Re-enter password:      #(13)再次输入密码
Configuring ambari database...
Enter full path to custom jdbc driver: /home/mysql-connector-java-5.1.47.jar    #(14)这里输入提前准备好的MySQL连接包地址
Copying /home/mysql-connector-java-5.1.47.jar to /usr/share/java
Configuring remote database connection properties...
WARNING: Before starting Ambari Server, you must run the following DDL directly from the database shell to create the schema:
/var/lib/ambari-server/resources/Ambari-DDL-MySQL-CREATE.sql     #(15)这里会提示开启ambari服务之前需要执行DDl建表语句
Proceed with configuring remote database connection properties [y/n] (y)?    #(16)继续配置远程数据库连接属性
Extracting system views...
ambari-admin-2.7.3.0.139.jar
....
Ambari repo file contains latest json url http://public-repo-1.hortonworks.com/HDP/hdp_urlinfo.json, updating stacks repoinfos with it...
Adjusting ambari-server permissions and ownership...
Ambari Server 'setup' completed successfully.
```
根据上文提示执行DDL语句。
将`/var/lib/ambari-server/resources/Ambari-DDL-MySQL-CREATE.sql`文件拷贝到MySQL安装节点，并在ambari数据库中执行该脚本。
```bash
[root@hdp001 home]# scp /var/lib/ambari-server/resources/Ambari-DDL-MySQL-CREATE.sql hdp002:/home
Ambari-DDL-MySQL-CREATE.sql                                        100%   82KB  39.1MB/s   00:00
```
```bash
[root@hdp002 home]# pwd
/home
[root@hdp002 home]# ls
Ambari-DDL-MySQL-CREATE.sql  jdk

[root@hdp002 home]# mysql -uroot -p
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 4
Server version: 5.7.24 MySQL Community Server (GPL)

Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> use ambari;
Database changed
mysql> source /home/Ambari-DDL-MySQL-CREATE.sql;
...
...
```
#### 启动ambari-server
执行`ambari-server start`命令启动服务
```bash
[root@hdp001 home]# ambari-server start
Using python  /usr/bin/python
Starting ambari-server
Ambari Server running with administrator privileges.
ERROR: Exiting with exit code -1. 
REASON: Before starting Ambari Server, you must copy the MySQL JDBC driver JAR file to
/usr/share/java and set property "server.jdbc.driver.path=[path/to/custom_jdbc_driver]" in ambari.properties.
```
报错。根据提示信息，将MySQL连接包拷贝到`/usr/share/java/`目录下，并设置参数路径（也可在之后安装hive相关组件时设置该参数）。
可能会遇到`/usr/share/java`不是一个目录的情况，此时删掉该文件，新建一个java目录即可。
```bash
[root@hdp001 home]# cp /home/mysql-connector-java-5.1.47.jar /usr/share/java/
```
再次启动ambari-server即可启动成功
```bash
[root@hdp001 home]# ambari-server start
Using python  /usr/bin/python
Starting ambari-server
Ambari Server running with administrator privileges.
Organizing resource files at /var/lib/ambari-server/resources...
Ambari database consistency check started...
Server PID at: /var/run/ambari-server/ambari-server.pid
Server out at: /var/log/ambari-server/ambari-server.out
Server log at: /var/log/ambari-server/ambari-server.log
Waiting for server start............................................................
Server started listening on 8080

DB configs consistency check: no errors and warnings were found.
Ambari Server 'start' completed successfully.
```

#### 访问服务器8080端口
默认用户名和密码都为admin
![](http://image.hming.org/CentOS7离线安装HDP/ambari登录页面.png)
根据提示安装集群
![](http://image.hming.org/CentOS7离线安装HDP/根据提示安装集群.png)
设置集群名字，比如my_hadoop
![](http://image.hming.org/CentOS7离线安装HDP/为集群起名字.png)
选择HDP版本，配置yum源地址
![](http://image.hming.org/CentOS7离线安装HDP/HDP版本选择与yum源地址配置.png)
配置host与ssh
![](http://image.hming.org/CentOS7离线安装HDP/配置host与ssh.png)
确认后开始在节点上安装ambari-agent
![](http://image.hming.org/CentOS7离线安装HDP/agent安装页面.png)

> 安装agent时可能报错：
> ```bash
> ...
> Connection to node1 closed.
> SSH command execution finished
> host=node1, exitcode=0
> Command end time 2019-01-15 15:52:22
> 
> Registering with the server...
> Registration with the server failed.
> ```
> 解决方法：
> 报错的节点编辑文件：`/etc/ambari-agent/conf/ambari-agent.ini`，将hostname修改为正确值
> ```bash
> ...
> [server]
> hostname=master1
> url_port=8440
> secured_url_port=8441
> connect_retry_delay=10
> max_reconnect_retry_delay=30
> ...
> ```

ambari-agent安装成功
![](http://image.hming.org/CentOS7离线安装HDP/agent安装成功.png)
选择hadoop组件进行安装，建议安装少量组件，之后可以再添加
![](http://image.hming.org/CentOS7离线安装HDP/选择需要安装的hadoop组件.png)
选择主节点安装位置（如NameNode）
![](http://image.hming.org/CentOS7离线安装HDP/选择主节点.png)
选择从节点安装位置（如DataNode）
![](http://image.hming.org/CentOS7离线安装HDP/选择从节点.png)
进行其他设置（如密码、数据保存路径、用户/用户组、参数配置等）
![](http://image.hming.org/CentOS7离线安装HDP/其他设置1.png)
![](http://image.hming.org/CentOS7离线安装HDP/其他设置2.png)
![](http://image.hming.org/CentOS7离线安装HDP/其他设置3.png)
![](http://image.hming.org/CentOS7离线安装HDP/其他设置4.png)
配置完成后，查看配置项是否无误，确认无误后点击发布开始安装
![](http://image.hming.org/CentOS7离线安装HDP/配置完成确认安装.png)
等待安装进度完成即可，如果安装过程中出错，可根据报错信息进行修改直到安装成功
![](http://image.hming.org/CentOS7离线安装HDP/hadoop组件安装进度.png)

### 使用HDP
#### HDP安装路径
|名称|安装路径|
|:---:|:---:|
|HDP各组件默认安装目录|/usr/hdp/版本号|
|ambari-server安装目录|/usr/lib/ambari-server|
|ambari-agent安装目录|/usr/lib/ambari-agent|
|日志安装目录|/var/log|
ambari安装的hdp路径是不能更改的，但是可以用软链接将以上路径链接到其他路径。