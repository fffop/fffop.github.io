# 使用方法

这个站点现在已经改成了适合写 Markdown 的形式。

## 文章放在哪里

- Markdown 文件放在 `posts/`
- 文章清单放在 `posts/manifest.json`
- 文章渲染页是 `post.html`
- 新建文章脚本是 `scripts/new-post.ps1`

## 最简单的发文方法

在项目根目录执行：

```powershell
.\scripts\new-post.ps1 -Title "你的文章标题"
```

执行后会自动做两件事：

1. 在 `posts/` 里生成一篇新的 `.md`
2. 在 `posts/manifest.json` 里自动添加一条文章记录

然后你要做的事只有这些：

1. 打开新生成的 `.md` 文件
2. 写正文
3. 打开 `posts/manifest.json`
4. 把这篇文章的 `summary` 和 `tags` 改成你自己的内容
5. 提交并推送

```powershell
git add .
git commit -m "publish new post"
git push
```

推送后，GitHub Pages 会自动更新站点。

## 如果你想手动新增文章

1. 在 `posts/` 里新建一个 Markdown 文件
2. 在 `posts/manifest.json` 里新增一条记录

格式如下：

```json
{
  "slug": "2026-04-20-my-post",
  "title": "文章标题",
  "date": "2026.04.20",
  "summary": "这里写文章摘要。",
  "tags": ["Tag1", "Tag2"],
  "file": "posts/2026-04-20-my-post.md"
}
```

然后再执行：

```powershell
git add .
git commit -m "publish new post"
git push
```

## Markdown 写作建议

- 一级标题用 `# 标题`
- 二级标题用 `## 标题`
- 列表直接用 `- 项目`
- 代码用反引号或代码块
- 链接写成 `[名字](链接)`

## 以后你最常用的文件

- `index.html`：主页内容
- `posts/manifest.json`：文章列表
- `posts/*.md`：文章正文
- `styles.css`：样式
