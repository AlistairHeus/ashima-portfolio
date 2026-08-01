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

/** Default landing band when a study does not set its own accent. */
export const DEFAULT_CASE_STUDY_BAND = '#e2e0d9';

export interface CaseStudy {
	readonly id: string;
	readonly category: string;
	readonly title: string;
	readonly client: string;
	readonly description: readonly string[];
	readonly skills: readonly string[];
	readonly tools: readonly CaseStudyTool[];
	readonly hero: CaseStudyImage;
	readonly gallery: readonly CaseStudyImage[];
	readonly feature: CaseStudyImage;
	/**
	 * Full-bleed landing band behind navbar + titles + top of hero image.
	 * Override per project (e.g. taupe, lavender, mint).
	 */
	readonly heroBandColor?: string;
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
