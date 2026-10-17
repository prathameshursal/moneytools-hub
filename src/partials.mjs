import { config } from "../config.mjs";

const AMP = String.fromCharCode(38); // & -- built this way so the file never needs HTML entity text
export const esc = (s) =>
  String(s ?? "")
    .replaceAll(AMP, AMP + "amp;")
    .replaceAll("<", AMP + "lt;")
    .replaceAll(">", AMP + "gt;")
    .replaceAll('"', AMP + "quot;");

export const pageUrl = (slug) =>
  slug === "index" ? `${config.siteUrl}/` : `${config.siteUrl}/${slug}/`;

export function adSlot(id, cls = "") {
  // AdSense display unit container. Auto ads handle most placements;
  // this block is for manually placed units once you have pub ID + ad slot IDs.
  if (!config.adsensePubId) return "";
  return `<div class="ad-block ${cls}">
  <ins class="adsbygoogle" style="display:block" data-ad-client="${config.adsensePubId}" data-ad-slot="${id}" data-ad-format="auto" data-full-width-responsive="true"></ins>
  <script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>
</div>`;
}

export function head(meta) {
  const title = meta.title ? `${meta.title} | ${config.siteName}` : `${config.siteName} — ${config.tagline}`;
  const desc = meta.description || config.tagline;
  const url = pageUrl(meta.slug);
  const img = `${config.siteUrl}/favicon.svg`;
  const type = meta.schemaType === "Article" ? "article" : "website";

  let ads = "";
  if (config.adsensePubId) {
    ads = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsensePubId}" crossorigin="anonymous"></script>`;
  }
  let ga = "";
  if (config.gaMeasurementId) {
    ga = `<script async src="https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${config.gaMeasurementId}');</script>`;
  }

  const schemaJson = meta.schema
    ? `<script type="application/ld+json">${JSON.stringify(meta.schema).replaceAll("<", "\\u003c")}</script>`
    : "";

  return `  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  ${meta.noindex === "true" ? `<meta name="robots" content="noindex, nofollow">` : `<link rel="canonical" href="${esc(url)}">`}
  <meta name="author" content="${esc(config.author)}">
  <meta property="og:site_name" content="${esc(config.siteName)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:image" content="${esc(img)}">
  <meta name="twitter:card" content="summary">
  ${config.twitter ? `<meta name="twitter:site" content="${esc(config.twitter)}">` : ""}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  ${ads}
  ${ga}
  ${schemaJson}`;
}

export function navHtml(active) {
  const items = [
    ["/", "Home"],
    ["/tools/", "Tools"],
    ["/guides/", "Guides"],
    ["/about/", "About"],
    ["/contact/", "Contact"],
  ];
  return items
    .map(([href, label]) => {
      const isActive =
        (href === "/" && active === "index") ||
        (href !== "/" && active === href.slice(1, -1));
      return `<a class="nav-link${isActive ? " active" : ""}" href="${href}">${label}</a>`;
    })
    .join("\n      ");
}

export function footerHtml() {
  return `    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">${esc(config.siteName)}</div>
        <p>${esc(config.tagline)}. All tools are free and run entirely in your browser.</p>
      </div>
      <div class="footer-col">
        <h4>Popular tools</h4>
        <a href="/emi-calculator/">EMI Calculator</a>
        <a href="/sip-calculator/">SIP Calculator</a>
        <a href="/gst-calculator/">GST Calculator</a>
        <a href="/income-tax-calculator/">Income Tax Calculator</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="/about/">About Us</a>
        <a href="/contact/">Contact</a>
        <a href="/privacy-policy/">Privacy Policy</a>
        <a href="/terms-and-conditions/">Terms & Conditions</a>
        <a href="/disclaimer/">Disclaimer</a>
      </div>
    </div>
    <div class="footer-bottom">© ${new Date().getFullYear()} ${esc(config.siteName)}. For information only, not financial advice.</div>`;
}
