import { z } from 'zod';

/**
 * Schema for a primary navigation item.
 */
export const navItemSchema = z.object({
  /** Visible label in the header. */
  label: z.string().min(1),
  /** In-page hash or absolute URL. */
  href: z.string().min(1),
  /** Optional external destination flag. */
  external: z.boolean().optional().default(false),
});

/**
 * Schema for a social or contact link in the footer.
 */
export const socialLinkSchema = z.object({
  /** Visible label (e.g. Email, LinkedIn). */
  label: z.string().min(1),
  /** Destination URL or mailto link. */
  href: z.string().min(1),
  /** Machine-friendly key for analytics or icons. */
  id: z.enum(['email', 'linkedin', 'behance']),
});

/**
 * Schema for a tagged specialty listed in the hero meta panel.
 */
export const specialtySchema = z.string().min(1);

/**
 * Schema for a featured case study shown in the folder tab UI.
 */
export const caseStudySchema = z.object({
  /** Stable identifier used for tab state. */
  id: z.string().min(1),
  /** Short tab label (e.g. PROJECT 1). */
  tabLabel: z.string().min(1),
  /** Case study title. */
  title: z.string().min(1),
  /** Short supporting description. */
  description: z.string().min(1),
  /** Topic chips shown under the description. */
  tags: z.array(z.string().min(1)).min(1),
  /** Public image path under `/public` or imported asset path. */
  imageSrc: z.string().min(1),
  /** Accessible description of the case study image. */
  imageAlt: z.string().min(1),
  /** Theme token key used for tab and folder surface colors. */
  themeKey: z.enum(['project1', 'project2', 'project3', 'project4']),
});

/**
 * Schema for a secondary project row in the Other Projects list.
 */
export const otherProjectSchema = z.object({
  /** Stable identifier. */
  id: z.string().min(1),
  /** Project title. */
  title: z.string().min(1),
  /** Topic chips for the project. */
  tags: z.array(z.string().min(1)).min(1),
  /** Optional deep link when a detail page exists. */
  href: z.string().optional(),
});

/**
 * Schema for default SEO metadata used across pages.
 */
export const seoSchema = z.object({
  /** Document title. */
  title: z.string().min(1),
  /** Meta description for search and social previews. */
  description: z.string().min(1),
  /** Canonical site origin without trailing slash. */
  siteUrl: z.string().url(),
  /** Default Open Graph image path or absolute URL. */
  ogImage: z.string().min(1),
  /** Locale string for Open Graph (e.g. en_IN). */
  locale: z.string().min(1),
  /** Twitter / X card type. */
  twitterCard: z.enum(['summary', 'summary_large_image']),
});

/**
 * Schema for person identity used in hero copy and JSON-LD.
 */
export const personSchema = z.object({
  /** Full display name. */
  name: z.string().min(1),
  /** Short role or job title. */
  role: z.string().min(1),
  /** Hero greeting line. */
  greeting: z.string().min(1),
  /** Primary headline under the greeting. */
  headline: z.string().min(1),
  /** Biography paragraph. */
  bio: z.string().min(1),
  /** Years of experience label value. */
  experienceYears: z.string().min(1),
  /** Specialty list shown in the hero meta panel. */
  specialties: z.array(specialtySchema).min(1),
  /** Portrait image path. */
  portraitSrc: z.string().min(1),
  /** Portrait alt text. */
  portraitAlt: z.string().min(1),
});

/** Inferred navigation item type. */
export type NavItem = z.infer<typeof navItemSchema>;

/** Inferred social link type. */
export type SocialLink = z.infer<typeof socialLinkSchema>;

/** Inferred case study type. */
export type CaseStudy = z.infer<typeof caseStudySchema>;

/** Inferred other project type. */
export type OtherProject = z.infer<typeof otherProjectSchema>;

/** Inferred SEO metadata type. */
export type SeoMeta = z.infer<typeof seoSchema>;

/** Inferred person identity type. */
export type Person = z.infer<typeof personSchema>;
