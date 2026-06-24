import {
	affiliations,
	contactLinks,
	introSegments,
	newsItems,
	profile,
	projects,
	publications,
	templateCredits,
} from "./content.js";

const THEME_STORAGE_KEY = "portfolio-theme";
const NEWS_VISIBLE_ITEM_LIMIT = 5;

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

const readStoredTheme = () => {
	try {
		return localStorage.getItem(THEME_STORAGE_KEY);
	} catch (err) {
		return null;
	}
};

const writeStoredTheme = (theme) => {
	try {
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	} catch (err) {
		// Theme still applies for this page load when persistence is unavailable.
	}
};

const getPreferredTheme = () => {
	const storedTheme = readStoredTheme();
	if (storedTheme === "dark" || storedTheme === "light") {
		return storedTheme;
	}
	return "light";
};

const syncThemedImages = () => {
	const isDark = document.documentElement.dataset.theme === "dark";
	document.querySelectorAll("[data-light-src][data-dark-src]").forEach((image) => {
		image.setAttribute("src", isDark ? image.dataset.darkSrc : image.dataset.lightSrc);
	});
};

const applyTheme = (theme) => {
	document.documentElement.dataset.theme = theme;
	writeStoredTheme(theme);
	syncThemedImages();
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
		if (segment.className) {
			const span = createEl("span", segment.className);
			span.textContent = segment.value;
			parent.append(span);
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
	const nav = createEl("nav", "nav-row", { "aria-label": "Primary" });
	items.forEach((item, index) => {
		if (index > 0) {
			const separator = createEl("span", "nav-separator", { "aria-hidden": "true" });
			separator.textContent = "·";
			nav.append(separator);
		}
		const link = createEl("a", "", {
			href: item.href,
			"aria-current": item.current ? "page" : undefined,
		});
		link.textContent = item.label;
		nav.append(link);
	});
	return nav;
};

const buildHeader = () => {
	const header = document.createElement("header");
	const title = document.createElement("h1");
	const firstName = createEl("span", "name-primary");
	firstName.textContent = "Jayanth";
	const restName = createEl("span", "name-secondary");
	restName.textContent = " Krishna Chundru";
	title.append(firstName, restName);
	const nameTag = createEl("p", "name-tag");
	nameTag.textContent = "Graduate Researcher . Software Engineer";
	const nav = buildNavRow([
		{ label: "Home", href: "./", current: true },
		{ label: "Research", href: "#publications" },
		// { label: "Projects", href: "#projects" },
		{ label: "Blogs", href: "blogs/" },
		{ label: "Gallery", href: "gallery/" },
	]);
	const separator = createEl("span", "nav-separator", { "aria-hidden": "true" });
	separator.textContent = "·";
	nav.append(separator, buildThemeToggle());
	header.append(title, nameTag, nav);
	return header;
};

const buildThemeToggle = () => {
	const themeToggle = createEl("button", "theme-toggle", { type: "button" });
	const syncToggle = () => {
		const isDark = document.documentElement.dataset.theme === "dark";
		themeToggle.innerHTML = isDark
			? `
				<svg class="theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true">
					<circle cx="12" cy="12" r="5.2" />
					<path d="M12 1.8v3M12 19.2v3M4.78 4.78l2.12 2.12M17.1 17.1l2.12 2.12M1.8 12h3M19.2 12h3M4.78 19.22l2.12-2.12M17.1 6.9l2.12-2.12" />
				</svg>
			`
			: `
				<svg class="theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true">
					<path d="M17.8 14.4A7.7 7.7 0 0 1 9.6 3.1a9.4 9.4 0 1 0 11.3 11.3 7.65 7.65 0 0 1-3.1 0z" />
				</svg>
			`;
		themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
		themeToggle.setAttribute("aria-pressed", String(isDark));
	};
	themeToggle.addEventListener("click", () => {
		const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
		applyTheme(nextTheme);
		syncToggle();
	});
	syncToggle();
	return themeToggle;
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

const buildAvailabilityLine = () => {
	const line = createEl("p", "availability-line");
	line.innerHTML = `
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path class="pin-needle" d="M10.4 13.6 4.1 19.9a1 1 0 0 0 1.4 1.4l6.3-6.3z" />
			<path class="pin-stem" d="M9.4 11.2 6.8 8.6l1.8-1.8 8.6 8.6-1.8 1.8-2.6-2.6-7.3 7.3-1.4-1.4z" />
			<path class="pin-cap" d="M15.9 2.4a1.1 1.1 0 0 1 1.5 0l4.2 4.2a1.1 1.1 0 0 1 0 1.5l-2.7 2.7 1.1 4.1a1 1 0 0 1-1.7.9L8.2 5.7a1 1 0 0 1 .9-1.7l4.1 1.1z" />
		</svg>
	`;
	const label = document.createElement("span");
	label.textContent = profile.availability;
	line.append(label);
	return line;
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

const addNewsToggle = (section, list) => {
	const items = Array.from(list.children);
	if (items.length <= NEWS_VISIBLE_ITEM_LIMIT) {
		return;
	}

	let isExpanded = false;
	const toggle = createEl("button", "news-toggle", {
		type: "button",
		"aria-expanded": "false",
	});
	toggle.textContent = "More news ....";

	const syncItems = () => {
		items.forEach((item, index) => {
			item.hidden = !isExpanded && index >= NEWS_VISIBLE_ITEM_LIMIT;
		});
		toggle.textContent = isExpanded ? "Show less" : "More news ....";
		toggle.setAttribute("aria-expanded", String(isExpanded));
	};

	toggle.addEventListener("click", () => {
		isExpanded = !isExpanded;
		syncItems();
	});

	syncItems();
	section.append(toggle);
};

const buildNewsSection = () => {
	const section = createEl("section", "list-block news-section");
	const title = createEl("div", "section-title");
	title.textContent = "News";
	const list = createEl("ul", "news-list");
	newsItems.forEach((item) => {
		list.append(buildNewsItem(item));
	});
	section.append(title, list);
	addNewsToggle(section, list);
	return section;
};

const buildAffiliation = (affiliation) => {
	const cardClass = ["affiliation-card", affiliation.className].filter(Boolean).join(" ");
	const hasTitleLinks = Boolean(affiliation.titleSegments);
	const card = createEl(
		hasTitleLinks ? "div" : "a",
		cardClass,
		hasTitleLinks
			? {}
			: {
					href: affiliation.url,
					target: "_blank",
					rel: "noopener noreferrer",
					"aria-label": affiliation.name,
				}
	);
	const logoWrap = createEl("span", "affiliation-logo-wrap");
	const isDark = document.documentElement.dataset.theme === "dark";
	const logo = createEl("img", "affiliation-logo", {
		src: isDark && affiliation.darkImage ? affiliation.darkImage : affiliation.image,
		alt: affiliation.name,
		loading: "lazy",
		"data-light-src": affiliation.darkImage ? affiliation.image : undefined,
		"data-dark-src": affiliation.darkImage,
	});
	if (hasTitleLinks) {
		const logoLink = createEl("a", "affiliation-logo-link", {
			href: affiliation.url,
			target: "_blank",
			rel: "noopener noreferrer",
			"aria-label": affiliation.name,
		});
		logoLink.append(logo);
		logoWrap.append(logoLink);
	} else {
		logoWrap.append(logo);
	}

	const label = createEl("span", "affiliation-label");
	if (affiliation.titleSegments) {
		appendSegments(label, affiliation.titleSegments);
	} else {
		label.textContent = affiliation.title;
	}
	const date = createEl("span", "affiliation-date");
	date.textContent = affiliation.date;
	card.append(logoWrap, label, date);
	return card;
};

const buildAffiliationsSection = () => {
	const section = createEl("section", "affiliations-section");
	const list = createEl("div", "affiliations-list");
	affiliations.forEach((affiliation) => {
		list.append(buildAffiliation(affiliation));
	});
	section.append(list);
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
	abstractWrap.textContent = publication.abstract || "";

	content.append(title, authors, venueRow, tags, abstractWrap);
	article.append(content);
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

const getProjectVisualType = (title = "") => {
	const key = title.toLowerCase();
	if (key.includes("gpt")) {
		return "tokens";
	}
	if (key.includes("rag")) {
		return "retrieval";
	}
	if (key.includes("vision") || key.includes("cook")) {
		return "vision";
	}
	if (key.includes("arena")) {
		return "arena";
	}
	if (key.includes("whisper")) {
		return "audio";
	}
	return "default";
};

const buildProjectVisual = (project) => {
	const type = getProjectVisualType(project.title);
	const visual = createEl("div", `project-visual project-visual-${type}`, {
		"aria-hidden": "true",
	});

	if (project.image) {
		const image = createEl("img", "project-image", {
			src: project.image,
			alt: "",
		});
		visual.append(image);
		return visual;
	}

	if (type === "tokens") {
		const input = createEl("span", "visual-gpt-chip visual-gpt-input");
		input.textContent = "text";
		const transformer = createEl("span", "visual-gpt-block");
		transformer.textContent = "transformer";
		const output = createEl("span", "visual-gpt-chip visual-gpt-output");
		output.textContent = "next token";
		const loop = createEl("span", "visual-gpt-loop");
		visual.append(input, transformer, output, loop);
		return visual;
	}

	if (type === "retrieval") {
		const pdf = createEl("span", "visual-rag-pdf");
		pdf.textContent = "PDF";

		const chunks = createEl("span", "visual-rag-image-chunks");
		for (let index = 0; index < 3; index += 1) {
			const chunk = createEl("span", "visual-rag-image-chunk");
			chunks.append(chunk);
		}

		const database = createEl("span", "visual-rag-image-db");
		database.textContent = "img db";

		const prompt = createEl("span", "visual-rag-prompt");
		prompt.textContent = "prompt";

		const retrieved = createEl("span", "visual-rag-retrieved");
		for (let index = 0; index < 3; index += 1) {
			const chunk = createEl("span", "visual-rag-retrieved-chunk");
			retrieved.append(chunk);
		}

		const answer = createEl("span", "visual-rag-answer");
		answer.textContent = "response";
		const flow = createEl("span", "visual-rag-flow");
		visual.append(pdf, chunks, database, prompt, retrieved, answer, flow);
		return visual;
	}

	if (type === "vision") {
		const lens = createEl("span", "visual-lens");
		const plate = createEl("span", "visual-plate");
		const ingredientA = createEl("span", "visual-ingredient visual-ingredient-a");
		const ingredientB = createEl("span", "visual-ingredient visual-ingredient-b");
		visual.append(lens, plate, ingredientA, ingredientB);
		return visual;
	}

	if (type === "arena") {
		["A", "B"].forEach((label) => {
			const contender = createEl("span", "visual-contender");
			contender.textContent = label;
			visual.append(contender);
		});
		const score = createEl("span", "visual-score");
		visual.append(score);
		return visual;
	}

	if (type === "audio") {
		for (let index = 0; index < 14; index += 1) {
			const bar = createEl("span", "visual-wave");
			bar.style.setProperty("--wave-index", index);
			visual.append(bar);
		}
		return visual;
	}

	const pulse = createEl("span", "visual-pulse");
	visual.append(pulse);
	return visual;
};

const buildProject = (project) => {
	const article = createEl("article", "project-card");
	article.append(buildProjectVisual(project));

	const body = createEl("div", "project-body");
	const title = createEl("h3", "project-title");
	const titleLink = createEl("a", "", {
		href: project.url,
		target: "_blank",
		rel: "noopener noreferrer",
	});
	titleLink.textContent = project.title;
	const externalIcon = createEl("span", "project-external-icon");
	externalIcon.innerHTML = `
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
			<path d="M5 5h6v2H7v10h10v-4h2v6H5V5z" />
		</svg>
	`;
	titleLink.append(document.createTextNode(" "), externalIcon);
	title.append(titleLink);

	const stack = createEl("p", "project-stack");
	stack.textContent = (project.tags || []).join(", ");

	const description = createEl("p", "project-description");
	description.textContent = project.description;

	body.append(title, stack, description);
	if ((project.description || "").length > 95) {
		const toggle = createEl("button", "project-description-toggle", { type: "button" });
		toggle.textContent = "see more";
		toggle.addEventListener("click", () => {
			const isExpanded = article.classList.toggle("is-expanded");
			toggle.textContent = isExpanded ? "see less" : "see more";
		});
		body.append(toggle);
	}
	article.append(body);
	return article;
};

const buildProjectsSection = () => {
	const section = createEl("section", "projects-section", { id: "projects" });
	const title = createEl("div", "section-title");
	title.textContent = "Projects";
	const list = createEl("div", "project-list");
	projects.forEach((project) => {
		list.append(buildProject(project));
	});
	section.append(title, list);
	return section;
};

const buildFooter = () => {
	const footer = document.createElement("footer");
	const credit = createEl("p", "footer-note");
	appendSegments(credit, templateCredits);
	footer.append(credit);
	return footer;
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
		buildAvailabilityLine(),
		buildContactLine(),
		buildNewsSection(),
		buildAffiliationsSection(),
		buildPublicationSection(),
		// buildProjectsSection(),
		buildFooter()
	);
	main.append(...children);
	mount.replaceChildren(main);
};

applyTheme(getPreferredTheme());
renderPortfolio();
