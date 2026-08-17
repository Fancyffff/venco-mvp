// @ts-check
import { writeFile } from 'node:fs/promises';
import { defineConfig } from 'astro/config';
import education from './src/data/education.json';
import categories from './src/data/education-categories.json';

const categoryIds = new Set(categories.map((c) => c.id));

/** Old flat article URLs → category/article paths (skip when slug equals a category id). */
const educationRedirects = Object.fromEntries(
  ['zh', 'en'].flatMap((locale) =>
    education
      .filter((a) => !categoryIds.has(a.slug))
      .flatMap((a) => [
        [`/${locale}/education/${a.slug}`, `/${locale}/education/${a.category}/${a.slug}/`],
        [`/${locale}/education/${a.slug}/`, `/${locale}/education/${a.category}/${a.slug}/`],
      ])
  )
);

/** Typo fix: sleep-apena → sleep-apnea */
const sleepApneaRedirects = Object.fromEntries(
  ['zh', 'en'].flatMap((locale) => [
    [`/${locale}/education/sleep-apnea/sleep-apena`, `/${locale}/education/sleep-apnea/sleep-apnea/`],
    [`/${locale}/education/sleep-apnea/sleep-apena/`, `/${locale}/education/sleep-apnea/sleep-apnea/`],
    [`/${locale}/education/sleep-apena`, `/${locale}/education/sleep-apnea/sleep-apnea/`],
    [`/${locale}/education/sleep-apena/`, `/${locale}/education/sleep-apnea/sleep-apnea/`],
  ])
);

const redirects = {
  ...educationRedirects,
  ...sleepApneaRedirects,
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
        const lines = [...new Set(
          Object.entries(redirects).map(([from, to]) => `${from.replace(/\/$/, '')} ${to} 301`),
        )];
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
