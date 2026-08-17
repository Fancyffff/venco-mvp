# Homepage design QA

- Source visual truth — hero: `/var/folders/9f/6xpffr396gv92dqb68j9p1x00000gn/T/codex-clipboard-620c4182-1f54-420e-9586-c9bb27994c21.png`
- Source visual truth — services: `/var/folders/9f/6xpffr396gv92dqb68j9p1x00000gn/T/codex-clipboard-c8065043-8a96-43af-98a7-3a57e77d57c2.png`
- Source visual truth — contact/footer: `/var/folders/9f/6xpffr396gv92dqb68j9p1x00000gn/T/codex-clipboard-1c9d512f-c977-44c7-b7f5-9d7b2de0a0f6.png`
- Implementation screenshots: `/tmp/venco-services-qa-2.jpg`, `/tmp/venco-services-hover.jpg`, `/tmp/venco-footer-qa-2.jpg`, `/tmp/venco-mobile-services.jpg`
- Combined comparison evidence: `/tmp/venco-services-comparison-final.jpg`, `/tmp/venco-footer-comparison-final.jpg`
- State: Traditional Chinese homepage; services normal and hover states; contact banner and footer; mobile services grid
- Desktop CSS viewport: services `1563 × 781`, footer `1563 × 701`; browser density `devicePixelRatio 1.25`
- Source pixels: services `2598 × 1292`, footer `2962 × 1256`; both normalized to the implementation width for the combined comparisons
- Implementation pixels: services `1551 × 776`, footer `1551 × 695`

**Findings**

- No actionable P0/P1/P2 mismatch remains.
- Fonts and typography: Traditional Chinese system stack, heading hierarchy, centered card labels, muted descriptions, footer headings and body text reproduce the source hierarchy.
- Spacing and layout rhythm: the service section uses the old wide six-column desktop grid, tall rounded cards and two-row rhythm. The contact banner overlaps the pale page and cyan footer, while footer content returns to five desktop columns.
- Colors and visual tokens: pale blue-grey service background, white cards, cyan accents, gradient contact banner and cyan footer follow the supplied sources. Browser capture slightly desaturates the page surface; computed CSS continues to use the project cyan token.
- Image quality and asset fidelity: supplied service icons, clinic logo, WhatsApp icon and WeChat QR are reused directly. No placeholder imagery was introduced.
- Copy and content: the current real clinic addresses, phone numbers, WhatsApp link and legal destinations are preserved. Search and the existing tertiary navigation remain intentionally present.

**Focused region comparison**

- Services: source and implementation were stacked at the same normalized width. Card width, height, icon scale, two-row grid, heading position and description density now align closely.
- Hover: the first card was tested with a real pointer move. It translates `-8px`, gains the stronger cyan shadow, changes the title to cyan and reveals the “了解更多” affordance.
- Contact/footer: the source and implementation were stacked at the same normalized width. Banner overlap, rounded gradient panel, WhatsApp button, cyan footer, quick links, hours, two clinic contacts, QR card and legal row are all present.

**Comparison history**

- Pass 1 — P1: service cards were too narrow and short because they still used the newer `1180px` content width. Fixed with a section-specific `1420px` desktop container, `280px` card height and `100px` icons.
- Pass 1 — P2: the footer lacked the old brand/links/hours/addresses/QR column structure. Fixed by restoring the five-column layout and the overlapping contact banner.
- Pass 2 — no actionable P0/P1/P2 differences remained. Final evidence is in the two `*-comparison-final.jpg` files above.

**Interaction and responsive checks**

- Root Chinese links resolve without `/zh`; search is `/search/`; language switch is `/en/`.
- Desktop services mega menu opened on pointer hover and its third-level panel was visible.
- Service card pointer hover and keyboard focus styles are implemented; reduced-motion preference disables transitions.
- Mobile checked at `390px` inner width: two-column service grid, no horizontal overflow (`scrollWidth 378`, `clientWidth 378`).
- Browser console checked: only Vite connection debug messages; no errors or warnings.
- Production build completed successfully; generated Cloudflare redirects include `/zh / 301` and `/zh/* /:splat 301`.

**Follow-up polish**

- The footer uses the available horizontal clinic logo asset rather than the older vertical lockup shown in the historical screenshot; this is an acceptable asset constraint.

final result: passed
