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

export type CaseStudyBody = 'gallery' | 'mythila';

export interface CaseStudy {
	readonly id: string;
	readonly category: string;
	readonly title: string;
	readonly client: string;
	readonly description: readonly string[];
	readonly skills: readonly string[];
	readonly tools: readonly CaseStudyTool[];
	readonly hero: CaseStudyImage;
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
