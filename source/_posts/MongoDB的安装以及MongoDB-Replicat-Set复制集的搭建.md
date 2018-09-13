---
title: MongoDB的安装以及MongoDB Replicat Set复制集的搭建
tags:
  - mongodb
  - Linux
comments: true
date: 2017-07-29 11:32:03
categories: 数据库
password:
---
记录MongoDB在Linux下的安装过程和MongoDB Replicat Set复制集的搭建过程。
<!-- more -->
## 一、搭建MongoDB单机环境
MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。
### A、使用APT安装
[参考官方安装文档](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

#### 1. 导入public key
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
```

#### 2. 导入源（不同Ubuntu版本的源不一样，此处采用Ubuntu 16.04）
```
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
```

#### 3. 重新加载本地源
```
sudo apt-get update
```

#### 4. 安装mongodb
```
sudo apt-get install -y mongodb-org
```

#### 5. 修改配置文件
>配置文件默认文件目录/etc/mongod.conf
>默认存储其数据文件/var/lib/mongodb 
>默认日志文件/var/log/mongodb/mongod.log
![](http://ot87uvd34.bkt.clouddn.com/%E9%BB%98%E8%AE%A4mongodb%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.jpg)

#### 6. 启动mongodb 
```
mongod -f /etc/mongod.conf
```

#### 7. 卸载mongodb
1)停止mongodb服务
```
sudo service mongod stop
```
2)删除软件包
删除您以前安装的任何MongoDB包。
```
sudo apt-get purge mongodb-org *
```
3)删除数据目录
删除数据库和日志文件
```
sudo rm -r / var / log / mongodb 
sudo rm -r / var / lib / mongodb
```

### B、使用安装包安装
到[清华开源镜像](https://mirrors.tuna.tsinghua.edu.cn/mongodb/apt/ubuntu/dists/xenial/mongodb-org/)下载相应的包

#### 1. 解压到需要安装的目录
```
tar zxvf mongodb-linux-x86_64-ubuntu1604-3.4.4.tgz
```
>tar命令参数详解：
-c ：建立打包档案，可搭配-v 来察看过程中被打包的档名(filename)
-t ：察看打包档案的内容含有哪些档名，重点在察看『档名』就是了；
-x ：解打包或解压缩的功能，可以搭配-C (大写) 在特定目录解开
*特别留意的是， -c, -t, -x 不可同时出现在一串指令列中。*
-z ：透过gzip 的支援进行压缩/解压缩：此时档名最好为`*.tar.gz`
-j ：透过bzip2 的支援进行压缩/解压缩：此时档名最好为`*.tar.bz2`
-J ：透过xz 的支援进行压缩/解压缩：此时档名最好为`*.tar.xz`
*特别留意， -z, -j, -J 不可以同时出现在一串指令列中。*
-v ：在压缩/解压缩的过程中，将正在处理的档名显示出来！
-f filename：-f 后面要立刻接要被处理的档名！建议-f 单独写一个选项啰！(比较不会忘记)
-C 目录：这个选项用在解压缩，若要在特定目录解压缩，可以使用这个选项。
更多的压缩命令参考[鸟哥的Linux私房菜之档案的压缩、解压](http://linux.vbird.org/linux_basic/0240tarcompress.php#compress_name)

#### 2. 创建存放数据文件目录以及日志文件目录（可以自己指定）
可以创建多个数据库存放路径，每个数据库对应一个conf配置文件，mongodb只需要安装一次
```
mkdir -p /mongodb/db  # 创建数据文件夹
mkdir -p /mongodb/log
touch /mongodb/log/mongodb.log  #创建文件
```
#### 3. 在适当的路径编辑配置文件（后缀可选conf和yaml）
```
vi mongodb.conf
```
配置文件模板：

```
# mongodb.conf
# Where and how to store data.
storage:
  dbPath: /mongodb/data
  journal:
    enabled: true
#  engine:
#  mmapv1:
#  wiredTiger:

# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /mongodb/log/mongodb.log 

# network interfaces
net:
  port: 28001
 # bindIp: 127.0.0.1

processManagement:
  fork: true
#security:
#operationProfiling:
```
>文件路径修改为设置的存储路径，端口可自定义（一般推荐27或者28开头的5位数）

#### 4. 配置环境变量PATH路径
```
# 这里也可以修改~/.bashrc文件（区别见下表）
sudo vi /etc/profile

# 追加(路径是放置Mongodb安装包的bin路径)
export PATH=/home/dusk/mongodb/bin:$PATH
```
> Linux中profile、bashrc、bash_profile之间的区别和联系
> 
> |文件名|作用区间|执行时间|修改后是否需要重启|
> |:--:|:--:|:--:|:--:|
> |/etc/profile|该系统下每个用户|用户第一次登陆|是（`source /etc/profile`）|
> |/etc/bashrc|该系统下每个用户|用户新打开shell|否|
> |~/.bash_profile|当前用户|用户第一次登陆|是（`source ~/.bash_profile`）|
> |~/.bashrc|当前用户|用户新打开shell|否|
> |~/.bash_logout|当前用户|退出shell|否|
> 
> * */etc/profile*：该文件为系统的每个用户的环境信息文件，对每个用户生效。当用户第一次登陆的时候会执行这个文件加载里面的shell配置，所以修改这个文件之后要重启设置才能生效-->source /etc/profile
> * */etc/bashrc*：为每一个执行bash shell的用户执行此文件，当bash shell被打开时，该文件被读取。修改后只需要重新打开一个bash即可生效
> * *~/.bash_profile*：每个用户目录下都有这个文件，用户可以通过修改这个文件来设置自己专用的shell信息，该文件中设置了一些环境变量，执行用户的.bashrc文件。该文件类似于/etc/profile，需要重新启动才会生效，只对当前用户生效。
> * *~/.bashrc*：该文件包含专用于你自己的bash shell信息，每次打开新的shell时被读取，只对当前用户新打开的bash生效。
> * *~/.bash_logout*：当该用户退出bash shell时执行

#### 5. 如果修改的是/etc/profile，则需要重新启动配置文件
```
source /etc/profile
```

#### 6. 在配置文件路径启动mongodb

```
mongod -f mongodb.conf
```
### 关闭MongoDB
1. 使用mongod命令
```
mongod --shutdown --dbpath /数据库储存路径
```
2. 连接进mongodb数据库关闭
```
# 进入mongoshell
mongo --port=28001
# 使用admin数据库（只有在admin下才能执行shutdown方法）
use admin
# 关闭mongodb服务
db.shutdownServer()
```
3. 查看mongodb的进程，用kill杀掉进程
`不推荐这种方式，会有丢失数据的风险`

---

## 二、搭建MongoDB Replicat Set复制集
MongoDB Replica Set是MongoDB官方推荐的主从复制和高可用方案，用于替代原有的Master-Slave主从复制方案。
不懂原理的可以[点击这里](http://www.linuxidc.com/Linux/2015-02/113296.htm)查看复制集原理（`推荐了解原理后再搭建`）
![](http://ot87uvd34.bkt.clouddn.com/%E5%A4%8D%E5%88%B6%E9%9B%86.jpg)
### 1.搭建环境（电脑配置）
在需要布置为节点的机器上安装好MongoDB环境，参照上面的教程

|节点|主机名(IP地址):端口号|
|:--:|:--:|
|Primary Node(主节点)|node1:28001|
|Secondary Node(次节点)|node2:28001|
|Arbiter Node(投票节点)|node3:28001|

>*当然，你也可以在一台电脑上搭建复制集，但是端口一定不要冲突*

### 2.确保每个节点数据、日志文件都建立完毕
```
# 数据目录
mkdir -p /mongodb/data/
# 日志目录
mkdir -p /mongodb/log/
# 创建日志文件
touch /mongodb/log/mongodb.log
# 配置文件目录
mkdir -p /mongodb/conf
```
>参考上面的mongodb环境搭建

### 3.修改每个节点的配置文件（重点）
```
# 例：
vi /mongodb/conf/mongodb.yaml
```
在文件后面追加：

```
# 副本
replication:
  #设置复制集名称，可自定义
  replSetName: DBTEST
  #设置操作日志的大小(important)
  oplogSizeMB: 10240
#sharding:
## Enterprise-Only Options:
#auditLog:
#snmp:
```
>*复制集名称每个节点一定要一样*

### 4.启动每个节点
```
mongod -f /mongodb/conf/mongodb.conf
```
### 5.进入一个节点配置复制集（重点）
```
#任意一个节点上(最好选在主节点node1)
mongo --port 28001
```
在mongo shell中配置副本
*输入rs.help()可以查看rs的各种方法*

```
# 初始化复制集
rs.initiate()
# 显示复制集配置对象
rs.conf()
# 将其余成员添加到副本集
# 返回{ "ok" : 1 }说明添加成功
rs.add("node2:28001")
rs.addArb("node3:28001")
```
查看副本集状态，可以看到复制集的全部信息都被显示出来

```
DBTEST:PRIMARY> rs.status()
{
    "set" : "DBTEST",
    "date" : ISODate("2017-06-30T07:10:33.247Z"),
    "myState" : 1,
    "term" : NumberLong(1),
    "heartbeatIntervalMillis" : NumberLong(2000),
    "members" : [
        {
            "_id" : 0,
            "name" : "node1:28001",
            "health" : 1,
            "state" : 1,
            "stateStr" : "PRIMARY",
            "uptime" : 316,
            "optime" : {
                "ts" : Timestamp(1498806589, 1),
                "t" : NumberLong(1)
            },
            "optimeDate" : ISODate("2017-06-30T07:09:49Z"),
            "infoMessage" : "could not find member to sync from",
            "electionTime" : Timestamp(1498806520, 2),
            "electionDate" : ISODate("2017-06-30T07:08:40Z"),
            "configVersion" : 4,
            "self" : true
        },
        {
            "_id" : 1,
            "name" : "node2:28001",
            "health" : 1,
            "state" : 2,
            "stateStr" : "SECONDARY",
            "uptime" : 58,
            "optime" : {
                "ts" : Timestamp(1498806589, 1),
                "t" : NumberLong(1)
            },
            "optimeDate" : ISODate("2017-06-30T07:09:49Z"),
            "lastHeartbeat" : ISODate("2017-06-30T07:10:31.761Z"),
            "lastHeartbeatRecv" : ISODate("2017-06-30T07:10:32.765Z"),
            "pingMs" : NumberLong(0),
            "syncingTo" : "node2:28001",
            "configVersion" : 4
        },
        {
            "_id" : 2,
            "name" : "node3:28001",
            "health" : 1,
            "state" : 7,
            "stateStr" : "ARBITER",
            "uptime" : 43,
            "lastHeartbeat" : ISODate("2017-06-30T07:10:31.761Z"),
            "lastHeartbeatRecv" : ISODate("2017-06-30T07:10:29.970Z"),
            "pingMs" : NumberLong(0),
            "configVersion" : 4
        }
    ],
    "ok" : 1
}
```
### 6.删除子节点
```
rs.remove("node3:28001")
# 返回{"ok" : 1}
```
### 7.可能遇到的问题
在节点中执行show方法可能出现

```
DBTEST:SECONDARY> show databases
2017-07-28T11:15:06.856+0800 E QUERY    [thread1] Error: listDatabases failed:{
        "ok" : 0,
        "errmsg" : "not master and slaveOk=false",
        "code" : 13435,
        "codeName" : "NotMasterNoSlaveOk"
} :
_getErrorWithCode@src/mongo/shell/utils.js:25:13
Mongo.prototype.getDBs@src/mongo/shell/mongo.js:62:1
shellHelper.show@src/mongo/shell/utils.js:755:19
shellHelper@src/mongo/shell/utils.js:645:15

#解决方法是在报错的节点上执行rs.slaveOk()方法即可
DBTEST:STARTUP2> rs.slaveOk()
DBTEST:STARTUP2> show databases
admin       0.000GB
local       0.000GB
mydatabase  0.000GB
```
### 8.关闭、重启复制集
参考上边的关闭mongodb的方法，依次在每个节点上执行关闭操作
`注意关闭顺序，在重启节点的过程中，建议不要直接shutdown Primary，这样可能导致已经写入primary但未同步到secondary的数据丢失`
>1.shutdown Primary （shutdown会等待Secondary oplog追到10s以内）
2.Primary退出后，剩余的节点选举出一个新的Primary（复制集只包含1或2节点例外）
3.Primary重新启动，因为当前复制集已经有了新的Primary，这个Primary将以Secondary的角色运行。
4.从新的Primary同步的过程中，发现自己有无效的oplog，会先进行rollback。（rollback的数据只要不超过300M是可以找回的）

上面这种操作可能会导致数据丢失
>1.逐个重启复制集里所有的Secondary节点
2.对Primary发送stepDown命令，等待primary降级为Secondary
3.重启降级后的Primary