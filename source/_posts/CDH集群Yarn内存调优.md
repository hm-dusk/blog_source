---
title: CDH集群Yarn内存调优
tags:
  - 大数据
  - CDH
  - Yarn
  - 参数调优
comments: true
categories:
  - 大数据
img: ''
cover: false
date: 2019-08-30 09:13:32
updated: 2019-08-30 09:13:32
password:
summary: 关于CDH集群中的Yarn内存参数调优，CDH版本6.x
---

### DRF

DRF: `Dominant Resource Fairness`，根据CPU和内存公平调度资源。CDH动态资源池默认采用的DRF计划策略。简单的理解就是内存不够的时候，多余的CPU就不会分配任务了，就让他空着；CPU不够的时候，多出来的内存也不会再启动任务了。

### 相关参数

* **yarn.scheduler.minimum-allocation-mb**，分配给AM单个容器可申请的最小内存，如果申请的容器内存小于该值，则系统将调整至该值（`可以用于计算一个节点最大Container数量`）
* **yarn.scheduler.maximum-allocation-mb**，分配给AM单个容器可申请的最大内存
> 上面两个值均不能超过**yarn.nodemanager.resource.memory-mb**值


* **mapreduce.map.memory.mb** ，map任务内存，cdh默认1G
* **mapreduce.map.cpu.vcores** ，map任务虚拟CPU核数，cdh默认1
* **mapreduce.reduce.memory.mb** ，reduce任务内存，cdh默认1G
* **mapreduce.reduce.cpu.vcores** ，reduce任务虚拟CPU核数，cdh默认1
* **yarn.nodemanager.resource.memory-mb** ，容器内存，cdh默认8G
* **yarn.nodemanager.resource.cpu-vcores** ，容器虚拟CPU核数，cdh默认8，但CM会自动检测内核数并修改

### 测试情况
Yarn资源分配情况，虚拟CPU共分配了24核，内存则是他的两倍48G
![](http://image.hming.org/CDH集群Yarn内存调优/yarn资源配置.png)

执行任务，队列调度策略为DRF，查看内存和CPU使用情况
![](http://image.hming.org/CDH集群Yarn内存调优/内存CPU使用对比.png)
![](http://image.hming.org/CDH集群Yarn内存调优/内存使用情况.png)
![](http://image.hming.org/CDH集群Yarn内存调优/CPU使用情况.png)
可以发现，内存使用受限于cpu，与DRF策略吻合

### 总结
**Yarn队列如果采用的是DRF调度策略，则vcpu和内存最好按照1:1比例进行分配，因为多余的资源根本不会用到。**
