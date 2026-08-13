// @ts-check
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

// https://astro.build/config
export default defineConfig({
  redirects: {
    ...educationRedirects,
    ...sleepApneaRedirects,
  },
});
