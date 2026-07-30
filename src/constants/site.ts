import { seoSchema, type SeoMeta } from '../schemas/content';

/**
 * Default SEO and site identity. Update `siteUrl` before production deploy.
 */
export const SEO: SeoMeta = seoSchema.parse({
  title: 'Ashima Kaushik — Visual Communication Designer',
  description:
    'Portfolio of Ashima Kaushik, a visual communication designer creating thoughtful visual systems through research, strategy, typography and storytelling.',
  siteUrl: 'https://ashimakaushik.com',
  ogImage: '/og-image.jpg',
  locale: 'en_IN',
  twitterCard: 'summary_large_image',
});

/**
 * Site-wide brand strings reused in layout, header, and structured data.
 */
export const SITE = {
  brandName: 'ASHIMA KAUSHIK',
  personName: 'Ashima Kaushik',
  role: 'Visual Communication Designer',
  /** Path to a downloadable resume PDF when available. */
  resumeHref: '/resume.pdf',
} as const;
