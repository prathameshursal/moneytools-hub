# MoneyTools Hub

Free, privacy-first money calculators and plain-English guides for India. Static site: no frameworks, no backend, no tracking of calculator inputs.

## Quick start

```
npm run build      # build site into dist/
npm run dev        # build + serve at http://localhost:4173
```

Requires Node 18+.

## Structure

```
config.mjs           # site name, domain, AdSense pub ID, GA id - EDIT THIS
build.mjs            # zero-dependency static site generator + dev server
src/layout.mjs       # page shell: header, footer, meta
src/partials.mjs     # shared head/foot helpers, ad slot helper
src/pages/*.html     # content pages with front matter (title, slug, script, ...)
public/assets/       # styles.css, app.js, one JS file per calculator
public/favicon.svg
dist/                # build output (deploy this folder)
```

## Adding a page

1. Create `src/pages/my-page.html` with front matter:
   `---\nslug: my-page\ntitle: Page Title\ndescription: Meta description.\n---`
2. Add HTML content below the front matter.
3. Rebuild. The sitemap, canonical URLs, and nav update automatically.

## AdSense setup

1. Get approved: deploy the site, verify with your real domain in `config.mjs`, then apply at adsense.google.com.
2. Once approved, set `adsensePubId: "ca-pub-XXXXXXXXXXXXXXXX"` in `config.mjs`.
   This injects the AdSense loader into every page and generates `ads.txt`.
3. Create display ad units in AdSense and place them with the `adSlot("SLOT_ID")`
   helper from `src/partials.mjs`, or just enable Auto Ads.
4. For EEA/UK traffic, enable a Google-certified Consent Management Platform in
   AdSense (Privacy & messaging) before serving personalised ads.

## Deploy (Cloudflare Pages, free)

1. Push this repo to GitHub.
2. Cloudflare dashboard: Workers & Pages → Create → Pages → Connect to Git.
3. Build command: `npm run build`, output dir: `dist`.
4. Add your custom domain in Pages settings; DNS is automatic on Cloudflare.

Any static host works (Netlify, Vercel, GitHub Pages, S3).

## Disclaimer

All calculators are illustrative and not financial, tax, legal, or medical advice.
