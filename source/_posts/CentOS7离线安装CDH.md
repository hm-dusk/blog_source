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
环境准备部分参考文章：[Hadoop实操：CDH安装前置准备](https://mp.weixin.qq.com/s?__biz=MzI4OTY3MTUyNg==&mid=2247485512&idx=1&sn=9e953a7eb8b3b2a64a011550ab7da184&chksm=ec2ad841db5d51573f5913d14c33135180bca023de1c349fc431f561c055d1d085527107b66e&scene=21#wechat_redirect)

### 本文环境
|       节点        |   IP地址    |
| :---------------: | :---------: |
| master1.hming.org | 172.16.0.2  |
| master2.hming.org | 172.16.0.5  |
| master3.hming.org | 172.16.0.6  |
|  node1.hming.org  | 172.16.0.12 |
|  node2.hming.org  | 172.16.0.13 |
|  node3.hming.org  | 172.16.0.15 |

**服务器配置：**
CPU：16核
内存：64G
磁盘：管理节点外挂一块2T HDD到/mnt/data01目录，工作节点挂载三块2T HDD到/mnt/data01-03目录

**组件角色分配表：**
![](http://image.hming.org/CentOS7离线安装CDH/角色分配表.png)

### 环境准备

#### 节点数量
1. 最小规模，建议最小`4`台服务器，1个管理节点安装Cloudera Manager和NameNode等服务，其他3个作为工作节点，因为没有任何的高可用，所以该规模只能用于开发测试。
2. 建议规模，生产环境中建议最小`6`台服务器，3台管理节点+3台工作节点，1个管理节点安装Cloudera Manager，另外2个安装NameNode高可用，常见的较小规模生产系统一般为`10-20`台服务器。

附：[官方服务角色分配方案](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/cm_ig_host_allocations.html)

#### 硬件要求
以下Cloudera Manager，NameNode和DataNode相同：

CPU：最少4 cores，推荐2路8核，2路10核，2路12核
内存：最小16GB，推荐128GB-256GB
网络：最小千兆，推荐两张万兆绑定
磁盘：系统盘参考下面`系统盘/目录分配要求`章节，数据盘，工作节点推荐12块1TB-4TB的SATA/SAS盘，管理节点推荐1-2块1TB-4TB的SATA/SAS盘（具体配置可根据实际情况而定）

附：[官方硬件要求说明](https://www.cloudera.com/documentation/enterprise/6/release-notes/topics/rg_hardware_requirements.html#concept_vvv_cxt_gbb)

#### 系统盘/目录分配要求
**目录分配方案一：**
如果只有一个根目录`/`建议工作节点最少`100G`，管理节点因为会存放MySQL数据以及一些监控数据，可以选择`200G`以上

**目录分配方案二：**

|目录|分配空间|
|:--:|:--:|
|/|可以默认比如10GB|
|/opt|大于50GB|
|/usr|大于50GB|
|/var|大于20GB|
|/var/log|大于50GB|
|/var/lib|大于50GB|
|/tmp|大于20GB|
 
**目录分配方案三：**

|目录|分配空间|
|:--:|:--:|
|/|可以默认比如10GB|
|/opt|大于50GB|
|/usr|大于50GB|
|/var|大于50GB|
|/tmp|大于20GB|

#### 磁盘要求
1. [磁盘阵列](https://baike.baidu.com/item/%E7%A3%81%E7%9B%98%E9%98%B5%E5%88%97/1149823?fromtitle=RAID&fromid=33858)要求：
工作节点（DataNode/NodeManager），系统盘可以使用[RAID1](https://baike.baidu.com/item/RAID%201)或者[RAID10](https://baike.baidu.com/item/RAID%2010)，数据盘不要使用[RAID](https://baike.baidu.com/item/%E7%A3%81%E7%9B%98%E9%98%B5%E5%88%97/1149823?fromtitle=RAID&fromid=33858)，应该为[JBOD](https://baike.baidu.com/item/JBOD)。
管理节点（NameNode，Zookeeper，JournalNode），可以使用[RAID](https://baike.baidu.com/item/%E7%A3%81%E7%9B%98%E9%98%B5%E5%88%97/1149823?fromtitle=RAID&fromid=33858)或者[JBOD](https://baike.baidu.com/item/JBOD)，因为管理节点对`I/O`延迟比较敏感，建议将NN，ZK，JN存放数据的目录配置为不同的目录，并且对应到不同的磁盘。

2. DataNode数据盘格式建议选择`ext4`或`xfs`，并配置`noatime`，比如：
```bash
[root@cdh ~]# cat /etc/fstab
/dev/sda1  /data/1    xfs   defaults,noatime      1 2
/dev/sdb1  /data/2    xfs   defaults,noatime      1 2
/dev/sdc1  /data/3    xfs   defaults,noatime      1 2
/dev/sdd1  /data/4    xfs   defaults,noatime      1 2
/dev/sde1  /data/5    xfs   defaults,noatime      1 2
/dev/sdf1  /data/6    xfs   defaults,noatime      1 2
...
/dev/sdx1  /data/x    xfs    defaults,noatime      1 2
[root@cdh ~]# fdisk -l
```
  注意: `noatime`已经包含了`nodiratime`。不需要同时指定。
  > 参考：
  > [fstab atime 参数](https://wiki.archlinux.org/index.php/Fstab_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)#atime_%E5%8F%82%E6%95%B0)
  > [what is noatime](https://www.linuxquestions.org/questions/linux-software-2/what-is-noatime-how-can-i-mount-a-partition-with-noatime-393617/)
  > 默认的方式下linux会把文件访问的时间atime做记录，文件系统在文件被访问、创建、修改等的时候记录下了文件的一些时间戳，比如：文件创建时间、最近一次修改时间和最近一次访问时间；这在绝大部分的场合都是没有必要的。 
  > 因为系统运行的时候要访问大量文件，如果能减少一些动作（比如减少时间戳的记录次数等）将会显著提高磁盘 IO 的效率、提升文件系统的性能。 

3. DataNode数据盘确保没有配置分区卷LogicalVolume Manager (LVM)
```bash
[root@cdh ~]# df –h
[root@cdh ~]# lsblk
[root@cdh ~]# lvdisplay
Additionally, look for/dev/mapper or /dev/XX (where XX isnot sd).
```

4. 确保BIOS配置正确，比如你如果使用的是SATA，请确保没有开启`IDE emulation`。

5. 确保`controller firmware`是最新的，校验磁盘是否有一些潜在的问题。
```bash
[root@cdh ~]# dmesg | egrep -i 'sense error'
[root@cdh ~]# dmesg | egrep -i 'ata bus error'
```

6. 目前常见的SATA读写速度大概在`150MB/S-180MB/S`，SAS或者SSD会更快，如果磁盘读写速度`小于70MB/S`，肯定是有问题的，需要检查硬件。以下为测试读写的命令，这里我们将`/data/01`挂载到`/dev/sda1`：
```bash
[root@cdh ~]# hdparm –t /dev/sda1
[root@cdh ~]# ddbs=1M count=1024 if=/dev/zero of=/data/01 oflag=direct conv=fdatasync
[root@cdh ~]# dd bs=1M count=1024 of=/dev/null if=/data/01 iflag=direct conv=fdatasync
```

7. 确保磁盘没有坏的扇区：
```bash
[root@cdh ~]# badblocks -v /dev/sda1
[root@cdh ~]# badblocks -v /dev/sdb1
...
[root@cdh ~]#badblocks -v /dev/sdx1
```

#### 安装用户
可以使用`root`用户安装，或者具有`sudo`权限的其他用户

#### 网络要求
CDH支持IPV4，不支持IPV6，确保没有开启IPV6
```bash
[root@cdh ~]# lsmod | grep ipv6 
[root@cdh ~]# 
```

修改`/etc/sysctl.conf`文件添加一下内容禁用IPV6
```bash
#disable ipv6
net.ipv6.conf.all.disable_ipv6= 1
net.ipv6.conf.default.disable_ipv6= 1
net.ipv6.conf.lo.disable_ipv6= 1
```
如果是RHEL/CentOS，可以把以下内容补充到`/etc/sysconfig/network`
```bash
NETWORKING_IPV6=no
IPV6INIT=no
```

#### 主机名配置
1. 将主机名设置为全限定域名格式[FQDN](https://baike.baidu.com/item/FQDN)（Fully Qualified Domain Name）
`sudo hostnamectl set-hostname master1.hming.org`
2. 配置/etc/hosts文件，添加集群中所有全限定域名，也可以在后面继续添加非限定名

```bash
172.16.0.2 master1.hming.org master1
172.16.0.5 master2.hming.org master2
172.16.0.6 master3.hming.org master3
172.16.0.12 node1.hming.org node1
172.16.0.13 node2.hming.org node2
172.16.0.15 node3.hming.org node3
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

#### 设置SWAP
参考官网：[https://www.cloudera.com/documentation/enterprise/latest/topics/cdh_admin_performance.html#cdh_performance__section_xpq_sdf_jq](https://www.cloudera.com/documentation/enterprise/latest/topics/cdh_admin_performance.html#cdh_performance__section_xpq_sdf_jq)
运行命令`sysctl -w vm.swappiness=1`临时生效
或者修改`/etc/sysctl.conf`配置文件，增加如下配置，永久生效
```bash
# 配置为1时表示当内存使用超过99时，才使用交换空间，这里可以配置为1-10
vm.swappiness = 1
```

检查是否生效
```bash
[root@cdh ~]# cat /proc/sys/vm/swappiness
1
```

#### 关闭透明大页面
参考官网：[https://www.cloudera.com/documentation/enterprise/latest/topics/cdh_admin_performance.html#cdh_performance__section_hw3_sdf_jq](https://www.cloudera.com/documentation/enterprise/latest/topics/cdh_admin_performance.html#cdh_performance__section_hw3_sdf_jq)
查看透明大页面配置，发现目前为开启状态`always`
```bash
[root@cdh ~]# cat /sys/kernel/mm/transparent_hugepage/defrag 
[always] madvise never
[root@cdh ~]# cat /sys/kernel/mm/transparent_hugepage/enabled 
[always] madvise never
```

执行命令关闭透明大页面，使其立即生效
```bash
[root@cdh ~]# echo never > /sys/kernel/mm/transparent_hugepage/enabled 
[root@cdh ~]# echo never > /sys/kernel/mm/transparent_hugepage/defrag 
```

再次查看，确认已经修改为`never`
```bash
[root@cdh ~]# cat /sys/kernel/mm/transparent_hugepage/enabled 
always madvise [never]
[root@cdh ~]# cat /sys/kernel/mm/transparent_hugepage/defrag 
always madvise [never]
```

在`/etc/rc.d/rc.local`脚本文件中添加以下代码，使其永久生效
```bash
if test -f /sys/kernel/mm/transparent_hugepage/enabled; then
   echo never > /sys/kernel/mm/transparent_hugepage/enabled
fi
if test -f /sys/kernel/mm/transparent_hugepage/defrag; then
   echo never > /sys/kernel/mm/transparent_hugepage/defrag
fi
```

赋予`rc.local`脚本可执行权限
```bash
[root@cdh ~]# chmod +x /etc/rc.d/rc.local
```

#### 配置NTP服务（时钟同步）
参考官网：[https://www.cloudera.com/documentation/enterprise/6/6.3/topics/install_cdh_enable_ntp.html](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/install_cdh_enable_ntp.html)
参考其他文章：[https://blog.csdn.net/u010003835/article/details/84962098](https://blog.csdn.net/u010003835/article/details/84962098)
集群中所有主机必须保持时间同步，如果时间相差较大会引起各种问题，如果企业有自己的NTP Server则可以集群中所有节点可配置企业NTP Server，如果没有自己的NTP服务器则在集群中选用一台服务器作为NTP Server，其它服务器与其保持同步

#### 下载离线包
##### Cloudera Manager安装包
到官网下载rpm包：[https://archive.cloudera.com/cm6/6.3.0/redhat7/yum/RPMS/x86_64/](https://archive.cloudera.com/cm6/6.3.0/redhat7/yum/RPMS/x86_64/)
![](http://image.hming.org/CentOS7离线安装CDH/cm包下载地址.png)
下载allkeys文件：[https://archive.cloudera.com/cm6/6.3.0/](https://archive.cloudera.com/cm6/6.3.0/)
![](http://image.hming.org/CentOS7离线安装CDH/allkeys文件下载地址.png)

##### CDH安装包
官方有两种离线包可供选择：
1. [Parcel模式（推荐）](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/cm_ig_create_local_parcel_repo.html)（本文使用模式）
2. [Package模式](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/cm_ig_create_local_package_repo.html)
到官网下载parcel包：[https://archive.cloudera.com/cdh6/6.3.0/parcels/](https://archive.cloudera.com/cdh6/6.3.0/parcels/)，下载图中框选的三个文件
![](http://image.hming.org/CentOS7离线安装CDH/cdh包下载地址.png)

##### 其他parcel包（可选）
YCSB：[http://archive.cloudera.com/cloudera-labs/ycsb/parcels/latest/](http://archive.cloudera.com/cloudera-labs/ycsb/parcels/latest/)
Phoenix：[http://archive.cloudera.com/cloudera-labs/phoenix/parcels/latest/](http://archive.cloudera.com/cloudera-labs/phoenix/parcels/latest/)
kafka: [http://archive.cloudera.com/cloudera-labs/kafka/parcels/latest/](http://archive.cloudera.com/cloudera-labs/kafka/parcels/latest/)
csds: [http://archive.cloudera.com/cloudera-labs/csds/](http://archive.cloudera.com/cloudera-labs/csds/)
ktrace: [http://archive.cloudera.com/cloudera-labs/htrace/parcels/latest/](http://archive.cloudera.com/cloudera-labs/htrace/parcels/latest/)

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

#### 配置本地yum源
httpd默认路径为：`/var/www/html/`

> 如果httpd映射路径修改过，则以修改后的为准。

##### Cloudera Manager
将下载的所有cm rpm包和allkeys文件一起[制作离线yum源](http://blog.hming.org/2019/03/29/Linux%E5%88%B6%E4%BD%9C%E7%A6%BB%E7%BA%BFyum%E6%BA%90/#toc-heading-6)
将离线yum源放到httpd服务路径中，方便其他节点访问

```bash
[root@node10 cm6.3.0]# pwd
/var/www/html/cloudera-repos/cm6.3.0
[root@node10 cm6.3.0]# ls -l
total 1378004
-rw-r--r-- 1 root root      14041 Aug  1 00:08 allkeys.asc
-rw-r--r-- 1 root root   10479136 Aug 16 16:26 cloudera-manager-agent-6.3.0-1281944.el7.x86_64.rpm
-rw-r--r-- 1 root root 1201341068 Aug 16 16:26 cloudera-manager-daemons-6.3.0-1281944.el7.x86_64.rpm
-rw-r--r-- 1 root root      11464 Aug 16 16:26 cloudera-manager-server-6.3.0-1281944.el7.x86_64.rpm
-rw-r--r-- 1 root root      10996 Aug 16 16:26 cloudera-manager-server-db-2-6.3.0-1281944.el7.x86_64.rpm
-rw-r--r-- 1 root root   14209884 Aug 16 16:26 enterprise-debuginfo-6.3.0-1281944.el7.x86_64.rpm
-rw-r--r-- 1 root root  184988341 Aug 16 16:26 oracle-j2sdk1.8-1.8.0+update181-1.x86_64.rpm
drwxr-xr-x 2 root root       4096 Aug 20 14:48 repodata
[root@node10 cm6.3.0]# 
```

##### CDH其他parcel包
将parcel包移到httpd服务路径

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
> 安装cloudera manager节点`必须安装`，其他节点现在可以不安装，在进行CDH安装时还可以安装

由于我们下载的cloudera cm包中有jdk并且配置好了yum离线源，所以直接用yum安装官方推荐的jdk（`前提是已经配置了yum离线源的repo仓库地址`）
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
如果之前只安装了cm server节点的jdk，则需要勾选上，如果每个节点都安装了jdk就不需要勾选
![](http://image.hming.org/CentOS7离线安装CDH/安装jdk.png)
配置ssh，如果主机的密码不相同，则需要选择使用秘钥的形式，如果密码相同，直接输入密码即可
![](http://image.hming.org/CentOS7离线安装CDH/ssh配置.png)
安装cloudera agent（安装过程中遇到问题可以根据提示进行解决），点击继续
![](http://image.hming.org/CentOS7离线安装CDH/安装agent1.png)
![](http://image.hming.org/CentOS7离线安装CDH/安装agent2.png)
开始自动安装Parcel包，由于需要拷贝到相应节点然后解压，所以时间消耗比较久，耐心等待完成
![](http://image.hming.org/CentOS7离线安装CDH/安装parcel.png)
进行集群检测，包括网络检测和节点其他检测，如果检测有问题可以按照提示进行修复
![](http://image.hming.org/CentOS7离线安装CDH/集群检测1.png)
建议完全通过检测后再点击继续
![](http://image.hming.org/CentOS7离线安装CDH/集群检测2.png)


> 如果只有一个节点，网络检测不会通过
> ![](http://image.hming.org/CentOS7离线安装CDH/单节点不支持网络检测.png)

开始安装组件服务，可以选择官方的配置方案，也可以选择自定义
![](http://image.hming.org/CentOS7离线安装CDH/安装组件1.png)
安装组件按照提示步骤安装即可，本文不再赘述
官网组件服务分配参考：[https://www.cloudera.com/documentation/enterprise/6/6.3/topics/cm_ig_host_allocations.html](https://www.cloudera.com/documentation/enterprise/6/6.3/topics/cm_ig_host_allocations.html)

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