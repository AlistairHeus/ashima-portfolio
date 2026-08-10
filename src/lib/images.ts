/**
 * Resolve site image paths (`/images/...`) to Astro `ImageMetadata` imports.
 * Assets live in `src/assets/images` so `<Picture>` / `<Image>` can optimize them.
 */
import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
	'/src/assets/images/**/*.{jpeg,jpg,png,webp,gif,avif}',
	{ eager: true },
);

const byPublicPath = new Map<string, ImageMetadata>();

for (const [modulePath, mod] of Object.entries(modules)) {
	const match = modulePath.match(/\/assets\/images\/(.+)$/);
	if (!match?.[1]) continue;
	const publicPath = `/images/${match[1]}`;
	byPublicPath.set(publicPath, mod.default);
	// Also index without leading slash variants callers might pass.
	byPublicPath.set(publicPath.replace(/^\//, ''), mod.default);
}

/**
 * Look up an optimized asset by its legacy public URL (`/images/...`).
 */
export const getAsset = (src: string): ImageMetadata => {
	const asset = byPublicPath.get(src) ?? byPublicPath.get(src.replace(/^\//, '/'));
	if (!asset) {
		throw new Error(`Missing image asset for "${src}". Expected file under src/assets/images.`);
	}
	return asset;
};

/**
 * Soft lookup — returns undefined when the path is not a local raster asset.
 */
export const tryGetAsset = (src: string): ImageMetadata | undefined =>
	byPublicPath.get(src) ?? byPublicPath.get(src.replace(/^\//, '/'));

/**
 * SVG / decorative URLs for CSS (`mask-image`, `background-image`).
 * Vite `?url` imports keep a stable hashed URL without Picture processing.
 */
const svgModules = import.meta.glob<string>('/src/assets/images/**/*.svg', {
	eager: true,
	query: '?url',
	import: 'default',
});

const svgByPublicPath = new Map<string, string>();

for (const [modulePath, url] of Object.entries(svgModules)) {
	const match = modulePath.match(/\/assets\/images\/(.+)$/);
	if (!match?.[1]) continue;
	svgByPublicPath.set(`/images/${match[1]}`, url);
}

/**
 * Resolve a `/images/...svg` path to its built URL for use in CSS.
 */
export const getSvgUrl = (src: string): string => {
	const url = svgByPublicPath.get(src);
	if (!url) {
		throw new Error(`Missing SVG asset for "${src}".`);
	}
	return url;
};
