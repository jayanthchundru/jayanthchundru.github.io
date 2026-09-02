export const createEl = (tag, className = "", attrs = {}) => {
	const element = document.createElement(tag);
	if (className) element.className = className;
	Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
	return element;
};

const buildThemeToggle = () => {
	const button = createEl("button", "theme-toggle", { type: "button" });
	const sync = () => {
		const isDark = document.documentElement.dataset.theme === "dark";
		button.innerHTML = isDark
			? `<svg class="theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5.2"/><path d="M12 1.8v3M12 19.2v3M4.78 4.78l2.12 2.12M17.1 17.1l2.12 2.12M1.8 12h3M19.2 12h3M4.78 19.22l2.12-2.12M17.1 6.9l2.12-2.12"/></svg>`
			: `<svg class="theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 14.4A7.7 7.7 0 0 1 9.6 3.1a9.4 9.4 0 1 0 11.3 11.3 7.65 7.65 0 0 1-3.1 0z"/></svg>`;
		button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
		button.setAttribute("aria-pressed", String(isDark));
	};
	button.addEventListener("click", () => {
		const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
		document.documentElement.dataset.theme = theme;
		try { localStorage.setItem("portfolio-theme", theme); } catch (error) {}
		sync();
	});
	sync();
	return button;
};

export const buildPageHeader = (titleText, currentPage) => {
	const header = document.createElement("header");
	const title = document.createElement("h1");
	title.textContent = titleText;
	const nav = createEl("nav", "nav-row", { "aria-label": "Primary" });
	const pages = [["Home", "../", "home"], ["Research", "../research/", "research"], ["Blogs", "../blogs/", "blogs"], ["Gallery", "../gallery/", "gallery"]];
	pages.forEach(([label, href, page], index) => {
		if (index) {
			const separator = createEl("span", "nav-separator", { "aria-hidden": "true" });
			separator.textContent = "·";
			nav.append(separator);
		}
		const link = createEl("a", "", { href });
		if (page === currentPage) link.setAttribute("aria-current", "page");
		link.textContent = label;
		nav.append(link);
	});
	const separator = createEl("span", "nav-separator", { "aria-hidden": "true" });
	separator.textContent = "·";
	nav.append(separator, buildThemeToggle());
	header.append(title, nav);
	return header;
};
