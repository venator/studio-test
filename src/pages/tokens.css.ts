import type { APIRoute } from "astro";
import { getSite } from "../lib/site";
import { tokensCss } from "../lib/tokens";

// Served as a stylesheet so the CSP needs no inline styles.
export const GET: APIRoute = async () =>
  new Response(tokensCss(await getSite()), { headers: { "Content-Type": "text/css; charset=utf-8" } });
