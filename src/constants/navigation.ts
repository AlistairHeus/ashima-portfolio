import { navItemSchema, type NavItem } from '../schemas/content';
import { SITE } from './site';

/**
 * Primary header navigation.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  navItemSchema.parse({ label: 'Work', href: '#work' }),
  navItemSchema.parse({ label: 'Resume', href: SITE.resumeHref, external: true }),
  navItemSchema.parse({ label: 'Contact', href: '#contact' }),
] as const;
