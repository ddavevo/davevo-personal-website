# Design Token Structure Summary

## Overview
This document summarizes the complete design token structure from the Figma file, focusing on the connection points between variable collections: **Brand**, **Alias**, and **Mapped** collections!

## Collection Architecture

### 1. Brand Collection (Base Tokens)
The foundational tokens that define raw values. These are the source of truth for all design tokens.

#### Color Tokens

**Red Scale** (10 shades)
- `red-100`: `rgb(255 235 233)`
- `red-150`: `rgb(250 214 206)`
- `red-200`: `rgb(245 182 172)`
- `red-300`: `rgb(242 148 138)`
- `red-400`: `rgb(237 116 104)`
- `red-default`: `rgb(233 84 70)`
- `red-600`: `rgb(186 67 56)`
- `red-700`: `rgb(140 50 42)`
- `red-800`: `rgb(93 34 28)`
- `red-900`: `rgb(47 17 14)`

**Green Scale** (10 shades)
- `green-100`: `rgb(237 246 212)`
- `green-150`: `rgb(227 234 207)`
- `green-200`: `rgb(199 222 173)`
- `green-300`: `rgb(173 208 140)`
- `green-400`: `rgb(145 196 106)`
- `green-default`: `rgb(118 184 73)`
- `green-600`: `rgb(94 147 58)`
- `green-700`: `rgb(71 110 44)`
- `green-800`: `rgb(47 74 29)`
- `green-900`: `rgb(24 37 15)`

**Gray Scale** (11 shades)
- `gray-100`: `rgb(247 243 242)`
- `gray-200`: `rgb(229 224 223)`
- `gray-300`: `rgb(202 197 196)`
- `gray-400`: `rgb(173 168 168)`
- `gray-500`: `rgb(143 139 139)`
- `gray-600`: `rgb(114 110 110)`
- `gray-700`: `rgb(86 81 81)`
- `gray-800`: `rgb(60 56 56)`
- `gray-900`: `rgb(39 37 37)`
- `gray-1000`: `rgb(23 20 20)`

**Brown Scale** (9 shades)
- `brown-100`: `rgb(254 246 240)`
- `brown-200`: `rgb(245 234 224)`
- `brown-300`: `rgb(213 202 190)`
- `brown-400`: `rgb(189 159 134)`
- `brown-500`: `rgb(163 129 97)`
- `brown-600`: `rgb(129 100 81)`
- `brown-700`: `rgb(100 74 63)`
- `brown-800`: `rgb(66 50 41)`
- `brown-900`: `rgb(38 30 23)`

**Teal Scale** (9 shades)
- `teal-100`: `rgb(228 239 237)`
- `teal-200`: `rgb(172 228 237)`
- `teal-300`: `rgb(108 212 229)`
- `teal-500`: `rgb(4 151 180)`
- `teal-600`: `rgb(0 108 140)`
- `teal-700`: `rgb(1 85 111)`
- `teal-800`: `rgb(6 47 63)`
- `teal-900`: `rgb(8 26 28)`
- `teal-default`: `rgb(0 175 205)`

#### Typography Scale Tokens
Base size values used for typography and spacing scaling:
- `Scale-0`: `0px`
- `Scale-25`: `1px`
- `Scale-50`: `2px`
- `Scale-100`: `4px`
- `Scale-200`: `8px`
- `Scale-250`: `10px`
- `Scale-300`: `12px`
- `Scale-350`: `14.4px`
- `Scale-375`: `15.2px`
- `Scale-default`: `16px`
- `Scale-425`: `16.8px`
- `Scale-450`: `17.6px`
- `Scale-500`: `20px`
- `Scale-550`: `22px`
- `Scale-600`: `24px`
- `Scale-700`: `28px`
- `Scale-800`: `32px`
- `Scale-900`: `36px`
- `Scale-1000`: `40px`
- `Scale-1100`: `44px`
- `Scale-1200`: `48px`
- `Scale-1300`: `64px`
- `Scale-1400`: `160px`

#### Font Family Tokens
- `Font-family-h1`: `'Fraunces'`
- `Font-family-h2`: `'Gravity'`
- `Font-family-h3`: `'Gravity'`
- `Font-family-h4`: `'Gravity'`
- `Font-family-body`: `'Gravity'`

#### Font Weight Tokens
- `Font-weight-Regular`: `'Regular'` (400)
- `Font-weight-Bold`: `'Bold'` (700)
- `Font-weight-Italic`: `'Italic'`
- `Font-weight-Bold-Italic`: `'Bold Italic'`

---

### 2. Alias Collection (Semantic Tokens)
Semantic tokens that reference Brand collection tokens, providing meaning and context. These create a layer of abstraction that allows for easy theme switching or updates.

#### Background Aliases
Maps brown color scale to semantic background tokens:
- `Background-100`: `var(--brown-100)`
- `Background-200`: `var(--brown-200)`
- `Background-300`: `var(--brown-300)`
- `Background-400`: `var(--brown-400)`
- `Background-500`: `var(--brown-500)`
- `Background-600`: `var(--brown-600)`
- `Background-700`: `var(--brown-700)`
- `Background-800`: `var(--brown-800)`
- `Background-900`: `var(--brown-900)`

#### Border Radius Aliases
Maps scale tokens to border radius values:
- `Border-Radius-none`: `var(--Scale-0)`
- `Border-Radius-sm`: `var(--Scale-200)` (8px)
- `Border-Radius-md`: `var(--Scale-250)` (10px)
- `Border-Radius-lg`: `var(--Scale-default)` (16px)

#### Border Width Aliases
Maps scale tokens to border width values:
- `Border-Width-none`: `var(--Scale-0)`
- `Border-Width-sm`: `var(--Scale-25)` (1px)
- `Border-Width-md`: `var(--Scale-50)` (2px)
- `Border-Width-lg`: `var(--Scale-100)` (4px)

#### Error Aliases
Maps red color scale to semantic error tokens:
- `Error-100`: `var(--red-100)`
- `Error-150`: `var(--red-150)`
- `Error-200`: `var(--red-200)`
- `Error-300`: `var(--red-300)`
- `Error-400`: `var(--red-400)`
- `Error-default`: `var(--red-default)`
- `Error-600`: `var(--red-600)`
- `Error-700`: `var(--red-700)`
- `Error-800`: `var(--red-800)`
- `Error-900`: `var(--red-900)`

#### Neutral Aliases
Maps gray color scale to semantic neutral tokens:
- `Neutral-100`: `var(--gray-100)`
- `Neutral-100-2`: `var(--gray-1000)`
- `Neutral-200`: `var(--gray-200)`
- `Neutral-300`: `var(--gray-300)`
- `Neutral-400`: `var(--gray-400)`
- `Neutral-500`: `var(--gray-500)`
- `Neutral-600`: `var(--gray-600)`
- `Neutral-700`: `var(--gray-700)`
- `Neutral-800`: `var(--gray-800)`
- `Neutral-900`: `var(--gray-900)`

#### Primary Aliases
Maps teal color scale to semantic primary/brand tokens:
- `Primary-100`: `var(--teal-100)`
- `Primary-200`: `var(--teal-200)`
- `Primary-300`: `var(--teal-300)`
- `Primary-500`: `var(--teal-500)`
- `Primary-600`: `var(--teal-600)`
- `Primary-700`: `var(--teal-700)`
- `Primary-800`: `var(--teal-800)`
- `Primary-900`: `var(--teal-900)`
- `Primary-default`: `var(--teal-default)`

#### Spacing Aliases
Maps scale tokens to semantic spacing values:

**Gap Spacing**
- `Spacing-gap-sm`: `var(--Scale-default)` (16px)
- `Spacing-gap-md`: `var(--Scale-800)` (32px)
- `Spacing-gap-lg`: `var(--Scale-1300)` (64px)

**Space Spacing**
- `Spacing-none`: `var(--Scale-0)`
- `Spacing-space-xxs`: `var(--Scale-100)` (4px)
- `Spacing-space-xs`: `var(--Scale-300)` (12px)
- `Spacing-space-sm`: `var(--Scale-default)` (16px)
- `Spacing-space-md`: `var(--Scale-800)` (32px)
- `Spacing-space-lg`: `var(--Scale-1000)` (40px)
- `Spacing-space-xl`: `var(--Scale-1200)` (48px)
- `Spacing-space-xxl`: `var(--Scale-1300)` (64px)

#### Success Aliases
Maps green color scale to semantic success tokens:
- `Success-100`: `var(--green-100)`
- `Success-200`: `var(--green-200)`
- `Success-300`: `var(--green-300)`
- `Success-400`: `var(--green-400)`
- `Success-default`: `var(--green-default)`
- `Success-600`: `var(--green-600)`
- `Success-700`: `var(--green-700)`
- `Success-800`: `var(--green-800)`
- `Success-900`: `var(--green-900)`

**Connection Pattern**: Alias tokens map semantic meanings (like "Primary", "Error", "Background") to specific Brand color values, creating a layer of abstraction that allows for easy theme switching or updates.

---

### 3. Mapped Collection (Composite Tokens)
Complex tokens that combine multiple Brand and Alias tokens to create complete design patterns for specific use cases.

#### Border Tokens
State-based border color tokens that reference Alias tokens:
- `Border-action`: `rgb(255 255 255)` (white)
- `Border-action-hover`: `rgb(255 255 255)` (white)
- `Border-default`: `rgb(255 255 255)` (white)
- `Border-disabled`: `rgb(255 255 255)` (white)
- `Border-error`: `var(--Error-default)`
- `Border-focus`: `rgb(255 255 255)` (white)
- `Border-insight`: `var(--Primary-default)`
- `Border-success`: `var(--Success-default)`

#### Icon Tokens
- `Icons-var`: `rgb(255 255 255)` (white)

#### Surface Tokens
State-based surface/background color tokens that reference Alias tokens:
- `Surface-action`: `var(--Primary-500)`
- `Surface-action-hover`: `var(--Primary-800)`
- `Surface-default`: `var(--Background-100)`
- `Surface-error`: `var(--Error-100)`
- `Surface-insight`: `var(--Primary-100)`
- `Surface-page`: `var(--Background-100)`
- `Surface-success`: `var(--Success-100)`

#### Text Tokens
State-based text color tokens that reference Alias tokens:
- `Text-action`: `var(--Primary-800)`
- `Text-action-hover`: `var(--Primary-100)`
- `Text-body`: `var(--Background-700)`
- `Text-caption`: `var(--Background-600)`
- `Text-disabled`: `var(--Background-400)`
- `Text-error`: `var(--Background-700)`
- `Text-heading`: `var(--Primary-800)`
- `Text-on-action`: `var(--Primary-100)`
- `Text-success`: `var(--Background-700)`
- `Text-toc-selected`: `var(--Background-900)`

**Connection Pattern**: Mapped tokens reference Alias tokens to create complete, state-aware design patterns. For example:
- `Text-heading` → `Primary-800` → `teal-800` (Brand)
- `Surface-action` → `Primary-500` → `teal-500` (Brand)
- `Border-error` → `Error-default` → `red-default` (Brand)

---

## Connection Flow Diagram

```
Brand Collection (Base)
    ↓
    ├──→ Alias Collection (Semantic)
    │       ├── Color Aliases
    │       │   ├── Primary-* → teal-*
    │       │   ├── Error-* → red-*
    │       │   ├── Success-* → green-*
    │       │   ├── Background-* → brown-*
    │       │   └── Neutral-* → gray-*
    │       │
    │       ├── Spacing Aliases
    │       │   ├── Spacing-gap-* → Scale-*
    │       │   └── Spacing-space-* → Scale-*
    │       │
    │       └── Border Aliases
    │           ├── Border-Radius-* → Scale-*
    │           └── Border-Width-* → Scale-*
    │
    └──→ Mapped Collection (Composite)
            ├── Border Tokens
            │   ├── Border-error → Error-default → red-default
            │   ├── Border-insight → Primary-default → teal-default
            │   └── Border-success → Success-default → green-default
            │
            ├── Surface Tokens
            │   ├── Surface-action → Primary-500 → teal-500
            │   ├── Surface-default → Background-100 → brown-100
            │   └── Surface-error → Error-100 → red-100
            │
            └── Text Tokens
                ├── Text-heading → Primary-800 → teal-800
                ├── Text-body → Background-700 → brown-700
                └── Text-on-action → Primary-100 → teal-100
```

## Complete Token Count Summary

- **Brand Collection**: 67 tokens
  - Colors: 49 tokens (red, green, gray, brown, teal)
  - Scale: 20 tokens
  - Typography: 9 tokens (5 font families, 4 font weights)

- **Alias Collection**: 47 tokens
  - Background: 9 tokens
  - Border: 8 tokens (4 radius, 4 width)
  - Color Semantic: 28 tokens (Error, Neutral, Primary, Success)
  - Spacing: 11 tokens

- **Mapped Collection**: 19 tokens
  - Border: 8 tokens
  - Icons: 1 token
  - Surface: 7 tokens
  - Text: 10 tokens

**Total**: 133 design tokens

## Key Design Principles

1. **Separation of Concerns**: Brand tokens define raw values, Alias tokens provide semantic meaning, and Mapped tokens create complete patterns.

2. **Single Source of Truth**: All color values originate from the Brand collection, ensuring consistency.

3. **Scalability**: The Scale token system allows for responsive typography and spacing that adapts across breakpoints.

4. **Maintainability**: Changes to Brand tokens automatically propagate through Alias and Mapped collections.

5. **Semantic Naming**: Alias tokens use descriptive names (Primary, Error, Success) rather than color names, making them theme-agnostic.

6. **State-Aware Design**: Mapped tokens handle different states (default, hover, disabled, error, success) for complete component patterns.

## Token Naming Conventions

- **Brand**: `{color}-{shade}` or `{category}-{value}` (e.g., `teal-800`, `Scale-1000`)
- **Alias**: `{Category}-{semantic-name}` (e.g., `Primary-800`, `Spacing-space-md`)
- **Mapped**: `{Category}-{state}` (e.g., `Text-heading`, `Surface-action`, `Border-error`)

## Usage Recommendations

1. **Always use Alias tokens** for colors in components (e.g., `Primary-800` instead of `teal-800`)
2. **Use Mapped tokens** for complete component patterns (e.g., `Text-heading` instead of `Primary-800`)
3. **Reference Brand tokens** only when creating new Alias or Mapped tokens
4. **Maintain the hierarchy**: Brand → Alias → Mapped → Components
5. **Use semantic names**: Prefer `Error-default` over `red-default` for better maintainability
6. **Leverage spacing tokens**: Use `Spacing-space-md` instead of hardcoded `32px` values

---

*Generated from Figma file: Resume - Portfolio Assets (lo4ILwMB23CxT9z0bW7CQ4)*
*Based on exported CSS variables from Brand, Alias, and Mapped collections*
