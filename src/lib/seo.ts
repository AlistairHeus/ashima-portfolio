import { SEO, SITE } from '../constants/site';
import { PERSON } from '../constants/person';
import { SOCIAL_LINKS } from '../constants/social';
import type { SeoMeta } from '../schemas/content';

/**
 * Optional per-page SEO overrides merged onto site defaults.
 */
export type PageSeoInput = {
  readonly title?: string;
  readonly description?: string;
  readonly path?: string;
  readonly ogImage?: string;
  readonly noIndex?: boolean;
};

/**
 * Resolved SEO fields ready for `<head>` rendering.
 */
export type ResolvedPageSeo = {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: string;
  readonly ogImageUrl: string;
  readonly locale: string;
  readonly twitterCard: SeoMeta['twitterCard'];
  readonly robots: string;
};

/**
 * Builds absolute URLs from a site origin and a path or asset path.
 */
export const toAbsoluteUrl = (origin: string, path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedOrigin = origin.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedOrigin}${normalizedPath}`;
};

/**
 * Merges page-level SEO input with site defaults.
 */
export const resolvePageSeo = (input: PageSeoInput = {}): ResolvedPageSeo => {
  const path = input.path ?? '/';
  const title = input.title ?? SEO.title;
  const description = input.description ?? SEO.description;
  const ogImage = input.ogImage ?? SEO.ogImage;

  return {
    title,
    description,
    canonicalUrl: toAbsoluteUrl(SEO.siteUrl, path),
    ogImageUrl: toAbsoluteUrl(SEO.siteUrl, ogImage),
    locale: SEO.locale,
    twitterCard: SEO.twitterCard,
    robots: input.noIndex ? 'noindex, nofollow' : 'index, follow',
  };
};

/**
 * Builds JSON-LD for a Person entity matching the portfolio owner.
 */
export const buildPersonJsonLd = (): Record<string, unknown> => {
  const sameAs = SOCIAL_LINKS
    .filter((link) => link.id !== 'email')
    .map((link) => link.href);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PERSON.name,
    jobTitle: SITE.role,
    description: PERSON.bio,
    url: SEO.siteUrl,
    image: toAbsoluteUrl(SEO.siteUrl, PERSON.portraitSrc),
    sameAs,
    email: SOCIAL_LINKS.find((link) => link.id === 'email')?.href.replace('mailto:', ''),
  };
};
