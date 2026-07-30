import { socialLinkSchema, type SocialLink } from '../schemas/content';

/**
 * Footer contact and social destinations.
 * Replace placeholder hrefs with production URLs.
 */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  socialLinkSchema.parse({
    id: 'email',
    label: 'Email',
    href: 'mailto:hello@ashimakaushik.com',
  }),
  socialLinkSchema.parse({
    id: 'linkedin',
    label: 'Linkedin',
    href: 'https://www.linkedin.com/',
  }),
  socialLinkSchema.parse({
    id: 'behance',
    label: 'Behance',
    href: 'https://www.behance.net/',
  }),
] as const;

/**
 * Footer closing copy from the Figma design.
 */
export const FOOTER_COPY = {
  eyebrow: "What's next?",
  message: 'Hopefully, something we build together.',
} as const;
