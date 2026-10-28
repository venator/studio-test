# Website

This website is built with [Astro](https://astro.build) from the Website Studio
kit. It is a plain static site: you can build and host it without the studio.

## Build it yourself

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run build      # writes the site to dist/
npm run check      # type and content checks
npx astro preview  # serves dist/ locally
```

Upload the contents of `dist/` to any static host.

## Where things are

- `src/content/settings/site.yml` — business details, languages, theme and design choices
- `src/content/settings/<language>/strings.yml` — tagline, footer text, search engine defaults
- `src/content/pages/<language>/` — one file per page, each a list of sections
- `src/content/services/`, `testimonials/`, `team/`, `gallery/`, `faqs/`, `posts/` — collections, one folder per language
- `src/assets/images/` — photos; content refers to them as `images/<file>`
- `src/theme/` — the chosen theme, kept as shipped
- `src/overrides/` — changes to the theme for this site only
- `public/admin/` — the content editor (Sveltia CMS)

Files marked "GENERATED" (`src/content.schema.ts`, `src/content.config.ts`,
`public/admin/config.yml`) come from the kit's content model; regenerate them
rather than editing them.

## Section contract (for themes)

A section component lives at `sections/<type>.astro` in a theme
(`src/theme/`) or in `src/overrides/`, and receives two props:

- `section` — the section's content, typed by `SectionOf<"<type>">` from `src/lib/site.ts`
- `ctx` — a `SectionContext`: locale, `headingTag` (render the section heading
  with it: `h1` for a page's first section; `subheadingTag` for titles inside the
  section), site settings, strings, `text()` and
  `markdown()` (escaped HTML with visible placeholders), `resolveImage()`,
  `items()` for collection entries, and `href()` for site links

Every section root spreads `sectionAttrs(section)`, every editable text element
carries `field("<name>")`, and every collection item `entry(item.entry)` (from
`src/lib/markers.ts`). These markers power tap-to-edit in the studio.

A theme may also provide `Layout.astro`, stylesheets in `styles/` (bundled
automatically) and `theme.json` with token defaults. Colors and fonts come only
from the CSS variables in `/tokens.css`.
