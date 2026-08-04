// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.ashimakaushik.in',
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		sitemap({
			filter: (page) => !page.includes('/reference'),
		}),
	],
	adapter: vercel(),
});
