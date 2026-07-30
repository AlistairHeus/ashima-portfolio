import { otherProjectSchema, type OtherProject } from '../schemas/content';

/**
 * Secondary projects listed under Other Projects.
 */
export const OTHER_PROJECTS: readonly OtherProject[] = [
  otherProjectSchema.parse({
    id: 'maahi',
    title: 'Maahi: Logo Design',
    tags: ['Logo Design', 'Narrative-driven design', 'Brand identity development'],
  }),
  otherProjectSchema.parse({
    id: 'air-india',
    title: 'Air India: Customer Experience',
    tags: ['Systems thinking', 'Information Hierarchy', 'Brand Translation'],
  }),
  otherProjectSchema.parse({
    id: 'royal-enfield',
    title: 'Royal Enfield TGHE Book',
    tags: ['Editorial design', 'Information hierarchy', 'Layout Grids & Compositions'],
  }),
  otherProjectSchema.parse({
    id: 'vivan-hospital',
    title: 'Vivan Hospital: Print & Digital Design',
    tags: ['Brand Translation', 'Print Media', 'Digitization'],
  }),
  otherProjectSchema.parse({
    id: 'reconnect',
    title: 'Reconnect: Researching Inclusive Play',
    tags: ['Design Research', 'Inclusive Design', 'User Research'],
  }),
  otherProjectSchema.parse({
    id: 'logofolio',
    title: 'Logofolio',
    tags: ['Logo Design', 'Visual Storytelling', 'Concept Development'],
  }),
] as const;
