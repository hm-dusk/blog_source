---
title: CentOS7下搭建Hive
tags:
  - Hive
  - 大数据
  - 数据仓库
comments: true
categories:
  - 大数据
thumbnail: 'http://image.hming.org/logo/hive.png'
date: 2018-12-06 15:18:49
updated: 2019-1-3 20:45:43
password:
---
CentOS7下搭建Hive，Hive元数据
<!-- more -->
### 搭建Hadoop集群
参考[CentOS7下搭建Hadoop集群](http://blog.hming.org/2018/09/16/CentOS7%E4%B8%8B%E6%90%AD%E5%BB%BAHadoop%E9%9B%86%E7%BE%A4/)

### 下载Hive压缩包
找到合适版本下载hive，本文压缩包为`apache-hive-2.3.4-bin.tar.gz`
[下载地址](http://ftp.riken.jp/net/apache/hive/)

### 解压，配置环境变量
1. 解压到指定目录（本文目录为/home/hive）
`tar -zxvf apache-hive-2.3.4-bin.tar.gz`

2. 配置环境变量
`vim /etc/profile`，添加以下代码
```bash
# hive
export HIVE_HOME=/home/hive # 为hive解压目录
export PATH=$PATH:${HIVE_HOME}/bin
```
3. 刷新配置文件
`source /etc/profile`

### 验证hive版本
`hive --version`
```bash
[root@hadoopmaster hive]# hive --version
Hive 2.3.4
Git git://daijymacpro-2.local/Users/daijy/commit/hive -r 56acdd2120b9ce6790185c679223b8b5e884aaf2
Compiled by daijy on Wed Oct 31 14:20:50 PDT 2018
From source with checksum 9f2d17b212f3a05297ac7dd40b65bab0
```

### hive-env.sh配置
1. 复制`/home/hive/conf/hive-env.sh.template` -> `/home/hive/conf/hive-env.sh`
```bash
[root@hadoopmaster ~]# cd /home/hive/conf
[root@hadoopmaster conf]# cp hive-env.sh.template hive-env.sh
```
2. 修改`/home/hive/conf/hive-env.sh`，找到以下配置，根据实际情况修改
```bash
export JAVA_HOME=/home/jdk #jdk安装目录
export HADOOP_HOME=/home/hadoop #hadoop安装目录
export HIVE_HOME=/home/hive #hive安装目录
```

### hive-site.xml配置
1. 复制`/home/hive/conf/hive-default.template` -> `/home/hive/conf/hive-site.xml`
```bash
[root@hadoopmaster conf]# cp hive-default.xml.template  hive-site.xml
```
2. 修改`/home/hive/conf/hive-site.xml`，找到文件中以下配置，根据实际情况修改
hive其他配置参考：[Hive Configuration Properties](https://cwiki.apache.org/confluence/display/Hive/Configuration+Properties)
```xml
<configuration>
  <!-- mysql数据库配置 -->
  <property>
    <name>javax.jdo.option.ConnectionPassword</name>
    <value>1234</value>
    <description>mysql密码</description>
  </property>

  <property>
    <name>javax.jdo.option.ConnectionUserName</name>
    <value>root</value>
    <description>mysql用户名</description>
  </property>

  <property>
    <name>javax.jdo.option.ConnectionURL</name>
    <value>jdbc:mysql://hadoopmaster:3306/hive?useSSL=false</value>
    <description>JDBC连接路径</description>
  </property>

  <property>
    <name>javax.jdo.option.ConnectionDriverName</name>
    <value>com.mysql.jdbc.Driver</value>
    <description>Driver class name for a JDBC metastore</description>
  </property>

  <!-- 其他配置 -->
  <property>
    <name>hive.cli.print.header</name>
    <value>true</value>
    <description>是否显示查询结果的列名，默认为不显示。 </description>
  </property>

  <property>
    <name>hive.cli.print.current.db</name>
    <value>true</value>
    <description>是否显示数据库名称，默认为不显示</description>
  </property>

  <property>
    <name>hive.server2.webui.port</name>
    <value>10002</value>
    <description>HiveServer2 Web页面端口设置</description>
  </property>
  <property>
    <name>hive.exec.local.scratchdir</name>
    <value>/home/hive/tmp</value>
    <description>Hive作业的本地临时空间</description>
  </property>

  <property>
    <name>hive.downloaded.resources.dir</name>
    <value>/home/hive/downloads</value>
    <description>用于在远程文件系统中添加资源的临时本地目录。</description>
  </property>

  <property>
    <name>hive.querylog.location</name>
    <value>/home/hive/querylog</value>
    <description>Hive 实时查询日志所在的目录，如果该值为空，将不创建实时的查询日志。</description>
  </property>
  
  <property>
    <name>hive.server2.logging.operation.log.location</name>
    <value>/home/hive/server2_logs</value>
    <description>如果启用了日志记录功能，则存储操作日志的顶级目录</description>
  </property>
</configuration>
```

### 复制mysql驱动到hive安装目录的lib下
`mysql-connector-java-5.1.46.jar`
[点我查看驱动包下载方式](http://blog.hming.org/2018/12/09/MySQL连接驱动包下载方法/)

### 初始化元数据
1. 在mysql中创建hive数据库
2. 运行hive的SchemaTool进行初始化hive的元数据
`schematool -dbType mysql -initSchema`
```bash
[root@hadoopmaster ~]# cd /home/hive/bin
[root@hadoopmaster bin]# ./schematool	# 查看帮助
[root@hadoopmaster bin]# ./schematool -dbType mysql -initSchema
```
