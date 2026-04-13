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

## 怎么发一篇新博客

1. 复制 `posts/2026-04-13-first-log.html`
2. 改成新的文件名，例如 `posts/2026-04-20-my-second-post.html`
3. 修改文章标题、日期和正文
4. 回到 `index.html` 的“文章入口”区域，加一个新的文章卡片并链接到新文件
5. 执行：

```powershell
git add .
git commit -m "publish new post"
git push
```

推送后，GitHub Pages 会自动把新文章发布到线上。

## 内容建议

- 把“最近更新”区改成你真实的周报或开发记录
- 把“项目轨迹”区替换成你自己的项目卡片
- 保留示例时间线，持续往上追加最新一条
