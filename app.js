import { contactLinks, introSegments, newsItems, profile, publications } from "./content.js";

const createEl = (tag, className, attrs = {}) => {
	const element = document.createElement(tag);
	if (className) {
		element.className = className;
	}
	Object.entries(attrs).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			element.setAttribute(key, value);
		}
	});
	return element;
};

const appendSegments = (parent, segments) => {
	segments.forEach((segment) => {
		if (segment.type === "strong") {
			const strong = document.createElement("strong");
			appendSegments(strong, segment.segments || [{ type: "text", value: segment.value || "" }]);
			parent.append(strong);
			return;
		}
		if (segment.type === "link") {
			const linkClass = segment.className || "intro-link";
			const link = createEl("a", linkClass, {
				href: segment.href,
				target: "_blank",
				rel: "noopener noreferrer",
			});
			link.textContent = segment.label;
			parent.append(link);
			return;
		}
		parent.append(document.createTextNode(segment.value));
	});
};

const appendHighlightedText = (parent, text, highlight) => {
	const source = text || "";
	if (!highlight || !source.includes(highlight)) {
		parent.append(document.createTextNode(source));
		return;
	}

	const parts = source.split(highlight);
	parts.forEach((part, index) => {
		if (part) {
			parent.append(document.createTextNode(part));
		}
		if (index < parts.length - 1) {
			const strong = document.createElement("strong");
			strong.textContent = highlight;
			parent.append(strong);
		}
	});
};

const buildLocationBadge = () => {
	const badge = createEl("div", "location-badge", { "aria-label": "Cincinnati, Ohio" });
	badge.innerHTML = `
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M12 2c-3.86 0-7 3.14-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4z" />
		</svg>
	`;
	const label = document.createElement("span");
	label.textContent = profile.location;
	badge.append(label);
	return badge;
};

const buildNavRow = (items) => {
	const nav = createEl("nav", "nav-row");
	items.forEach((item) => {
		const link = createEl("a", "", { href: item.href });
		link.textContent = item.label;
		nav.append(link);
	});
	return nav;
};

const buildHeader = () => {
	const header = document.createElement("header");
	const title = document.createElement("h1");
	title.textContent = profile.name;
	header.append(title);
	return header;
};

const buildPhotoColumn = () => {
	if (!profile.image) {
		return null;
	}
	const photoColumn = createEl("div", "photo-column");
	const photo = createEl("img", "profile-photo", {
		src: profile.image,
		alt: profile.name,
	});
	photoColumn.append(photo);
	const locationBelow = buildLocationBadge();
	locationBelow.className = "location-below";
	photoColumn.append(locationBelow);
	return photoColumn;
};

const buildIntro = () => {
	const intro = createEl("p", "intro-note");
	appendSegments(intro, introSegments);
	return intro;
};

const buildContactLine = () => {
	const contactLine = createEl("p", "contact-line");
	contactLinks.forEach((link, index) => {
		const anchor = createEl("a", "", { href: link.href });
		anchor.textContent = link.label;
		contactLine.append(anchor);
		if (index < contactLinks.length - 1) {
			contactLine.append(document.createTextNode(" "));
		}
	});
	return contactLine;
};

const buildNewsItem = (item) => {
	const entry = createEl("li", "news-item");
	const date = createEl("span", "news-date");
	date.textContent = item.date;
	const text = createEl("span", "news-text");
	appendSegments(text, item.segments);
	entry.append(date, text);
	return entry;
};

const buildNewsSection = () => {
	const section = createEl("section", "list-block");
	const title = createEl("div", "section-title");
	title.textContent = "News";
	const list = createEl("ul", "news-list");
	newsItems.forEach((item) => {
		list.append(buildNewsItem(item));
	});
	section.append(title, list);
	return section;
};

const buildPublication = (publication) => {
	const article = createEl("article", "pub-item");
	if (publication.thumb) {
		const thumb = createEl("div", "pub-thumb");
		const image = createEl("img", "pub-thumb-image", {
			src: publication.thumb,
			alt: publication.title,
		});
		thumb.append(image);
		article.append(thumb);
	}
	const content = createEl("div", "pub-content");

	const title = createEl("h3", "pub-title");
	const titleLink = createEl("a", "", {
		href: publication.url,
		target: "_blank",
		rel: "noopener noreferrer",
	});
	titleLink.textContent = publication.title;
	title.append(titleLink);

	const authors = createEl("div", "pub-authors");
	appendHighlightedText(authors, publication.authors, profile.name);

	const venueRow = document.createElement("div");
	const venue = createEl("span", "pub-venue");
	venue.textContent = publication.venue;
	venueRow.append(venue);

	const linkList = createEl("span", "pub-links pub-links-inline");
	publication.links.forEach((link) => {
		const anchor = createEl("a", "", {
			href: link.href,
			target: "_blank",
			rel: "noopener noreferrer",
		});
		anchor.textContent = link.label;
		linkList.append(anchor);
	});
	venueRow.append(linkList);

	const tags = createEl("div", "pub-tags");
	if (Array.isArray(publication.tags) && publication.tags.length) {
		publication.tags.forEach((tag) => {
			const chip = createEl("span", "pub-tag");
			chip.textContent = `#${tag}`;
			tags.append(chip);
		});
	}

	const abstractWrap = createEl("p", "pub-abstract-wrap");
	const abstractText = createEl("span", "pub-abstract-text");
	const fullAbstract = publication.abstract || "";
	const collapsedAbstract =
		fullAbstract.length > 260 ? `${fullAbstract.slice(0, 260).trimEnd()}...` : fullAbstract;
	abstractText.textContent = collapsedAbstract;
	const abstractToggle = createEl("button", "pub-abstract-toggle", { type: "button" });
	abstractToggle.textContent = "see more";
	abstractToggle.addEventListener("click", () => {
		const isExpanded = abstractWrap.classList.toggle("is-expanded");
		abstractText.textContent = isExpanded ? fullAbstract : collapsedAbstract;
		abstractToggle.textContent = isExpanded ? "see less" : "see more";
	});
	abstractWrap.append(abstractText, document.createTextNode(" "), abstractToggle);

	content.append(title, authors, venueRow, tags);
	article.append(content);
	abstractWrap.classList.add("pub-abstract-full");
	article.append(abstractWrap);
	return article;
};

const buildPublicationSection = () => {
	const section = createEl("section", "list-block", { id: "publications" });
	const title = createEl("div", "section-title");
	title.textContent = "Publications";
	const list = createEl("div", "pub-list");
	publications.forEach((publication) => {
		list.append(buildPublication(publication));
	});
	section.append(title, list);
	return section;
};

const renderPortfolio = () => {
	const mount = document.getElementById("app");
	if (!mount) {
		return;
	}

	const main = document.createElement("main");
	const photoColumn = buildPhotoColumn();
	const children = [buildHeader()];
	if (photoColumn) {
		children.push(photoColumn);
	}
	children.push(
		buildIntro(),
		buildContactLine(),
		buildNewsSection(),
		buildPublicationSection()
	);
	main.append(...children);
	mount.replaceChildren(main);
};

renderPortfolio();
