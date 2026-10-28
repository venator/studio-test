import type { APIRoute } from "astro";
import { getSite } from "../lib/site";

export const GET: APIRoute = async () => {
  const site = await getSite();
  const base = site.siteUrl?.replace(/\/$/, "");
  const lines = ["User-agent: *", "Allow: /", "Disallow: /admin/", ...(base ? [`Sitemap: ${base}/sitemap.xml`] : [])];
  return new Response(`${lines.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
