---
title: CentOS7下搭建Hadoop集群
tags:
  - Hadoop
  - Linux
  - 大数据
  - 集群
comments: true
date: 2018-09-16 23:40:16
updated: 2018-09-16 23:40:16
categories: 大数据
password:
---
CentOS7下搭建Hadoop集群
<!-- more -->
### 准备环境
#### 虚拟机创建多个Linux系统并配置静态IP
配置静态IP教程请点击[这里](http://blog.cyanide.top/2018/08/09/VMware%E8%99%9A%E6%8B%9F%E6%9C%BA%E9%9D%99%E6%80%81ip%E9%85%8D%E7%BD%AE/)
#### 配置DNS（每个节点）
进入配置文件，添加主节点和从节点的映射关系
`vim /etc/profile`，添加如下代码（ip以及主机名以自己配置为准）
```shell
192.168.171.10 hadoopmaster
192.168.171.11 hadoop001
192.168.171.12 hadoop002
```
#### 关闭防火墙（每个节点）
关闭服务
`service iptables stop`
关闭开机自启动
`chkconfig iptables off`
#### 配置免密码登录
配置免密码登录教程请点击[这里](http://blog.cyanide.top/2018/09/16/Linux%E9%9B%86%E7%BE%A4%E9%85%8D%E7%BD%AE%E5%85%8D%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95/)
#### 配置java环境（每个节点）
配置java环境教程点击[这里](http://blog.cyanide.top/2018/09/14/Linux%E4%B8%8B%E5%AE%89%E8%A3%85java/)
### 搭建Hadoop完全分布式集群
> 在各个节点上安装与配置Hadoop的过程都基本相同，因此可以在每个节点上安装好Hadoop后，在主节点master上进行统一配置，然后通过[`scp`命令](http://blog.cyanide.top/2018/08/15/Linux%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/)将修改的配置文件拷贝到各个从节点上即可。
#### 下载hadoop安装包，解压，配置环境变量
点击[这里](http://archive.apache.org/dist/hadoop/common/)选择适合的版本进行安装包下载
找个目录（本文为/opt目录），`rz`命令上传到Linux系统
> 通过`yum -y install lrzsz`安装rz命令软件

解压`tar -zxvf hadoop-*.tar.gz`
配置环境变量
`vim /etc/profile`
添加如下代码
```shell
export HADOOP_HOME=/opt/hadoop-2.7.3 # 该目录为解压安装目录
export PATH=$PATH:$HADOOP_HOME/bin
export PATH=$PATH:$HADOOP_HOME/sbin
export HADOOP_CONF_DIR=${HADOOP_HOME}/etc/hadoop
```
#### 修改配置文件
> 一共需要修改`core-site.xml`、`hdfs-site.xml`、`yarn-site.xml`、`mapred-site.xml`、`slaves`文件，按实际情况修改配置信息

