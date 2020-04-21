---
title: 浅谈Java内存结构
tags:
  - JVM
  - 内存结构
comments: true
categories:
  - Java
cover: false
top: false
toc: true
img: ''
date: 2020-04-21 20:55:16
updated: 2020-04-21 20:55:16
password:
summary: 一次堆内存溢出引发的思考
keywords:
---
### 背景
前不久部署的Hadoop环境中HDFS组件NameNode宕机，在经过排查后发现是因为HDFS中含有大量的小文件（多达250万个block），NameNode压力非常大，然而分配给NameNode的堆内存却只有1G
![](http://47.106.179.244/浅谈Java内存结构/HDFS堆内存配置.png)
官方建议最小配置1G，每增加100万个block增加1G
参考官网：[https://docs.cloudera.com/documentation/enterprise/6/release-notes/topics/rg_hardware_requirements.html#concept_fzz_dq4_gbb](https://docs.cloudera.com/documentation/enterprise/6/release-notes/topics/rg_hardware_requirements.html#concept_fzz_dq4_gbb)
![](http://47.106.179.244/浅谈Java内存结构/Cloudera官网参考HDFS配置.png)
在将堆内存调至4G后NameNode正常运行。

虽然修复了，但是心里面还是很疑惑，堆内存到底用来做什么？为什么需要这么多的堆内存？
由于JVM的概念已经很模糊了，固下来又复习了一遍java的内存结构。

### 运行时数据区
Java内存结构主要讲的就是JVM（java虚拟机）运行时数据区的结构划分，分为线程共享的堆（Heap）和方法区（Method Area），以及线程私有的虚拟机栈（VM Stack）、本地方法栈（Native Method Stack）和程序计数器（Program Counter Register）
![](http://47.106.179.244/浅谈Java内存结构/运行时数据区.png)

#### 程序计数器
线程私有，和线程绑定，是当前线程所执行的字节码的行号指示器，也就是记录当前线程执行到哪一步了。
> 因为Java虚拟机的多线程是通过线程轮流切换并分配处理器执行时间的方式来实现的，在任何一个确定的时刻，一个处理器（对于多核处理器来说是一个内核）都会执行一条线程中的指令。所以，为了线程切换后能够恢复到正确的执行位置，每个线程都需要一个独立的程序计数器，各条线程之间计数器互不影响，独立存储。
#### 虚拟机栈
也叫Java虚拟机栈，线程私有，生命周期和线程相同。
> 虚拟机栈描述的是Java方法执行的内存模型：每个方法在执行的同时都会创建一个栈帧（Stack Frame，是方法运行时的基础数据结构）用于存储`局部变量表`、`操作数栈`、`动态链接`、`方法出口（返回地址）`等信息。每一个方法从调用直到执行完成的过程，就对应一个栈帧在虚拟机栈中入栈到出栈的过程。
> ![](http://47.106.179.244/浅谈Java内存结构/栈帧结构.png)
> 其中局部变量表存放各种基本类型（byte、boolean、float、double、int、long、short、char）、对象引用和returnAddress类型。

#### 本地方法栈
线程私有，与虚拟机栈类似，区别在于本地方法栈为虚拟机用到的Native方法服务。

#### 堆
线程共享，堆是Java虚拟机管理的内存中最大的一块，堆存放几乎所有的java对象实例，是非常重要的一块空间，GC主要发生在这个区域，

#### 方法区
线程共享，用于存储已被虚拟机加载的`类信息`、`常量`、`静态变量`、`即时编译器编译后的代码`等数据。
