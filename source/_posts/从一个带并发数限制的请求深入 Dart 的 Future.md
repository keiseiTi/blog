---
title: 从一个带并发数限制的请求深入 Dart 的 Future
date: 2025-11-06 23:52:51
tags: Dart
---

在项目开发中，会经常遇到请求多个接口的情况，为了提升请求效率，通常采取并发请求的方式去解决。这个场景很经典。用图表示这个场景。

![flow.png](/assets/dart/flow.png)


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
  Function callback,
) async {
  int runningTask = 0;
  int queueIndex = 0;
  List<dynamic> result = [];
  while (runningTask < max && queueTask.isNotEmpty) {
    Future<dynamic> task = queueTask.removeAt(0);
    // 任务池被占用数量+1
    runningTask++;
    int taskIndex = queueIndex;
    queueIndex++;
    task
        .then((e) {
          result[taskIndex] = e;
        })
        .catchError((e) {
          result[taskIndex] = e;
        })
        .whenComplete(() {
          // 任务池被占用数量-1
          runningTask--;
          if(queueTask.length == 0) {
            callback(result);
          }
        });
  }
}

```

最后了解下 `Completer`，一个能手动控制 `Future` 。

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