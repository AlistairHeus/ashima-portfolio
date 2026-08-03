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

export type CaseStudyBody =
	| 'gallery'
	| 'mythila'
	| 'vivan'
	| 'igl'
	| 'convergence'
	| 'akshar-chitra'
	| 'air-india'
	| 'way-of-the-witch'
	| 'reconnect';

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
	/** Akshar Chitra narrative sections (filled as body sections are built). */
	readonly aksharChitra?: AksharChitraCaseStudyContent;
	/** Air India brand extension narrative sections (Figma Project 01). */
	readonly airIndia?: AirIndiaCaseStudyContent;
	/** Way of the Witch book cover (Figma Project 10). */
	readonly witch?: WitchCaseStudyContent;
	/** Reconnect inclusive play (Figma Project 6). */
	readonly reconnect?: ReconnectCaseStudyContent;
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
 * Way of the Witch book cover body (Figma Project 10, 376:357).
 * Landing uses shared CaseStudy fields; brief / iterations / selected / details live here.
 */
export interface WitchCaseStudyContent {
	readonly brief: {
		readonly title: string;
		readonly body: string;
	};
	/** Composed research moodboard (references + palette). */
	readonly moodboard: CaseStudyImage;
	readonly iterationsTitle: string;
	readonly iterations: readonly CaseStudyImage[];
	readonly selectedTitle: string;
	readonly selected: CaseStudyImage;
	readonly details: CaseStudyImage;
}

/**
 * Reconnect inclusive-play body (Figma Project 6, 386:1191).
 * Landing uses shared CaseStudy fields; research / direction / outcome / logo live here.
 */
export interface ReconnectCaseStudyContent {
	readonly research: {
		readonly title: string;
		readonly primaryLabel: string;
		readonly primaryBody: readonly CaseStudyTextPart[];
		readonly fieldLabel: string;
		readonly fieldEyebrow: string;
		readonly fieldBody: readonly CaseStudyTextPart[];
		readonly interviewsTitle: string;
		readonly interviewsLead: string;
		readonly stakeholders: readonly {
			readonly label: string;
			readonly detail: string;
		}[];
		readonly classroom: CaseStudyImage;
		readonly play: CaseStudyImage;
		readonly collage: CaseStudyImage;
	};
	readonly direction: {
		readonly title: string;
		readonly lead: readonly CaseStudyTextPart[];
		readonly insightsTitle: string;
		readonly insights: readonly (readonly CaseStudyTextPart[])[];
		readonly hmwTitle: string;
		readonly hmw: readonly string[];
		readonly photo: CaseStudyImage;
		readonly photoCaption: string;
		readonly pillars: readonly {
			readonly title: string;
			readonly caption: string;
			readonly icon: CaseStudyImage;
		}[];
	};
	readonly outcome: {
		readonly title: string;
		readonly lead: readonly CaseStudyTextPart[];
		readonly aboutTitle: string;
		readonly aboutBody: string;
		readonly explorationTitle: string;
		readonly explorationBody: string;
		readonly products: readonly CaseStudyImage[];
		readonly feature: CaseStudyImage;
		readonly tagline: readonly CaseStudyTextPart[];
	};
	readonly logo: {
		readonly title: string;
		readonly lead: readonly CaseStudyTextPart[];
		readonly groupsLead: readonly CaseStudyTextPart[];
		readonly groups: readonly string[];
		readonly mark: CaseStudyImage;
		readonly wordmark: string;
		readonly piece: CaseStudyImage;
	};
}

/**
 * Akshar Chitra body content.
 * Landing (hero + intro) uses shared CaseStudy fields; body sections live here.
 */
export interface AksharChitraPerson {
	readonly name: string;
	readonly image: CaseStudyImage;
}

export interface AksharChitraCaseStudyContent {
	readonly typecraft: {
		readonly title: string;
		readonly body: readonly CaseStudyTextPart[];
		readonly logo: CaseStudyImage;
	};
	readonly collaborators: {
		readonly title: string;
		readonly artists: {
			readonly label: string;
			readonly people: readonly AksharChitraPerson[];
		};
		readonly teams: readonly {
			readonly label: string;
			readonly people: readonly AksharChitraPerson[];
		}[];
	};
	readonly landscape: {
		readonly title: string;
		readonly lead: readonly CaseStudyTextPart[];
		readonly primers: CaseStudyImage;
		readonly critiques: readonly {
			readonly title: string;
			readonly body: string;
		}[];
		readonly diagramTitle: string;
		readonly diagram: CaseStudyImage;
		/** Devanagari line-art spanning Landscape through Process on the right edge. */
		readonly watermark: CaseStudyImage;
	};
	readonly insight: {
		readonly quotes: readonly CaseStudyTextPart[][];
		readonly processors: readonly {
			readonly label: string;
			readonly detail: string;
			readonly barColor: string;
			readonly labelColor: string;
		}[];
	};
	readonly process: {
		readonly title: string;
		/** Devanagari line-art on the left edge of this section. */
		readonly watermarkLeft: CaseStudyImage;
		readonly steps: readonly {
			readonly title: string;
			readonly titleColor: string;
			/** One or more body paragraphs (steps 1–3 use two). */
			readonly paragraphs: readonly (readonly CaseStudyTextPart[])[];
			/** Letter-creature glyph beside the step copy. */
			readonly glyph: CaseStudyImage;
			readonly photo: CaseStudyImage & {
				readonly width: number;
				readonly height: number;
			};
		}[];
	};
	readonly logics: {
		readonly title: string;
		readonly lead: string;
		readonly cards: readonly {
			readonly title: string;
			readonly body: readonly CaseStudyTextPart[];
			readonly image: CaseStudyImage;
		}[];
	};
	/**
	 * Letter-study whiteboard after Process — black beveled frame
	 * (IglWhiteboardFrame) + sketch background + three overlay photos.
	 */
	readonly whiteboard: {
		readonly background: CaseStudyImage;
		readonly overlays: readonly {
			readonly image: CaseStudyImage;
			/** Percent of the board face (Figma 296:316). */
			readonly left: string;
			readonly top: string;
			readonly width: string;
			readonly rotate?: string;
		}[];
	};
	/**
	 * Pedagogy visuals — banner, insights, Ma decision, practice, and positioning
	 * (Figma 352:361 + pedagogy-pre band above).
	 */
	readonly pedagogy: {
		/** Full-bleed process banner between Illustration Logics and Insights. */
		readonly banner: CaseStudyImage;
		readonly insights: {
			readonly title: string;
			readonly body: readonly CaseStudyTextPart[];
			readonly photo: CaseStudyImage;
		};
		readonly decision: {
			readonly letter: string;
			readonly options: readonly {
				readonly label: string;
				readonly color: string;
			}[];
			readonly preface: string;
			readonly solutionLabel: string;
			readonly solutionBody: string;
		};
		readonly practice: {
			readonly title: string;
			readonly lead: readonly CaseStudyTextPart[];
			readonly listIntro: string;
			readonly replacements: readonly string[];
			readonly photo: CaseStudyImage;
		};
		readonly positioning: {
			readonly title: string;
			readonly photo: CaseStudyImage;
			readonly columns: readonly {
				readonly age: string;
				readonly ageColor: string;
				readonly usage: string;
			}[];
		};
	};
	readonly constraints: {
		readonly title: string;
		readonly items: readonly {
			readonly title: string;
			readonly body: readonly CaseStudyTextPart[];
		}[];
		readonly bhuttaProcess: CaseStudyImage;
		readonly mockups: CaseStudyImage;
	};
	readonly impact: {
		readonly title: string;
		readonly lead: readonly CaseStudyTextPart[];
		/** Three-circle intersection diagram (Figma Why This Matters). */
		readonly venn: CaseStudyImage;
		readonly cards: readonly {
			readonly title: string;
			readonly body: string;
			readonly titleColor: string;
			readonly bodyColor: string;
			/** Taped card face with watermark icon. */
			readonly image: CaseStudyImage;
		}[];
	};
}

/**
 * Air India brand extension body content (Figma Project 01, 307:1936).
 * Landing uses shared CaseStudy fields; narrative + applications live here.
 */
export interface AirIndiaPainPoint {
	readonly title: string;
	readonly body: readonly CaseStudyTextPart[];
	readonly icon: CaseStudyImage;
}

export interface AirIndiaCaseStudyContent {
	/** Full Brand Identity panel (logo, vista, type, colours, chakra). */
	readonly brandIdentity: CaseStudyImage;
	readonly research: {
		readonly title: string;
		/** Body lines — fixed wraps match Figma (367:1631). */
		readonly body: readonly string[];
		readonly challengesTitle: string;
		/** Challenge lines — fixed wraps match Figma; one string = one line. */
		readonly challenges: readonly (readonly string[])[];
		readonly diagram: CaseStudyImage;
	};
	readonly opportunity: {
		readonly title: string;
		readonly lead: string;
		readonly objectives: readonly string[];
		readonly framework: string;
		readonly sticky: CaseStudyImage;
		readonly venn: CaseStudyImage;
	};
	readonly reimagining: {
		readonly title: string;
		readonly visual: CaseStudyImage;
		readonly painPoints: readonly AirIndiaPainPoint[];
	};
	/** Designing with Purpose — title/body as HTML; heatmap visual (sticky + legend in image). */
	readonly designingPurpose: {
		readonly title: string;
		/** Body lines — fixed wraps match Figma (365:1326). */
		readonly body: readonly string[];
		readonly visual: CaseStudyImage;
	};
	/** Manual check-in boarding passes — top stack/reverse + bottom hand/features. */
	readonly boardingShowcase: {
		readonly eyebrow: string;
		readonly title: string;
		readonly lead: string;
		readonly stack: CaseStudyImage;
		readonly reverse: CaseStudyImage;
		readonly hand: CaseStudyImage;
		readonly featuresTitle: string;
		readonly features: readonly {
			readonly title: string;
			readonly body: readonly CaseStudyTextPart[];
		}[];
	};
	readonly quote: {
		readonly text: string;
		readonly name: string;
		readonly role: string;
		readonly photo: CaseStudyImage;
		readonly markSrc: string;
	};
	readonly touchpointsIntro: {
		/** Title lines — fixed wraps match Figma (367:1630). */
		readonly title: readonly string[];
		/** Body lines with optional bold spans. */
		readonly body: readonly (readonly CaseStudyTextPart[])[];
		readonly stat: string;
		/** Stat body lines with optional bold spans. */
		readonly statBody: readonly (readonly CaseStudyTextPart[])[];
	};
	/** Triangular tags, baggage stickers, e-ticket, lounge card. */
	readonly collaterals: CaseStudyImage;
	/** Queue tops, counters, totems, standees, FIDS. */
	readonly environmental: CaseStudyImage;
	readonly process: {
		readonly title: string;
		readonly diagram: CaseStudyImage;
	};
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
		id: 'air-india-brand',
		category: 'Brand Extension',
		title: 'Air India',
		client: '',
		description: [
			'Following its acquisition by the Tata Group, Air India unveiled a new global brand identity to mark its transformation into a premium private airline.',
			'My role focused on scaling the identity into a global design system, redefining the passenger experience and brand visibility across 83+ airports. The primary challenge lay in implementing this vision across a diverse physical infrastructure under a stringent 4 month timeline.',
		],
		skills: [
			'Systems thinking',
			'Brand translation across print and digital medium',
		],
		tools: [
			{
				name: 'Adobe Illustrator',
				iconSrc: '/icons/tools/illustrator.png',
			},
			{
				name: 'Adobe Photoshop',
				iconSrc: '/icons/tools/photoshop.png',
			},
			{
				name: 'Adobe InDesign',
				iconSrc: '/icons/tools/indesign.png',
			},
		],
		hero: {
			src: '/images/case-studies/air-india/hero.png',
			alt: 'Air India aircraft with new livery flying above clouds',
		},
		/** Soft rose — Figma Project 01 hero band */
		heroBandColor: '#E7C7CB',
		body: 'air-india',
		airIndia: {
			brandIdentity: {
				src: '/images/case-studies/air-india/brand-assets.png',
				alt: 'Air India brand identity — logo, Vista window, typography, cabin-class colours, and chakra pattern',
			},
			research: {
				title: 'Research & Discovery',
				body: [
					'Mapped the end-to-end passenger journey through airport recce,',
					'stakeholder interviews, competitor benchmarking, and touchpoint',
					'analysis to identify experience gaps and opportunities.',
				],
				challengesTitle: 'Challenges',
				challenges: [
					[
						'Significant variation in airport layouts, infrastructure and',
						'constraints (domestic & international)',
					],
					['Limited flexibility due to rules governed by the airport authority'],
					['Creating design guidelines for omni-channel touchpoints'],
					[
						'Coordinating across teams, vendors, and locations (remote and',
						'on-ground)',
					],
				],
				diagram: {
					src: '/images/case-studies/air-india/research-diagram.png',
					alt: 'Annotated isometric check-in counter layout with economy, premium, and priority zones',
				},
			},
			opportunity: {
				title: 'Opportunity Mapping',
				lead: 'Each touchpoint was evaluated across 3 strategic objectives:',
				objectives: [
					'strengthening the brand',
					'improving passenger experience',
					'supporting operational efficiency',
				],
				framework:
					'This framework helped prioritize where design could create the greatest impact.',
				sticky: {
					src: '/images/case-studies/air-india/sticky-opportunity.png',
					alt: 'Sticky note identifying the boarding pass as the highest-impact touchpoint',
				},
				venn: {
					src: '/images/case-studies/air-india/opportunity-venn.png',
					alt: 'Three-circle opportunity map intersecting brand identity, passenger experience, and operational efficiency',
				},
			},
			reimagining: {
				title: 'Reimagining the Boarding Pass',
				visual: {
					src: '/images/case-studies/air-india/maharaja-boarding-2.png',
					alt: 'Maharaja sitting on a white banner while holding a legacy Air India boarding pass',
				},
				painPoints: [
					{
						title: 'Airline Pain Points',
						icon: {
							src: '/images/case-studies/air-india/icon-airline.png',
							alt: '',
						},
						body: [
							{ text: 'Low visibility forces staff to ' },
							{ text: 'manually highlight', bold: true },
							{ text: ' details for passengers, while ' },
							{ text: 'branding limitations', bold: true },
							{ text: ' and ' },
							{ text: 'cluttered information', bold: true },
							{ text: ' that hinder often operational efficiency.' },
						],
					},
					{
						title: 'Passenger Pain Points',
						icon: {
							src: '/images/case-studies/air-india/icon-passenger.png',
							alt: '',
						},
						body: [
							{ text: 'A ' },
							{ text: 'cluttered design', bold: true },
							{ text: ' with ' },
							{ text: 'small fonts', bold: true },
							{ text: ' often buries critical flight info, leading to an ' },
							{ text: 'unclear boarding process', bold: true },
							{ text: ' and frequent passenger confusion.' },
						],
					},
					{
						title: 'Technical Constraints',
						icon: {
							src: '/images/case-studies/air-india/icon-technical.png',
							alt: '',
						},
						body: [
							{ text: 'Legacy thermal printing', bold: true },
							{
								text: ' enforced strict color and font limitations, requiring a rigid architecture to manage ',
							},
							{ text: '43 unique variables', bold: true },
							{ text: ' within fixed character limits.' },
						],
					},
				],
			},
			designingPurpose: {
				title: 'Designing with Purpose',
				body: [
					'Close collaboration with airline staff and user testing provided',
					'valuable insights into their specific needs and priorities to',
					'determine the information priority mapping.',
				],
				visual: {
					src: '/images/case-studies/air-india/designing-purpose.png',
					alt: 'Annotated boarding pass heat-map with sticky callouts and information priority mapping',
				},
			},
			boardingShowcase: {
				eyebrow: 'Design shortlisted for',
				title: 'Manual Check-in Counters',
				lead: 'Pre-printed cardstock to provide a tangible and branded passenger experience, from the beginning of the journey and beyond.',
				stack: {
					src: '/images/case-studies/air-india/boarding-showcase-1-1.png',
					alt: 'Stacked First, Premium Economy, Business, and Economy boarding passes',
				},
				reverse: {
					src: '/images/case-studies/air-india/boarding-showcase-1-2.png',
					alt: 'Reverse of the boarding pass with Vista graphics on red',
				},
				hand: {
					src: '/images/case-studies/air-india/boarding-showcase-2-1.png',
					alt: 'Hand holding Economy and Business boarding passes',
				},
				featuresTitle: 'Features',
				features: [
					{
						title: 'Centralized Brand Integration',
						body: [
							{ text: 'Successfully integrated the ' },
							{ text: '"Vista" window frame', bold: true },
							{
								text: ' as a core structural element, ensuring a cohesive connection to the new global identity.',
							},
						],
					},
					{
						title: 'Colour Coding for classes',
						body: [
							{ text: 'Implemented a distinct' },
							{ text: ' color-coding system', bold: true },
							{
								text: ' to facilitate seamless cabin class differentiation.',
							},
						],
					},
					{
						title: 'Operational Balance',
						body: [
							{ text: 'Refined the information architecture to create an ' },
							{ text: 'intuitive interface', bold: true },
							{
								text: ' that reduces friction at high-traffic security and boarding checkpoints.',
							},
						],
					},
					{
						title: 'Strategic Information Hierarchy',
						body: [
							{
								text: 'Prioritizes gate, seat, and flight details within the "Vista" frame for instant, ',
							},
							{ text: 'high-visibility recognition', bold: true },
							{ text: '.' },
						],
					},
				],
			},
			quote: {
				text: 'The boarding pass design was a key highlight of the brand extension. It sets a solid standard for clarity and brand alignment in our passenger experience.',
				name: 'Campbell Wilson',
				role: 'CEO, MD of Air India',
				photo: {
					src: '/images/case-studies/air-india/ceo-wilson.png',
					alt: 'Portrait of Campbell Wilson',
				},
				markSrc: '/images/case-studies/air-india/quote-mark.svg',
			},
			touchpointsIntro: {
				title: ['Designed all touchpoints', 'for 83+ airports'],
				body: [
					[{ text: 'To ensure a seamless brand experience, the new visual' }],
					[{ text: 'identity was mapped across all passenger touchpoints.' }],
					[{ text: 'Each touchpoint posed unique challenges, requiring' }],
					[
						{ text: 'focused attention and ' },
						{ text: 'tailored solutions.', bold: true },
					],
				],
				stat: '~72,000 passengers',
				statBody: [
					[{ text: 'interact with these touchpoints everyday' }],
					[{ text: 'reiterating the new identity and improving' }],
					[
						{ text: 'their journey, since ' },
						{ text: 'January 2024.', bold: true },
					],
				],
			},
			collaterals: {
				src: '/images/case-studies/air-india/collaterals.png',
				alt: 'Triangular baggage tags, stickers, e-ticket, and lounge access card holder',
			},
			environmental: {
				src: '/images/case-studies/air-india/environmental.png',
				alt: 'Airport environmental graphics — queue tops, counters, totems, welcome standees, and FIDS',
			},
			process: {
				title: 'Overall process and my contribution',
				diagram: {
					src: '/images/case-studies/air-india/process-timeline.png',
					alt: 'Process timeline from Empathize & Define through Execution with contribution notes',
				},
			},
		},
	},
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
	{
		id: 'akshar-chitra',
		category: 'Redefining a Hindi Primer',
		title: 'Akshar Chitra',
		client: 'With Typecraft Initiative',
		description: [
			"Most children’s primers treat letters and images as neighbors: an 'A' stands next to an Apple. But children recognize objects long before they decode abstract scripts. Akshar-Chitra collapses this distance.",
			'Developed with The Typecraft Initiative, Akshar-Chitra merges Hindi letters with Mithila art illustrations to create a single, intuitive visual unit, culturally grounded and enduring learning experience.',
		],
		skills: [
			'Research-driven design',
			'Illustration & Lettering',
			'Visual learning aid',
		],
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
			src: '/images/case-studies/akshar-chitra/hero.png',
			alt: 'Akshar Chitra letterform postcards arranged on a warm surface',
		},
		/** Figma Project 04 hero band */
		heroBandColor: '#f1cdc1',
		body: 'akshar-chitra',
		aksharChitra: {
			typecraft: {
				title: 'The Typecraft Initiative',
				body: [
					{
						text: 'Founded by Ishan Khosla, the Typecraft Initiative develops typefaces rooted in craft traditions, translating indigenous visual practices into contemporary design systems.',
					},
					{ text: '\n\n' },
					{
						text: "Typecraft’s concept of ‘Akshar Chitra’ extends this approach into early education, ",
					},
					{ text: 'bridging typography, craft and learning.', bold: true },
				],
				logo: {
					src: '/images/case-studies/akshar-chitra/typecraft-logo.png',
					alt: 'Typecraft Initiative wordmark on a dark brown field',
				},
			},
			collaborators: {
				title: 'Collaborators & Contributors',
				artists: {
					label: 'Mithila/Madhubani Artists',
					people: [
						{
							name: 'Pradyumna Kumar',
							image: {
								src: '/images/case-studies/akshar-chitra/artist-pradyumna.png',
								alt: 'Portrait of Pradyumna Kumar',
							},
						},
						{
							name: 'Pushpa Kumari',
							image: {
								src: '/images/case-studies/akshar-chitra/artist-pushpa.png',
								alt: 'Portrait of Pushpa Kumari',
							},
						},
						{
							name: 'Hira Kant',
							image: {
								src: '/images/case-studies/akshar-chitra/artist-hira.png',
								alt: 'Portrait of Hira Kant',
							},
						},
						{
							name: 'Rekha Rani',
							image: {
								src: '/images/case-studies/akshar-chitra/artist-rekha.png',
								alt: 'Portrait of Rekha Rani',
							},
						},
					],
				},
				teams: [
					{
						label: 'Design, Research\n& Development',
						people: [
							{
								name: 'Ashima Kaushik (me)',
								image: {
									src: '/images/case-studies/akshar-chitra/advisory-ashima.png',
									alt: 'Portrait of Ashima Kaushik',
								},
							},
						],
					},
					{
						label: 'Design Advisory\n(Typecraft)',
						people: [
							{
								name: 'Ishan Khosla',
								image: {
									src: '/images/case-studies/akshar-chitra/advisory-ishan.png',
									alt: 'Portrait of Ishan Khosla',
								},
							},
							{
								name: 'Shirley Bhatnagar',
								image: {
									src: '/images/case-studies/akshar-chitra/advisory-shirley.png',
									alt: 'Portrait of Shirley Bhatnagar',
								},
							},
						],
					},
				],
			},
			landscape: {
				title: 'The Landscape of Existing Tools',
				lead: [
					{ text: 'Reading requires the synchronization of ' },
					{ text: 'four neural processors.', bold: true },
					{
						text: ' Traditional Hindi tools often address these in isolation, forcing the child to perform the heavy lifting of integration.',
					},
				],
				primers: {
					src: '/images/case-studies/akshar-chitra/primers.png',
					alt: 'Stack of traditional Hindi varnamala primers and charts',
				},
				critiques: [
					{
						title: 'Flashcards & Rote Charts',
						body: 'Prioritize the Orthographic Processor (Letter Memory). Letters remain abstract shapes, often failing to trigger meaningful conceptual links.',
					},
					{
						title: 'Picture Books',
						body: 'Stimulate the Meaning Processor (Vocabulary) but separate the image from the letter, creating a "split-attention effect" that weakens phonemic connection.',
					},
					{
						title: 'Rhymes & Drills',
						body: 'Engage the Phonological Processor (Speech-Sound) but lack a stable visual anchor.',
					},
				],
				diagramTitle: '4-Step Learning Process',
				diagram: {
					src: '/images/case-studies/akshar-chitra/learning-diagram.png',
					alt: 'Diagram of four neural processors in the reading process',
				},
				watermark: {
					src: '/images/case-studies/akshar-chitra/watermark-right.png',
					alt: '',
				},
			},
			insight: {
				quotes: [
					[
						{
							text: 'Children recognise images before they read letters. ',
						},
						{
							text: 'What if letters looked like what children already recognize?',
							bold: true,
						},
					],
					[
						{ text: 'By using ' },
						{ text: 'Integrated Picture Mnemonics ', bold: true },
						{
							text: 'in Akshar Chitra, we create a simultaneous fire across all neural processors.',
						},
					],
				],
				processors: [
					{
						label: 'Context & Meaning',
						detail: "They recognize the familiar 'Machhli' (Fish)",
						barColor: '#efb7a4',
						labelColor: '#d48e76',
					},
					{
						label: 'Orthographic',
						detail: "The child sees the skeleton of the letter 'म'",
						barColor: '#c3d8d1',
						labelColor: '#799f9b',
					},
					{
						label: 'Phonological',
						detail: "The visual of the fish triggers the sound 'म /Ma' instantly",
						barColor: '#89aca8',
						labelColor: '#62807d',
					},
				],
			},
			process: {
				title: 'Process and Project Approach',
				watermarkLeft: {
					src: '/images/case-studies/akshar-chitra/watermark-left.png',
					alt: '',
				},
				steps: [
					{
						title: 'Vocabulary Mapping & Research',
						titleColor: '#4c8187',
						paragraphs: [
							[
								{ text: 'Audited standard ' },
								{ text: 'varnamala primers', bold: true },
								{ text: ' to identify a filtered ' },
								{ text: 'list of familiar, concrete nouns.', bold: true },
							],
							[
								{
									text: 'Through informal testing, I confirmed which objects children recognized, ensuring the vocabulary was grounded in their daily environment.',
								},
							],
						],
						glyph: {
							src: '/images/case-studies/akshar-chitra/1.png',
							alt: 'Mithila-style snake letterform study',
						},
						photo: {
							src: '/images/case-studies/akshar-chitra/process-photo-1.png',
							alt: 'Whiteboard of letter-object vocabulary mapping',
							width: 338,
							height: 207,
						},
					},
					{
						title: 'Establishing Illustration Logic',
						titleColor: '#92ae82',
						paragraphs: [
							[
								{
									text: 'The challenge was merging object shapes with letterforms without ',
								},
								{ text: 'compromising legibility.', bold: true },
								{ text: ' We established a rule: ' },
								{ text: 'letterform clarity always came first.', bold: true },
							],
							[
								{ text: 'This led to the construction logics: ' },
								{
									text: 'Repetition, Shape-based, Controlled Abstraction and Hybrid.',
									bold: true,
								},
							],
						],
						glyph: {
							src: '/images/case-studies/akshar-chitra/2.png',
							alt: 'Mithila-style fish letterform study',
						},
						photo: {
							src: '/images/case-studies/akshar-chitra/process-photo-2.png',
							alt: 'Letterform sketches with sticky note about illustration logic',
							width: 463,
							height: 183,
						},
					},
					{
						title: 'Artisan Collaboration',
						titleColor: '#d6a545',
						paragraphs: [
							[
								{ text: 'Working with ' },
								{ text: 'Mithila artists', bold: true },
								{
									text: ' required aligning two distinct visual systems: ',
								},
								{ text: 'Letterform proportions', bold: true },
								{ text: ' and ' },
								{ text: 'Madhubani art style.', bold: true },
							],
							[
								{
									text: 'I provided rough sketches, proportion guides and letter skeletons to help the artists maintain the ',
								},
								{ text: 'functional integrity', bold: true },
								{ text: ' of the letters while ' },
								{ text: 'preserving authenticity.', bold: true },
							],
						],
						glyph: {
							src: '/images/case-studies/akshar-chitra/3.png',
							alt: 'Mithila-style numeral letterform study',
						},
						photo: {
							src: '/images/case-studies/akshar-chitra/process-photo-3.png',
							alt: 'Artists collaborating on Mithila letterform drawings',
							width: 450,
							height: 162,
						},
					},
					{
						title: 'Classroom Validation',
						titleColor: '#c97f47',
						paragraphs: [
							[
								{
									text: 'As the system evolved, we returned to the classroom. ',
								},
								{
									text: 'Feedback from educators and primary learners',
									bold: true,
								},
								{
									text: ' helped us refine ambiguous illustrations to ensure recognition worked effectively in monochrome, urban and rural contexts.',
								},
							],
						],
						glyph: {
							src: '/images/case-studies/akshar-chitra/4.png',
							alt: 'Mithila-style twin fish letterform study',
						},
						photo: {
							src: '/images/case-studies/akshar-chitra/process-photo-4.png',
							alt: 'Classroom testing of Akshar Chitra with children',
							width: 450,
							height: 162,
						},
					},
				],
			},
			logics: {
				title: 'Establishing Illustration Logic',
				lead: 'There was no universal formula for building the letters. Even though four broad approaches were defined, each letter became its own puzzle with a new set of decisions.',
				cards: [
					{
						title: 'Repetition & Arrangement',
						body: [
							{
								text: 'Objects repeated and arranged to create the letter.\n',
							},
							{ text: 'Example: ', bold: true },
							{
								text: 'आम (mango) or चींटी (ants) — multiple objects lined up or stacked to spell out the letter.',
							},
						],
						image: {
							src: '/images/case-studies/akshar-chitra/logic-repetition.png',
							alt: 'Repetition approach letterform examples',
						},
					},
					{
						title: 'Object Shaping',
						body: [
							{
								text: "Single/multiple objects shaped to naturally form the letter.\n",
							},
							{ text: 'Example: ', bold: true },
							{
								text: "केला (banana) or नल (tap) — the object's form with very little abstraction suggests the letter.",
							},
						],
						image: {
							src: '/images/case-studies/akshar-chitra/logic-object.png',
							alt: 'Object shaping letterform examples with banana and tap',
						},
					},
					{
						title: 'Abstraction & Bending',
						body: [
							{
								text: 'Objects abstracted and bent to fit the letterform.\n',
							},
							{ text: 'Example: ', bold: true },
							{ text: 'अजगर (python) or हड्डी (bone)' },
						],
						image: {
							src: '/images/case-studies/akshar-chitra/logic-abstraction.png',
							alt: 'Abstraction approach letterform sketches',
						},
					},
					{
						title: 'Hybrid Approach',
						body: [
							{
								text: 'Combination of techniques to ensure optimal legibility and visual interest. ',
							},
							{ text: 'Example: ', bold: true },
							{ text: 'घड़ी (watch/clock) or गिरगिट (chameleon)' },
						],
						image: {
							src: '/images/case-studies/akshar-chitra/logic-hybrid.png',
							alt: 'Hybrid approach letterform examples',
						},
					},
				],
			},
			whiteboard: {
				background: {
					src: '/images/case-studies/akshar-chitra/white-board-bg.png',
					alt: '',
				},
				overlays: [
					{
						image: {
							src: '/images/case-studies/akshar-chitra/whiteboard-overlay-center.png',
							alt: 'Pinned letterform study sheets with peacock and animal motifs',
						},
						left: '23.5%',
						top: '31%',
						width: '30.5%',
						rotate: '-2deg',
					},
					{
						image: {
							src: '/images/case-studies/akshar-chitra/whiteboard-overlay-top.png',
							alt: 'Polaroid of a painted fish and peacock letterform',
						},
						left: '59.3%',
						top: '21%',
						width: '15.3%',
						rotate: '2deg',
					},
					{
						image: {
							src: '/images/case-studies/akshar-chitra/whiteboard-overlay-bottom.png',
							alt: 'Polaroid of a line-drawn Devanagari letter study',
						},
						left: '61.4%',
						top: '51.6%',
						width: '15.1%',
						rotate: '1deg',
					},
				],
			},
			pedagogy: {
				banner: {
					src: '/images/case-studies/akshar-chitra/pedagogy-pre.png',
					alt: 'Workshop table covered with Akshar Chitra letterform drawings',
				},
				insights: {
					title: 'Insights from\nTeachers and Learners',
					body: [
						{
							text: 'Teachers emphasized that clarity stems from objects that children see, use or talk about naturally (concrete nouns).\n\nSuch words anchor the letterform better than uncommon or abstract concepts like भगवान (god).',
						},
					],
					photo: {
						src: '/images/case-studies/akshar-chitra/pedagogy-insights.png',
						alt: 'Teachers and learners reviewing Akshar Chitra drawings around an outdoor table',
					},
				},
				decision: {
					letter: 'म',
					options: [
						{ label: "से 'मोबाइल'", color: '#da8383' },
						{ label: "से 'मखाना'", color: '#e0a751' },
						{ label: "से 'मछली'", color: '#8eb08c' },
					],
					preface:
						'While "Mobile" is universal, it is a transliterated. "Makhana" (Fox Nut) was regionally specific but difficult to identify without color.',
					solutionLabel: 'The Solution:',
					solutionBody:
						' Chose "Machhli" (Fish); it provided the strongest silhouette for monochrome recognition and offered the most scope for storytelling across rural and urban contexts.',
				},
				practice: {
					title: 'Pedagogy in Practice',
					lead: [
						{
							text: 'Beyond simple identification & vocabulary building, educators used the illustrations as ',
						},
						{ text: 'narrative prompts. ', bold: true },
						{
							text: 'This confirmed that instead of positioning as a children’s book, it should be ',
						},
						{ text: 'a teaching aid', bold: true },
						{ text: '.' },
					],
					listIntro: 'Also got insights about which illustrations to replace',
					replacements: [
						'where similar line drawings caused confusion (like Sugarcane vs. Bamboo).',
						'illustrations are not recognizable',
						'outdated or irrelevant words (like दवात i.e. inkpot)',
					],
					photo: {
						src: '/images/case-studies/akshar-chitra/pedagogy-classroom.png',
						alt: 'Educator presenting an Akshar Chitra drawing to school children outdoors',
					},
				},
				positioning: {
					title: 'Updated Positioning',
					photo: {
						src: '/images/case-studies/akshar-chitra/pedagogy-portrait.png',
						alt: 'Teacher holding a letterform drawing of a tap integrated with a bird motif',
					},
					columns: [
						{
							age: 'Pre-Primary (<5 yrs)',
							ageColor: '#4c8187',
							usage: 'Coloring Device for motor-skill development.',
						},
						{
							age: 'Primary (5-7 yrs)',
							ageColor: '#92af82',
							usage:
								'A tool to identify letters and build foundational vocabulary.',
						},
						{
							age: 'Middle School & Secondary (10-15 yrs)',
							ageColor: '#d5a545',
							usage:
								'Used for form integration, where students draw objects of their choice to form their initials.',
						},
						{
							age: 'Senior School/College students (>15 yrs)',
							ageColor: '#e8a56c',
							usage:
								'An experimental framework for vernacular form integration.',
						},
					],
				},
			},
			constraints: {
				title: 'Design Constraints & Key Decisions',
				items: [
					{
						title: 'Craft vs. Structure',
						body: [
							{
								text: 'The Mithila artists’ instinct was to prioritize the organic-ness of the art. My role was to act as the typographic anchor by providing proportion guides and letter skeletons to ensure the intricate decorative motifs affect a letter’s legibility.',
							},
						],
					},
					{
						title: 'The Maatra Problem',
						body: [
							{
								text: "Integrating illustrations into letters like 'भ' or 'ध' is already complex; adding vowel signs (maatras) often cluttered the illustration into illegibility.\n\nExample: भु से भुट्टा (corn)",
							},
						],
					},
					{
						title: 'The Colour Dependency',
						body: [
							{
								text: 'The aid was designed for low-cost, high-contrast photocopying (more accessible). But in a monochrome, line-art system, objects like a गाजर (carrot) and a मूली (radish) are visually identical. So we had to ',
							},
							{
								text: 'eliminate vocabulary that relied on colour for recognition.',
								bold: true,
							},
						],
					},
					{
						title: 'Ensuring Accessibility Across Classroom Conditions',
						body: [
							{ text: 'Exploring formats like ' },
							{
								text: 'tearaway sheets, perforated pages, and wall charts',
								bold: true,
							},
							{
								text: ' helped understand how the teaching aid might function in different settings.',
							},
						],
					},
				],
				bhuttaProcess: {
					src: '/images/case-studies/akshar-chitra/craft-bhutta-process.png',
					alt: 'Reference drawing, artist interpretation, and tracing paper for भुट्टा',
				},
				mockups: {
					src: '/images/case-studies/akshar-chitra/craft-mockups.png',
					alt: 'Accordion book and wall chart mockups of Akshar Chitra',
				},
			},
			impact: {
				title: 'Why This Matters?',
				lead: [
					{
						text: "Akshar-Chitra isn't just a teaching aid. It's a case study in how design can bridge multiple disciplines like ",
					},
					{
						text: 'typography, pedagogy, anthropology, craft and social impact.',
						bold: true,
					},
					{
						text: '\n\nIt demonstrates that the most meaningful design work happens at the ',
					},
					{
						text: 'intersection of research, culture and real-world problems.',
						bold: true,
					},
				],
				venn: {
					src: '/images/case-studies/akshar-chitra/venn-akshar.png',
					alt: 'Venn diagram intersecting education imagery, Hindi language, and Mithila art at Akshar Chitra',
				},
				cards: [
					{
						title: 'For Craftspeople',
						body: 'Increased awareness of how traditional crafts can be transformed through design. Gaining exposure to new markets and new ways of thinking about their work.',
						titleColor: '#3d2e00',
						bodyColor: '#ffffff',
						image: {
							src: '/images/case-studies/akshar-chitra/wtm-card-1.png',
							alt: '',
						},
					},
					{
						title: 'For Educators & Students',
						body: 'Teachers discovered a tool that sparks conversation and engagement, with children. Older students found creative challenge in drawing letters from objects.',
						titleColor: '#552001',
						bodyColor: '#ffffff',
						image: {
							src: '/images/case-studies/akshar-chitra/wtm-card-2.png',
							alt: '',
						},
					},
					{
						title: 'For Designers',
						body: 'This project demonstrates that graphic design can operate at the intersection of education, culture, craft and social impact.',
						titleColor: '#273209',
						bodyColor: '#ffffff',
						image: {
							src: '/images/case-studies/akshar-chitra/wtm-card-3.png',
							alt: '',
						},
					},
				],
			},
		},
	},
	{
		id: 'way-of-the-witch',
		number: '03',
		category: 'Book Cover Design',
		title: 'Way of the Witch',
		client: 'For Harper Collins',
		description: [
			'Way of the Witch by Ipsita Chakraborty explores Wicca as a belief system and way of life, delving into its rituals, symbolism and mythology.',
			'Commissioned by HarperCollins India, Ishan Khosla Design Studio developed the book cover, with my contribution spanning concept development and visual design.',
		],
		skills: ['Cover Design', 'Illustration'],
		tools: [
			{
				name: 'Adobe Illustrator',
				iconSrc: '/icons/tools/illustrator.png',
			},
			{
				name: 'Adobe Photoshop',
				iconSrc: '/icons/tools/photoshop.png',
			},
			{
				name: 'Adobe InDesign',
				iconSrc: '/icons/tools/indesign.png',
			},
		],
		hero: {
			src: '/images/case-studies/way-of-the-witch/hero.png',
			alt: 'Way of the Witch hardcover with gold foil lettering on a textured surface',
		},
		heroBandColor: '#e4e0d7',
		body: 'way-of-the-witch',
		witch: {
			brief: {
				title: 'Project Brief',
				body: 'Design a cover that evokes the look and feel of an antique spellbook, using foil detailing, symbolic Wiccan iconography and period-inspired typography to capture the mystical essence of the book.',
			},
			moodboard: {
				src: '/images/case-studies/way-of-the-witch/moodboard.png',
				alt: 'Research moodboard with occult symbols, leather bindings, cauldron, moon phases, and colour palette',
			},
			iterationsTitle: 'Proposed Iterations',
			iterations: [
				{
					src: '/images/case-studies/way-of-the-witch/iteration-1.png',
					alt: 'Purple cover iteration with cauldron motif',
				},
				{
					src: '/images/case-studies/way-of-the-witch/iteration-2.png',
					alt: 'Green cover iteration with gold foil border',
				},
				{
					src: '/images/case-studies/way-of-the-witch/iteration-3.png',
					alt: 'Red cover iteration with pentagram',
				},
				{
					src: '/images/case-studies/way-of-the-witch/iteration-4.png',
					alt: 'Black cover iteration with triple moon',
				},
				{
					src: '/images/case-studies/way-of-the-witch/iteration-5.png',
					alt: 'Deep red cover iteration variant',
				},
				{
					src: '/images/case-studies/way-of-the-witch/iteration-6.png',
					alt: 'Forest green cover iteration variant',
				},
				{
					src: '/images/case-studies/way-of-the-witch/iteration-7.png',
					alt: 'Burgundy cover iteration variant',
				},
				{
					src: '/images/case-studies/way-of-the-witch/iteration-8.png',
					alt: 'Charcoal cover iteration variant',
				},
			],
			selectedTitle: 'Selected Design',
			selected: {
				src: '/images/case-studies/way-of-the-witch/selected.png',
				alt: 'Final Way of the Witch hardcover resting on a stone pedestal',
			},
			details: {
				src: '/images/case-studies/way-of-the-witch/details.png',
				alt: 'Annotated cover with callouts for foil border, typography, cauldron, pentagram, triple moon, and triskele',
			},
		},
	},
	{
		id: 'reconnect',
		number: '10',
		category: 'Inclusive Design',
		title: 'Reconnect',
		client: 'For LV Prasad Eye Institute',
		description: [
			'The Reconnect project was initiated by LV Prasad Eye Institute (LVPEI) in their innovation lab, supported by its rehabilitation centre, to create something meaningful for visually impaired children.',
			'I provided research insights that guided the design direction of an inclusive play experience—building cognitive, motor, and spatial skills while fostering empathy in sighted players—and developed the visual identity (logo) for the game.',
		],
		skills: [
			'User research & Insight synthesis',
			'Inclusive design thinking',
			'Empathy',
		],
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
			src: '/images/case-studies/reconnect/hero.png',
			alt: 'Reconnect diamond board with green tactile pieces on a teal and navy textured surface',
		},
		/** Mint wash — Figma Project 6 hero band */
		heroBandColor: '#a4d4c6',
		body: 'reconnect',
		reconnect: {
			research: {
				title: 'Understanding the Gap',
				primaryLabel: 'Primary Research',
				primaryBody: [
					{
						text: 'The research explored perspectives on visual impairment, examining its ',
					},
					{ text: 'impact', bold: true },
					{
						text: ' on education, employment, and quality of life, along with cognitive and sensory adaptations. It drew from ',
					},
					{ text: 'inclusive design principles', bold: true },
					{ text: ', ' },
					{ text: 'psychology of play', bold: true },
					{ text: ', and the role of ' },
					{
						text: 'shared activities in building social connection',
						bold: true,
					},
					{
						text: ', while also considering advancements in assistive technologies such as ',
					},
					{ text: 'tactile interfaces and gamification', bold: true },
					{ text: '. These ' },
					{
						text: 'insights collectively shaped an empathetic, inclusive solution.',
						bold: true,
					},
				],
				fieldLabel: 'On-field Research',
				fieldEyebrow: 'Qualitative and Observational Research',
				fieldBody: [
					{
						text: 'To understand the lives and needs of visually impaired children across rehabilitation settings, insights were gathered through ',
					},
					{
						text: 'daily routines, therapy sessions, parent interactions and play activities',
						bold: true,
					},
					{
						text: ', revealing tactile preferences and group dynamics at LVPEI Rehab Centre. Visited educational and social organisations such as Devnar School for the Blind, Courage Homes, Sahara NGO, National Association for the Blind (Gurgaon), and TTI of Poona Blind Men’s Association, learning how ',
					},
					{
						text: 'children learn, play, and navigate social environments.',
						bold: true,
					},
				],
				interviewsTitle: 'Interviews',
				interviewsLead:
					'We engaged with various stakeholders to uncover diverse perspectives:',
				stakeholders: [
					{
						label: 'Users: ',
						detail:
							'Explored their daily challenges, preferences, and aspirations.',
					},
					{
						label: 'Rehab Staff and Teachers: ',
						detail:
							'Discussed teaching methods, difficulties, and key areas of focus.',
					},
					{
						label: 'Innovators: ',
						detail:
							'Gathered insights on existing solutions, gaps, and potential for improvement.',
					},
				],
				classroom: {
					src: '/images/case-studies/reconnect/research-classroom.png',
					alt: 'Students gathered outdoors at Devnar School for the Blind',
				},
				play: {
					src: '/images/case-studies/reconnect/research-play.png',
					alt: 'Children and facilitators interacting around a table during a research visit',
				},
				collage: {
					src: '/images/case-studies/reconnect/research-collage.png',
					alt: 'Field research collage — rehab meets, play sessions, chess championship, and LVPEI IT centre',
				},
			},
			direction: {
				title: 'Shaping the Direction',
				lead: [
					{
						text: 'While our research explored multiple aspects of a visually impaired child’s life, ',
					},
					{ text: 'play emerged as a critical area of impact.', bold: true },
				],
				insightsTitle: 'Key Insights',
				insights: [
					[
						{ text: 'Visually impaired children ' },
						{ text: 'rely', bold: true },
						{ text: ' on ' },
						{ text: 'touch, sound, and spatial awareness', bold: true },
						{ text: ' to engage with their environment.' },
					],
					[
						{ text: 'Play is essential for ' },
						{
							text: 'developing cognitive, motor, and social skills',
							bold: true,
						},
						{ text: ' but existing play tools are ' },
						{
							text: 'rarely designed for shared interaction',
							bold: true,
						},
						{ text: ' with sighted peers.' },
					],
					[
						{ text: 'Inclusive play environments foster ' },
						{ text: 'empathy, collaboration', bold: true },
						{ text: ' and ' },
						{ text: 'confidence', bold: true },
						{ text: ' among children.' },
					],
					[
						{ text: 'Limited play opportunities ' },
						{ text: 'affect social interaction', bold: true },
						{ text: ', confidence, and overall development.' },
					],
					[
						{ text: 'Visually impaired children have ' },
						{ text: 'limited access to inclusive play', bold: true },
						{ text: ' experiences.' },
					],
				],
				hmwTitle: 'Reframing problems into opportunities',
				hmw: [
					'HMW design a game for visually impaired kids that supports brain development and engages their cognitive, motor and tactile senses?',
					'HMW bridge gaps between sighted and visually impaired individuals through play?',
				],
				photo: {
					src: '/images/case-studies/reconnect/insight-photo.png',
					alt: 'Children playing a tactile board game together during research',
				},
				photoCaption:
					'Witnessed a chess championship amongst rehab clients',
				pillars: [
					{
						title: 'Acceptance',
						caption: 'of their special abilities',
						icon: {
							src: '/images/case-studies/reconnect/icon-acceptance.png',
							alt: '',
						},
					},
					{
						title: 'Inclusive',
						caption: 'All can play',
						icon: {
							src: '/images/case-studies/reconnect/icon-inclusive.png',
							alt: '',
						},
					},
					{
						title: 'Reconnect',
						caption: 'with everyone through play',
						icon: {
							src: '/images/case-studies/reconnect/icon-reconnect.png',
							alt: '',
						},
					},
				],
			},
			outcome: {
				title: 'Outcome: RECONNECT',
				lead: [
					{ text: 'Using the research insights', bold: true },
					{
						text: ', the design team developed Reconnect — an inclusive game which emerged as the embodiment of those insights. It builds confidence in visually impaired players, while allowing sighted players to experience play without sight, encouraging empathy and new perspectives. It extends beyond types of players to embrace inclusivity across all users—regardless of vision, age or gender, without barriers.',
					},
				],
				aboutTitle: 'About the game',
				aboutBody:
					'Reconnect reimagines Dots and Boxes as a tactile game for both visually impaired and sighted players. Simple yet strategic, it offers a familiar but interactive experience that supports cognitive and spatial development.',
				explorationTitle: 'Board Game & 3D Exploration',
				explorationBody:
					'Dots connect to form shapes, introducing basic geometry and strategy. The same concept extends into 3D, where building forms by hand enables a more tactile understanding of space.',
				products: [
					{
						src: '/images/case-studies/reconnect/product-diamond.png',
						alt: 'Diamond Reconnect board with green connectors and white rods',
					},
					{
						src: '/images/case-studies/reconnect/product-hex.png',
						alt: 'Hexagonal Reconnect board with connected geometric forms',
					},
					{
						src: '/images/case-studies/reconnect/product-piece-1.png',
						alt: 'Close-up of green spherical game connectors',
					},
					{
						src: '/images/case-studies/reconnect/product-piece-2.png',
						alt: 'Close-up of assembled 3D tactile game pieces',
					},
				],
				feature: {
					src: '/images/case-studies/reconnect/work-card.png',
					alt: 'Final Reconnect diamond board staged on a teal and navy textured surface',
				},
				tagline: [
					{ text: 'A game ', bold: true },
					{
						text: 'that transforms a simple pen-and-paper concept into a tangible, ',
					},
					{ text: 'inclusive experience', bold: true },
					{ text: ' for the visually impaired.' },
				],
			},
			logo: {
				title: 'Logo Design',
				lead: [
					{ text: 'Inspired by the ' },
					{ text: 'top view', bold: true },
					{ text: ' of the game board, the logo represents ' },
					{ text: 'players as adaptable elements', bold: true },
					{ text: ' within the system.' },
				],
				groupsLead: [
					{ text: 'The form draws from four player groups coming together to ' },
					{ text: 'Reconnect', bold: true },
					{ text: ':' },
				],
				groups: [
					'Blindfolded players',
					'Sighted players',
					'Congenitally blind',
					'Adventitiously blind',
				],
				mark: {
					src: '/images/case-studies/reconnect/logo.png',
					alt: 'Reconnect logo mark — four interlocking forms meeting at the centre',
				},
				wordmark: 'RECONNECT',
				piece: {
					src: '/images/case-studies/reconnect/piece-closeup.png',
					alt: 'Close-up of a green Reconnect game piece that inspired the logo',
				},
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
