---
title: CentOS7离线安装HDF
tags:
  - 大数据
  - HDF
  - 离线安装
comments: true
categories:
  - 大数据
img: ''
date: 2019-02-14 08:48:27
updated: 2019-02-14 08:48:27
password:
summary: CentOS7离线安装HDF，Ambari版本：2.7.3.0，HDF版本：3.3.1.0
---
### 本文环境
已存在Ambari和HDP环境，Ambari搭建参照[CentOS7离线安装HDP](https://blog.hming.org/2019/01/09/CentOS7%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85HDP/)

### 下载离线包
[HDF仓库地址](https://docs.hortonworks.com/HDPDocuments/HDF3/HDF-3.3.1/release-notes/content/hdf_repository_locations.html)
找到对应操作系统的包，下载HDF Management Pack与HDF RPM tarball两个包即可。（本文为CentOS7的包）
> 注意：HDF RPM tarball包大小`3.6G`左右，HDF Management Pack包`96M`左右，请确保保存路径有足够空间

```bash
[root@master ambari]# ll -h
total 3.7G
drwxr-xr-x 3 root      root  4.0K Jan 16 15:00 ambari
-rw-r--r-- 1 root      root  3.6G Dec 15 02:36 HDF-3.3.1.0-centos7-rpm.tar.gz
-rw-r--r-- 1 root      root   96M Dec 15 02:13 hdf-ambari-mpack-3.3.1.0-10.tar.gz
drwxr-xr-x 3 ambari-qa users 4.0K Dec 11 11:49 HDP
drwxr-xr-x 3 ambari-qa users 4.0K Aug 13  2018 HDP-UTILS
```
其中ambari、HDP、HDP-UTILS为[CentOS7离线安装HDP](https://blog.hming.org/2019/01/09/CentOS7%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85HDP/)中制作的yum本地源地址

### 制作HDF yum镜像源
参考[制作本地源](https://blog.hming.org/2019/01/09/CentOS7%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85HDP/#%E5%88%B6%E4%BD%9C%E6%9C%AC%E5%9C%B0%E6%BA%90)，将`HDF-3.3.1.0-centos7-rpm.tar.gz`包解压，制作yum本地源。
1. 解压到`httpd`服务路径(本文httpd服务路径为`/cloud/ambari`)

```bash
[root@master ambari]# pwd
/cloud/ambari
[root@master ambari]# tar -zxvf HDF-3.3.1.0-centos7-rpm.tar.gz 
[root@node1 ambari]# ll -h
total 3.7G
drwxr-xr-x 3 root      root  4.0K Jan 16 15:00 ambari
drwxr-xr-x 3 ambari-qa users 4.0K Dec 15 02:19 HDF
-rw-r--r-- 1 root      root  3.6G Dec 15 02:36 HDF-3.3.1.0-centos7-rpm.tar.gz
-rw-r--r-- 1 root      root   96M Dec 15 02:13 hdf-ambari-mpack-3.3.1.0-10.tar.gz
drwxr-xr-x 3 ambari-qa users 4.0K Dec 11 11:49 HDP
drwxr-xr-x 3 ambari-qa users 4.0K Aug 13  2018 HDP-UTILS
```

2. 修改`./HDF/centos7/3.3.1.0-10/hdf.repo`文件为以下内容

```bash
#VERSION_NUMBER=3.3.1.0-10
[HDF-3.3.1.0]
name=HDF Version - HDF-3.3.1.0
baseurl=http://192.168.0.151:88/ambari/HDF/centos7/3.3.1.0-10
gpgcheck=1
gpgkey=http://192.168.0.151:88/ambari/HDF/centos7/3.3.1.0-10/RPM-GPG-KEY/RPM-GPG-KEY-Jenkins
enabled=1
priority=1


[HDP-UTILS-1.1.0.22]
name=HDP-UTILS Version - HDP-UTILS-1.1.0.22
baseurl=http://192.168.0.151:88/ambari/HDP-UTILS/centos7/1.1.0.22
gpgcheck=1
gpgkey=http://192.168.0.151:88/ambari/HDP-UTILS/centos7/1.1.0.22/RPM-GPG-KEY/RPM-GPG-KEY-Jenkins
enabled=1
priority=1
```
> 1)其中192.168.0.151:88为httpd的路径和端口，需根据实际情况修改。
> 2)HDP-UTILS如果在HDP中已经配置过，则这里可以删除。

3. 拷贝`hdf.repo`文件到`/etc/yum.repos.d/`目录下，进行yum更新
```bash
[root@master ambari]# cp hdf.repo /etc/yum.repos.d/
[root@master ambari]# yum clean all
[root@master ambari]# yum makecache
[root@master ambari]# yum repolist
```
> 如果yum报错，则可能是hdf源没有配置成功，或者`hdf.repo`文件有误，更正后重试即可。

4. 将`hdf.repo`拷贝到其他节点，然后每个节点进行yum更新

### 安装HDF Management Pack
此处参考[官方文档](https://docs.hortonworks.com/HDPDocuments/HDF3/HDF-3.3.1/installing-hdf-on-hdp/content/installing_the_hdf_management_pack.html)
1. 使用`ambari-server install-mpack`命令安装Management Pack

```bash
[root@master ambari]# ambari-server install-mpack --mpack=./hdf-ambari-mpack-3.3.1.0-10.tar.gz --verbose
Using python  /usr/bin/python
Installing management pack
INFO: Loading properties from /etc/ambari-server/conf/ambari.properties
INFO: Installing management pack ./hdf-ambari-mpack-3.3.1.0-10.tar.gz
INFO: Loading properties from /etc/ambari-server/conf/ambari.properties
INFO: Download management pack to temp location /var/lib/ambari-server/data/tmp/hdf-ambari-mpack-3.3.1.0-10.tar.gz
INFO: Loading properties from /etc/ambari-server/conf/ambari.properties
...
INFO: Loading properties from /etc/ambari-server/conf/ambari.properties
INFO: Successfully switched addon services using config file /var/lib/ambari-server/resources/mpacks/hdf-ambari-mpack-3.3.1.0-10/hooks/HDF-3.3.json

INFO: Loading properties from /etc/ambari-server/conf/ambari.properties
Ambari Server 'install-mpack' completed successfully.
```

2. 使用`ambari-server restart`命令重启ambari服务

```bash
[root@master ambari]# ambari-server restart
Using python  /usr/bin/python
Restarting ambari-server
Waiting for server stop...
Ambari Server stopped
Ambari Server running with administrator privileges.
Organizing resource files at /var/lib/ambari-server/resources...
Ambari database consistency check started...
Server PID at: /var/run/ambari-server/ambari-server.pid
Server out at: /var/log/ambari-server/ambari-server.out
Server log at: /var/log/ambari-server/ambari-server.log
Waiting for server start.......................
Server started listening on 8080

DB configs consistency check: no errors and warnings were found.
```

### 更新ambari服务中HDF源地址
参考[官方文档](https://docs.hortonworks.com/HDPDocuments/HDF3/HDF-3.3.1/installing-hdf-on-hdp/content/update_the_hdf_base_url.html)
1. 浏览器进入Ambari服务地址（默认端口为8080）
2. 在右上角admin下拉框中选择Manage Ambari
3. 选择左边栏的Versions，点击HDP版本链接
4. 此时会发现Repositories中多出HDF-3.3一栏，填入之前制作的本地源地址即可
本文地址为：http://192.168.0.151:88/ambari/HDF/centos7/3.3.1.0-10
5. 点击save保存
6. 返回主界面，添加service时就会发现多了NiFi等HDF支持的组件