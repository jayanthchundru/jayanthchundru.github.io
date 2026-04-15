const getStoredTheme = () => {
  try {
    return localStorage.getItem("theme");
  } catch (error) {
    return null;
  }
};

const scrollToHashTarget = (behavior = "auto") => {
  const { hash } = window.location;
  if (!hash) {
    return;
  }
  const target = document.querySelector(hash);
  if (!target) {
    return;
  }
  target.scrollIntoView({ behavior, block: "start" });
};

const requestHashScroll = () => {
  if (!window.location.hash) {
    return;
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToHashTarget("auto");
    });
  });
};

const getPreferredTheme = () => {
  const stored = getStoredTheme();
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  if (window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

const applyTheme = (theme, toggle) => {
  document.documentElement.setAttribute("data-theme", theme);
  if (toggle) {
    const isDark = theme === "dark";
    const moonIcon = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          fill="currentColor"
        />
      </svg>
    `;
    const sunIcon = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="4.2" fill="currentColor" />
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.6">
          <line x1="12" y1="2.6" x2="12" y2="5.1" />
          <line x1="12" y1="18.9" x2="12" y2="21.4" />
          <line x1="2.6" y1="12" x2="5.1" y2="12" />
          <line x1="18.9" y1="12" x2="21.4" y2="12" />
          <line x1="4.6" y1="4.6" x2="6.4" y2="6.4" />
          <line x1="17.6" y1="17.6" x2="19.4" y2="19.4" />
          <line x1="17.6" y1="6.4" x2="19.4" y2="4.6" />
          <line x1="4.6" y1="19.4" x2="6.4" y2="17.6" />
        </g>
      </svg>
    `;
    toggle.innerHTML = isDark ? sunIcon : moonIcon;
    toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );
  }
};

const themeToggle = document.getElementById("theme-toggle");
applyTheme(getPreferredTheme(), themeToggle);
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme, themeToggle);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch (error) {
      // Ignore storage errors and keep the UI responsive.
    }
  });
}

const today = new Date();
const options = { year: "numeric", month: "long" };
const label = today.toLocaleDateString("en-US", options);
const target = document.getElementById("today");
if (target) {
  target.textContent = label;
}

const updated = document.getElementById("last-updated");
if (updated) {
  updated.textContent = label;
}

const dataUrl = "data.json";
const blogsUrl = "blogs.json";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const parseMonthYear = (value) => {
  if (!value) {
    return null;
  }
  const text = String(value).trim();
  let match = text.match(/^(\d{4})[/-](\d{1,2})$/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    if (month >= 1 && month <= 12) {
      return { year, month };
    }
  }
  match = text.match(/^(\d{1,2})[/-](\d{4})$/);
  if (match) {
    const month = Number(match[1]);
    const year = Number(match[2]);
    if (month >= 1 && month <= 12) {
      return { year, month };
    }
  }
  match = text.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (match) {
    const monthText = match[1].toLowerCase();
    const year = Number(match[2]);
    const monthIndex = monthNames.findIndex(
      (name) => name.toLowerCase() === monthText.slice(0, 3),
    );
    if (monthIndex >= 0) {
      return { year, month: monthIndex + 1 };
    }
  }
  return null;
};

const formatMonthYear = (value) => {
  const parsed = parseMonthYear(value);
  if (!parsed) {
    return value || "";
  }
  const monthLabel = monthNames[parsed.month - 1] || "";
  return `${monthLabel} ${parsed.year}`;
};

const sortByDateDesc = (posts) => {
  return posts
    .map((post, index) => ({
      post,
      index,
      parsed: parseMonthYear(post.date),
      pinned: Boolean(post.pinned),
    }))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      if (a.parsed && b.parsed) {
        if (a.parsed.year !== b.parsed.year) {
          return b.parsed.year - a.parsed.year;
        }
        if (a.parsed.month !== b.parsed.month) {
          return b.parsed.month - a.parsed.month;
        }
      } else if (a.parsed) {
        return -1;
      } else if (b.parsed) {
        return 1;
      }
      return a.index - b.index;
    })
    .map((item) => item.post);
};

const renderAuthors = (text, highlight) => {
  const frag = document.createDocumentFragment();
  if (!highlight || !text.includes(highlight)) {
    frag.append(document.createTextNode(text));
    return frag;
  }
  const parts = text.split(highlight);
  parts.forEach((part, index) => {
    if (part) {
      frag.append(document.createTextNode(part));
    }
    if (index < parts.length - 1) {
      const strong = document.createElement("strong");
      strong.textContent = highlight;
      frag.append(strong);
    }
  });
  return frag;
};

const buildPubItem = (pub) => {
  const article = document.createElement("article");
  article.className = "pub-item";

  const thumb = document.createElement("div");
  thumb.className = "pub-thumb";
  if (pub.thumb) {
    const img = document.createElement("img");
    img.src = pub.thumb;
    img.alt = pub.title;
    thumb.append(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "pub-placeholder";
    placeholder.textContent = "Add figure";
    thumb.append(placeholder);
  }

  const content = document.createElement("div");
  content.className = "pub-content";

  const title = document.createElement("h4");
  title.className = "pub-title";
  const titleLink = document.createElement("a");
  titleLink.href = pub.url || "#";
  titleLink.textContent = pub.title || "Untitled";
  title.append(titleLink);

  const authors = document.createElement("div");
  authors.className = "pub-authors";
  if (pub.authors) {
    authors.append(renderAuthors(pub.authors, pub.highlight));
  }

  const venue = document.createElement("div");
  venue.className = "pub-venue";
  const venueText = [pub.venue, pub.year].filter(Boolean).join(" ");
  venue.textContent = venueText;

  const abstractWrap = document.createElement("div");
  abstractWrap.className = "pub-abstract-wrap";

  const abstract = document.createElement("p");
  abstract.className = "pub-abstract";
  const abstractText = pub.abstract || "";
  abstract.append(document.createTextNode(abstractText));

  const abstractToggle = document.createElement("button");
  abstractToggle.className = "pub-abstract-toggle";
  abstractToggle.type = "button";
  abstractToggle.textContent = "...read more";
  abstractToggle.addEventListener("click", () => {
    const isExpanded = abstractWrap.classList.toggle("is-expanded");
    abstractToggle.textContent = isExpanded ? "show less" : "...read more";
  });

  abstractWrap.append(abstract, abstractToggle);

  const links = document.createElement("div");
  links.className = "pub-links";
  if (pub.links) {
    const linkEntries = Object.entries(pub.links).filter(([, value]) => value);
    linkEntries.forEach(([label, href], index) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      links.append(link);
      if (index < linkEntries.length - 1) {
        links.append(document.createTextNode(" | "));
      }
    });
  }

  const pubTags = document.createElement("div");
  pubTags.className = "pub-tags";
  if (Array.isArray(pub.tags)) {
    pub.tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.textContent = `#${tag}`;
      pubTags.append(chip);
    });
  }

  content.append(title, authors, venue, links, pubTags, abstractWrap);
  article.append(thumb, content);
  return article;
};

const buildBlogItem = (post) => {
  const article = document.createElement("article");
  article.className = "blog-item";
  if (post.pinned) {
    article.classList.add("is-pinned");
  }

  const title = document.createElement("h4");
  title.className = "blog-title";
  const titleLink = document.createElement("a");
  titleLink.href = post.id ? `post.html?id=${encodeURIComponent(post.id)}` : "#";
  titleLink.textContent = post.title || "Untitled";
  title.append(titleLink);

  const meta = document.createElement("div");
  meta.className = "blog-meta";
  meta.textContent = formatMonthYear(post.date);
  if (post.pinned) {
    const badge = document.createElement("span");
    badge.className = "blog-pin";
    badge.setAttribute("aria-label", "Pinned");
    badge.textContent = "📌";
    meta.append(badge);
  }

  const summary = document.createElement("p");
  summary.className = "blog-summary";
  summary.textContent = post.summary || "";

  const tags = document.createElement("div");
  tags.className = "blog-tags";
  if (Array.isArray(post.tags)) {
    post.tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.textContent = `#${tag}`;
      tags.append(chip);
    });
  }

  article.append(title, meta, summary, tags);
  return article;
};

const renderBlogList = (listEl, posts) => {
  listEl.innerHTML = "";
  if (Array.isArray(posts) && posts.length) {
    posts.forEach((post) => {
      listEl.append(buildBlogItem(post));
    });
    return;
  }
  const message = document.createElement("p");
  message.className = "blog-empty";
  message.textContent = "Coming soon.";
  listEl.append(message);
};

const buildBlogTagFilters = (filterEl, posts, tagsFromData) => {
  const tags = Array.isArray(tagsFromData) && tagsFromData.length
    ? tagsFromData
    : Array.isArray(posts)
      ? posts
          .flatMap((post) => (Array.isArray(post.tags) ? post.tags : []))
          .filter(Boolean)
      : [];
  if (!tags.length) {
    return { selectedTag: "All", tagButtons: [] };
  }

  const uniqueTags = Array.from(new Set(tags.map((tag) => tag.trim()))).filter(Boolean);
  const buttons = [];
  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = "blog-filter-tag is-active";
  allButton.dataset.tag = "All";
  allButton.setAttribute("aria-pressed", "true");
  allButton.textContent = "#All";
  filterEl.append(allButton);
  buttons.push(allButton);

  uniqueTags.forEach((tag) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "blog-filter-tag";
    button.dataset.tag = tag;
    button.setAttribute("aria-pressed", "false");
    button.textContent = `#${tag}`;
    filterEl.append(button);
    buttons.push(button);
  });

  return { selectedTag: "All", tagButtons: buttons };
};

const renderNewsText = (text, highlights, links) => {
  const frag = document.createDocumentFragment();
  const highlightSet = new Set(Array.isArray(highlights) ? highlights : []);
  const linksMap = (links && typeof links === "object") ? links : {};
  const allKeys = [...Object.keys(linksMap), ...highlightSet].filter(Boolean);
  if (!allKeys.length) {
    frag.append(document.createTextNode(text));
    return frag;
  }
  const pattern = allKeys.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${pattern})`, "g");
  const parts = text.split(regex);
  parts.forEach((part) => {
    if (linksMap[part]) {
      const a = document.createElement("a");
      a.href = linksMap[part];
      a.textContent = part;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "news-link";
      frag.append(a);
    } else if (highlightSet.has(part)) {
      const strong = document.createElement("strong");
      strong.textContent = part;
      frag.append(strong);
    } else if (part) {
      frag.append(document.createTextNode(part));
    }
  });
  return frag;
};

const buildNewsItem = (item) => {
  const li = document.createElement("li");
  const date = document.createElement("span");
  date.className = "news-date";
  date.textContent = item.date || "";
  const text = document.createElement("span");
  text.className = "news-text";
  text.append(renderNewsText(item.text || "", item.highlights, item.links));
  li.append(date, text);
  return li;
};

const buildProjectItem = (project) => {
  const article = document.createElement("article");
  article.className = "card project-card";

  const body = document.createElement("div");
  body.className = "project-body";

  const title = document.createElement("h4");
  title.textContent = project.title || "Untitled Project";

  const description = document.createElement("p");
  description.textContent = project.description || "";

  const tags = document.createElement("div");
  tags.className = "project-tags";
  if (Array.isArray(project.skills)) {
    project.skills.filter(Boolean).forEach((skill) => {
      const tag = document.createElement("span");
      tag.textContent = skill;
      tags.append(tag);
    });
  }

  const meta = document.createElement("div");
  meta.className = "project-meta";

  if (project.status) {
    const status = document.createElement("span");
    status.textContent = project.status;
    meta.append(status);
  }

  if (project.code) {
    const link = document.createElement("a");
    link.href = project.code;
    link.className = "icon-link project-link";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.1 6.9 9.4.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1-1-1.3-1-1.3-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.4 2.2 1 2.7.8.1-.6.3-1 .6-1.2-2.2-.2-4.5-1.1-4.5-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.3 4.8-4.5 5 .3.3.7.8.7 1.6v2.4c0 .3.2.6.7.5A10 10 0 0 0 22 12c0-5.5-4.5-10-10-10z"
        />
      </svg>
      CODE
    `;
    meta.append(link);
  }

  body.append(title, description);
  if (tags.childElementCount) {
    body.append(tags);
  }
  if (meta.childElementCount) {
    body.append(meta);
  }
  article.append(body);
  return article;
};

const buildResourceItem = (resource, index) => {
  const li = document.createElement("li");
  li.className = "resources-item";

  const number = document.createElement("span");
  number.className = "resources-number";
  number.textContent = `[${index + 1}]`;

  const text = document.createElement("p");
  text.className = "resources-text";

  const title = document.createElement("a");
  title.className = "resources-title";
  title.href = resource.url || "#";
  title.textContent = resource.title || "Untitled resource";
  title.target = "_blank";
  title.rel = "noopener noreferrer";

  text.append(number, document.createTextNode(" "), title);
  if (resource.description) {
    text.append(document.createTextNode(` ${resource.description}`));
  }

  li.append(text);

  return li;
};

const hamburgerBtn = document.getElementById("hamburger");
const mainNavEl = document.querySelector(".main-nav");
if (hamburgerBtn && mainNavEl) {
  hamburgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = mainNavEl.classList.toggle("nav-open");
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
  });
  mainNavEl.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNavEl.classList.remove("nav-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("click", (e) => {
    if (!mainNavEl.contains(e.target)) {
      mainNavEl.classList.remove("nav-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    }
  });
}

fetch(dataUrl)
  .then((response) => response.json())
  .then((data) => {
    const newsList = document.getElementById("news-list");
    if (newsList && Array.isArray(data.news)) {
      const sortedNews = sortByDateDesc(data.news);
      if (sortedNews.length > 10) {
        newsList.classList.add("is-scroll");
      }
      sortedNews.forEach((item) => {
        newsList.append(buildNewsItem(item));
      });
    }

    const pubList = document.getElementById("publications-list");
    if (pubList && Array.isArray(data.publications)) {
      data.publications.forEach((pub) => {
        pubList.append(buildPubItem(pub));
      });
    }

    const projectList = document.getElementById("projects-list");
    if (projectList && Array.isArray(data.projects)) {
      data.projects.forEach((project) => {
        projectList.append(buildProjectItem(project));
      });
    }

    const resourcesList = document.getElementById("resources-list");
    if (resourcesList && Array.isArray(data.resources)) {
      data.resources.forEach((resource, index) => {
        resourcesList.append(buildResourceItem(resource, index));
      });
    }

    const leetcodeLink = document.getElementById("leetcode-card-link");
    const leetcodeImage = document.getElementById("leetcode-card-image");
    if (leetcodeImage) {
      if (data.leetcode && data.leetcode.image) {
        leetcodeImage.src = data.leetcode.image;
      } else {
        leetcodeImage.remove();
      }
    }
    if (leetcodeLink) {
      if (data.leetcode && data.leetcode.profile) {
        leetcodeLink.href = data.leetcode.profile;
      } else {
        leetcodeLink.remove();
      }
    }

    requestHashScroll();
  })
  .catch((error) => {
    console.error("Failed to load data.json", error);
  });

fetch(blogsUrl)
  .then((response) => response.json())
  .then((data) => {
    const blogList = document.getElementById("blogs-list");
    const blogFilter = document.getElementById("blog-tag-filter");
    if (!blogList) {
      return;
    }

    const posts = Array.isArray(data.posts) ? data.posts : [];
    const sortedPosts = sortByDateDesc(posts);
    renderBlogList(blogList, sortedPosts);

    if (!blogFilter) {
      return;
    }

    const { tagButtons } = buildBlogTagFilters(
      blogFilter,
      sortedPosts,
      data.blogTags,
    );
    if (!tagButtons.length) {
      return;
    }

    const setActive = (activeTag) => {
      tagButtons.forEach((button) => {
        const isActive = button.dataset.tag === activeTag;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    };

    tagButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tag = button.dataset.tag;
        setActive(tag);
        if (tag === "All") {
          renderBlogList(blogList, sortedPosts);
          return;
        }
        const filtered = sortedPosts.filter((post) => {
          if (!Array.isArray(post.tags)) {
            return false;
          }
          return post.tags.some(
            (postTag) => postTag.toLowerCase() === tag.toLowerCase(),
          );
        });
        renderBlogList(blogList, filtered);
      });
    });
  })
  .catch((error) => {
    console.error("Failed to load blogs.json", error);
  });
