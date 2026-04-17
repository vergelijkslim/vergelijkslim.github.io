// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://woningwijzer.github.io',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
  prefetch: {
    defaultStrategy: 'viewport',
  },
});
