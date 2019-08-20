---
title: Centos7安装VNC服务
tags:
  - Linux
  - VNC Viewer
comments: true
categories:
  - Linux
img: 'http://image.hming.org/logo/linux.jpg'
date: 2019-08-06 16:00:24
updated: 2019-08-06 16:00:24
password:
summary: 本文介绍在Centos7.6下安装VNC Viewer并通过Windows连接远程桌面的过程
---
### 安装gnome桌面
如果Centos7为最小化安装，则需要单独安装gnome图形化桌面
```bash
[root@AccessGateway ~]# yum groupinstall -y "GNOME Desktop"
```

### 安装vnc server

```bash
[root@AccessGateway ~]# yum install -y tigervnc-server
```

### 配置服务
1. 复制一个服务设置模板，命名为`vncserver@:1.service`
    ```bash
    cp /lib/systemd/system/vncserver@.service /etc/systemd/system/vncserver@:1.service
    ```
2. 修改服务配置，
    ```bash
    [root@AccessGateway ~]# vim /etc/systemd/system/vncserver\@\:1.service
    ```
    ```bash
    [Unit]
    Description=Remote desktop service (VNC)
    After=syslog.target network.target
    
    [Service]
    Type=forking
    User=root   #设置登录用户为root
    
    # Clean any existing files in /tmp/.X11-unix environment
    ExecStartPre=/bin/sh -c '/usr/bin/vncserver -kill %i > /dev/null 2>&1 || :'
    #将这里的User改为root，-geometry 1920x1080选项指定连接分辨率，也可以不指定
    ExecStart=/usr/sbin/runuser -l root -c "/usr/bin/vncserver -geometry 1920x1080 %i"
    PIDFile=/root/.vnc/%H%i.pid         #这里指向root根目录地址
    ExecStop=/bin/sh -c '/usr/bin/vncserver -kill %i > /dev/null 2>&1 || :'
    
    [Install]
    WantedBy=multi-user.target
    ```
3. 如果需要配置其他用户登录，则重复1,2步骤，再复制一个配置文件，修改相应用户
4. 更新systemctl
    ```bash
    [root@AccessGateway ~]# systemctl daemon-reload
    ```

### 设置VNC密码
VNC的密码跟系统的用户密码不一样，是使用VNC Viewer登陆时需要使用的密码
```bash
[root@AccessGateway ~]# vncpasswd
Password:
Verify:
Would you like to enter a view-only password (y/n)? n
A view-only password is not used
# 这里不添加只读账号密码
# 每个不用的系统用户，设置密码时，需要切换到该用户下，执行此命令
# 如：su zhangsan  切换到zhangsan用户再执行上vncpasswd设置密码
```

### 启动服务
启动刚才配置的服务，如果配置了多个，则需要启动相应的服务
```bash
[root@AccessGateway ~]# systemctl start vncserver@:1.service
```
设置开机自启动
```bash
[root@AccessGateway ~]# systemctl enable vncserver@:1.service
```
查看端口信息，VNC默认端口为`5901`，因为我启动了两个服务，所以还有一个5902端口存在
```bash
[root@AccessGateway ~]# netstat -lnpt|grep Xvnc
tcp        0      0 0.0.0.0:5901            0.0.0.0:*               LISTEN      10196/Xvnc          
tcp        0      0 0.0.0.0:5902            0.0.0.0:*               LISTEN      11394/Xvnc          
tcp        0      0 0.0.0.0:6001            0.0.0.0:*               LISTEN      10196/Xvnc          
tcp        0      0 0.0.0.0:6002            0.0.0.0:*               LISTEN      11394/Xvnc          
tcp6       0      0 :::5901                 :::*                    LISTEN      10196/Xvnc          
tcp6       0      0 :::5902                 :::*                    LISTEN      11394/Xvnc          
tcp6       0      0 :::6001                 :::*                    LISTEN      10196/Xvnc          
tcp6       0      0 :::6002                 :::*                    LISTEN      11394/Xvnc          
```

### 配置防火墙，开通端口
如果没有开启防火墙，则这一步可以跳过
根据监听的端口，进行端口开放，每个用户会对应一个端口，第一个用户默认为`5901`端口，如果配置多个，则需要开放相应端口
```bash
[root@AccessGateway ~]# firewall-cmd --add-port=5901/tcp --permanent
[root@AccessGateway ~]# firewall-cmd --reload
```

### Windows安装VNC，连接Centos远程桌面
1. 到官方下载地址：[https://www.realvnc.com/en/connect/download/viewer/](https://www.realvnc.com/en/connect/download/viewer/)选择对应版本下载客户端
2. 新建连接中VNC Server输入`IP地址:1`，输入密码即可连接成功


