// Content access shared by routes, layouts and section components.
// Themes receive everything through `SectionContext`; they never query
// collections themselves.

import type { ImageMetadata } from "astro";
import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import { escapeHtml, markPlaceholders, renderMarkdown } from "./text";

export type Site = CollectionEntry<"site">["data"];
export type Strings = CollectionEntry<"strings">["data"];
export type Page = CollectionEntry<"pages">["data"];
export type Section = Page["sections"][number];
export type SectionOf<T extends Section["type"]> = Extract<Section, { type: T }>;

export type ItemCollection = "services" | "testimonials" | "team" | "gallery" | "faqs";

export interface ResolvedItem<C extends ItemCollection> {
  /** Slug, identical across locales. */
  slug: string;
  /** `collection/slug`, used for the `data-entry` marker (§A10.10). */
  entry: string;
  data: CollectionEntry<C>["data"];
}

export async function getSite(): Promise<Site> {
  const entry = await getEntry("site", "site");
  if (!entry) throw new Error("Missing src/content/settings/site.yml");
  return entry.data;
}

export async function getStrings(locale: string): Promise<Strings> {
  const entry = await getEntry("strings", `${locale}/strings`);
  return entry?.data ?? {};
}

/** Locale and slug encoded in an entry id such as `fr/home`. */
export function splitId(id: string): { locale: string; slug: string } {
  const i = id.indexOf("/");
  return { locale: id.slice(0, i), slug: id.slice(i + 1) };
}

/** URL path of a page: default locale at the root, others under `/<locale>/`. */
export function pagePath(locale: string, defaultLocale: string, slug: string | null | undefined): string {
  const parts = [locale === defaultLocale ? "" : locale, slug ?? ""].filter((p) => p !== "");
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${parts.map((p) => `${p}/`).join("")}`;
}

export async function pagesIn(locale: string) {
  const pages = await getCollection("pages", (e) => splitId(e.id).locale === locale);
  return pages.sort((a, b) => (a.data.menuOrder ?? 999) - (b.data.menuOrder ?? 999));
}

/** Entries of an item collection in a locale, optionally restricted to slugs, in display order. */
export async function itemsIn<C extends ItemCollection>(
  collection: C,
  locale: string,
  slugs?: readonly string[] | null,
): Promise<ResolvedItem<C>[]> {
  const entries = (await getCollection(collection)) as CollectionEntry<C>[];
  const inLocale = entries
    .map((e) => ({ ...splitId(e.id), data: e.data }))
    .filter((e) => e.locale === locale);
  const resolved = inLocale.map((e) => ({ slug: e.slug, entry: `${collection}/${e.slug}`, data: e.data }));
  if (slugs && slugs.length > 0) {
    return slugs.flatMap((s) => resolved.filter((r) => r.slug === s));
  }
  const order = (d: unknown) => (d as { order?: number | null }).order ?? 999;
  return resolved.sort((a, b) => order(a.data) - order(b.data) || a.slug.localeCompare(b.slug));
}

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/**/*.{jpg,jpeg,png,webp,avif,gif,svg}",
  { eager: true },
);

/** Resolve an image path such as `images/front.jpg`; undefined if missing (check 7 reports it). */
export function resolveImage(src: string | null | undefined): ImageMetadata | undefined {
  if (!src) return undefined;
  return images[`/src/assets/${src.replace(/^\/+/, "")}`]?.default;
}

/** Everything a section component may use. */
export interface SectionContext {
  locale: string;
  defaultLocale: string;
  /** Heading element for the section's heading: h1 for a page's first section, h2 otherwise. */
  headingTag: "h1" | "h2";
  /** Heading element for items inside the section (card titles): one level below headingTag. */
  subheadingTag: "h2" | "h3";
  site: Site;
  strings: Strings;
  /** Plain text with `[[needs: …]]` placeholders made visible, as HTML. */
  text: (s: string | null | undefined) => string;
  /** Markdown rendered to HTML (raw HTML escaped), placeholders visible. */
  markdown: (s: string | null | undefined) => string;
  resolveImage: typeof resolveImage;
  items: <C extends ItemCollection>(collection: C, slugs?: readonly string[] | null) => Promise<ResolvedItem<C>[]>;
  href: (h: string) => string;
}

export function sectionContext(locale: string, defaultLocale: string, site: Site, strings: Strings): SectionContext {
  return {
    locale,
    defaultLocale,
    headingTag: "h2",
    subheadingTag: "h3",
    site,
    strings,
    text: (s) => markPlaceholders(escapeHtml(s ?? "")),
    markdown: (s) => markPlaceholders(renderMarkdown(s ?? "")),
    resolveImage,
    items: (collection, slugs) => itemsIn(collection, locale, slugs),
    href: (h) => (h.startsWith("/") ? `${import.meta.env.BASE_URL.replace(/\/$/, "")}${h}` : h),
  };
}
