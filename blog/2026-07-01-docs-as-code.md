---
slug: docs-as-code
title: Docs as Code：这个站点是怎么搭的
authors: [yjh]
tags: [docs-as-code, docusaurus, ai]
---

这篇文章写的是我从零搭建这个文档站的全过程，包括为什么要搭、技术方案怎么选的、搭的时候碰到了哪些问题。站点本身就算是一次 Docs as Code 的落地实践。

{/* truncate */}

## 背景

面试的时候经常被问到"有没有作品集"。但技术写作不像设计岗可以直接放 Dribbble 链接。

之前我试过几种办法，效果都一般：

- Word/PDF 发过去，现在技术文档很少用这几种文件类型，会显得不专业。
- 语雀、飞书的在线文档，需要账号并开通权限，而且光看文档本身也体现不出工程能力。
- GitHub README 太单薄了，放不下好几篇有结构的长文档。

最后决定仿照现在负责的平台文档搭建文档站点。一来可以放作品，二来搭建这事本身就能证明我会用工程化的方式管理文档。

## Docs as Code 是什么

一句话概括：把文档当代码来管。

| 维度 | 传统做法 | Docs as Code |
| --- | --- | --- |
| 编写 | Word / Confluence | Markdown + 编辑器 |
| 版本管理 | 手动备份 v1/v2/最终版/最最终版 | Git |
| 发布 | 手动导出再上传 | CI/CD 自动部署 |
| 多人协作 | 文件来回传 | PR 评审 |
| 质量管控 | 靠人肉检查 | Lint 自动检测 |

这套方法在国外技术写作团队已经很普遍了，国内用的还不多。我在 IoT 平台的时候，文档站在我入职前就搭好了，我日常做的主要是内容维护，没机会从零参与搭建。正好借这个个人项目，自己把从选型到部署的完整流程跑一遍。

## 技术选型

市面上做文档站的工具挺多的，简单调研了一下：

| 方案 | 我的判断 |
| --- | --- |
| [VitePress](https://vitepress.dev/) | 比较轻量，但功能偏少，更适合给单个开源项目写文档。 |
| [GitBook](https://www.gitbook.com/) | 上手简单，但免费版各种限制，不够灵活。 |
| [MkDocs](https://www.mkdocs.org/) | 我平时不写 python，所以也 pass。 |
| [Docusaurus](https://docusaurus.io/) | 功能齐全，React 生态，开箱即用。 |

最后定了 Docusaurus，理由：

1. 支持 MDX，Markdown 里能嵌 React 组件，以后想加交互内容比较方便。
2. 侧边栏是根据文件目录自动生成的，不用手动维护一份导航配置。
3. 官方有 Mermaid 插件，画流程图、架构图很方便。
4. 可以直接部署到 GitHub Pages，免费。

## 搭建过程

### 先规划目录结构

动手写内容之前，我先把信息架构想好了。主要按能力维度来组织：

```text
docs/
├── intro.md              # 首页导览，进来就知道该看啥
├── doc-projects/         # 文档作品，体现写作能力
│   ├── api-docs.md
│   ├── iot-overview.md
│   ├── iot-platform-guide.md
│   └── doc-score/        # 文档评分体系
├── product-thinking/     # 产品思维，体现思考深度
│   ├── docs-as-code.md
│   └── competitor-analysis.md
└── skills/               # 技能展示
    └── mermaid.md
```

首页我没放自我介绍，直接写的是"如果你是面试官，建议先看哪个板块"。来了就能找到路，别让人自己猜。

### 核心配置

```typescript
// docusaurus.config.ts
const config: Config = {
  title: 'S-Tier Lamb',
  tagline: '要像建设新中国一样建设自己！',
  url: 'https://yjhiahiahia.github.io',
  baseUrl: '/my-docs-site/',
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
};
```

### 加 Lint

文档也得有格式规范。我装了 markdownlint-cli2，本地随时能跑：

```bash
npm run lint
```

规则按中文文档的习惯调过了，比如标题不能跳级、列表格式要统一这些。从第一天就开始用，免得后面欠一屁股技术债再统一改。

### 部署

用 GitHub Actions 自动部署，流程很短：

```mermaid
graph LR
    A[本地写好 Markdown] --> B[git push]
    B --> C[Actions 自动构建]
    C --> D[部署到 GitHub Pages]
```

代码一推就上线，不用手动搞。

## AI Coding 的用法

这个站点从搭建到样式调整，我大量用了 AI Coding 工具。说白了就是我负责想和决定，AI 负责写代码和干活。

具体哪些地方用了：

- **项目搭建**：脚手架、各种配置文件、GitHub Actions 工作流，这些让 AI 生成的。自己写也能写，但太耗时间了，不如把精力花在内容和架构设计上。
- **页面和样式**：首页布局、CSS 定制、暗色模式适配这些，基本都是我描述需求然后让 AI 写。我又不是前端，手撸 React 组件效率太低了。

我对 AI Coding 的看法是：它替代不了思考，但能替代大量重复劳动。这个站点里面，目录结构怎么规划、内容写什么、给谁看——这些是我拍的板。CSS 怎么写、配置项怎么填、组件怎么拼，交给 AI 就行了。

技术写作这行也是一样。以后写文档的效率肯定越来越高，但"该写什么"和"给谁看"，还是得靠人来想。

## 踩过的坑

1. **文件名千万别用中文。** 路径里有中文字符会被 URL 编码，链接巨丑不说，有时候还会出兼容问题。后来我全部改成英文了。
2. **侧边栏排序。** 默认按字母排，想自己定顺序得在每个文件头部加 `sidebar_position`。一开始不知道有这个东西，调了半天没搞明白。
3. **Mermaid 暗色模式。** 图表在深色主题下文字看不清，得在 themeConfig 里单独配一下颜色。

## 当前状态和后续计划

站点现在已经能正常访问了，内容在陆续补充中。接下来打算做的：

- 接 Vale 做中文文风检查。
- 加 Algolia DocSearch，内容多了之后方便检索。
- CI 里加个链接检查，防止出现死链。

## 小结

搭这个站点前后花的时间不算长，但整个过程让我把 Docs as Code 的流程从头到尾走了一遍。最大的体会就是：先把信息架构想明白再动手写东西，比边写边改省事太多了。

你现在能看到这篇文章，说明整套自动部署已经在正常跑了。
