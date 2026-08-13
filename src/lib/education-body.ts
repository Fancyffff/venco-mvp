export type BodyBlock =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] };

/** Short lines without sentence punctuation — may be headings or list items. */
function isShortFragment(text: string) {
  const t = text.trim();
  if (t.length === 0 || t.length >= 42) return false;
  return !/[。？！!?]$/.test(t);
}

function hasListMarkers(text: string) {
  return /例如/.test(text) || /[，、；;]/.test(text) || /（/.test(text);
}

/**
 * Turn scraped paragraph arrays into readable blocks:
 * - runs of 3+ short fragments → bullet list (symptoms etc.)
 * - 1–2 short title-like lines before a long paragraph → headings
 * - everything else → paragraphs
 */
export function blocksFromBody(paragraphs: string[]): BodyBlock[] {
  const items = paragraphs.map((p) => p.trim()).filter(Boolean);
  const blocks: BodyBlock[] = [];
  let i = 0;

  while (i < items.length) {
    if (!isShortFragment(items[i])) {
      blocks.push({ type: 'p', text: items[i] });
      i += 1;
      continue;
    }

    const start = i;
    while (i < items.length && isShortFragment(items[i])) i += 1;
    const run = items.slice(start, i);
    const nextIsLong = i < items.length && !isShortFragment(items[i]);

    // Symptom / feature lists arrive as many short lines in a row.
    if (run.length >= 3) {
      blocks.push({ type: 'ul', items: run });
      continue;
    }

    for (const text of run) {
      if (nextIsLong && !hasListMarkers(text)) {
        blocks.push({ type: 'h2', text });
      } else {
        blocks.push({ type: 'p', text });
      }
    }
  }

  return blocks;
}