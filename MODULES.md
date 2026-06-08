# Modules

The site follows a Stack-like personal blog layout.

## Left Sidebar

Edit in `index.html`:

- site title
- subtitle
- GitHub / CV / Email / Blog links
- navigation labels
- footer text

## Main Modules

Edit built-in home modules in `index.html`:

- `#about`: site introduction
- `#embodied-ai`: embodied AI focus and capability notes
- `#demos`: GIF preview and MP4 demo link
- `#blog`: dynamic blog list loaded from `posts/manifest.json`

## Right Sidebar Widgets

Generated in `script.js` from Markdown blog posts:

- Archives
- Tags from `posts/manifest.json`

The search box works on the active module. Right-sidebar archive and tag chips jump to the Blog module and filter Markdown posts only.

## Blog Publishing Interface

The publish interface is:

- `scripts/new-post.ps1`
- `posts/manifest.json`
- `posts/*.md`
- `post.html`

Static GitHub Pages cannot receive uploads from the browser without a backend. The intended workflow is to generate a Markdown post locally, then push to GitHub.

## Styling

Edit `styles.css` for:

- Stack-like layout
- cards
- sidebars
- dark mode
- mobile responsive behavior
- Markdown post detail styling
