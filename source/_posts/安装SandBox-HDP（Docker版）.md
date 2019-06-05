---
title: 安装SandBox HDP（Docker版）
tags:
  - 大数据
  - HDP
  - SandBox
  - Docker
comments: true
categories:
  - 大数据
  - SandBox
thumbnail: 'http://image.hming.org/logo/sandbox+docker.png'
date: 2019-04-02 11:28:17
updated: 2019-6-5 12:00:53
password:
---
SandBox HDP版本3.0.1，安装环境为CentOS7
<!-- more -->
参考官网教程：[Deploying Hortonworks Sandbox on Docker](https://hortonworks.com/tutorial/sandbox-deployment-and-install-guide/section/3/)
### 环境准备
|方面|要求|
|:--:|:--:|
|软件|[安装docker](http://blog.hming.org/2018/09/18/Docker%E6%9B%BF%E6%8D%A2%E9%95%9C%E5%83%8F%E6%BA%90%E4%B8%8E%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/#%E5%AE%89%E8%A3%85)|
|内存|官方推荐docker容器至少10G|
|磁盘|docker镜像目录至少30G（sandbox镜像27.5G）|
### 下载脚本文件
到[官网](https://hortonworks.com/downloads/#sandbox)下载zip格式的shell脚本文件
![脚本下载](http://image.hming.org/安装sandbox-docker/docker脚本文件下载.png)
下载可能需要注册，随便填就行了。压缩包内容如下：
![](http://image.hming.org/安装sandbox-docker/docker脚本文件预览.png)![](http://image.hming.org/安装sandbox-docker/docker脚本文件预览2.png)
需要将脚本上传到Linux并解压
```bash
[root@sandbox opt]# ls
assets  docker-deploy-hdp30.sh
```
### 执行脚本
#### 1. 在Linux中执行`docker-deploy-hdp30.sh`脚本，拉取镜像，运行容器
```bash
[root@sandbox opt]# sh docker-deploy-hdp30.sh 
+ registry=hortonworks
+ name=sandbox-hdp
+ version=3.0.1
+ proxyName=sandbox-proxy
+ proxyVersion=1.0
+ flavor=hdp
+ echo hdp
+ mkdir -p sandbox/proxy/conf.d
+ mkdir -p sandbox/proxy/conf.stream.d
+ docker pull hortonworks/sandbox-hdp:3.0.1
Trying to pull repository docker.io/hortonworks/sandbox-hdp ... 
3.0.1: Pulling from docker.io/hortonworks/sandbox-hdp
70799bbf2226: Pull complete 
40963917cdad: Pull complete 
3fe9adbb8d7e: Pull complete 
ee3ec4e8cb3d: Pull complete 
7ea5917732c0: Pull complete 
2d951411620c: Pull complete 
f4c5e354e7fd: Pull complete 
22ffa6ef360f: Pull complete 
2060aa0f3751: Pull complete 
ca01ba34744d: Pull complete 
83326dded077: Pull complete 
eb3d71b90b73: Pull complete 
bdd1cab41c81: Pull complete 
500cc770c4bd: Pull complete 
0cb1decd5474: Pull complete 
b9591f4b6855: Pull complete 
f28e56086127: Pull complete 
e7de4e7d0bca: Pull complete 
ec77967d2166: Pull complete 
4fdcae170114: Pull complete 
6347f5df8ffc: Pull complete 
6a6ecc232709: Pull complete 
ea845898ff50: Pull complete 
02135573b1bf: Pull complete 
cb0176867cd8: Pull complete 
3c08321268fd: Pull complete 
82e82a97c465: Pull complete 
8aaaa48ed101: Pull complete 
74b321ac2ac5: Pull complete 
569da02c0a66: Pull complete 
af40820407ef: Pull complete 
Digest: sha256:7b767af7b42030fb1dd0f672b801199241e6bef1258e3ce57361edb779d95921
Status: Downloaded newer image for docker.io/hortonworks/sandbox-hdp:3.0.1
+ docker pull hortonworks/sandbox-proxy:1.0
Trying to pull repository docker.io/hortonworks/sandbox-proxy ... 
1.0: Pulling from docker.io/hortonworks/sandbox-proxy
951bdea65c93: Pull complete 
4b9047c5fbbb: Pull complete 
773156407aae: Pull complete 
d8524176841d: Pull complete 
Digest: sha256:42e4cfbcbb76af07e5d8f47a183a0d4105e65a1e7ef39fe37ab746e8b2523e9e
Status: Downloaded newer image for docker.io/hortonworks/sandbox-proxy:1.0
+ '[' hdp == hdf ']'
+ '[' hdp == hdp ']'
+ hostname=sandbox-hdp.hortonworks.com
++ docker images
++ awk '{print $2}'
++ grep hortonworks/sandbox-hdp
+ version=3.0.1
+ docker network create cda
7f641a6c16cf73df1079f241e76a318f3094f4303feaeae1c0a50c1b58c9d1ee
+ docker run --privileged --name sandbox-hdp -h sandbox-hdp.hortonworks.com --network=cda --network-alias=sandbox-hdp.hortonworks.com -d hortonworks/sandbox-hdp:3.0.1
59cb51cd71faa11218a12ee3f8c8ea1e58790025428a4573e476c1ddd118c202
+ echo ' Remove existing postgres run files. Please wait'
 Remove existing postgres run files. Please wait
+ sleep 2
+ docker exec -t sandbox-hdp sh -c 'rm -rf /var/run/postgresql/*; systemctl restart postgresql-9.6.service;'
+ sed s/sandbox-hdp-security/sandbox-hdp/g assets/generate-proxy-deploy-script.sh
+ mv -f assets/generate-proxy-deploy-script.sh.new assets/generate-proxy-deploy-script.sh
+ chmod +x assets/generate-proxy-deploy-script.sh
+ assets/generate-proxy-deploy-script.sh
+ grep MINGW
+ uname
+ chmod +x sandbox/proxy/proxy-deploy.sh
+ sandbox/proxy/proxy-deploy.sh
c1f52cfec560982477e4b6c69f4cc95309bd93907196761ed5eff7222744743e
```
> 注意：镜像文件特别大，国内拉取非常慢，可通过代理等方式拉取。

#### 2. 使用`docker ps`查看生成的容器
![](http://image.hming.org/安装sandbox-docker/docker-ps-hdp-output.jpg)
可以看到有两个容器生成正在运行
`sandbox-proxy`容器负责将HDP中的各个端口映射到主机上
`sandbox-hdp`则是HDP主要环境的容器，所有的hdp组件都是在这个容器里面运行

#### 3. 执行完脚本，相应的目录下会生成一个文件`sandbox-flavor`和一个文件夹`sandbox`
```bash
[root@centos4 opt]# ls
assets  docker-deploy-hdp30.sh  sandbox  sandbox-flavor
```

#### 4. 脚本文件只需要执行`一次`，如果需要停止或重启HDP环境，只需要停止/重启相应的docker容器
停止HDP集群
```bash
docker stop sandbox-hdp
docker stop sandbox-proxy
```
启动HDP集群
```bash
docker start sandbox-hdp
docker start sandbox-proxy
```
删除HDP容器
```bash
docker stop sandbox-hdp
docker stop sandbox-proxy
docker rm sandbox-hdp
docker rm sandbox-proxy
```
移除sandbox镜像
```bash
docker rmi hortonworks/sandbox-hdp:{release}
```

### 如何使用

上图中的1080端口为sandbox端口，可以通过浏览器访问该端口，得到以下界面：
![sandbox页面](http://image.hming.org/sandbox-hdp使用详解/sandbox页面.png)
左侧launch dashboard直接进入ambari管理界面，右侧则是一些链接，包括ambari管理地址、Ranger地址、DAS地址等
4200端口则提供了一个浏览器访问命令行的接口：
![浏览器访问hdp容器](http://image.hming.org/sandbox-hdp使用详解/浏览器访问hdp容器.png)
使用`root`登录，默认密码为`hadoop`，第一次登录会提示修改root密码，对密码强度会有要求

本文到此为止，更详细的使用教程，请参照[SandBox-HDP使用详解](http://blog.hming.org/2019/04/04/SandBox-HDP使用详解/)

### 可能遇到的问题
```bash
[root@centos4 opt]# docker logs sandbox-proxy
2019/04/04 05:53:28 [emerg] 1#1: host not found in upstream "sandbox-hdp" in /etc/nginx/conf.d/http-hdp.conf:9
nginx: [emerg] host not found in upstream "sandbox-hdp" in /etc/nginx/conf.d/http-hdp.conf:9
```
这种情况是因为docker网络没有配置好，导致proxy容器无法使用nginx代理hdp容器
检查docker网络配置