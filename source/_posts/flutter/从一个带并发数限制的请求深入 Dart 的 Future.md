---
title: 从一个带并发数限制的请求深入 Dart 的 Future
date: 2025-11-06 23:52:51
tags: Dart
---

在项目开发中，会经常遇到请求多个接口的情况，为了提升请求效率，通常采取并发请求的方式去解决。这个场景很经典。用图表示这个场景。

![concurrence-fetch.png](/assets/dart/concurrence-fetch.png)


## Future

### 什么是  Future

`Future` 是一个表示异步操作最终结果的对象。它代表一个未来某个时刻才会可用的值（或错误）。

### 核心特性

- 异步非阻塞
- 单次完成
- 支持链式调用
- 三种状态，分别是 Uncompleted（未完成），Completed with data（成功），Completed with error（失败）

### 如何使用

```dart
Future<String> fetchList() async {
   final res = await http.get('...');
   return res.body;
}

void main() {
	fetchList().then((_) {
    print('success');
	}).catchError((e) {
	   print('error: $e');
	}).whenComplete(() {
     print('complete');
  });

  Future.delayed(Duration(seconds: 1), () {
    print('delayed task done');
  });

  print('main done');
}
```

使用 `async` 函数构造 `Future` 。

`await`，`then`，`catch`，`whenComplete` 表示处理等待 `Future` 结果。

`Future.delayed` 创建延迟执行的 `Future` 函数。

除此之外，还有 `Future.wait`，`Future.any` ，`Future.value`，`Future.error` 等等。

### 代码实现

```dart
Future<void> fetchQueue(
  List<Future<dynamic>> queueTask,
  int max,
  Function(List<dynamic>) callback,
) async {
  // 预分配结果数组（避免越界）
  final result = List<dynamic>.filled(queueTask.length, null);
  int runningTask = 0;
  int nextIndex = 0; // 下一个要执行的任务索引
  int completedCount = 0; // 已完成任务数

  void runNext() {
    // 如果还有任务未执行，且并发数未满
    while (runningTask < max && nextIndex < queueTask.length) {
      final task = queueTask[nextIndex];
      final currentIndex = nextIndex;
      nextIndex++;
      runningTask++;

      task
          .then((value) {
            result[currentIndex] = value;
          })
          .catchError((error) {
            result[currentIndex] = error;
          })
          .whenComplete(() {
            runningTask--;
            completedCount++;
            
            // 尝试启动下一个任务
            runNext();
            
            // 如果所有任务完成，执行回调
            if (completedCount == queueTask.length) {
              callback(result);
            }
          });
    }
  }

  // 开始执行
  runNext();
  
  // 边界情况：如果 queueTask 为空
  if (queueTask.isEmpty) {
    callback([]);
  }
}
```


> 除此之外，还有其他方式吗？那来了解下 Completer，一个能手动完成 Future 的控制器。


## **Completer**

### 什么是 Completer

`Completer` 是一个手动完成 `Future` 的控制器。它允许你在任意时机（通常在回调函数中）显式地完成（成功或失败）一个 `Future`。

### 核心特性

- 手动控制完成时机
    - 不像 `async/await` 自动完成
    - 可以在任何地方、任何时间调用 `complete()` 或 `completeError()`
- 单次完成
    - `Completer` 只能完成 一次
    - 重复调用 `complete()` 会抛出 `StateError`
- 状态检查
    - 可以通过 `completer.isCompleted` 检查状态
- Future 一一对应
    - 每个 `Completer` 只能生成一个 `Future`
    - 但一个 `Future` 可以被多个地方监听

### 如何使用

```dart
import 'dart:async';

Future<String> callNativeMethod(String method, dynamic arguments) {
  final completer = Completer<String>();

  methodChannel
      .invokeMethod(method, arguments)
      .then((result) {
        completer.complete(result.toString());
      })
      .catchError((error) {
        completer.completeError(error);
      });

  return completer.future;
}

void main(){
 callNativeMethod('connectNetwork');
}

```

`completer.complete(T value)` 成功完成，返回值

`completer.completeError(Object error, [StackTrace? stackTrace])` 失败完成，抛出错误

`completer.isCompleted` 返回 `bool`，表示是否已完成

`completer.future()` 获取与 `Completer` 关联的 `Future`


```dart
Future<List<dynamic>> fetchQueue(
  List<Future<dynamic>> tasks,
  int maxConcurrent,
) async {
  if (tasks.isEmpty) return [];

  final results = List<dynamic>.filled(tasks.length, null);
  final completer = Completer<List<dynamic>>();
  int running = 0;
  int nextIndex = 0;
  int completed = 0;

  void runTask() {
    if (nextIndex >= tasks.length) return;
    
    final index = nextIndex++;
    final task = tasks[index];
    running++;

    task
        .then((value) => results[index] = value)
        .catchError((error) => results[index] = error)
        .whenComplete(() {
      running--;
      completed++;
      
      // 启动下一个任务
      if (nextIndex < tasks.length) {
        runTask();
      }
      
      // 所有任务完成
      if (completed == tasks.length) {
        completer.complete(results);
      }
    });
  }

  // 启动初始批次
  for (int i = 0; i < maxConcurrent && nextIndex < tasks.length; i++) {
    runTask();
  }

  return completer.future;
}

// 使用
final results = await fetchQueue(futureList, 3);
callback(results);
```