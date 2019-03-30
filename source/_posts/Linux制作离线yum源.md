---
title: Linux制作离线yum源
tags:
  - Linux
  - yum
  - 离线
comments: true
categories:
  - Linux
  - yum源
thumbnail: 'http://image.hming.org/logo/linux.jpg'
date: 2019-03-29 14:40:35
updated: 2019-03-29 14:40:35
password:
---
制作离线yum源的方法
<!-- more -->
[参考](https://blog.csdn.net/huangjin0507/article/details/51351807)
### 查看rpm包依赖与下载依赖包
查看.rpm 包依赖：
`rpm -qpR [package]`
通过`yum install --downloadonly --downloaddir=[download_dir] [package]` 来只下载所有依赖包不安装包
运行`yum list [package] --showduplicates` 来查看包的多个版本
