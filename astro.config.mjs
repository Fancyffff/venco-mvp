// @ts-check
import { writeFile } from 'node:fs/promises';
import { defineConfig } from 'astro/config';
import education from './src/data/education.json';
import categories from './src/data/education-categories.json';

const categoryIds = new Set(categories.map((c) => c.id));

/** Old flat article URLs → category/article paths (skip when slug equals a category id). */
const educationRedirects = Object.fromEntries(
  ['', 'en'].flatMap((locale) => {
    const base = locale ? `/${locale}` : '';
    return (
    education
      .filter((a) => !categoryIds.has(a.slug))
      .map((a) => [
        `${base}/education/${a.slug}`,
        `${base}/education/${a.category}/${a.slug}/`,
      ])
    );
  })
);

/** Typo fix: sleep-apena → sleep-apnea */
const sleepApneaRedirects = Object.fromEntries(
  ['', 'en'].flatMap((locale) => {
    const base = locale ? `/${locale}` : '';
    return [
      [`${base}/education/sleep-apnea/sleep-apena`, `${base}/education/sleep-apnea/sleep-apnea/`],
      [`${base}/education/sleep-apena`, `${base}/education/sleep-apnea/sleep-apnea/`],
    ];
  })
);

const redirects = {
  ...educationRedirects,
  ...sleepApneaRedirects,
};

const cloudflareAssetRedirects = {
  ...redirects,
};

/**
 * Astro's own redirects build to meta-refresh pages, which answer 200 — search
 * engines don't read those as a permanent move. Cloudflare reads a `_redirects`
 * file in the assets directory and answers a real 301, so emit one from the
 * same table. The meta-refresh pages stay: they keep the Vercel backup and
 * `astro dev` working. Cloudflare prefers `_redirects` when both are present.
 */
function cloudflareRedirects() {
  return {
    name: 'cloudflare-redirects',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        // Trailing-slash variants collapse to the same rule, hence the Set.
        const lines = [
          '/zh / 301',
          '/zh/* /:splat 301',
          ...new Set(
          Object.entries(cloudflareAssetRedirects).map(([from, to]) => {
            const source = from === '/' ? '/' : from.replace(/\/$/, '');
            return `${source} ${to} 301`;
          }),
          ),
        ];
        await writeFile(new URL('_redirects', dir), lines.join('\n') + '\n');
        logger.info(`wrote _redirects (${lines.length} rules)`);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://vencokids.com',
  redirects,
  integrations: [cloudflareRedirects()],
});
