---
title: Docker容器固定IP
tags:
  - Docker
  - 容器
  - IP
comments: true
date: 2018-10-20 15:13:14
updated: 2018-10-28 15:13:14
categories: 
  - 容器
  - Docker
password:
thumbnail: 'http://ot87uvd34.bkt.clouddn.com/docker%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/docker2.jpg'
---
Docker启动容器后一般是分配随机ip，本文将介绍如何使用Docker生成静态ip
<!-- more -->
### 创建自定义网络
```bash
[root@hadoopmaster bin]# docker network create --subnet=172.18.0.0/16 my_network
037291f820f9104928d786bc83d123cc2a3dbf459816d4c3145e98faf97a348a
[root@hadoopmaster bin]# docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
0c3c0925f725        bridge              bridge              local
bb4ac16f1205        host                host                local
037291f820f9        my_network          bridge              local
077d509d5c30        none                null                local
```

### 创建容器时指定ip
```bash
docker run -itd --net my_network --ip 172.18.0.100 --add-host hdp001:172.18.0.101 --add-host hdp002:172.18.0.102 -h hdpmaster --name hdpmaster -p 8088:8088 -p 50070:50070 cyanidehm/hadoop:0.3 /bin/bash
docker run -itd --net my_network --ip 172.18.0.101 --add-host hdpmaster:172.18.0.100 --add-host hdp002:172.18.0.102 -h hdp001 --name hdp001 cyanidehm/hadoop:0.3 /bin/bash
docker run -itd --net my_network --ip 172.18.0.102 --add-host hdp001:172.18.0.101 --add-host hdpmaster:172.18.0.100 -h hdp002 --name hdp002 cyanidehm/hadoop:0.3 /bin/bash
```
    > --net 指定网络类型。
    > --ip 指定ip地址。
    > --add-host 添加主机到hosts文件。
    > -h 指定hostname主机名。
    > --name 指定容器名称
