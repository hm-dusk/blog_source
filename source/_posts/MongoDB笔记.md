---
title: MongoDB笔记
tags:
  - mongodb
comments: true
date: 2017-07-26 19:03:26
categories: 
  - 数据库
  - mongodb
password:
---
MongoDB笔记
<!-- more -->
## 一、Mongo数据库为NoSQL数据库

|关系型数据库|NoSQL数据库|
|:--:|:--:|
|数据库|数据库类似于MySQL|
|表|集合|
|行|文档|
|列|成员|
|主键|Object ID（自动维护）|
`与Node.js捆绑。`
### 启动MongoDB服务
* 默认端口启动
`mongod --dbpath E:\MongoDB\db`
* 设置端口启动
`mongod --dbpath E:\MongoDB\db --port=27001`


### 连接MongoDB数据库
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
## 三、数据操作（重点）
### 增加数据
增加一个简单数据
`db.dept.insert({"url":"hm-dusk.github.io"});`
保存一个数组

```
db.dept.insert([

	{"url":"hm-dusk.github.io"},
	{"url":"https://hm-dusk.github.io"}
	]);
```
可以使用JavaScript的循环添加

```
for(var x = 0; x < 1000; x ++){
	db.dept.insert({"url":"hm-dusk.github.io"});
}
```
### 数据查询
任何的数据库之中，数据的查询操作都是最为麻烦的，而在MongoDB数据库里面，对于查询的支持非常到位，包含有关系运算、逻辑运算、数组运算、正则运算等等。

首先对于数据的查询操作核心的语法：“`db.集合名称.find({查询条件} [,{设置显示的字段}])`”。

```
db.dept.find();
```

条件查询
```
db.dept.find( { "url":"hm-dusk.github.io" } );
```
对于设置的显示字段严格来讲就称为数据的投影操作，如果不需要显示的字段设置“0”，而需要显示的字段设置“1”。

```
//不想显示_id
db.dept.find( {"url":"hm-dusk.github.io"},{"_id":0} );
db.dept.find( {"url":"hm-dusk.github.io"},{"_id":0,"url":1} );
```
大部分的情况下，这种投影操作的意义不大。同时对于数据的查询也可以使用“pretty()”函数进行漂亮显示。
```
db.dept.find( {"url":"hm-dusk.github.io"},{"_id":0} ).pretty();
```

范例：查询单个数据
```
db.dept.findOne( {"url":"hm-dusk.github.io"},{"_id":0} );
```
### 关系运算
在MongoDB里面支持的关系查询操作：大于（`$gt`）、小于（`$lt`）、大于等于（`$gte`）、小于等于（`$lte`）、不等于（`$ne`）、等于（`key:value`、`$eq`）。但是要想让这些操作可以正常使用，那么需要准备出一个数据集合。
![](http://ot87uvd34.bkt.clouddn.com/mongodb%E7%AC%94%E8%AE%B0/%E6%9F%A5%E8%AF%A2%E6%95%B0%E6%8D%AE%E9%9B%86%E5%90%88.JPG)

范例：查询姓名是张三的信息
```
db.students.find({"name":"张三"}).pretty();
```

范例：查询性别是男的信息
```
db.students.find({"sex":"男"}).pretty();
```

范例：查询年龄大于19岁的学生
```
db.students.find({"age": {"$gt":19} }).pretty();
```

范例：查询成绩大于等于60分的学生
```
db.students.find({"score": {"$gte":60} }).pretty();
```

范例：查询姓名不是王五的信息
```
db.students.find({"name": {"$ne":"王五"} }).pretty();
```
>此时与之前最大的区别就在于，在一个JSON结构里面需要定义其它的JSON结构，并且这种风格在日后通过程序进行操作的时候依然如此。

### 逻辑运算
逻辑运算主要就是三种类型：与（`$and`）、或（`$or`）、非（`$not`、`$nor`）。

范例：查询年龄在19 ~ 20岁的学生信息
```
db.students.find({ "age":{"$gte":19,"$lte":20} }).pretty();
```
在进行逻辑运算的时候“and”的连接是最容易的，因为只需要利用“,”分割若干个条件就可以了。

范例：查询年龄不是19岁的学生
```
db.students.find({ "age":{"$ne":19} }).pretty();
```

范例：查询年龄大于19岁，或者成绩大于90分的学生信息
```
db.students.find({ "$or":[
	{"age":{"$gt":19}},
	{"score":{"$gt":90}}
	] }).pretty();

```

范例：也可以进行或的求反操作(针对于或的操作可以实现一个求反的功能。)
```
db.students.find({ "$nor":[
	{"age":{"$gt":19}},
	{"score":{"$gt":90}}
	] }).pretty();
```
### 求模
模的运算使用“$mod”来完成，语法“`{$mod : [数字,余数]}`”。

范例：求模
```
db.students.find({"age": {"$mod":[20,1]} }).pretty();
```
利用求模计算可以编写一些数学的计算公式。
### 范围查询
只要是数据库，必须存在有“`$in`”（在范围之中）、“`$nin`”（不在范围之中）。

范例：查询姓名是“张三”、“李四”、“王五”的信息
```
db.students.find({"name": {"$in":["张三","李四","王五"]} }).pretty();
```

范例：不在范围
```
db.students.find({"name": {"$nin":["张三","李四","王五"]} }).pretty();
```
*在实际的工作之中，范围的操作很重要。*
### 数组查询
首先在mongoDB里面是支持数组保存的，一旦支持了数组保存，就需要针对于数组的数据进行匹配。

范例：保存一部分数组内容
![](http://ot87uvd34.bkt.clouddn.com/mongodb%E7%AC%94%E8%AE%B0/%E6%95%B0%E7%BB%84%E6%95%B0%E6%8D%AE%E9%9B%86%E5%90%88.JPG)
此时的数据包含有数组内容，而后需要针对于数组数据进行判断，可以使用几个运算符：`$all`、`$size`、`$slice`、`$elemMatch`。

范例：查询同时参加语文和数学课程的学生
现在两个数组内容都需要保存，所以使用“`{"$all",[内容1,内容2,..]}`”
```
db.students.find({"course": {"$all": ["语文","数学"]} }).pretty();
```
现在所有显示的学生信息里面包含语文和数学的内容，而如果差一个内容的不会显示。

>虽然“`$all`”计算可以用于数组上，但是也可以用于一个数据的匹配上。

范例：查询学生地址是“海淀区”的信息
```
db.students.find({"address": {"$all":["海淀区"]} }).pretty();
```
>既然在集合里面现在保存的是数组信息，那么数组就可以利用索引操作，使用“`key.index`”的方式来定义索引。

范例：查询数组中第二个内容（index= 1，索引下标从0开始）为数学的信息
```
db.students.find({"course.1":"数学"}).pretty();
```

范例：要求查询出只参加两门课程的学生
使用“`$size`”来进行数量的控制。
```
db.students.find({"course": {"$size":2} }).pretty();
```

发现在进行数据查询的时候只要是内容复合条件，数组的内容就全部显示出来了，但是现在希望可以控制数组的返回的数量，那么可以使用“`$slice`”进行控制。

范例：返回年龄为19岁所有学生的信息，但是要求只显示两门参加课程
```
db.students.find({"age":19},{"course":{"$slice":2}}).pretty();
```
现在只取得了前两门的信息，那么也可以设置负数表示取出后两门的信息。
```
db.students.find({"age":19},{"course":{"$slice":-2}}).pretty();
```
或者只是取出中间部分的信息。
```
db.students.find({"age":19},{"course":{"$slice":[1,2]}}).pretty();
```
>在此时设置的两个数据里面第一个数据表示跳过的数据量，而第二个数据表示返回的数量。

### 嵌套集合运算
在MongoDB数据里面每一个集合数据可以继续保存其它的集合数据，例如：有些学生需要保存家长信息。

范例：增加数据
![](http://ot87uvd34.bkt.clouddn.com/mongodb%E7%AC%94%E8%AE%B0/%E5%B5%8C%E5%A5%97%E6%95%B0%E6%8D%AE%E9%9B%86%E5%90%88.JPG)
此时给出的内容是嵌套的集合，而这种集合的数据的判断只能够通过“`$elemMatch`”完成。

范例：查询出年龄大于等于19岁且父母有人是局长的信息
```
db.students.find(
	{"$and":[
		{"age":{"$gte":19}},
		{"parents":{"$elemMatch":{"job":"局长"}}}
	]}).pretty();
```
>由于这种查询的时候条件比较麻烦，所以如果可以，尽量别搞这么复杂的数据结构组成。

### 判断某个字段是否存在
使用“`$exists`”可以判断某个字段是否存在，如果设置为true表示存在，如果设置为false就表示不存在。

范例：查询具有parents成员的数据
```
db.students.find({"parents":{"$exists":true}}).pretty();
```

范例：查询不具有course成员的数据
```
db.students.find({"course":{"$exists":false}}).pretty();
```
>可以利用此类查询来进行一些不需要的数据的过滤。

### 条件过滤
实际上习惯于传统关系型数据库开发的我们对于数据的筛选，可能首先想到的一定是where子句，所以在MongoDB里面也提供有“`$where`”。

范例：使用where进行数据查询
```
db.students.find({"$where":"this.age>20"}).pretty();
db.students.find("this.age>20").pretty();
```
对于“`$where`”是可以简化的，但是这类的操作是属于进行每一行的信息判断，*实际上对于数据量较大的情况并不方便使用*。实际上以上的代码严格来讲是属于编写一个操作的函数。
```
db.students.find(function(){
		return this.age > 20;
	}).pretty();

db.students.find({"$where":function(){
		return this.age > 20;
	}}).pretty();
```
以上只是查询了一个判断，如果要想实现多个条件的判断，那么就需要使用and连接。
```
db.students.find({"$and":[
	{"$where":"this.age>19"},
	{"$where":"this.age<21"}
	]
});
```
>虽然这种形式的操作可以实现数据查询，但是最大的缺点是将在MongoDB里面保存的BSON数据变为了JavaScript的语法结构，这样的方式不方便使用数据库索引机制。

### 正则运算
如果要想实现模糊查询，那么必须使用正则表达式，而且正则表达式使用的是语言Perl兼容的正则表达式的形式。如果要想实现正则使用，则按照如下的定义格式：

* 基础语法：`{key : 正则标记}`
* 完整语法：`{key : {"$regex" : 正则标记 , "$options" : 选项}}`

>|- 对于options主要是设置正则的信息查询的标记：
|- “`i`”：忽略字母大小写；
|- “`m`”：多行查找；
|- “`x`”：空白字符串除了被转义的或在字符类中意外的完全被忽略；
|- “`s`”：匹配所有的字符（圆点、“.”），包括换行内容。
|- *需要注意的是，如果是直接使用（javascript）那么只能够使用`i`和`m`，而“`x`”和“`s`”必须使用“`$regex`”*。

范例：查询以“谷”开头的姓名
```
db.students.find({"name": /谷/ }).pretty();
```

范例：查询姓名有字母A
```
db.students.find({"name": /a/i }).pretty();
db.students.find({"name": {"$regex": /a/i }}).pretty();
```
如果要执行模糊查询的操作，严格来讲只需要编写一个关键字就够了。
正则操作之中除了可以查询出单个字段的内容之外，也可以进行数组数据的查询。

范例：查询数组数据
```
db.students.find({"course": /语?/ }).pretty();
db.students.find({"course": /语/ }).pretty();
```
>MongoDB中的正则符号和之前Java正则是有一些小小差别，不建议使用以前的一些标记，正则就将其应用在模糊数据查询上。

### 数据排序
在MongoDB里面数据的排序操作使用“`sort()`”函数，在进行排序的时候可以有两个顺序：`升序（1）`、`降序（-1）`。

范例：数据排序
```
db.students.find().sort({"score": -1}).pretty();
```
但是在进行排序的过程里面有一种方式称为自然排序，按照数据保存的先后顺序排序，使用“`$natural`”表示。

范例：自然排序
```
db.students.find().sort({"$natural": -1}).pretty();
```
>在MongoDB数据库里面排序的操作相比较传统关系型数据库的设置要简单。

### 数据分页显示
在MongoDB里面的数据分页显示也是符合于大数据要求的操作函数：

* `skip(n)`：表示跨过多少数据行；
* `limit(n)`：取出的数据行的个数限制。

范例：分页显示（第一页，skip(0)、limit(5)）
```
db.students.find().skip(0).limit(5).sort({"age":-1}).pretty();
```

范例：分页显示（第二页，skip(5),limit(5）)
```
db.students.find().skip(5).limit(5).sort({"age":-1}).pretty();
```
>这两个分页的控制操作，就是在以后只要是存在有大数据的信息情况下都会使用它。

## 四、数据更新操作
对于MongoDB而言，数据的更新基本上是一件很麻烦的事情，如果在实际的工作之中，真的具有此类的操作支持，那么最好的做法，在MongoDB里面对于数据的更新操作提供了两类函数：`save()`、`update()`。

### 函数的基本使用
如果要修改数据最直接的使用函数就是`update()`函数，但是这个函数的语法要求很麻烦：

* 语法：`db.集合.update(更新条件 , 新的对象数据（更新操作符） , upsert , multi)`；

>|- `upsert`：如果要更新的数据不存在，则增加一条新的内容（true为增加、false为不增加）；
|-` multi`：表示是否只更新满足条件的第一行记录，如果设置为false，只更新第一条，如果是true全更新。

范例：更新存在的数据——将年龄是19岁的人的成绩都更新为100分（此时会返回多条数据）

1. 只更新第一条数据：
```
db.students.update({"age":19}, {"$set": {"score":100}}, false,false);
```
2. 所有满足条件的数据都更新
```
db.students.update({"age":19}, {"$set":{"score":100}}, false,true);
```

范例：更新不存在的数据
```
db.students.update({"age":30}, {"$set":{"name":"不存在"}}, true,false);
//由于没有年龄是30岁的学生信息，所以此时相当于进行了数据的创建。
```

那么除了`update()`函数之外，还提供有一个`save()`函数，这个函数的功能与更新不存在的内容相似。

范例：使用save()操作
```
db.students.save({"_id": ObjectID("55949a13eecd74894d19d8dc"), "age":50});
//由于此时对应的id数据存在了，所以就变为了更新操作。但是如果要保存的数据不存在（不能保存有“_id”），那么就变为了增加操作。
```
### 修改器
对MongoDB数据库而言，数据的修改会牵扯到内容的变更、结构的变更（包含有数组），所以在进行MongoDB设计的时候就提供有一系列的修改器的应用，那么像之前使用的“`$set`”就是一个修改器。
####  $inc：主要针对于一个数字字段，增加某个数字字段的数据内容；
语法：`{"$inc" : {"成员" : 内容}}`

范例：将所有年龄为19岁的学生成绩一律减少30分,年龄加1
```
db.students.update({"age":19}, {"$inc":  {"score":-30,"age":1} });
```
#### $set：进行内容的重新设置；
语法：`{"$set" : {"成员" : "新内容"}}`

范例：将年龄是20岁的人的成绩修改为89
```
db.students.update({"age":20}, {"$set": {"score":89} });
```
#### $unset：删除某个成员的内容；
语法：`{"$unset" : {"成员" : 1}}`

范例：删除“张三”的年龄与成绩信息
```
db.students.update({"name":"张三"}, {"$unset": {"age":1,"score":1} });
//执行之后指定的成员内容就消失了。
```
#### $push：相当于将内容追加到指定的成员之中（基本上是数组）；
语法：`${"$push" : {成员 : value}}`

范例：向“李四”添加课程信息（此时张三信息下没有course信息）
```
db.students.update({"name":"李四"}, {"$push": {"course":"语文"} });
```

范例：向“谷大神 - E”里面的课程追加一个“美术”
```
db.students.update({"name":"谷大神 - E"}, {"$push": {"course":"美术"} });
```
>就是进行数组数据的添加操作使用的，如果没有数组则进行一个新的数组的创建，如果有则进行内容的追加。

#### $pushAll：与“$push”是类似的，可以一次追加多个内容到数组里面；
语法：`${"$pushAll" : {成员 : 数组内容}}`

范例：向“王五”的信息里面添加多个课程内容
```
db.students.update({"name":"王五"}, {"$pushAll": {"cource":["美术","音乐","田径"]} });
```

####  $addToSet：向数组里面增加一个新的内容，只有这个内容不存在的时候才会增加；
语法：`{"$addToSet" : {成员 : 内容}}`

范例：向王五的信息增加新的内容
```
db.students.update({"name": "王五"}, {"$addToSet": {"course":"舞蹈"} });
//此时会判断要增加的内容在数组里面是否已经存在了，如果不存在则向数组之中追加内容，如果存在了则不做任何的修改操作。
```
#### $pop：删除数组内的数据；
语法：`{"$pop" : {成员 : 内容}}`
内容如果设置为-1表示删除第一个，如果是1表示删除最后一个；

范例：删除王五的第一个课程
```
db.students.update({"name":"王五"}, {"$pop": {"course":1}});
```
#### $pull：从数组内删除一个指定内容的数据
语法：`{"$pull" : {成员 : 数据}}`
进行数据比对的，如果是此数据则删除；

范例：删除王五学生的音乐课程信息
```
db.students.update({"name":"王五"}, {"$pull":"音乐"});
```
#### $pullAll：一次性删除多个内容；
语法：`{"$pull" : {成员 : [数据, 数据,...]}}`

范例：删除“谷大神 - A”中的三门课程
```
db.students.update({"name":"谷大神 - A"}, {"$pullAll":{"course":["语文","数学","英语"]}});
```
#### $rename：为成员名称重命名；
语法：`{"$rename" : {旧的成员名称 : 新的成员名称}}`

范例：将“张三”name成员名称修改为“姓名”
```
db.students.update({"name":"张三"}, {"$rename":{"name":"姓名"}});
```
在整个MongoDB数据库里面，提供的修改器的支持很到位。

### 删除数据







