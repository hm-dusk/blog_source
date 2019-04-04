---
title: 使用Docker搭建Nginx图片服务器
tags:
  - Nginx
  - Docker
  - 服务器
comments: true
categories:
  - Linux
  - Nginx
thumbnail: 'http://image.hming.org/logo/nginx+docker.png'
date: 2018-12-05 00:04:13
updated: 2018-12-05 00:04:13
password:
---
使用Docker搭建Nginx图片服务器
<!-- more -->
### 安装Docker
见[Docker常用命令](http://blog.hming.org/2018/09/18/Docker%E6%9B%BF%E6%8D%A2%E9%95%9C%E5%83%8F%E6%BA%90%E4%B8%8E%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/)
### 编写Nginx配置文件
`vim default.conf`
```bash
server {
    listen       80;
    server_name  localhost;

    #(5)
    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #(1)
    location /images/ {
        root  /mnt/;
        autoindex on; #(2)
        autoindex_exact_size off; #(3)
        autoindex_localtime on; #(4)
        charset utf-8,gbk; #(5)
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

> 参数说明：
> `(1)`：添加图片目录映射，映射目录为/mnt/images/
> `(2)`：在Nginx下默认是不允许列出整个目录的。如需此功能，将该项设置为on
> `(3)`：默认为on，显示出文件的确切大小，单位是bytes
&emsp;&emsp;&emsp; 改为off后，显示出文件的大概大小，单位是kB或者MB或者GB
> `(4)`：默认为off，显示的文件时间为GMT时间
&emsp;&emsp;&emsp; 注意:改为on后，显示的文件时间为文件的服务器时间
> `(5)`:设置编码（防止中文乱码），可以设置对全局生效或者部分路径生效

### 编写Dockerfile
`vim Dockerfile`
```dockerfile
# 使用最小化镜像（只有17.7m）
FROM nginx:stable-alpine

# 这里替换为自己的信息
MAINTAINER liming <1322260665@qq.com>

# 覆盖容器里默认配置
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```
### 构建镜像
```bash
docker build -t image-nginx .
```
### 运行生成容器
```bash
docker run -d --name image-nginx -p 80:80 -v /mnt/nginx/images:/mnt/images image-nginx
```
> -v 将服务器本地`/mnt/nginx/images`映射到容器内`/mnt/images`目录，容器目录与`default.conf`文件中配置对应
### 访问图片
通过`ip地址/images/aaa.jpg`访问图片
配置文件服务器同理