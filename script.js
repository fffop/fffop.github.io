const postManifestPath = "posts/manifest.json";
const yearTarget = document.querySelector("#year");
const themeToggle = document.querySelector("#theme-toggle");
const searchInput = document.querySelector("#search");
const clearSearch = document.querySelector("#clear-search");
const searchStatus = document.querySelector("#search-status");
const emptyState = document.querySelector("#empty-state");
const blogList = document.querySelector("#blog-list");
const archiveList = document.querySelector("#archive-list");
const tagList = document.querySelector("#tag-list");
const panels = Array.from(document.querySelectorAll("[data-panel]"));
const routeLinks = Array.from(document.querySelectorAll("[data-route]"));

let allEntries = [];
let filterLinks = [];

const state = {
  activeModule: "home",
  filterType: "all",
  filterValue: "",
  query: "",
};

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  if (themeToggle) {
    const dark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.innerHTML = `<span class="octicon ${dark ? "icon-sun" : "icon-moon"}" aria-hidden="true"></span>${dark ? "Light Mode" : "Dark Mode"}`;
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

async function loadManifest() {
  const response = await fetch(postManifestPath, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to load posts manifest.");
  }

  const posts = await response.json();
  return Array.isArray(posts) ? posts : [];
}

function normalizePost(post) {
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const category = post.category || tags[0] || "Blog";
  const year = String(post.date || "").slice(0, 4) || "Undated";

  return {
    ...post,
    category,
    tags,
    year,
  };
}

function renderBlogPosts(posts) {
  if (!blogList) {
    return;
  }

  if (!posts.length) {
    blogList.innerHTML = `
      <article
        class="post-card blog-card"
        data-card
        data-module="blog"
        data-year="2026"
        data-category="Blog"
        data-tags="Blog Draft"
        data-title="No posts yet"
      >
        <div class="post-body full">
          <span class="category muted-category"><span class="octicon icon-book" aria-hidden="true"></span>Blog</span>
          <h2>还没有文章</h2>
          <p class="post-summary">这里会显示之后添加到 GitHub Pages 的 Markdown 文章。</p>
          <div class="post-meta">
            <span>posts/*.md</span>
            <span>posts/manifest.json</span>
          </div>
        </div>
      </article>
    `;
    return;
  }

  blogList.innerHTML = posts
    .map((post) => {
      const tags = post.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
      return `
        <article
          class="post-card blog-card"
          data-card
          data-module="blog"
          data-kind="post"
          data-year="${escapeHtml(post.year)}"
          data-category="${escapeHtml(post.category)}"
          data-tags="${escapeHtml(post.tags.join("|"))}"
          data-title="${escapeHtml([post.title, post.summary, post.category, post.tags.join(" ")].join(" "))}"
        >
          <div class="post-body full">
            <span class="category"><span class="octicon icon-book" aria-hidden="true"></span>${escapeHtml(post.category)}</span>
            <h2><a href="post.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h2>
            <p class="post-summary">${escapeHtml(post.summary || "")}</p>
            <div class="post-meta">
              <span>${escapeHtml(post.date || "")}</span>
              <span>${escapeHtml(post.readingTime || "1 minute read")}</span>
            </div>
            <div class="inline-tags">${tags}</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function getEntryMetadata(element) {
  const rawTags = element.dataset.tags || "";
  const tags = rawTags
    .split(rawTags.includes("|") ? "|" : /\s+/)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    element,
    module: element.dataset.module || "home",
    year: element.dataset.year || "Undated",
    category: element.dataset.category || "Blog",
    tags,
    title: element.dataset.title || element.textContent,
  };
}

function getCurrentEntries() {
  return allEntries.filter((entry) => entry.module === state.activeModule);
}

function buildWidgetLink(type, value, label, count, className = "") {
  return `
    <a class="${className} filter-link" href="#blog" data-filter-type="${escapeHtml(type)}" data-filter-value="${escapeHtml(value)}">
      <strong>${escapeHtml(label)}</strong>
      ${typeof count === "number" ? `<span>${count}</span>` : ""}
    </a>
  `;
}

function countBy(entries, getter) {
  const counts = new Map();

  entries.forEach((entry) => {
    getter(entry).forEach((value) => {
      counts.set(value, (counts.get(value) || 0) + 1);
    });
  });

  return counts;
}

function renderWidgets() {
  const blogEntries = allEntries.filter((entry) => entry.module === "blog" && entry.element.dataset.kind === "post");

  if (archiveList) {
    const years = Array.from(countBy(blogEntries, (entry) => [entry.year]).entries())
      .sort((a, b) => String(b[0]).localeCompare(String(a[0])));
    archiveList.innerHTML = years.length
      ? years.map(([year, count]) => buildWidgetLink("year", year, year, count, "archive-row")).join("")
      : `<p class="widget-empty">No archives</p>`;
  }

  if (tagList) {
    const tags = Array.from(countBy(blogEntries, (entry) => entry.tags).entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 24);
    tagList.innerHTML = tags.length
      ? buildWidgetLink("all", "", "All", null) + tags.map(([tag, count]) => buildWidgetLink("tag", tag, tag, count)).join("")
      : `<p class="widget-empty">No tags</p>`;
  }

  filterLinks = Array.from(document.querySelectorAll(".filter-link"));
  filterLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (state.activeModule !== "blog") {
        setActiveModule("blog");
      }
      state.filterType = link.dataset.filterType || "all";
      state.filterValue = link.dataset.filterValue || "";
      history.replaceState(null, "", "#blog");
      applyFilters();
    });
  });
}

function entryMatchesFilter(entry) {
  if (entry.module !== state.activeModule) {
    return false;
  }

  if (state.filterType === "all") {
    return true;
  }

  const value = state.filterValue.toLowerCase();

  if (state.filterType === "year") {
    return String(entry.year).toLowerCase() === value;
  }

  if (state.filterType === "category") {
    return String(entry.category).toLowerCase() === value;
  }

  if (state.filterType === "tag") {
    return entry.tags.some((tag) => tag.toLowerCase() === value);
  }

  return true;
}

function entryMatchesQuery(entry) {
  if (!state.query) {
    return true;
  }

  const haystack = [
    entry.title,
    entry.category,
    entry.tags.join(" "),
    entry.element.textContent,
  ].join(" ").toLowerCase();

  return haystack.includes(state.query.toLowerCase());
}

function updateFilterActiveState() {
  filterLinks.forEach((link) => {
    const active =
      link.dataset.filterType === state.filterType &&
      (link.dataset.filterValue || "") === state.filterValue;
    link.classList.toggle("is-active", active);
  });
}

function describeFilter() {
  if (state.filterType === "all") {
    return state.activeModule;
  }

  return `${state.activeModule}, ${state.filterType}: ${state.filterValue}`;
}

function applyFilters() {
  const currentEntries = getCurrentEntries();
  let visibleCount = 0;

  allEntries.forEach((entry) => {
    const visible = entryMatchesFilter(entry) && entryMatchesQuery(entry);
    entry.element.hidden = !visible;
    if (visible) {
      visibleCount += 1;
    }
  });

  if (emptyState) {
    emptyState.hidden = visibleCount !== 0;
  }

  if (searchStatus) {
    const queryText = state.query ? `, search: "${state.query}"` : "";
    searchStatus.textContent = `Showing ${visibleCount} of ${currentEntries.length} posts (${describeFilter()}${queryText}).`;
  }

  updateFilterActiveState();
}

function setActiveModule(moduleName, options = {}) {
  state.activeModule = moduleName;
  state.filterType = "all";
  state.filterValue = "";
  state.query = "";

  if (searchInput) {
    searchInput.value = "";
  }

  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === moduleName);
  });

  routeLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.route === moduleName);
  });

  renderWidgets();
  applyFilters();

  if (!options.silent) {
    history.replaceState(null, "", `#${moduleName}`);
    document.querySelector("#top")?.scrollIntoView({ behavior: "smooth" });
  }
}

function bindRoutes() {
  routeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveModule(link.dataset.route || "home");
    });
  });

  document.querySelectorAll("[data-open-module]").forEach((card) => {
    card.addEventListener("click", () => {
      setActiveModule(card.dataset.openModule || "home");
    });
  });
}

function bindSearch() {
  searchInput?.addEventListener("input", () => {
    state.query = searchInput.value.trim();
    applyFilters();
  });

  clearSearch?.addEventListener("click", () => {
    if (searchInput) {
      searchInput.value = "";
    }
    state.query = "";
    state.filterType = "all";
    state.filterValue = "";
    applyFilters();
  });
}

function renderInlineMarkdown(input) {
  return escapeHtml(input)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderMarkdown(markdown) {
  const blocks = markdown.replace(/\r\n/g, "\n").trim().split(/\n\s*\n/);

  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) {
        return "";
      }

      if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
        const lines = trimmed.split("\n");
        return `<pre><code>${escapeHtml(lines.slice(1, -1).join("\n"))}</code></pre>`;
      }

      if (/^#{1,6}\s/.test(trimmed)) {
        const level = trimmed.match(/^#+/)[0].length;
        const content = trimmed.replace(/^#{1,6}\s/, "");
        return `<h${level}>${renderInlineMarkdown(content)}</h${level}>`;
      }

      if (trimmed.split("\n").every((line) => /^[-*]\s/.test(line))) {
        const items = trimmed
          .split("\n")
          .map((line) => `<li>${renderInlineMarkdown(line.replace(/^[-*]\s/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      if (trimmed.split("\n").every((line) => /^\d+\.\s/.test(line))) {
        const items = trimmed
          .split("\n")
          .map((line) => `<li>${renderInlineMarkdown(line.replace(/^\d+\.\s/, ""))}</li>`)
          .join("");
        return `<ol>${items}</ol>`;
      }

      if (trimmed.startsWith(">")) {
        return `<blockquote>${renderInlineMarkdown(trimmed.replace(/^>\s?/, ""))}</blockquote>`;
      }

      return `<p>${renderInlineMarkdown(trimmed).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

async function initHomePage() {
  bindRoutes();
  bindSearch();

  try {
    const posts = (await loadManifest()).map(normalizePost);
    renderBlogPosts(posts);
  } catch (error) {
    if (blogList) {
      blogList.innerHTML = `
        <article class="post-card blog-card" data-card data-module="blog" data-year="2026" data-category="Blog" data-tags="Error" data-title="Posts unavailable">
          <div class="post-body full">
            <span class="category muted-category"><span class="octicon icon-book" aria-hidden="true"></span>Blog</span>
            <h2>文章列表暂时不可用</h2>
            <p class="post-summary">请检查 posts/manifest.json 是否存在且为合法 JSON。</p>
          </div>
        </article>
      `;
    }
  }

  allEntries = Array.from(document.querySelectorAll("[data-card]")).map(getEntryMetadata);

  const initialModule = location.hash ? location.hash.replace("#", "") : "home";
  const validModule = panels.some((panel) => panel.dataset.panel === initialModule) ? initialModule : "home";
  setActiveModule(validModule, { silent: true });
}

async function initPostPage() {
  const titleTarget = document.querySelector("#post-title");
  const summaryTarget = document.querySelector("#post-summary");
  const categoryTarget = document.querySelector("#post-category");
  const metaTarget = document.querySelector("#post-meta");
  const contentTarget = document.querySelector("#post-content");

  if (!titleTarget || !contentTarget) {
    return;
  }

  const slug = new URLSearchParams(window.location.search).get("slug");

  if (!slug) {
    titleTarget.textContent = "Post not found";
    summaryTarget.textContent = "Missing slug in URL.";
    return;
  }

  try {
    const posts = (await loadManifest()).map(normalizePost);
    const post = posts.find((item) => item.slug === slug);

    if (!post) {
      throw new Error("Post not found.");
    }

    const response = await fetch(post.file, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load markdown.");
    }

    const markdown = await response.text();
    document.title = `${post.title} | Embodied AI Notes`;
    titleTarget.textContent = post.title;
    summaryTarget.textContent = post.summary || "";
    categoryTarget.textContent = post.category;
    metaTarget.innerHTML = `
      <span>${escapeHtml(post.date || "")}</span>
      <span>${escapeHtml(post.readingTime || "1 minute read")}</span>
      <span>${escapeHtml(post.tags.join(" / "))}</span>
    `;
    contentTarget.innerHTML = renderMarkdown(markdown);
  } catch (error) {
    titleTarget.textContent = "Post failed to load";
    summaryTarget.textContent = "Check posts/manifest.json and the Markdown file path.";
    contentTarget.innerHTML = "";
  }
}

initTheme();

if (document.body.dataset.page === "post") {
  initPostPage();
} else {
  initHomePage();
}
