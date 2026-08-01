/**
 * Case study detail content for /work/[slug] pages.
 * Catalogue cards live in work.ts; this module holds long-form page content.
 */
import { caseStudies, otherWorkProjects, type WorkProject } from './work';

export interface CaseStudyImage {
	readonly src: string;
	readonly alt: string;
}

export interface CaseStudyTool {
	readonly name: string;
	readonly iconSrc: string;
}

/** Layered hero media (e.g. Mythila title graphic on a solid field). */
export interface CaseStudyHeroLayer {
	readonly src: string;
	readonly alt: string;
	readonly className: string;
}

/** Default landing band when a study does not set its own accent. */
export const DEFAULT_CASE_STUDY_BAND = '#e2e0d9';

export type CaseStudyBody = 'gallery' | 'mythila' | 'vivan' | 'igl' | 'convergence';

export interface CaseStudy {
	readonly id: string;
	readonly category: string;
	readonly title: string;
	readonly client: string;
	readonly description: readonly string[];
	readonly skills: readonly string[];
	readonly tools: readonly CaseStudyTool[];
	readonly hero: CaseStudyImage;
	/**
	 * Display number on the case study page when this project is not yet
	 * (or not only) represented in the work catalogue grids.
	 */
	readonly number?: string;
	/** Optional watermark behind the title stack (Mythila glyph collage). */
	readonly heroWatermarkSrc?: string;
	/** Solid field behind composed hero layers. */
	readonly heroBackdrop?: string;
	/** Extra images composited into the hero frame. */
	readonly heroLayers?: readonly CaseStudyHeroLayer[];
	readonly gallery?: readonly CaseStudyImage[];
	readonly feature?: CaseStudyImage;
	/**
	 * Full-bleed landing band behind navbar + titles + top of hero image.
	 * Override per project (e.g. taupe, olive wash, lavender).
	 */
	readonly heroBandColor?: string;
	/** Which body layout to render after the shared landing. */
	readonly body?: CaseStudyBody;
	/** Mythila-specific section assets + copy. */
	readonly mythila?: MythilaCaseStudyContent;
	/** Vivan Hospital gallery panels. */
	readonly vivan?: VivanCaseStudyContent;
	/** IGL rebrand narrative sections (filled as body sections are built). */
	readonly igl?: IglCaseStudyContent;
	/** Convergence book gallery + cover caption. */
	readonly convergence?: ConvergenceCaseStudyContent;
}

export interface MythilaCaseStudyContent {
	readonly tagline: readonly { readonly text: string; readonly className: string }[];
	/** Faint folk-art collage behind the tagline / process band. */
	readonly bandWatermarkSrc?: string;
	readonly sketches: CaseStudyImage;
	readonly quote: CaseStudyImage;
	readonly process: CaseStudyImage;
	readonly processPhotos: CaseStudyImage;
	readonly workshop: CaseStudyImage;
	readonly glyphsApp: CaseStudyImage;
	readonly features: CaseStudyImage;
	/** Interactive applications gallery (preview + thumbnails). */
	readonly applications: readonly CaseStudyImage[];
	readonly purchase: CaseStudyImage;
	readonly purchaseHref?: string;
}

/** Vivan Hospital — branded application panels after the shared landing. */
export interface VivanCaseStudyContent {
	readonly socialPhones: CaseStudyImage;
	readonly poster: CaseStudyImage;
	readonly billboardPrint: CaseStudyImage;
	readonly idCards: CaseStudyImage;
	readonly brochure: CaseStudyImage;
	readonly billboardOutdoor: CaseStudyImage;
	readonly interiorLeft: CaseStudyImage;
	readonly interiorRight: CaseStudyImage;
}

/** Inline copy with optional bold spans (case study body text). */
export interface CaseStudyTextPart {
	readonly text: string;
	readonly bold?: boolean;
}

export type IglTextPart = CaseStudyTextPart;

/**
 * Convergence book body — cover, caption, spreads, and feature panel.
 */
export interface ConvergenceCaseStudyContent {
	readonly cover: CaseStudyImage;
	readonly caption: readonly CaseStudyTextPart[];
	/** Six spread photos in display order (two rows of two, then a closing pair). */
	readonly spreads: readonly CaseStudyImage[];
	readonly feature: CaseStudyImage;
}

/**
 * IGL rebrand body content.
 * Landing (hero + intro) uses shared CaseStudy fields; body sections land here over time.
 */

export interface IglCaseStudyContent {
	readonly brandToday: {
		readonly title: string;
		readonly lead: string;
		readonly emphasis: string;
		readonly critiques: readonly string[];
		readonly logoCard: CaseStudyImage;
	};
	readonly problemStatement: {
		readonly title: string;
		readonly body: readonly IglTextPart[];
	};
	readonly workshop: {
		readonly title: string;
		readonly lead: string;
		readonly activities: readonly {
			readonly label: string;
			readonly detail: string;
		}[];
		/** Precomposed stickies + boards + magnets (Figma 235:1919 visuals). */
		readonly collage: CaseStudyImage;
	};
	/** Mint band — guiding principles as 2×2 cards (Figma 246:433). */
	readonly bigInsights: {
		readonly title: string;
		readonly lead: readonly IglTextPart[];
		readonly cards: readonly {
			readonly title: string;
			readonly caption: string;
			readonly image: CaseStudyImage;
		}[];
	};
	/** Brand code intro + core-concept band over field texture (Figma 235:2025). */
	readonly brandCode: {
		readonly intro: readonly IglTextPart[];
		readonly coreLabel: string;
		readonly coreConcept: string;
		readonly background: CaseStudyImage;
		readonly panels: readonly {
			readonly title: string;
			readonly kind: 'list' | 'prose';
			readonly span: 'narrow' | 'wide';
			readonly items?: readonly string[];
			readonly body?: string;
		}[];
	};
	readonly archetypes: {
		readonly primary: {
			readonly label: string;
			readonly name: string;
			readonly icon: CaseStudyImage;
			readonly points: readonly string[];
		};
		readonly secondary: {
			readonly label: string;
			readonly name: string;
			readonly icon: CaseStudyImage;
			readonly points: readonly string[];
		};
	};
	/** Evolution → Revolution strip (precomposed asset). */
	readonly directions: {
		readonly title: string;
		readonly lead: string;
		readonly strip: CaseStudyImage;
	};
	/** Concept explorations — labels/copy as HTML; sticky + gallery as images. */
	readonly concepts: readonly {
		readonly eyebrow: string;
		readonly title: string;
		readonly description: string;
		readonly sticky: CaseStudyImage;
		readonly gallery: CaseStudyImage;
	}[];
	/** Final direction — mint intro + before/after + sticky callout. */
	readonly finalDirection: {
		readonly title: string;
		readonly lead: string;
		readonly beforeLabel: string;
		readonly afterLabel: string;
		readonly before: CaseStudyImage;
		readonly after: CaseStudyImage;
		readonly sticky: CaseStudyImage;
	};
	/** Closing narrative + guidelines visual. */
	readonly closing: {
		readonly title: string;
		readonly lead: string;
		readonly subtext: string;
		readonly brandIdea: string;
		readonly followUp: string;
		readonly visual: CaseStudyImage;
	};
}

/** Ordered catalogue used for previous / next navigation. */
export const allWorkProjects: readonly WorkProject[] = [
	...caseStudies,
	...otherWorkProjects,
] as const;

/** Case studies with a published detail page. */
export const caseStudyDetails: readonly CaseStudy[] = [
	{
		id: 'himalayan-book',
		category: 'Book Design',
		title: 'The Great Himalayan Exploration',
		client: 'For Royal Enfield',
		description: [
			'A publication by Royal Enfield documenting journeys across the Himalayas, capturing landscapes, people, and stories from the road—concept and design by Ishan Khosla.',
			'I worked on layout refinements like adjusting compositions, placing imagery, adding captions and editorial updates across 250 pages.',
		],
		skills: ['Editorial Design', 'Layout & Compositions'],
		tools: [
			{
				name: 'Adobe InDesign',
				iconSrc: '/icons/tools/indesign.png',
			},
		],
		hero: {
			src: '/images/case-studies/himalayan/hero.png',
			alt: 'Open book spread titled Photographing Communities from The Great Himalayan Exploration',
		},
		gallery: [
			{
				src: '/images/case-studies/himalayan/gallery-contents.png',
				alt: 'Contents spread from The Great Himalayan Exploration book',
			},
			{
				src: '/images/case-studies/himalayan/gallery-nature.png',
				alt: 'Nature Trail editorial spread on a deep green background',
			},
			{
				src: '/images/case-studies/himalayan/gallery-storyteller.png',
				alt: 'Storyteller Path editorial spread on a navy background',
			},
			{
				src: '/images/case-studies/himalayan/gallery-artisan.png',
				alt: 'Artisan Route textile spread on a maroon background',
			},
		],
		feature: {
			src: '/images/case-studies/himalayan/feature.png',
			alt: 'Cheraw Bamboo Dance open book spread from The Celebration Map chapter',
		},
		heroBandColor: DEFAULT_CASE_STUDY_BAND,
		body: 'gallery',
	},
	{
		id: 'mythila',
		category: 'Display Typeface Design',
		title: 'Mythila Devanagari',
		client: 'With Typecraft Initiative',
		description: [
			'Mythila Devanagari is part of the Typecraft Initiative that reimagine typefaces through collaboration with traditional artisans.',
			'Rooted in Mithila (Madhubani) art from Bihar, instead of borrowing motifs, the project works directly with artists, embedding their craft into the structure of each letterform.',
		],
		skills: ['Devanagari Type Design', 'Vector Illustrations'],
		tools: [
			{
				name: 'Adobe Illustrator',
				iconSrc: '/icons/tools/illustrator.png',
			},
			{
				name: 'Glyphs',
				iconSrc: '/icons/tools/glyphs.png',
			},
		],
		hero: {
			src: '/images/case-studies/mythila/hero-wordmark.png',
			alt: 'Mythila Devanagari display typeface title lockup',
		},
		heroWatermarkSrc: '/images/case-studies/mythila/watermark.png',
		heroBackdrop: '#ffffff',
		heroLayers: [
			{
				src: '/images/case-studies/mythila/hero-pattern.png',
				alt: '',
				className: 'absolute left-[3.5%] top-[2%] w-[52%] max-w-none',
			},
			{
				src: '/images/case-studies/mythila/hero-wordmark.png',
				alt: '',
				className: 'absolute right-[1%] bottom-[1%] w-[59%] max-w-none',
			},
		],
		/** #9C9873 @ 10% over canvas ≈ warm olive wash */
		heroBandColor: '#f6f1eb',
		body: 'mythila',
		mythila: {
			tagline: [
				{ text: 'A HANDCRAFTED typeface,', className: 'font-display font-extralight text-[#d77a13]' },
				{ text: ' Reimagining', className: 'font-display font-light text-[#b74909]' },
				{ text: ' Mithila', className: 'font-display font-normal text-[#b74909]' },
				{ text: ' Folk art.', className: 'font-display font-normal text-[#b74909]' },
			],
			bandWatermarkSrc: '/images/case-studies/mythila/watermark2.png',
			sketches: {
				src: '/images/case-studies/mythila/sketches.png',
				alt: 'Hand-drawn Mythila character sketches on a warm panel',
			},
			quote: {
				src: '/images/case-studies/mythila/quote.png',
				alt: 'Devanagari specimen quote in Mythila typeface',
			},
			process: {
				src: '/images/case-studies/mythila/process.png',
				alt: 'Process steps: Hand-crafted, Translation, Refinement, Type development',
			},
			processPhotos: {
				src: '/images/case-studies/mythila/process-photos.png',
				alt: 'Artists sketching Mythila letterforms and a polaroid of the workshop',
			},
			workshop: {
				src: '/images/case-studies/mythila/workshop.png',
				alt: 'Typecraft workshop with artists collaborating around a table',
			},
			glyphsApp: {
				src: '/images/case-studies/mythila/glyphs-app.png',
				alt: 'Glyphs app screenshot of Mythila letterform editing',
			},
			features: {
				src: '/images/case-studies/mythila/features.png',
				alt: 'Features of the font with character grids and sticky-note callout',
			},
			applications: [
				{
					src: '/images/case-studies/mythila/applications/1.png',
					alt: 'Mythila specimen: Aapke computer screen tak on a dark field',
				},
				{
					src: '/images/case-studies/mythila/applications/2.png',
					alt: 'Mythila specimen: decorative Devanagari lines on a tan field',
				},
				{
					src: '/images/case-studies/mythila/applications/3.png',
					alt: 'Mythila specimen: Shilp se Shiksha on a burgundy field',
				},
				{
					src: '/images/case-studies/mythila/applications/4.png',
					alt: 'Mythila Devanagari multicolor title lockup on white',
				},
			],
			purchase: {
				src: '/images/case-studies/mythila/purchase.png',
				alt: 'Purchase license callout with Mythila type specimens at three sizes',
			},
			purchaseHref: 'https://www.typecraftinitiative.org/',
		},
	},
	{
		id: 'vivan',
		category: 'Print & Digital Design',
		title: 'Vivan Hospital',
		client: '',
		description: [
			'I worked on scaling the branding of Vivan Hospital across a wide range of communication touch-points.',
			'Translated a predefined visual identity into consistent, context-specific applications ranging from social media creatives, brochures, print advertisements, environmental graphics to business cards and ID systems.',
		],
		skills: ['Brand Extension', 'Print & digital design'],
		tools: [
			{
				name: 'Adobe Illustrator',
				iconSrc: '/icons/tools/illustrator.png',
			},
			{
				name: 'Adobe Photoshop',
				iconSrc: '/icons/tools/photoshop.png',
			},
		],
		hero: {
			src: '/images/case-studies/vivan/hero.png',
			alt: 'Exterior view of Vivan Hospital with brick and glass facade',
		},
		/** Figma Project 08 hero band */
		heroBandColor: '#d5c2da',
		body: 'vivan',
		vivan: {
			socialPhones: {
				src: '/images/case-studies/vivan/social-phones.png',
				alt: 'Two phone mockups showing Vivan Hospital Instagram posts',
			},
			poster: {
				src: '/images/case-studies/vivan/poster.png',
				alt: 'Vivan Hospital Google review scanner poster on mint background',
			},
			billboardPrint: {
				src: '/images/case-studies/vivan/billboard-print.png',
				alt: 'Vivan Hospital print billboard featuring a doctor and Hindi headline',
			},
			idCards: {
				src: '/images/case-studies/vivan/id-cards.png',
				alt: 'Vivan Hospital staff ID card mockups on a lavender field',
			},
			brochure: {
				src: '/images/case-studies/vivan/brochure.png',
				alt: 'Open Vivan Hospital tri-fold brochure mockup',
			},
			billboardOutdoor: {
				src: '/images/case-studies/vivan/billboard-outdoor.png',
				alt: 'Outdoor Vivan Hospital billboard for brain and spine surgery',
			},
			interiorLeft: {
				src: '/images/case-studies/vivan/interior-left.png',
				alt: 'Hospital corridor with Vivan branded infotainment panels',
			},
			interiorRight: {
				src: '/images/case-studies/vivan/interior-right.png',
				alt: 'Hospital interior wall with Vivan environmental graphics',
			},
		},
	},
	{
		id: 'igl',
		category: 'Rebranding',
		title: 'Indraprastha Gas Limited',
		client: '',
		description: [
			'Indraprastha Gas Limited (IGL), a legacy brand in natural gas distribution, stood at a point of transition. With leadership change and plans for expansion, its existing visual identity no longer reflected where the company was headed.',
			'The challenge was to modernize the brand while retaining the trust it had built over decades.',
		],
		skills: ['Visual Identity Systems', 'Brand Strategy'],
		tools: [
			{
				name: 'Adobe Illustrator',
				iconSrc: '/icons/tools/illustrator.png',
			},
			{
				name: 'Adobe Photoshop',
				iconSrc: '/icons/tools/photoshop.png',
			},
		],
		hero: {
			src: '/images/case-studies/igl/hero.png',
			alt: 'Existing IGL logo with sun and orbital ring on a white field',
		},
		/** Figma Project 02 hero band */
		heroBandColor: '#bcceb8',
		body: 'igl',
		igl: {
			brandToday: {
				title: 'The Brand Then',
				lead: 'The existing identity centered around a sun and orbital ring—',
				emphasis: 'symbolizing energy, continuity, and movement.',
				critiques: [
					'Conceptually strong',
					'But the execution feels dated',
					'Strong recall but outdated perception',
					'Static and stagnant identity',
				],
				logoCard: {
					src: '/images/case-studies/igl/brand-today-logo.png',
					alt: 'Existing IGL logo framed as the brand then reference',
				},
			},
			problemStatement: {
				title: 'Problem statement',
				body: [
					{
						text: "Despite a period of rapid growth and strategic transition, IGL's current visual identity feels ",
					},
					{ text: 'outdated and stagnant', bold: true },
					{
						text: '. This prevents the brand from being perceived as a ',
					},
					{ text: 'modern, forward-thinking energy leader', bold: true },
					{
						text: ', making it difficult to align with evolving consumer expectations.',
					},
				],
			},
			workshop: {
				title: 'Stakeholder Workshop',
				lead: 'To align the identity with IGL’s future, we conducted stakeholder workshops across leadership and teams.',
				activities: [
					{ label: 'Brand reflection:', detail: 'what defines IGL today' },
					{ label: 'Future visioning:', detail: 'where the brand is headed' },
					{
						label: 'Values & personality:',
						detail: 'how it should be perceived',
					},
					{
						label: 'Customer journey mapping:',
						detail: 'key touchpoints and gaps',
					},
				],
				collage: {
					src: '/images/case-studies/igl/whiteboard-stickies.png',
					alt: 'Workshop stickies, team boards, and activity summaries pinned on the whiteboard',
				},
			},
			bigInsights: {
				title: 'Big Insights',
				lead: [
					{
						text: 'The insights from stakeholders and brand analysis were distilled into a set of guiding principles—',
					},
					{
						text: 'defining how IGL should be perceived moving forward.',
						bold: true,
					},
					{
						text: ' These principles shaped not just the visual identity, but the tone, behaviour and overall brand expression.',
					},
				],
				cards: [
					{
						title: 'Reliable Infrastructure',
						caption: 'A brand built on scale, strength, and consistency.',
						image: {
							src: '/images/case-studies/igl/insight-reliable.png',
							alt: 'Industrial gas plant silhouetted against a warm sunset sky',
						},
					},
					{
						title: 'Seamless Continuity',
						caption: 'Ensuring uninterrupted, everyday access to energy.',
						image: {
							src: '/images/case-studies/igl/insight-seamless.png',
							alt: 'Rashtrapati Bhavan framed by green hedges under a clear blue sky',
						},
					},
					{
						title: 'Progressive Technology',
						caption: 'Signaling innovation and forward movement.',
						image: {
							src: '/images/case-studies/igl/insight-progressive.png',
							alt: 'Leaf-shaped green EV charger plugged into a white car',
						},
					},
					{
						title: 'Customer-Centric Approach',
						caption:
							'Making the brand more human, accessible and relatable.',
						image: {
							src: '/images/case-studies/igl/insight-customer.png',
							alt: 'Smiling attendant cleaning a classic black taxi windshield',
						},
					},
				],
			},
			brandCode: {
				intro: [
					{ text: 'The ' },
					{
						text: 'insights translated into a unified brand code.',
						bold: true,
					},
					{
						text: ' It aligned what IGL stands for with how it shows up through a core concept.',
					},
				],
				coreLabel: 'Core concept',
				coreConcept: 'Powering dreams',
				background: {
					src: '/images/case-studies/igl/brand-code-bg.png',
					alt: '',
				},
				panels: [
					{
						title: 'Values',
						kind: 'list',
						span: 'narrow',
						items: ['Pioneer', 'Excellence', 'Accessible', 'User-centric'],
					},
					{
						title: 'Positioning',
						kind: 'prose',
						span: 'wide',
						body: 'A green energy solutions provider that is accessible and reliable, delivering seamless and convenient experiences for the evolving customer. An integral part of everyday life: powering people and the nation toward a greener future.',
					},
					{
						title: 'Brand Ambition',
						kind: 'prose',
						span: 'wide',
						body: "To celebrate IGL’s legacy while extending its impact across the nation and beyond. To build a brand that enables India’s transition to a sustainable future—supporting everyday aspirations and powering collective progress.",
					},
					{
						title: 'Personality',
						kind: 'list',
						span: 'narrow',
						items: ['Approachable', 'Sincere', 'Optimistic', 'Dynamic'],
					},
				],
			},
			archetypes: {
				primary: {
					label: 'Primary Archetype',
					name: 'The Everyman',
					icon: {
						src: '/images/case-studies/igl/archetype-everyman.png',
						alt: '',
					},
					points: [
						'A brand that is inclusive',
						'That celebrates the beauty of everyday life and individual aspirants',
						'Fosters a sense of belonging',
						'Trustworthy and dependable',
						'Shares the enthusiasm and passion of people',
					],
				},
				secondary: {
					label: 'Secondary Archetype',
					name: 'The Explorer',
					icon: {
						src: '/images/case-studies/igl/archetype-explorer.png',
						alt: '',
					},
					points: [
						'In pursuit of innovation and driven by ambition',
						'Always pushing boundaries',
						'Curious to explore uncharted territories',
					],
				},
			},
			directions: {
				title: 'From Strategy to Design',
				lead: 'To understand how far the identity could evolve, multiple directions were developed; each representing insights from earlier research.',
				strip: {
					src: '/images/case-studies/igl/evolution-revolution.png',
					alt: 'Logo directions from existing mark through concepts 1–4, spanning evolution to revolution',
				},
			},
			concepts: [
				{
					eyebrow: 'Concept 1',
					title: 'Evolutionary Approach',
					description:
						'An evolution of IGL’s existing identity, retaining the sun as a symbol of energy while refining form and clarity for a more contemporary expression. The orbital ring reinforces continuity, reliability and approachability.',
					sticky: {
						src: '/images/case-studies/igl/concept-1-sticky.png',
						alt: 'Sticky note: least disruptive, not the most visually progressive, retains high recall',
					},
					gallery: {
						src: '/images/case-studies/igl/concept-1-gallery.png',
						alt: 'Concept 1 explorations — logo lockups, posters, stationery, station, and merchandise',
					},
				},
				{
					eyebrow: 'Concept 2',
					title: 'Fuelling Dreams',
					description:
						'A dynamic circular form representing the continuous flow and renewal of energy across users and systems. The looping arrows emphasize sustainability, movement and the perpetual supply of IGL.',
					sticky: {
						src: '/images/case-studies/igl/concept-2-sticky.png',
						alt: 'Sticky note: strong green energy symbolism, uninterrupted supply, less immediately recognisable as IGL',
					},
					gallery: {
						src: '/images/case-studies/igl/concept-2-gallery.png',
						alt: 'Concept 2 explorations — circular mark applications across print and digital',
					},
				},
				{
					eyebrow: 'Concept 3',
					title: 'Your Green Connection',
					description:
						'A typographic approach that simplifies the identity into a bold, modern IGL monogram. The form reflects growth and reach of green energy solutions of IGL.',
					sticky: {
						src: '/images/case-studies/igl/concept-3-sticky.png',
						alt: 'Sticky note: showcases reach, adaptable monogram, loses immediate energy symbolism',
					},
					gallery: {
						src: '/images/case-studies/igl/concept-3-gallery.png',
						alt: 'Concept 3 explorations — monogram applications across print and environments',
					},
				},
				{
					eyebrow: 'Concept 4',
					title: 'Powered by Green',
					description:
						'A power-inspired symbol representing the shift toward cleaner, user-driven energy solutions. Shifts the identity toward a more contemporary and tech-led visual language.',
					sticky: {
						src: '/images/case-studies/igl/concept-4-sticky.png',
						alt: 'Sticky note: expresses transformation clearly but too radical, risks feeling like an electrical company',
					},
					gallery: {
						src: '/images/case-studies/igl/concept-4-gallery.png',
						alt: 'Concept 4 explorations — power-mark applications across digital and environmental touchpoints',
					},
				},
			],
			finalDirection: {
				title: 'Arriving at the Right Balance',
				lead: 'The selected direction focused on refining the existing identity; to balance familiarity with a more contemporary expression because radical shifts weakened brand recall.',
				beforeLabel: 'Before',
				afterLabel: 'After',
				before: {
					src: '/images/case-studies/igl/final-before.png',
					alt: 'Existing IGL logo before the rebrand',
				},
				after: {
					src: '/images/case-studies/igl/final-after.png',
					alt: 'Refined IGL sun and ring mark after the rebrand',
				},
				sticky: {
					src: '/images/case-studies/igl/final-sticky.png',
					alt: 'Sticky note summarizing refinements: legibility, proportions, cleaner language, adaptability',
				},
			},
			closing: {
				title: 'Brand Guidelines',
				lead: 'The challenge wasn’t just to design a visual identity, it was to create clarity around what the brand stands for and how it should consistently express itself across every touchpoint.',
				subtext: 'I approached this by defining a Brand Code, a foundational layer that brings together the brand under one cohesive framework. At the core of this system sits the brand idea:',
				brandIdea: '“Powering dreams”',
				followUp:
					'A simple yet expansive thought that bridges IGL’s functional role as an energy provider with its larger emotional and national relevance. This included articulating the brand’s positioning as a progressive energy leader, values centered on reliability and responsibility, a personality that is confident yet approachable and an ambition to drive growth through innovation and impact.',
				visual: {
					src: '/images/case-studies/igl/guidelines-visual.png',
					alt: 'IGL brand guidelines book open to a spread with logo construction and brand pillars',
				},
			},
		},
	},
	{
		id: 'convergence',
		category: 'Book Design',
		title: 'Convergence',
		client: 'For Institut Français en Inde',
		description: [
			'A publication commissioned by Institut Français en Inde documenting 150 years of shared photographic history between France and India through rare archival works—concept and design by Ishan Khosla.',
			'I worked on layout refinements like maintaining consistency across compositions, text and colour, adding captions and editorial updates across 175 pages.',
		],
		skills: ['Editorial Design', 'Layout & Compositions'],
		tools: [
			{
				name: 'Adobe InDesign',
				iconSrc: '/icons/tools/indesign.png',
			},
		],
		hero: {
			src: '/images/case-studies/convergence/hero.png',
			alt: 'Open Convergence book spread with bold typography on an olive field',
		},
		/** #D9D9D9 @ 60% over canvas ≈ cool grey wash */
		heroBandColor: '#e5e2e0',
		body: 'convergence',
		convergence: {
			cover: {
				src: '/images/case-studies/convergence/convergence_cover.gif',
				alt: 'Convergence book cover with photographic letterforms in a slipcase',
			},
			caption: [
				{
					text: 'The cover with the slipcase shows works of French image makers but when you take out the book you also see Indian picture takers—',
				},
				{ text: 'a metaphor of the convergence', bold: true },
				{ text: ' between the two.' },
			],
			spreads: [
				{
					src: '/images/case-studies/convergence/spread-1.png',
					alt: 'Open Convergence spread with archival portrait and caption',
				},
				{
					src: '/images/case-studies/convergence/spread-2.png',
					alt: 'Open Convergence spread with paired archival photographs',
				},
				{
					src: '/images/case-studies/convergence/spread-3.png',
					alt: 'Open Convergence spread with a seated portrait and facing text',
				},
				{
					src: '/images/case-studies/convergence/spread-4.png',
					alt: 'Open Convergence spread with a standing portrait and facing text',
				},
				{
					src: '/images/case-studies/convergence/spread-5.png',
					alt: 'Open Convergence spread with group archival photographs',
				},
				{
					src: '/images/case-studies/convergence/spread-6.png',
					alt: 'Open Convergence spread with a full-bleed archival portrait',
				},
			],
			feature: {
				src: '/images/case-studies/convergence/feature.png',
				alt: 'Large Convergence spread with a monochrome portrait of a woman',
			},
		},
	},
] as const;

/**
 * Returns a case study by work project id, or undefined if unpublished.
 */
export const getCaseStudyById = (id: string): CaseStudy | undefined =>
	caseStudyDetails.find((study) => study.id === id);

/**
 * Returns adjacent catalogue projects for case study navigation.
 */
export const getAdjacentProjects = (
	id: string,
): { readonly previous: WorkProject | undefined; readonly next: WorkProject | undefined } => {
	const index = allWorkProjects.findIndex((project) => project.id === id);
	if (index < 0) {
		return { previous: undefined, next: undefined };
	}

	return {
		previous: index > 0 ? allWorkProjects[index - 1] : undefined,
		next: index < allWorkProjects.length - 1 ? allWorkProjects[index + 1] : undefined,
	};
};
