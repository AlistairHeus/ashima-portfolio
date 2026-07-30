import { personSchema, type Person } from '../schemas/content';

/**
 * Hero identity and bio content from the Figma Home Page design.
 */
export const PERSON: Person = personSchema.parse({
  name: 'Ashima Kaushik',
  role: 'visual communication designer',
  greeting: 'HELLO!',
  headline: "I'm Ashima Kaushik",
  bio: 'A visual communication designer creating thoughtful visual systems through research, strategy, typography and storytelling.',
  experienceYears: '4 years',
  specialties: [
    'Brand Identity',
    'Editorial Design',
    'Typography',
    'Design Research',
  ],
  portraitSrc: '/images/portrait.png',
  portraitAlt: 'Ashima Kaushik smiling outdoors',
});
