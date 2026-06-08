# Usage

## Add A Blog Post

Use the local helper script:

```powershell
.\scripts\new-post.ps1 -Title "Title Here" -Category "Growth" -Tags "VLA,Debug" -Summary "One sentence summary."
```

The script creates:

- a Markdown file in `posts/`
- a new record in `posts/manifest.json`

After that:

1. Edit the generated Markdown file.
2. Adjust `summary`, `category`, or `tags` in `posts/manifest.json` if needed.
3. Commit and push.

```powershell
git add posts/manifest.json posts/*.md
git commit -m "publish new post"
git push
```

## Manifest Format

Each post entry should look like this:

```json
{
  "slug": "2026-06-08-my-note",
  "title": "My Note",
  "date": "2026.06.08",
  "category": "Growth",
  "summary": "Short summary shown on the home page.",
  "tags": ["VLA", "Log"],
  "readingTime": "1 minute read",
  "file": "posts/2026-06-08-my-note.md"
}
```

## Markdown Support

The built-in renderer supports:

- headings
- paragraphs
- bullet and numbered lists
- links
- inline code
- fenced code blocks
- blockquotes

## Demo Assets

Put demo media under `assets/demos/`.

Current demo files:

- `assets/demos/robot-demo-01.gif`: home page GIF preview
- `assets/demos/robot-demo-01-h264.mp4`: full video linked from the GIF

## Local Preview

Run:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8000/
```
