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
updated: 2018-11-14 20:36:28
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
[root@master ~]# 
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

# 安装
[root@master ~]# yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
```

### 禁用交换分区swap
查看交换分区：`free -h`
```bash
[root@localhost ~]# free -h
              total        used        free      shared  buff/cache   available
Mem:           2.8G        159M        404M        112M        2.2G        2.3G
Swap:          3.0G        2.8M        3.0G
```
`swapoff -a` 临时禁用所有交换
```bash
[root@k8s003 save]# swapoff -a
[root@k8s003 save]# free -h
              total        used        free      shared  buff/cache   available
Mem:           2.8G        158M        403M        113M        2.2G        2.3G
Swap:            0B          0B          0B
```
永久禁用，`vim /etc/fstab`注释swap行，重启
```bash
#
# /etc/fstab
# Created by anaconda on Mon Nov  5 19:49:25 2018
#
# Accessible filesystems, by reference, are maintained under '/dev/disk'
# See man pages fstab(5), findfs(8), mount(8) and/or blkid(8) for more info
#
/dev/mapper/centos-root /                       xfs     defaults        0 0
UUID=daffff7e-bc4d-4cf0-bcdd-9b4a99a77ccc /boot                   xfs     defaults        0 0
# 注释该行
# /dev/mapper/centos-swap swap                    swap    defaults        0 0
```

### k8s1.6 pod api
Pod是kubernetes REST API中的顶级资源类型。
在kuberentes1.6的V1 core API版本中的Pod的数据结构如下图所示：
![pod api](https://jimmysong.io/kubernetes-handbook/images/kubernetes-pod-cheatsheet.png)
### docker指令和k8s指令对比
[指令对比](https://kubernetes.io/docs/reference/kubectl/docker-cli-to-kubectl/)