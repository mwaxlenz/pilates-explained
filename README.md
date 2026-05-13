# Pilates Explained MVP4

Static launch build for `pilatesexplained.com`.

The site is plain HTML/CSS/JS, so it can be deployed on Netlify without a build pipeline. It includes a homepage, About page, Privacy page, article hub, 13 launch articles, brand SVGs, sitemap, robots file, video/audio assets, and a prototype starter-guide email form.

## Files

- `index.html` - homepage with story, timeline, equipment, media, starter-guide CTA, newsletter prototype, and sources.
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
5. Connect the starter-guide form to Kit before public traffic.
6. Update `privacy.html` after adding Kit, analytics, or affiliate links.
7. Add affiliate disclosure language before using monetized ClassPass links.
8. Replace any prototype-only email confirmation behavior once the Kit form is embedded.

