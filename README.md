# fffop.github.io

这是 `fffop` 的长期个人 log 站点，使用 GitHub Pages 发布。

站点地址：

`https://fffop.github.io/`

## 当前结构

- `index.html`：主页内容与各个模块结构
- `styles.css`：页面视觉、排版和响应式样式
- `script.js`：年份更新与滚动显现效果
- `.nojekyll`：确保静态文件按原样发布

## 后续怎么维护

1. 直接修改 `index.html` 里的日志、项目和联系信息
2. 如果要调整视觉效果，修改 `styles.css`
3. 提交后推送到 `main`
4. GitHub Pages 会自动更新线上页面

## Markdown 发文方式

现在不需要手写文章 HTML。

最简单的方法有两种：

### 方法 1：手动新增

1. 在 `posts/` 目录里新建一个 `.md` 文件
2. 打开 `posts/manifest.json`，补一条文章信息
3. 执行：

```powershell
git add .
git commit -m "publish new post"
git push
```

推送后，GitHub Pages 会自动把新文章发布到线上。

### 方法 2：用脚本自动生成

```powershell
.\scripts\new-post.ps1 -Title "你的文章标题"
```

它会自动：

- 创建一篇新的 Markdown 文件
- 把文章登记到 `posts/manifest.json`

然后你只需要补正文、改一下摘要和标签，再执行 `git add .`、`git commit`、`git push`。

## 内容建议

- 把“最近更新”区改成你真实的周报或开发记录
- 把“项目轨迹”区替换成你自己的项目卡片
- 保留示例时间线，持续往上追加最新一条
