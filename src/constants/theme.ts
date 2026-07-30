/**
 * Design tokens mirrored from the Figma Portfolio Website file.
 * Prefer CSS variables / Tailwind theme utilities in components;
 * use these constants when JS needs the raw values.
 */
export const COLORS = {
  /** Page canvas / warm off-white. */
  canvas: '#f7f1ec',
  /** Primary body ink. */
  ink: '#2e2f38',
  /** Muted slate used for nav, bio, and labels. */
  muted: '#60728c',
  /** Near-black used for section titles and strong copy. */
  dark: '#181818',
  /** Secondary heading gray for project list titles. */
  heading: '#4c4c4c',
  /** Material on-surface-variant for chips. */
  onSurfaceVariant: '#49454f',
  /** Strong chip / outline border. */
  borderStrong: '#484848',
  /** Soft chip border. */
  borderSoft: '#9ba1a5',
  /** White Polaroid frame / surfaces. */
  white: '#ffffff',
  /** Footer wash over canvas. */
  footerWash: 'rgba(96, 114, 140, 0.23)',
  /** Experience panel wash. */
  panelWash: 'rgba(96, 114, 140, 0.12)',
  /** Yellow underline accent under the role phrase. */
  underline: '#e6c35c',
} as const;

/**
 * Tab and folder surface colors for featured case studies.
 */
export const PROJECT_THEMES = {
  project1: {
    label: '#3b576e',
    surface: '#BED7ED',
  },
  project2: {
    label: '#7c340a',
    surface: '#EAA57D',
  },
  project3: {
    label: '#4a3a06',
    surface: '#DCC67D',
  },
  project4: {
    label: '#2e3716',
    surface: '#A9B195',
  },
} as const;

/**
 * Font family stacks. Prefer Fontsource packages over local files.
 * Amarna: https://fonts.google.com/specimen/Amarna
 * Betania Patmos: https://fonts.google.com/specimen/Betania+Patmos
 */
export const FONTS = {
  /** Amarna — brand, headlines, section titles (humanist sans). */
  display: '"Amarna", "Segoe UI", sans-serif',
  /** Lato — UI labels, tracked uppercase, HELLO!. */
  sans: '"Lato", "Segoe UI", sans-serif',
  /** Mukta — body copy and chips. */
  body: '"Mukta", "Segoe UI", sans-serif',
  /** Betania Patmos — handwritten experience + specialty list. */
  accent: '"Betania Patmos", "Segoe Print", cursive',
} as const;

/**
 * Layout rhythm aligned to the 1920 desktop artboard.
 */
export const LAYOUT = {
  /** Max content width matching the Figma content column. */
  maxWidth: '1200px',
  /** Horizontal page gutter at desktop. */
  pageGutter: '360px',
  /** Softened gutter used at tablet/mobile; large screens rely on max-width. */
  pageGutterFluid: 'clamp(1.25rem, 4vw, 2.5rem)',
} as const;

/** Union of featured project theme keys. */
export type ProjectThemeKey = keyof typeof PROJECT_THEMES;
