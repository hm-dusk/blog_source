---
title: CentOS7下搭建Hadoop集群
tags:
  - Hadoop
  - Linux
  - 大数据
  - 集群
comments: true
date: 2018-09-16 23:40:16
updated: 2019-2-18 15:05:06
categories: 
  - 大数据
password:
thumbnail: 'http://image.hming.org/logo/hadoop.jpg'
---
CentOS7下搭建Hadoop集群
<!-- more -->
### 本文环境
|节点|IP地址|
|:---:|:---:|
|hadoopmaster|192.168.171.10|
|hadoop001|192.168.171.11|
|hadoop002|192.168.171.12|

### 准备环境
#### 虚拟机创建多个Linux系统并配置静态IP
配置静态IP教程请点击[这里](http://blog.hming.org/2018/08/09/VMware%E8%99%9A%E6%8B%9F%E6%9C%BA%E9%9D%99%E6%80%81ip%E9%85%8D%E7%BD%AE/)
#### 配置DNS（每个节点）
进入配置文件，添加主节点和从节点的映射关系
`vim /etc/hosts`，添加如下代码（ip以及主机名以自己配置为准）
```shell
192.168.171.10 hadoopmaster
192.168.171.11 hadoop001
192.168.171.12 hadoop002
```
#### 关闭防火墙（每个节点）
关闭服务
`systemctl stop firewalld`
关闭开机自启动
`systemctl disable firewalld`
#### 配置免密码登录
配置免密码登录教程请点击[这里](http://blog.hming.org/2018/09/16/Linux%E9%9B%86%E7%BE%A4%E9%85%8D%E7%BD%AE%E5%85%8D%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95/)
#### 配置java环境（每个节点）
配置java环境教程点击[这里](http://blog.hming.org/2018/09/14/Linux%E4%B8%8B%E5%AE%89%E8%A3%85Java/)
### 搭建Hadoop完全分布式集群
> 在各个节点上安装与配置Hadoop的过程都基本相同，因此可以在每个节点上安装好Hadoop后，在主节点master上进行统一配置，然后通过[scp 命令](http://blog.hming.org/2018/08/15/Linux%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/#scp%EF%BC%88%E8%B7%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%8B%B7%E8%B4%9D%EF%BC%89)将修改的配置文件拷贝到各个从节点上即可。
#### 下载hadoop安装包，解压，配置环境变量
点击[这里](http://archive.apache.org/dist/hadoop/common/)选择适合的版本进行安装包下载
找个目录（本文为/opt目录），[rz 命令](http://http://blog.hming.org/2018/08/15/Linux%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/#rz%E4%B8%8Esz%EF%BC%88%E4%B8%8A%E4%BC%A0%E3%80%81%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%EF%BC%89)上传到Linux系统

解压`tar -zxvf hadoop-*.tar.gz`
配置环境变量（每个节点）
`vim /etc/profile`
添加如下代码
```shell
export HADOOP_HOME=/opt/hadoop-2.7.3 # 该目录为解压安装目录
export PATH=$PATH:$HADOOP_HOME/bin
export PATH=$PATH:$HADOOP_HOME/sbin
export HADOOP_CONF_DIR=${HADOOP_HOME}/etc/hadoop
```
完成后刷新一下，使profile生效
```shell
[root@hadoopmaster ~]# source /etc/profile
```

#### 配置环境脚本文件的JAVA_HOME参数
进入hadoop安装目录下的`etc/hadoop`目录
分别在`hadoop-env.sh`、`mapred-env.sh`、`yarn-env.sh`文件中添加或修改参数：
```
export JAVA_HOME="/opt/jdk1.8"  # 路径为jdk安装路径
```
#### 修改配置文件
> hadoop安装目录下的`etc/hadoop`目录,一共需要修改`core-site.xml`、`hdfs-site.xml`、`yarn-site.xml`、`mapred-site.xml`、`slaves`(3.0之后为`workers`)文件，按实际情况修改配置信息
##### 1.core-site.xml
更多参数配置参考：[core-default.xml](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/core-default.xml)
```xml
<configuration>
<property>
	<!-- 配置hdfs地址 -->
	<name>fs.defaultFS</name>
	<value>hdfs://hadoopmaster:9000</value>
</property>
<property>
	<!-- 保存临时文件目录 -->
	<name>hadoop.tmp.dir</name>
	<value>/opt/hadoop/tmp</value>
</property>

<property>
    <name>hadoop.proxyuser.root.hosts</name>
    <value>*</value>
</property>
<property>
    <name>hadoop.proxyuser.root.groups</name>
    <value>*</value>
</property>
</configuration>
```
##### 2.hdfs-site.xml
更多参数配置参考：[hdfs-default.xml](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/hdfs-default.xml)
```xml
<configuration>
    <property>
        <!-- 主节点地址 -->
        <name>dfs.namenode.http-address</name>
        <value>hadoopmaster:50070</value>
    </property>
    <property>
        <name>dfs.namenode.name.dir</name>
        <value>file:/opt/hadoop/dfs/name</value>
    </property>
    <property>
        <name>dfs.datanode.data.dir</name>
        <value>file:/opt/hadoop/dfs/data</value>
    </property>
    <property>
        <!-- 备份份数 -->
        <name>dfs.replication</name>
        <value>2</value>
    </property>
    <property>
        <!-- 第二节点地址 -->
        <name>dfs.namenode.secondary.http-address</name>
        <value>hadoop001:9001</value>
    </property>
    <property>
    <name>dfs.webhdfs.enabled</name>
    <value>true</value>
    </property>
    <property>
        <name>dfs.permissions</name>
        <value>false</value>
        <description>配置为false后，可以允许不要检查权限就生成dfs上的文件，方便倒是方便了，但是你需要防止误删除.</description>
    </property>
</configuration>
```
##### 3.mapred-site.xml
更多参数配置参考：[mapred-default.xml](http://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/mapred-default.xml)
```xml
<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
    <property>
        <name>mapreduce.jobhistory.address</name>
        <value>hadoopmaster:10020</value>
    </property>
    <property>
        <name>mapreduce.jobhistory.webapp.address</name>
        <value>hadoopmaster:19888</value>
    </property>
</configuration>
```
##### 4.yarn-site.xml（资源管理器）
更多参数配置参考：[yarn-default.xml](http://hadoop.apache.org/docs/stable/hadoop-yarn/hadoop-yarn-common/yarn-default.xml)
```xml
<configuration>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
    <property>
        <name>yarn.nodemanager.auxservices.mapreduce.shuffle.class</name>
        <value>org.apache.hadoop.mapred.ShuffleHandler</value>
    </property>
    <property>
        <name>yarn.resourcemanager.address</name>
        <value>hadoopmaster:8032</value>
    </property>
    <property>
        <name>yarn.resourcemanager.scheduler.address</name>
        <value>hadoopmaster:8030</value>
    </property>
    <property>
        <name>yarn.resourcemanager.resource-tracker.address</name>
        <value>hadoopmaster:8031</value>
    </property>
    <property>
        <name>yarn.resourcemanager.admin.address</name>
        <value>hadoopmaster:8033</value>
    </property>
    <property>
        <name>yarn.resourcemanager.webapp.address</name>
        <value>hadoopmaster:8088</value>
    </property>
    
    <property>
        <name>yarn.nodemanager.resource.memory-mb</name>
        <!-- NodeManage中的配置，这里配置过小可能导致nodemanager启动不起来
                          大小应该大于 spark中 executor-memory + driver的内存 -->
        <value>6144</value>
    </property>
    <property>
        <!-- RsourceManager中配置
                          大小应该大于 spark中 executor-memory + driver的内存 -->
        <name>yarn.scheduler.maximum-allocation-mb</name>
        <value>61440</value>
    </property>
    <property>
        <!-- 使用核数 -->
        <name>yarn.nodemanager.resource.cpu-vcores</name>
        <value>2</value>
    </property>

    <property>
        <name>yarn.log-aggregation-enable</name>
        <value>true</value>
    </property>
    <property>
        <name>yarn.log-aggregation.retain-seconds</name>
        <value>604800</value>
    </property>
    <property>
        <name>yarn.nodemanager.vmem-check-enabled</name>
        <value>false</value>
        <discription>忽略虚拟内存的检查，如果你是安装在虚拟机上，这个配置很有用，配上去之后后续操作不容易出问题。</discription>
    </property>
    <property>
       <!-- 调度策略，设置为公平调度器 -->
       <name>yarn.resourcemanager.scheduler.class</name>
       <value>org.apache.hadoop.yarn.server.resourcemanager.scheduler.fair.FairScheduler</value>
    </property>
</configuration>
```
##### 5.slaves文件（3.0之后为workers文件）
```
# 增加从节点地址（这里由于配置了hosts，直接使用主机名，也可以配ip地址）
hadoop001
hadoop002
```

#### 将文件夹copy到其他子节点
通过[scp 命令](http://blog.hming.org/2018/08/15/Linux%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/#scp%EF%BC%88%E8%B7%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%8B%B7%E8%B4%9D%EF%BC%89)将修改好的文件夹拷贝到各个从节点上
```shell
[root@hadoopmaster ~]# scp -r /opt/hadoop/ root@hadoop001:/opt
...
[root@hadoopmaster ~]# scp -r /opt/hadoop/ root@hadoop002:/opt
```
#### 初始化、启动
```shell
[root@hadoopmaster hadoop]# bin/hdfs namenode -format
```
全部启动`sbin/start-all.sh`，也可以分开`sbin/start-dfs.sh`、`sbin/start-yarn.sh`启动

> 报错：
> Starting namenodes on [hadoopmaster]
> ERROR: Attempting to operate on hdfs namenode as root
> ERROR: but there is no HDFS_NAMENODE_USER defined. Aborting operation.
> Starting datanodes
> ERROR: Attempting to operate on hdfs datanode as root
> ERROR: but there is no HDFS_DATANODE_USER defined. Aborting operation.
> Starting secondary namenodes [hadoop001]
> ERROR: Attempting to operate on hdfs secondarynamenode as root
> ERROR: but there is no HDFS_SECONDARYNAMENODE_USER defined. Aborting operation.
> Starting resourcemanager
> ERROR: Attempting to operate on yarn resourcemanager as root
> ERROR: but there is no YARN_RESOURCEMANAGER_USER defined. Aborting operation.
> Starting nodemanagers
> ERROR: Attempting to operate on yarn nodemanager as root
> ERROR: but there is no YARN_NODEMANAGER_USER defined. Aborting operation.
> 
> 原因：是因为缺少用户定义造成的，所以分别编辑开始和关闭脚本
> $ vim sbin/start-dfs.sh
> $ vim sbin/stop-dfs.sh 
> 在顶部空白处添加内容： 
> HDFS_DATANODE_USER=root
> HADOOP_SECURE_DN_USER=hdfs
> HDFS_NAMENODE_USER=root
> HDFS_SECONDARYNAMENODE_USER=root 
> 
> start-yarn.sh，stop-yarn.sh顶部也需添加以下：
> YARN_RESOURCEMANAGER_USER=root
> HADOOP_SECURE_DN_USER=yarn
> YARN_NODEMANAGER_USER=root

#### Web访问，要先开放端口或者直接关闭防火墙
1. 关闭防火墙
```shell
# 查看防火墙状态
firewall-cmd --state
# 临时关闭
systemctl stop firewalld
# 禁止开机启动
systemctl disable firewalld
```
2. 浏览器打开[http://hadoopmaster:8088/](http://hadoopmaster:8088/)
3. 浏览器打开[http://hadoopmaster:50070/](http://hadoopmaster:50070/)
### 单例管理每个节点
```bash
$> sbin/hadoop-daemon.sh start datanode     # 启动数据节点
$> sbin/yarn-daemon.sh start nodemanager    # 启动数据管理节点
$> bin/hadoop-daemon.sh start tasktracker   # 启动任务管理器
```
### yarn application命令介绍
`yarn application`后接参数：
1. `-list` 列出所有application信息
    ```bash
    [root@master ~]# yarn application -list
    ```

2. `-appStates <States>` 跟 -list 一起使用，用来筛选不同状态的 application，多个用","分隔；
    所有状态：ALL, NEW, NEW_SAVING, SUBMITTED, ACCEPTED, RUNNING, FINISHED, FAILED, KILLED
    ```bash
    [root@master ~]# yarn application -list -appStates RUNNING
    ```

3. `-appTypes <Types>` 跟 -list 一起使用，用来筛选不同类型的 application，多个用","分隔；
    如 MAPREDUCE,TEZ
    ```bash
    [root@master ~]# yarn  application -list -appTypes MAPREDUCE
    ```

4. `-kill <Application ID>` 杀死一个 application，需要指定一个 Application ID
    ```bash
    [root@master ~]# yarn application -kill application_1526100291229_206393
    ```

5. `-status <Application ID>` 列出 某个application 的状态
    ```bash
    [root@master ~]# yarn application -status application_1526100291229_206393
    ```

6. `-movetoqueue <Application ID>` 移动 application 到其他的 queue，不能单独使用

7. `-queue <Queue Name>` 与 movetoqueue 命令一起使用，指定移动到哪个 queue
    ```bash
    [root@master ~]# yarn application -movetoqueue application_1526100291229_206393 -queue other
    ```

