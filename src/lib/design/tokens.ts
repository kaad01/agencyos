/**
 * AgencyOS Design Tokens — Tier 1 (TS mirror of src/styles/tokens.css)
 * Source of truth lives in tokens.css; keep this file in sync.
 */

export const colors = {
  neutral: {
    50:  'hsl(220 20% 98%)',
    100: 'hsl(220 16% 96%)',
    200: 'hsl(220 14% 91%)',
    300: 'hsl(220 12% 83%)',
    400: 'hsl(220 10% 65%)',
    500: 'hsl(220 9% 46%)',
    600: 'hsl(220 11% 34%)',
    700: 'hsl(220 13% 25%)',
    800: 'hsl(220 16% 16%)',
    900: 'hsl(220 20% 10%)',
    950: 'hsl(220 24% 6%)',
  },
  brand: {
    primary: 'hsl(252 80% 60%)',
    primaryHover: 'hsl(252 80% 54%)',
    accent: 'hsl(192 92% 50%)',
  },
  semantic: {
    success: 'hsl(150 60% 42%)',
    warning: 'hsl(38 92% 50%)',
    danger:  'hsl(0 72% 54%)',
    info:    'hsl(212 90% 56%)',
  },
} as const;

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '32px',
  8: '40px',
  9: '48px',
  10: '64px',
  11: '80px',
  12: '96px',
} as const;

export const radii = {
  sm: '4px',
  md: '6px',
  lg: '10px',
  xl: '16px',
  full: '9999px',
} as const;

export const shadows = {
  1: '0 1px 2px 0 hsl(220 20% 10% / 0.04)',
  2: '0 2px 4px -1px hsl(220 20% 10% / 0.06), 0 1px 2px hsl(220 20% 10% / 0.04)',
  3: '0 6px 16px -4px hsl(220 20% 10% / 0.10), 0 2px 4px hsl(220 20% 10% / 0.05)',
  4: '0 18px 40px -10px hsl(220 20% 10% / 0.18), 0 4px 8px hsl(220 20% 10% / 0.06)',
} as const;

export const typography = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, "Inter", "Segoe UI", sans-serif',
    mono: 'ui-monospace, "JetBrains Mono", SFMono-Regular, Menlo, monospace',
  },
  scale: {
    xs:   { size: '12px', leading: '16px' },
    sm:   { size: '13px', leading: '18px' },
    base: { size: '14px', leading: '20px' },
    md:   { size: '16px', leading: '24px' },
    lg:   { size: '18px', leading: '26px' },
    xl:   { size: '22px', leading: '30px' },
    '2xl':{ size: '28px', leading: '36px' },
    '3xl':{ size: '36px', leading: '44px' },
  },
} as const;

export const motion = {
  easing: {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  },
  duration: {
    fast: '120ms',
    base: '200ms',
    slow: '320ms',
  },
} as const;

export const tokens = {
  colors,
  spacing,
  radii,
  shadows,
  typography,
  motion,
} as const;

export type Tokens = typeof tokens;
export default tokens;
