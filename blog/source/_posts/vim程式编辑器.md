---
title: vim程式编辑器
tags: [编辑器,Linux]
comments: true
date: 2017-07-26 09:47:27
categories: Linux
password:
---
Linux下的vim编辑器
<!-- more -->
## vim编辑器常用指令
* 一般指令模式（command mode）：

|指令|代表含义|
|:--:|:--:|
|:w|将编辑的资料写入磁盘中|
|:w!|当档案属性为`只读`时，强制写入该档案。具体能不能写入，跟用户对该档案的权限有关|
|:q|离开vi|
|:q!|强制离开，不存储档案|
|:wq|储存后离开|
|**vim编辑器设置**|**vim编辑器设置**|
|:set nu|设置vim编辑器显示行号|
|:set nonu|取消行号|
---
参考文档：[鸟哥的Linux私房菜之vim程式编辑器](http://linux.vbird.org/linux_basic/0310vi.php)
