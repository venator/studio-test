// Website configuration. Generated sites keep this file as shipped by the kit:
// languages and the site address come from src/content/settings/site.yml, so
// adding a language is a content change, not a configuration change.
import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import { parse } from "yaml";

const site = parse(readFileSync(new URL("./src/content/settings/site.yml", import.meta.url), "utf8"));
const locales = site.locales;

export default defineConfig({
  site: site.siteUrl || undefined,
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  i18n: {
    locales,
    defaultLocale: locales[0],
    routing: { prefixDefaultLocale: false },
  },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
  devToolbar: { enabled: false },
  // Caches live in the project: node_modules is a read-only closure in the
  // studio's workers (§A10.4).
  cacheDir: "./.astro/cache",
  vite: { cacheDir: "./.astro/vite" },
});
