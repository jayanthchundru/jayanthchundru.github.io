import { projects } from "../content.js";

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

const buildNavRow = () => {
	const nav = createEl("nav", "nav-row");
	[
		{ label: "Research", href: "../#publications" },
		{ label: "Projects", href: "./" },
		{ label: "Blogs", href: "../blogs/" },
	].forEach((item) => {
		const link = createEl("a", "", { href: item.href });
		link.textContent = item.label;
		nav.append(link);
	});
	return nav;
};

const buildHeader = () => {
	const header = document.createElement("header");
	const title = document.createElement("h1");
	title.textContent = "Projects";
	header.append(title /*, buildNavRow() */);
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

	const description = createEl("p", "pub-abstract");
	description.textContent = project.description;

	const tags = createEl("div", "pub-tags");
	(project.tags || []).forEach((tag) => {
		const chip = createEl("span", "pub-tag");
		chip.textContent = `#${tag}`;
		tags.append(chip);
	});

	const linkRow = createEl("div", "pub-links");
	(project.links || []).forEach((link) => {
		const anchor = createEl("a", "", {
			href: link.href,
			target: "_blank",
			rel: "noopener noreferrer",
		});
		anchor.textContent = link.label;
		linkRow.append(anchor);
	});

	article.append(title, description, tags, linkRow);
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
	main.append(buildHeader(), buildIntro(), buildProjectsSection(), buildBackLink());
	mount.replaceChildren(main);
};

renderProjectsPage();
