---
title: CentOS7下搭建kubernetes环境
tags:
  - k8s
  - 容器
  - 集群
comments: true
categories:
  - 容器
  - k8s
date: 2018-10-31 20:32:27
updated: 2018-11-5 20:32:27
password:
---
CentOS7使用kubeadm安装kubernetes 1.11版本多主高可用（进行中）
<!-- more -->
[https://www.kubernetes.org.cn/4256.html](https://www.kubernetes.org.cn/4256.html)
### 安装配置docker
> v1.11.0版本推荐使用docker v17.03,
  v1.11,v1.12,v1.13, 也可以使用，再高版本的docker可能无法正常使用。
  测试发现17.09无法正常使用，不能使用资源限制(内存CPU)

> 如下操作在所有节点操作

安装docker
```bash
# 卸载安装指定版本docker-ce
[root@master ~]# yum remove -y docker-ce docker-ce-selinux container-selinux
[root@master ~]# yum install -y --setopt=obsoletes=0 \
docker-ce-17.03.1.ce-1.el7.centos \
docker-ce-selinux-17.03.1.ce-1.el7.centos
```
启动docker
```bash
[root@master ~]# systemctl enable docker && systemctl restart docker
```
### 安装 kubeadm, kubelet 和 kubectl
> 如下操作在所有节点操作

```bash
# 配置源
[root@master ~]# cat <<EOF > /etc/yum.repos.d/kubernetes.repo
> [kubernetes]
> name=Kubernetes
> baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
> enabled=1
> gpgcheck=1
> repo_gpgcheck=1
> gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
> EOF

# 安装
[root@master ~]# yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
```