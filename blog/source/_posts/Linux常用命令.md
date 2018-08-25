---
title: Linux常用命令
date: 2018-08-15 13:42:08
tags: [Linux,命令]
comments: true
categories: Linux
password:
---

常用Linux命令

<!-- more-->

### scp

#### 命令格式

`scp  [参数] [原路径] [目标路径] `

#### 命令功能

scp是 secure copy的缩写, scp是linux系统下基于`ssh`登陆进行安全的远程文件`拷贝命令`。linux的scp命令可以在`linux服务器之间`复制文件和目录。 

#### 命令参数

> -1  强制scp命令使用协议ssh1  
-2  强制scp命令使用协议ssh2  
-4  强制scp命令只使用IPv4寻址  
-6  强制scp命令只使用IPv6寻址  
-B  使用批处理模式（传输过程中不询问传输口令或短语）  
-C  允许压缩。（将-C标志传递给ssh，从而打开压缩功能）  
-p 保留原文件的修改时间，访问时间和访问权限。  
-q  不显示传输进度条。  
-r  递归复制整个目录。  
-v 详细方式显示输出。scp和ssh(1)会显示出整个过程的调试信息。这些信息用于调试连接，验证和配置问题。   
-c cipher  以cipher将数据传输进行加密，这个选项将直接传递给ssh。   
-F ssh_config  指定一个替代的ssh配置文件，此参数直接传递给ssh。  
-i identity_file  从指定文件中读取传输时使用的密钥文件，此参数直接传递给ssh。    
-l limit  限定用户所能使用的带宽，以Kbit/s为单位。     
-o ssh_option  如果习惯于使用ssh_config(5)中的参数传递方式，   
-P port  注意是大写的P, port是指定数据传输用到的端口号   
-S program  指定加密传输时所使用的程序。此程序必须能够理解ssh(1)的选项。

#### 使用实例

1. 复制文件

`scp local_file remote_username@remote_ip:remote_folder`

或者

`scp local_file remote_username@remote_ip:remote_file`

或者

`scp local_file remote_ip:remote_folder`

或者

`scp local_file remote_ip:remote_file`

2. 复制目录

`scp -r local_folder remote_username@remote_ip:remote_folder`

或者  

`scp -r local_folder remote_ip:remote_folder`

> 从远程拷贝到本地同理

### jobs

#### 命令格式

`jobs(选项)(参数)`

#### 命令功能

**jobs命令**用于显示Linux中的任务列表及任务状态，包括后台运行的任务。该命令可以显示任务号及其对应的进程号。其中，任务号是以普通用户的角度进行的，而进程号则是从系统管理员的角度来看的。一个任务可以对应于一个或者多个进程号。 

#### 命令参数

> -l：显示进程号；
> -p：仅任务对应的显示进程号；
> -n：显示任务状态的变化；
> -r：仅输出运行状态（running）的任务；
> -s：仅输出停止状态（stoped）的任务。

#### 使用实例

`&`这个用在一个命令的最后，可以把这个命令放到后台执行

`Ctrl+z`将当前任务加入后台任务

```shell
[root@hadoopmaster ~]# ping www.baidu.com
PING www.a.shifen.com (180.97.33.108) 56(84) bytes of data.
64 bytes from 180.97.33.108 (180.97.33.108): icmp_seq=1 ttl=128 time=45.4 ms
64 bytes from 180.97.33.108 (180.97.33.108): icmp_seq=2 ttl=128 time=45.3 ms
^Z
[1]+  已停止               ping www.baidu.com
```

`jobs`显示当前后台任务列表

```shell
[root@hadoopmaster ~]# jobs
[1]+  已停止               ping www.baidu.com
```

`bg`

将一个在后台暂停的命令，变成继续执行 如果后台中有多个命令，可以用bg %jobnumber将选中的命令调出，%jobnumber是通过jobs命令查到的后台正在执行的命令的序号(不是pid)

`fg`

将后台中的命令调至前台继续运行 如果后台中有多个命令，可以用 fg %jobnumber将选中的命令调出，%jobnumber是通过jobs命令查到的后台正在执行的命令的序号(不是pid)

`kill`杀死一个进程，用法同**fg**和**bg**

### alias

#### 命令格式

`alias ［别名=’命令’］`  ，在定义别名时，等号两边不能有空格。

`unalias [别名]   `  删除别名。

#### 命令功能

linux系统下给命令指定别名。

在linux系统中如果命令太长又不符合用户的习惯，那么我们可以为它指定一个别名。虽然可以为命令建立“链接”解决长文件名的问题，但对于带命 令行参数的命令，链接就无能为力了。而指定别名则可以解决此类所有问题。

#### 使用实例

```shell
[root@hadoopmaster ~]# java -version
java version "1.8.0_101"
Java(TM) SE Runtime Environment (build 1.8.0_101-b13)
Java HotSpot(TM) 64-Bit Server VM (build 25.101-b13, mixed mode)

[root@hadoopmaster ~]# alias jv='java -version'

[root@hadoopmaster ~]# jv
java version "1.8.0_101"
Java(TM) SE Runtime Environment (build 1.8.0_101-b13)
Java HotSpot(TM) 64-Bit Server VM (build 25.101-b13, mixed mode)
```

使用不带参数的alias时，显示当前所有已定义别名

```shell
[root@hadoopmaster ~]# alias
alias cp='cp -i'
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
alias grep='grep --color=auto'
alias jv='java -version'
alias l.='ls -d .* --color=auto'
alias ll='ls -l --color=auto'
alias ls='ls --color=auto'
alias mv='mv -i'
alias rm='rm -i'
alias which='alias | /usr/bin/which --tty-only --read-alias --show-dot --show-tilde'
alias x='xcall.sh'
```



