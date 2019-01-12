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
updated: 2019-01-09 20:07:15
password:
---
CentOS7离线安装HDP
<!-- more -->
参考链接：[hdp-hadoop离线安装](https://blog.csdn.net/qq_35094452/article/details/81329003)
主要步骤：
### 环境准备
1. 配置免密登录
2. 关闭防火墙
```shell
# 查看防火墙状态
firewall-cmd --state
# 临时关闭
systemctl stop firewalld
# 禁止开机启动
systemctl disable firewalld
```
3. 关闭selinux
```shell
永久有效
修改 /etc/selinux/config 文件中的 SELINUX="" 为 disabled ，然后重启。
即时生效
setenforce 0
```
4. 安装jdk、Python（所有节点）、MySQL（安装一个即可）
5. 下载离线包（包含HDP、ambari、HDP-UTILS、HDP-GPL（非必须））
[ambari-2.7.3.0](https://docs.hortonworks.com/HDPDocuments/Ambari-2.7.3.0/bk_ambari-installation/content/ambari_repositories.html)
[HDP-3.1.0.0相关](https://docs.hortonworks.com/HDPDocuments/Ambari-2.7.3.0/bk_ambari-installation/content/hdp_31_repositories.html)
6. 安装httpd服务（Apache服务）
注：selinux未关闭可能导致Apache服务地址403
```bash
[root@master ~]# yum -y install httpd
[root@master ~]# service httpd restart
Redirecting to /bin/systemctl restart httpd.service
```
7. 将压缩包解压到/var/www/html/下
### 制作本地源
1. yum -y install createrepo
2. 
### 使用HDP
#### HDP安装路径
HDP各组件默认安装目录：/usr/hdp/版本号
