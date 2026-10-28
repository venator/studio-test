import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getSite, pagePath, splitId } from "../lib/site";

const xmlEscape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export const GET: APIRoute = async () => {
  const site = await getSite();
  const def = site.locales[0]!;
  const base = site.siteUrl?.replace(/\/$/, "");
  const pages = await getCollection("pages");
  const posts = await getCollection("posts");
  const paths = base
    ? [
        ...pages.map((p) => pagePath(splitId(p.id).locale, def, p.data.slug)),
        ...posts.map((p) => pagePath(splitId(p.id).locale, def, `posts/${splitId(p.id).slug}`)),
      ]
    : [];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    paths.map((p) => `  <url><loc>${xmlEscape(`${base}${p}`)}</loc></url>`).join("\n") +
    `\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
