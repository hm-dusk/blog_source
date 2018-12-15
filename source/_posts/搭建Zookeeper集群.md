---
title: 搭建Zookeeper集群
tags:
  - Zookeeper
  - 大数据
comments: true
categories:
  - 大数据
  - Zookeeper
thumbnail: 'http://image.cyanide.top/logo/zookeeper.png'
date: 2018-12-15 11:18:14
updated: 2018-12-15 11:18:14
password:
---
搭建zookeeper完全分布式环境
<!-- more -->
### 本文环境
|节点|IP地址|
|:---:|:---:|
|hadoopmaster|192.168.171.10|
|hadoop001|192.168.171.11|
|hadoop002|192.168.171.12|
### 下载安装包
下载地址：[http://mirrors.shu.edu.cn/apache/zookeeper/](http://mirrors.shu.edu.cn/apache/zookeeper/)
根据需要选择合适的版本，本文为`zookeeper-3.4.12.tar.gz`

### 上传、解压
使用[rz 命令](http://blog.cyanide.top/2018/08/15/Linux%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/#rz%E4%B8%8Esz%EF%BC%88%E4%B8%8A%E4%BC%A0%E3%80%81%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%EF%BC%89)上传到服务器并解压
```bash
[root@hadoopmaster opt]# tar -zxvf zookeeper-3.4.12.tar.gz 
```
### 配置参数文件
1. 配置`conf/zoo.cfg`文件
    拷贝配置文件`cp zoo_sample.cfg zoo.cfg`
    ```bash
    [root@hadoopmaster conf]# ls
    configuration.xsl  log4j.properties  zoo_sample.cfg
    [root@hadoopmaster conf]# cp zoo_sample.cfg zoo.cfg
    [root@hadoopmaster conf]# ls
    configuration.xsl  log4j.properties  zoo.cfg  zoo_sample.cfg
    ```
    编辑配置文件`(每个节点配置一样)`
    ```properties
    tickTime=2000
    initLimit=5
    syncLimit=2
    dataDir=/home/zookeeper/data
    clientPort=2181
    server.1=hadoopmaster:2888:3888
    server.2=hadoop001:2888:3888
    server.3=hadoop002:2888:3888
    ```
2. 配置`data/myid`文件
    新建`myid`文件，路径为`zoo.cfg`文件中`dataDir`指定的路径，本文为`/home/zookeeper/data`
    hadoopmaster节点：
    ```bash
    [root@hadoopmaster conf]# echo 1  >> /home/zookeeper/data/myid
    ```
    hadoop001节点：
    ```bash
    [root@hadoop001 conf]# echo 2  >> /home/zookeeper/data/myid
    ```
    hadoop002节点：
    ```bash
    [root@hadoop002 conf]# echo 3  >> /home/zookeeper/data/myid
    ```
### 启动服务器集群（每个节点都要启动）
```bash
[root@hadoopmaster opt]# /home/zookeeper/bin/zkServer.sh start
```
```bash
[root@hadoop001 opt]# /home/zookeeper/bin/zkServer.sh start
```
```bash
[root@hadoop002 opt]# /home/zookeeper/bin/zkServer.sh start
```
使用`zkServer.sh status`命令查看状态
```bash
[root@hadoopmaster conf]# /home/zookeeper/bin/zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /home/zookeeper/bin/../conf/zoo.cfg
Mode: follower
```
### zk集群脚本编写
将脚本放到`/usr/local/bin/`目录方便使用
`vim /usr/local/bin/xzk-cluster.sh`
`chmod 755 /usr/local/bin/xzk-cluster.sh`修改权限
脚本内容如下
```bash
#!/bin/bash
cmd=$1
servers="hadoopmaster hadoop001 hadoop002"
for s in $servers ; do
   tput setaf 3
   echo ========== $s ==========
   tput setaf 7
   ssh $s "source /etc/profile ; zkServer.sh $cmd"
done
```
使用脚本范例：
```bash
[root@hadoopmaster conf]# xzk-cluster.sh status
========== hadoopmaster ==========
ZooKeeper JMX enabled by default
Using config: /home/zookeeper/bin/../conf/zoo.cfg
Mode: follower
========== hadoop001 ==========
ZooKeeper JMX enabled by default
Using config: /home/zookeeper/bin/../conf/zoo.cfg
Mode: leader
========== hadoop002 ==========
ZooKeeper JMX enabled by default
Using config: /home/zookeeper/bin/../conf/zoo.cfg
Mode: follower
```
```bash
[root@hadoopmaster conf]# xzk-cluster.sh stop
========== hadoopmaster ==========
ZooKeeper JMX enabled by default
Using config: /home/zookeeper/bin/../conf/zoo.cfg
Stopping zookeeper ... STOPPED
========== hadoop001 ==========
ZooKeeper JMX enabled by default
Using config: /home/zookeeper/bin/../conf/zoo.cfg
Stopping zookeeper ... STOPPED
========== hadoop002 ==========
ZooKeeper JMX enabled by default
Using config: /home/zookeeper/bin/../conf/zoo.cfg
Stopping zookeeper ... STOPPED
```

