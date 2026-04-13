# 模块修改说明

这个站目前没有网页后台上传入口。

最直接的方式就是改对应文件，然后执行：

```powershell
git add .
git commit -m "update content"
git push
```

## 1. 首页大标题 Hero

- 文件：`index.html`
- 位置：页面最上方 `FFFOP.EXE`
- 适合写：你的介绍、主页标题、首页按钮文字

## 2. 状态栏 Status

- 文件：`index.html`
- 位置：`STATUS.DAT`
- 适合写：你现在在做什么、当前主题、最近更新

## 3. About 模块

- 文件：`index.html`
- 位置：`#about`
- 适合写：你是谁、你关注什么、你想让别人先了解什么

## 4. Logs 模块

- 文件：`index.html`
- 位置：`#logs`
- 适合写：周报、开发进度、阶段总结、读书笔记

如果你想快速更新一条短日志，直接改这里最方便。

## 5. Projects 模块

- 文件：`index.html`
- 位置：`#projects`
- 适合写：项目标题、项目描述、仓库链接、演示链接

## 6. Blog 模块

- 文章正文文件：`posts/*.md`
- 文章清单：`posts/manifest.json`
- 渲染页面：`post.html`
- 自动建文脚本：`scripts/new-post.ps1`

最简单的方法：

```powershell
.\scripts\new-post.ps1 -Title "你的文章标题"
```

然后：

1. 打开新生成的 `posts/*.md`
2. 写正文
3. 打开 `posts/manifest.json`
4. 改摘要和标签
5. `git add .`
6. `git commit -m "publish new post"`
7. `git push`

## 7. Contact 模块

- 文件：`index.html`
- 位置：`#contact`
- 适合写：邮箱、GitHub、社交链接、联系方式

## 8. 整体样式

- 文件：`styles.css`

如果你要改：

- 鼠标样式
- Win98 主题颜色
- 按钮样式
- 窗口外观

都在这个文件里。

## 9. 最常用的改法

如果你只是想快速更新主页内容：

- 改 `index.html`

如果你只是想发文章：

- 运行 `.\scripts\new-post.ps1 -Title "标题"`

如果你想改外观：

- 改 `styles.css`
