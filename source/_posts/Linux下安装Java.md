---
title: Linux下安装Java
date: 2018-09-14 00:20:12
updated: 2019-4-9 09:50:46
tags:
  - Java
  - Linux
comments: true
categories: 
  - Linux
  - Java
password:
thumbnail: 'http://image.hming.org/logo/java.jpg'
---
Linux下安装Java
<!-- more -->
### 将Java压缩包传到Linux
使用`rz`命令将tar包上传到Linux系统
![rz命令](http://image.hming.org/linux%E4%B8%8B%E5%AE%89%E8%A3%85java/rz%E6%88%AA%E5%9B%BE.jpg)

> 关于rz命令，[点击查看介绍](http://http://blog.hming.org/2018/08/15/Linux%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/#rz%E4%B8%8Esz%EF%BC%88%E4%B8%8A%E4%BC%A0%E3%80%81%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%EF%BC%89)

### 解压安装包

```shell
[root@hadoopmaster mnt]# ls
jdk-8u101-linux-x64.tar.gz
[root@hadoopmaster mnt]# tar -zxvf jdk-8u101-linux-x64.tar.gz 
...
jdk1.8.0_101/man/ja_JP.UTF-8/man1/javapackager.1
jdk1.8.0_101/man/ja_JP.UTF-8/man1/jstat.1
[root@hadoopmaster mnt]# ls
jdk1.8.0_101  jdk-8u101-linux-x64.tar.gz
[root@hadoopmaster mnt]# 
```

### 配置环境变量

1. `vim /etc/profile`编辑配置文件，添加如下代码
    ```shell
    # java
    export JAVA_HOME=/home/jdk  # 该路径为java安装路径
    export CLASSPATH=$JAVA_HOME/lib/
    export PATH=$PATH:$JAVA_HOME/bin
    ```
2. 保存后退出
3. `source /etc/profile`刷新配置文件

### 验证安装状态

```shell
[root@hadoopmaster mnt]# java -version
java version "1.8.0_101"
Java(TM) SE Runtime Environment (build 1.8.0_101-b13)
Java HotSpot(TM) 64-Bit Server VM (build 25.101-b13, mixed mode)
[root@hadoopmaster mnt]# 
```

