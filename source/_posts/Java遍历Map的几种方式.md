---
title: Java遍历Map的几种方式
tags:
  - 集合
  - 遍历
comments: true
date: 2017-07-19 19:26:48
updated: 2017-07-19 19:26:48
categories: 
 - Java
 - Map
password:
---
今天突然要用到Map的遍历，在此总结几种Map的遍历方法
<!-- more -->
## 第一种 在for-each循环中使用entries来遍历
* 最常见的且大多数情况下使用的方式，在`键`和`值`都需要的时候使用
* `但是，如果要在遍历中删除某个键值对，则不能使用该方法`

```java
Map<Integer, Integer> map = Maps.newHashMap();

for(Map.Entry<Integer,Integer> entry:map.entrySet()){

            System.out.println("键：" + entry.getKey() + "，值：" + entry.getValue());

        }
```
>>注意：for-each循环在`Java 5`中被引入所以该方法只能应用于java 5或更高的版本中。如果你遍历的是一个空的map对象，for-each循环将抛出`NullPointerException`，因此在遍历前你总是应该检查空引用。

## 第二种 在for-each循环中遍历keys或values
* 如果只需要map中的键或者值，你可以通过keySet或values来实现遍历，而不是用entrySet

```java
Map<Integer, Integer> map = Maps.newHashMap();

//遍历map中的键
  
for (Integer key : map.keySet()) {
  
    System.out.println("Key = " + key);
  
}
  
//遍历map中的值
  
for (Integer value : map.values()) {
  
    System.out.println("Value = " + value);
  
}
```
>>该方法比entrySet遍历在性能上稍好（快了10%），而且代码更加干净。

## 第三种 使用Iterator遍历

```java
Map<Integer, Integer> map = Maps.newHashMap();
  
Iterator<Map.Entry<Integer, Integer>> entries = map.entrySet().iterator();
  
while (entries.hasNext()) {
  
    Map.Entry<Integer, Integer> entry = entries.next();
  
    System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue());
    //在这里面可以删除键值对
    if(entries.next().getValue()>0){
    	entries.remove();
    }
  
}
```
>>该种方式看起来冗余却有其优点所在。首先，在老版本java中这是惟一遍历map的方式。另一个好处是，你可以在遍历时调用`iterator.remove()`来`删除entries`，另两个方法则不能。根据javadoc的说明，如果在for-each遍历中尝试使用此方法，结果是不可预测的。
>>
>>从性能方面看，该方法类同于for-each遍历（即方法二）的性能。

## 第四种 通过键找值遍历（效率低）

```java
Map<Integer, Integer> map = new HashMap<Integer, Integer>();  
  
for (Integer key : map.keySet()) {  
  
    Integer value = map.get(key);  
  
    System.out.println("Key = " + key + ", Value = " + value);  
  
}  
```
>>作为方法一的替代，这个代码看上去更加干净；但实际上它相当慢且无效率。因为从键取值是耗时的操作（与方法一相比，在不同的Map实现中该方法慢了20%~200%）。如果你安装了FindBugs，它会做出检查并警告你关于哪些是低效率的遍历。所以尽量避免使用。

## 总结

如果仅需要键(keys)或值(values)使用方法二。如果你使用的语言版本低于java 5，或是打算在遍历时删除entries，必须使用方法三。否则使用方法一(键值都要)。