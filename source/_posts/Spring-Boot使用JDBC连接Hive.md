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
date: 2018-11-19 19:57:43
updated: 2018-12-18 15:16:40
password:
thumbnail: 'http://image.hming.org/logo/spring-boot.png'
---
项目中需要使用SpringBoot操作Hive进行开发，这里记录SpringBoot使用JdbcTemplate连接Hive的方法。开发环境使用Maven。
<!-- more -->
### 添加Maven依赖
```xml
<!-- hive -->
<dependency>
    <groupId>org.apache.hive</groupId>
    <artifactId>hive-jdbc</artifactId>
    <version>2.3.3</version>
</dependency>
<!-- hive === end -->
```
### 编写配置文件
数据库连接池使用HikariCP，参数设置参考：[https://github.com/brettwooldridge/HikariCP](https://github.com/brettwooldridge/HikariCP)
1. 在../resources目录下创建配置文件`application-hive.yml`，文件格式也可以使用`properties`格式
    ```yaml
    hive:
      url: jdbc:hive2://10.75.4.31:10000/mydb
      driver-class-name: org.apache.hive.jdbc.HiveDriver
      username: root
      password: 123456
      # 下面为连接池的补充设置，应用到上面所有数据源中
      # 初始化大小，最小连接数，最大连接数
      initialSize: 1
      minimumIdle: 3
      maximumPoolSize: 10
      # 等待来自池的连接的最大毫秒数(创建连接超时时间)
      connectionTimeout: 120000
      # 验证超时时间
      validationTimeout: 10000
      # 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
      idleTimeout: 30000
      # 配置一个连接在池中最大生存的时间，单位是毫秒
      maxLifeTime: 600000
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
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.Objects;

/**
 * Hive-JDBC配置
 *
 * @author liming
 * @date Created in 2018/11/15 11:58
 */
@Configuration
public class HiveJdbcConfig {

	private static final Logger logger = LoggerFactory.getLogger(HiveJdbcConfig.class);

	@Resource
	private Environment env;

	@Bean(name = "hiveJdbcDataSource")
	public DataSource dataSource() {
		DataSourceProperties dataSourceProperties = new DataSourceProperties();
		dataSourceProperties.setUrl(env.getProperty("hive.url"));
		dataSourceProperties.setDriverClassName(env.getProperty("hive.driver-class-name"));
		dataSourceProperties.setUsername(env.getProperty("hive.username"));
		dataSourceProperties.setPassword(env.getProperty("hive.password"));
		HikariDataSource dataSource = dataSourceProperties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
		//下面的配置根据实际情况添加、修改
		//连接超时时间
        dataSource.setConnectionTimeout(Long.valueOf(Objects.requireNonNull(env.getProperty("hive.connectionTimeout"))));
        //连接池最大连接数
        dataSource.setMaximumPoolSize(Integer.valueOf(Objects.requireNonNull(env.getProperty("hive.maximumPoolSize"))));
        //最小闲置连接数
		dataSource.setMinimumIdle(Integer.valueOf(Objects.requireNonNull(env.getProperty("hive.minimumIdle"))));
        //配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
        dataSource.setIdleTimeout(Long.parseLong(Objects.requireNonNull(env.getProperty("hive.idleTimeout"))));
        //连接最大生存时间
        dataSource.setMaxLifetime(Long.parseLong(Objects.requireNonNull(env.getProperty("hive.maxLifeTime"))));
        //验证超时时间
        dataSource.setValidationTimeout(Long.parseLong(Objects.requireNonNull(env.getProperty("hive.validationTimeout"))));
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