---
title: MongoDB笔记
tags:
  - mongodb
comments: true
date: 2017-07-26 19:03:26
categories: 数据库
password:
---
MongoDB笔记
<!-- more -->
# 一、Mongo数据库为NoSQL数据库

|关系型数据库|NoSQL数据库|
|:--:|:--:|
|数据库|数据库类似于MySQL|
|表|集合|
|行|文档|
|列|成员|
|主键|Object ID（自动维护）|
`与Node.js捆绑。`
## 启动MongoDB服务
* 默认端口启动
`mongod --dbpath E:\MongoDB\db`
* 设置端口启动
`mongod --dbpath E:\MongoDB\db --port=27001`


## 连接MongoDB数据库
`mongo`或者`mongo --port=27001`

|||
|:--:|:--:|
|切换到admin数据库|use admin|
|关闭数据库服务|db.shutdownServer() `(必须在admin下才能执行成功)`|
|重启服务|mongod -f E:\MongoDB\mongodb.conf|
## 二、基本语法
### 查看所有数据库
`db.showDatabases;`
### 使用某个数据库
`use admin`
>这时并不会创建数据库，只有在数据库里面保存集合数据后，才真正创建数据库

### 创建一个集合
`db.createCollection("emp");`
### 插入一条数据
`db.emp.insert({"name": 10, "ange": 10});`
>一般在执行这一步的时候会直接创建集合emp，所以上面那句语句一般不会用，都是直接使用这句来插入数据的同时创建集合

### 查看所有集合
`show collections;`
### 查看emp表的数据
语法：**db.集合名称.find({若干条件}，[ { 设置显示的字段 } ])**
`db.emp.find();`
### 增加不规则的数据
```java
var deptData = {
"name" : "123",
"sex" : "man"
}
db.emp.insert(deptData);
```
### 关于ID问题
在MongoDB集合中的每一行记录都会自动的生成一个“ *" _id" :ObjectId("55949a13eecd74894d19d8dc")*”数据，这个数据组成是：“时间戳 + 机器码 + PID + 计数器”，这个ID的信息是MongonDB数据自己为用户生成的。

### 单独的一个文档信息查看
`db.dept.findOne();`
### 删除一个数据
`db.dept.remove( { "_id" :ObjectId("55949a13eecd74894d19d8dc")} );`

### 更新数据
```javascript
var deptData = {
"name" : "123",
"sex" : "man"
}
db.dept.updata({ "_id" :ObjectId("55949a13eecd74894d19d8dc")},deptData);
```
### 删除集合
语法：db.集合名称.drop()
`db.dept.drop();`
### 删除当前数据库
`db.dropDatabase();`
## 数据操作（重点）

