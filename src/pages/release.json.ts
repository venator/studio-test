import type { APIRoute } from "astro";

// Release marker (§A10.7): the publisher confirms a deployment by fetching it
// from the live site. Values are injected at build time by the studio.
export const GET: APIRoute = () =>
  new Response(
    `${JSON.stringify({
      commit: process.env.STUDIO_RELEASE_COMMIT ?? "unreleased",
      build: process.env.STUDIO_BUILD_ID ?? "local",
      kit: process.env.STUDIO_KIT_VERSION ?? "unknown",
    })}\n`,
    { headers: { "Content-Type": "application/json" } },
  );
