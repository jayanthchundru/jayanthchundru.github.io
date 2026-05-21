export const profile = {
	name: "Jayanth Krishna Chundru",
	location: "Cincinnati, OH",
	availability: "Looking for full-time opportunities in AI/ML roles",
	image: "images/Jayanth.jpeg",
};

export const introSegments = [
	{ type: "text", value: "Thanks for visiting ! I'm an MS Computer Science student at the " },
	{
		type: "link",
		label: "University of Cincinnati",
		href: "https://www.uc.edu/",
	},
	{
		type: "text",
		value:
			". I work on large language models, multimodal agents, and efficient inference methods. I am currently advised by ",
	},
	{
		type: "link",
		label: "Prof. Tianyu Jiang",
		href: "https://jiangtianyu.com/",
	},
	{ type: "text", value: " at " },
	{
		type: "link",
		label: "CincyNLP",
		href: "https://jiangtianyu.com/lab/",
	},
	{
		type: "text",
		value:
			" lab. Before graduate school, I worked as a Software Engineer at ",
	},
	{
		type: "link",
		label: "CommScope",
		href: "https://www.commscope.com/",
	},
	{ type: "text", value: " in Bangalore, India. I earned my bachelor's degree in Computer Science from " },
	{
		type: "link",
		label: "SRMIST Ramapuram",
		href: "https://srmrmp.edu.in/",
	},
	{
		type: "text",
		value:
			", Chennai, and received a Silver Medal for academic excellence in the 2023 graduating class.  ",
	},
];

export const contactLinks = [
	{ label: "Email", href: "mailto:chundrja@mail.uc.edu" },
	{ label: "LinkedIn", href: "https://www.linkedin.com/in/jayanthchundru/" },
	{ label: "GitHub", href: "https://github.com/jayanthchundru" },
	{
		label: "Google Scholar",
		href: "https://scholar.google.com/citations?user=BZPUimsAAAAJ&hl=en",
	},
];

export const affiliations = [
	{
		name: "1819 Innovation Hub",
		title: "Research Assistant (P&G)",
		titleSegments: [
			{ type: "text", value: "Research Assistant (" },
			{
				type: "link",
				label: "P&G",
				href: "https://us.pg.com/",
				className: "affiliation-label-link",
			},
			{ type: "text", value: ")" },
		],
		date: "May '25 - Present",
		image: "images/innovationhub.png",
		darkImage: "images/innovationhub.D.png",
		url: "https://innovation.uc.edu/",
	},
	{
		name: "CincyNLP",
		title: "Graduate Researcher",
		date: "Aug '24 - Present",
		image: "images/CincyNLP.png",
		url: "https://jiangtianyu.com/lab/",
	},
	{
		name: "University of Cincinnati",
		title: "M.S. Computer Science",
		date: "Aug '24 - Present",
		image: "images/UC.png",
		url: "https://www.uc.edu/",
	},
	{
		name: "CommScope",
		title: "Software Engineer",
		date: "July '22 - July '24",
		image: "images/COMM.png",
		darkImage: "images/COMM.D.png",
		url: "https://www.commscope.com/",
	},
	{
		name: "SRMIST Ramapuram",
		title: "B.Tech CSE",
		date: "July '19 - May '23",
		image: "images/SRM.png",
		url: "https://srmrmp.edu.in/",
	},
];

export const templateCredits = [
	{ type: "text", value: "© 2026 Jayanth Krishna Chundru. " },
	{ type: "text", value: "Website design ideas borrowed from ", className: "footer-credit-extra" },
	{
		type: "link",
		label: "al-folio",
		href: "https://github.com/alshedivat/al-folio",
		className: "footer-credit-extra",
	},
	{ type: "text", value: " and ", className: "footer-credit-extra" },
	{
		type: "link",
		label: "Jon Barron's website",
		href: "https://jonbarron.info/",
		className: "footer-credit-extra",
	},
	{ type: "text", value: ", with my own tweaks.", className: "footer-credit-extra" },
];

export const newsItems = [
		{
		date: "Apr 2026",
		segments: [
			{ type: "text", value: "Got Admission in " },
			{
				type: "link",
				label: "Machine Learning Summer School 2026 ",
				href: "https://cfe.columbia.edu/content/mlss2",
				className: "news-link",
			},
			{ type: "text", value: " NYC 🗽 at" },
			{type : "strong", value: " Columbia University"},
			{ type: "text", value: "." },
		],
	},

	{
		date: "Apr 2026",
		segments: [
			{ type: "text", value: "Received " },
			{ type: "strong", value: "Best Master's Student Award 2026 🏆" },
			{ type: "text", value: " from the " },
			{
				type: "link",
				label: "Computer Science Department",
				href: "https://www.ceas.uc.edu/academics/departments/computer-science.html",
				className: "news-link",
			},
			{ type: "text", value: "." },
		],
	},
	{
		date: "Aug 2025",
		segments: [
			{ type: "text", value: "Paper on Frame Semantics got accepted to " },
			{
				type: "link",
				label: "EMNLP 2025",
				href: "https://aclanthology.org/2025.emnlp-main.1499/",
				className: "news-link",
			},
			{ type: "text", value: " in Suzhou, China 🇨🇳." },
		],
	},
	{
		date: "May 2025",
		segments: [
			{ type: "text", value: "Joined UC Digital Accelerator Program " },
			{ type: "link", label: "(Procter & Gamble)", href: "https://us.pg.com/", className: "news-link" },
			{ type: "text", value: "  as a Research Assistant 🔍." },
		],
	},
	{
		date: "Aug 2024",
		segments: [
			{ type: "text", value: "Moved to the " },
			{ type: "text", value: "United States ✈️" },
			{ type: "text", value: " to begin my master's degree." },
		],
	},
	{
		date: "May 2023",
		segments: [
			{ type: "text", value: "Continued at " },
			{ type: "link", label: "CommScope", href: "https://www.commscope.com/", className: "news-link" },
			{ type: "text", value: " as a Software Engineer 👨‍💻." },
		],
	},
	{
		date: "May 2023",
		segments: [
			{ type: "text", value: "Graduated with a " },
			{ type: "strong", value: "Silver Medal 🥈" },
			{ type: "text", value: "  (2nd Ranker) in the 2023 Bachelor's degree cohort." },
		],
	},
	{
		date: "Jul 2022",
		segments: [
			{ type: "text", value: "Started a software engineering internship at " },
			{ type: "link", label: "CommScope", href: "https://www.commscope.com/", className: "news-link" },
			{ type: "text", value: ", Bangalore 👨‍💻." },
		],
	},
];

export const publications = [
	{
		title: "Do LLMs Encode Frame Semantics? Evidence From Frame Identification",
		url: "https://aclanthology.org/2025.emnlp-main.1499.pdf",
		authors: "Jayanth Krishna Chundru, Rudrashis Poddar, Jie Cao, Tianyu Jiang",
		venue: "EMNLP 2025",
		links: [
			{ label: "[paper]", href: "https://aclanthology.org/2025.emnlp-main.1499/" },
			{ label: "[code]", href: "https://github.com/cincynlp/FrameID" },
		],
		thumb: "images/EMNLP2025_FrameIdentification.png",
		tags: ["LLMs", "Computational Semantics"],
		abstract:
			"Evaluated LLMs inherent frame-semantic knowledge on the FrameNet dataset using the Frame Identification task, where structured prompting techniques, frame-definition generation experiments, and further fine-tuning on the Llama 3.1 8B model showed strong in-domain performance and cross-domain generalization.",
	},
];

export const projects = [
	{
		title: "Mini-GPT",
		url: "https://github.com/jayanthchundru/GPT-from-scratch",
		image: "images/mini-gpt.png",
		description:
			"GPT language model built from scratch in PyTorch, with tokenization, causal self-attention, transformer blocks, and autoregressive next-token generation.",
		tags: ["PyTorch", "Transformers", "Self-Attention"],
		links: [
			{ label: "[code]", href: "https://github.com/jayanthchundru/GPT-from-scratch" },
			{ label: "[notes]", href: "https://github.com/jayanthchundru/specgen#readme" },
		],
	},
	{
		title: "Multimodal-RAG",
		url: "https://github.com/jayanthchundru/multimodal-rag.git",
		description:
			"Multimodal RAG pipeline that combines vision-language retrieval (ColQwen2) with Meta’s Llama 3.2 Vision to enable efficient question answering over visually rich documents like PDFs, tables, charts, and scanned pages without relying solely on OCR.",
		tags: ["Embeddings", "ColQwen", "Llama"],
		links: [{ label: "[code]", href: "https://github.com/jayanthchundru/multimodal-rag.git" }],
	},
	{
		title: "FastAPI-Projects",
		url: "https://github.com/jayanthchundru/FastAPI-Projects",
		image: "images/fastapi.png",
		description:
			"FastAPI applications ranging from CRUD systems to RAG pipelines, integrating authentication, WebSockets, Celery-based async processing, ML model serving, and vector search for real-time AI-powered applications.",
		tags: ["APIs", "Python", "Inference"],
		links: [
			{ label: "[code]", href: "https://github.com/jayanthchundru/FastAPI-Projects" }
		],
	}
];
