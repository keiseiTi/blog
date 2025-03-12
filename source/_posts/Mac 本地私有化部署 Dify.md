---
title: Mac 本地私有化部署 Dify
date: 2025-03-12 22:50:00
tags: LLM
---

## 什么是 Dify

Dify 是一款开源的大语言模型（LLM）应用开发平台。它融合了后端即服务（Backend as Service）和 LLMOps 的理念，使开发者可以快速搭建生产级的生成式 AI 应用。即使你是非技术人员，也能参与到 AI 应用的定义和数据运营过程中。

## 如何部署

**硬件要求**

CPU >= 2 Core

显存/RAM ≥ 16 GiB（推荐）

### 安装 Docker

`Docker` 是一种开源的应用容器引擎，旨在通过容器化技术实现应用的快速开发、部署和运行。

前往 [docker](https://www.docker.com/)，根据系统类型选择相应版本进行安装桌面端应用。

### 安装 pyenv

`pyenv` 类似于前端的 `nvm`，可在不同 `python` 版本之间轻松切换，实现 `python` 环境隔离，且支持自动激活和退出虚拟环境。

在终端使用以下命令

```bash
curl -fsSL https://pyenv.run | bash
```

将环境变量设置到 `Bash` 或者是 `Zsh` 中，由于笔者使用的是 `Zsh`，所以将环境环境写入到 `.zshrc` 中

```bash
  echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
  echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
  echo 'eval "$(pyenv init - zsh)"' >> ~/.zshrc
```

### 安装 Python

在上一步已经安装过 `pyenv` 了，所以可以直接使用 `pyenv install 3.12` 。

在安装好 `Python` 后，需要调整  `bin` `alias` 。

可以在控制台直接使用 `python` 以及 `pip` 。

### 安装 Poetry

`poetry` 类似于 `pnpm`，是一个 `Python` 虚拟环境和依赖管理的工具。

```bash
curl -sSL https://install.python-poetry.org | python -
```

### clone Dify

```bash
git clone https://github.com/langgenius/dify.git
```

### 部署 Dify

可以参照[本地源码部署](https://docs.dify.ai/zh-hans/getting-started/install-self-hosted/local-source-code)，根据文档里的内容进行部署。

需要注意的是 `poetry` 在 2.0.1 版本后将 `poetry shell` 改为 `poetry env activate` 。

## 如何启动

### 进入 api 目录

启动 `api` 服务

`poetry run flask run --host 0.0.0.0 --port=5001 --debug`

启动 `Worker` 服务

`poetry run celery -A app.celery worker -P gevent -c 1 -Q dataset,generation,mail,ops_trace --loglevel INFO`

### 进入 web 目录

安装依赖，执行 `npm run build` ，最后执行 `npm start` 即可打开 [`http://localhost:3000`](http://localhost:3000/) 开始使用。

需要注意本地部署的 `dify` 是没有插件的，去使用前，需要到社区版先下载插件到本地，再通过本地加载的方式安装插件