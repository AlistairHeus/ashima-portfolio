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
		server: {
			// Allow tunnel hosts (localtunnel / cloudflare) when sharing the dev server
			allowedHosts: ['.loca.lt', '.trycloudflare.com'],
		},
	},
	integrations: [
		sitemap({
			filter: (page) => !page.includes('/reference'),
		}),
	],
	adapter: vercel(),
});
