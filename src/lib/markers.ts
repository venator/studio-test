// Tap-to-edit markers (§A10.10). Every section root carries `sectionAttrs`,
// every editable text element `field(...)`, every collection item `entry(...)`.
// Kit CI checks that themes keep them.

import type { Section } from "./site";

export function sectionAttrs(section: Section, extraClass = "") {
  return {
    id: section.anchor || undefined,
    class: ["section", `section--${section.type}`, section.variant ? `section--${section.variant}` : "", extraClass]
      .filter(Boolean)
      .join(" "),
    "data-section-id": section.id,
    "data-section-type": section.type,
    ...(section.variant ? { "data-variant": section.variant } : {}),
  };
}

export const field = (name: string) => ({ "data-field": name });
export const entry = (ref: string) => ({ "data-entry": ref });
