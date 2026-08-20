/**
 * Generates Utopia-style fluid clamp() tokens for Ashima (Phase B).
 *
 * Source of truth: ./fluid-token-scale.json
 * Outputs:
 *   - ../src/styles/tokens.css
 *   - ../src/styles/space-utilities.css
 *
 * Safer than weblet: does NOT wipe Tailwind `--text-*` / `--spacing`.
 * Emits Ashima `--gutter-*`, `--space-*`, `--measure-*`.
 * Type roles live in `src/styles/global.css` (breakpoint scale, not fluid).
 *
 * Do not hand-edit the generated CSS. Re-run after changing the scale:
 *   npm run tokens:generate
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scalePath = join(__dirname, 'fluid-token-scale.json');
const tokensPath = join(__dirname, '..', 'src', 'styles', 'tokens.css');
const spaceUtilitiesPath = join(
	__dirname,
	'..',
	'src',
	'styles',
	'space-utilities.css',
);

/**
 * @typedef {{ min: number, max: number }} SizeRange
 * @typedef {{
 *   viewport: { min: number, max: number },
 *   gutter: Record<string, SizeRange>,
 *   measure: Record<string, string>,
 *   spacing: Record<string, SizeRange>,
 *   space: Record<string, string>,
 * }} FluidTokenScale
 */

/** Named space step → CSS property for closed directional utilities. */
const SPACE_PROPERTIES = [
	['gap', 'gap'],
	['p', 'padding'],
	['px', 'padding-inline'],
	['py', 'padding-block'],
	['pt', 'padding-top'],
	['pb', 'padding-bottom'],
	['pl', 'padding-left'],
	['pr', 'padding-right'],
	['m', 'margin'],
	['mx', 'margin-inline'],
	['my', 'margin-block'],
	['mt', 'margin-top'],
	['mb', 'margin-bottom'],
	['ml', 'margin-left'],
	['mr', 'margin-right'],
];

/**
 * @param {number} value
 * @param {number} [digits]
 */
const formatNumber = (value, digits = 4) => {
	const rounded = Number(value.toFixed(digits));
	return Number.isInteger(rounded) ? String(rounded) : String(rounded);
};

/**
 * Builds a Utopia-style clamp() from px sizes across a viewport range.
 * @param {number} minPx
 * @param {number} maxPx
 * @param {number} minViewport
 * @param {number} maxViewport
 */
const toFluidClamp = (minPx, maxPx, minViewport, maxViewport) => {
	if (minPx === maxPx) {
		return `${formatNumber(minPx / 16)}rem`;
	}

	const slope = (maxPx - minPx) / (maxViewport - minViewport);
	const interceptPx = minPx - slope * minViewport;
	const preferred = `${formatNumber(interceptPx / 16)}rem + ${formatNumber(slope * 100, 3)}vw`;
	const minRem = `${formatNumber(Math.min(minPx, maxPx) / 16)}rem`;
	const maxRem = `${formatNumber(Math.max(minPx, maxPx) / 16)}rem`;

	return `clamp(${minRem}, ${preferred}, ${maxRem})`;
};

/**
 * @param {string} name
 * @param {string} value
 * @param {number} [pad]
 */
const themeLine = (name, value, pad = 0) =>
	`${' '.repeat(pad)}--${name}: ${value};`;

/** @type {FluidTokenScale} */
const scale = JSON.parse(readFileSync(scalePath, 'utf8'));
const { viewport } = scale;

for (const [step, spacingKey] of Object.entries(scale.space ?? {})) {
	if (!(spacingKey in scale.spacing)) {
		throw new Error(`space.${step} references missing spacing.${spacingKey}`);
	}
}

const gutterLines = Object.entries(scale.gutter ?? {}).map(([step, range]) =>
	themeLine(
		`gutter-${step}`,
		toFluidClamp(range.min, range.max, viewport.min, viewport.max),
		2,
	),
);

const measureLines = Object.entries(scale.measure ?? {}).map(([step, value]) =>
	themeLine(`measure-${step}`, value, 2),
);

const spaceVarLines = Object.entries(scale.space ?? {}).map(([step, spacingKey]) => {
	const range = scale.spacing[spacingKey];
	return themeLine(
		`space-${step}`,
		toFluidClamp(range.min, range.max, viewport.min, viewport.max),
		2,
	);
});

const tokensCss = `/*
 * GENERATED FILE — do not hand-edit.
 *
 * Source: scripts/fluid-token-scale.json
 * Regenerate: npm run tokens:generate
 *
 * Fluid values use clamp() across ${viewport.min}px -> ${viewport.max}px viewports.
 * Does not replace Tailwind defaults — Ashima gutter/space/measure only.
 * Type roles: src/styles/global.css
 */

@theme {
  /* Page-margin gutters. */
${gutterLines.join('\n')}

  /* Line-length + page shell measure. */
${measureLines.join('\n')}

  /* Named fluid space steps (gap-md, py-xl via space-utilities.css). */
${spaceVarLines.join('\n')}
}
`;

const spaceUtilityBlocks = Object.entries(scale.space ?? {}).flatMap(
	([step]) =>
		SPACE_PROPERTIES.map(
			([prefix, property]) => `@utility ${prefix}-${step} {
  ${property}: var(--space-${step});
}
`,
		),
);

const spaceCss = `/*
 * GENERATED FILE — do not hand-edit.
 *
 * Source: scripts/fluid-token-scale.json → space
 * Regenerate: npm run tokens:generate
 *
 * Closed directional space steps (gap-md, py-md, mx-lg, …).
 * Prefer these for new work / high-traffic shells.
 */

${spaceUtilityBlocks.join('\n')}`;

writeFileSync(tokensPath, tokensCss, 'utf8');
writeFileSync(spaceUtilitiesPath, spaceCss, 'utf8');
console.log(`Wrote ${tokensPath}`);
console.log(`Wrote ${spaceUtilitiesPath}`);
