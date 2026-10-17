import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { config } from "./config.mjs";
import { renderPage } from "./src/layout.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, "src", "pages");
const DIST = path.join(ROOT, "dist");
const PUBLIC = path.join(ROOT, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".xml": "text/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: m[2] };
}

function walk(dir, base = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full, rel));
    else if (e.name.endsWith(".html")) out.push(rel);
  }
  return out;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function pageUrl(slug) {
  return slug === "index" ? `${config.siteUrl}/` : `${config.siteUrl}/${slug}/`;
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  if (fs.existsSync(PUBLIC)) copyDir(PUBLIC, DIST);

  const pages = [];
  for (const rel of walk(SRC)) {
    const raw = fs.readFileSync(path.join(SRC, rel), "utf8");
    const { meta, body } = parseFrontMatter(raw);
    const slug = (meta.slug || rel.replace(/\.html$/, "")).replace(/\\/g, "/");
    const html = renderPage({ ...meta, body, slug });
    const outDir = slug === "index" ? DIST : path.join(DIST, slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html);
    pages.push({ slug, ...meta });
  }
  pages.sort((a, b) => a.slug.localeCompare(b.slug));

  // sitemap.xml
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => p.noindex !== "true")
    .map((p) => {
      const pr = p.priority || (p.slug === "index" ? "1.0" : "0.7");
      return `  <url><loc>${pageUrl(p.slug)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${pr}</priority></url>`;
    })
    .join("\n");
  fs.writeFileSync(
    path.join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );

  // robots.txt
  fs.writeFileSync(
    path.join(DIST, "robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /404/\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`
  );

  // ads.txt (AdSense authorization file)
  if (config.adsensePubId) {
    const pub = config.adsensePubId.replace(/^ca-/, "");
    fs.writeFileSync(
      path.join(DIST, "ads.txt"),
      `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    );
  }

  const count = pages.length;
  console.log(`Built ${count} pages into dist/`);
  if (!config.adsensePubId) console.log("Note: adsensePubId is empty in config.mjs, AdSense loader and ads.txt skipped.");
  if (config.siteUrl.includes("example.com")) console.log("Note: set your real domain in config.mjs before deploying.");
  return pages;
}

function serve() {
  const port = Number(process.env.PORT || 4173);
  http
    .createServer((req, res) => {
      try {
        let p = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
        if (p.endsWith("/")) p += "index.html";
        let file = path.join(DIST, p);
        if (!file.startsWith(DIST)) throw new Error("forbidden");
        if (!fs.existsSync(file)) {
          // pretty URL fallback: /emi-calculator -> /emi-calculator/index.html
          const alt = path.join(DIST, p.replace(/\/$/, ""), "index.html");
          if (fs.existsSync(alt)) file = alt;
          else if (!path.extname(p)) file = path.join(DIST, "404", "index.html");
        }
        if (!fs.existsSync(file)) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("404");
        }
        const body = fs.readFileSync(file);
        res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
        res.end(body);
      } catch (e) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 " + e.message);
      }
    })
    .listen(port, () => console.log(`Serving dist/ at http://localhost:${port}`));
}

if (process.argv.includes("--serve")) {
  build();
  serve();
} else {
  build();
}
