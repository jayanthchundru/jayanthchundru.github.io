export const profile = {
	name: "Jayanth Krishna Chundru",
	location: "Cincinnati, OH",
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
		href: "https://srmrmp.edu.in/academics/department-of-computer-science-and-engineering/",
	},
	{
		type: "text",
		value:
			", Chennai, and received a Silver Medal for academic excellence in the 2023 graduating class.  ",
	},
];

export const contactLinks = [
	{ label: "chundrja@mail.uc.edu", href: "mailto:chundrja@mail.uc.edu" },
	{ label: "LinkedIn", href: "https://www.linkedin.com/in/jayanthchundru/" },
	{
		label: "Google Scholar",
		href: "https://scholar.google.com/citations?user=BZPUimsAAAAJ&hl=en",
	},
	{ label: "GitHub", href: "https://github.com/jayanthchundru" },
];

export const newsItems = [
	{
		date: "Apr 2026",
		segments: [
			{ type: "text", value: "Received " },
			{ type: "strong", value: "Best Master's Student Award 2026" },
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
			{ type: "text", value: "Paper accepted to " },
			{
				type: "link",
				label: "EMNLP 2025",
				href: "https://aclanthology.org/2025.emnlp-main.1499/",
				className: "news-link",
			},
			{ type: "text", value: "." },
		],
	},
	{
		date: "May 2025",
		segments: [
			{ type: "text", value: "Joined " },
			{ type: "link", label: "Procter & Gamble", href: "https://us.pg.com/", className: "news-link" },
			{ type: "text", value: " (UC Digital Accelerator Program) as a Research Assistant." },
		],
	},
	{
		date: "Aug 2024",
		segments: [
			{ type: "text", value: "Moved to the " },
			{ type: "text", value: "United States" },
			{ type: "text", value: " to begin my master's degree." },
		],
	},
	{
		date: "May 2023",
		segments: [
			{ type: "text", value: "Continued at " },
			{ type: "link", label: "CommScope", href: "https://www.commscope.com/", className: "news-link" },
			{ type: "text", value: " as a Software Engineer." },
		],
	},
	{
		date: "May 2023",
		segments: [
			{ type: "text", value: "Graduated with a " },
			{ type: "strong", value: "Silver Medal" },
			{ type: "text", value: " in the 2023 Bachelor's degree cohort." },
		],
	},
	{
		date: "Jul 2022",
		segments: [
			{ type: "text", value: "Started a software engineering internship at " },
			{ type: "link", label: "CommScope", href: "https://www.commscope.com/", className: "news-link" },
			{ type: "text", value: ", Bangalore." },
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
			"We investigate whether large language models encode latent knowledge of frame semantics, focusing on frame identification, a core challenge in frame semantic parsing that involves selecting the appropriate semantic frame for a target word in context. Using the FrameNet lexical resource, we evaluate models under prompt-based inference and observe that they can perform frame identification effectively even without explicit supervision. To assess the impact of task-specific training, we fine-tune the model on FrameNet data, which substantially improves in-domain accuracy while generalizing well to out-of-domain benchmarks. Further analysis shows that the models can generate semantically coherent frame definitions, highlighting the model's internalized understanding of frame semantics.",
	},
];