# killlax

## 项目定位

这是一个面向所有人的个人博客，记录摄影、滑板、AI、二次元和 RoboMaster 机械相关内容。

个人简介：这里是 killlax。

## 第一版范围

- 首页
- 文章列表页
- 文章详情页
- 关于页
- Markdown 写作

图片展示功能后续添加。第一版暂不实现后台 CMS、评论、用户系统、复杂社区模块或其他扩展内容。

## 视觉方向

- 深色主题
- 主色：火焰将要熄灭时的暗红色，参考《黑暗之魂》系列的氛围
- 页面以文字和留白为主，保持克制、沉浸、易读
- 参考项目：[VermilionVoid](https://github.com/Lapis0x0/VermilionVoid)

## 技术栈

使用 Astro + TypeScript + Markdown + 原生 CSS，采用静态生成，后续部署到 Cloudflare Pages、Vercel 或 GitHub Pages。

## 本地开发

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

默认地址为 `http://127.0.0.1:4321/`；如端口已占用，以终端实际输出的地址为准。
首页使用已确认的固定 Matrix 篝火背景：图片基础亮度 80%、呼吸和漂浮灰烬。文章、列表与关于页保持静态阅读布局。

## 页面 URL

```text
/                 首页
/blog/            文章列表
/blog/文章-slug/  文章详情
/about/           关于
```

## 写作流程

文章保存在 `src/content/posts/`，使用英文小写、数字和短横线命名；文件名会直接成为 URL slug，发布后尽量保持不变。

新建草稿：

```sh
npm run new-post -- photo-walk --title "一次摄影记录" --tag "摄影"
```

命令不会覆盖已有文件，默认使用上海时区的当天日期并设置 `draft: true`。可用 `--date 2026-10-09` 指定日期，用 `--description "一句话摘要"` 填写摘要，多次使用 `--tag` 添加标签。

文章 frontmatter：

```md
---
title: 文章标题
description: 一句话摘要，会显示在列表页和分享信息中。
published: 2026-10-09
updated: 2026-10-10
tags:
  - 摄影
draft: false
---
```

`updated` 可选，仅在实质更新文章后填写。标题、摘要、发布日期必填；标签默认为空数组，`draft` 默认为 `false`，所以新稿请显式设置 `draft: true`。

完成正文、摘要与日期核对后，将 `draft` 改为 `false`，再运行 `npm run build`，检查内容 schema 和全部静态输出。草稿不会生成文章页面，也不会进入首页、文章列表、RSS 或 sitemap；需要在浏览器检查排版时，可暂时在本地设为 `false`，检查完后恢复。

首篇真实文章方向已确定为摄影。提纲位于 `src/content/posts/first-photography.md`，尚待补充实际照片或拍摄笔记；目前公开内容仍只有示例文章。

## 发布基础设施

- `/rss.xml`：由 `@astrojs/rss` 生成，包含公开文章摘要和标签，页脚提供订阅入口。
- `/sitemap-index.xml` 和 `/sitemap-0.xml`：由 `@astrojs/sitemap` 根据实际构建页面自动生成。
- `/robots.txt`：允许抓取并声明 sitemap 地址。
- 页面自动生成 canonical、Open Graph、Twitter Card 和 favicon 元数据。

部署前通过构建环境变量 `PUBLIC_SITE_URL` 设置真实站点根地址，例如：

```sh
PUBLIC_SITE_URL=https://example.com npm run build
```

未设置时使用 `https://killlax.example` 作为本地开发占位地址。canonical、RSS、sitemap 和 robots 会一起采用配置地址。当前使用根路径部署，GitHub Pages 的仓库子路径部署需要另行配置 `base`。

`/flame-preview/` 与 `/code-rain/` 保留为本地实验页面，设置 `noindex` 且排除在 sitemap 外；它们仍会参与构建，上线前决定是否保留。`noindex` 不是访问限制。

## 当前进度

本轮工作记录见 [项目进度](docs/project-progress.md)。正式部署前仍需要真实摄影内容、实际托管地址，以及背景素材的使用许可确认或替换。
