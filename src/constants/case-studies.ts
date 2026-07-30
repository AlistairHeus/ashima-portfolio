import { caseStudySchema, type CaseStudy } from '../schemas/content';

/**
 * Featured case studies for the folder-tab section.
 * Projects 2–4 are structural placeholders until final copy and assets land.
 */
export const CASE_STUDIES: readonly CaseStudy[] = [
  caseStudySchema.parse({
    id: 'igl-rebrand',
    tabLabel: 'PROJECT 1',
    title: 'Rebranding Indraprastha Gas Limited',
    description:
      'Reimagining a legacy energy brand through strategy-led identity design, balancing familiarity with a vision for sustainable growth.',
    tags: ['Brand Strategy', 'Visual Identity', 'Brand Systems'],
    imageSrc: '/images/case-studies/igl.jpg',
    imageAlt: 'Indraprastha Gas Limited rebrand visual system',
    themeKey: 'project1',
  }),
  caseStudySchema.parse({
    id: 'project-2',
    tabLabel: 'PROJECT 2',
    title: 'Project 2',
    description: 'Case study details coming soon.',
    tags: ['Placeholder'],
    imageSrc: '/images/case-studies/placeholder.jpg',
    imageAlt: 'Project 2 preview',
    themeKey: 'project2',
  }),
  caseStudySchema.parse({
    id: 'project-3',
    tabLabel: 'PROJECT 3',
    title: 'Project 3',
    description: 'Case study details coming soon.',
    tags: ['Placeholder'],
    imageSrc: '/images/case-studies/placeholder.jpg',
    imageAlt: 'Project 3 preview',
    themeKey: 'project3',
  }),
  caseStudySchema.parse({
    id: 'project-4',
    tabLabel: 'PROJECT 4',
    title: 'Project 4',
    description: 'Case study details coming soon.',
    tags: ['Placeholder'],
    imageSrc: '/images/case-studies/placeholder.jpg',
    imageAlt: 'Project 4 preview',
    themeKey: 'project4',
  }),
] as const;

/** Default active featured case study id. */
export const DEFAULT_CASE_STUDY_ID = CASE_STUDIES[0].id;
