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
		imageSrc: '/images/case-studies/air-india/air-india-thumbnail.jpg',
		imageAlt: 'Air India brand extension touchpoint collage',
		chips: ['Brand Systems', 'Brand Experience', 'Print Design'],
		href: '/work/air-india-brand',
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
		href: '/work/igl',
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
		href: '/work/akshar-chitra',
	},
] as const;

/** Other projects — second grid (05–09). */
export const otherWorkProjects: readonly WorkProject[] = [
	{
		id: 'convergence',
		number: '05',
		title: 'Convergence',
		description:
			'A publication documenting 150 years of shared photographic history between France and India through rare archival works.',
		imageSrc: '/images/case-studies/convergence/convergence_cover.gif',
		imageAlt: 'Convergence book cover with photographic letterforms',
		chips: ['Editorial Design', 'Layout & Composition', 'Book Design'],
		href: '/work/convergence',
	},
	{
		id: 'himalayan-book',
		number: '06',
		title: 'The Great Himalayan Exploration Book',
		description:
			'Shaping a long-format publication through layout and editorial refinement',
		imageSrc: '/images/work/06-himalayan.png',
		imageAlt: 'The Great Himalayan Exploration book spreads',
		chips: [
			'Editorial design',
			'Information hierarchy',
			'Layout Grids & Compositions',
		],
		href: '/work/himalayan-book',
	},
	{
		id: 'way-of-the-witch',
		number: '07',
		title: 'Way of the Witch',
		description:
			'Designing a HarperCollins cover that evokes an antique spellbook through foil detailing, Wiccan iconography, and period typography.',
		imageSrc: '/images/work/07-way-of-the-witch.png',
		imageAlt: 'Way of the Witch hardcover with gold foil lettering',
		chips: ['Book Cover Design', 'Illustration', 'Print Design'],
		href: '/work/way-of-the-witch',
	},
	{
		id: 'maahi',
		number: '08',
		title: 'Maahi: Logo Design',
		description:
			'Creating a brand identity for Maahi, a bridalwear label by reimagining heirloom textiles through contemporary design.',
		imageSrc: '/images/work/08-maahi.png',
		imageAlt: 'Maahi bridalwear logo and identity',
		chips: [
			'Logo Design',
			'Narrative-driven design',
			'Brand identity development',
		],
		href: '/work/maahi',
	},
	{
		id: 'vivan',
		number: '09',
		title: 'Vivan Hospital: Print & Digital Design',
		description:
			'Translating a cohesive visual identity into consistent brand applications across print, digital, and environmental touchpoints.',
		imageSrc: '/images/work/09-vivan.png',
		imageAlt: 'Vivan Hospital print and digital applications',
		chips: ['Brand Translation', 'Print Media', 'Digitization'],
		href: '/work/vivan',
	},
] as const;

/**
 * Draft / inactive catalogue entries. Kept in repo but not shown on Work or Home.
 */
export const draftWorkProjects: readonly WorkProject[] = [
	{
		id: 'reconnect',
		number: '10',
		title: 'Reconnect: Designing for Inclusivity',
		description:
			'A tactile game for shared play between visually impaired and sighted children. Research with LVPEI, plus the game’s visual identity.',
		imageSrc: '/images/case-studies/reconnect/work-card.png',
		imageAlt: 'Reconnect diamond board game on a teal and navy textured surface',
		chips: ['Inclusive Design', 'User Research', 'Visual Identity'],
		href: '/work/reconnect',
	},
] as const;
