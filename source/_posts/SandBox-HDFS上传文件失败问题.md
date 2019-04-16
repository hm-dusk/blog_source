---
title: SandBox HDFS上传文件失败问题
tags:
  - 大数据
  - HDP
  - SandBox
  - HDFS
comments: true
categories:
  - 大数据
  - SandBox
thumbnail: 'http://image.hming.org/logo/sandbox.png'
date: 2019-04-16 10:02:55
updated: 2019-04-16 10:02:55
password:
---
SandBox上传文件到HDFS时，文件创建成功，向文件写入数据失败问题分析和解决方案。
<!-- more -->
### 问题描述
远程（非Docker容器内、非宿主机）上传文件，新建文件成功，写入文件内容失败。查看`/var/log/hadoop/hdfs/hadoop-hdfs-namenode-sandbox-hdp.hortonworks.com.log`文件，发现如下错误：
```bash
2019-04-15 10:51:33,322 INFO  ipc.Server (Server.java:logException(2726)) - IPC Server handler 74 on 8020, call Call#4 Retry#0 org.apache.hadoop.hdfs.protocol.ClientProtocol.addBlock from 172.18.0.3:48170
java.io.IOException: File /tmp/1.csv could only be written to 0 of the 1 minReplication nodes. There are 1 datanode(s) running and 1 node(s) are excluded in this operation.
        at org.apache.hadoop.hdfs.server.blockmanagement.BlockManager.chooseTarget4NewBlock(BlockManager.java:2121)
        at org.apache.hadoop.hdfs.server.namenode.FSDirWriteFileOp.chooseTargetForNewBlock(FSDirWriteFileOp.java:286)
        at org.apache.hadoop.hdfs.server.namenode.FSNamesystem.getAdditionalBlock(FSNamesystem.java:2706)
        at org.apache.hadoop.hdfs.server.namenode.NameNodeRpcServer.addBlock(NameNodeRpcServer.java:875)
        at org.apache.hadoop.hdfs.protocolPB.ClientNamenodeProtocolServerSideTranslatorPB.addBlock(ClientNamenodeProtocolServerSideTranslatorPB.java:561)
        at org.apache.hadoop.hdfs.protocol.proto.ClientNamenodeProtocolProtos$ClientNamenodeProtocol$2.callBlockingMethod(ClientNamenodeProtocolProtos.java)
        at org.apache.hadoop.ipc.ProtobufRpcEngine$Server$ProtoBufRpcInvoker.call(ProtobufRpcEngine.java:524)
        at org.apache.hadoop.ipc.RPC$Server.call(RPC.java:1025)
        at org.apache.hadoop.ipc.Server$RpcCall.run(Server.java:876)
        at org.apache.hadoop.ipc.Server$RpcCall.run(Server.java:822)
        at java.security.AccessController.doPrivileged(Native Method)
        at javax.security.auth.Subject.doAs(Subject.java:422)
        at org.apache.hadoop.security.UserGroupInformation.doAs(UserGroupInformation.java:1730)
        at org.apache.hadoop.ipc.Server$Handler.run(Server.java:2682)
```

### 原因分析
上传文件过程中，Client先向NameNode发送上传文件请求，NameNode将DataNode的地址返回给Client，Client再通过该地址，写入文件内容。
由于SandBox HDP是搭建在Docker容器内部，所以NameNode返回的是Docker容器的ip地址（这和Docker的网络模式有关），因为SandBox默认启动的是自定义网络，所以容器内部ip为`172.18.0.3`，返回给Client之后，Client通过该IP是无法找到DataNode的，所以导致文件的元数据存到了NameNode上，而文件内容无法写入DataNode。

### 解决方案
#### 方案一（推荐）
修改代码和增加端口映射
因为NameNode返回的是Docker的ip，Client访问不了DataNode，所以可以让NameNode返回主机名，然后Client配置host的方式请求到宿主机的地址
1. 修改Client host文件配置，增加host映射
```bash
10.75.4.32 sandbox-hdp.hortonworks.com
```
2. java代码修改：
```java
Configuration conf = new Configuration();
conf.set("fs.defaultFS", "hdfs://10.75.4.32:8020/");
//增加下面一行，设置返回DataNode的主机名而不是ip
conf.set("dfs.client.use.datanode.hostname","true");
```
此时还是不能访问到DataNode，因为`sandbox-proxy`容器并没有映射DataNode的端口（默认为`50010`）。
3. 修改`sandbox-proxy`端口映射，增加`50010`端口
停止、删除`sandbox-proxy`容器
```bash
```
修改`./assets/generate-proxy-deploy-script.sh`脚本，在`tcpPortsHDP=(...)`部分新增`50010`端口映射
```bash
...
tcpPortsHDP=(
...
[50010]=50010
...
)
```
4. 重新执行`docker-deploy-hdp30.sh`脚本中配置代理容器的脚本
```bash
#Deploy the proxy container.
sed 's/sandbox-hdp-security/sandbox-hdp/g' assets/generate-proxy-deploy-script.sh > assets/generate-proxy-deploy-script.sh.new
mv -f assets/generate-proxy-deploy-script.sh.new assets/generate-proxy-deploy-script.sh
chmod +x assets/generate-proxy-deploy-script.sh
assets/generate-proxy-deploy-script.sh 2>/dev/null
```

#### 方案二（不推荐）
暴力取消Docker网络隔离层，**这样也就失去了Docker容器网络隔离的特性，具体利弊需要斟酌**。
因为原因是Client连不上DataNode节点，所以直接将Docker容器的网络模式设置成host模式（详细参照Docker网络模式），将容器的ip和端口直接和宿主机打通，这样就能远程连接DataNode了。

##### 纯Docker模式
1. 停止、删除已生成容器（`sandbox-proxy`和`sandbox-hdp`）
```bash
[root@sandbox proxy]# docker stop $(docker ps -aq)
ef35a5989c71
25f814082615
[root@sandbox proxy]# docker rm $(docker ps -aq)
ef35a5989c71
25f814082615
```
2. 修改脚本文件`docker-deploy-hdp30.sh`，将容器启动改为host网络模式，注释代理容器相关代码
> 脚本文件为运行sandbox时的启动脚本

    ```bash
    #!/usr/bin/env sh
    #This script downloads HDP sandbox along with their proxy docker container
    set -x
    
    # CAN EDIT THESE VALUES
    registry="hortonworks"
    name="sandbox-hdp"
    version="3.0.1"
    proxyName="sandbox-proxy"
    proxyVersion="1.0"
    flavor="hdp"
    
    # NO EDITS BEYOND THIS LINE
    # housekeeping
    # 这里已经没用了，注释
    #echo $flavor > sandbox-flavor
    
    
    # create necessary folders for nginx and copy over our rule generation script there
    #这里也注释，不需要代理容器了
    #mkdir -p sandbox/proxy/conf.d
    #mkdir -p sandbox/proxy/conf.stream.d
    
    # pull and tag the sandbox and the proxy container
    # 本地已经存在镜像文件，这里可以注释减少脚本执行时间
    #docker pull "$registry/$name:$version"
    #docker pull "$registry/$proxyName:$proxyVersion"
    
    
    # start the docker container and proxy
    if [ "$flavor" == "hdf" ]; then
     hostname="sandbox-hdf.hortonworks.com"
    elif [ "$flavor" == "hdp" ]; then
     hostname="sandbox-hdp.hortonworks.com"
    fi
    
    version=$(docker images | grep $registry/$name  | awk '{print $2}');
    
    # Create cda docker network
    # 因为采用host网络模式，这里创建网络cda也注释
    #docker network create cda 2>/dev/null
    
    # Deploy the sandbox into the cda docker network
    # 将原本的run语句注释，修改为以下语句（将网络模式修改为host）
    #docker run --privileged --name $name -h $hostname --network=cda --network-alias=$hostname -d "$registry/$name:$version"
    docker run --privileged --name $name -h $hostname --network=host -d "$registry/$name:$version"
    
    echo " Remove existing postgres run files. Please wait"
    sleep 2
    docker exec -t "$name" sh -c "rm -rf /var/run/postgresql/*; systemctl restart postgresql-9.6.service;"
    
    
    #Deploy the proxy container.
    # 这里为代理容器配置，因为host模式自动将所有端口映射到宿主机上，所以不再需要sandbox-proxy容器的支持
    #sed 's/sandbox-hdp-security/sandbox-hdp/g' assets/generate-proxy-deploy-script.sh > assets/generate-proxy-deploy-script.sh.new
    #mv -f assets/generate-proxy-deploy-script.sh.new assets/generate-proxy-deploy-script.sh
    #chmod +x assets/generate-proxy-deploy-script.sh
    #assets/generate-proxy-deploy-script.sh 2>/dev/null
    
    #check to see if it's windows
    # 以下为window环境代码，也注释
    #if uname | grep MINGW; then
    # sed -i -e 's/\( \/[a-z]\)/\U\1:/g' sandbox/proxy/proxy-deploy.sh
    #fi
    #chmod +x sandbox/proxy/proxy-deploy.sh 2>/dev/null
    #sandbox/proxy/proxy-deploy.sh
    ```
3. 重新运行`docker-deploy-hdp30.sh`脚本文件
```bash
[root@sandbox opt]# sh docker-deploy-hdp30.sh 
+ registry=hortonworks
+ name=sandbox-hdp
+ version=3.0.1
+ proxyName=sandbox-proxy
+ proxyVersion=1.0
+ flavor=hdp
+ echo hdp
+ mkdir -p sandbox/proxy/conf.d
+ mkdir -p sandbox/proxy/conf.stream.d
+ '[' hdp == hdf ']'
+ '[' hdp == hdp ']'
+ hostname=sandbox-hdp.hortonworks.com
++ docker images
++ grep hortonworks/sandbox-hdp
++ awk '{print $2}'
+ version=3.0.1
+ docker run --privileged --name sandbox-hdp -h sandbox-hdp.hortonworks.com --network=host -d hortonworks/sandbox-hdp:3.0.1
b91b70d7792a806310c067e7792f4c3930a5329261128d5a4c211b804a923342
+ echo ' Remove existing postgres run files. Please wait'
 Remove existing postgres run files. Please wait
+ sleep 2
+ docker exec -t sandbox-hdp sh -c 'rm -rf /var/run/postgresql/*; systemctl restart postgresql-9.6.service;'

# 可以看到此时只剩下sandbox-hdp一个容器在运行
[root@sandbox opt]# docker ps
CONTAINER ID        IMAGE                           COMMAND             CREATED             STATUS              PORTS               NAMES
b91b70d7792a        hortonworks/sandbox-hdp:3.0.1   "/usr/sbin/init"    8 minutes ago       Up 8 minutes                            sandbox-hdp
```
4. 最后进行各种初始化配置即可
进入sandbox容器，重置Ambari admin密码
```bash
[root@sandbox sandbox]# docker exec -it sandbox-hdp /bin/bash
[root@sandbox-hdp /]# ambari-admin-password-reset 
Please set the password for admin: 
Please retype the password for admin: 

The admin password has been set.
Restarting ambari-server to make the password change effective...

Using python  /usr/bin/python
Restarting ambari-server
Ambari Server is not running
Ambari Server running with administrator privileges.
Organizing resource files at /var/lib/ambari-server/resources...
Ambari database consistency check started...
Server PID at: /var/run/ambari-server/ambari-server.pid
Server out at: /var/log/ambari-server/ambari-server.out
Server log at: /var/log/ambari-server/ambari-server.log
Waiting for server start............................
Server started listening on 8080

DB configs consistency check: no errors and warnings were found.
```
访问8080端口，到Ambari界面，登录后重启服务即可。

SandBox使用参照：
[SandBox-HDP使用详解](http://blog.hming.org/2019/04/04/SandBox-HDP使用详解/)
**注意：由于没有运行sandbox-proxy容器，1080端口已经无法访问**

##### VMware模式
1. 通过ssh连接22端口登录到VMware虚拟机（sandbox的宿主机）里面
也可以通过XShell等工具进入
默认`root`初始密码为`hadoop`
```bash
[root@localhost ~]# ssh 10.75.4.6 -p 22
root@10.75.4.6's password: 
Last failed login: Tue Apr 16 15:38:03 UTC 2019 from 10.75.4.32 on ssh:notty
There was 1 failed login attempt since the last successful login.
Last login: Mon Apr 15 16:34:49 2019 from 10.75.4.11
[root@sandbox-host ~]# docker images
REPOSITORY                         TAG                 IMAGE ID            CREATED             SIZE
hortonworks/sandbox-proxy          1.0                 ca272ae0e63a        4 months ago        109MB
hortonworks/sandbox-hdp-security   3.0                 ae1d1779b081        4 months ago        27.5GB
```
2. 停止、删除已生成容器（`sandbox-proxy`和`sandbox-hdp-security`）
```bash
[root@sandbox-host proxy]# docker stop $(docker ps -aq)
ef35a5989c71
25f814082615
[root@sandbox-host proxy]# docker rm $(docker ps -aq)
ef35a5989c71
25f814082615
```
3. 修改脚本文件`/sandbox/sandbox-deploy.sh`，将容器启动改为host网络模式，注释代理容器相关代码
```bash
#!/usr/bin/env bash

flavor=$(cat /sandbox-flavor)
if [ "$flavor" == "hdf" ]; then
 name="sandbox-hdf-standalone-cda-ready"
 hostname="sandbox-hdf.hortonworks.com"
elif [ "$flavor" == "hdp" ]; then
 name="sandbox-hdp-security"
 hostname="sandbox-hdp.hortonworks.com"
fi

version=$(docker images | grep $name  | awk '{print $2}');
image="hortonworks/$name:$version";

# Create cda docker network
# 因为采用host网络模式，这里注释创建网络cda
#docker network create cda

# Deploy the sandbox into the cda docker network
# 将原本的run语句注释，修改为以下语句（将网络模式修改为host）
#docker run --privileged --name $name -h $hostname --network=cda --network-alias=$hostname -d $image
docker run --privileged --name $name -h $hostname --network=host -d $image

# Deploy the proxy container.  This script was generated by running
# 这里为代理容器配置，因为host模式自动将所有端口映射到宿主机上，所以不再需要sandbox-proxy容器的支持
#/sandbox/proxy/generate-proxy-deploy-script.sh
#/sandbox/proxy/proxy-deploy.sh
```
4. 运行脚本文件`/sandbox/sandbox-deploy.sh`，重新生成容器
```bash
[root@sandbox-host sandbox]# sh sandbox-deploy.sh 
12e3df82d057057c6af78eea1c8bd9eb9156ebe0bac3dc90d2fec8377f48aa6f

# 可以看到此时只剩下sandbox-hdp-security一个容器在运行
[root@sandbox-host sandbox]# docker ps
CONTAINER ID  IMAGE                                  COMMAND           CREATED        STATUS       PORTS  NAMES
12e3df82d057  hortonworks/sandbox-hdp-security:3.0   "/usr/sbin/init"  6 seconds ago  Up 3 seconds        sandbox-hdp-security
```
5. 最后进行各种初始化配置即可
进入sandbox容器，重置Ambari admin密码
```bash
[root@sandbox-host sandbox]# docker exec -it sandbox-hdp-security /bin/bash
[root@sandbox-hdp /]# ambari-admin-password-reset 
Please set the password for admin: 
Please retype the password for admin: 

The admin password has been set.
Restarting ambari-server to make the password change effective...

Using python  /usr/bin/python
Restarting ambari-server
Ambari Server is not running
Ambari Server running with administrator privileges.
Organizing resource files at /var/lib/ambari-server/resources...
Ambari database consistency check started...
Server PID at: /var/run/ambari-server/ambari-server.pid
Server out at: /var/log/ambari-server/ambari-server.out
Server log at: /var/log/ambari-server/ambari-server.log
Waiting for server start............................
Server started listening on 8080

DB configs consistency check: no errors and warnings were found.
```
访问8080端口，到Ambari界面，登录后重启服务即可。

SandBox使用参照：
[SandBox-HDP使用详解](http://blog.hming.org/2019/04/04/SandBox-HDP使用详解/)
**注意：由于没有运行sandbox-proxy容器，1080端口已经无法访问**