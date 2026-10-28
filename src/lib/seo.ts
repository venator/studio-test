// Structured data generated from settings, which hold confirmed facts.

import { DAY_KEYS } from "./labels";
import type { Site } from "./site";

const SCHEMA_DAYS: Record<(typeof DAY_KEYS)[number], string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const RANGE = /(\d{1,2})[:h](\d{2})\s*[–—-]\s*(\d{1,2})[:h](\d{2})/g;
const pad = (n: string) => n.padStart(2, "0");

/** Opening-hours ranges in a day's text, e.g. "09:00–12:00, 14:00–18:00". */
export function parseRanges(text: string): Array<{ opens: string; closes: string }> {
  return [...text.matchAll(RANGE)].map((m) => ({
    opens: `${pad(m[1]!)}:${m[2]}`,
    closes: `${pad(m[3]!)}:${m[4]}`,
  }));
}

const isPlaceholder = (s: string | null | undefined) => !s || s.includes("[[needs:");

export function localBusinessJsonLd(site: Site, url: string | undefined, logoUrl: string | undefined): object {
  const c = site.contact;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.businessName,
  };
  if (url) data.url = url;
  if (logoUrl) data.logo = logoUrl;
  if (c.phone && !isPlaceholder(c.phone)) data.telephone = c.phone;
  if (c.email && !isPlaceholder(c.email)) data.email = c.email;
  if (c.address && !isPlaceholder(c.address.street)) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: c.address.street,
      postalCode: c.address.postalCode,
      addressLocality: c.address.city,
      addressCountry: c.address.country,
    };
  }
  if (c.coordinates) {
    data.geo = { "@type": "GeoCoordinates", latitude: c.coordinates.lat, longitude: c.coordinates.lng };
  }
  if (site.hours) {
    const specs = DAY_KEYS.flatMap((d) =>
      parseRanges(site.hours?.[d] ?? "").map((r) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: SCHEMA_DAYS[d],
        opens: r.opens,
        closes: r.closes,
      })),
    );
    if (specs.length > 0) data.openingHoursSpecification = specs;
  }
  const same = (site.socials ?? []).map((s) => s.url).filter((u) => !isPlaceholder(u));
  if (same.length > 0) data.sameAs = same;
  return data;
}

/** JSON for a <script type="application/ld+json"> block, safe against `</script>`. */
export function jsonLdText(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
