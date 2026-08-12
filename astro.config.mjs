// @ts-check
import { defineConfig } from 'astro/config';
import education from './src/data/education.json';
import categories from './src/data/education-categories.json';

const categoryIds = new Set(categories.map((c) => c.id));

/** Old flat article URLs → category/article paths (skip when slug equals a category id). */
const educationRedirects = Object.fromEntries(
  education
    .filter((a) => !categoryIds.has(a.slug))
    .map((a) => [`/zh/education/${a.slug}`, `/zh/education/${a.category}/${a.slug}/`])
    .concat(
      education
        .filter((a) => !categoryIds.has(a.slug))
        .map((a) => [`/zh/education/${a.slug}/`, `/zh/education/${a.category}/${a.slug}/`])
    )
);

// https://astro.build/config
export default defineConfig({
  redirects: educationRedirects,
});
