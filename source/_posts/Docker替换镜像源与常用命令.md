---
title: Docker替换镜像源与常用命令
tags:
  - docker
  - 容器
  - 命令
  - 镜像源
comments: true
date: 2018-09-18 17:25:53
updated: 2018-11-6 15:26:28
categories: 
  - 容器
  - docker
password:
thumbnail: 'http://ot87uvd34.bkt.clouddn.com/docker%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/docker2.jpg'
---
Docker替换镜像源与常用命令
<!-- more -->

### 安装

CentOS7下直接运行`yum -y install docker`

查看是否安装成功`docker version`或者`docker info`

> `docker info`显示内容需要启动docker服务才能看见

### 启动docker服务

`service docker start`或者`systemctl start docker`

设置开机自启动
`systemctl enable docker`

### 替换为国内镜像源
#### 修改或新增`/etc/docker/daemon.json`文件
```bash
{
"registry-mirrors": ["http://hub-mirror.c.163.com"]
}
```
修改之后重启一下docker服务
```bash
systemctl restart docker.service 或者 service docker restart
```
#### Docker国内源
Docker 官方中国区
[https://registry.docker-cn.com](https://registry.docker-cn.com)

网易
[http://hub-mirror.c.163.com](http://hub-mirror.c.163.com)

中国科技大学
[https://docker.mirrors.ustc.edu.cn](https://docker.mirrors.ustc.edu.cn)

阿里云
[https://pee6w651.mirror.aliyuncs.com](https://pee6w651.mirror.aliyuncs.com)

### 基本命令
#### 列出本地所有image文件

`docker images` 或者`docker image ls`

#### 删除本地镜像

`docker image rm [镜像名]`

#### 拉取镜像

`docker image pull [镜像组/镜像名]`

#### 运行镜像生成容器

`docker container run [镜像名]`或者`docker run [镜像名]`

> 如果本地没有该镜像，会自动去仓库pull

#### 终止容器

`docker container kill [容器id]`或者`docker kill [容器id]`或者`docker stop [容器id]`

### 制作docker容器步骤

1. 编写Dockerfile文件

   ```dockerfile
   # 该 image 文件继承官方的 node image，冒号表示标签，这里标签是8.4，即8.4版本的 node。
   FROM node:8.4
   # 创建者信息
   MAINTAINER cyanidehm<xxxx@qq.com>
   # 将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 image 文件的/app目录。
   COPY . /app
   # 指定接下来的工作路径为/app。
   WORKDIR /app
   # 在/app目录下，运行npm install命令安装依赖。注意，安装后所有的依赖，都将打包进入 image 文件。
   RUN npm install --registry=https://registry.npm.taobao.org
   # 将容器 3000 端口暴露出来， 允许外部连接这个端口。
   EXPOSE 3000
   ```

2. 编写.dockerignore文件

   ```dockerfile
   .git
   node_modules
   npm-debug.log
   # 表示上面三个路径会排除，不打进image文件
   ```

3. 创建image文件

   有了 Dockerfile 文件以后，就可以使用`docker image build`命令创建 image 文件了。

   ```bash
   $ docker image build -t demo .
   # 或者
   $ docker image build -t demo:0.0.1 .
    # -t参数用来指定 image 文件的名字（该例中demo为image名），后面还可以用冒号指定标签。如果不指定，默认的标签就是latest。最后的那个点表示 Dockerfile 文件所在的路径，上例是当前路径，所以是一个点。
   ```
   生成image之后就可以使用`docker images`查看到了

4. 生成容器

   ```bash
   $ docker container run -p 8000:3000 -itd --name my_demo -h master -v /opt/java:/home/java demo:0.0.1 /bin/bash
   ```
    > -p参数：容器的 3000 端口映射到本机的 8000 端口。
    > -it参数：容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器。
    > -d参数：容器后台运行。
    > --name参数：表示生成的容器名称，这里为my_demo。
    > -h参数：表示生成的容器主机名，这里为master。
    > -v参数：表示主机地址/opt/java和容器中地址/home/java映射，上传到/opt/java目录就能同步上传到容器内。
    > demo:0.0.1：镜像文件的名字（如果有标签，还需要提供标签，这里标签为0.0.1，如果不提供，默认是 latest 标签）。
    > /bin/bash：容器启动以后，内部第一个执行的命令。这里是启动 Bash，保证用户可以使用 Shell。
    
### 将运行的容器打包成镜像
1. 登录**docker hub**网站注册账号。

    [https://hub.docker.com/](https://hub.docker.com/)
2. `docker login`命令登录，输入相应用户名和密码
    ```bash
    Username: cyanidehm
    Password: 
    Login Succeeded  # 表示登录成功
    ```
3. 使用`docker ps`查看当前运行的容器
    ```bash
    [root@hadoopCDH opt]# docker ps
    CONTAINER ID   IMAGE    COMMAND        CREATED             STATUS              PORTS     NAMES
    9bffe3a2142e   centos   "/bin/bash"    About an hour ago   Up About an hour              vigilant_dijkstra
    ```
    得到容器id：`9bffe3a2142e`
4. 使用`docker commit 9bffe3a2142e my_centos`命令提交到本地镜像，my_centos为镜像名（自己取名）

    > `docker commit [OPTIONS] [容器id或名称] [镜像名称：版本]`，OPTIONS选项包括：
    > -a，--author=""作者信息。
    > -m，--message=""提交信息。
    > -p，--pause=true提交时暂停容器运行。
5. 查看本地镜像
    ```bash
    [root@hadoopCDH opt]# docker images
    REPOSITORY     TAG       IMAGE ID       CREATED          SIZE
    my_centos      latest    bcc2cf471c38   11 seconds ago   400 MB
    ```
6. 将镜像改到自己账户名下，推送到`docker hub`
    ```bash
    [root@hadoopCDH opt]# docker tag my_centos cyanidehm/my_centos
    [root@hadoopCDH opt]# docker push cyanidehm/my_centos:latest
    ```

### 其他命令
#### 查看容器

   `docker ps`查看正在运行的容器。
   
   `docker ps -a`或`docker container ls --all`查看所有存在的容器。

#### 退出容器bash
   在容器的命令行，按下 Ctrl + c 停止 Node 进程，然后按下 Ctrl + d （或者输入 exit）退出容器。此外，也可以用`docker container kill`终止容器运行。

#### 删除容器文件

   容器停止运行后，不会消失，使用`docker container ls --all`查看所有存在的容器（id等信息）。

   使用`docker container rm [容器id]`或者`docker rm [容器id]`删除容器。
   
#### 清除所有容器
1. 停止所有容器
```bash
docker stop $(docker ps -aq)
```
2. 删除所有容器
```bash
docker rm $(docker ps -aq)
```

#### 运行已存在的容器

   `docker container start [容器id]`或者`docker start [容器id]`

#### 进入已经运行的容器

   `docker container exec -it [容器id] [/bin/bash]`

#### 将容器里的文件拷贝到本机

   `docker container cp [容器id]:[/path/to/file] .`

#### 将镜像保存为tar文件、将tar文件加载到docker镜像
1. 保存镜像
`docker save -o [路径/文件名] [镜像名]`或者`docker save [镜像名] > [路径/文件名]`
```bash
[root@hadoopCDH opt]# docker save -o my_centos.tar cyanidehm/my_centos:latest
[root@hadoopCDH opt]# ll my_centos.tar 
-rw-------. 1 root root 779944960 10月 17 03:40 my_centos.tar
```
2. 加载镜像
`docker load --input [路径/文件名]`或者`docker load < [路径/文件名]`
```bash
[root@hadoopmaster opt]# docker load < my_centos.tar 
1d31b5806ba4: Loading layer [==================================================>] 208.3 MB/208.3 MB
a5789abfb72a: Loading layer [==================================================>] 571.6 MB/571.6 MB
Loaded image: cyanidehm/my_centos:latest
[root@hadoopmaster opt]# docker images
REPOSITORY            TAG                 IMAGE ID            CREATED                  SIZE
cyanidehm/my_centos   latest              3ced2987d19a        Less than a second ago   765 MB
```
3. **批量save/load镜像**
脚本地址[hydra1983/docker_images.sh](https://gist.github.com/hydra1983/22b2bed38b4f5f56caa87c830c96378d#file-docker_images-sh)
批量保存
`./docker_images.sh save-images`
批量加载
`./docker_images.sh load-images`
> 脚本将镜像文件保存到`./images`目录下，另外一个`images.db`文件与之对应
> 将这两个东西拷贝到其他主机，执行批量加载命令就行实现批量转移镜像
```bash
[root@localhost save]# ./docker_images.sh save-images 
Create /opt/save/images.db
Read /opt/save/images.db
Create /opt/save/images
[DEBUG] save 00ead811e8ae docker.io/portainer/portainer:latest to /opt/save/images/00ead811e8ae.dim
real	0m27.343s
[DEBUG] save d63b9b4bd205 rancher/server:v1.6.14 to /opt/save/images/d63b9b4bd205.dim
real	4m46.480s
[DEBUG] save 34a453d374b9 docker.io/rancher/agent:v1.2.9 to /opt/save/images/34a453d374b9.dim
real	0m28.037s

[root@localhost save]# ./docker_images.sh load-images
...
```

#### 容器启动后自动运行脚本
情景：1、镜像已经存在。2、镜像内包含脚本`/home/ssh.sh`需要在容器启动后运行
```bash
docker run -itd cyanidehm/base_ssh /bin/bash -c "sh /home/ssh.sh;/bin/bash"
```
> 说明：
> `/bin/bash -c ""`表示容器运行后使用bash执行引号内语句。
> 引号内的 `;` 表示命令分割，执行多条命令时用`;`进行分割
> 引号内最后的`/bin/bash`表示容器启动以bash方式运行（如果容器启动后没有线程在运行，容器会停止退出） 

#### 查看容器相关信息
在容器外面不进入容器查看容器信息
`docker inspect [容器名/id]`：查看到容器的相关信息
```bash
# 查看容器的具体IP地址，如果输出是空的说明没有配置IP地址
docker inspect --format '{{ .NetworkSettings.IPAddress }}' [容器名/id]
```
