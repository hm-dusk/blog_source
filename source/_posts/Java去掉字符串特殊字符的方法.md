---
title: Java去掉字符串特殊字符的方法
tags:
  - 字符串
comments: true
date: 2017-07-25 10:55:07
updated: 2017-07-25 10:55:07
categories: 
  - Java
password:
img: 'http://47.106.179.244/logo/java.jpg'
summary: java中利用Unicode编码过滤字符串中特定字符的方法
---
语法：
`str = str.replaceAll("[\pP]", "");`
\pP 中小写 `p` 是*property*的意思，表示 Unicode 属性，用于 Unicode *正表达式*的前缀。
大写 `P` 表示 Unicode 字符集七个字符属性之一：标点字符。

|符号|表示的意思|
|:--:|:--:|
|**`P`**|标点字符|
|**`L`**|字母|
|**`M`**|标记符号（一般不会单独出现）|
|**`Z`**|分隔符（比如空格、换行等）|
|**`S`**|符号（比如数学符号、货币符号等）|
|**`N`**|数字（比如阿拉伯数字、罗马数字等）|
|**`C`**|其他字符|

例：
```java
String result = 
  ",.!，，D_NAME。！；‘’”“《》**dfs  #$%^&()-+1431221厉害123漢字どうかのjavaを決繁体";
result = result.replaceAll("[\\pP\\pZ\\pS\\pC\\pM]", "");
//去掉标点符号、空格，换行、等所有特殊字符

/*
输出：
DNAMEdfs1431221厉害123漢字どうかのjavaを決繁体
*/
```

以后字符串的对应字符处理就可以用这个简单可靠的方法了

