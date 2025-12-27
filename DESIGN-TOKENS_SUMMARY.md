# Design Tokens — Current Summary

This document summarizes the current CSS design token structure found in the repository (read-only analysis). It lists where tokens are defined, how they are being used across the case study pages, common patterns, and flagged inconsistencies/undefined variables to fix later.

**Where tokens are defined**
- Primary token file: `styles/general.css` (contains the main `:root` palette, neutral/gray scales, `--bg`, `--navgradient`, `--case-study`, font-face declarations).
- Page-specific tokens: `styles/case-studies.css` (adds some case-study-specific tokens such as `--no-ai`, `--co-led`, `--ai-led`, etc.).
- Some pages include page-level inline CSS that redeclares `:root` or overrides token values (example: `case-studies/designlab.html` contains a minified `:root` block that redefines tokens — notably `--quote-pain` has a different value there).

**Main token groups observed**
- Accent scale: `--accent-100` → `--accent-900` (100 = light, 900 = dark). Used for headings, gradients, buttons, borders.
- Background / surface: `--bg` (page background). Also `--neutral-100` is referenced in some places but not consistently defined.
- Neutral scale: `--neutral-200` → `--neutral-1100` (used for captions, borders, tag backgrounds, UI text). 
- Gray scale: `--gray-100` → `--gray-1000` (appears to overlap with neutral scale — both are used in different places).
- Semantic tokens for research insights: `--pain-point`, `--quote-pain`, `--gain-point`, `--quote-gain`, `--gain` (used for insight cards and contextual UI states).
- Gradients: `--navgradient`, `--case-study` (constructed from the accent and bg variables).
- Case-study specific: `--no-ai`, `--no-ai-border`, `--co-led`, `--co-led-border`, `--ai-led`, `--ai-led-border` (defined in `case-studies.css`).

**Common usage patterns**
- Headings and global text: `--accent-800` is the default text accent for headings and many paragraph links.
- Primary CTA / stronger accents: `--accent-400` and `--accent-600` are used for buttons, highlighted text, and repeated linear-gradients for hero/wordmark styling.
- Tag and pill backgrounds: `--accent-100` and `--neutral-200` are used as background fills for tags and chips.
- Hero sections: linear-gradient(from `--accent-700` → `--accent-900`) with text color `--bg`.
- Insight cards: `--pain-point` (light red/pink background) + `--quote-pain` border color; `--gain-point` + `--quote-gain` for positive insights.
- Per-page overrides: some case-study pages embed small inline `<style>` blocks that tweak colors or re-declare `:root` — these act as de-facto theme overrides.

**Explicit token list (from `styles/general.css`)**
- --pain-point: #FFEBE9
- --quote-pain: #E95446
- --gain-point: #E9FBD7
- --quote-gain: #76B849
- --gain: #C7F29B
- --navgradient: linear-gradient(var(--bg), var(--bg) 9.4rem, rgb(254,246,240, 0.8) 10.2rem, transparent)
- --case-study: linear-gradient(to left, var(--accent-400), var(--accent-800))
- --accent-100: #e4efed
- --accent-200: #ace4ed
- --accent-300: #6cd4e5
- --accent-400: #00afcd
- --accent-500: #0497b4
- --accent-600: #006c8c
- --accent-700: #01556f
- --accent-800: #062f3f
- --accent-900: #081a1c
- --bg: #fef6f0
- --neutral-200: #F9EEE4
- --neutral-300: #E2D6CB
- --neutral-400: #ccbfb3
- --neutral-500: #b5a89c
- --neutral-600: #9e9186
- --neutral-700: #887b70
- --neutral-800: #71665b
- --neutral-900: #5a5047
- --neutral-1000: #423229
- --neutral-1100: #261e17
- --gray-100: #f7f3f2
- --gray-200: #e5e0df
- --gray-300: #cac5c4
- --gray-400: #ada8a8
- --gray-500: #8f8b8b
- --gray-600: #726e6e
- --gray-700: #565151
- --gray-800: #3c3838
- --gray-900: #272525
- --gray-1000: #171414

**Additional tokens (from `styles/case-studies.css`)**
- --no-ai-border: #4F7600
- --no-ai: #E8F5CD
- --co-led-border: #8C6711
- --co-led: #FFF5C9
- --ai-led-border: #A15500
- --ai-led: #FFE7CC

**Notable inline overrides observed**
- `case-studies/designlab.html` contains a minified `:root` which duplicates most variables from `general.css` but sets `--quote-pain: #F06152` (different from `general.css`'s `#E95446`). This is an explicit local override that will change the look of insight/pain borders on that page only.

**Inconsistencies and problems to flag**
- Undefined variables in use:
  - `--neutral-600-border` is referenced (example: `.locked-input input { border: .1rem solid var(--neutral-600-border); }`) but **no `--neutral-600-border` definition** exists. Likely intended to be `--neutral-600` or `--neutral-600` + alpha.
  - `--midtone` is used in `styles/about-page.css` (`.my-stats span { background-color: var(--midtone); }`) but **not defined** anywhere.
- Duplicate / overlapping scales:
  - Both a `--neutral-*` scale and a `--gray-*` scale exist and are used in different places. This duplication increases cognitive load and can lead to inconsistent choices (choose one canonical neutral palette).
- Per-page `:root` duplication and overrides:
  - `case-studies/designlab.html` re-declares `:root` (minified) — duplication may cause drift across pages; changes must be made in two places to stay consistent.
- Hard-coded colors instead of tokens:
  - `.numbered span` uses `background-color: #14ae5c;` directly in `case-studies.css` while `.numbered-span` uses `var(--accent-400)`. Replace hard-coded hex with a token like `--success` or `--accent-xxx` for consistency.
  - Several hover gradients or overlays use raw hex or rgba values (e.g., `#ffffff90`, `#fef6f090`) rather than tokens.
- Minor value differences across definitions:
  - `--quote-pain` differs between `general.css` (#E95446) and `designlab.html` inline (#F06152). Decide on single source of truth.
- Token naming consistency:
  - Some tokens are semantic (`--pain-point`, `--gain-point`) and some are scale-based (`--accent-400`). Consider introducing semantic tokens for states (e.g., `--color-success`, `--color-warning`, `--color-error`, `--surface`, `--border`) that map to the current scale.

**Suggested next steps (non-invasive, for planning only)**
1. Consolidate tokens into a single source (`styles/general.css`) and remove per-page `:root` duplicates.
2. Replace undefined tokens (`--neutral-600-border`, `--midtone`) or define them explicitly in `general.css` (with a comment explaining purpose).
3. Remove hard-coded colors and replace with token references. Add semantic aliases for frequently used states: `--success`, `--danger`, `--warning`, `--muted`, etc.
4. Migrate all pages to reference tokens from `general.css` and avoid inline `:root` redeclarations. If a page needs a local override, use a CSS class or data-theme so changes are explicit.
5. Optionally deduplicate `--gray-*` vs `--neutral-*` (pick one scale or document their distinct roles clearly).
6. Run a contrast audit once tokens are consolidated to ensure text/interactive elements meet accessibility contrast.

If you want, I can now:
- generate a follow-up patch that centralizes tokens (create a single `styles/tokens.css` and update imports), or
- produce a smaller patch that only defines missing tokens (`--midtone`, `--neutral-600-border`) and replaces obvious hard-coded hex values with token references.

---
Generated by repository analysis (read-only). No source files were modified during this analysis.

## Typography — Current Summary

This section documents typography tokens, scales, and patterns discovered during a quick audit of the styles and case-study pages.

**Where typography is defined**
- Global font faces and base rules: `styles/general.css` (declares `@font-face` for `gravity`, `gravity-bold`, and `Fraunces`; base body font-family and global font-size clamps).
- Layout and component rules: spread across `styles/*.css` (for example `about-page.css`, `landing-page.css`, `playground.css`, `case-studies.css`, and `boilerplate.css`) — many components define sizes locally.
- Page-level inline style blocks: several `case-studies/*.html` pages include inline `<style>` that sets display heading styles (`h1.fraunces`) and hero sizing.

**Font families observed**
- `gravity` (local font used for body copy and UI elements).
- `gravity-bold` (used for headings and emphasized UI elements).
- `Fraunces` (display serif used for large headings/wordmark in `.fraunces`).

**Font-size scale & patterns (extracted examples)**
- Headings (global in `general.css`):
  - `h1`: `font-size: clamp(2.25rem, 2vw, 2.5rem)` (desktop breakpoint increases in media query)
  - `h2`: `clamp(1.75rem, 2vw, 2rem)`
  - `h3`: `clamp(1.25rem, 2vw, 1.5rem)`
  - `h4`: `clamp(1.1rem, 2vw, 1.25rem)`
- Body copy and small text:
  - `p, li, span, form, input, button`: `font-size: clamp(1rem, 2vw, 1.1rem)` (global)
  - `.subtitle`, `figcaption`: `clamp(0.95rem, 1vw, 1rem)`
- Component / page specifics:
  - `.wordmark span` (boilerplate): `48px` (hard-coded large display size)
  - `.landing-text` (about/landing/playground): uses large fixed sizes (e.g., `3rem`, `4rem` in media queries) and repeating-linear-gradient background-clip for display effect.
  - `#case-study-title` uses page-level styles (varies between pages; some pages rely on `.fraunces` rules defined inline).
  - `.table-of-contents li a`: `clamp(0.9rem, 1vw, 1.05rem)` (case-studies)
  - `.fake-h4`: `clamp(1.1rem, 2vw, 1.25rem)` (case-studies)

**Line-height / spacing patterns**
- Many rules use `line-height: 150%` or explicit numeric line-height in components. `h3`/`h4` frequently set `line-height: 150%`.
- No centralized line-height variables were found (no `--leading-*` tokens).

**Responsive strategy**
- The codebase uses `clamp()` with a viewport-relative middle value (e.g. `2vw`) in many places—this creates a fluid typography system without explicit tokens.
- Some components still use fixed sizes (px or rem) for large display text, creating inconsistent scaling between sections.

**Inconsistencies and issues to flag**
- No typography tokens: font sizes, line-heights, and spacing are not captured with CSS variables (no `--fs-*`, `--leading-*`, `--ff-*` tokens), making consistent updates harder.
- Mixed sizing methods: a mix of `clamp()` (fluid), fixed `rem`/`px`, and inline `style` overrides leads to inconsistencies across pages (e.g., `.wordmark span` uses `48px` while headings use `clamp()`).
- Page-level inline styles: `case-studies/*.html` includes inline `h1.fraunces` style blocks which may duplicate or diverge from `general.css` defaults.
- Unclear semantic mapping: there is no mapping from semantic roles (e.g., `--heading-xl`, `--body-md`, `--lead-sm`) to actual values; components pick sizes directly.
- Line-height not tokenized: consistent vertical rhythm is hard to enforce without `--leading-*` tokens.

**Recommended next steps (typography)**
1. Introduce a small set of typography tokens in `styles/general.css` (or a new `styles/tokens.css`):
   - font families: `--ff-sans`, `--ff-display`, `--ff-bold`
   - font sizes: `--fs-xxl`, `--fs-xl`, `--fs-lg`, `--fs-md`, `--fs-sm`, `--fs-xs` (map to current `clamp()` values)
   - line-heights: `--lh-xxl`, `--lh-xl`, `--lh-md`, `--lh-sm`
2. Replace component hard-coded sizes with tokens; keep `clamp()` in tokens where fluid scaling is desired.
3. Remove inline page-level `:root`/style duplications and consolidate display heading rules into `general.css` or a single import to avoid drift.
4. Add comments documenting the responsive sizing strategy (why `clamp()` is used and which token maps to which role).
5. Optionally run a small visual check after tokenizing to ensure no layout regressions (spot-check `landing`, `about`, and one `case-study`).

---
Added typography audit. If you'd like, I can now:
- create the `--fs-`/`--lh-` tokens and replace a small set of target components to demonstrate the change, or
- add only the missing CSS variables (`--ff-*`, `--fs-md`, `--lh-md`) to `general.css` so you can progressively migrate.

### Typography — Px mapping (quick reference)

Assumptions: root font-size = 16px. For `clamp(min, Xvw, max)` entries we show the min/max (px) and sample computed values at viewport widths 375px, 768px, 1280px and 1440px. `2vw` = 2% of viewport, `1.25vw` = 1.25% of viewport.

Selector | Declared value | Min (px) | Sample @375px | @768px | @1280px | @1440px | Max (px)
---|---:|---:|---:|---:|---:|---:|---:
`h1` (global) | `clamp(2.25rem, 2vw, 2.5rem)` | 36 | 36 | 36 | 36 | 36 | 40
`h1` (@ >=1281px) | `clamp(2.5rem, 1.25vw, 2.75rem)` | 40 | 40 | 40 | 40 | 40 | 44
`h2` (global) | `clamp(1.75rem, 2vw, 2rem)` | 28 | 28 | 28 | 28 | 28 | 32
`h2` (@ >=1281px) | `clamp(2rem, 1.25vw, 2.5rem)` | 32 | 32 | 32 | 32 | 32 | 40
`h3` (global) | `clamp(1.25rem, 2vw, 1.5rem)` | 20 | 20 | 20 | 20 | 20 | 24
`h3` (@ >=1281px) | `clamp(1.5rem, 1.25vw, 2rem)` | 24 | 24 | 24 | 24 | 24 | 32
`h4` (global) | `clamp(1.1rem, 2vw, 1.25rem)` | 17.6 | 17.6 | 17.6 | 17.6 | 17.6 | 20
`h4` (@ >=1281px) | `clamp(1.25rem, 1.25vw, 1.5rem)` | 20 | 20 | 20 | 20 | 20 | 24
`p, li, span, input` (global) | `clamp(1rem, 2vw, 1.1rem)` | 16 | 16 | 16 | 16 | 16 | 17.6
`p, li, span, figcaption` (@ >=1281px) | `clamp(16.8px, 1.25vw, 22px)` | 16.8 | 16.8 | 16.8 | 16.8 | 16.8 | 22
`.subtitle, figcaption` | `clamp(0.95rem, 1vw, 1rem)` | 15.2 | 15.2 | 15.2 | 15.2 | 15.2 | 16
`.table-of-contents li a` | `clamp(0.9rem, 1vw, 1.05rem)` | 14.4 | 14.4 | 14.4 | 14.4 | 14.4 | 16.8
`.fake-h4` | `clamp(1.1rem, 2vw, 1.25rem)` | 17.6 | 17.6 | 17.6 | 17.6 | 17.6 | 20
`.wordmark span` | `48px` (fixed) | 48 | 48 | 48 | 48 | 48 | 48
`.landing-text` | `3rem` (desktop) → `4rem` (@ ≥1312px) | 48 | 48 | 48 | 48 | 48 → 64 | 64

Notes:
- Many `clamp()` declarations use a small `vw` value (e.g., `2vw`) whose computed px is smaller than the `min` for typical viewport widths; practically those clamps resolve to the `min` value until very large viewports (>1800px in some cases). This means the current system behaves mostly as a stepped scale rather than a smooth fluid scale across common devices.
- `@media (min-width:1281px)` increases heading sizes and switches some clamps (see table). `@media (min-width:1312px)` / `1321px` / `1440px` affect large display text such as `.landing-text` and `.wordmark` in a few stylesheets.

How this helps Figma mapping:
- Use the `Min (px)` column to populate your baseline Figma text styles (safe for most viewports).
- Use the `Max (px)` column for large-screen variants or display styles.
- If you want exact values at a specific artboard width, I can add a CSV export with computed px values for any viewport widths you choose.

---
Updated — typography px mapping added for easier Figma migration.

## Spacing & Layout — Current Summary

This section inventories numeric spacing and layout values found across the styles and pages (padding, margin, gap, border-radius, border widths). It maps common values to px (root = 16px) and suggests token names to introduce.


Spacing audit (table)

Property | Example value(s) | Px (root=16px) | Sample locations | Suggested token
--- | --- | ---: | --- | ---
gap | `4rem` | 64px | `.main` grids, `.featured-case-studies` gap | `--space-xxl` / `--gap-lg`
gap | `2rem` | 32px | `.columns`, `.featured-case-studies` grid gap | `--space-md` / `--gap-md`
gap | `1rem` | 16px | small component gaps | `--space-sm` / `--gap-sm`
gap | `0.25rem` | 4px | inline pills / small spacing | `--space-xxs`
padding | `10rem 4rem 1rem 4rem` | 160px 64px 16px 64px | `.playground .main-container` large top padding | composite tokens: `--space-xxxl` / `--container-pad-lg`
padding | `3rem` | 48px | hero/content blocks | `--space-xl`
padding | `2.4rem` | ~38.4px | section/container padding | `--space-lg`
padding | `2rem` | 32px | card/content padding | `--space-md`
padding | `1rem` | 16px | buttons, small containers | `--space-sm`
padding | `.25rem .75rem` | 4px 12px | small pills/tags | `--space-xxs / --space-xs`
margin | `0 auto` / `auto auto` | n/a | centering containers | use layout helpers + `--container-max-width`
margin | `1.6rem 0` | 25.6px | vertical spacing | `--space-lg` (or `--space-xl` depending on context)
margin-bottom | `2.5ch` | n/a (typographic) | article spacing | consider `--space-md` mapping or leave typographic units
border-width | `1px` | 1px | thin outlines | `--border-1`
border-width | `1.25px` | 1.25px | many chip borders | `--border-1-25`
border-width | `.1rem` | 1.6px | inputs | `--border-sm`
border-left | `0.3rem` | 4.8px | quote accent | `--border-3`
border-radius | `1rem` | 16px | cards, panels | `--radius-lg`
border-radius | `0.6rem` | 9.6px | smaller rounded corners | `--radius-md`
border-radius | `0.4rem` | 6.4px | subtle rounding | `--radius-sm`
border-radius | `100rem` / `100px` | pill / 100px | pill buttons / specific cases | `--radius-pill` / `--radius-100`

Px mapping quick reference (root 16px)
- `4rem` = 64px
- `3rem` = 48px
- `2.4rem` ≈ 38.4px
- `2rem` = 32px
- `1rem` = 16px
- `0.6rem` = 9.6px
- `0.4rem` = 6.4px
- `0.25rem` = 4px
- `100px` = 100px (explicit value)

Hard-coded examples worth replacing (sample locations)
- `.wordmark span` uses `48px` (replace with `--space-xl` or `--fs-display`).
- `.numbered span` uses `background-color: #14ae5c` (color note from earlier) but pill sizes and padding are hard-coded: `padding: .2rem .55rem`.
- `.landing-link` uses `border-radius: 100rem` (pills) — suggest `--radius-pill`.
- Various `padding: 2.4rem`, `padding: 3rem`, `padding: 10rem 4rem 1rem 4rem` — suggest `--space-xl`, `--space-xxl`, and container padding tokens like `--container-pad-lg` / `--container-pad-sm`.
- Borders: `border: 1.25px` and `border: .1rem` — unify as `--border-1-25` and `--border-sm`.

Recommendations
1. Add the suggested tokens to `styles/general.css` (or `styles/tokens.css`) and replace values progressively.
2. Introduce semantic container tokens: `--container-gap`, `--container-pad`, `--toc-width` (where applicable) so page layouts can be tweaked from one place.
3. Replace `100px` and other explicit pixel radii with token equivalents (`--radius-lg` or `--radius-pill`) to match Figma components.
4. For border widths, define tokens and prefer `border: var(--border-1) solid var(--border-color)` where possible.
5. If you want, I can create a patch that defines these tokens in `styles/general.css` and replaces a small set of high-impact instances (`.landing-link`, `.wordmark span`, `.hero` paddings) as a demo.

---
I added spacing & layout token recommendations and mapped common rem values to px for Figma. Next I can either export a CSV of all numeric occurrences or implement the new tokens in a small demo patch — which do you prefer?

