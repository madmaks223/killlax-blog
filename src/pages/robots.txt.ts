import type { APIRoute } from 'astro';
import { siteConfig } from '../config';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL(siteConfig.url);
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', origin).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
