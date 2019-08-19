---
title: Linux集群配置免密码登录
tags:
  - Linux
  - 集群
  - SSH
comments: true
date: 2018-09-16 18:12:14
updated: 2019-5-20 16:45:43
categories: 
  - Linux
password:
thumbnail: 'http://image.hming.org/logo/ssh.jpg'
---
Linux集群配置免密码登录
<!-- more -->
**本文环境：**

|节点|IP地址|
|:---:|:---:|
|hadoopmaster|192.168.171.10|
|hadoop001|192.168.171.11|
|hadoop002|192.168.171.12|
> **原理：**
> 每台主机`authorized_keys`文件里面包含的主机（ssh秘钥），该主机都能无密码登录，所以只要每台主机的`authorized_keys`文件里面都放入其他主机（需要无密码登录的主机）的ssh秘钥就行了。

### 配置每个节点的hosts文件
`vim /etc/hosts`编辑hosts文件，添加如下代码
```shell
192.168.171.10 hadoopmaster
192.168.171.11 hadoop001
192.168.171.12 hadoop002
```

### 每个节点生成ssh秘钥
```shell
[root@hadoopmaster ~]# ssh-keygen -t rsa # 执行命令生成秘钥
...
[root@hadoopmaster .ssh]# ls
id_rsa  id_rsa.pub
```
执行命令后会在~目录下生成`.ssh`文件夹，里面包含`id_rsa`和`id_rsa.pub`两个文件。
> 执行生成秘钥命令时会让用户选择生成地址，如果想直接使用默认地址（不想交互），则可以使用
> `ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa`命令

### 将每个节点的id拷贝到所有节点的`authorized_keys`中
#### 方法一（推荐）
##### 每个节点执行ssh自带命令，将该节点的id拷贝到其他节点中
```bash
[root@hadoopmaster /]# ssh-copy-id hadoopmaster
[root@hadoopmaster /]# ssh-copy-id hadoop001
[root@hadoopmaster /]# ssh-copy-id hadoop002
```
```bash
[root@hadoop001 /]# ssh-copy-id hadoopmaster
[root@hadoop001 /]# ssh-copy-id hadoop001
[root@hadoop001 /]# ssh-copy-id hadoop002
```
```bash
[root@hadoop002 /]# ssh-copy-id hadoopmaster
[root@hadoop002 /]# ssh-copy-id hadoop001
[root@hadoop002 /]# ssh-copy-id hadoop002
```

#### 方法二
##### 在主节点上将公钥拷贝到一个特定文件中
```shell
[root@hadoopmaster /]# cd ~/.ssh
[root@hadoopmaster .ssh]# cp id_rsa.pub authorized_keys # 拷贝到authorized_keys文件中
[root@hadoopmaster .ssh]# ls
authorized_keys  id_rsa  id_rsa.pub
```
##### 将`authorized_keys`文件拷贝至下一个节点，并将该节点的ssh秘钥加入该文件中
```shell
[root@hadoopmaster .ssh]# scp authorized_keys root@hadoop001:/root/.ssh/
root@hadoop001's password:      # 此时会提示输入密码，输入hadoop001主机root密码即可
authorized_keys                                                           100%  399   450.9KB/s   00:00

# 进入001主机    
[root@hadoop001 /]# cd ~/.ssh
[root@hadoop001 .ssh]# ls
authorized_keys  id_rsa  id_rsa.pub
[root@hadoop001 .ssh]# cat id_rsa.pub>>authorized_keys  # 使用cat追加到authorized_keys文件
ssh-rsa AAAAB.....TnYjJ root@hadoop001  
ssh-rsa AAAAB.....Ah+n9 root@hadoopmaster
[root@hadoop001 .ssh]# 
```
> 关于scp命令请点击[这里](http://blog.hming.org/2018/08/15/Linux%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/)查看

##### 重复上一步动作，将每个节点的ssh秘钥都加入`authorized_keys`文件中
##### 将最后节点生成的`authorized_keys`文件复制到每个节点下即可
```shell
[root@hadoop002 .ssh]# scp authorized_keys root@hadoopmaster:/root/.ssh
...
[root@hadoop002 .ssh]# scp authorized_keys root@hadoop001:/root/.ssh
...
```

### 测试登录
使用`ssh 用户名@节点名（或ip地址）`命令进行无密码登录测试
```shell
[root@hadoopmaster .ssh]# ssh root@hadoop001
Last login: Sun Sep 16 17:51:27 2018 from 192.168.171.1
[root@hadoop001 ~]# ssh root@hadoop002
Last login: Sun Sep 16 17:51:31 2018 from 192.168.171.1
[root@hadoop002 ~]# ssh root@hadoopmaster
Last login: Sun Sep 16 17:51:23 2018 from 192.168.171.1
[root@hadoopmaster ~]# 
```