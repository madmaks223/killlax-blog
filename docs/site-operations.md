# killlax 网站操作手册

这份手册对应当前项目，不需要后台账号。文章是 Markdown 文件，改文件就是改网站内容；浏览器负责查看效果。

项目目录：

~~~text
/Users/lianlinxian/Documents/ChatGPT/开往personal blog web
~~~

## 1. 在哪里操作

可以在 Finder 中进入项目目录，用 VS Code 等文本编辑器打开整个项目。不要使用 Word 编辑代码或 Markdown；编辑器保存后，正在运行的本地网站会自动更新。

Mac 打开“终端”，先进入项目目录：

~~~sh
cd "/Users/lianlinxian/Documents/ChatGPT/开往personal blog web"
~~~

后面的命令都在这个目录运行。终端负责启动、检查和保存版本；编辑器负责写正文和修改样式。

## 2. 启动、停止和重启

启动本地网站：

~~~sh
npm run dev -- --host 127.0.0.1
~~~

打开终端给出的地址，通常是 http://127.0.0.1:4321/ 。如果用了其他端口，以实际输出为准。127.0.0.1 是本机地址，别人不能通过这个地址访问你的电脑。

当前 Astro 版本支持：

~~~sh
npm run dev -- status
npm run dev -- logs
npm run dev -- stop
~~~

依次表示查看运行状态、查看日志、停止本项目的后台开发服务器。前台运行的服务器可以在对应终端按 Control+C 停止；如果命令提示已经有服务器运行，不需要重复启动。

重启时，先运行 stop 命令，再运行启动命令。仅修改正文和样式时，通常保存文件就能更新，不需要重启。

只有新电脑或缺少依赖时才需要：

~~~sh
npm ci
~~~

## 3. 最容易上手的练习

打开 src/content/posts/photo-test.md ，将 title 改成“我的第一篇测试文章”，保存，再刷新：

http://127.0.0.1:4321/blog/photo-test/

标题应更新，网址仍然不变。文件名 photo-test 才决定网址，标题可以使用中文。

接着把 draft: false 改为 draft: true，保存。文章会从首页、列表、标签页消失，详情地址会变成 404。改回 false 后恢复。

这里只是在教你操作，手册的创建没有修改或删除当前测试文章。

## 4. 新建文章和写 Markdown

~~~sh
npm run new-post -- night-walk --title "夜晚散步" --description "记录街道上的光线" --tag "摄影"
~~~

这会创建 src/content/posts/night-walk.md，默认是草稿。night-walk 是 slug，也就是网址中的名字；使用英文小写、数字和短横线。命令不会覆盖已有文章，可以重复传入 --tag。日期默认使用上海当天日期，也可以用 --date 2026-10-09 指定。

用编辑器打开该文件。顶部两条 --- 之间是文章信息，正文写在第二条 --- 之后：

~~~md
---
title: "夜晚散步"
description: "记录街道上的光线"
published: 2026-10-09
tags:
  - 摄影
draft: true
---

这里写正文。

## 一个小标题

这里再写一段。

![街道灯光的描述](/images/night-walk.webp)
~~~

正文中：## 是二级标题，**文字** 是加粗，[文字](网址) 是链接，空一行开始新段落。顶部信息中的缩进使用空格，tags 的每个标签前面要有短横线。

必填：title、description、published。可选：updated、cover、coverAlt、tags。显式保留 draft，避免误把未完成文章加入输出。

## 5. 添加照片和封面

把照片放到 public/images/ 。例如文件：

~~~text
public/images/night-walk.webp
~~~

封面和正文图片都使用 /images/night-walk.webp，构建时页面会自动加入 GitHub Pages 的站点前缀。路径中不要写 public。使用英文文件名，优先压缩成 WebP/AVIF；不要只改扩展名，必须实际转换格式。

在文章顶部信息加入封面：

~~~yaml
cover: /images/night-walk.webp
coverAlt: 夜晚街道上的路灯与行人
~~~

封面会出现在列表、详情和分享信息中；列表用 16:9 裁切，详情保持完整比例。不需要封面就省略这两个字段。

正文直接使用 Markdown 图片语法；有图注时可以使用：

~~~html
<figure>
  <img src="/images/night-walk.webp" alt="夜晚街道上的路灯与行人" width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>这张照片的地点或说明。</figcaption>
</figure>
~~~

宽高要填写照片的实际尺寸。alt 描述图片内容，figcaption 是可见图注。

## 6. 发表和更新文章

1. 写完正文、摘要并核对日期。
2. 将 draft 改为 false。
3. 在本地打开 /blog/night-walk/，检查图片、文字和手机布局。
4. 运行 npm run build，确认整个命令成功完成。
5. 保存 Git 版本。
6. 运行 git push，等待 GitHub Actions 部署成功，再检查公开网址。

~~~sh
npm run build
git status --short
git add -- src/content/posts/night-walk.md public/images/night-walk.webp
git diff --cached
git commit -m "Add night walk article"
git push
~~~

没有图片时，git add 只写文章路径。提交前检查暂存差异是否仅包含这次需要保存的内容。

当前已连接远程仓库 https://github.com/madmaks223/killlax-blog ，并配置 GitHub Pages 自动部署。首次发布需要先在仓库 Settings → Pages 选择 GitHub Actions；免费个人套餐需要公开仓库才能启用 Pages。推送后在 Actions 查看 Deploy Astro site to GitHub Pages，部署成功后访问 https://madmaks223.github.io/killlax-blog/ 。本地保存和 commit 不会自动更新线上，必须 git push 且部署成功。

公开仓库中的 Markdown 草稿、图片和提交历史也可被查看；draft: true 只是不生成文章页面。

更新已有文章时编辑原文件即可，尽量不要改文件名；可添加 updated: 2026-10-10（用实际更新日期）。构建成功后，提交这次改动。

注意：目前不会按照日期延迟发表。即使 published 写了未来日期，只要 draft 是 false，文章仍会进入输出。

## 7. 隐藏和删除

### 暂时隐藏

把 draft 改为 true，再构建、提交并 git push。Markdown 和图片仍留在项目中，可以随时改回 false。

隐藏文章不会删除 public/images/ 中的图片；部署后，只要图片文件还保留，它的直接地址仍可能访问。draft 不适合保存需要保密的内容。

### 删除文章

在 Finder 或编辑器中把对应 Markdown 移到废纸篓。删除后运行：

~~~sh
npm run build
git status --short
git add -A
git diff --cached
git commit -m "Remove night walk article"
git push
~~~

git add 也会记录已删除文件。仅删除某篇文章，不要改页面路由文件。文章列表、首页、标签页、RSS 和 sitemap 在重新构建时自动更新。

要删除当前测试文章，只需删除 src/content/posts/photo-test.md。随后确认其他文章未引用，再决定是否删除 public/images/photo-test-cover.svg 和 photo-test-detail.svg。不需要立即删除图片。

部署后旧文章地址会变成 404。删除本地文件不代表线上立刻消失，还需要更新部署；已被搜索引擎收录或读者保存的副本不会随本地删除消失。

### 误删后怎么办

先看 git status --short，不要继续提交。以前提交过的正文可只读查看：

~~~sh
git log --oneline -- src/content/posts/night-walk.md
git show HEAD:src/content/posts/night-walk.md
~~~

HEAD 只显示最近一次提交时的文件；已经提交删除后，要选删除之前的提交编号查看。未提交的新文件主要依靠编辑器撤销、废纸篓或备份恢复。不要用 git reset --hard 清理报错，它可能丢掉其他修改。

## 8. 网站各部分在哪里改

| 想改什么 | 文件 |
| --- | --- |
| 文章正文、日期、标签、封面 | src/content/posts/对应文章.md |
| 首页介绍和最近文章结构 | src/pages/index.astro |
| 关于页简介 | src/pages/about.astro |
| 网站名称、作者、默认描述 | src/config.ts |
| 公共导航、页脚、分享元数据 | src/layouts/BaseLayout.astro |
| 文章详情结构 | src/pages/blog/[...slug].astro |
| 字号、颜色、宽度、手机布局 | src/styles/global.css |
| 篝火图层与基础亮度 | src/components/MatrixFlameBackground.astro |
| 数据流、灰烬、呼吸动画 | src/scripts/matrix-flame.ts |

背景预览地址是 /flame-preview/。预览页滑杆只临时调整当前页面，不会把值保存进首页。永久修改需要编辑背景组件；当前确认的基础亮度是 .8。

不要编辑 dist/ 和 .astro/，它们是构建生成的文件。每次只改一个目标，保存后查看效果，再继续下一项。

## 9. 调试：遇到问题先看什么

### 网页打不开

先运行 npm run dev -- status，确认服务器运行，再核对终端网址。不要把默认端口当成固定不变。

### 文章不出现或详情 404

检查文件是否在 src/content/posts/、扩展名是否为 .md、draft 是否是 true，网址是否对应文件名。当前草稿不能直接在浏览器预览；在本地临时改为 false 检查，完成后改回 true，保持草稿状态。

### 图片不显示

浏览器直接打开 http://127.0.0.1:4321/images/你的图片.webp 。如果是 404，检查路径、文件名大小写、扩展名。npm run build 不保证 public 目录中的手写图片路径都存在，因此还要实际查看页面。

### 类型或内容格式错误

~~~sh
npm run check
~~~

读取终端指出的文件名、行号和错误。常见错误包括 YAML 缩进、日期格式、引号和缺少字段。修复后运行 npm run build。

npm run check 和 npm run build 要顺序执行，不要同时启动多个构建进程，以免争用 Astro 缓存。build 已包含 check；即使类型检查通过，后面的静态页面生成也可能失败，要等整个命令完成。

### 页面能打开，但布局或交互异常

Chrome/Edge 的 Mac 快捷键 Option+Command+I 可打开开发者工具，也可以右键“检查”。浏览器菜单位置随浏览器不同而变化。

- Console：查看红色的 JavaScript 报错；保留第一条及文件位置。
- Network：刷新页面，检查失败请求；404 常是路径问题。
- Elements：检查元素和 CSS，可临时调整样式，刷新后会恢复。
- 手机模拟：切换设备尺寸，检查标题、图片和导航是否溢出。

开发者工具里的 CSS 修改不会自动写回项目，需要到 global.css 等原文件中修改并保存。

### 保存后仍看到旧页面

先刷新、查看开发服务器日志；必要时 stop 后重新启动。只有确认内容缓存问题时才使用：

~~~sh
npm run dev -- stop
npm run dev -- --host 127.0.0.1 --force
~~~

无需手动删文章或整个项目。

## 10. 检查生产构建

~~~sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4322
~~~

打开实际输出的预览地址；这会预览 dist 中的构建结果，编辑源文件后必须重新 build。4322 避免与开发服务器默认端口冲突；如已被占用，换个空闲端口。前台 preview 用 Control+C 停止，后台 preview 用 npm run preview -- stop 停止；它与开发服务器分别管理。

上线前确认 GitHub 仓库的 Settings → Pages → Source 为 GitHub Actions。当前公开地址是 https://madmaks223.github.io/killlax-blog/；如果以后改用自定义域名，再修改工作流中的 PUBLIC_SITE_URL 和 PUBLIC_BASE_PATH。

## 11. 需要协助时给什么信息

提供你修改的文件路径、想实现的效果、实际看到的现象，以及终端或 Console 的第一条错误。这样可以直接定位问题。

日常顺序：写 Markdown → 放图片 → 本地检查 → 设置 draft → build → 查看 Git 差异 → commit → 有托管平台后更新部署。
