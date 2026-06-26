# Pilates Explained MVP4

Static launch build for `pilatesexplained.com`.

The site is plain HTML/CSS/JS, so it can be deployed on Netlify without a build pipeline. It includes a homepage, About page, Privacy page, article hub, 16 articles, brand SVGs, sitemap, robots file, video/audio assets, a Classical / Modern / Lagree comparison section, MailerLite-powered starter-guide email forms, and a branded PDF starter decision guide download.

## Files

- `index.html` - homepage with story, media, visual dossier, equipment, comparison table, timeline, articles, source library, studio discovery, and MailerLite starter-guide form.
- `about.html` - project rationale and editorial positioning.
- `articles/` - article hub plus 16 article pages, including the three-part Classical / Modern / Lagree comparison series.
- `assets/brand/` - Pilates Explained logo, mark, and banner.
- `assets/downloads/pilates-starter-decision-guide.pdf` - current branded PDF decision guide.
- `scripts/generate_decision_guide_pdf.py` - reproducible source for regenerating the PDF guide.
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

## Regenerate the PDF guide

```bash
python3 scripts/generate_decision_guide_pdf.py
```

The script writes the live download to `assets/downloads/pilates-starter-decision-guide.pdf` and a review copy to `output/pdf/pilates-starter-decision-guide.pdf`.

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
5. Confirm the MailerLite starter-guide form is active and the success message links to the PDF guide.
6. Update `privacy.html` after adding analytics or affiliate links.
7. Add affiliate disclosure language before using monetized ClassPass links.
8. Replace or add MailerLite embeds if a redesigned form or landing flow is created.

## Current brand implementation

- Preserve the live hero and article-first layout as the visual source of truth.
- Use the `--pe-*` CSS variables from the brand guideline for new components.
- Treat purple as the monetization / lead-generation accent and teal as the editorial / service accent.
- Keep studio discovery neutral: link to search or directory tools, not named studios.
- Use the comparison table as an educational aid. Do not rank methods or conflate Lagree with Pilates lineage.
