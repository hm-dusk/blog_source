---
title: VMware虚拟机静态ip配置
tags: [虚拟机,Linux,ip]
comments: true
date: 2018-08-09 16:21:22
categories: Linux
password:
---

使用虚拟机创建Linux服务器，固定ip地址的方法。

<!-- more -->

### 1.查看网关和网段

虚拟机点击【编辑】→【虚拟网络编辑器】

![虚拟网络编辑器](http://ot87uvd34.bkt.clouddn.com/VMware%E8%99%9A%E6%8B%9F%E6%9C%BA%E9%9D%99%E6%80%81ip%E9%85%8D%E7%BD%AE/vm%E8%99%9A%E6%8B%9F%E7%BD%91%E7%BB%9C%E7%BC%96%E8%BE%91%E5%99%A8.png)

使用NAT模式，选择VMnet8。取消勾选【使用本地DHCP...】，勾选会设置动态ip。

![NAT设置](http://ot87uvd34.bkt.clouddn.com/VMware%E8%99%9A%E6%8B%9F%E6%9C%BA%E9%9D%99%E6%80%81ip%E9%85%8D%E7%BD%AE/NAT%E8%AE%BE%E7%BD%AE.png)

点击NAT设置，记住子网IP范围，如图表示我们只能设置虚拟机在192.168.40.0~192.168.40.255范围内。

> 注意：
>
> 192.168.40.2为网关地址，192.168.40.255为广播地址，192.168.40.0一般为网段IP，所以`0`,`2`,`255`这三个地址不能设置

### 2.设置虚拟机IP地址

**涉及文件列表：**

`/etc/sysconfig/network-scripts/ifcfg-*`（网卡）（*根据实际情况不同，本文为ens33）

`/etc/sysconfig/network`（主机名）

`/etc/resolv.conf`（DNS）

1. 网卡信息修改

`vi /etc/sysconfig/network-scripts/ifcfg-ens33`

```
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static
DEFROUTE=yes
NAME=ens33
UUID=d7a7196e-5033-4849-bcc5-f8c52acd245c
DEVICE=ens33
ONBOOT=yes
IPADDR=192.168.40.3
NETMASK=255.255.255.0
GATEWAY=192.168.40.2
```

`ONBOOT`：开机启动。

`NM_CONTROLLED`：网络管理组件是否启用，精简版的是没有这个组件的。所以就不需要开启。

`BOOTPROTO`：网络分配方式，静态。

`IPPADDR`：手动指定ip地址。

`NETMASK`：子网掩码。

`GATEWAY`：网关ip。编辑好以后保存退出。

2. DNS配置

`vi /etc/resolv.conf`

```
nameserver 192.168.40.2
```

`nameserver`：这里应该填对应的dns域名解析服务器的ip的。但是不清楚填什么，就填网关地址了。 

3. 主机名修改

`vi /etc/sysconfig/network`

```
# Created by anaconda
NETWORKING=yes
HOSTNAME=hadoop001
```

有需要就可以修改主机名。配置完三个文件重启一下机器。

### 3.确保Linux虚拟机网络适配器选项

1. 选择虚拟机，点击右键→【设置】

![虚拟机右键设置](http://ot87uvd34.bkt.clouddn.com/VMware%E8%99%9A%E6%8B%9F%E6%9C%BA%E9%9D%99%E6%80%81ip%E9%85%8D%E7%BD%AE/%E8%99%9A%E6%8B%9F%E6%9C%BA%E5%8F%B3%E9%94%AE%E8%AE%BE%E7%BD%AE.png)

2. 【硬件】→【网络适配器】→选择【NAT模式】

![网络适配器NAT](http://ot87uvd34.bkt.clouddn.com/VMware%E8%99%9A%E6%8B%9F%E6%9C%BA%E9%9D%99%E6%80%81ip%E9%85%8D%E7%BD%AE/%E7%BD%91%E7%BB%9C%E9%80%82%E9%85%8D%E5%99%A8NAT%E6%A8%A1%E5%BC%8F.png)

### 4.Windows IP设置

设置VMWare给我们配置的网络适配器，就是那个NAT8。右键属性

![windowsIP设置1](http://ot87uvd34.bkt.clouddn.com/VMware%E8%99%9A%E6%8B%9F%E6%9C%BA%E9%9D%99%E6%80%81ip%E9%85%8D%E7%BD%AE/WindowsIP%E8%AE%BE%E7%BD%AE1.png)

点击IPv4设置

![windowsIP设置2](http://ot87uvd34.bkt.clouddn.com/VMware%E8%99%9A%E6%8B%9F%E6%9C%BA%E9%9D%99%E6%80%81ip%E9%85%8D%E7%BD%AE/WindowsIP%E8%AE%BE%E7%BD%AE2.png)

设置Windows的ip地址，该地址也在范围内。

![](http://ot87uvd34.bkt.clouddn.com/VMware%E8%99%9A%E6%8B%9F%E6%9C%BA%E9%9D%99%E6%80%81ip%E9%85%8D%E7%BD%AE/WindowsIP%E8%AE%BE%E7%BD%AE3.png)

配置完之后就可以使用xshell等工具连接了。

