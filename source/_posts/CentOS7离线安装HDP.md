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
updated: 2019-1-14 00:18:18
password:
---
CentOS7离线安装HDP
<!-- more -->
参考链接：[hdp-hadoop离线安装](https://blog.csdn.net/qq_35094452/article/details/81329003)
主要步骤：
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
不关闭可能导致Apache http服务无法访问
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
新建数据库hive、ambari、（为后续安装做准备）
```bash
mysql> create database hive;
Query OK, 1 row affected (0.00 sec)

mysql> create database ambari;
Query OK, 1 row affected (0.00 sec)
```
#### 下载离线包（包含HDP、ambari、HDP-UTILS、HDP-GPL（非必须））
[Ambari-2.7.3.0](https://docs.hortonworks.com/HDPDocuments/Ambari-2.7.3.0/bk_ambari-installation/content/ambari_repositories.html)
[HDP-3.1.0.0相关](https://docs.hortonworks.com/HDPDocuments/Ambari-2.7.3.0/bk_ambari-installation/content/hdp_31_repositories.html)
#### 安装httpd服务（Apache服务，ambari节点安装即可）
注：selinux未关闭可能导致Apache服务地址403
```bash
[root@hdp001 ~]# yum -y install httpd
[root@hdp001 ~]# service httpd restart
Redirecting to /bin/systemctl restart httpd.service
```
访问服务器80端口，查看httpd服务是否开启
#### 将压缩包解压到/var/www/html/下
```bash
[root@hdp001 ambari]# ls
ambari-2.7.3.0-centos7.tar.gz  HDP-3.1.0.0-centos7-rpm.tar.gz  HDP-UTILS-1.1.0.22-centos7.tar.gz
...

```
### 制作本地源
1. yum -y install createrepo
2. 
### 使用HDP
#### HDP安装路径
HDP各组件默认安装目录：/usr/hdp/版本号
