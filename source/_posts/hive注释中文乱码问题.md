---
title: hive注释中文乱码问题
tags:
  - 大数据
  - CDH
  - Hive
  - 乱码
comments: true
categories:
  - 大数据
img: ''
cover: false
date: 2019-09-26 17:24:40
updated: 2019-09-26 17:24:40
password:
summary: 本文环境：CDH6.3.0，Hive2.1.1
---
在安装CDH中Hive时，虽然设置了Hive元数据库编码为UTF-8，但是创建Hive表注释依然会有乱码问题，本文介绍乱码原因以及解决方法。

### 乱码原因
查看Hive元数据库（本文为MySQL中metastore），发现虽然数据库编码为UTF-8，但是库下面的表编码却还是latin1，这是因为虽然创建metastore库时指定了编码UTF-8，但是CDH在安装Hive时却还是以latin1编码去创建表的，所以导致Hive表存在中文乱码问题。

### 解决方法步骤

#### 登录MySQL，进入Hive元数据库
```sql
use metastore;
```

#### 修改字段注释字符集
```sql
alter table COLUMNS_V2 modify column COMMENT varchar(256) character set utf8;
```

#### 修改表注释字符集
```sql
alter table TABLE_PARAMS modify column PARAM_VALUE varchar(40000) 	character set utf8;
```
#### 修改分区参数，支持分区建用中文表示
```sql
alter table PARTITION_PARAMS modify column PARAM_VALUE varchar(40000) character set utf8;
alter table PARTITION_KEYS modify column PKEY_COMMENT varchar(40000) character set utf8;
```

#### 修改表名注释，支持中文表示
```sql
alter table INDEX_PARAMS modify column PARAM_VALUE varchar(4000) character set utf8;
```

#### 修改视图，支持视图中文
```sql
ALTER TABLE TBLS modify COLUMN VIEW_EXPANDED_TEXT mediumtext CHARACTER SET utf8;
ALTER TABLE TBLS modify COLUMN VIEW_ORIGINAL_TEXT mediumtext CHARACTER SET utf8;
```