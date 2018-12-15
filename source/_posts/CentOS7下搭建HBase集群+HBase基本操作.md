---
title: CentOS7下搭建HBase集群+HBase基本操作
tags:
  - 大数据
  - HBase
  - 集群
comments: true
categories:
  - 大数据
  - HBase
thumbnail: 'http://image.cyanide.top/logo/hbase.jpg'
date: 2018-12-15 15:47:39
updated: 2018-12-15 15:47:39
password:
---
搭建HBase集群，使用外部Zookeeper集群
<!-- more -->
### 本文环境
|节点|IP地址|
|:---:|:---:|
|hadoopmaster|192.168.171.10|
|hadoop001|192.168.171.11|
|hadoop002|192.168.171.12|
### 下载安装包
下载地址：[http://archive.apache.org/dist/hbase/](http://archive.apache.org/dist/hbase/)
根据需要选择合适的版本，本文为`hbase-1.4.8-bin.tar.gz`

### 上传、解压
使用[rz 命令](http://blog.cyanide.top/2018/08/15/Linux%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/#rz%E4%B8%8Esz%EF%BC%88%E4%B8%8A%E4%BC%A0%E3%80%81%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%EF%BC%89)上传到服务器并解压
```bash
[root@hadoopmaster opt]# tar -zxvf hbase-1.4.8-bin.tar.gz
```
### 配置环境变量（每个节点都需要配置）
`vim /etc/profile`
```bash
# hbase
export HBASE_HOME=/home/hbase # hbase解压安装路径
export PATH=$PATH:$HBASE_HOME/bin
```
配置后使用`source /etc/profile`刷新配置文件
### 配置java路径，关闭内置zk集群
修改`hbase/conf/hbase-env.sh`，修改或增加以下内容
```bash
...
export JAVA_HOME=/home/jdk
...
export HBASE_MANAGES_ZK=fakse
```
### 修改配置文件
1. 修改`hbase/conf/hbase-site.xml`配置文件
    ```xml
    <configuration>
        <property>
                <name>hbase.cluster.distributed</name>
                <value>true</value>
        </property>
        <property>
                <name>hbase.rootdir</name>
                <value>hdfs://hadoopmaster:9000/hbase</value>
        </property>
        <property>
                <name>dfs.replication</name>
                <value>2</value>
        </property>
        <property>
                <name>hbase.zookeeper.quorum</name>
                <value>hadoopmaster:2181,hadoop001:2181,hadoop002:2181</value>
        </property>
        <!-- 不需要
        <property>
                <name>hbase.zookeeper.property.dataDir</name>
                <value>/home/centos/hbase/zk</value>
        </property>
        -->
    </configuration>
    ```
    **注意：**
    * 需要指定HDFS中储存路径，hadoop集群搭建参考：[CentOS7下搭建Hadoop集群](http://blog.cyanide.top/2018/09/16/CentOS7%E4%B8%8B%E6%90%AD%E5%BB%BAHadoop%E9%9B%86%E7%BE%A4/)
    * 需要指定Zookeeper服务，Zookeeper集群搭建参考：[搭建Zookeeper集群](http://blog.cyanide.top/2018/12/15/%E6%90%AD%E5%BB%BAZookeeper%E9%9B%86%E7%BE%A4/)
2. 修改`hbase/conf/regionservers`文件
    ```bash
    # 增加从节点地址（这里由于配置了hosts，直接使用主机名，也可以配ip地址）
    hadoop001
    hadoop002
    ```
### 将文件夹copy到其他子节点
通过[scp 命令](http://blog.cyanide.top/2018/08/15/Linux%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/#scp%EF%BC%88%E8%B7%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%8B%B7%E8%B4%9D%EF%BC%89)将修改好的文件夹拷贝到各个从节点上
```shell
[root@hadoopmaster ~]# scp -r /opt/hbase-1.4.8/ hadoop001:/opt
...
[root@hadoopmaster ~]# scp -r /opt/hbase-1.4.8/ hadoop002:/opt
```
### 确保HDFS与Zookeeper启动
`xzk_cluster`脚本参考：[zk集群脚本编写](http://blog.cyanide.top/2018/12/15/%E6%90%AD%E5%BB%BAZookeeper%E9%9B%86%E7%BE%A4/#zk%E9%9B%86%E7%BE%A4%E8%84%9A%E6%9C%AC%E7%BC%96%E5%86%99)
```bash
xzk-cluster.sh start
start-dfs.sh
```
### 启动HBase集群
```bash
[root@hadoopmaster opt]# start-hbase.sh 
running master, logging to /home/hbase/logs/hbase-root-master-hadoopmaster.out
hadoop001: running regionserver, logging to /home/hbase/bin/../logs/hbase-root-regionserver-hadoop001.out
hadoop002: running regionserver, logging to /home/hbase/bin/../logs/hbase-root-regionserver-hadoop002.out
```
### 验证web界面
访问：[http://hadoopmaster:16010](http://hadoopmaster:16010)
### 单例管理HBase的每个进程
```bash
$> start-hbase.sh			//启动所有节点
$> stop-hbase.sh				//停止所有节点
$> hbase-daemon.sh start master		//启动master节点
$> hbase-daemons.sh start regionserver	//启动所有rs节点
$> hbase-daemon.sh start regionserver	//启动单个rs节点
```
### HBase在HDFS中目录表示含义
|路径|含义|
|:---:|:---:|
|/hbase/WALs|写前日志|
|/hbase/data|数据|
|/hbase/data/default|hbase内置默认名字空间|
|/hbase/data/hbase|hbase内置的名字空间（相当于hive中的数据库）|
文件表示完整路径示意：
`/hbase/data/${namespace}/${tablename}/${region_name}/${column_family}/${file_name}`
### HBase常用命令
```bash
$> hbase shell				//进入hbase shell
$hbase> help				//查看帮助
$hbase> list_namespace			//查看名字空间(数据库)
$hbase> list_namespace_tables 'hbase'	//查看指定空间（hbase空间）下的表
$hbase> scan 'hbase:meta'		//查看表
$hbase> create_namespace 'ns1'		//创建名字空间
$hbase> create 'ns1:t1' , 'f1'		//创建表
$hbase> scan 'ns1:t1'			//扫描表
$hbase> describe 't1' 或者 desc 't1'	//查看表结构
$hbase> truncate 'ns1:t1'		//清空表数据
$hbase> put 'ns1:t1','row1','f1:id',1	//插入数据table,row,f:c,value
$hbase> delete 'ns1:t1','row1','f1:id'	//删除
```