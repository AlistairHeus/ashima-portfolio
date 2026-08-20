---
name: responsive-design
description: >-
  Applies this portfolio's responsive layout, typography, heading wrap, and
  motion rules. Use when adding or editing pages, sections, headings, grids,
  spacing, mobile/desktop layouts, SplitText line breaks, orphans, or anything
  using page-padding, cz-h1–h4, lg:, 2xl:, or DESKTOP_MOTION_QUERY.
---

# Responsive design

This site is one layout that reflows. Do not ship separate desktop and mobile copies of the same heading or section.

## Breakpoints

Default Tailwind: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.

| Token | Role |
| --- | --- |
| Default / `sm` / `md` | Type, padding, and stack; layout stays one column |
| `lg` (1024) | Two-column grids, nav extras, **all expensive GSAP** |
| `xl` | Heading size and padding only; skip `lg` on overlay type so 13-inch laptops stay compact |
| `2xl` | Large type, gaps, and decorative images — not a third layout |

`lg` is the only layout fork. `2xl` is scale, not structure.

Motion gate (must match `lg`):

```ts
"(min-width: 1024px) and (prefers-reduced-motion: no-preference)"
```

Defined as `DESKTOP_MOTION_QUERY` in `src/lib/gsap.ts`. Native scroll below 1024. ScrollSmoother, SplitText, and ScrollTrigger intros only inside this query.

## Layout tokens

Use classes from `src/app/globals.css`, do not invent parallel padding or gaps.

| Class | Use |
| --- | --- |
| `page-padding` | Horizontal inset: `px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24` |
| `page-container` | Inner pages: min-height, top offset for nav, `page-padding` |
| `section-container` | Home sections: `py-16 md:py-24 2xl:py-32` |
| `section-header-mb` | Space under a section heading |
| `card-padding` | Inside cards |
| `grid-gap-small` / `grid-gap-cards` / `grid-gap-large` | Grid gaps (jump at `2xl`) |
| `cta-group` | Button rows |
| `content-stack` / `page-header-stack` | Vertical stacks |

Grids: `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3|4`. Open-source cards add `2xl:grid-cols-3`.

Hide or swap **chrome**, not copy:

- OK: testimonials carousel `lg:hidden` vs desktop grid; work list “Services” column `hidden lg:block`; section index `hidden lg:flex`
- Not OK: two headings with `hidden lg:block` / `lg:hidden` and `headingsDesktop` / `headingsMobile` arrays

## Type

Orbitron (`font-fancy`) for headings. Hanken Grotesk (`font-corporate` / sans) for body.

| Class | Scale |
| --- | --- |
| `cz-h1` / `common-pageheading` | Display / page title |
| `cz-h2` / `common-pagesubheading` | Section title |
| `cz-h3` / `cz-h4` | Card and article titles |
| `cz-p-large` / `cz-p` / `cz-p-small` | Body |
| `menu-link` | Fullscreen nav — skips `lg` on purpose |

Leading (Tailwind): heading `1.25`, subheading `1.35`, body `1.65`. Split characters inherit line-height. Do not put `overflow-hidden` on a heading unless a line mask already clips the reveal — tight overflow clips Orbitron descenders (`y`, `g`).

Icons: `icon-xs` … `icon-xl` in `globals.css`. Buttons use `CommonButton` size variants, not ad-hoc padding.

## Headings: one string, live wrap

Content objects expose a single `heading` (and `subtitle` when needed). The browser wraps. GSAP SplitText then splits **those** line boxes.

Heading SplitText (`SPLIT_TEXT_OPTIONS`):

- `type: "lines,words,chars"`
- `mask: "lines"` (one clip per line, not per glyph)
- `autoSplit: true` so resize and font-load re-split

Body copy (`SPLIT_WORDS_OPTIONS`): words only. Do not split paragraphs into characters.

Load cost: hero `MainHeading` / page-header `AnimatedParagraph` may split on desktop mount. Section `AnimatedSubheading` and `AnimatedParagraphScroll` split only when near the viewport (`runWhenNearViewport`).

### Wrap quality

`text-balance` is on `cz-h1`–`cz-h4`. It fights SplitText line detection. If lines look wrong after a split, remove `text-balance` on **that** animated heading, not by forking copy.

Orphans (one word on the last line) and bad `&` breaks: fix in **copy or a non-breaking space**, not a second heading.

```ts
// Keep a short tail with the previous word
"rooted in intent, and\u00a0determinism"
"cutting-edge interactive\u00a0experiences"
```

Or shorten / rephrase so lines are even. Do not restore `headingsDesktop` / `headingsMobile`.

Body paragraphs may use `text-pretty` or `text-balance`. Headings that use line SplitText should not rely on `text-balance` for the final wrap.

## Motion and hydration

- `PageTransition` and `Nav` stay **outside** `#smooth-wrapper` (`layout.tsx`) so `position: fixed` is the viewport
- `suppressHydrationWarning` on `<html>` and `<body>` (theme `color-scheme` + extensions)
- `.gsap-reveal { visibility: hidden }` plus noscript fallback in `layout.tsx`
- Prefer `yPercent` inside line masks

## Checklist

When adding or changing a section:

1. One heading string in data; one heading in the DOM
2. Spacing from the token list above
3. Layout change only at `lg`; size/gap jumps at `2xl`
4. GSAP / SplitText / smoother behind `DESKTOP_MOTION_QUERY`
5. Check wrap at ~375px, ~1280px (13-inch), and ~1536px — no orphaned last word, no clipped descenders
6. Do not duplicate the tree with `hidden lg:block` unless the **UI** is actually different
