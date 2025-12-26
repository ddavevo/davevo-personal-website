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
