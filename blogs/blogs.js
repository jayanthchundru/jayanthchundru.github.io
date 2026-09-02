import { buildPageHeader, createEl } from "../subpage.js";

const main = document.createElement("main");
const topics = createEl("section", "blog-intro", { "aria-label": "Blog topics" });
const topicList = createEl("ul", "topic-list", { "aria-label": "Blog topics" });
const selectedTopic = new URLSearchParams(window.location.search).get("topic");
[
	["Projects", "projects"],
	["Large Language Models", "large-language-models"],
	["Multimodal AI", "multimodal-ai"],
	["Machine Learning", "machine-learning"],
].forEach(([topic, slug]) => {
	const item = document.createElement("li");
	const tag = createEl("a", "", { href: `?topic=${slug}` });
	if (slug === selectedTopic) tag.setAttribute("aria-current", "true");
	tag.textContent = topic;
	item.append(tag);
	topicList.append(item);
});
topics.append(topicList);
main.append(buildPageHeader("Blogs", "blogs"), topics);
document.getElementById("app").replaceChildren(main);
