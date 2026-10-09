import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL?.trim() || 'https://killlax.example',
  trailingSlash: 'always',
  integrations: [sitemap({
    filter: (page) => !['/code-rain/', '/flame-preview/'].includes(new URL(page).pathname),
  })],
});
