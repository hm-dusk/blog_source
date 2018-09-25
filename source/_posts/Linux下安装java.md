---
title: Linux下安装java
date: 2018-09-14 00:20:12
tags:
  - java
  - Linux
comments: true
categories: Linux
password:
---
Linux下安装Java
![java](http://ot87uvd34.bkt.clouddn.com/linux%E4%B8%8B%E9%85%8D%E7%BD%AEjava/java.jpg)
<!-- more -->
### 将Java压缩包传到Linux
使用`rz`命令将tar包上传到Linux系统
![rz命令](http://ot87uvd34.bkt.clouddn.com/Linux%E4%B8%8B%E5%AE%89%E8%A3%85Java/rz%E6%88%AA%E5%9B%BE.jpg)

> 没用过`rz`命令的，使用`yum install -y lrzsz`安装rz软件

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
    export JAVA_HOME=/mnt/jdk1.8.0_101  # 该路径为java安装路径
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

