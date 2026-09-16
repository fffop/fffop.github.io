# 尹浩 · 个人学术主页

单文件纯静态，无构建工具、无外部 CSS/JS。版式参考 [tairanhe.com](https://tairanhe.com/)。

```
index.html              # 页面 + 样式 + 脚本，全在这一个文件里
static/images/
  photo.jpg             # 页面在用的合影（460×460 方形裁剪）
  photo-full.jpg        # 完整原图（1842×1279），备用 / 重裁用
old-card-style/         # 上一版卡片风格的备份（index.html + styles.css + script.js）
```

## 本地预览

```bash
python3 -m http.server 8000
```

## 部署到 GitHub Pages

1. 新建仓库，名字必须是 `你的用户名.github.io`
2. 把 `index.html` 和 `static/` 推上去（`old-card-style/` 可以不推）
3. 仓库 Settings → Pages → Source 选 `main` 分支根目录
4. 几分钟后访问 `https://你的用户名.github.io`

## 内容现状

已全部填好，无待补占位符：

- GitHub：`github.com/fffop`
- 实习：费米机器人，2026.02 – 至今
- 论文 DOI：`10.23919/PIERS-Fall62445.2025.11394068`（解析到 IEEE Xplore 11394068，已验证）

## 版式说明

照搬了 tairanhe.com 的几个关键量：

| 项 | 值 |
|---|---|
| 字体 | Titillium Web（Google Fonts），16px |
| 正文栏宽 | 900px 居中 |
| 姓名 | 38px / 400 / 居中 |
| 区块标题 | 22px / 600 / 左对齐 |
| 链接色 | `#1772d0`，无下划线 |
| 照片 | 215×215，15px 圆角，无阴影无描边 |

相比上一版去掉了：导航栏、暗色模式、卡片和阴影、滚动动效、Font Awesome 图标。
保留了中英切换——做成顶部链接行里的一个纯文字链接（`中文` / `English`），偏好存 localStorage。

想改样式，全部在 `index.html` 顶部的 `<style>` 块里。

## 关于照片

原图是微信里那张自拍，**保持你发来的原始方向**（前置摄像头镜像，`INOVANCE`、`FMC³ ROBOTICS`、`自动模式` 是反的）。之前翻转过一版，按你要求已经镜像回去了。

- 调大小 → `.photo` 的 `width` / `height`
- 想变回圆形 → `border-radius` 改成 `50%`
- 原图背景是纯黑抠图，所以给了 `background: #000`；换普通背景的照片时删掉这行
- 想重新裁剪 → 从 `photo-full.jpg` 裁，别从 `photo.jpg` 二次裁

## 内容结构

`index.html` 里按 `<!-- ===== 区块名 ===== -->` 注释分段：
简介 / News / Research / Experience / Skills / Awards。

**中英双语**：每处文案是一对 span，靠 CSS 的 `html[data-lang]` 控制显隐。

```html
<span class="lang-en">English text</span><span class="lang-zh">中文文案</span>
```

**加条目**：整块复制对应的 `.news div` / `.entry` / `.skill` 即可。

## 模板来源

内容结构最初取自 [yueyin27.github.io](https://yueyin27.github.io/)，当前版式参考 [tairanhe.com](https://tairanhe.com/)。现在的 `index.html` 是重写的，CSS 按参考站的视觉量值另写，未拷贝对方代码；`old-card-style/` 里的 `styles.css` / `script.js` 仍是 yueyin27 原仓库的文件。

⚠️ 两个参考站都没有 LICENSE。如果最终用回 `old-card-style/` 那一版（直接用了对方的 CSS/JS），公开发布前建议在页脚注明来源或先知会原作者。当前这版不涉及这个问题。
