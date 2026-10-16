# 技术文档作品集

在线访问：<https://yjhiahiahia.github.io/my-docs-site/>

本站使用静态网站生成器 [Docusaurus](https://docusaurus.io/) 搭建，收录 IoT 概念说明、平台接入指南和 API 文档，以及建站、文档质量评估和日常维护的记录。

## 安装依赖

```bash
yarn
```

## 本地预览

```bash
yarn start
```

运行后会启动本地开发服务器并打开浏览器。大多数修改保存后即可在页面中看到，无需重启服务器。

## 构建站点

```bash
yarn build
```

构建结果保存在 `build` 目录中，可以部署到静态网站托管服务。

## 部署

通过 SSH 部署：

```bash
USE_SSH=true yarn deploy
```

不使用 SSH 时，指定 GitHub 用户名：

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

使用 GitHub Pages 托管时，部署命令会构建站点，并将结果推送到 `gh-pages` 分支。
