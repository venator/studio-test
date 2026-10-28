// Design tokens (§B3) → CSS custom properties. Themes declare defaults in
// theme.json; the site's settings override them. Theme CSS reads only these
// variables, never hard-coded colors or font families (§B4).

import type { Site } from "./site";

type Tokens = NonNullable<NonNullable<Site["theme"]>["tokens"]>;

interface ThemeJson {
  id?: string;
  tokens?: Tokens;
}

const themeJson = import.meta.glob<{ default: ThemeJson }>("/src/theme/theme.json", { eager: true });
const theme: ThemeJson = Object.values(themeJson)[0]?.default ?? {};

const BASE: Required<{ [K in keyof Tokens]-?: NonNullable<Tokens[K]> }> = {
  colors: {
    background: "#ffffff",
    surface: "#f4f4f2",
    text: "#1d1d1b",
    muted: "#5c5c58",
    primary: "#1f4e79",
    onPrimary: "#ffffff",
    accent: "#b85c38",
  },
  typography: {
    display: "system-ui, sans-serif",
    body: "system-ui, sans-serif",
    scale: 1.25,
    baseSize: 17,
  },
  radius: "small",
  density: "regular",
  imagery: "plain",
  motion: "subtle",
};

const RADIUS = { none: "0", small: "4px", medium: "10px", large: "20px" } as const;
const DENSITY = { compact: "0.85", regular: "1", airy: "1.3" } as const;

type Defined<T> = { [K in keyof T]-?: NonNullable<T[K]> };

function clean<T extends object>(o: T | null | undefined): Partial<Defined<T>> {
  if (!o) return {};
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined && v !== "")) as Partial<
    Defined<T>
  >;
}

type Colors = Defined<NonNullable<Tokens["colors"]>>;
type Typography = Defined<NonNullable<Tokens["typography"]>>;

export function resolveTokens(site: Site) {
  const s = site.theme?.tokens ?? {};
  const t = theme.tokens ?? {};
  return {
    colors: { ...(BASE.colors as Colors), ...clean(t.colors), ...clean(s.colors) } as Colors,
    typography: { ...(BASE.typography as Typography), ...clean(t.typography), ...clean(s.typography) } as Typography,
    radius: s.radius ?? t.radius ?? BASE.radius,
    density: s.density ?? t.density ?? BASE.density,
    imagery: s.imagery ?? t.imagery ?? BASE.imagery,
    motion: s.motion ?? t.motion ?? BASE.motion,
  };
}

const cssValue = (v: string | number) => String(v).replace(/[;{}<>]/g, "");

export function tokensCss(site: Site): string {
  const r = resolveTokens(site);
  const c = r.colors;
  const ty = r.typography;
  const vars: Record<string, string | number> = {
    "--color-background": c.background,
    "--color-surface": c.surface,
    "--color-text": c.text,
    "--color-muted": c.muted,
    "--color-primary": c.primary,
    "--color-on-primary": c.onPrimary,
    "--color-accent": c.accent,
    "--font-display": ty.display,
    "--font-body": ty.body,
    "--type-scale": ty.scale,
    "--type-base": `${ty.baseSize}px`,
    "--radius": RADIUS[r.radius],
    "--image-radius": r.imagery === "rounded" ? RADIUS.large : r.imagery === "plain" ? "0" : RADIUS[r.radius],
    "--density": DENSITY[r.density],
  };
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${cssValue(v)};`)
    .join("\n");
  return `:root {\n${body}\n}\n`;
}

export function rootAttributes(site: Site) {
  const r = resolveTokens(site);
  return { "data-motion": r.motion, "data-imagery": r.imagery, "data-density": r.density };
}
