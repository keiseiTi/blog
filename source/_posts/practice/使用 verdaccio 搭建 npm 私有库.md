---
title: 使用 verdaccio 搭建 npm 私有库
date: 2025-09-29 17:28:51
tags: 
---

## 为什么要搭建 npm 私有库

1. 保护私有代码，提高安全性
2. 统一管理内部依赖
3. 内网访问，离线环境支持

## 如何选择私有库方案

### verdaccio

简单的、零配置本地私有 `npm` 软件包代理注册表。并且可以配置 `npm` 源代理，开源免费。

### cnpm

阿里开源的，部署相对复杂，相对完善的功能，适合中大型团队、企业。

### nexus

满足搭建私有仓库的要求，使用的是 `java`。如果公司有同步管理 `maven`、`docker` 等需求，则可以考虑。

考虑到司内的情况， 选择 `verdaccio` 作为私有库的搭建

## 如何使用 verdaccio

不考虑本地部署，直接用 `Docker` 部署

### 安装

从 `Docker` 中拉取 `verdaccio` 镜像

```bash
docker pull verdaccio/verdaccio
```

启动 `Docker` 容器，并且后台运行，并且加卷挂载

```bash
docker run -d --name verdaccio -p 4873:4873
-v ~/.local/share/verdaccio:/verdaccio/storage
verdaccio/verdaccio
```

现在打开浏览器，访问 [http://localhost:4873](http://localhost:4873/) 就能看到 `verdaccio` 网址。

### 使用

用户注册

```bash
npm adduser --registry http://localhost:4873
```

用户登录

```bash
npm login --registry http://localhost:4873
```

在自己的项目下新建 .`npmrc` 文件或者在用户目录的 .`npmrc` 文件下，写入如下内容

```bash
registry=http://localhost:4873/
```

现在，可以发布 `npm` 包发布到 `verdaccio` 上。

### 配置

通过简单的配置满足个性化诉求。

进入 `/verdaccio/conf` 目录，打开 `config.yaml` 文件进行编辑就可以实现。

**私有作用域配置**

```bash
packages:
  '@demo/*':
    # scoped packages
    access: $all
    publish: $authenticated
    unpublish: $authenticated // 配置成 none 表示不需要删除
    proxy: npmjs
  '**':
    access: $all
    publish: none // 不允许发布除 @demo/* 外的 npm 包
    unpublish: $authenticated
```

**`npm` 代理配置**

```bash
uplinks:
  npmjs:
    url: https://registry.npmmirror.com/ // 换源
```

**网址配置**

```bash
web:
  title: demo
  sort_packages: asc
  darkMode: true
  ...
```

其他相关配置可查看[地址](https://verdaccio.org/docs/configuration/#default-configuration)