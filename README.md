# Embodied AI Notes

This repository is a static GitHub Pages site styled like a personal growth blog.

The site is not meant to be only an online resume. It is organized as a long-term blog platform for:

- embodied AI notes
- robotics demos
- paper reading
- project logs
- engineering/debug notes
- personal growth records

## Structure

- `index.html`: home page layout and built-in modules
- `post.html`: Markdown post detail page
- `styles.css`: Stack-like visual style and responsive layout
- `script.js`: theme toggle, search/filter widgets, blog loading, Markdown rendering
- `posts/manifest.json`: blog post index
- `posts/*.md`: blog post Markdown files
- `scripts/new-post.ps1`: local publishing helper
- `assets/`: resume, demo GIFs, videos, and other static media

## Publish A Post

Run this from the repository root:

```powershell
.\scripts\new-post.ps1 -Title "My New Note" -Category "Growth" -Tags "VLA,Log" -Summary "Short summary here."
```

Then edit the generated Markdown file in `posts/`, commit, and push:

```powershell
git add posts/manifest.json posts/*.md
git commit -m "publish new post"
git push
```

GitHub Pages will update the site after the push.

## Static Site Limitation

GitHub Pages has no backend by default, so the website cannot accept a real browser-side upload without an external service. The publishing interface here is the static-site workflow:

`new-post.ps1` -> `posts/*.md` -> `posts/manifest.json` -> `git push`
