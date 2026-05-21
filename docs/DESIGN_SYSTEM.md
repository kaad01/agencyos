# AgencyOS Design System — Tier 1

This document describes the **10 UX-perfect gates** that every AgencyOS surface
must pass, and how the design tokens introduced in this loop enable each one.

The tokens live in two mirrored sources of truth:

- `src/styles/tokens.css` — CSS custom properties consumed by every component
- `src/lib/design/tokens.ts` — typed object for JS/TS consumption (charts,
  inline styles, Storybook, tests)

Everything visual flows through these tokens. No raw hex values, no ad-hoc
pixel values, no Tailwind defaults bleeding through.

---

## The 10 Gates

### 1. Keyboard-first

Every interactive element must be reachable and operable with the keyboard
alone. Focus rings use `--color-brand-primary` at 2px outline + 2px offset.
`--duration-fast` keeps the focus transition snappy (≤120ms) so keyboard
users get instant feedback. Skip links and command palette use the same
`--shadow-4` overlay treatment for consistency.

### 2. Optimistic UI

Mutations render the next state immediately, then reconcile with the server.
Tokens supporting this:

- `--duration-base` (200ms) for the optimistic fade-in
- `--color-warning` for "pending" badges
- `--color-danger` for rollback toasts
- `--ease-out` curve keeps motion feeling responsive, not springy

### 3. Inline edit

Click-to-edit fields swap from display to input mode without modal disruption.
Required tokens: `--radius-md` for the editable container, `--color-border`
for the resting state, `--color-brand-primary` for the focused state,
`--shadow-1` lifting the input above siblings during edit.

### 4. Empty states

Empty lists, zero-search-results, and no-permission states are first-class
designs, not afterthoughts. They use `--color-text-muted`, `--space-7`
vertical rhythm, and one primary CTA in `--color-brand-primary`. Illustrations
sit on `--color-surface-muted` panels.

### 5. Accessibility ≥ 95 (Lighthouse)

Every color pairing in `tokens.css` is contrast-verified:

- `--color-text` on `--color-bg` ≥ 16:1 (light) / ≥ 15:1 (dark)
- `--color-text-muted` on `--color-bg` ≥ 4.6:1
- `--color-brand-primary` on white ≥ 4.5:1 for buttons
- Semantic colors all pair with `--color-neutral-50` text at AA

Motion respects `prefers-reduced-motion`; all `--duration-*` tokens are
suppressed via a global query in the app shell.

### 6. Mobile 375px

The smallest supported viewport is 375px (iPhone SE). The 4px spacing grid
(`--space-1` through `--space-12`) was chosen because every multiple lands
cleanly on device pixels at 1x, 2x, and 3x. Type scale tops out at
`--text-3xl` (36px) which still fits two-line headlines at 375px.

### 7. TTI < 2s

Tokens are static CSS variables — zero JS runtime cost. The `.ts` mirror is
tree-shakable; importing one color costs ~40 bytes. No CSS-in-JS runtime,
no theme provider hydration, no flash of unstyled content. Dark mode switches
via a single `[data-theme="dark"]` attribute on `<html>`.

### 8. Design tokens only

This is the meta-gate. CI lint forbids:

- Hex literals outside `tokens.css`
- Hard-coded `px` values outside `tokens.css` (with allowlist for `1px`
  borders and SVG attributes)
- `style={{ color: '#...' }}` in JSX
- Tailwind arbitrary values like `text-[#ff0000]`

Everything must resolve to `var(--token-name)` or a `tokens.ts` import.

### 9. Light + dark parity

Every component is designed in both themes simultaneously. The `[data-theme="dark"]`
selector in `tokens.css` overrides only surface, border, text, brand, and
shadow tokens — spacing/radius/type/motion are theme-invariant. Components
never branch on theme in code; they consume semantic tokens
(`--color-surface`, `--color-text`) and get the right value automatically.

A `prefers-color-scheme: dark` fallback handles users who haven't picked
a preference. The user's explicit `data-theme` always wins.

### 10. No domain test regression

Visual changes must not break the ~hundreds of existing domain/integration
tests. Tokens are purely additive: new files, no edits to existing components
in this loop. The swatch demo at `/tokens` is the only new route and lives
under the `(demo)` route group so it's not in the main nav. Subsequent loops
will migrate components one-by-one with snapshot tests gating each step.

---

## File map

| File | Purpose | LOC |
| --- | --- | --- |
| `src/styles/tokens.css` | Single source of truth — CSS variables | ~120 |
| `src/lib/design/tokens.ts` | Typed JS mirror | ~95 |
| `docs/DESIGN_SYSTEM.md` | This document | ~120 |
| `src/app/(demo)/tokens/page.tsx` | Visual swatch board | ~110 |

## Next loops

1. Button, Input, Card, Dialog primitives consuming these tokens
2. Theme toggle wired to `localStorage` + `data-theme`
3. Lighthouse CI gate (≥95 a11y, ≥90 perf) in PR pipeline
4. Component-level visual regression with Playwright + per-theme snapshots
