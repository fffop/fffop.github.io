const yearTarget = document.querySelector("#year");
const postManifestPath = "posts/manifest.json";

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const revealSections = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealSections.forEach((section) => {
    observer.observe(section);
  });
} else {
  revealSections.forEach((section) => {
    section.classList.add("is-visible");
  });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderInlineMarkdown(input) {
  const codeStore = [];

  let text = escapeHtml(input).replace(/`([^`]+)`/g, (_, code) => {
    const token = `@@CODE${codeStore.length}@@`;
    codeStore.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  return text.replace(/@@CODE(\d+)@@/g, (_, index) => codeStore[Number(index)]);
}

function renderMarkdown(markdown) {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  const blocks = normalized.split(/\n\s*\n/);

  return blocks
    .map((block) => {
      const trimmed = block.trim();

      if (!trimmed) {
        return "";
      }

      if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
        const lines = trimmed.split("\n");
        const code = lines.slice(1, -1).join("\n");
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
      }

      if (/^#{1,6}\s/.test(trimmed)) {
        const level = trimmed.match(/^#+/)[0].length;
        const content = trimmed.replace(/^#{1,6}\s/, "");
        return `<h${level}>${renderInlineMarkdown(content)}</h${level}>`;
      }

      if (/^>\s/.test(trimmed)) {
        const quote = trimmed
          .split("\n")
          .map((line) => line.replace(/^>\s?/, ""))
          .join("<br>");
        return `<blockquote>${renderInlineMarkdown(quote)}</blockquote>`;
      }

      if (/^[-*]\s/m.test(trimmed) && trimmed.split("\n").every((line) => /^[-*]\s/.test(line))) {
        const items = trimmed
          .split("\n")
          .map((line) => `<li>${renderInlineMarkdown(line.replace(/^[-*]\s/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      if (/^\d+\.\s/m.test(trimmed) && trimmed.split("\n").every((line) => /^\d+\.\s/.test(line))) {
        const items = trimmed
          .split("\n")
          .map((line) => `<li>${renderInlineMarkdown(line.replace(/^\d+\.\s/, ""))}</li>`)
          .join("");
        return `<ol>${items}</ol>`;
      }

      return `<p>${renderInlineMarkdown(trimmed).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

function renderPostTags(tags) {
  return tags.map((tag) => `<span class="label">${tag}</span>`).join("");
}

async function loadManifest() {
  const response = await fetch(postManifestPath);

  if (!response.ok) {
    throw new Error("Failed to load post manifest.");
  }

  return response.json();
}

async function initBlogList() {
  const container = document.querySelector("#blog-post-list");

  if (!container) {
    return;
  }

  try {
    const posts = await loadManifest();

    if (!posts.length) {
      container.innerHTML = `
        <article class="blog-card" data-window-title="POSTS.DIR">
          <p class="paper-tag">Empty</p>
          <h3>还没有发布文章</h3>
          <p>等你写下第一篇 Markdown 并推送后，这里会自动显示文章列表。</p>
        </article>
      `;
      return;
    }

    container.innerHTML = posts
      .slice(0, 6)
      .map(
        (post) => `
          <article class="blog-card" data-window-title="${(post.tags[0] || "POST").toUpperCase()}">
            <p class="paper-tag">${post.tags[0] || "Post"}</p>
            <h3>${post.title}</h3>
            <p>${post.summary}</p>
            <div class="paper-meta">
              <span>${post.date}</span>
              <a href="post.html?slug=${encodeURIComponent(post.slug)}">阅读全文</a>
            </div>
          </article>
        `
      )
      .join("");
  } catch (error) {
    container.innerHTML = `
      <article class="blog-card" data-window-title="ERROR.LOG">
        <p class="paper-tag">Unavailable</p>
        <h3>文章列表暂时无法加载</h3>
        <p>你可以稍后刷新，或者直接查看仓库里的 posts 目录。</p>
      </article>
    `;
  }
}

async function initPostPage() {
  const contentTarget = document.querySelector("#post-content");

  if (!contentTarget) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const titleTarget = document.querySelector("#post-title");
  const dateTarget = document.querySelector("#post-date");
  const summaryTarget = document.querySelector("#post-summary");
  const tagsTarget = document.querySelector("#post-tags");

  if (!slug) {
    titleTarget.textContent = "文章不存在";
    summaryTarget.textContent = "URL 里缺少 slug 参数。";
    return;
  }

  try {
    const posts = await loadManifest();
    const post = posts.find((item) => item.slug === slug);

    if (!post) {
      throw new Error("Post not found.");
    }

    const response = await fetch(post.file);

    if (!response.ok) {
      throw new Error("Post file not found.");
    }

    const markdown = await response.text();

    document.title = `${post.title} | FFFOP`;
    titleTarget.textContent = post.title;
    dateTarget.textContent = `POST / ${post.date}`;
    summaryTarget.textContent = post.summary;
    tagsTarget.innerHTML = renderPostTags(post.tags || []);
    contentTarget.innerHTML = renderMarkdown(markdown);
  } catch (error) {
    titleTarget.textContent = "文章加载失败";
    summaryTarget.textContent = "这篇文章暂时无法读取，请稍后再试。";
    contentTarget.innerHTML = "";
  }
}

initBlogList();
initPostPage();
