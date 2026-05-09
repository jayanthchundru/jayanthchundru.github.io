import { projects } from "../content.js";

const parseGitHubRepo = (url) => {
	const match = (url || "").match(/github\.com\/([^/]+)\/([^/?#]+)/);
	if (!match) {
		return null;
	}
	return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
};

const repoMetaCache = new Map();
const fetchRepoMeta = async ({ owner, repo }) => {
	const key = `${owner}/${repo}`;
	if (repoMetaCache.has(key)) {
		return repoMetaCache.get(key);
	}
	try {
		const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
		if (!res.ok) {
			repoMetaCache.set(key, null);
			return null;
		}
		const data = await res.json();
		repoMetaCache.set(key, data);
		return data;
	} catch (err) {
		repoMetaCache.set(key, null);
		return null;
	}
};

const formatCount = (n) => {
	if (n >= 1000) {
		return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
	}
	return String(n);
};

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

const buildNavRow = (items) => {
	const nav = createEl("nav", "nav-row");
	items.forEach((item) => {
		const link = createEl("a", "", { href: item.href });
		link.textContent = item.label;
		nav.append(link);
	});
	return nav;
};

const buildTopHomeLink = () => {
	const line = createEl("p", "contact-line");
	const home = createEl("a", "", { href: "../" });
	home.textContent = "← Home";
	line.append(home);
	return line;
};

const buildHeader = () => {
	const header = document.createElement("header");
	const title = document.createElement("h1");
	title.textContent = "Projects";
	header.append(title);
	return header;
};

const buildIntro = () => {
	const intro = createEl("p", "intro-note");
	intro.textContent =
		"A few side projects exploring large language models, multimodal agents, and efficient inference. Most of these started as weekend curiosities and ended up useful enough to keep around.";
	return intro;
};

const buildBackLink = () => {
	const line = createEl("p", "contact-line");
	const home = createEl("a", "", { href: "../" });
	home.textContent = "← Home";
	line.append(home);
	return line;
};

const GITHUB_ICON_SVG = `
	<svg viewBox="0 0 16 16" aria-hidden="true">
		<path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
	</svg>
`;

const buildRepoCard = (repoInfo, project) => {
	const card = createEl("a", "repo-card", {
		href: project.url,
		target: "_blank",
		rel: "noopener noreferrer",
	});

	const head = createEl("div", "repo-card-head");
	const icon = createEl("span", "repo-card-icon");
	icon.innerHTML = GITHUB_ICON_SVG;
	const titleLine = createEl("span", "repo-card-title");
	const owner = createEl("span", "repo-card-owner");
	owner.textContent = repoInfo.owner;
	const slash = document.createTextNode(" / ");
	const repoName = createEl("span", "repo-card-name");
	repoName.textContent = repoInfo.repo;
	titleLine.append(owner, slash, repoName);
	head.append(icon, titleLine);

	const desc = createEl("p", "repo-card-desc");
	desc.textContent = project.description || "Loading repository details…";

	const meta = createEl("div", "repo-card-meta");

	card.append(head, desc, meta);
	return card;
};

const hydrateRepoCard = async (card, repoInfo, project) => {
	const desc = card.querySelector(".repo-card-desc");
	const meta = card.querySelector(".repo-card-meta");
	const data = await fetchRepoMeta(repoInfo);

	if (!data) {
		card.classList.add("is-unavailable");
		desc.textContent = project.description || "Repository not available.";
		return;
	}

	desc.textContent = data.description || project.description || "";

	meta.replaceChildren();
	if (data.language) {
		const lang = createEl("span", "repo-card-lang");
		const dot = createEl("span", "repo-card-lang-dot");
		const label = createEl("span");
		label.textContent = data.language;
		lang.append(dot, label);
		meta.append(lang);
	}
	if (typeof data.stargazers_count === "number") {
		const stars = createEl("span", "repo-card-stat");
		stars.textContent = `★ ${formatCount(data.stargazers_count)}`;
		meta.append(stars);
	}
	if (typeof data.forks_count === "number" && data.forks_count > 0) {
		const forks = createEl("span", "repo-card-stat");
		forks.textContent = `⑂ ${formatCount(data.forks_count)}`;
		meta.append(forks);
	}
};

const buildProject = (project) => {
	const article = createEl("article", "project-item");

	const title = createEl("h3", "pub-title");
	if (project.url) {
		const link = createEl("a", "", {
			href: project.url,
			target: "_blank",
			rel: "noopener noreferrer",
		});
		link.textContent = project.title;
		title.append(link);
	} else {
		title.textContent = project.title;
	}
	article.append(title);

	const repoInfo = parseGitHubRepo(project.url);
	if (repoInfo) {
		const cardWrap = createEl("div", "repo-card-wrap");
		const card = buildRepoCard(repoInfo, project);
		cardWrap.append(card);
		article.append(cardWrap);

		hydrateRepoCard(card, repoInfo, project);
	} else if (project.description) {
		const description = createEl("p", "pub-abstract");
		description.textContent = project.description;
		article.append(description);
	}

	if ((project.tags || []).length) {
		const tags = createEl("div", "pub-tags");
		project.tags.forEach((tag) => {
			const chip = createEl("span", "pub-tag");
			chip.textContent = `#${tag}`;
			tags.append(chip);
		});
		article.append(tags);
	}

	if ((project.links || []).length) {
		const linkRow = createEl("div", "pub-links");
		project.links.forEach((link) => {
			const anchor = createEl("a", "", {
				href: link.href,
				target: "_blank",
				rel: "noopener noreferrer",
			});
			anchor.textContent = link.label;
			linkRow.append(anchor);
		});
		article.append(linkRow);
	}

	return article;
};

const buildProjectsSection = () => {
	const section = createEl("section", "list-block");
	const list = createEl("div", "pub-list");
	projects.forEach((project) => {
		list.append(buildProject(project));
	});
	section.append(list);
	return section;
};

const renderProjectsPage = () => {
	const mount = document.getElementById("app");
	if (!mount) {
		return;
	}
	const main = document.createElement("main");
	main.append(buildTopHomeLink(), buildHeader(), buildIntro(), buildProjectsSection(), buildBackLink());
	mount.replaceChildren(main);
};

renderProjectsPage();
