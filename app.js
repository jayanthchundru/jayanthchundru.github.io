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

  const abstract = document.createElement("p");
  abstract.className = "pub-abstract";
  abstract.textContent = pub.abstract || "";

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

  content.append(title, authors, venue, links, abstract);
  article.append(thumb, content);
  return article;
};

const buildBlogItem = (post) => {
  const article = document.createElement("article");
  article.className = "blog-item";

  const title = document.createElement("h4");
  title.className = "blog-title";
  const titleLink = document.createElement("a");
  titleLink.href = post.url || "#";
  titleLink.textContent = post.title || "Untitled";
  title.append(titleLink);

  const meta = document.createElement("div");
  meta.className = "blog-meta";
  meta.textContent = post.date || "";

  const summary = document.createElement("p");
  summary.className = "blog-summary";
  summary.textContent = post.summary || "";

  const tags = document.createElement("div");
  tags.className = "blog-tags";
  if (Array.isArray(post.tags)) {
    post.tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.textContent = tag;
      tags.append(chip);
    });
  }

  article.append(title, meta, summary, tags);
  return article;
};

const buildNewsItem = (item) => {
  const li = document.createElement("li");
  const date = document.createElement("span");
  date.className = "news-date";
  date.textContent = item.date || "";
  const text = document.createElement("span");
  text.className = "news-text";
  text.textContent = item.text || "";
  li.append(date, text);
  return li;
};

fetch(dataUrl)
  .then((response) => response.json())
  .then((data) => {
    const newsList = document.getElementById("news-list");
    if (newsList && Array.isArray(data.news)) {
      data.news.forEach((item) => {
        newsList.append(buildNewsItem(item));
      });
    }

    const pubList = document.getElementById("publications-list");
    if (pubList && Array.isArray(data.publications)) {
      data.publications.forEach((pub) => {
        pubList.append(buildPubItem(pub));
      });
    }

    const blogList = document.getElementById("blogs-list");
    if (blogList && Array.isArray(data.blogs)) {
      data.blogs.forEach((post) => {
        blogList.append(buildBlogItem(post));
      });
    }
  })
  .catch((error) => {
    console.error("Failed to load data.json", error);
  });
