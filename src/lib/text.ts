// Text rendering. Owner and agent text is never trusted as HTML: plain text is
// escaped, and Markdown is rendered with raw HTML escaped.

import { Marked } from "marked";

const PLACEHOLDER = /\[\[needs:\s*([^\]]*?)\s*\]\]/g;

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Make `[[needs: …]]` placeholders visible in previews (§B3); publishing is blocked by check 6. */
export function markPlaceholders(html: string): string {
  return html.replace(
    PLACEHOLDER,
    (_m, what: string) => `<mark class="placeholder" data-placeholder>Missing: ${what}</mark>`,
  );
}

/** Links allowed in content: site paths, anchors, http(s), mailto and tel. */
export function safeHref(href: string): string | undefined {
  const h = href.trim();
  if (/^(https?:|mailto:|tel:)/i.test(h) || h.startsWith("/") || h.startsWith("#")) return h;
  return undefined;
}

const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      const safe = safeHref(href);
      if (!safe) return inner;
      const t = title ? ` title="${escapeHtml(title)}"` : "";
      return `<a href="${escapeHtml(safe)}"${t}>${inner}</a>`;
    },
    // Images belong in image fields (processed, with alt text checked); inline
    // Markdown images would bypass that and could load external files.
    image({ text }) {
      return escapeHtml(text);
    },
  },
});

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

export function hasPlaceholder(s: string): boolean {
  return new RegExp(PLACEHOLDER.source).test(s);
}
