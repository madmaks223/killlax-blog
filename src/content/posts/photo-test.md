---
title: 摄影功能测试：光线与取景
description: 一篇用于检查封面、正文图片、图注和标签页的示例摄影文章。
published: 2026-10-09
cover: /images/photo-test-cover.svg
coverAlt: 深色背景中的红色光线和抽象相机轮廓
tags:
  - 摄影
  - 测试
draft: false
---

这是一篇临时测试文章，用来确认博客的图片展示流程是否正常。

## 先看封面

封面会出现在文章列表、文章详情页和分享信息中。之后替换成真实照片时，只需要把 `cover` 改成 `public/images/` 里的图片路径。

![深色背景中的红色光线和抽象相机轮廓](/images/photo-test-cover.svg)

## 正文图片和图注

正文图片会保持完整比例，并在手机屏幕上自动缩小。图注可以补充拍摄地点、时间或照片背后的说明。

<figure>
  <img src="/images/photo-test-detail.svg" alt="抽象的城市夜景测试图片" width="1400" height="930" loading="lazy" decoding="async" />
  <figcaption>测试图注：用一束光确认画面的层次。</figcaption>
</figure>

## 测试完成后

这篇文章可以保留作为模板，也可以在你准备好真实摄影内容后删除。真正发布文章时，沿用相同的 frontmatter 和图片路径规则即可。
