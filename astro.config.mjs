import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeRaw from 'rehype-raw';
import basePaths from './src/plugins/base-paths.mjs';

const base = process.env.PUBLIC_BASE_PATH?.trim().replace(/\/$/, '') || '';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL?.trim() || 'https://killlax.example',
  base,
  trailingSlash: 'always',
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeRaw, [basePaths, { base }]],
    }),
  },
  integrations: [sitemap({
    filter: (page) => {
      const path = new URL(page).pathname;
      const pathname = base && path.startsWith(`${base}/`) ? path.slice(base.length) : path;
      return !['/code-rain/', '/flame-preview/'].includes(pathname);
    },
  })],
});
