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
CentOS7离线安装HDP，Ambari版本：2.7.3.0，HDP版本：3.1.0.0
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
**注：配置信息如端口、映射路径可以通过编辑`/etc/httpd/conf/httpd.conf`文件进行修改**
#### 将压缩包解压到/var/www/html/下
```bash
[root@hdp001 ambari]# ls
ambari-2.7.3.0-centos7.tar.gz  HDP-3.1.0.0-centos7-rpm.tar.gz  HDP-UTILS-1.1.0.22-centos7.tar.gz
# 解压...
[root@hdp001 ambari]# ls
ambari ambari-2.7.3.0-centos7.tar.gz  HDP HDP-3.1.0.0-centos7-rpm.tar.gz  HDP-UTILS HDP-UTILS-1.1.0.22-centos7.tar.gz
```
访问服务器80端口相应/ambari/地址，可以访问到文件和文件夹即可
### 制作本地源
1. 安装工具
```bash
[root@hdp001 ambari]# yum -y install createrepo
[root@hdp001 ambari]# createrepo ./
```
2. 修改repo源文件
```bash
[root@hdp001 ambari]# vim ambari/centos7/2.7.3.0-139/ambari.repo
```
修改`baseurl`与`gpgkey`值为Apache httpd服务能访问到的地址，如下：
```bash
#VERSION_NUMBER=2.7.3.0-139
[ambari-2.7.3.0]
#json.url = http://public-repo-1.hortonworks.com/HDP/hdp_urlinfo.json
name=ambari Version - ambari-2.7.3.0
baseurl=http://192.168.0.148:80/ambari/ambari/centos7/2.7.3.0-139
gpgcheck=1
gpgkey=http://192.168.0.148:80/ambari/
priority=1
```
将repo文件拷贝到`/etc/yum.repos.d/`目录
```bash
[root@hdp001 ambari]# cp ambari/centos7/2.7.3.0-139/ambari.repo /etc/yum.repos.d/
```
HDP源修改方式同上
```bash

```
3. 清除yum缓存
```bashambari/centos7/2.7.3.0-139/RPM-GPG-KEY/RPM-GPG-KEY-Jenkins
enabled=1
[root@hdp001 ambari]# yum clean all
[root@hdp001 ambari]# yum makecache
[root@hdp001 ambari]# yum repolist
```

4. 将repo文件拷贝到子节点

### 安装Ambari-server
本次安装使用第三方数据库MySQL模式，默认为PostgreSQL模式（生产环境不推荐）。
需提前准备好MySQL数据库连接jar包
#### 初始化设置

### 使用HDP
#### HDP安装路径
HDP各组件默认安装目录：/usr/hdp/版本号
