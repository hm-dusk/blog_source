---
title: Linux修改命令终端提示符
tags:
  - Linux
  - 命令行提示符
comments: true
categories:
  - Linux
  - 命令行
thumbnail: 'http://image.hming.org/logo/linux.jpg'
date: 2019-03-29 11:47:18
updated: 2019-03-29 11:47:18
password:
---
修改命令行提示符格式与颜色
<!-- more -->
最终使用：
```bash
export PS1='[\[\e[32;1m\]\u@\h \W\[\e[0m\]]\$ '
```
参考：[1](https://blog.51cto.com/oldboy/1926142)