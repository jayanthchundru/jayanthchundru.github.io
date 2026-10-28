import { buildPageHeader, createEl } from "../subpage.js";

const main = document.createElement("main");
const message = createEl("p", "byline");
message.textContent = "Coming soon…";
main.append(buildPageHeader("Blogs", "blogs"), message);
document.getElementById("app").replaceChildren(main);
