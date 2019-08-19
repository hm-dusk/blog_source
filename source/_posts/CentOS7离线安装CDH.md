---
title: CentOS7离线安装CDH
tags:
  - 大数据
  - CDH
  - 离线安装
comments: true
categories:
  - 大数据
  - CDH
thumbnail: ''
date: 2019-08-16 15:03:41
updated: 2019-08-16 15:03:41
password:
---
CentOS7.6离线安装CDP，Cloudera Manager版本：6.3.0，CDH版本：6.3.0-1
<!-- more -->
### 本文环境
|节点|IP地址|
|:---:|:---:|
|hdp001|192.168.171.10|
|hdp002|192.168.171.11|
|hdp003|192.168.171.12|

### 环境准备

#### 磁盘准备
离线安装包共计3G左右，请保证有足够空间。
保证/opt目录有足够空间，至少20G

#### 网络准备
CDH支持IPV4，不支持IPV6
1. 将主机名设置为全限定域名格式（FQDN：Fully Qualified Domain Name）
`sudo hostnamectl set-hostname foo-1.example.com`
2. 配置/etc/hosts文件，添加集群中所有全限定域名，也可以添加非限定名
```bash
1.1.1.1 foo-1.example.com foo-1
2.2.2.2 foo-2.example.com foo-2
3.3.3.3 foo-3.example.com foo-3
4.4.4.4 foo-4.example.com foo-4
```

#### 配置免密登录
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

#### 安装MySQL
离线安装MySQL教程点击[这里](http://blog.hming.org/2018/12/08/CentOS7%E4%B8%8B%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85MySQL/)

新建数据库hive、ambari（为后续安装做准备）。
```bash
mysql> create database hive;
Query OK, 1 row affected (0.00 sec)

mysql> create database ambari;
Query OK, 1 row affected (0.00 sec)
```
