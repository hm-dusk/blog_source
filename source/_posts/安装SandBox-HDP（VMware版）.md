---
title: 安装SandBox HDP（VMware版）
tags:
  - 大数据
  - HDP
  - SandBox
  - VMware
  - 虚拟机
comments: true
categories:
  - 大数据
  - SandBox
thumbnail: 'http://image.hming.org/logo/sandbox.png'
date: 2019-04-02 11:28:35
updated: 2019-04-02 11:28:35
password:
---
SandBox HDP版本3.0.1，安装环境为Windows 10
<!-- more -->
参考官网教程：[Deploying Hortonworks Sandbox on VMWare](https://hortonworks.com/tutorial/sandbox-deployment-and-install-guide/section/2/)
### 环境准备
|方面|要求|
|:--:|:--:|
|软件|[安装VMware](https://my.vmware.com/cn/web/vmware/downloads)|
|内存|推荐16G以上（会开一个内存为10G的虚拟机）|
### 运行原理
VMware启动了一个Linux虚拟机，在Linux虚拟机里面会启动两个docker容器
```bash
[root@sandbox-host ~]# docker images
REPOSITORY                         TAG     IMAGE ID        CREATED        SIZE
hortonworks/sandbox-proxy          1.0     ca272ae0e63a    4 months ago   109MB
hortonworks/sandbox-hdp-security   3.0     ae1d1779b081    4 months ago   27.5GB
```
`sandbox-proxy`容器负责代理转发一些端口
`sandbox-hdp-security`容器则是HDP环境
所以，要对HDP环境进行修改，比如修改ambari管理员密码，就需要进入docker容器里面
可以通过`ssh`登录`2222`端口，也可以通过`docker exec`命令进入，docker相关命令参考[Docker替换镜像源与常用命令](http://blog.hming.org/2018/09/18/Docker%E6%9B%BF%E6%8D%A2%E9%95%9C%E5%83%8F%E6%BA%90%E4%B8%8E%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/)
### 下载镜像文件
到[官网](https://hortonworks.com/downloads/#sandbox)下载ova格式的镜像文件（HDP_3.0.1_vmware_181205.ova 20.5G）
![镜像文件下载](http://image.hming.org/安装sandbox-VMware/VMware镜像文件下载.png)
下载可能需要注册，随便填就行了
### 将.ova镜像导入到VMware中
1. 打开VMware，点击`文件`->`打开`，导入刚才下载的文件：`HDP_3.0.1_vmware_181205.ova`
![导入镜像文件](http://image.hming.org/安装sandbox-VMware/VMware导入镜像文件.png)
2. 开启虚拟机（这里可以看到虚拟机的一些信息，包括内存磁盘等）
![开启虚拟机](http://image.hming.org/安装sandbox-VMware/VMware开启虚拟机.png)
3. 开启后可能会遇到无法连接网络的问题，这时候选择桥接模式，重启一下就行
![虚拟机网络连接方式](http://image.hming.org/安装sandbox-VMware/虚拟机网络连接方式.png)
### 如何使用
成功运行后窗口会打印一些信息，可以通过这些信息连接到虚拟机
![运行成功后打印信息](http://image.hming.org/安装sandbox-VMware/运行成功后打印信息.png)
上图中的1080端口为sandbox端口，可以通过浏览器访问该端口，得到以下界面：
![sandbox页面](http://image.hming.org/安装sandbox-VMware/sandbox页面.png)
左侧launch dashboard直接进入ambari管理界面，右侧则是一些链接，包括ambari管理地址、Ranger地址、DAS地址等
4200端口则提供了一个浏览器访问命令行的接口：
![浏览器访问虚拟机](http://image.hming.org/安装sandbox-VMware/浏览器访问虚拟机.png)
使用`root`登录，默认密码为`hadoop`，第一次登录会提示修改root密码

本文到此为止，更详细的使用教程，请参照[SandBox-HDP使用详解](http://blog.hming.org/2019/04/04/SandBox-HDP使用详解/)