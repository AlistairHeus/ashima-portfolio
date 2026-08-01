/**
 * Work page project catalogue (Figma Work Page_Final, 149:558).
 * Data only — presentation lives in ProjectCard / work page sections.
 */

export interface WorkProject {
	readonly id: string;
	readonly number: string;
	readonly title: string;
	readonly description: string;
	readonly imageSrc: string;
	readonly imageAlt: string;
	readonly chips: readonly string[];
	readonly href?: string;
}

/** Case studies — first grid (01–04). */
export const caseStudies: readonly WorkProject[] = [
	{
		id: 'air-india-brand',
		number: '01',
		title: 'Air India: Brand Extension',
		description:
			"Scaling Air India's new visual identity across passenger touchpoints to create a consistent experience across 83+ airports.",
		imageSrc: '/images/work/01-air-india.png',
		imageAlt: 'Air India brand extension touchpoint collage',
		chips: ['Brand Systems', 'Brand Experience', 'Print Design'],
		href: '/work',
	},
	{
		id: 'igl',
		number: '02',
		title: 'Rebranding IGL',
		description:
			'Reimagining a legacy energy brand through strategy-led identity design, balancing familiarity with a vision for sustainable growth.',
		imageSrc: '/images/work/02-igl.png',
		imageAlt: 'Indraprastha Gas Limited rebrand visual',
		chips: ['Brand Strategy', 'Visual Identity', 'Brand Systems'],
		href: '/work',
	},
	{
		id: 'mythila',
		number: '03',
		title: 'Mythila Display Typeface',
		description:
			'A collaborative Devanagari display typeface that transforms hand-drawn Mithila artwork into a cohesive digital type system.',
		imageSrc: '/images/work/03-mythila.png',
		imageAlt: 'Mythila Devanagari display typeface specimens',
		chips: [
			'Typeface Design',
			'Letterform Development',
			'Cultural Design',
			'Digitization',
		],
		href: '/work/mythila',
	},
	{
		id: 'akshar-chitra',
		number: '04',
		title: 'Akshar Chitra',
		description:
			'Redefining the Hindi Primer through integrated letterforms and illustrations, making early literacy more intuitive & culturally rooted.',
		imageSrc: '/images/work/04-akshar-chitra.png',
		imageAlt: 'Akshar Chitra Hindi primer design',
		chips: ['Research', 'Educational Design', 'Typography', 'Illustration'],
		href: '/work',
	},
] as const;

/** Other projects — second grid (05–10). */
export const otherWorkProjects: readonly WorkProject[] = [
	{
		id: 'maahi',
		number: '05',
		title: 'Maahi: Logo Design',
		description:
			'Creating a brand identity for Maahi, a bridalwear label by reimagining heirloom textiles through contemporary design.',
		imageSrc: '/images/work/05-maahi.png',
		imageAlt: 'Maahi bridalwear logo and identity',
		chips: [
			'Logo Design',
			'Narrative-driven design',
			'Brand identity development',
		],
		href: '/work',
	},
	{
		id: 'air-india-cx',
		number: '06',
		title: 'Air India: Customer Experience',
		description:
			'Ensuring seamless brand experience by mapping the new visual identity across every major passenger touchpoint.',
		imageSrc: '/images/work/06-air-india-cx.png',
		imageAlt: 'Air India customer experience brand mapping',
		chips: ['Systems thinking', 'Information Hierarchy', 'Brand Translation'],
		href: '/work',
	},
	{
		id: 'himalayan-book',
		number: '07',
		title: 'The Great Himalayan Exploration Book',
		description:
			'Shaping a long-format publication through layout and editorial refinement',
		imageSrc: '/images/work/07-himalayan.png',
		imageAlt: 'The Great Himalayan Exploration book spreads',
		chips: [
			'Editorial design',
			'Information hierarchy',
			'Layout Grids & Compositions',
		],
		href: '/work/himalayan-book',
	},
	{
		id: 'vivan',
		number: '08',
		title: 'Vivan Hospital: Print & Digital Design',
		description:
			'Translating a cohesive visual identity into consistent brand applications across print, digital, and environmental touchpoints.',
		imageSrc: '/images/work/08-vivan.png',
		imageAlt: 'Vivan Hospital print and digital applications',
		chips: ['Brand Translation', 'Print Media', 'Digitization'],
		href: '/work',
	},
	{
		id: 'reconnect',
		number: '09',
		title: 'Reconnect: Researching Inclusive Play',
		description:
			'Research that informed the design of an inclusive game, uncovering insights to foster meaningful interaction and accessibility.',
		imageSrc: '/images/work/09-reconnect.png',
		imageAlt: 'Reconnect inclusive play research materials',
		chips: ['Design Research', 'Inclusive Design', 'User Research'],
		href: '/work',
	},
	{
		id: 'logofolio',
		number: '10',
		title: 'Logofolio',
		description:
			'A curated collection of logos crafted to capture unique brand stories through simple, memorable identities.',
		imageSrc: '/images/work/10-logofolio.png',
		imageAlt: 'Collection of logo design marks',
		chips: ['Logo Design', 'Visual Storytelling', 'Concept Development'],
		href: '/work',
	},
] as const;
