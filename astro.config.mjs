// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ashimakaushik.com',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
  server: {host: true, port: 3000 }

});