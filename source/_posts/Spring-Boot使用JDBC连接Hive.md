---
title: Spring-Boot使用JDBC连接Hive
tags:
  - Hive
  - Spring Boot
  - JDBC
comments: true
categories:
  - 大数据
  - Hive
thumbnail: ''
date: 2018-11-19 19:57:43
updated: 2018-11-19 19:57:43
password:
---
项目中需要使用SpringBoot操作Hive进行开发，这里记录SpringBoot使用JdbcTemplate连接Hive的方法。开发环境使用Maven。
<!-- more -->
### 添加Maven依赖
```bash
<!-- hive -->
<dependency>
    <groupId>org.apache.hive</groupId>
    <artifactId>hive-jdbc</artifactId>
    <version>2.3.3</version>
</dependency>
<!-- hive === end -->
```
### 编写配置文件
1. 在../resources目录下创建配置文件`application-hive.yml`，文件格式也可以使用`properties`格式
    ```yaml
    hive:
      url: jdbc:hive2://10.75.4.31:10000/mydb
      driver-class-name: org.apache.hive.jdbc.HiveDriver
      user: root
      password: 123456
      # 下面为连接池的补充设置，应用到上面所有数据源中
      # 初始化大小，最小，最大
      initialSize: 1
      minIdle: 3
      maxActive: 20
      # 配置获取连接等待超时的时间
      maxWait: 60000
      # 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
      timeBetweenEvictionRunsMillis: 60000
      # 配置一个连接在池中最小生存的时间，单位是毫秒
      minEvictableIdleTimeMillis: 30000
      validationQuery: select 1
      testWhileIdle: true
      testOnBorrow: false
      testOnReturn: false
      # 打开PSCache，并且指定每个连接上PSCache的大小
      poolPreparedStatements: true
      maxPoolPreparedStatementPerConnectionSize: 20
    ```
2. 在`application.yml`文件中指定激活`application-hive.yml`配置文件（这里也可以不配置，在config类中另外配置）。
    ```yaml
    spring:
      application:
        name: ProjectName
      profiles:
        active: hive
    ```
### 编写config配置类，将Hive的JdbcTemplate加载到Spring容器中
```java
import org.apache.tomcat.jdbc.pool.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import javax.annotation.Resource;

/**
 * Hive-JDBC配置
 *
 * @author liming
 */
@Configuration
public class HiveJdbcConfig {

	private static final Logger logger = LoggerFactory.getLogger(HiveJdbcConfig.class);

	@Resource
	private Environment env;

	@Bean(name = "hiveJdbcDataSource")
	public DataSource dataSource() {
		DataSource dataSource = new DataSource();
		dataSource.setUrl(env.getProperty("hive.url"));
		dataSource.setDriverClassName(env.getProperty("hive.driver-class-name"));
		dataSource.setUsername(env.getProperty("hive.user"));
		dataSource.setPassword(env.getProperty("hive.password"));
		logger.debug("Hive DataSource Inject Successfully...");
		return dataSource;
	}

	@Bean(name = "hiveJdbcTemplate")
	public JdbcTemplate hiveJdbcTemplate(@Qualifier("hiveJdbcDataSource") DataSource dataSource) {
		return new JdbcTemplate(dataSource);
	}
}
```

### 在代码中使用JdbcTemplate
```java
@Resource(name = "hiveJdbcTemplate")
private JdbcTemplate hiveJdbcTemplate;

public boolean loadFileToTable(String filePath, String tableName) {
//	String filePath = "/home/hadoop/user_sample.txt";
	String sql = "load data local inpath '" + filePath + "' into table " + tableName;
	try {
		hiveJdbcTemplate.execute(sql);
		return true;
	} catch (DataAccessException dae) {
		logger.error("Load data into table encounter an error: " + dae.getMessage());
		return false;
	}
}
```