# DESIGN.md

Single source of truth for turning the Figma design into the website.
Any new Claude session should read this file first.

Sections marked **[FILL IN]** need your real values — everything else is already decided.

---

## 1. Project

| | |
|---|---|
| Design file | Read screenshots from folder |
| Stack | default: plain HTML + CSS. |
| OS / dev machine | Linux Mint |
| Browser | Zen (Firefox-based) |
| Target | Desktop 1440px + mobile 375px |
| Status | Not started |

---

## 2. Design tokens **[DRAFT — pixel-sampled from screenshots, not Figma Dev Mode]**

Values below were sampled from `DraftScreenshot/Home_SelectGame.png` and
`Home_ShowGame.png` (a 960px-wide browser capture, not a 2x Figma export), so treat
this as a working starting point. **[ESTIMATED]** = measured but not Figma-confirmed.
**[FILL IN]** = not evidenced in either screenshot at all. Re-confirm everything here
against Figma Dev Mode per §7 once you have access, then drop the tags.

### Colors — [ESTIMATED] (sampled directly, identical across both screenshots)

```css
:root {
  --color-bg:        #EEE4DD; /* page background — matches on both screens */
  --color-surface:   #D9D9D9; /* card header / tag bar */
  --color-text:      #000000; /* every text sample came back pure black:
                                   name, nav, title, body, labels */
  --color-text-muted:#______;  /* [FILL IN] — no muted tone found; everything
                                   sampled as pure black. Add one, or confirm the
                                   design has no muted tier. */
  --color-primary:   #583600; /* the one brand color present — identical fill on
                                   the "Learn More" button and the coffee-cup icon */
  --color-accent:    #583600; /* same value as primary; only one accent color shows
                                   up anywhere in the draft — split these once a second
                                   tone (hover state, etc.) exists */
  --color-border:    #______;  /* [FILL IN] — no visible stroke anywhere; cards read
                                   via surface contrast + shadow, not a border color */
}
```

### Typography — [ESTIMATED] (visual match, not a confirmed font file)

- One family covers both heading and body — weight is what differentiates
  (bold: site name, nav links, game-detail title, field labels — regular: body copy,
  field values). Site name, nav links, and the detail-view title all measured the same
  relative size, so they're one type step, not three.
- Style: bold geometric sans — double-story "a", single-story "g", even stroke weight,
  rounded terminals. Closest Google Font candidates: **Poppins**, Manrope, Plus Jakarta
  Sans, Nunito Sans.
- Heading font: *Poppins* (tentative — swap if a real font file turns up)
- Body font: *Poppins* (tentative — same family, lighter weight)
- Scale (relative sizing, not pixel-exact): heading / nav / section-title ≈ 18–20px,
  body copy ≈ 14–16px, small caption text (e.g. the "CAPPU" tag) ≈ 10–11px.
  Full scale still *[FILL IN]* — these two screens don't show a large hero size.
- Body line-height: ≈ 1.4–1.5 (visual estimate)
- Heading line-height: ≈ 1.2 (visual estimate)

### Spacing — [ESTIMATED] (measured pixel gaps, 960px-wide screenshot)

Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 — the doc's suggested scale;
the measurements below land on it without forcing:

- Game-grid gutter (row + column gap): measured ≈ 44px → **--space-7 (48)**
- Gap between stacked content blocks on the detail panel (title → date → body →
  details → CTA): measured ≈ 16–18px → **--space-4 (16)**
- Tight/inline gaps (label-to-value, line leading): measured ≈ 4–6px → **--space-1/2 (4–8)**

Exposed as `--space-1` … `--space-9`.

### Other

- Border radius: buttons are a full pill — measured radius ≈ half the button height
  (~19px on a ~38px-tall "Learn More" button), so treat button radius as `9999px`/full.
  [ESTIMATED] Cards look softly rounded but the corner wasn't cleanly measurable from
  the screenshot — estimate 8–12px and confirm.
- Shadows: *[FILL IN]* — the card stack and placeholder box clearly cast a drop shadow
  in the mockup, but color/blur weren't sampled.
- Max content width: *[FILL IN — e.g. 1200px]*
- Breakpoints: mobile `< 768px`, tablet `768–1024px`, desktop `> 1024px` *(adjust if the design says otherwise)*

---

## 3. Page sections

One horizontal band of the page = one Figma frame = one PNG export = one `<section>`.

| Band | Frame name | Export file | Element | Status |
|---|---|---|---|---|
| Top bar | `nav` | `nav.png` | `<nav>` | ☐ |
| Headline area | `hero` | `hero.png` | `<section class="hero">` | ☐ |
| *[FILL IN]* | | | | ☐ |
| Bottom bar | `footer` | `footer.png` | `<footer>` | ☐ |

**Note:** Figma's own "Section" object (`Shift+S`) is only for organizing the canvas.
It is unrelated to the page sections above and is never exported.

---

## 4. Components **[FILL IN]**

Anything that is a Figma *component* becomes one reusable CSS class.
CSS class names match the Figma component names so the design file and the
code share vocabulary.

| Figma component | CSS class | Instances | Variants exported |
|---|---|---|---|
| *e.g.* `CardFeature` | `.card-feature` | 3 | — |
| *e.g.* `Button` | `.btn` | 5 | default / hover / disabled |

Export every variant separately — variants are the only reliable source for
hover, active and disabled styling.

---

## 5. Build order

Never out of order. Each step depends on the one before it.

1. **Tokens / global CSS** — §2 values become CSS custom properties
2. **Layout shell + nav** — page container, max-width, grid
3. **Sections, one at a time** — in the order of §3
4. **Responsive pass** — mobile layout for every section
5. **Motion** — hover transitions, scroll reveals, last

---

## 6. Working agreement

**One section per message.** Attach that section's PNG, say which section it is,
let it finish before moving on. Sending all sections at once produces uniformly
mediocre output.

**Review loop, after every section:**

1. Open the page in Zen → right-click → *Take Screenshot* → **Save full page**
2. Paste that screenshot back **next to the Figma export**
3. Name what's wrong in plain words — "cards too tight", "heading too light"

A visual diff gets fixed. A verbal description alone gets guessed at.
Two rounds per section is normal.

**Never redraw exported assets in CSS.** Icons and logos come in as SVG files.
A hand-coded approximation will be close but wrong, and costs turns to fix.

---

## 7. Figma export rules

- Export **2x PNG**, one file per section. Never one tall full-page image —
  it gets downscaled and text sizes and spacing become unreadable.
- Export a **mobile frame** too, or write the collapse behavior into §8.
  Figma frames are fixed-width and say nothing about responsive behavior.
- Icons and logos → **SVG**. Photos → **PNG or WebP**.
- Screenshot the Dev Mode inspect panel for one text element and one button —
  that hands over exact sizes, weights, line-heights and padding for free.
- **Rename every frame before exporting.** The frame name becomes the filename.
  `hero.png` carries meaning; `Frame 247.png` does not.
- If the design is one big frame with loose layers, select a band's layers and
  press `Ctrl+Alt+G` (*Frame selection*) to wrap and name it.
- **Fonts must be Google Fonts.** Figma's local-font helper does not exist on
  Linux, so the browser version of Figma cannot see locally installed fonts.

### Filename cleanup (required)

Component names with slashes (`Button/Primary/Large`) export as nested folders,
and the filesystem here is case-sensitive — `Hero.png` and `hero.png` are
different files, and a mismatch breaks the site locally *and* on any Linux host.

Flatten and normalize after every export:

```bash
find . -name '*.png' | while read f; do mv "$f" "./$(echo "${f#./}" | tr '/' '-')"; done
```

Then rename everything to kebab-case: `hero-desktop.png`, `icon-arrow.svg`.

---

## 8. Responsive behavior **[FILL IN]**

Figma cannot express this. Write it down or it gets guessed.

| Section | Desktop | Mobile |
|---|---|---|
| nav | *[FILL IN]* | *[e.g. collapses to hamburger]* |
| hero | *[FILL IN]* | *[e.g. text centers, image below]* |
| features | *[e.g. 3 across]* | *[e.g. stacks to 1 column]* |

---

## 9. Environment notes (Linux Mint)

- **Node**: do not use `apt install nodejs` — it ships an old version.
  Use nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash`, then `nvm install --lts`.
  Not needed at all for plain HTML/CSS.
- **Image tools**: `sudo apt install webp imagemagick optipng` — for converting
  and compressing Figma exports before shipping them.
- **Figma has no Linux desktop app.** Browser only. The desktop MCP server
  (`127.0.0.1:3845`) is therefore unavailable; only the remote Figma plugin exists
  on this machine, and it needs a paid Figma seat for meaningful use.
- **Font rendering differs from macOS.** Text will look slightly heavier or
  thinner than the Figma mock. This is the OS, not the CSS — do not chase it.
- **No Safari on Linux.** Safari is where CSS usually breaks (`backdrop-filter`,
  some flexbox gap cases, date inputs). Check on a phone or a Mac before launch,
  or run it through Playwright's WebKit build.

---

## 10. Known gaps

Things the Figma file does not contain and that must be decided explicitly:

- Responsive behavior → §8
- Hover / focus / active / disabled states → export component variants (§4)
- Scroll and page-load animation → step 5 of the build order
- Real content — if the design has placeholder text, the real copy is needed
- Accessibility: focus rings, alt text, color contrast, heading order

---

## 11. Decisions log

Append as things get decided, so future sessions do not re-litigate them.

- *(date)* — *(decision)*
- 2026-09-17 — §2 seeded with draft token values pixel-sampled from
  `DraftScreenshot/Home_SelectGame.png` and `Home_ShowGame.png` (colors, rough type
  scale, spacing, button radius). Marked [ESTIMATED]/[FILL IN] throughout — not yet
  confirmed against Figma Dev Mode (§7). Still open: --color-text-muted,
  --color-border, shadows, max content width, and the full type scale.
