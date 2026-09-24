# DESIGN.md

Single source of truth for this site's design and build state. Any new
Claude session (or human collaborator, on any device) should read this file
first before touching the code.

The site is **built and deployed** — this file used to be a pre-build
intake form; it's now a living reference for what actually exists. Treat
**§10 Known gaps** as the live to-do list and **§11 Decisions log** as
project history. A few **[FILL IN]** markers remain in place for things
that are still genuinely undecided.

**Last reviewed against the actual repo: 2026-09-24.** If you're picking
this up much later, check §11's newest entry before trusting the rest — a
stale version of this file previously described a rule (WebP everywhere)
that would have made a file bigger, not smaller.

---

## 1. Project

| | |
|---|---|
| Design file | `DraftScreenshot/` folder — used for the initial build (see §6/§7). Not needed for ongoing edits; game content is data-driven (see §3). |
| Stack | Plain HTML + CSS + vanilla JS. No build step, no framework, no dependencies. |
| Dev machine | Both, at different times — Windows (`D:\Bunyapon\ElCappucino.github.io`) and a Linux Mint machine (`~/Downloads/PortWebsite`). The folder name and path differ per machine; the repo is the same. See §9 for what changes between them. |
| Browser (dev testing) | Whatever's on hand on Windows (Edge/Chrome) + a phone for the mobile breakpoint. *(Update this row if that's no longer accurate.)* |
| Target | Desktop ~1440px + mobile ~375px, with real breakpoints at 1150/1024/768/480px (see §8) |
| Hosting | GitHub Pages, repo root (see §9) |
| Live URL | `https://elcappucino.github.io/` — **verified live and serving the current build, 2026-09-24.** The repo rename did happen (§9). |
| Status | Core build complete (Games / About / Blog / Post), deployed and current. 7 games, 3 blog posts live (Flappy Party, Procedural Terrarium, Derrick). Now in an iterative polish pass — see §10 for the live to-do list. |

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
| Video embed | `.post-video` | A YouTube address alone on a line in a post body becomes an embedded player — see §7a. 16/9 box reserved up front, `loading="lazy"`, served from `youtube-nocookie.com`. |
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
  before they ship. Every *still* asset on the live site is WebP; animated
  clips are converted only when it actually saves bytes, which it doesn't
  always — measure first, and see the table in §9.
- Screenshot the Dev Mode inspect panel for one text element and one button.
- **Rename every frame before exporting** — the frame name becomes the filename.
- Flatten slashes and normalize to kebab-case after export:
  ```bash
  find . -name '*.png' | while read f; do mv "$f" "./$(echo "${f#./}" | tr '/' '-')"; done
  ```
- **Fonts must be Google Fonts** (no locally-installed-font access in a
  browser-based Figma session).

---

## 7a. Post body syntax (what `blog.js` understands)

The full list lives in the writing guide at the top of `posts.js` — that
comment block is the source of truth for anyone writing a post. Summary:

| Written in a body | Renders as |
|---|---|
| `## X` / `### X` | section / sub-heading |
| `- item` / `1. item` | bulleted / numbered list (**`*` is NOT a bullet** — it becomes literal text) |
| `![](pic.webp)` | image, resolved against that post's `imageBase` |
| `![A caption](pic.webp)` | image with a caption under it |
| a YouTube address alone on a line | embedded player |
| `[A caption](https://youtu.be/…)` alone on a line | embedded player with a caption |
| `[text](url)` inside a sentence | ordinary inline link — *not* embedded |
| `**bold**`, `*italic*` | as written |

Two characters break a body, because it sits inside a JS template literal:
a backtick, and a dollar sign immediately followed by a curly brace.

Only YouTube is recognised for embedding. Any other address alone on a line
stays ordinary text, which is the safe failure.

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

## 9. Environment & workflow notes

- **Dev machine**: the work has moved back and forth between a Windows
  machine (`D:\Bunyapon\ElCappucino.github.io`) and a Linux Mint machine
  (`~/Downloads/PortWebsite`), syncing through GitHub rather than directly.
  Editing happens through a Claude session linked to whichever machine is
  connected, over Claude's remote-devices bridge, not a local terminal
  session — if you're a future Claude session reading this cold, that's why
  the workflow below looks the way it does rather than a normal git clone.
  **Check which machine you're on before assuming a path**, and check
  whether that clone is up to date before editing.
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
  - This took total `Assets/` from ~30MB to ~6MB.
  - ⚠️ **WebP does not always win — measure before converting.** The rule
    elsewhere in this doc says "every asset is WebP, no exceptions"; that is
    now wrong for animated clips. `Blogs/FlappyParty/flappy_color_1.gif` is a
    242-frame Unity Editor screen recording, and at the §9 quality tier the
    "optimised" file came out **larger** than the source:

    | Encoding | Size | vs. the original GIF |
    |---|---|---|
    | original GIF | 1.58MB | — |
    | WebP lossless | 1.61MB | 2% **bigger** |
    | WebP q85 (the tier above) | 1.80MB | 14% **bigger** |
    | WebP q80 | 1.54MB | 2.6% smaller |
    | WebP q70 | 1.18MB | 25% smaller, but visibly softens UI text |

    Flat-colour screen recordings with fine UI text are the bad case: GIF's
    palette compression handles them well, and lossy WebP blurs exactly the
    text the clip exists to show. **`flappy_color_1.gif` therefore ships as a
    GIF on purpose.** Don't "fix" it. For photographic content the q85 rule
    still holds — `plane2_exampleClip` went 3.4MB → 1.2MB.
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
  `/docs`, never an arbitrary subfolder). Repo: `ElCappucino/ElCappucino.github.io`
  (renamed from `BunyaponPersonalWebsite` — the `<user>.github.io` name is what
  makes it serve at the bare `https://elcappucino.github.io/` rather than a
  `/repo-name/` subpath). Verified serving the current build on 2026-09-24.
- ⚠️ **Filename case is load-bearing, and Windows hides it.** The Windows
  clone has `ignorecase = true` in `.git/config`, and GitHub Pages serves
  from Linux. So a reference like `Flappy_0.png` pointing at a file actually
  named `flappy_0.png` works perfectly on the dev machine and 404s on the
  live site. This has already nearly happened once (a draft referred to
  `Flappy_0.png`). When adding assets, match the real filename exactly; an
  audit of all 89 asset references on 2026-09-24 found 0 mismatches, so the
  site is currently clean — keep it that way.
- **Line endings look alarming and are fine.** `.gitattributes` is
  `* text=auto`, so the repo stores LF and the Windows checkout converts to
  CRLF. Every file in the Windows working copy is therefore larger than its
  Linux twin by exactly its line count (`style.css` +1040 bytes / 1040
  lines). That is not a content change and nothing dirty gets committed.
  Diff with line endings normalised before concluding two clones differ.
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
- **Confirmed (2026-09-24): the pre-conversion originals are still in the
  repo.** 73 PNG/JPG/GIF files sit next to their `.webp` twin, ~59MB, and
  `.gitignore` does not exclude them, so they are committed and served to
  every clone. The site references **none** of them — an audit found 0
  unreferenced `.webp` files and 0 broken paths, so the originals are pure
  weight. Deleting them from the repo is safe for the site; the only
  question is whether you want to keep them under version control as
  masters. (If you do, a custom Pages deploy workflow could strip them from
  the published artifact while leaving them in the repo.)
- The blog list on `blog.html` is **rendered client-side** from `POSTS` —
  anything that doesn't run JavaScript sees an empty page. That's fine for
  real visitors, but it means crawlers and link-preview bots get nothing,
  which compounds the missing-meta-tags gap above. Worth knowing before
  wondering why a shared link looks empty.

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
- 2026-09-20 — Added the **Procedural Terrarium** post (17 images converted
  to WebP, 31.4MB → 12.2MB). Left `ProTer_preset_1.png` and
  `ProTer_rock_ref2.png` unused on purpose; `ProTer_EUW_1.png` was pulled
  into the EUW section, which had been the one text-only section.
- 2026-09-20 — **Video embeds.** `blog.js` gained a video branch: a YouTube
  address alone on a line (bare, or as `[caption](url)`) becomes an embedded
  player; anything else, including an inline YouTube link inside a sentence,
  is left alone. Chose `youtube-nocookie.com` (no tracking cookies until
  play) and `loading="lazy"` + a reserved 16/9 box, matching the
  `.detail-screens` treatment. Syntax documented in the `posts.js` writing
  guide and in §7a. Verified against six shapes, including the two that must
  *not* embed.
- 2026-09-24 — Added the **Flappy Party** post (May 2024), the retrospective
  on the first university project. `flappy_0` serves as both card and cover
  by choice, so it appears twice on the post page. Its card highlights were
  drafted rather than supplied. Six PNGs converted to WebP; the GIF
  deliberately was not — see the measurement table in §9.
- 2026-09-24 — **Health check of the Windows clone, no changes made.**
  `posts.js`/`blog.js`/`style.css` byte-identical to the Linux versions once
  line endings are normalised; all 3 posts live and deployed; 89 asset
  references audited with 0 case mismatches and 0 missing files. Two real
  findings, both now recorded above: the ~59MB of duplicate originals
  (§10) and the fact that this document had gone stale — it described none
  of the 2026-09-20/24 work, and its "WebP, no exceptions" rule would have
  led a future session to make `flappy_color_1.gif` bigger while believing
  it had optimised it. Corrected the repo name here too: it is
  `ElCappucino/ElCappucino.github.io`, not `BunyaponPersonalWebsite`.
