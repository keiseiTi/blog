---
layout: about
title: puppeteer上传文件
date: 2019-07-25 17:10:56
tags:
---

### 前言

使用 `puppeteer` 自动化上传文件。

### 问题

通过使用 api `elementHandle.uploadFile(...filePaths)` 可以来上传文件。

根据文档是可以使用相对路径，在使用相对路径时，会出现上传失败。

### 解决

原来上传文件的路径，是根据文件的根目录在执行 `path.resolve(相对路径)` 。

因为执行文件是在当前目录的子目录中，所以使用的是 `element.uploda('./test.png')` ，是根据当前目录来使用，所以就出错了。

最后，用相对路径上传文件时，上传文件路径得根据当前工作目录。