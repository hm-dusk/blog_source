---
title: Linux常用命令
date: 2018-08-15 13:42:08
updated: 2018-08-15 13:42:08
tags: [Linux,命令]
comments: true
categories: 
  - Linux
  - 命令
password:
---

常用Linux命令
![linux](http://ot87uvd34.bkt.clouddn.com/linux%E5%91%BD%E4%BB%A4/linux2.jpg)

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

### \\+回车

#### 命令格式

[未输完的命令] `\+回车` [继续未输完的命令]

#### 命令功能

当输入指令过长时，使用`\+回车`可以跳到下一行继续输入指令

#### 使用实例

```shell
[root@hadoopCDH mnt]# ls -al
总用量 0
drwxr-xr-x.  3 root root  19 8月  30 16:22 .
dr-xr-xr-x. 18 root root 235 8月  31 09:07 ..
drwxr-xr-x.  3 root root  53 8月  30 16:23 nginx
[root@hadoopCDH mnt]# ls \	 #输入\后再回车直接进入换行输入模式
> -al
总用量 0
drwxr-xr-x.  3 root root  19 8月  30 16:22 .
dr-xr-xr-x. 18 root root 235 8月  31 09:07 ..
drwxr-xr-x.  3 root root  53 8月  30 16:23 nginx
[root@hadoopCDH mnt]# 
```

### echo

#### 命令格式

`echo ${变量名}`

#### 命令功能

查看当前变量的值

**设置变量需遵从的规则**

1. 变量与变量内容之间只能用`=`来连接，不能有任何空格
    `myname=liming`
2. 如果要在变量内容里面输入空格，则用双引号
    `myname="li ming"`
3. 变数名称只能是英文字母与数字，但是开头字符不能是数字，如下为`错误示范`： 
    `2myname=VBird`
4. 变量内容若有空白字符可使用双引号`"`或单引号`'`将变量内容结合起来，但
   * 双引号内的特殊字符如`$`等，可以保有原本的特性，如下所示：
     `var="lang is $LANG"`则`echo $var`可得`lang is zh_TW.UTF-8`
   * 单引号内的特殊字符则仅为一般字符(纯文字)，如下所示：
     `var='lang is $LANG'`则`echo $var`可得`lang is $LANG`

1. 可用字符` \`将特殊符号(如[Enter], $, \,空白字符, '等)变成一般字符，如：
    `myname=VBird\ Tsai`
2. 一串指令的执行中，还需要藉由其他额外的指令所提供的资讯时，可以使用反单引号『\`指令\`』或『$(指令)』。**特别注意**，那个\`是键盘上方的数字键1左边那个按键，而不是单引号！例如想要取得核心版本的设定：
    `version=$(uname -r)`再`echo $version`可得`3.10.0-229.el7.x86_64`
3. 若该变量为扩增变量内容时，则可用`"$变量名称"`或`${变量}`累加内容，如下所示：
    `PATH="$PATH":/home/bin`或`PATH=${PATH} :/home/bin`
4. 若该变量需要在其他子程序执行，则需要以export来使变量变成环境变量：
    `export PATH`
5. 通常大写字符为系统预设变量，自行设定变量可以使用小写字符，方便判断(纯粹依照使用者兴趣与爱好) ；
6. 取消变量的方法为使用`unset 变量名称`例如取消myname的设定：
    `unset myname`

#### 使用实例

```shell
[root@hadoopCDH mnt]# echo $NGINX_HOME
/usr/local/nginx
[root@hadoopCDH mnt]# myname=liming
[root@hadoopCDH mnt]# echo $myname
liming
[root@hadoopCDH mnt]# echo ${myname}
liming
[root@hadoopCDH mnt]# 
```

### ntpdate（服务器时间同步）

#### 命令格式

`ntpdate time1.aliyun.com`

#### 命令功能

同步时间，与阿里云服务器时间同步。

#### 使用实例

```shell
[root@hadoopmaster bin]# xcall.sh ntpdate time1.aliyun.com
========== hadoopmaster ==========
11 Sep 09:45:55 ntpdate[6548]: adjust time server 203.107.6.88 offset 0.007047 sec
========== hadoop001 ==========
11 Sep 09:46:02 ntpdate[6278]: adjust time server 203.107.6.88 offset 0.002663 sec
========== hadoop002 ==========
11 Sep 09:46:08 ntpdate[4192]: adjust time server 203.107.6.88 offset 0.005169 sec
[root@hadoopmaster bin]# 
```

### history

#### 命令格式

`history`

#### 命令功能

查看历史执行命令

#### 使用实例

1. 设置显示命令时间

   ```
   [root@hadoopmaster ~]# echo 'export HISTTIMEFORMAT='%F %T ' "' >> /etc/profile # 将`export HISTTIMEFORMAT='%F %T '`添加进配置文件`/etc/profile`
   [root@hadoopmaster ~]# source /etc/profile # 刷新配置文件使其生效
   [root@hadoopmaster ~]# history 5 # 查看最近5条记录，发现显示了时间
    1063  2018-09-15 11:00:39 history --help
    1064  2018-09-15 11:04:14 cd ~
    1065  2018-09-15 11:04:50 echo 'HISTTIMEFORMAT="%F %T "' >> /etc/profile
    1066  2018-09-15 11:05:01 vim /etc/profile
    1067  2018-09-15 11:07:07 history 5
   ```

2. 执行历史某条命令

   ```
   [root@hadoopmaster ~]# history 4 # 显示最近4条记录
    1066  2018-09-15 11:05:01 vim /etc/profile
    1067  2018-09-15 11:07:07 history 5
    1068  2018-09-15 11:08:30 ls
    1069  2018-09-15 11:08:37 history 5
   [root@hadoopmaster ~]# !1068 # 执行1068条，也就是ls命令
   ls
   anaconda-ks.cfg  zookeeper.out
   [root@hadoopmaster ~]# 
   ```

### passwd

#### 命令格式

`passwd [用户名]`

#### 命令功能

修改账户密码

#### 使用实例

```bash
[root@slave001 /]# passwd root   	# 修改root密码
Changing password for user root.
New password: 						# 设置新密码
BAD PASSWORD: The password is shorter than 8 characters
Retype new password: 				# 确认新密码
passwd: all authentication tokens updated successfully.
```
修改root密码也可以使用下面一句命令搞定
```bash
[root@a3c8baf6961e /]# echo "1234" | passwd --stdin root  # 将root密码设置为1234
```

