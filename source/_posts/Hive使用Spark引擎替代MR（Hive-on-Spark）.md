---
title: Hive使用Spark引擎替代MR（Hive on Spark）
tags:
  - 大数据
  - Hive
  - Spark
comments: true
categories:
  - 大数据
img: 'http://47.106.179.244/logo/hive+spark.png'
date: 2018-12-09 17:19:50
updated: 2018-12-09 17:19:50
password:
summary: Hive on Spark安装（Hive-2.3.4、Spark-2.0.0） 
---
[官方文档](https://cwiki.apache.org/confluence/display/Hive/Hive+on+Spark%3A+Getting+Started)
[参考文章](https://blog.csdn.net/Dante_003/article/details/72867493)

编译成功示例：
```bash
...
[INFO] 
[INFO] --- maven-antrun-plugin:1.8:run (default) @ spark-assembly_2.11 ---
[INFO] Executing tasks

main:
[INFO] Executed tasks
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Summary:
[INFO] 
[INFO] Spark Project Parent POM 2.0.0 ..................... SUCCESS [02:06 min]
[INFO] Spark Project Tags ................................. SUCCESS [01:33 min]
[INFO] Spark Project Sketch ............................... SUCCESS [ 12.649 s]
[INFO] Spark Project Networking ........................... SUCCESS [ 22.077 s]
[INFO] Spark Project Shuffle Streaming Service ............ SUCCESS [ 15.268 s]
[INFO] Spark Project Unsafe ............................... SUCCESS [ 24.808 s]
[INFO] Spark Project Launcher ............................. SUCCESS [ 54.464 s]
[INFO] Spark Project Core ................................. SUCCESS [07:09 min]
[INFO] Spark Project GraphX ............................... SUCCESS [ 31.348 s]
[INFO] Spark Project Streaming ............................ SUCCESS [01:04 min]
[INFO] Spark Project Catalyst ............................. SUCCESS [02:22 min]
[INFO] Spark Project SQL .................................. SUCCESS [02:50 min]
[INFO] Spark Project ML Local Library ..................... SUCCESS [ 27.201 s]
[INFO] Spark Project ML Library ........................... SUCCESS [02:25 min]
[INFO] Spark Project Tools ................................ SUCCESS [  7.599 s]
[INFO] Spark Project Hive ................................. SUCCESS [01:15 min]
[INFO] Spark Project REPL ................................. SUCCESS [  9.934 s]
[INFO] Spark Project YARN Shuffle Service ................. SUCCESS [ 14.017 s]
[INFO] Spark Project YARN ................................. SUCCESS [ 39.637 s]
[INFO] Spark Project Assembly ............................. SUCCESS [  3.878 s]
[INFO] Spark Project External Flume Sink .................. SUCCESS [ 24.054 s]
[INFO] Spark Project External Flume ....................... SUCCESS [ 21.908 s]
[INFO] Spark Project External Flume Assembly .............. SUCCESS [  5.095 s]
[INFO] Spark Integration for Kafka 0.8 .................... SUCCESS [ 20.951 s]
[INFO] Spark Project Examples ............................. SUCCESS [ 37.750 s]
[INFO] Spark Project External Kafka Assembly .............. SUCCESS [  6.523 s]
[INFO] Spark Integration for Kafka 0.10 ................... SUCCESS [ 20.073 s]
[INFO] Spark Integration for Kafka 0.10 Assembly .......... SUCCESS [  5.019 s]
[INFO] Spark Project Java 8 Tests 2.0.0 ................... SUCCESS [ 11.790 s]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 27:45 min
[INFO] Finished at: 2018-12-09T20:51:07+08:00
[INFO] ------------------------------------------------------------------------
+ rm -rf /opt/spark-2.0.0/dist
+ mkdir -p /opt/spark-2.0.0/dist/jars
+ echo 'Spark 2.0.0 built for Hadoop 2.7.2'
+ echo 'Build flags: -Pyarn,hadoop-provided,hadoop-2.7,parquet-provided'
...
```