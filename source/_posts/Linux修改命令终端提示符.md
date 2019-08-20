---
title: Linux修改命令终端提示符
tags:
  - Linux
  - 命令行提示符
comments: true
categories:
  - Linux
img: 'http://image.hming.org/logo/linux.jpg'
date: 2019-03-29 11:47:18
updated: 2019-03-29 11:47:18
password:
summary: Linux命令行是操作Linux的重要手段，命令行提示符千篇一律的格式有时会让命令和输出难以辨认，本文将介绍如何修改命令行提示符的格式。
---
### 命令行提示符代表含义
命令行提示符一般格式含义：
`[root@sandbox ~]#`
> 其中@前`root`表示当前用户，@后`sandbox`表示当前主机名，`~`表示当前目录为家目录

Linux命令行结尾的提示符有`#`和`$`两种不同的符号，如下所示：
```bash
[root@sandbox ~]#    #<==这是超级管理员root用户对应的命令行。
[liming@sandbox ~]$  #<==这是普通用户liming对应的命令行。
```

### 修改命令行提示符格式
Linux命令提示符由PS1环境变量控制，可以通过全局配置文件`/etc/bashrc`或`/etc/profile`中进行按需配置和调整。
查看当前PS1设置：
```bash
[root@sandbox /]# set|grep PS1
PS1='[\u@\h \W]\$ '
```
#### PS1变量
最终使用：
```bash
export PS1='[\[\e[32;1m\]\u@\h \W\[\e[0m\]]\$ '
```
参考：[1](https://blog.51cto.com/oldboy/1926142)