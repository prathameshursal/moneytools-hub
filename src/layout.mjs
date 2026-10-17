import { config } from "../config.mjs";
import { head, navHtml, footerHtml, adSlot } from "./partials.mjs";

export function renderPage(meta) {
  const { title, body, slug, schemaType, published, updated } = meta;
  const isHome = slug === "index";
  const crumbs = meta.crumbs
    ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${meta.crumbs
        .split("|")
        .map((c) => {
          const [href, label] = c.split("::");
          return href ? ` <span>›</span> <a href="${href}">${label}</a>` : ` <span>›</span> <span>${label}</span>`;
        })
        .join("")}</nav>`
    : "";

  const byline = updated
    ? `<div class="byline">Updated ${updated} · ${config.author} · Information only, not financial advice</div>`
    : "";

  const articleSchema =
    schemaType === "Article" && published
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          datePublished: published,
          dateModified: updated || published,
          author: { "@type": "Organization", name: config.author },
          publisher: { "@type": "Organization", name: config.siteName },
          mainEntityOfPage: `${config.siteUrl}/${slug}/`,
        }
      : null;

  const toolSchema =
    meta.script && !meta.schema
      ? {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: title,
          description: meta.description || "",
          url: `${config.siteUrl}/${slug}/`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        }
      : null;

  // FAQPage schema from <details><summary>Q</summary>... blocks in the body.
  let faqSchema = null;
  const faqs = [...String(body).matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)]
    .map((m) => ({
      q: m[1].replace(/<[^>]+>/g, "").trim(),
      a: m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
    }))
    .filter((f) => f.q && f.a)
    .slice(0, 10);
  if (faqs.length >= 2) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
  }

  const metaWithSchema = { ...meta, schema: meta.schema || articleSchema || toolSchema };
  const faqJson = faqSchema
    ? `<script type="application/ld+json">${JSON.stringify(faqSchema).replaceAll("<", "\\u003c")}</script>`
    : "";

  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
${head(metaWithSchema)}
${faqJson}
</head>
<body>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="/"><span class="brand-mark">₹</span> ${config.siteName}</a>
      <button class="menu-btn" id="menuBtn" aria-label="Menu">☰</button>
      <nav class="site-nav" id="siteNav">
      ${navHtml(slug)}
      </nav>
    </div>
  </header>
  <main class="container">
    ${crumbs}
    ${isHome ? body : `<article class="page">${body}</article>`}
  </main>
  <footer class="site-footer">
${footerHtml()}
  </footer>
  <script src="/assets/app.js" defer></script>
  ${meta.script ? `<script src="${meta.script}" defer></script>` : ""}
</body>
</html>`;
}
