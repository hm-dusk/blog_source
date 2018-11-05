---
title: MySQL笔记
tags:
  - mysql
comments: true
date: 2017-07-18 20:42:01
updated: 2017-07-29 19:03:26
categories: 
  - 数据库
  - mysql
password: 
---
MySql笔记
<!-- more -->
## 一、常见数据库

Oracle：甲骨文（占有率最高）
DB2：IBM
SQL Server：微软
Sybase：赛尔斯
MySQL：甲骨文

## 二、RDBMS（关系型数据库管理系统）
![](http://ot87uvd34.bkt.clouddn.com/RDBMS.png)
![](http://ot87uvd34.bkt.clouddn.com/DATABASE.png)
表结构：
![](http://ot87uvd34.bkt.clouddn.com/%E8%A1%A8%E7%BB%93%E6%9E%84.png)
## 三、SQL（结构化查询语句）
SQL语句分类：

1. DDL：数据库或表的结构操作 `（重点）`
2. DML：对表的记录进行更新（增、删、改）`（重点）`
3. DQL：对表的记录的查询`（重点、难点）`
4. DCL：对用户的创建，及授权

## 四、DDL（数据库或表的结构操作）
**操作库：**

```java
查看所有数据库：SHOW DATABASES
切换（选择要操作的）数据库：USE 数据库名
创建数据库：CREATE DATABASE [IF NOT EXISTS] 数据库名
删除数据库：DROP DATABASE [IF EXISTS] 数据库名
修改数据库编码：ALTER DATABASE 数据库名 CHARACTER SET utf8
```

**操作表：**

```java
创建表：
     CREATE TABLE [IF NOT EXISTS] 表名（
          列名 列类型，
          列名 列类型，
          。。。
     ）；
```
```
查看当前数据库中所有表：SHOW TABLES
查询某一张表结构：DESC 表名
删除表：DROP TABLE 表名
修改表：前缀：ALTER TABLE 表名称
```
```
添加列：add（
          列名 列类型，
          列名 列类型，
          。。。
）；
修改列类型：modify 列名 列新的类型；
修改列名：change 原列名 新列名 列类型；
删除列：drop 列名；
修改表名称：rename to 新表名；
```
## 五、数据类型（列类型）
在数据库中所有的字符串类型，`必须使用单引`，`不能使用双引！`
`日期类型也要使用单引！`

>int：整型
double：浮点型，double（5，2）：表示最多5位，必须有两位小数
decimal：浮点型
char：固定长度字符串类型：char（255）最大255，数据长度不足指定长度，会补足到指定长度
varchar：可变长度字符串类型
text（clob）：字符串类型（mysql特有，sql server里面也有）
blod：字节类型，二进制
date：日期类型，格式为：yyyy-MM-dd
time：时间类型，格式为：hh：mm：ss
timestamp：时间戳类型

## 六、DML（对表的记录更新（增、删、改））
### 插入数据
```
INSERT INTO 表名（列名1，列名2，。。。）VALUES（列值1，列值2，。。。）；
```
  > 在表名后给出要插入的列名，其他没有指定的列等同与插入null值。`所以插入记录总是插入一行，不可能是半行`。
  > 在VALUES后给出列值，值的顺序和个数必须与前面指定的列`对应`
如果表中有自增的主键，那么可以用这种方法不指定主键列，也可以用null和0代替，MySQL会自己处理

```
INTERT INTO 表名 VALUES(列值1, 列值2)
```
  > 没有给出要插入的列，那么表示插入所有列。
  > 值的个数必须是该表列的个数。
  > 值的顺序，必须与表创建时给出的列的顺序相同。

### 修改数据
```
UPDATE 表名 SET 列名1=列值1, 列名2=列值2, ... [WHERE 条件]
```
>条件(条件可选的)：
  条件必须是一个boolean类型的值或表达式：*UPDATE t_person SET gender='男', age=age+1 WHERE sid='1';*
  运算符：*=、!=、<>、>、<、>=、<=、BETWEEN...AND、IN(...)、IS NULL、NOT、OR、AND*

```
WHERE age >= 18 AND age <= 80
等价于WHERE age BETWEEN 18 AND 80
```
```
WHERE name='zhangSan' OR name='liSi'
等价于WHERE name IN ('zhangSan', 'liSi')
WHERE age IS NULL, 不能使用等号
WHERE age IS NOT NULL
```

### 删除数据
```
DELETE FROM 表名 [WHERE 条件];
TRUNCATE TABLE 表名：TRUNCATE是DDL语句，它是先删除drop该表，再create该表。而且无法回滚！！！
```

## 七、DCL（对用户的创建，及授权）
* 一个项目创建一个用户！一个项目对应的数据库只有一个！
* 这个用户只能对这个数据库有权限，其他数据库你就操作不了了！

### 创建用户
```
CREATE USER 用户名@IP地址 IDENTIFIED BY '密码';
    > 用户只能在指定的IP地址上登录
CREATE USER 用户名@'%' IDENTIFIED BY '密码';
    > 用户可以在任意IP地址上登录
```
### 给用户授权
```
GRANT 权限1, … , 权限n ON 数据库.* TO 用户名@IP地址
    > 权限、用户、数据库
    > 给用户分派在指定的数据库上的指定的权限
    > 
    > 例如；GRANT,CREATE,ALTER,DROP,INSERT,UPDATE,DELETE,SELECT ON mydb1.* TO user1@localhost;
    > 	给user1用户分派在mydb1数据库上的create、alter、drop、insert、update、delete、select权限
```
```
  * GRANT ALL ON 数据库.* TO 用户名@IP地址;
    > 给用户分派指定数据库上的所有权限
```

### 撤销授权
```
  * REVOKE 权限1, … , 权限n ON 数据库.* FROM 用户名@IP地址;
    > 撤消指定用户在指定数据库上的指定权限
    > 
    > 例如；REVOKE CREATE,ALTER,DROP ON mydb1.* FROM user1@localhost;
    >	撤消user1用户在mydb1数据库上的create、alter、drop权限
```

### 查看权限
```
SHOW GRANTS FOR 用户名@IP地址
    > 查看指定用户的权限
```
### 删除用户
```
DROP USER 用户名@IP地址
```
## 八、DQL数据库查询语言
### 一、 基本查询

#### 1. 字段(列)控制
*1) 查询所有列*
 >`SELECT * FROM 表名;`
 `SELECT * FROM emp;`
  -->其中“ `*` ”表示查询所有列

*2) 查询指定列*
 >`SELECT 列1 [, 列2, ... 列N] FROM 表名;`
 `SELECT empno, ename, sal, comm FROM 表名;`

*3) 完全重复的记录只一次*
 >当查询结果中的多行记录一模一样时，只显示一行。一般查询所有列时很少会有这种情况，但只查询一列（或几列）时，这种可能就大了！
 `SELECT DISTINCT * | 列1 [, 列2, ... 列N] FROM 表名;`
 `SELECT DISTINCT sal FROM emp;`
 -->保查询员工表的工资，如果存在相同的工资只显示一次！

*4) 列运算*

 >1. 数量类型的列可以做加、减、乘、除运算
   `SELECT sal*1.5 FROM emp;`
   `SELECT sal+comm FROM emp;`
 >2. 字符串类型可以做连续运算
   `SELECT CONCAT('$', sal) FROM emp;`

 >3. 转换NULL值
   有时需要把`NULL`转换成其它值，例如*comm+1000*时，如果`comm`列存在`NULL`值，那么*NULL+1000*还是`NULL`，而我们这时希望把`NULL`当前`0`来运算。
   `SELECT IFNULL(comm, 0)+1000 FROM emp;`
   -->*IFNULL(comm, 0)*：如果*comm*中存在*NULL*值，那么当成*0*来运算。

 >4. 给列起别名
   你也许已经注意到了，当使用列运算后，查询出的结果集中的列名称很不好看，这时我们需要给列名起个别名，这样在结果集中列名就显示别名了
   `SELECT IFNULL(comm, 0)+1000 AS '奖金' FROM emp;`
   --> 其中AS可以省略

#### 2. 条件控制

1.条件查询
  >与前面介绍的UPDATE和DELETE语句一样，SELECT语句也可以使用WHERE子句来控制记录。
`SELECT empno,ename,sal,comm FROM emp WHERE sal > 10000 AND comm IS NOT NULL;`
`SELECT empno,ename,sal FROM emp WHERE sal BETWEEN 20000 AND 30000;`
`SELECT empno,ename,job FROM emp WHERE job IN ('经理', '董事长');`


2.模糊查询
  >当你想查询姓张，并且姓名一共两个字的员工时，这时就可以使用模糊查询
`SELECT * FROM emp WHERE ename LIKE '张_';`
  --> 模糊查询需要使用运算符：LIKE，其中`_`匹配一个任意字符，注意，只匹配一个字符而不是多个。
  --> 上面语句查询的是姓张，名字由两个字组成的员工。
`SELECT * FROM emp WHERE ename LIKE '___'; `
  -->姓名由3个字组成的员工

>如果我们想查询姓张，名字几个字可以的员工时就要使用“%”了。
`SELECT * FROM emp WHERE ename LIKE '张%'; `
--> 其中*%*匹配*0~N*个任意字符，所以上面语句查询的是姓张的所有员工。
`SELECT * FROM emp WHERE ename LIKE '%阿%';`
--> 千万不要认为上面语句是在查询姓名中间带有阿字的员工，因为*%*匹配*0~N*个字符，所以姓名以阿开头和结尾的员工也都会查询到。
`SELECT * FROM emp WHERE ename LIKE '%';`
--> 这个条件等同与不存在，但如果姓名为*NULL*的查询不出来！
	
### 二、排序
1. 升序
  `SELECT * FROM WHERE emp ORDER BY sal ASC;`
  >--> 按sal排序，升序！
  --> 其中ASC是可以省略的
2. 降序
  `SELECT * FROM WHERE emp ORDER BY comm DESC;`
  >--> 按comm排序，降序！
  --> 其中DESC不能省略
3. 使用多列作为排序条件
  `SELECT * FROM WHERE emp ORDER BY sal ASC, comm DESC;`
  >--> 使用sal升序排，如果sal相同时，使用comm的降序排

### 三、聚合函数
>  *聚合函数用来做某列的纵向运算。*
1. COUNT
  `SELECT COUNT(*) FROM emp;`
  --> 计算emp表中所有列都不为NULL的记录的行数
  `SELECT COUNT(comm) FROM emp;`
  --> 云计算emp表中comm列不为NULL的记录的行数
2. MAX
  `SELECT MAX(sal) FROM emp;`
  --> 查询最高工资
3. MIN
  `SELECT MIN(sal) FROM emp;`
  --> 查询最低工资
4. SUM
  `SELECT SUM(sal) FROM emp;`
  --> 查询工资合
5. AVG
  `SELECT AVG(sal) FROM emp;`
  --> 查询平均工资

### 四、分组查询
  >分组查询是把记录使用某一列进行分组，然后查询组信息。
  例如：查看所有部门的记录数。
  `SELECT deptno, COUNT(*) FROM emp GROUP BY deptno;`
  --> 使用deptno分组，查询部门编号和每个部门的记录数
  `SELECT job, MAX(SAL) FROM emp GROUP BY job;`
  --> 使用job分组，查询每种工作的最高工资

  >组条件
  以部门分组，查询每组记录数。条件为记录数大于3
  `SELECT deptno, COUNT(*) FROM emp GROUP BY deptno HAVING COUNT(*) > 3;`

### 五、limit子句(方言)
  LIMIT用来限定查询结果的起始行，以及总行数。
  >例如：查询起始行为第5行，一共查询3行记录
  `SELECT * FROM emp LIMIT 4, 3;`
  --> 其中4表示从第5行开始，其中3表示一共查询3行。即第5、6、7行记录。
```
  select * from emp limit 0, 5;

  1. 一页的记录数：10行
  2. 查询第3页

  select * from emp limit 20, 10;

  (当前页-1) * 每页记录数
  (3-1) * 10

  (17-1) * 8, 8
```

## 九、备份恢复
数据库 --> sql语句
sql语句 --> 数据库

1. 数据库导出SQL脚本(备份数据库内容，并不是备份数据库！)
  > `mysqldump –u用户名 –p密码 数据库名>生成的脚本文件路径`
  > 例如：
  > `mysqldump -uroot -p123 mydb1>C:\mydb1.sql`(与mysql.exe和mysqld.exe一样, 都在bin目录下)
  > *注意：*不要打分号，不要登录mysql，直接在cmd下运行
  > *注意：*生成的脚本文件中不包含create database语句

2. 执行SQL脚本
  第一种方式
  > `mysql -u用户名 -p密码 数据库<脚本文件路径`
  > 例如：
  > 先删除mydb1库，再重新创建mydb1库
  > `mysql -uroot -p123 mydb1<C:\mydb1.sql`
  > *注意：*不要打分号，不要登录mysql，直接在cmd下运行

  第二种方式
  > 登录mysql
  > source SQL脚本路径
  > 例如：
  >先删除mydb1库，再重新创建mydb1库
  >切换到mydb1库
  >`source c:\mydb1.sql`

## 十、主键约束（唯一标识）
  `非空`
  `唯一`
  `被引用`（学习外键时）

  **当表的某一列被指定为主键后，该列就不能为空，不能有重复值出现。**
*创建表时指定主键的两种方式：*
    ```

    1.
    CREATE TABLE stu(
    sid        CHAR(6) PRIMARY KEY,
    sname    VARCHAR(20),
    age        INT,
    gender    VARCHAR(10)
    );
    指定sid列为主键列，即为sid列添加主键约束

   	2.
    CREATE TABLE stu(
    sid        CHAR(6),
    sname    VARCHAR(20),
    age        INT,
    gender    VARCHAR(10),
    PRIMARY KEY(sid)
    );
    指定sid列为主键列，即为sid列添加主键约束
    ```

  *修改表时指定主键：*
  `ALTER TABLE stu ADD PRIMARY KEY(sid);`
  *删除主键：*
  `ALTER TABLE stu DROP PRIMARY KEY;`

## 十一、主键自增长
  * 因为主键列的特性是：`必须唯一`、`不能为空`，所以我们通常会指定主键类为整型，然后设置其自动增长，这样可以保证在插入数据时主键列的唯一和非空特性。

  * **创建表时指定主键自增长**
```
  CREATE TABLE stu(
        sid INT PRIMARY KEY AUTO_INCREMENT,
        sname    VARCHAR(20),
        age        INT,
        gender    VARCHAR(10)
  );
```
  * **修改表时设置主键自增长：**
`ALTER TABLE stu CHANGE sid sid INT AUTO_INCREMENT;`
  * **修改表时删除主键自增长：**
`ALTER TABLE stu CHANGE sid sid INT;`
  * **测试主键自增长：**
    > INSERT INTO stu VALUES(NULL, 'zhangSan',23,'male');
    > INSERT INTO stu(sname,age,gender) VALUES('zhangSan',23,'male');

## 十二、非空约束与唯一约束
1. 非空约束
  * 因为某些列不能设置为NULL值，所以可以对列添加非空约束。
  * 例如：
```
  CREATE TABLE stu(
        sid INT PRIMARY KEY AUTO_INCREMENT,
        sname    VARCHAR(20) NOT NULL,
        age        INT,
        gender    VARCHAR(10)
  );
  * 对sname列设置了非空约束
```
2. 唯一约束
  * 车库某些列不能设置重复的值，所以可以对列添加唯一约束。
  * 例如：
```
  CREATE TABLE stu(
        sid INT PRIMARY KEY AUTO_INCREMENT,
        sname    VARCHAR(20) NOT NULL UNIQUE,
        age        INT,
        gender    VARCHAR(10)
  );
  * 对sname列设置了唯一约束
```

## 十三、概述模型、对象模型、关系模型
*对象模型：*可以双向关联，而且引用的是对象，而不是一个主键！
*关系模型：*只能多方引用一方，而且引用的只是主键，而不是一整行记录。

`对象模型：**在java中是domain！！！例如：User、Student`
>is a
has a(关联)
1对1
1对多
多对多
use a

`关系模型：在数据库中表！！！`

  >当我们要完成一个软件系统时，需要把系统中的实体抽取出来，形成概念模型。
  例如部门、员工都是系统中的实体。概念模型中的实体最终会成为Java中的类、数据库中表。
  实体之间还存在着关系，关系有三种：
  * 1对多：例如每个员工都从属一个部门，而一个部门可以有多个员工，其中员工是多方，而部门是一方。
  * 1对1：例如老公和老婆就是一对一的关系，一个老公只能有一个老婆，而一个老婆只能有一个老公。
  * 多对多：老师与学生的关系就是多对多，一个老师可以有多个学生，一个学生可以有多个老师。

`概念模型：在Java中成为实体类（javaBean）`
>   类就使用成员变量来完成关系，一般都是双向关联！
  多对一双向中关联，即员工关联部门，部门也关联员工

  ```
  class Employee {//多方关联一方
     ...
     private Department department;
  }
  class Department {//一方关联多方
     ...
     private List<Employee> employees;
  }```
```
  class Husband {
     ...
     private Wife wife;
  }
  class Wife {
     ...
     private Husband
  }
```
```
  class Student {
     ...
     private List<Teacher> teachers
  }
  class Teacher {
     ...
     private List<Student> students;
  }```

## 十四、外键约束
 * 外键必须是`另一表的主键的值`(外键要引用主键！)
  * **外键可以重复**
  * **外键可以为空**
  * **一张表中可以有多个外键！**


  *概念模型在数据库中成为表*
  数据库表中的多对一关系，只需要在多方使用一个独立的列来引用1方的主键即可
  ```
  /*员工表*/
  create talbe emp (
    empno int primary key,/*员工编号*/
    ...
    deptno int/*所属部门的编号*/
  );
  /*部门表*/
  create table dept (
    deptno int  primary key,/*部门编号*/
    ...
  );
  ```

>emp表中的deptno列的值表示当前员工所从属的部门编号。也就是说emp.deptno必须在dept表中是真实存在！
  但是我们必须要去对它进行约束，不然可能会出现员工所属的部门编号是不存在的。这种约束就是外键约束。
  我们需要给emp.deptno添加外键约束，约束它的值必须在dept.deptno中存在。外键必须是另一个表的主键！
> 语法：`CONSTRAINT 约束名称 FOREIGN KEY(外键列名) REFERENCES 关联表(关联表的主键)`
>* 创建表时指定外键约束
```  
  create talbe emp (
    empno int primary key,
    ...
    deptno int,
    CONSTRAINT fk_emp FOREIGN KEY(mgr) REFERENCES emp(empno) 
  );
```
>* 修改表时添加外键约束
```
  ALERT TABLE emp
  ADD CONSTRAINT fk_emp_deptno FOREIGN KEY(deptno) REFERENCES dept(deptno);
```
>* 修改表时删除外键约束
```
  ALTER TABLE emp
  DROP FOREIGN KEY fk_emp_deptno;/*约束名称*/
```

## 十五、数据库关系
*1.一对一关系*
在表中建立一对一关系比较特殊，需要让其中一张表的主键，`即是主键又是外键`。
```
  create table husband(
    hid int PRIMARY KEY,
    ...
  );
  create table wife(
    wid int PRIMARY KEY,
    ...
    ADD CONSTRAINT fk_wife_wid FOREIGN KEY(wid) REFERENCES husband(hid)
  );
```
	> 其中wife表的wid即是主键，又是相对husband表的外键！
  husband.hid是主键，不能重复！
  wife.wid是主键，不能重复，又是外键，必须来自husband.hid。
  所以如果在wife表中有一条记录的wid为1，那么wife表中的其他记录的wid就不能再是1了，因为它是主键。
  同时在husband.hid中必须存在1这个值，因为wid是外键。这就完成了一对一关系。
  `*从表的主键即是外键！`

*2.多对多关系*
在表中建立多对多关系需要使用中间表，即需要三张表，在中间表中使用两个外键，分别引用其他两个表的主键。
```
  create table student(
    sid int PRIMARY KEY,
    ...
  );
  create table teacher(
    tid int PRIMARY KEY,
    ...
  );
```
```
  create table stu_tea(
    sid int,
    tid int,
    ADD CONSTRAINT fk_stu_tea_sid FOREIGN KEY(sid) REFERENCES student(sid),
    ADD CONSTRAINT fk_stu_tea_tid FOREIGN KEY(tid) REFERENCES teacher(tid)
  );
```
  >这时在stu_tea这个中间表中的每条记录都是来说明student和teacher表的关系
  例如在stu_tea表中的记录：sid为1001，tid为2001，这说明编号为1001的学生有一个编号为2001的老师
  ```
  sid    tid
  101    201 /*编号为101的学生有一个编号为201的老师*/
  101    202 /*编号为101的学生有一个编号为202的老师*/
  101    203 /*编号为101的学生有一个编号为203的老师*/
  102    201 /*编号为102的学生有一个编号为201的老师*/
  102    204 /*编号为102的学生有一个编号为204的老师*/
  ```

## 十六、多表查询
分类：
* 合并结果集(了解)
* 连接查询
* 子查询

*1. 合并结果集*
  * 要求被合并的表中，列的`类型`和`列数`相同
  * UNION：去除重复行
  * UNION ALL：不去除重复行
```
SELECT * FROM cd
UNION ALL
SELECT * FROM ab;
```

*2. 连接查询*
  1. **分类**
    * 内连接
    * 外连接
      * 左外连接
      * 右外连接
      * 全外连接(MySQL不支持)
    * 自然连接（属于一种简化方式）
  2. **内连接**
    * 方言：`SELECT * FROM 表1 别名1, 表2 别名2 WHERE 别名1.xx=别名2.xx`
    * 标准：`SELECT * FROM 表1 别名1 INNER JOIN 表2 别名2 ON 别名1.xx=别名2.xx`
    * 自然：`SELECT * FROM 表1 别名1 NATURAL JOIN 表2 别名2`
    * *内连接查询出的所有记录都满足条件*。
  3. **外连接**
    * 左外：`SELECT * FROM 表1 别名1 LEFT OUTER JOIN 表2 别名2 ON 别名1.xx=别名2.xx`
      > 左表记录无论是否满足条件都会查询出来，而右表只有满足条件才能出来。左表中不满足条件的记录，右表部分都为NULL
    * 左外自然：`SELECT * FROM 表1 别名1 NATURAL LEFT OUTER JOIN 表2 别名2 ON 别名1.xx=别名2.xx`
    * 右外：`SELECT * FROM 表1 别名1 RIGHT OUTER JOIN 表2 别名2 ON 别名1.xx=别名2.xx`
      > 右表记录无论是否满足条件都会查询出来，而左表只有满足条件才能出来。右表不满足条件的记录，其左表部分都为NULL
    * 右外自然：`SELECT * FROM 表1 别名1 NATURAL RIGHT OUTER JOIN 表2 别名2 ON 别名1.xx=别名2.xx`
    * 全链接：把left或者right改为full，但是`mysql不支持`，可以使用`UNION`来完成全链接

*3. 子查询*
　　：查询中有查询（`查看select关键字的个数！`）
  1. 出现的位置：
    * where后作为条件存在
    * from后作为表存在(多行多列)

  2. 条件
    * (\*\*\*)单行单列：`SELECT * FROM 表1 别名1 WHERE 列1 [=、>、<、>=、<=、!=] (SELECT 列 FROM 表2 别名2 WHERE 条件)`
    * (\*\*)多行单列：`SELECT * FROM 表1 别名1 WHERE 列1 [IN, ALL, ANY] (SELECT 列 FROM 表2 别名2 WHERE 条件)`
    * (\*)单行多列：`SELECT * FROM 表1 别名1 WHERE (列1,列2) IN (SELECT 列1, 列2 FROM 表2 别名2 WHERE 条件)`
    * (\*\*\*)多行多列：`SELECT * FROM 表1 别名1 , (SELECT ....) 别名2 WHERE 条件`

