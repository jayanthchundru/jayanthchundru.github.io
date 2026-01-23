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

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const renderInlineMarkdown = (value) => {
  const safe = escapeHtml(value);
  return safe
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n/g, "<br>");
};

const setText = (el, value) => {
  if (el) {
    el.textContent = value || "";
  }
};

const setHtml = (el, value) => {
  if (el) {
    el.innerHTML = value || "";
  }
};

const createEl = (tag, className) => {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  return el;
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const buildAuthor = (author, date, readTime) => {
  const wrapper = createEl("div", "post-author");
  if (author && author.avatar) {
    const img = document.createElement("img");
    img.src = author.avatar;
    img.alt = author.name || "Author";
    wrapper.append(img);
  }

  const name = createEl("span", "post-author-name");
  name.textContent = author && author.name ? author.name : "Author";
  wrapper.append(name);

  const dot1 = document.createElement("span");
  dot1.textContent = "·";
  wrapper.append(dot1);

  const dateSpan = document.createElement("span");
  dateSpan.textContent = formatMonthYear(date);
  wrapper.append(dateSpan);

  if (readTime) {
    const dot2 = document.createElement("span");
    dot2.textContent = "·";
    wrapper.append(dot2);
    const readSpan = document.createElement("span");
    readSpan.textContent = readTime;
    wrapper.append(readSpan);
  }

  return wrapper;
};

const buildGallery = (images, options = {}) => {
  const gallery = createEl("div", "post-gallery");
  const track = createEl("div", "post-gallery-track");
  const slides = images.map((image) => {
    const figure = createEl("figure", "post-gallery-slide");
    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt || "";
    figure.append(img);
    if (image.caption) {
      const caption = createEl("figcaption", "post-figure-caption");
      caption.textContent = image.caption;
      figure.append(caption);
    }
    track.append(figure);
    return figure;
  });

  gallery.append(track);

  if (slides.length > 1) {
    const prev = createEl("button", "post-gallery-btn prev");
    prev.type = "button";
    prev.setAttribute("aria-label", "Previous image");
    prev.textContent = "‹";

    const next = createEl("button", "post-gallery-btn next");
    next.type = "button";
    next.setAttribute("aria-label", "Next image");
    next.textContent = "›";

    let index = 0;
    const autoplayDelay = Number.isFinite(options.autoplayDelay)
      ? options.autoplayDelay
      : 4000;
    const autoplayEnabled = options.autoplay !== false;
    let paused = false;
    let autoplayTimer = null;
    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    };

    prev.addEventListener("click", () => {
      if (index > 0) {
        index -= 1;
        update();
      }
    });

    next.addEventListener("click", () => {
      if (index < slides.length - 1) {
        index += 1;
        update();
      }
    });

    if (autoplayEnabled && slides.length > 1) {
      autoplayTimer = setInterval(() => {
        if (paused) {
          return;
        }
        index = index === slides.length - 1 ? 0 : index + 1;
        update();
      }, autoplayDelay);

      gallery.addEventListener("mouseenter", () => {
        paused = true;
      });
      gallery.addEventListener("mouseleave", () => {
        paused = false;
      });
    }

    gallery.append(prev, next);
    update();
  }

  return gallery;
};

const getLightbox = () => {
  let lightbox = document.querySelector(".post-lightbox");
  if (lightbox) {
    return lightbox;
  }
  lightbox = createEl("div", "post-lightbox");
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-hidden", "true");
  const backdrop = createEl("button", "post-lightbox-backdrop");
  backdrop.type = "button";
  backdrop.setAttribute("aria-label", "Close image");
  const body = createEl("div", "post-lightbox-body");
  const img = document.createElement("img");
  img.alt = "";
  const caption = createEl("div", "post-lightbox-caption");
  const close = createEl("button", "post-lightbox-close");
  close.type = "button";
  close.setAttribute("aria-label", "Close image");
  close.textContent = "Close";
  body.append(img, caption);
  lightbox.append(backdrop, body, close);
  document.body.append(lightbox);

  const closeLightbox = () => {
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("post-lightbox-open");
  };

  backdrop.addEventListener("click", closeLightbox);
  close.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.getAttribute("aria-hidden") === "false") {
      closeLightbox();
    }
  });

  return lightbox;
};

const openLightbox = (src, alt) => {
  const lightbox = getLightbox();
  const img = lightbox.querySelector("img");
  const caption = lightbox.querySelector(".post-lightbox-caption");
  img.src = src;
  img.alt = alt || "";
  caption.textContent = alt || "";
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("post-lightbox-open");
};

const buildCollage = (images) => {
  const collage = createEl("div", "post-collage");
  images.forEach((image) => {
    const figure = createEl("figure", "post-collage-item");
    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt || "";
    img.loading = "lazy";
    img.addEventListener("click", () => openLightbox(image.src, image.alt));
    figure.append(img);
    collage.append(figure);
  });
  return collage;
};

const buildContent = (blocks) => {
  const fragment = document.createDocumentFragment();
  const toc = [];
  const slugCounts = new Map();
  blocks.forEach((block) => {
    if (!block || !block.type) {
      return;
    }
    switch (block.type) {
      case "paragraph": {
        const p = document.createElement("p");
        setHtml(p, renderInlineMarkdown(block.text || ""));
        fragment.append(p);
        break;
      }
      case "heading": {
        const wrapper = createEl("div", "post-heading");
        const h2 = document.createElement("h2");
        const text = block.text || "";
        const baseSlug = slugify(text);
        const count = slugCounts.get(baseSlug) || 0;
        slugCounts.set(baseSlug, count + 1);
        const slug = count ? `${baseSlug}-${count + 1}` : baseSlug;
        h2.id = slug;
        setHtml(h2, renderInlineMarkdown(text));
        wrapper.append(h2);
        if (block.date) {
          const date = createEl("div", "post-heading-date");
          date.textContent = block.date;
          wrapper.append(date);
        }
        fragment.append(wrapper);
        if (text) {
          toc.push({ id: slug, text });
        }
        break;
      }
      case "quote": {
        const quote = document.createElement("blockquote");
        setHtml(quote, renderInlineMarkdown(block.text || ""));
        fragment.append(quote);
        break;
      }
      case "image": {
        const figure = createEl("figure", "post-figure");
        const img = document.createElement("img");
        img.src = block.src;
        img.alt = block.alt || "";
        figure.append(img);
        if (block.caption) {
          const caption = createEl("figcaption", "post-figure-caption");
          caption.textContent = block.caption;
          figure.append(caption);
        }
        fragment.append(figure);
        break;
      }
      case "gallery": {
        if (Array.isArray(block.images) && block.images.length) {
          const wrapper = createEl("div", "post-gallery-wrap");
          wrapper.append(
            buildGallery(block.images, {
              autoplay: block.autoplay,
              autoplayDelay: block.autoplayDelay,
            })
          );
          if (block.caption) {
            const caption = createEl("div", "post-gallery-caption");
            caption.textContent = block.caption;
            wrapper.append(caption);
          }
          fragment.append(wrapper);
        }
        break;
      }
      case "collage": {
        if (Array.isArray(block.images) && block.images.length) {
          const wrapper = createEl("div", "post-collage-wrap");
          wrapper.append(buildCollage(block.images));
          if (block.caption) {
            const caption = createEl("div", "post-collage-caption");
            caption.textContent = block.caption;
            wrapper.append(caption);
          }
          fragment.append(wrapper);
        }
        break;
      }
      case "list": {
        if (Array.isArray(block.items) && block.items.length) {
          const ul = document.createElement("ul");
          block.items.forEach((item) => {
            const li = document.createElement("li");
            setHtml(li, renderInlineMarkdown(item));
            ul.append(li);
          });
          fragment.append(ul);
        }
        break;
      }
      default:
        break;
    }
  });
  return { fragment, toc };
};

const renderPost = (data, post) => {
  const titleEl = document.getElementById("post-title");
  const kickerEl = document.getElementById("post-kicker");
  const authorEl = document.getElementById("post-author");
  const tagsEl = document.getElementById("post-tags");
  const heroEl = document.getElementById("post-hero");
  const contentEl = document.getElementById("post-content");

  setText(titleEl, post.title || "Untitled");
  setText(kickerEl, post.kicker || "");

  if (authorEl) {
    authorEl.replaceWith(
      buildAuthor(post.author || data.author, post.date, post.readTime),
    );
  }

  if (tagsEl) {
    tagsEl.innerHTML = "";
    (post.tags || []).forEach((tag) => {
      const chip = document.createElement("span");
      chip.textContent = `#${tag}`;
      tagsEl.append(chip);
    });
  }

  if (heroEl) {
    if (post.hero && post.hero.src) {
      heroEl.innerHTML = "";
      heroEl.style.display = "";
      const img = document.createElement("img");
      img.src = post.hero.src;
      img.alt = post.hero.alt || "";
      heroEl.append(img);
    } else {
      heroEl.style.display = "none";
    }
  }

  if (contentEl) {
    contentEl.innerHTML = "";
    const { fragment, toc } = buildContent(post.blocks || []);
    contentEl.append(fragment);
    const tocEl = document.getElementById("post-toc");
    if (tocEl) {
      tocEl.innerHTML = "";
      toc.forEach((item) => {
        const link = document.createElement("a");
        link.href = `#${item.id}`;
        link.textContent = item.text;
        tocEl.append(link);
      });
    }
  }

  document.title = post.title || "Blog Post";
};

const setupTocToggle = () => {
  const rail = document.getElementById("toc-rail");
  const panel = document.getElementById("post-toc-panel");
  if (!rail || !panel) {
    return;
  }
  rail.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("is-open");
    rail.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
  });
};

const renderNotFound = () => {
  const titleEl = document.getElementById("post-title");
  const contentEl = document.getElementById("post-content");
  setText(titleEl, "Post not found");
  if (contentEl) {
    contentEl.innerHTML = "<p>We could not find that blog post.</p>";
  }
};

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

fetch(blogsUrl)
  .then((response) => response.json())
  .then((data) => {
    const posts = Array.isArray(data.posts) ? data.posts : [];
    const postIndex = posts.find((item) => item.id === postId);
    if (!postIndex) {
      renderNotFound();
      return;
    }
    if (!postIndex.file) {
      renderPost(data, postIndex);
      return;
    }
    fetch(postIndex.file)
      .then((response) => response.json())
      .then((postData) => {
        renderPost(data, { ...postIndex, ...postData });
      })
      .catch((error) => {
        console.error("Failed to load post file", error);
        renderNotFound();
      });
  })
  .catch((error) => {
    console.error("Failed to load blogs.json", error);
    renderNotFound();
  });

setupTocToggle();
