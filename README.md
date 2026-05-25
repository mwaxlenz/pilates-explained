# Pilates Explained MVP4

Static launch build for `pilatesexplained.com`.

The site is plain HTML/CSS/JS, so it can be deployed on Netlify without a build pipeline. It includes a homepage, About page, Privacy page, article hub, 13 launch articles, brand SVGs, sitemap, robots file, video/audio assets, a Classical / Modern / Lagree comparison section, and Kit-powered starter-guide email forms.

## Files

- `index.html` - homepage with story, media, visual dossier, equipment, comparison table, timeline, articles, source library, studio discovery, and Kit form.
- `about.html` - project rationale and editorial positioning.
- `articles/` - article hub plus 13 launch article pages.
- `assets/brand/` - Pilates Explained logo, mark, and banner.
- `privacy.html` - simple pre-launch privacy policy.
- `404.html`, `robots.txt`, `sitemap.xml` - launch support files.
- `netlify.toml` - static hosting configuration for Netlify.

## Run locally

Open `index.html` directly in a browser, or run:

```bash
cd "/Users/mwaxlenzhome/Documents/New project/pilates-explained-mvp4"
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Netlify settings

If this folder is the repository root:

- Build command: leave blank
- Publish directory: `.`

If the repository contains several project folders and this is a subfolder:

- Base directory: `pilates-explained-mvp4`
- Build command: leave blank
- Publish directory: `.`

## Pre-launch checklist

1. Buy the correct domain: `pilatesexplained.com`.
2. Do not buy Namecheap hosting, WordPress hosting, business email, or PremiumDNS for this Netlify launch.
3. Connect the GitHub repository to Netlify.
4. Add `pilatesexplained.com` and `www.pilatesexplained.com` in Netlify domain management.
5. Confirm the Kit starter-guide form and incentive email are active.
6. Update `privacy.html` after adding analytics or affiliate links.
7. Add affiliate disclosure language before using monetized ClassPass links.
8. Replace the Kit embed if a redesigned form or landing flow is created.

## Current brand implementation

- Preserve the live hero and article-first layout as the visual source of truth.
- Use the `--pe-*` CSS variables from the brand guideline for new components.
- Treat purple as the monetization / lead-generation accent and teal as the editorial / service accent.
- Keep studio discovery neutral: link to search or directory tools, not named studios.
- Use the comparison table as an educational aid. Do not rank methods or conflate Lagree with Pilates lineage.
