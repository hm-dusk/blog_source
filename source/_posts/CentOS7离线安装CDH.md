---
title: CentOS7离线安装CDH
tags:
  - 大数据
  - CDH
  - 离线安装
comments: true
categories:
  - 大数据
img: ''
date: 2019-08-16 15:03:41
updated: 2019-08-16 15:03:41
password:
cover: true
summary: CentOS7.6离线安装CDP，Cloudera Manager版本：6.3.0，CDH版本：6.3.0-1
---
### 本文环境
|节点|IP地址|
|:---:|:---:|
|cdh.hming.org|192.168.146.111|

### 环境准备

#### 磁盘准备
离线安装包共计3G左右，请保证有足够空间。
保证/opt目录有足够空间，至少20G

#### 网络准备
CDH支持IPV4，不支持IPV6
1. 将主机名设置为全限定域名格式（FQDN：Fully Qualified Domain Name）
`sudo hostnamectl set-hostname cdh.hming.org`
2. 配置/etc/hosts文件，添加集群中所有全限定域名，也可以在后面继续添加非限定名

```bash
192.168.146.111 cdh.hming.org cdh
```

#### 配置免密登录（可选）
如果所有主机节点root用户密码相同，则可以不用配置
配置免密码登录教程请点击[这里](http://blog.hming.org/2018/09/16/Linux%E9%9B%86%E7%BE%A4%E9%85%8D%E7%BD%AE%E5%85%8D%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95/)

#### 关闭防火墙
查看防火墙状态
`firewall-cmd --state`或`systemctl status firewalld`
临时关闭防火墙
`systemctl stop firewalld`
禁止开机启动
`systemctl disable firewalld`

#### 设置SELinux模式
不关闭可能导致Apache http服务无法访问。
1. 查看SELinux状态：`getenforce`
如果是`Permissive`或者`Disabled`则可以继续安装，如果显示`enforcing`，则需要进行以下步骤修改模式
2. 编辑`/etc/selinux/config`文件
3. 修改`SELINUX=enforcing`行内容为`SELINUX=permissive`或者`SELINUX=disabled`
4. 重启系统或者运行`setenforce 0`命令禁用SELinux

#### 配置NTP服务
集群中所有主机必须保持时间同步，如果时间相差较大会引起各种问题，由于本文只有一个节点，故没有安装NPT
参考官网：[https://www.cloudera.com/documentation/enterprise/6/6.3/topics/install_cdh_enable_ntp.html](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/install_cdh_enable_ntp.html)

#### 安装httpd服务（Apache服务，任意一个管理节点安装即可）
> 注意：selinux未关闭可能导致Apache服务地址403。

```bash
[root@cdh ~]# yum -y install httpd
```
修改`/etc/httpd/conf/httpd.conf`配置文件，找到如下行，增加`.parcel`使其支持parcel格式文件
```config
...
AddType application/x-compress .Z
AddType application/x-gzip .gz .tgz .parcel
...
```
启动服务
```bash
[root@cdh ~]# service httpd restart
Redirecting to /bin/systemctl restart httpd.service
```

浏览器访问服务器80端口，查看httpd服务是否开启。
> 注意：配置信息如端口、映射路径可以通过编辑`/etc/httpd/conf/httpd.conf`文件进行修改

#### 下载离线包
##### Cloudera Manager安装包
到官网下载rpm包：[https://archive.cloudera.com/cm6/6.3.0/redhat7/yum/RPMS/x86_64/](https://archive.cloudera.com/cm6/6.3.0/redhat7/yum/RPMS/x86_64/)
![](http://image.hming.org/CentOS7离线安装CDH/cm包下载地址.png)
下载allkeys文件：[https://archive.cloudera.com/cm6/6.3.0/](https://archive.cloudera.com/cm6/6.3.0/)
![](http://image.hming.org/CentOS7离线安装CDH/allkeys文件下载地址.png)

将所有rpm包和allkeys文件一起[制作离线yum源](http://blog.hming.org/2019/03/29/Linux%E5%88%B6%E4%BD%9C%E7%A6%BB%E7%BA%BFyum%E6%BA%90/#toc-heading-6)
> 建议将离线yum源放到httpd服务路径中，方便其他节点访问
> ```bash
> [root@node10 cm6.3.0]# pwd
> /var/www/html/cloudera-repos/cm6.3.0
> [root@node10 cm6.3.0]# ls -l
> total 1378004
> -rw-r--r-- 1 root root      14041 Aug  1 00:08 allkeys.asc
> -rw-r--r-- 1 root root   10479136 Aug 16 16:26 cloudera-manager-agent-6.3.0-1281944.el7.x86_64.rpm
> -rw-r--r-- 1 root root 1201341068 Aug 16 16:26 cloudera-manager-daemons-6.3.0-1281944.el7.x86_64.rpm
> -rw-r--r-- 1 root root      11464 Aug 16 16:26 cloudera-manager-server-6.3.0-1281944.el7.x86_64.rpm
> -rw-r--r-- 1 root root      10996 Aug 16 16:26 cloudera-manager-server-db-2-6.3.0-1281944.el7.x86_64.rpm
> -rw-r--r-- 1 root root   14209884 Aug 16 16:26 enterprise-debuginfo-6.3.0-1281944.el7.x86_64.rpm
> -rw-r--r-- 1 root root  184988341 Aug 16 16:26 oracle-j2sdk1.8-1.8.0+update181-1.x86_64.rpm
> drwxr-xr-x 2 root root       4096 Aug 20 14:48 repodata
> [root@node10 cm6.3.0]# 
> ```

##### CDH安装包
官方有两种离线包可供选择：
1. [Parcel模式（推荐）](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/cm_ig_create_local_parcel_repo.html)（本文使用模式）
2. [Package模式](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/cm_ig_create_local_package_repo.html)
到官网下载parcel包：[https://archive.cloudera.com/cdh6/6.3.0/parcels/](https://archive.cloudera.com/cdh6/6.3.0/parcels/)
![](http://image.hming.org/CentOS7离线安装CDH/cdh包下载地址.png)
下载图中框选的三个文件

#### 将离线包移到httpd服务路径
httpd默认路径为：`/var/www/html/`

> 如果httpd映射路径修改过，则以修改后的为准。

创建`/var/www/html//cloudera-repos/cdh6.3.0/`目录，将parcel包放到该目录中

```bash
[root@cdh cdh6.3.0]# pwd
/var/www/html/cloudera-repos/cdh6.3.0
[root@cdh cdh6.3.0]# ls -l
total 2036848
-rw-r--r-- 1 root root 2085690155 Aug 16 16:25 CDH-6.3.0-1.cdh6.3.0.p0.1279813-el7.parcel
-rw-r--r-- 1 root root         40 Aug 16 16:25 CDH-6.3.0-1.cdh6.3.0.p0.1279813-el7.parcel.sha1
-rw-r--r-- 1 root root      33887 Aug 16 16:25 manifest.json
[root@cdh cdh6.3.0]# 
```

#### 安装MySQL
离线安装MySQL教程点击[这里](http://blog.hming.org/2018/12/08/CentOS7%E4%B8%8B%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85MySQL/)
> 注意安装mysql时需要安装mysql-community-libs-compat-5.7.24-1.el7.x86_64.rpm包，不然安装cm server时会报错：
> Requires: libmysqlclient.so.18()(64bit)

参考[官网](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/cm_ig_mysql.html)，修改`/etc/my.cnf`配置文件，重启mysql服务

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
log_bin=/var/lib/mysql/mysql_binary_log

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
innodb_buffer_pool_size = 4G
innodb_thread_concurrency = 8
innodb_flush_method = O_DIRECT
innodb_log_file_size = 512M

[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

sql_mode=STRICT_ALL_TABLES
```

新建各组件数据库，为后续安装做准备（这里可以根据安装的组件进行选择创建，其中密码`'1234'`建议设置为自己的密码）
```sql
CREATE DATABASE scm DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL ON scm.* TO 'scm'@'%' IDENTIFIED BY '1234';

CREATE DATABASE amon DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL ON amon.* TO 'amon'@'%' IDENTIFIED BY '1234';

CREATE DATABASE rman DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL ON rman.* TO 'rman'@'%' IDENTIFIED BY '1234';

CREATE DATABASE hue DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL ON hue.* TO 'hue'@'%' IDENTIFIED BY '1234';

CREATE DATABASE metastore DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL ON metastore.* TO 'metastore'@'%' IDENTIFIED BY '1234';

CREATE DATABASE sentry DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL ON sentry.* TO 'sentry'@'%' IDENTIFIED BY '1234';

CREATE DATABASE nav DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL ON nav.* TO 'nav'@'%' IDENTIFIED BY '1234';

CREATE DATABASE navms DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL ON navms.* TO 'navms'@'%' IDENTIFIED BY '1234';

CREATE DATABASE oozie DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL ON oozie.* TO 'oozie'@'%' IDENTIFIED BY '1234';

CREATE DATABASE hive DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
GRANT ALL ON hive.* TO 'hive'@'%' IDENTIFIED BY '1234';
```

上传mysql连接包到`/usr/share/java/`目录下（如果没有则创建一个），改名为：`mysql-connector-java.jar`

```bash
[root@cdh java]# pwd
/usr/share/java
[root@cdh java]# ls
mysql-connector-java-5.1.47.jar
[root@cdh java]# mv mysql-connector-java-5.1.47.jar mysql-connector-java.jar 
[root@cdh java]# ls
mysql-connector-java.jar
```

#### 安装jdk
由于我们下载的cloudera cm包中有jdk并且配置好了yum离线源，所以直接用yum安装官方推荐的jdk
安装后的jdk目录为：`/usr/java/jdk1.8.0_181-cloudera`，如有需要，可以自行配置环境变量

```bash
[root@cdh java]# yum -y install oracle-j2sdk1.8
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
Resolving Dependencies
--> Running transaction check
---> Package oracle-j2sdk1.8.x86_64 0:1.8.0+update181-1 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

=======================================================================================================================================================================================
 Package                                          Arch                                    Version                                            Repository                           Size
=======================================================================================================================================================================================
Installing:
 oracle-j2sdk1.8                                  x86_64                                  1.8.0+update181-1                                  cm                                  176 M

Transaction Summary
=======================================================================================================================================================================================
Install  1 Package

Total download size: 176 M
Installed size: 364 M
Downloading packages:
oracle-j2sdk1.8-1.8.0+update181-1.x86_64.rpm                                                                                                                    | 176 MB  00:00:05     
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : oracle-j2sdk1.8-1.8.0+update181-1.x86_64                                                                                                                            1/1 
  Verifying  : oracle-j2sdk1.8-1.8.0+update181-1.x86_64                                                                                                                            1/1 

Installed:
  oracle-j2sdk1.8.x86_64 0:1.8.0+update181-1                                                                                                                                           
Complete!
```

### 安装Cloudera Manager
可以不用手动安装cloudera-manager-daemons，安装server或者agent时会自动安装daemons
```bash
[root@cdh ~]# yum -y install cloudera-manager-daemons cloudera-manager-agent cloudera-manager-server
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
...
Complete!
```

### 初始化Cloudera Manager数据库
参照官网：[https://www.cloudera.com/documentation/enterprise/6/6.3/topics/prepare_cm_database.html](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/prepare_cm_database.html)
由于我们MySQL是安装在本地，所以直接执行

```bash
[root@cdh ~]# /opt/cloudera/cm/schema/scm_prepare_database.sh mysql scm scm
Enter SCM password:  # 输入创建数据库时的密码
JAVA_HOME=/usr/java/jdk1.8.0_181-cloudera
Verifying that we can write to /etc/cloudera-scm-server
Creating SCM configuration file in /etc/cloudera-scm-server
Executing:  /usr/java/jdk1.8.0_181-cloudera/bin/java -cp /usr/share/java/mysql-connector-java.jar:/usr/share/java/oracle-connector-java.jar:/usr/share/java/postgresql-connector-java.jar:/opt/cloudera/cm/schema/../lib/* com.cloudera.enterprise.dbutil.DbCommandExecutor /etc/cloudera-scm-server/db.properties com.cloudera.cmf.db.
Tue Aug 20 02:09:39 EDT 2019 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.
[                          main] DbCommandExecutor              INFO  Successfully connected to database.
All done, your SCM database is configured correctly!
[root@cdh ~]# 
```

> 如果mysql是安装在其他节点（例如：db01.example.com节点），则运行：
> `/opt/cloudera/cm/schema/scm_prepare_database.sh mysql -h db01.example.com --scm-host cm01.example.com scm scm`

### 启动Cloudera Manager Server
输入以下命令启动Server
```bash
[root@cdh ~]# systemctl start cloudera-scm-server
```

使用`tail`命令查看运行日志，当出现`Started Jetty server.`字眼时表示启动成功
```bash
[root@cdh ~]# tail -f /var/log/cloudera-scm-server/cloudera-scm-server.log
2019-08-20 02:13:30,437 INFO main:org.kie.api.internal.utils.ServiceDiscoveryImpl: Loading kie.conf from  jar:file:/opt/cloudera/cm/common_jars/kie-internal-7.13.0.Final.11622bc00754050ffd86f282138da203.jar!/META-INF/kie.conf in classloader sun.misc.Launcher$AppClassLoader@67f89fa3
2019-08-20 02:13:30,438 INFO main:org.kie.api.internal.utils.ServiceDiscoveryImpl: Adding Service org.kie.internal.services.KieAssemblersImpl
...
2019-08-20 02:15:58,334 INFO WebServerImpl:org.eclipse.jetty.server.AbstractConnector: Started ServerConnector@179933a5{HTTP/1.1,[http/1.1]}{0.0.0.0:7180}
2019-08-20 02:15:58,350 INFO WebServerImpl:org.eclipse.jetty.server.Server: Started @193290ms
2019-08-20 02:15:58,350 INFO WebServerImpl:com.cloudera.server.cmf.WebServerImpl: Started Jetty server.
```

### 浏览器访问7180端口，进行CDH安装
Cloudera Manager会根据浏览器的语言进行语言的切换，本文为中文
初始用户名和密码均为：`admin`
![](http://image.hming.org/CentOS7离线安装CDH/cm登录页面.png)
登录后看到第一个欢迎页面，点击继续
![](http://image.hming.org/CentOS7离线安装CDH/欢迎页面1.png)
接受许可条款
![](http://image.hming.org/CentOS7离线安装CDH/接受许可条款.png)
选择安装版本，这里选择免费版（之前免费版会有100个节点限制，现在已经没有了）
![](http://image.hming.org/CentOS7离线安装CDH/选择安装免费版.png)

进入第二个欢迎页面，左边列出了安装的步骤
![](http://image.hming.org/CentOS7离线安装CDH/欢迎页面2.png)
输入集群名称，本文默认
![](http://image.hming.org/CentOS7离线安装CDH/输入集群名称.png)
输入主机名，由于本文只有一台主机，则只输入了一个主机名
![](http://image.hming.org/CentOS7离线安装CDH/输入主机名.png)
配置cloudera manager yum离线库地址，点击更多选项
![](http://image.hming.org/CentOS7离线安装CDH/配置cm库地址.png)
配置parcel库地址，前两个选项默认就行，远程Parcel库删除默认的地址，输入httpd服务的Parcel库地址，点击保存更改
![](http://image.hming.org/CentOS7离线安装CDH/配置parcel库地址.png)
保存后会自动搜索Parcel包，如图，已经搜索到了之前下载的CDH6.3.0包，点击继续
![](http://image.hming.org/CentOS7离线安装CDH/自动搜索本地parcel包.png)
由于之前已经安装过jdk，这里直接选择继续
![](http://image.hming.org/CentOS7离线安装CDH/不再安装jdk.png)
配置ssh，如果主机的密码不相同，则需要选择使用秘钥的形式，如果密码相同，直接输入密码即可
![](http://image.hming.org/CentOS7离线安装CDH/ssh配置.png)
安装cloudera agent（安装过程中遇到问题可以根据提示进行解决），点击继续
![](http://image.hming.org/CentOS7离线安装CDH/安装agent.png)
开始自动安装Parcel包，由于需要拷贝到相应节点然后解压，所以时间消耗比较久，耐心等待完成
![](http://image.hming.org/CentOS7离线安装CDH/安装parcel.png)
进行集群检测，由于本文中只有一个节点，所以不支持网络检测，建议完全通过检测后再点击继续
![](http://image.hming.org/CentOS7离线安装CDH/集群检测.png)
![](http://image.hming.org/CentOS7离线安装CDH/单节点不支持网络检测.png)

开始安装组件服务，可以选择官方的配置方案，也可以选择自定义
![](http://image.hming.org/CentOS7离线安装CDH/安装组件1.png)
本文只选择了Zookeeper进行安装，后续需要什么组件可以另行安装，设置服务安装的节点，点击继续
官网组件服务分配参考：[https://www.cloudera.com/documentation/enterprise/6/6.3/topics/cm_ig_host_allocations.html](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/cm_ig_host_allocations.html)
![](http://image.hming.org/CentOS7离线安装CDH/安装组件2.png)
修改默认配置
![](http://image.hming.org/CentOS7离线安装CDH/安装组件3.png)
等待安装完成
![](http://image.hming.org/CentOS7离线安装CDH/安装组件4.png)
直接点击完成即可
![](http://image.hming.org/CentOS7离线安装CDH/安装组件5.png)
至此CDH安装完成

### 常见问题
#### 无法复制安装文件allkeys.asc
![](http://image.hming.org/CentOS7离线安装CDH/安装agent遇到问题1.png)
因为在配置Cloudera Manager yum库时没有下载`allkeys.asc`文件
解决方法：
到官网：[https://archive.cloudera.com/cm6/6.3.0/](https://archive.cloudera.com/cm6/6.3.0/)下载`allkeys.asc`文件到yum离线库

#### 安装Parcel提示主机运行状况不良
解决方法：
删除agent目录下面的cm_guid文件，并重启失败节点的agent服务恢复
```bash
[root@cdh ~]# cd /var/lib/cloudera-scm-agent/
[root@cdh cloudera-scm-agent]# ls
active_parcels.json  cm_guid  response.avro  uuid
[root@cdh cloudera-scm-agent]# rm -rf cm_guid
[root@cdh cloudera-scm-agent]# service cloudera-scm-agent restart
Stopping cloudera-scm-agent: [ OK ]
Starting cloudera-scm-agent:
```