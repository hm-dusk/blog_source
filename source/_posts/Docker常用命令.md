---
title: Docker替换镜像源与常用命令
tags:
  - docker
  - 容器
  - 命令
  - 镜像源
comments: true
date: 2018-09-18 17:25:53
updated: 2018-10-17 9:35:53
categories: 容器
password:
---
Docker替换镜像源与常用命令
![docker](http://ot87uvd34.bkt.clouddn.com/docker%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/docker.jpg)
<!-- more -->

### 安装

CentOS7下直接运行`yum -y install docker`

查看是否安装成功`docker version`或者`docker info`

> `docker info`显示内容需要启动docker服务才能看见

### 启动docker服务

`service docker start`或者`systemctl start docker`

### 替换为国内镜像源
#### 1. 修改或新增`/etc/docker/daemon.json`文件
```bash
{
"registry-mirrors": ["http://hub-mirror.c.163.com"]
}
```
修改之后重启一下docker服务
```bash
systemctl restart docker.service 或者 service docker restart
```
#### 2. 修改或新增 `/etc/sysconfig/docker`
在OPTIONS变量后追加参数  `--registry-mirror=https://docker.mirrors.ustc.edu.cn`
```bash
OPTIONS='--selinux-enabled --log-driver=journald --registry-mirror=https://docker.mirrors.ustc.edu.cn'
```
#### 3. Docker国内源
Docker 官方中国区
[https://registry.docker-cn.com](https://registry.docker-cn.com)

网易
[http://hub-mirror.c.163.com](http://hub-mirror.c.163.com)

中国科技大学
[https://docker.mirrors.ustc.edu.cn](https://docker.mirrors.ustc.edu.cn)

阿里云
[https://pee6w651.mirror.aliyuncs.com](https://pee6w651.mirror.aliyuncs.com)

### 列出本地所有image文件

`docker images` 或者`docker image ls`

### 删除本地镜像

`docker image rm [镜像名]`

### 拉取镜像

`docker image pull [镜像组/镜像名]`

### 运行镜像生成容器

`docker container run [镜像名]`

> 如果本地没有该镜像，或自动去仓库pull

### 终止容器

`docker container kill [容器id]`或者`docker kill [容器id]`

### 制作docker容器步骤

1. 编写Dockerfile文件

   ```dockerfile
   #该 image 文件继承官方的 node image，冒号表示标签，这里标签是8.4，即8.4版本的 node。
   FROM node:8.4
   #将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 image 文件的/app目录。
   COPY . /app
   #指定接下来的工作路径为/app。
   WORKDIR /app
   # 在/app目录下，运行npm install命令安装依赖。注意，安装后所有的依赖，都将打包进入 image 文件。
   RUN npm install --registry=https://registry.npm.taobao.org
   # 将容器 3000 端口暴露出来， 允许外部连接这个端口。
   EXPOSE 3000
   ```

2. 编写.dockerignore文件

   ```
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
   $ docker container run -p 8000:3000 -it demo /bin/bash
   # 或者
   $ docker container run -p 8000:3000 -it demo:0.0.1 /bin/bash
   ```
> -p参数：容器的 3000 端口映射到本机的 8000 端口。
> -it参数：容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器。
> demo:0.0.1：image 文件的名字（如果有标签，还需要提供标签，默认是 latest 标签）。
> /bin/bash：容器启动以后，内部第一个执行的命令。这里是启动 Bash，保证用户可以使用 Shell。

### 将运行的容器打包成镜像
1. 登录docker hub网站[https://hub.docker.com/](https://hub.docker.com/)注册账号。
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
    得到容器id：9bffe3a2142e
4. 使用`docker commit 9bffe3a2142e my_centos`命令提交到本地镜像，my_centos为镜像名（自己取名）
5. 查看本地镜像
    ```bash
    [root@hadoopCDH opt]# docker images
    REPOSITORY     TAG       IMAGE ID       CREATED          SIZE
    my_centos      latest    bcc2cf471c38   11 seconds ago   400 MB
    ```

### 其他命令

1. 查看容器

   `docker ps`查看正在运行的容器。

   `docker container ls --all`查看所有存在的容器。

2. 退出容器bash
   在容器的命令行，按下 Ctrl + c 停止 Node 进程，然后按下 Ctrl + d （或者输入 exit）退出容器。此外，也可以用`docker container kill`终止容器运行。

3. 删除容器文件

   容器停止运行后，不会消失，使用`docker container ls --all`查看所有存在的容器（id等信息）。

   使用`docker container rm [容器id]`或者`docker rm [容器id]`删除容器。

4. 运行已存在的容器

   `docker container start [容器id]`或者`docker start [容器id]`

5. 进入已经运行的容器

   `docker container exec -it [容器id] [/bin/bash]`

6. 将容器里的文件拷贝到本机

   `docker container cp [容器id]:[/path/to/file] .`

