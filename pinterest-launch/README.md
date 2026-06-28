# Pinterest Organic Launch Staging

Staged for Pilates Explained. No Pinterest account creation, billing setup, live API writes, or Standard API review steps were performed.

## Human blockers

- Create or confirm the Pinterest Business account under the public identity `Pilates Explained`.
- Complete any required Pinterest billing/account setup.
- Deploy the updated `index.html`, then click `Continue` in Pinterest's domain-claim flow.
- Generate a Pinterest API token and export it as `PINTEREST_TOKEN` before any live run.
- Complete Pinterest Standard API access review, including the required demo video for board and pin creation.

## Domain verification

The homepage `<head>` now includes:

```html
<meta name="p:domain_verify" content="062a3debd7997a1369a35d6922d2d537" />
```

The Pinterest Business Hub supplied this token on June 27, 2026:

```html
<meta name="p:domain_verify" content="062a3debd7997a1369a35d6922d2d537" />
```

Alternative DNS TXT value if you prefer Namecheap DNS verification:

```text
pinterest-site-verification=062a3debd7997a1369a35d6922d2d537
```

The repo now uses the meta-tag method. Deploy the site before asking Pinterest to verify the domain.

## Rich Pins audit

All audited pages include `og:title`, `og:description`, and `og:image`. No Open Graph patches were required beyond adding the Pinterest verification placeholder.

| page | og:title | og:description | og:image | status |
| --- | --- | --- | --- | --- |
| index.html#newsletter | yes | yes | yes | ok |
| articles/clara-pilates-untold-partner.html | yes | yes | yes | ok |
| articles/classical-modern-lagree-how-to-choose.html | yes | yes | yes | ok |
| articles/classical-vs-contemporary-pilates.html | yes | yes | yes | ok |
| articles/classical-vs-modern-pilates-explained.html | yes | yes | yes | ok |
| articles/history-of-the-cadillac.html | yes | yes | yes | ok |
| articles/history-of-the-reformer.html | yes | yes | yes | ok |
| articles/history-of-the-wunda-chair.html | yes | yes | yes | ok |
| articles/pilates-and-dance-history.html | yes | yes | yes | ok |
| articles/pilates-and-lower-back-pain-evidence.html | yes | yes | yes | ok |
| articles/pilates-barrels-and-spinal-decompression.html | yes | yes | yes | ok |
| articles/pilates-elders-lineage.html | yes | yes | yes | ok |
| articles/pilates-prison-camp-origins.html | yes | yes | yes | ok |
| articles/pilates-vs-yoga-history-of-two-parallel-methods.html | yes | yes | yes | ok |
| articles/what-happens-first-pilates-class.html | yes | yes | yes | ok |
| articles/what-is-contrology.html | yes | yes | yes | ok |
| articles/what-is-lagree-not-pilates.html | yes | yes | yes | ok |
| articles/who-was-joseph-pilates.html | yes | yes | yes | ok |
| articles/why-springs-not-weights.html | yes | yes | yes | ok |
| articles/your-health-1934-joseph-pilates-first-book.html | yes | yes | yes | ok |

## UTM destination map

- Markdown table: `pinterest-launch/utm_destination_map.md`
- JSON: `pinterest-launch/utm_destination_map.json`

All destinations use `utm_source=pinterest`, `utm_medium=organic`, `utm_campaign=launch_2026`, and page-specific `utm_content` values. No pin routes to the inactive class-finder placeholder.

## Pins manifest

Manifest: `pins_manifest.csv`

- Guide/lead-magnet pins use `color_token=purple` for the commercial CTA color `#6B4E8B`.
- Editorial blog-post pins use `color_token=teal`.
- Lagree copy is framed as a separate proprietary system, not Pilates.
- Source images are existing site assets.

## API script

Dry run, no writes:

```bash
node push_pins.js
```

Limit dry run:

```bash
node push_pins.js --limit 5
```

Live run after Standard API access and token setup:

```bash
PINTEREST_TOKEN=... node push_pins.js --live
```

The script creates missing boards, skips duplicates by board/title/destination and local state, and stores created pin IDs in `.pinterest-pins-state.json`.
