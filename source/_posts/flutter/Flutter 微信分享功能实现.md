---
title: Flutter 微信分享功能实现
date: 2025-07-30 14:47:51
tags: Dart
---

### Flutter 是什么

Flutter 是 Google 推出的一款开源 UI 工具包，用于构建高性能、美观的跨平台应用程序。它允许开发者使用一套代码库来构建适用于移动端（iOS 和 Android）、Web、桌面端（Windows、macOS、Linux）的应用。

### 实现微信分享功能

**第一步**

首先按照[微信开发文档](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/guideline/create.html)，创建申请移动应用，获取到 `appID` 后可以进行下一步操作，注意，`ios` 应用需要获取 `universal link`。

**第二步**

在 [`pub.dev`](https://pub.dev/) 上搜索 `fluwx`，或者其他集成 `wx sdk` 的 `package` 都行。笔者使用 `fluwx` 为例。

具体代码实现，可参照以下示例

```dart
class WxSDK {
	// 保证 wx sdk 单例
  static final WxSDK _instance = WxSDK._internal();

  WxSDK._internal();

  factory WxSDK() => _instance;

  Fluwx fluwx = Fluwx();

  bool _initAble = false;

  init() async {
    bool result = await fluwx.registerApi(
        appId: '你的appId',
        universalLink: '你的universalLink'
    );
    if(!result) {
	    print('微信初始化SDK失败');
    }
    _initAble = result;
  }

  // 分享文本
  Future<bool> shareTextModel({
    required String title,
    WeChatScene scene = WeChatScene.session,
    String? description,
  }) async {
	  if (!_initAble) {
	    print('微信初始化SDK失败');
      return false;
    }
    bool isInstalled = await fluwx.isWeChatInstalled;
    if (!isInstalled) {
      print('无法打开微信 请检查是否安装了微信');
      return false;
    }
    bool result = await fluwx.share(
        WeChatShareTextModel(title, description: description, scene: scene));
    return result;
  }
}
```

**第三步**

安装微信 `SDK`，具体可以参考接入文档，[IOS 接入指南](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Access_Guide/iOS.html) 和 [Android 接入指南](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Access_Guide/Android.html)

**第四步**

ios 应用配置

在 Xcode 中，选择你的工程设置项，选中“TARGETS”一栏，在“info”标签栏的“URL type“添加“URL scheme”为你所注册的应用程序 id（如下图所示）

![xcode1.png](/assets/flutter/xcode1.png)

在 Xcode 中，选择你的工程设置项，选中“TARGETS”一栏，在 “info”标签栏的“Queried URL Schemes“添加 `weixin`、`weixinULAPI`、`weixinURLParamsAPI`（如下图所示）。

![xcode2.png](/assets/flutter/xcode2.png)

android 应用配置

配置`AndroidManifest.xml`

```xml
<activity
    android:name="com.idlefish.flutterboost.containers.BoostFlutterActivity"
    android:exported="true"
    android:launchMode="singleTask"
    android:taskAffinity="你的包名"
    android:theme="@android:style/Theme.Translucent.NoTitleBar" />
```

### 结语

最后，你的 Flutter 应用成功地把消息分享到微信了。
