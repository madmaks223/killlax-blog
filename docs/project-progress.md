# killlax 项目进度

更新日期：2026-10-11。

## 本轮依据

- 交接文档：`/Users/lianlinxian/Desktop/个人博客/博客网站test1.md`。
- 已核对项目开发、背景确认和最初框架讨论的历史对话。
- 博客名称为 `killlax`，包含三个连续的 `l`。
- 当前背景方案保留：第一版 Matrix 数据流 + 暖色篝火图片，80% 基础亮度、呼吸与灰烬，固定在视口。

## 本轮完成

- RSS 使用 `@astrojs/rss` 生成，包含公开文章摘要与标签；页脚提供订阅入口。
- sitemap 使用 `@astrojs/sitemap` 从实际静态页面生成，入口为 `/sitemap-index.xml`。
- 新增 `/robots.txt`、网站图标、canonical、Open Graph 和 Twitter 分享元数据。
- 文章页使用 `article` 类型并输出发布日期；首页、关于页与文章列表使用 `website` 类型。
- 内容模型支持可选的 `updated` 日期，文章页展示更新时间。
- 页面日期固定按 UTC 格式化，避免同一个 Markdown 日期在不同时区的构建机器上显示成前一天。
- `/code-rain/` 与 `/flame-preview/` 保留，设置 `noindex` 并排除在 sitemap 外；它们仍参与静态构建。
- 支持通过构建环境变量 `PUBLIC_SITE_URL` 统一设置公开地址。
- 新增 `npm run new-post -- <slug> --title "标题" --tag "摄影"`，默认新建草稿、使用上海当天日期、防止覆盖已有文章。
- README 更新本地启动、文章命名、frontmatter、草稿和发布流程。
- 保存本地 Git 初始版本，包含项目源码、当前内容与已确认的背景实现。
- 内容模型支持可选 `cover`、`coverAlt`；文章列表和正文具备响应式图片样式。
- 文章列表生成标签索引，并提供 `/blog/tags/标签/` 静态标签页。

## 内容状态

用户已确定首篇真实文章为摄影记录。

`src/content/posts/first-photography.md` 仍是待填写提纲，`draft: true`。另外加入了明确标注为临时测试用途的 `photo-test.md`，用于检查封面、正文图片、图注和标签页；它不代表真实摄影经历。

草稿不会生成详情页面，也不会出现在首页、文章列表、RSS 或 sitemap 中。完成内容后核对发布日期、摘要和标签，再将 `draft` 改为 `false`。

## 验证

- Astro 类型检查和静态构建通过：0 errors / 0 warnings / 0 hints，生成 10 个页面（包含公开文章和标签页）。
- 自定义测试域名构建通过，canonical、RSS、sitemap 和 robots 使用同一配置地址；之后恢复默认占位地址构建。
- 浏览器 XML 解析验证 RSS、sitemap index 与 sitemap 内容有效。
- RSS 仅包含公开示例文章；sitemap 仅包含首页、列表、关于与公开文章。
- 验证草稿没有静态输出，预览页面不在 sitemap 中。
- 新建文章命令验证引号与多行摘要、重复文件保护、无效路径、日期与缺失标题处理。
- Playwright 检查 1440×900 与 390×844：首页、列表、文章、关于页面可访问，没有横向溢出或浏览器运行时错误。
- 首页 Canvas 非空、滚动前后背景坐标不变、基础亮度为 80%、减少动态效果时灰烬停止。
- 已查看桌面与手机截图。
- 图片功能测试文章已通过浏览器检查：封面、正文图片、图注、分享图片和摄影标签页均可用。
- 已加入 GitHub Pages 工作流；仓库 Settings → Pages 选择 GitHub Actions 后，推送 `main` 会自动部署到 `https://madmaks223.github.io/killlax-blog/`。
- 已处理 `/killlax-blog/` 子路径下的导航、静态资源、Markdown 与 HTML 图片、分享元数据、RSS 和 sitemap；本地开发仍使用根路径。
- 用户已明确同意公开仓库，`madmaks223/killlax-blog` 已改为 public，Pages 发布来源为 GitHub Actions。
- 首次线上部署成功，公开地址为 `https://madmaks223.github.io/killlax-blog/`。已在浏览器确认首页背景、摄影文章和全部三张文章图片正常加载，没有横向溢出。
- 首次成功部署记录：`https://github.com/madmaks223/killlax-blog/actions/runs/38117310251`（第二次运行）。本地和 Pages 构建均已通过，Pages 输出中检查了 98 条内部链接和资源路径。

## 日常操作说明

已新增 `docs/site-operations.md`：包含开发服务器启动/状态/日志/停止、文章创建/预览/发布/删除、图片管理、页面文件对应关系、浏览器调试与 Git 保存/误删后查看历史的方法。手册区分本地输出与正式互联网部署；没有修改或删除当前文章。

本地入口：`http://127.0.0.1:4321/`。

公开入口：`https://madmaks223.github.io/killlax-blog/`。以后新增、更新、隐藏或删除文章，先本地检查，再 commit 和 `git push`；GitHub Actions 部署成功后线上生效。网站由 GitHub 托管，关闭本地开发服务器或电脑不影响公开访问。

## 下一步

1. 使用用户提供的照片或拍摄笔记整理第一篇真实摄影记录，替换或删除 `photo-test.md`，并放入 `public/images/` 后填写封面和正文图片路径。
2. 如需修改关于页，补充用户希望公开的真实个人信息。
3. 后续推送后查看 GitHub Actions 是否成功；当前已完成首次上线，无需重复配置 Pages。
4. 处理交接文档已列出的背景素材许可或替换事项，决定实验页是否继续参与构建。

当前不需要购买 VPS。默认地址 `https://killlax.example` 只用于本地开发；正式构建必须设置实际 `PUBLIC_SITE_URL`。
