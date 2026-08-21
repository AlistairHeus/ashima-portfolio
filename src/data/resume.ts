/**
 * Resume content mirrored from the downloadable PDF.
 * Keep in sync when the PDF is updated.
 */

export interface ResumeContact {
	readonly email: string;
	readonly phone: string;
	readonly phoneHref: string;
	readonly portfolioLabel: string;
	readonly portfolioHref: string;
	readonly location?: string;
}

export interface ResumeBulletGroup {
	readonly title?: string;
	readonly bullets: readonly string[];
}

export interface ResumeRole {
	readonly org: string;
	readonly location?: string;
	readonly title: string;
	readonly dates: string;
	readonly groups: readonly ResumeBulletGroup[];
}

export interface ResumeEducation {
	readonly school: string;
	readonly location?: string;
	readonly degree: string;
	readonly field: string;
	readonly dates: string;
}

export interface ResumeAward {
	readonly title: string;
	readonly detail: string;
	readonly body?: string;
}

export interface ResumeCertification {
	readonly issuer: string;
	readonly year: string;
	readonly courses: readonly string[];
}

export const resumePdfFilename = 'Ashima Kaushik_Resume.pdf';
export const resumePdfHref = `/resume/${encodeURIComponent(resumePdfFilename)}`;

export const resumeContact: ResumeContact = {
	email: 'ashimakaushik.design@gmail.com',
	phone: '+91 98106 96196',
	phoneHref: 'tel:+919810696196',
	portfolioLabel: 'ashimakaushik.in',
	portfolioHref: 'https://www.ashimakaushik.in',
};

export const resumeRoles: readonly ResumeRole[] = [
	{
		org: 'Tata Elxsi',
		location: 'Bengaluru',
		title: 'Designer',
		dates: 'Jul 2023 – Feb 2025',
		groups: [
			{
				title: 'Brand Identity & Strategy',
				bullets: [
					'Extended Air India’s brand identity across 83 airports globally, designing boarding pass, customer experience and brand guidelines to ensure cohesive implementation.',
					'Led the end-to-end rebranding of a leading Indian natural gas distribution company, delivering comprehensive strategy and guidelines for the new identity.',
					'Crafted strategic proposal decks, converting user research and stakeholder insights into impactful design solutions aligned with business objectives.',
				],
			},
			{
				title: 'Environmental Graphics & Immersive Experiences',
				bullets: [
					'Designed user journeys and environmental graphics for experience centers and corporate spaces for clients to enhance customer experience and brand presence.',
					'Cross-functional collaboration in the creation of a virtual museum for a leading aviation company, managing end-to-end curation, research, and design of engaging visuals.',
				],
			},
			{
				title: 'Collaboration & Innovation',
				bullets: [
					'Conducted 7+ design thinking workshops for cross-functional teams, fostering innovation through collaborative brainstorming sessions.',
					'Partnered with print production vendors to ensure 100% accurate execution across all print deliverables.',
				],
			},
		],
	},
	{
		org: 'Self Employed',
		location: 'Remote',
		title: 'Freelance Designer',
		dates: 'Jan 2023 – Present',
		groups: [
			{
				bullets: [
					'Provided tailored and impactful design solutions for clients contributing to their visual identity and market presence (logos, brand identity design, packaging).',
				],
			},
		],
	},
	{
		org: 'Ishan Khosla Design Studio',
		location: 'Dehradun',
		title: 'Junior Visual Designer',
		dates: 'Jun 2022 – Jan 2023',
		groups: [
			{
				bullets: [
					'Developed and digitized a highly illustrative Devanagari typeface, consisting of 110+ unique letterforms based on folk art.',
					'Designed book covers and editorial projects for clients like Harper Collins and Institut Français and Alkazi Foundation.',
					'Led a team of 6 interns, improving project efficiency by 30%, and ensured on-time delivery of high-quality print deliverables.',
				],
			},
		],
	},
	{
		org: 'The Typecraft Initiative',
		location: 'Dehradun',
		title: 'Graduation Project Intern',
		dates: 'Jan 2022 – May 2022',
		groups: [
			{
				bullets: [
					'Developed engaging typographic illustrations for a Hindi teaching aid for children, fostering a deeper connection between language learning and cultural storytelling.',
					'Organised design methodology workshops and knowledge-sharing sessions, fostering a collaborative culture across folk artists, vernacular experts and designers.',
					'Owned the design journey, from brainstorming concepts to final execution.',
					'User research (remote & field studies) and usability tests informed my decisions, resulting in engaging and effective pedagogical strategies.',
				],
			},
		],
	},
	{
		org: 'SEWA (Self Employed Women’s Association) NGO',
		location: 'Remote',
		title: 'Product Development Intern',
		dates: 'Jul 2021 – Sep 2021',
		groups: [
			{
				bullets: [
					'Designed 15 hand-stitched embroidered products, aligning with market trends and consumer preferences, in collaboration with Gujarat’s appliqué and embroidery artisans.',
				],
			},
		],
	},
	{
		org: 'Centre for Public Policy and Good Governance, Uttarakhand',
		location: 'Remote',
		title: 'Design Intern',
		dates: 'Jun 2020 – Jul 2020',
		groups: [
			{
				bullets: [
					'Collaborated with team members to design posters and merchandise to promote Sustainable Development Goals for the Government of Uttarakhand.',
				],
			},
		],
	},
] as const;

export const resumeEducation: ResumeEducation = {
	school: 'UPES',
	location: 'Dehradun',
	degree: 'B. Des.',
	field: 'Visual Communication & Media',
	dates: '2018 – 2022',
};

export const resumeTools: readonly string[] = [
	'Illustrator',
	'Photoshop',
	'InDesign',
	'Figma',
	'Miro',
	'Glyphs',
	'MS Office',
] as const;

export const resumeStrengths: readonly string[] = [
	'Design Thinking',
	'Research',
	'Brand Identity',
	'Typography',
	'Logo Design',
	'Editorial Design',
	'Conceptualisation',
	'Colour Theory',
	'Environmental Graphics',
	'Vector Illustration',
	'Storytelling & Narrative',
	'Facilitating workshops',
] as const;

export const resumeAwards: readonly ResumeAward[] = [
	{
		title: 'Akshar-Chitra',
		detail: 'Academic Paper for Typoday 2022',
		body: 'Contributed research and insights for “Type made with folk art as visual mnemonics to enhance the teaching learning of Hindi” by Ishan Khosla.',
	},
	{
		title: 'Toycathon 2021',
		detail: 'Selected for Grand Finale',
		body: 'Research, conceptualisation and visual identity of a board game for visually impaired and sighted people.',
	},
] as const;

export const resumeCertifications: readonly ResumeCertification[] = [
	{
		issuer: 'Google',
		year: '2023',
		courses: [
			'Foundations of UX Design',
			'UX Design Process',
			'Build Wireframes & Prototypes',
		],
	},
	{
		issuer: 'Museum of Modern Art',
		year: '2020',
		courses: [
			'Modern Art and Ideas',
			'Art and Activity: Interactive Strategies for Engaging with Art',
		],
	},
] as const;
