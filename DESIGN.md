# DESIGN.md

Single source of truth for this site's design and build state. Any new
Claude session (or human collaborator, on any device) should read this file
first before touching the code.

The site is **built and deployed** — this file used to be a pre-build
intake form; it's now a living reference for what actually exists. Treat
**§10 Known gaps** as the live to-do list and **§11 Decisions log** as
project history. A few **[FILL IN]** markers remain in place for things
that are still genuinely undecided.

---

## 1. Project

| | |
|---|---|
| Design file | `DraftScreenshot/` folder — used for the initial build (see §6/§7). Not needed for ongoing edits; game content is data-driven (see §3). |
| Stack | Plain HTML + CSS + vanilla JS. No build step, no framework, no dependencies. |
| Dev machine | Windows (moved off Linux Mint after the initial build — §9 below is current; ignore any old Linux-specific notes you find elsewhere). |
| Browser (dev testing) | Whatever's on hand on Windows (Edge/Chrome) + a phone for the mobile breakpoint. *(Update this row if that's no longer accurate.)* |
| Target | Desktop ~1440px + mobile ~375px, with real breakpoints at 1150/1024/768/480px (see §8) |
| Hosting | GitHub Pages, repo root (see §9) |
| Live URL | `https://elcappucino.github.io/` — this assumes the repo-rename step from the 2026-09-19 deploy (§11) was completed. **Confirm and correct this if the actual URL differs.** |
| Status | Core build complete (Games / About / Blog / Post), deployed, now in an iterative polish pass — currently image-loading UX (see §10, §11). |

---

## 2. Design tokens — confirmed (no longer draft)

These are the real values shipped in `style.css`, not estimates. The
original screenshot-sampled draft turned out accurate enough that nothing
here changed except filling two open slots (below).

### Colors

```css
:root {
  --color-bg:        #EEE4DD; /* page background */
  --color-surface:   #D9D9D9; /* card header / tag bar / neutral fill —
                                  also now the placeholder background for
                                  detail-view screenshots while they load,
                                  see §11 2026-09-20 */
  --color-text:      #000000; /* the only text color used anywhere */
  --color-primary:   #583600; /* Learn More button, coffee-cup icon */
  --color-accent:    #583600; /* same value as primary — still only one
                                  accent color anywhere on the site */
}
```

`--color-text-muted` and `--color-border` from the original draft were
never added. In the finished build every text sample is pure black and
every surface reads through background contrast + shadow rather than a
stroke — so treat these as resolved-as-"not needed," not as still-missing,
unless a real muted-text or bordered-card need comes up later.

### Typography

- Single family: **Poppins**, loaded from Google Fonts, weights 400/500/600/700.
- Confirmed sizes actually in use (desktop; several use `clamp()` so they
  scale down a bit on narrower viewports — see the CSS for exact ranges):

  | Element | Size |
  |---|---|
  | Brand name (topbar) | 22px / 700 |
  | Nav links | 18px / 600 |
  | Games grid prompt | 18px / 700 |
  | Game detail title | clamp(20–30px) / 700 |
  | Game detail date / desc / meta | clamp(14–19px) |
  | About section titles | 20px / 700 |
  | About name | 18px |
  | About body / tags | 14px / 13px |
  | Blog card title | 19px / 700 |
  | Blog card highlights / date | 14px / 13px |
  | Post title | clamp(24–34px) / 700 |
  | Post body | 17px (16px ≤768px) |
  | Post body h2/h3/h4 | 22/18/17px |

- Body line-height ≈ 1.5–1.7 depending on context, heading line-height ≈ 1.2–1.3.

### Spacing

Confirmed scale, exposed as `--space-1` … `--space-9` and used consistently
throughout: **4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px**.

### Other

- Border radius: `--radius-card: 10px`, `--radius-full: 9999px` (buttons, pills).
- Max content widths are set per content type rather than from one shared
  token — a game-detail row, the about-page bio grid, and a blog reading
  column all want very different maximums:
  - `--max-content-width: 1600px` — topbar only
  - About layout: `max-width: 1140px`
  - Blog list: `max-width: 720px`
  - Post body: `max-width: 68ch`
- Breakpoints: see §8 for the real ones (they ended up more granular than
  the original three-tier estimate).

---

## 3. Site map (replaces the old Figma-frame table — there's no per-frame
mapping anymore, the site is built)

| Page | Purpose | Scripts loaded | Content source |
|---|---|---|---|
| `index.html` | Games — grid of case art that opens into a per-game detail view (case-stack slides open, CD spins out, screenshots shown) | `pagefade.js`, `script.js` | `GAMES` object at the top of `script.js` — add/edit a game there, nothing else needs touching |
| `about.html` | About — photo, socials, tools/dev tag lists, bio sections | `pagefade.js` | Hand-written in the HTML directly |
| `blog.html` | Blog — list of post cards | `pagefade.js`, `posts.js`, `blog.js` | `POSTS` array in `posts.js` |
| `post.html` | Single post template, routed by `?post=<slug>` | `pagefade.js`, `posts.js`, `blog.js` | Same `POSTS` array — one template renders every post |

`pagefade.js` runs on every page (it's the cross-page fade-out on
navigation); `script.js` only runs on `index.html`.

---

## 4. Components (real inventory, replaces the old placeholder table)

| Component | CSS class(es) | Notes |
|---|---|---|
| Case-stack (closed book / open CD) | `.case-stack`, `.ps-bottom`, `.ps-cd`, `.ps-top`, `.case-back-link` | Always mounted; `.is-open` (toggled by `script.js`) slides the CD out and reveals the back link. Continuous spin via `@keyframes cd-spin`, off under `prefers-reduced-motion`. |
| Game card (grid) | `.game-card`, `.games-grid` | Spring-bounce hover (`cubic-bezier(0.34, 1.56, 0.64, 1)`). |
| Game detail | `.game-detail`, `.detail-info`, `.detail-title/-date/-desc/-meta`, `.detail-screens`, `.detail-actions` | Populated by `populateDetail()` in `script.js`. `.detail-screens img` reserves a `16/9` box — see §11 2026-09-20. |
| View cross-fade | `.games-stage`, `.is-fading`, `.is-detail` | 250ms opacity fade, timed with `FADE_MS` in `script.js`. |
| Icon link | `.icon-link` | Shared between game-detail socials and the About page's social row. |
| Pill button | `.btn-learn-more` | Full-radius CTA. |
| About boxes | `.about-box`, `.tag-list` | Tools / Development tag lists. |
| About bio sections | `.about-section`, `.about-list`, `.about-sublist` | Repeated per bio block. |
| Blog card | `.blog-card`, `.blog-card-image/-text/-title/-highlights/-date` | Row layout ≥620px, stacks below. |
| Post body | `.post`, `.post-title/-date/-cover`, `.post-body`, `.post-figure` | `.post-body` is filled from parsed Markdown-ish text — see the writing guide at the top of `posts.js`. |
| Page transition | `.page-content`, `.is-leaving` | CSS-only fade-in on load; fade-out half needs `pagefade.js` since CSS can't delay a navigation. |

---

## 5. Build order — completed

This was followed in order for the initial build and held up fine:

1. Tokens / global CSS
2. Layout shell + nav
3. Sections, one at a time
4. Responsive pass
5. Motion (hover transitions, cross-fades, CD spin)

If a genuinely new page/section gets added later, follow the same order.

---

## 6. Working agreement (still applies to any *new* Figma-based section)

**One section per message.** Attach that section's PNG, say which section it
is, let it finish before moving on.

**Review loop, after every section:**

1. Open the page → screenshot → save full page
2. Paste that screenshot back next to the Figma export
3. Name what's wrong in plain words — "cards too tight", "heading too light"

**Never redraw exported assets in CSS.** Icons and logos come in as SVG files.

---

## 7. Figma export rules (still valid reference for future additions)

- Export **2x PNG**, one file per section — never one tall full-page image.
- Export a **mobile frame** too, or write the collapse behavior into §8.
- Icons and logos → **SVG**. Photos → **PNG or WebP** directly if possible —
  otherwise run them through the WebP conversion pass described in §9
  before they ship (every photo/screenshot asset on the live site is WebP,
  no exceptions — see §11 2026-09-19).
- Screenshot the Dev Mode inspect panel for one text element and one button.
- **Rename every frame before exporting** — the frame name becomes the filename.
- Flatten slashes and normalize to kebab-case after export:
  ```bash
  find . -name '*.png' | while read f; do mv "$f" "./$(echo "${f#./}" | tr '/' '-')"; done
  ```
- **Fonts must be Google Fonts** (no locally-installed-font access in a
  browser-based Figma session).

---

## 8. Responsive behavior — confirmed (filled in from the real CSS)

| Breakpoint | What changes |
|---|---|
| ≤1150px | CD's peek-out shrinks (`--cd-reach` 1.99 → 1.22) so the full-size disc doesn't run into the detail text |
| ≤1024px | Games grid: 3 columns → 2 |
| ≤768px | Major stack point: topbar centers and wraps to one row; `.page`'s height cap is dropped and the page scrolls normally instead of being viewport-locked; case-stack shrinks and centers (max-width 220px); game-detail flips from row to column and centers its text; `.detail-screens` becomes full-width (capped 320px); coffee-cup decal shrinks; About layout drops to one column; blog cards stack (image becomes full-width, 160px tall) |
| ≤480px | Games grid gap/columns tighten further |
| About-specific: ≤900px | 2-column about layout → 1 column |
| Blog-specific: ≤620px | Card row → column (this is the actual card breakpoint, independent of the 768px page-wide one) |

---

## 9. Environment & workflow notes — current (Windows; supersedes any old
Linux Mint notes)

- **Dev machine**: Windows. Editing happens through a Claude session linked
  to the machine over Claude's remote-devices bridge, not a local terminal
  session — if you're a future Claude session reading this cold, that's why
  the workflow below looks the way it does rather than a normal git clone.
- **No local shell on this desktop's bridge** (no `device_bash` reliably
  available for it as of the 2026-09-19/20 work). The pattern that worked:
  edit files in Claude's own cloud workspace → verify with a local
  Playwright mirror → write the result back to the real device with an
  `expectedMtimeMs` guard (so a hand-edit made directly on the machine
  between sessions never gets silently clobbered). Always diff device file
  size/mtime against the last-known state before editing.
- **Image pipeline**: Pillow-based conversion, PNG/JPG/GIF → WebP.
  - Quality 85 for `Screens/` and `Blogs/` (photographic screenshots)
  - Quality 90 for `CD/` and `CD_Case/` (flat art with text/titles that
    needs more fidelity)
  - Animated GIF → animated WebP via `save_all=True, append_images=...`
    (used for the one devlog clip, `Blogs/Derrick/plane2_exampleClip.webp`)
  - This took total `Assets/` from ~30MB to ~6MB.
- **Screenshot aspect-ratio convention**: all 21 gameplay screenshots
  across the 7 games sample close to 16:9 (range 1.774–1.844).
  `.detail-screens img` hardcodes `aspect-ratio: 16/9` (§11 2026-09-20) —
  keep any new game's screenshots close to 16:9, or they'll get a
  noticeably more aggressive `object-fit: cover` crop than the existing ones.
- **Testing pattern**: Playwright (Chromium) against a deploy-shaped local
  mirror, loaded via `file://` URLs. One environment-specific quirk worth
  knowing about: in that specific headless sandbox, the case-stack's
  `ps-bottom`/`ps-top` art renders as a solid black box in screenshots —
  confirmed to be a pre-existing artifact of that headless browser, not a
  real bug (it doesn't reproduce on the actual deployed site). Don't chase
  it if a future regression screenshot shows it again.
- **Hosting**: GitHub Pages, serving from the **repo root** (moved off a
  `Website/` subfolder specifically for this — Pages only serves root or
  `/docs`, never an arbitrary subfolder). Repo: `ElCappucino/BunyaponPersonalWebsite`.
- ⚠️ **Git LFS**: GitHub Pages does **not** serve LFS-tracked files
  correctly — it serves the pointer text instead of the actual image. The
  repo has an inert `[lfs]` stub in `.git/config` but nothing is tracked.
  Never run `git lfs track` on anything under `Assets/`, or images will
  break on the live site.
- **"Images look out of date" troubleshooting** (came up once already):
  three caching layers can each cause this — GitHub Pages' own
  build/deploy (~1 min), the CDN edge cache (~10 min, visible via
  `Cache-Control` in DevTools → Network), and the browser's own aggressive
  image cache (usually the actual culprit). Test in a private/incognito
  window to isolate it. None of this affects a real first-time visitor.

---

## 10. Known gaps

- **Loading UX (active)**: switching games can still flash the *previous*
  game's screenshot/CD art briefly before the new one paints, especially on
  a first visit / cold cache. Approaches A (reserved 16:9 box so nothing
  collapses), B (start loading on click), and C (start loading on hover)
  are shipped (§11 2026-09-20) and each narrows the window, but the report
  is that it can still happen. **Approach D — actually clearing/hiding the
  old image before pointing it at the new `src`, rather than just racing to
  load the new one faster — is the structural fix and is still open.**
- 6 of the 7 games' `learnMoreUrl` are still `"#"` placeholders (only
  Derrick links to a real devlog post). Needs either real devlog posts or a
  decision to point "Learn More" straight at itch.io/YouTube instead.
- Grid page prompt text has a typo: "These are my game!" (missing the plural).
- About page's DEVELOPMENT tag list has "GLFW" listed twice.
- No favicon.
- No meta/Open Graph tags (title/description/preview image) — worth adding
  before sharing the link around, since right now a shared link has no
  preview card.
- No CV/résumé download on the About page.
- If you land on this repo fresh: double-check `Assets/` doesn't still
  contain the pre-conversion PNG/JPG/GIF originals alongside the `.webp`
  files — a cleanup pass was scripted for this during the 2026-09-19 deploy
  but wasn't independently re-verified afterward.

---

## 11. Decisions log

Append as things get decided, so future sessions don't re-litigate them.

- *(date)* — *(decision)*
- 2026-09-17 — §2 seeded with draft token values pixel-sampled from
  `DraftScreenshot/Home_SelectGame.png` and `Home_ShowGame.png` (colors, rough type
  scale, spacing, button radius). Marked [ESTIMATED]/[FILL IN] throughout — not yet
  confirmed against Figma Dev Mode (§7). Still open: --color-text-muted,
  --color-border, shadows, max content width, and the full type scale.
- 2026-09-19 — Deployed to GitHub Pages. Converted all 61 image assets to
  WebP (~30MB → ~6MB, quality tiers per §9). Moved the site's HTML/CSS/JS
  from `Website/` to the repo root, since GitHub Pages only serves from
  root or `/docs`, rewriting every `../Assets/` path and image extension
  along the way. Added `.gitignore`. Fixed two real bugs found in the
  process: broken `YYY_Image*` fallback paths in `index.html`, and
  `posts.js`'s own writing-guide example filenames getting accidentally
  rewritten by the same path-fixing pass. §2's open token slots
  (`--color-text-muted`, `--color-border`) are now resolved as
  "not needed" rather than filled — see §2.
- 2026-09-20 — Loading-UX pass on the "previous game's image still shows
  when switching games" report. Shipped, in order, on explicit go-ahead
  each time:
  - **A** — `.detail-screens img` now reserves a `16/9 aspect-ratio` box
    (plus a `--color-surface` fill) so the column can't collapse when an
    image is cleared or mid-swap.
  - **B** — a game's screenshots + CD art now start downloading the
    instant its card is clicked, instead of only after the 250ms fade-out
    finishes.
  - **C** — they also now start downloading on hover, ahead of any click
    (deduped against B so a hover-then-click doesn't refire the same
    requests; touch devices, which have no hover, still get B as the
    fallback).
  All three verified with a Playwright regression suite (request timing,
  layout stability under a throttled connection, full round-trip through
  all 7 games at desktop + mobile widths). Still reported as reproducible
  after A+B+C — see **§10 Known gaps**: Approach **D** (clear/hide the old
  image before the swap, rather than racing to load the new one faster) is
  the one that makes the bug structurally impossible rather than just less
  likely, and is the natural next step if the report continues.
