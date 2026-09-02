import { buildPageHeader } from "../subpage.js";

const main = document.createElement("main");
main.append(buildPageHeader("Research", "research"));
document.getElementById("app").replaceChildren(main);
