---
title: Linux常用命令
date: 2018-08-15 13:42:08
updated: 2019-9-18 15:22:43
tags: [Linux,命令]
comments: true
categories: 
  - Linux
password:
img: ''
summary: 常用Linux命令（基于CentOS7）
top: true
cover: true
---
### 输入界面快捷操作（命令行快捷操作）

#### 操作方式及操作效果

| 操作方式 | 操作效果                                           |
| -------- | -------------------------------------------------- |
| `Ctrl+k` | 剪切命令行中光标所在处之后的所有字符（包括自身）   |
| `Ctrl+u` | 剪切命令行中光标所在处之前的所有字符（不包括自身） |
| `Ctrl+y` | 粘贴刚才所删除、剪切的字符                         |
| `Ctrl+o` | 回车效果                                           |
| `Ctrl+j` | 回车效果                                           |
| Ctrl+f   | 光标向后移动一个字符位,相当与->（右方向键）        |
| Ctrl+b   | 光标向前移动一个字符位,相当与<-（左方向键）        |
| Alt+f    | 光标向后移动一个单词位                             |
| Alt+b    | 光标向前移动一个单词位                             |
| `Ctrl+a` | 移动到当前行的开头                                 |
| `Ctrl+e` | 移动到当前行的结尾                                 |
| `Ctrl+l` | 清屏                                               |

### 清理缓存命令
| 说明 | 命令 |
| -------- | --------------------- |
| 查看内存使用情况 | `free -h` |
| 强制被改变的内容立刻写入磁盘，更新超块信息 | `sync` |
| 仅清除页面缓存（PageCache） | `echo 1 > /proc/sys/vm/drop_caches` |
| 清除目录项和inode | `echo 2 > /proc/sys/vm/drop_caches   ` |
| 清除页面缓存，目录项和inode | `echo 3 > /proc/sys/vm/drop_caches ` |
每个 Linux 系统有三种选项来清除缓存而不需要中断任何进程或服务。
（LCTT 译注：Cache，译作“缓存”，指 CPU 和内存之间高速缓存。Buffer，译作“缓冲区”，指在写入磁盘前的存储再内存中的内容。）
参考：
[https://blog.csdn.net/ailice001/article/details/80353924](https://blog.csdn.net/ailice001/article/details/80353924)
[https://www.cnblogs.com/yorkyang/p/9226121.html](https://www.cnblogs.com/yorkyang/p/9226121.html)

### 查看CPU信息
总核数 = 物理CPU个数 X 每颗物理CPU的核数 
总逻辑CPU数 = 物理CPU个数 X 每颗物理CPU的核数 X 超线程数
1. 查看物理CPU个数
```bash
[root@centos4 ~]# cat /proc/cpuinfo| grep "physical id"| sort| uniq| wc -l
1
```
2. 查看每个物理CPU中core的个数（核数）
```bash
[root@centos4 ~]# cat /proc/cpuinfo| grep "cpu cores"| uniq
cpu cores	: 4
```
3. 查看逻辑CPU的个数
```bash
[root@centos4 ~]# cat /proc/cpuinfo| grep "processor"| wc -l
4
```
4. 查看CPU信息（型号）
```bash
[root@centos4 ~]# cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c
      4  Intel(R) Xeon(R) CPU E5-1603 0 @ 2.80GHz
```

### scp（跨服务器拷贝）

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

### jobs（查看后台进程）

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

### alias（别名）

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

### \\+回车（换行继续输入）

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

### echo（定义变量）

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

### history（历史命令查看）

#### 命令格式及功能

| 命令格式    | 命令                           |
| ----------- | ------------------------------ |
| `history`   | 显示命令历史列表               |
| `↑(Ctrl+p)` | 显示上一条命令                 |
| `↓(Ctrl+n)` | 显示下一条命令                 |
| `!num`      | 执行命令历史列表的第num条命令  |
| `!!`        | 执行上一条命令                 |
| `!?string?` | 执行含有string字符串的最新命令 |

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

### passwd（修改密码）

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

### ss（查看端口占用）

#### 命令格式

`ss [参数]`

`ss [参数] [过滤]`

#### 命令功能

ss(Socket Statistics的缩写)命令可以用来获取 socket统计信息（查询端口占用），比 netstat 更快速高效

#### 命令参数

> -h, --help	帮助信息
  -V, --version	程序版本信息
  -n, --numeric	不解析服务名称
  -r, --resolve        解析主机名
  -a, --all	显示所有套接字（sockets）
  -l, --listening	显示监听状态的套接字（sockets）
  -o, --options        显示计时器信息
  -e, --extended       显示详细的套接字（sockets）信息
  -m, --memory         显示套接字（socket）的内存使用情况
  -p, --processes	显示使用套接字（socket）的进程
  -i, --info	显示 TCP内部信息
  -s, --summary	显示套接字（socket）使用概况
  -4, --ipv4           仅显示IPv4的套接字（sockets）
  -6, --ipv6           仅显示IPv6的套接字（sockets）
  -0, --packet	        显示 PACKET 套接字（socket）
  -t, --tcp	仅显示 TCP套接字（sockets）
  -u, --udp	仅显示 UCP套接字（sockets）
  -d, --dccp	仅显示 DCCP套接字（sockets）
  -w, --raw	仅显示 RAW套接字（sockets）
  -x, --unix	仅显示 Unix套接字（sockets）

#### 使用实例
##### 显示Sockets摘要
`ss -s`
```bash
[root@localhost ~]# ss -s
Total: 7089 (kernel 10238)
TCP:   600 (estab 267, closed 279, orphaned 0, synrecv 0, timewait 195/0), ports 0

Transport Total     IP        IPv6
*	  10238     -         -        
RAW	  0         0         0        
UDP	  3         2         1        
TCP	  321       203       118      
INET	  324       205       119      
FRAG	  0         0         0  
```
##### 显示TCP连接
`ss -t -a`
```bash
[root@localhost ~]# ss -t -a
State      Recv-Q Send-Q        Local Address:Port      Peer Address:Port   
LISTEN     0      0                 127.0.0.1:smux                 *:*       
LISTEN     0      0                         *:3690                 *:*       
LISTEN     0      0                         *:ssh                  *:*       
ESTAB      0      0           192.168.120.204:ssh          10.2.0.68:49368   
```
##### 找出占用套接字/端口的应用程序
`ss -anlp | grep 8080`
```bash
[root@localhost ~]# ss -anlp | grep 8088
tcp    LISTEN     0      128     ::ffff:10.75.4.31:8088     :::*     users:(("java",pid=11935,fd=225))

```

### watch（检测命令运行结果）
#### 命令格式
`watch [参数] [命令]`
#### 命令功能
监测一个命令的运行结果，周期性刷新结果，省得一遍遍的手动运行
#### 命令参数
> - `-n`或--interval  watch缺省每2秒运行一下程序，可以用-n或-interval来指定间隔的时间。
> - `-d`或--differences  用-d或--differences 选项watch 会高亮显示变化的区域。 而-d=cumulative选项会把变动过的地方(不管最近的那次有没有变动)都高亮显示出来。
> - `-t`或-no-title  会关闭watch命令在顶部的时间间隔,命令，当前时间的输出。
#### 命令实例
`watch -n 1 -d netstat -ant` 每隔一秒高亮显示网络链接数的变化情况
`watch -n 10 'cat /proc/loadavg'` 10秒一次输出系统的平均负载
#### 其他操作
`Ctrl+c`退出观察模式

### rz与sz（上传、下载文件）
当我们使用虚拟终端软件，如Xshell、SecureCRT或PuTTY来连接远程服务器后，需要上传、下载文件到本地，可以使用该命令。
使用前可能需要安装`lrzsz`软件：
`yum -y install lrzsz`

#### rz（Receive ZMODEM）
##### 命令格式
`rz [选项]`
##### 命令功能
使用ZMODEM协议，将本地文件批量上传到远程Linux/Unix服务器，注意不能上传文件夹。
##### 命令参数
> `-+`, --append:将文件内容追加到已存在的同名文件
> `-a`,--ascii:以文本方式传输
> `-b`, --binary:以二进制方式传输，推荐使用
> `--delay-startup N`:等待N秒
> `-e`, --escape:对所有控制字符转义，建议使用
> `-E`, --rename:已存在同名文件则重命名新上传的文件，以点和数字作为后缀
> `-p`, --protect:对ZMODEM协议有效，如果目标文件已存在则跳过
> `-q`, --quiet:安静执行，不输出提示信息
> `-v`, --verbose:输出传输过程中的提示信息
> `-y`, --overwrite:存在同名文件则替换
> `-X`, --xmodem:使用XMODEM协议
> `--ymodem`:使用YMODEM协议
> `-Z`, --zmodem:使用ZMODEM协议
> `--version`：显示版本信息
> `--h`, --help：显示帮助信息
##### 命令实例
1. 输入rz，然后回车，选择本地文件上传![rz上传jdk](http://47.106.179.244/linux下安装java/rz%E6%88%AA%E5%9B%BE.jpg)
2. 以二进制，并对控制字符进行转义，替换已存在的同名文件。
```bash
[root@hadoopmaster opt]# rz -bye
```

#### sz（Send ZMODEM）
##### 命令格式
`sz [选项] [filelist]`
##### 命令功能
通过ZMODEM协议，可将多个文件从远程服务器下载到本地。注意不能下载文件夹，如果下载文件夹，请先打包再下载
##### 命令参数
选项参数与`rz`相同，请参考上文中`rz`命令参数，或者运行命令`sz -h`查看
##### 命令实例
下载多个文件
```bash
[root@hadoopmaster opt]# sz  file1 file2 file3
```

### wc（Word Count单词统计）
#### 命令格式
`wc [选项] [文件]`
#### 命令功能
统计指定文件中的字节数、字数、行数，并将统计结果显示输出。
#### 命令参数
> `-c` 统计字节数。
> `-l` 统计行数。
> `-m` 统计字符数。这个标志不能与 -c 标志一起使用。
> `-w` 统计字数。一个字被定义为由空白、跳格或换行字符分隔的字符串。
> `-L` 打印最长行的长度。
#### 使用实例
```bash
[hdfs@centos3 log]$ wc -l mysqld.log 
7756 mysqld.log
```
```bash
[hdfs@centos3 log]$ jps
10842 Jps
19566 DataNode
[hdfs@centos3 log]$ jps | wc -l
2
```

### w（显示目前登入系统的用户信息）
#### 命令格式
`w [选项]`
#### 命令功能
目前登入系统的用户有哪些人，以及他们正在执行的程序。
#### 命令参数
> `-f` 开启或关闭显示用户从何处登入系统。
> `-h` 不显示各栏位的标题信息列。
> `-l` 使用详细格式列表，此为预设值。
> `-s` 使用简洁格式列表，不显示用户登入时间，终端机阶段作业和程序所耗费的CPU时间。
> `-u` 忽略执行程序的名称，以及该程序耗费CPU时间的信息。
#### 使用实例
```bash
[root@centos3 ~]# w
 16:23:23 up 29 days, 21:28,  5 users,  load average: 0.41, 0.42, 0.40
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
root     pts/0    10.75.4.14       16:11   27.00s  9.31s  9.28s /home/jdk/bin/java -Dproc_jar -Dhdp.version=3.1.0.0-78 -Djava.net.preferIPv4Stack=true -Dhdp.version=3.1.0.0-78 -Xmx1024m -Xmx256m -Dlog4j.configurationFile=hive-log4j2.pr
root     pts/1    10.75.4.12       15:43   19.00s 43.79s 43.79s -bash
root     pts/2    10.76.34.243     09:22    7:00m  1.69s  1.62s vim messages
root     pts/3    10.75.4.12       16:23    3.00s  0.00s  0.00s -bash
root     pts/5    10.75.4.11       Mon15    3.00s  0.06s  0.06s -bash
```
查看相应ssh连接进程号，可以通过kill -9 命令杀掉进程
```bash
[root@centos3 ~]# w
 16:36:49 up 29 days, 21:41,  4 users,  load average: 2.03, 0.96, 0.66
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
root     pts/0    10.75.4.14       16:26    9:05   0.00s  0.00s -bash
root     pts/1    10.75.4.12       15:43    2:49   2:15   2:15  -bash
root     pts/2    10.75.4.11       16:35    1.00s 20.22s  0.00s w
root     pts/3    10.75.4.12       16:23    2:49   1:27   1:27  -bash
[root@centos3 ~]#  ps aux | grep sshd
root      1105  0.0  0.0 112796  1280 ?        Ss   Feb18   0:00 /usr/sbin/sshd -D
root      4368  1.2  0.0 161400  6192 ?        Ss   15:43   0:40 sshd: root@pts/1
root     19926 11.3  0.0 161400  6200 ?        Ss   16:23   1:39 sshd: root@pts/3
root     21314  0.8  0.0 161400  6044 ?        Ss   16:26   0:05 sshd: root@pts/0
root     24001  0.0  0.0 161400  6044 ?        Ss   16:35   0:00 sshd: root@pts/2
root     24932  0.0  0.0 112728   996 pts/2    S+   16:37   0:00 grep --color=auto sshd
[root@centos3 ~]# kill -9 4368
[root@centos3 ~]# w
 16:38:35 up 29 days, 21:43,  4 users,  load average: 1.55, 1.18, 0.78
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
root     pts/0    10.75.4.14       16:26   10:51   0.00s  0.00s -bash
root     pts/2    10.75.4.11       16:35    3.00s 20.23s  0.00s w
root     pts/3    10.75.4.12       16:23    4:35   2:33   2:33  -bash
```

### hostnamectl（查看修改主机名）
#### 命令格式
`hostnamectl [选项]`
#### 命令功能
查看和修改主机名。
> 在CentOS中，有三种定义的主机名:静态的（static），瞬态的（transient），和灵活的（pretty）。静态主机名也称为内核主机名，是系统在启动时从/etc/hostname自动初始化的主机名。瞬态主机名是在系统运行时临时分配的主机名，例如，通过DHCP或mDNS服务器分配。静态主机名和瞬态主机名都遵从作为互联网域名同样的字符限制规则。而另一方面，灵活主机名则允许使用自由形式（包括特殊/空白字符）的主机名，以展示给终端用户（如hdp001）。
#### 命令参数
```bash
[root@hdp001 ~]# hostnamectl --help
hostnamectl [OPTIONS...] COMMAND ...

Query or change system hostname.

  -h --help              查看帮助
     --version           显示包版本
     --no-ask-password   不要提示输入密码
  -H --host=[USER@]HOST  在远程主机上运行
  -M --machine=CONTAINER 在本地容器上操作
     --transient         仅设置瞬态主机名
     --static            仅设置静态主机名
     --pretty            只设置灵活的主机名

Commands:
  status                 显示当前主机名设置
  set-hostname NAME      设置系统主机名
  set-icon-name NAME     设置主机的图标名称
  set-chassis NAME       设置主机的机箱类型
  set-deployment NAME    为主机设置部署环境
  set-location NAME      设置主机的位置
```
#### 使用实例
查看当前主机名
```bash
[root@hdp002 ~]# hostnamectl
   Static hostname: hdp002
         Icon name: computer-vm
           Chassis: vm
        Machine ID: e47dbc1c37d64b7ebcb988e0ecf1836a
           Boot ID: 93fa221f8aae49a183970941c4ad5d48
    Virtualization: vmware
  Operating System: CentOS Linux 7 (Core)
       CPE OS Name: cpe:/o:centos:centos:7
            Kernel: Linux 3.10.0-862.el7.x86_64
      Architecture: x86-64
```
仅查看静态主机名
```bash
[root@hdp002 ~]# hostnamectl --static
hdp002
```
修改主机名
```bash
[root@hdp002 ~]# hostnamectl set-hostname hdp002.segma.tech
[root@hdp002 ~]# hostnamectl --static
hdp002.segma.tech
```

### firewall-cmd（防火墙相关命令）
#### 命令格式
`firewall-cmd [选项]`
#### 命令功能
操作防火墙相关命令。

#### 使用实例
查看防火墙所有信息
```bash
[root@1 ~]# firewall-cmd --list-all
public (active)
  target: default
  icmp-block-inversion: no
  interfaces: eth0
  sources: 
  services: dhcpv6-client ssh
  ports: 1996/tcp 1996/udp 80/tcp
  protocols: 
  masquerade: no
  forward-ports: 
  source-ports: 
  icmp-blocks: 
  rich rules: 
```

查看防火墙开放端口信息
```bash
[root@1 ~]# firewall-cmd --list-ports
1996/tcp 1996/udp 80/tcp
```

新增开放端口
```bash
[root@1 ~]# firewall-cmd --zone=public --add-port=80/tcp --permanent
success
```
> –-zone            作用域
  –-add-port=80/tcp 添加端口，格式为：端口/通讯协议
  –-permanent       永久生效，没有此参数重启后失效


新增多个端口
```bash
[root@1 ~]# firewall-cmd --zone=public --add-port=80-90/tcp --permanent
success
```

重新加载防火墙规则
```bash
[root@1 ~]# firewall-cmd --reload
success
```

删除端口
```bash
[root@1 ~]# firewall-cmd --zone=public --remove-port=80/tcp --permanent
```