---
title: Linux制作离线yum源
tags:
  - Linux
  - yum
  - 离线
comments: true
categories:
  - Linux
thumbnail: 'http://image.hming.org/logo/linux.jpg'
date: 2019-03-29 14:40:35
updated: 2019-03-29 14:40:35
password:
---
制作离线yum源的方法
<!-- more -->
[参考](https://blog.csdn.net/huangjin0507/article/details/51351807)
### 基本步骤
1. 制作或挂载一个本地yum源目录
2. 修改或增加repo配置文件指向
### 离线yum包制作
#### 利用官方包
##### 下载ISO文件
到官网[http://isoredirect.centos.org/](http://isoredirect.centos.org/)下载镜像包，尽量下载`Everything ISO`版本，这里面的包最全，另外一个“DVD ISO”是通用版，里面的包并不全，还有一个“Minimal ISO”是Centos最小安装版（相当于是windows的纯净系统）。
下载文件名如：CentOS-7-x86_64-Everything-1810.iso
##### 挂载ISO到目录

#### 自己制作包
##### 查看rpm包依赖与下载依赖包
1. 查看.rpm 包依赖：
`rpm -qpR [package]`

2. 通过`yum install --downloadonly --downloaddir=[download_dir] [package]` 来只下载所有依赖包不安装包**`(前提是当前环境没有安装该包)`**
> 在CentOS/RHEL 6或更早期的版本中，你需要安装一个单独yum插件(名称为`yum-plugin-downloadonly`)才能使用`--downloadonly`命令选项：
```bash
yum install -y yum-plugin-downloadonly
#如果没有该插件，你会在使用yum时得到以下错误：
Command line error: no such option: --downloadonly</package>
```
3. 运行`yum list [package] --showduplicates` 来查看包的多个版本
##### 利用rpm包制作yum包
1. 安装`createrepo`工具
`createrepo`命令用来制作yum包，没有安装该软件可以通过下载`createrepo`的rpm包，通过rpm命令进行安装。
2. 将所有的rpm包放到一个目录下
3. 到rpm包的目录执行`createrepo .`命令
 ```bash
 [root@hadoop001 yum-repo]# createrepo .
 ```
4. 之后会生成一个`repodata`的目录,该目录就成了一个yum源
### 离线yum源配置
