import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const todayIso = "2026-06-12";
const todayDisplay = "June 12, 2026";
const siteUrl = "https://pilatesexplained.com";

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const write = (rel, value) => {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const stripTags = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
const wordCount = (html) => (stripTags(html).match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)?/g) || []).length;
const readTime = (html) => Math.max(1, Math.ceil(wordCount(html) / 225));

const articleFiles = fs
  .readdirSync(path.join(root, "articles"))
  .filter((file) => file.endsWith(".html") && file !== "index.html")
  .sort();

const articleMeta = new Map();
for (const file of articleFiles) {
  const rel = `articles/${file}`;
  const html = read(rel);
  const title = html.match(/<h1>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/\s+/g, " ").trim() || file.replace(".html", "");
  const desc = html.match(/<meta name="description" content="([^"]+)"/i)?.[1] || `${title} from Pilates Explained.`;
  const hero = html.match(/<header class="article-hero">[\s\S]*?<img src="([^"]+)"/i)?.[1] || "../assets/brand/site-banner.svg";
  const image = new URL(hero, `${siteUrl}/articles/`).href;
  articleMeta.set(file, {
    file,
    rel,
    url: `${siteUrl}/articles/${file}`,
    title,
    desc,
    image,
    minutes: readTime(html),
  });
}

const related = {
  "what-is-contrology.html": ["who-was-joseph-pilates.html", "pilates-prison-camp-origins.html", "your-health-1934-joseph-pilates-first-book.html"],
  "who-was-joseph-pilates.html": ["what-is-contrology.html", "clara-pilates-untold-partner.html", "pilates-prison-camp-origins.html"],
  "pilates-prison-camp-origins.html": ["who-was-joseph-pilates.html", "history-of-the-cadillac.html", "history-of-the-reformer.html"],
  "history-of-the-reformer.html": ["history-of-the-cadillac.html", "history-of-the-wunda-chair.html", "pilates-barrels-and-spinal-decompression.html"],
  "history-of-the-cadillac.html": ["history-of-the-reformer.html", "pilates-prison-camp-origins.html", "pilates-barrels-and-spinal-decompression.html"],
  "history-of-the-wunda-chair.html": ["history-of-the-reformer.html", "pilates-barrels-and-spinal-decompression.html", "classical-modern-lagree-how-to-choose.html"],
  "pilates-barrels-and-spinal-decompression.html": ["history-of-the-cadillac.html", "history-of-the-reformer.html", "history-of-the-wunda-chair.html"],
  "pilates-and-dance-history.html": ["pilates-elders-lineage.html", "clara-pilates-untold-partner.html", "classical-vs-contemporary-pilates.html"],
  "pilates-elders-lineage.html": ["clara-pilates-untold-partner.html", "classical-vs-contemporary-pilates.html", "classical-vs-modern-pilates-explained.html"],
  "classical-vs-contemporary-pilates.html": ["pilates-elders-lineage.html", "classical-vs-modern-pilates-explained.html", "classical-modern-lagree-how-to-choose.html"],
  "clara-pilates-untold-partner.html": ["who-was-joseph-pilates.html", "pilates-elders-lineage.html", "pilates-and-dance-history.html"],
  "your-health-1934-joseph-pilates-first-book.html": ["what-is-contrology.html", "who-was-joseph-pilates.html", "pilates-vs-yoga-history-of-two-parallel-methods.html"],
  "pilates-vs-yoga-history-of-two-parallel-methods.html": ["what-is-contrology.html", "classical-modern-lagree-how-to-choose.html", "classical-vs-modern-pilates-explained.html"],
  "classical-vs-modern-pilates-explained.html": ["classical-vs-contemporary-pilates.html", "what-is-lagree-not-pilates.html", "classical-modern-lagree-how-to-choose.html"],
  "what-is-lagree-not-pilates.html": ["classical-vs-modern-pilates-explained.html", "classical-modern-lagree-how-to-choose.html", "history-of-the-reformer.html"],
  "classical-modern-lagree-how-to-choose.html": ["classical-vs-modern-pilates-explained.html", "what-is-lagree-not-pilates.html", "history-of-the-reformer.html"],
};

const priorityFaqs = {
  "what-is-contrology.html": [
    ["Is Contrology the same as Pilates?", "Contrology was Joseph Pilates' name for the method. Pilates is the name most people use today, but Contrology points back to the original emphasis on concentration, breath, precision, and whole-body control."],
    ["Was Contrology only mat exercise?", "No. Mat work was central, but the larger method also included apparatus that used springs, straps, and support to teach the same movement principles."],
    ["Why does the old name matter?", "The old name helps explain that Pilates was designed as a disciplined movement system, not simply a collection of fitness exercises."],
  ],
  "who-was-joseph-pilates.html": [
    ["What was Joseph Pilates known for?", "Joseph Pilates was known as the founder of Contrology, the movement method now usually called Pilates, and as an inventor of spring-based exercise apparatus."],
    ["Did Clara Pilates help create the method?", "Clara Pilates was essential to the studio's teaching culture and continuity. Joseph is usually named as the founder, but Clara helped interpret and sustain the work for students."],
    ["Why did dancers become important to Pilates history?", "Dancers found value in a method that built strength, control, and recovery without sacrificing coordination or mobility, so they became an important transmission channel."],
  ],
  "pilates-prison-camp-origins.html": [
    ["Did Pilates begin in an internment camp?", "The internment period is central to the origin story because Joseph Pilates taught and refined movement ideas under wartime confinement. Later accounts connect that period to bed-based and spring-resistance experiments."],
    ["Is every part of the origin story proven?", "Not every detail is documented with equal strength. A careful history treats the camp story as influential and important while separating well-supported facts from later legend."],
    ["How did confinement shape the equipment?", "Constraint made support, resistance, and adaptation practical problems. Those ideas later became visible in equipment such as the Cadillac and Reformer."],
  ],
  "history-of-the-reformer.html": [
    ["Why is the Reformer so associated with Pilates?", "The Reformer turns spring resistance and a moving carriage into a clear physical expression of the method: support, feedback, alignment, and controlled effort."],
    ["Is a Reformer required for Pilates?", "No. Mat Pilates is part of the method and can be powerful on its own. The Reformer adds resistance and feedback, but it is not the only way to practice."],
    ["Is a home Reformer a beginner purchase?", "Usually not immediately. Most beginners should take instruction first, then decide whether the cost, space, and safety requirements make sense at home."],
  ],
  "classical-modern-lagree-how-to-choose.html": [
    ["Is Lagree a type of Pilates?", "Lagree is Pilates-adjacent, but it is a separate branded fitness method with its own equipment, pacing, and business model."],
    ["Should beginners choose classical or contemporary Pilates?", "Beginners can start with either. Classical work emphasizes a more inherited sequence, while contemporary studios often adapt the method for varied bodies, settings, and goals."],
    ["What is the easiest first step?", "Choose the setting you will actually attend: a beginner mat class, an introductory Reformer session, or a well-labeled online program with clear instruction."],
  ],
};

const apparatus = new Set([
  "history-of-the-reformer.html",
  "history-of-the-cadillac.html",
  "history-of-the-wunda-chair.html",
  "pilates-barrels-and-spinal-decompression.html",
]);

const lineageProduct = new Set([
  "pilates-elders-lineage.html",
  "clara-pilates-untold-partner.html",
  "classical-vs-modern-pilates-explained.html",
]);

const jsonScript = (data) => `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n    </script>`;

function setOrAddMeta(html, selector, tag) {
  const re = selector instanceof RegExp ? selector : new RegExp(selector, "i");
  if (re.test(html)) return html.replace(re, tag);
  return html.replace("    <link rel=\"icon\"", `    ${tag}\n    <link rel="icon"`);
}

function cleanHead(html) {
  return html.replace(/\n    <!-- PE_SCHEMA_START -->[\s\S]*?<!-- PE_SCHEMA_END -->/g, "");
}

function injectSchema(html, schemaBlocks) {
  const block = `\n    <!-- PE_SCHEMA_START -->\n    ${schemaBlocks.map(jsonScript).join("\n    ")}\n    <!-- PE_SCHEMA_END -->`;
  return cleanHead(html).replace("    <link rel=\"icon\"", `${block}\n    <link rel="icon"`);
}

function setCanonicalAndSocial(html, { canonical, title, desc, type, image }) {
  html = setOrAddMeta(html, /    <link rel="canonical" href="[^"]+">/i, `    <link rel="canonical" href="${canonical}">`);
  html = setOrAddMeta(html, /    <meta property="og:title" content="[^"]+">/i, `    <meta property="og:title" content="${escapeHtml(title)}">`);
  html = setOrAddMeta(html, /    <meta property="og:description" content="[^"]+">/i, `    <meta property="og:description" content="${escapeHtml(desc)}">`);
  html = setOrAddMeta(html, /    <meta property="og:type" content="[^"]+">/i, `    <meta property="og:type" content="${type}">`);
  html = setOrAddMeta(html, /    <meta property="og:image" content="[^"]+">/i, `    <meta property="og:image" content="${image}">`);
  html = setOrAddMeta(html, /    <meta name="twitter:card" content="[^"]+">/i, `    <meta name="twitter:card" content="summary_large_image">`);
  return html;
}

function footer(prefix = "") {
  return `<footer class="site-footer">
      <p>&copy; <span id="year"></span> Pilates Explained.</p>
      <nav class="footer-links" aria-label="Footer">
        <a href="${prefix}privacy.html">Privacy</a>
        <a href="${prefix}affiliate-disclosure/">Affiliate disclosure</a>
        <a href="${prefix}partners/">Partner with us</a>
        <a href="${prefix}teachers-guide/">For Teachers</a>
      </nav>
    </footer>`;
}

function scripts(prefix = "") {
  return `<script src="${prefix}assets/js/affiliates.js" defer></script>
    <script src="${prefix}assets/js/analytics.js" defer></script>
    <script src="${prefix}script.js" defer></script>`;
}

function replaceFooterAndScripts(html, prefix = "") {
  html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, footer(prefix));
  html = html.replace(/\n    <script src="(?:\.\.\/)?assets\/js\/affiliates\.js" defer><\/script>[\s\S]*?<script src="(?:\.\.\/)?script\.js" defer><\/script>/, "");
  html = html.replace(/\n    <script src="(?:\.\.\/)?script\.js"><\/script>/, "");
  html = html.replace(/\n    <script src="(?:\.\.\/)?script\.js" defer><\/script>/, "");
  html = html.replace(/\n  <\/body>/, `\n    ${scripts(prefix)}\n  </body>`);
  return html;
}

function updateNav(html, prefix = "") {
  const href = prefix ? "../guides/" : "guides/";
  if (!html.includes(">Guides</a>")) {
    html = html.replace(/(<a href="(?:\.\.\/)?articles\/index\.html">Articles<\/a>)/, `$1\n          <a href="${href}">Guides</a>`);
    html = html.replace(/(<a href="index\.html">Articles<\/a>)/, `$1\n          <a href="../guides/">Guides</a>`);
  }
  return html;
}

function page({ title, desc, canonical, prefix = "", mainClass = "", bodyAttrs = "", body = "", schema = [], extraScripts = "", ogType = "website", ogImage = `${siteUrl}/assets/brand/site-banner.svg` }) {
  const mainOpen = mainClass ? `<main id="main" class="${mainClass}">` : `<main id="main">`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(desc)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(desc)}">
    <meta property="og:type" content="${ogType}">
    <meta property="og:image" content="${ogImage}">
    <meta name="twitter:card" content="summary_large_image">
    ${schema.map(jsonScript).join("\n    ")}
    <link rel="icon" href="/assets/brand/logo-mark.svg" type="image/svg+xml">
    <link rel="stylesheet" href="${prefix}styles.css">
  </head>
  <body${bodyAttrs ? ` ${bodyAttrs}` : ""}>
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <nav class="nav" aria-label="Primary navigation">
        <a class="brand" href="${prefix}index.html">
          <span class="brand-mark" aria-hidden="true"></span><span>Pilates Explained</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu">
          <span class="sr-only">Open navigation</span>
          <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
        </button>
        <div class="nav-links" id="nav-menu">
          <a href="${prefix}index.html#story">Story</a>
          <a href="${prefix}articles/index.html">Articles</a>
          <a href="${prefix}guides/">Guides</a>
          <a href="${prefix}index.html#comparison">Compare</a>
          <a href="${prefix}about.html">About</a>
        </div>
      </nav>
    </header>

    ${mainOpen}
${body}
    </main>

    ${footer(prefix)}
    ${scripts(prefix)}
    ${extraScripts}
  </body>
</html>
`;
}

function disclosureBox() {
  return `<aside class="affiliate-disclosure-box" aria-label="Affiliate disclosure">
            <strong>Affiliate disclosure:</strong> Some links on this page are affiliate links. If you book a class or buy equipment through them, Pilates Explained earns a small commission at no extra cost to you. We only recommend what we'd use ourselves.
          </aside>`;
}

function affiliateLink(key, text, className = "button secondary") {
  return `<a class="${className}" href="#affiliate-link-pending" data-aff="${key}" data-affiliate-link target="_blank" rel="sponsored noopener">${text}</a>`;
}

function amazonLink(query, text) {
  return `<a class="button secondary" href="#affiliate-link-pending" data-aff="amazon" data-amazon-query="${escapeHtml(query)}" data-affiliate-link target="_blank" rel="sponsored noopener">${text}</a>`;
}

write(
  "assets/js/affiliates.js",
  `const AFFILIATES = {
  classpass: { url: "TODO_AFFILIATE_URL_CLASSPASS", label: "ClassPass", enabled: false },
  balancedbody: { url: "TODO_AFFILIATE_URL_BALANCEDBODY", label: "Balanced Body", enabled: false },
  merrithew: { url: "TODO_AFFILIATE_URL_MERRITHEW", label: "Merrithew / STOTT", enabled: false },
  pilatesanytime: { url: "TODO_AFFILIATE_URL_PILATESANYTIME", label: "Pilates Anytime", enabled: false },
  amazonTag: "TODO_AMAZON_ASSOCIATES_TAG",
  amazonBaseUrl: "https://www.amazon.com/s"
};

window.AFFILIATES = AFFILIATES;
`
);

write(
  "assets/js/analytics.js",
  `(() => {
  const MEASUREMENT_ID = "G-XXXXXXXXXX";
  const gaEnabled =
    MEASUREMENT_ID !== "G-XXXXXXXXXX" &&
    navigator.doNotTrack !== "1" &&
    window.doNotTrack !== "1";

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  if (gaEnabled) {
    const ga = document.createElement("script");
    ga.async = true;
    ga.src = \`https://www.googletagmanager.com/gtag/js?id=\${MEASUREMENT_ID}\`;
    document.head.appendChild(ga);
    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID);
  }

  window.PEAnalytics = {
    track(eventName, params = {}) {
      if (gaEnabled && typeof gtag === "function") {
        gtag("event", eventName, params);
      }
      document.dispatchEvent(new CustomEvent("pe:analytics", { detail: { eventName, params } }));
    },
  };

  const isTodo = (value) => !value || value.startsWith("TODO_") || value === "#affiliate-link-pending";

  function hydrateAffiliateLinks() {
    const config = window.AFFILIATES || {};
    document.querySelectorAll("[data-affiliate-link]").forEach((link) => {
      const program = link.getAttribute("data-aff");
      let url = "#affiliate-link-pending";
      if (program === "amazon") {
        const tag = config.amazonTag;
        const query = link.getAttribute("data-amazon-query") || "Pilates";
        if (tag && !isTodo(tag)) {
          const params = new URLSearchParams({ k: query, tag });
          url = \`\${config.amazonBaseUrl || "https://www.amazon.com/s"}?\${params.toString()}\`;
        }
      } else if (config[program]?.url && !isTodo(config[program].url)) {
        url = config[program].url;
      }

      link.href = url;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "sponsored noopener");

      if (url === "#affiliate-link-pending") {
        link.setAttribute("aria-disabled", "true");
        link.title = "Affiliate link pending operator setup";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    hydrateAffiliateLinks();

    const pageEvent = document.body.getAttribute("data-page-event");
    if (pageEvent) {
      window.PEAnalytics.track(pageEvent, { page_path: location.pathname });
    }

    if (document.body.matches("[data-product-page]")) {
      window.PEAnalytics.track("view_item", { item_name: "Pilates History for Teachers - The Sourcebook" });
    }
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const absolute = new URL(href, location.href);
    const program = link.getAttribute("data-aff");

    if (program) {
      window.PEAnalytics.track("affiliate_click", { program, page_path: location.pathname });
      if (href === "#affiliate-link-pending") {
        event.preventDefault();
      }
      return;
    }

    if (link.matches("[data-product-buy]")) {
      window.PEAnalytics.track("begin_checkout", { item_name: "Pilates History for Teachers - The Sourcebook" });
    }

    if (link.matches("[data-partner-contact]")) {
      window.PEAnalytics.track("partner_contact_click", { page_path: location.pathname });
    }

    if (link.matches("[data-featured-studio]")) {
      window.PEAnalytics.track("featured_studio_click", { studio_name: link.textContent.trim() });
    }

    if (absolute.origin !== location.origin && absolute.protocol.startsWith("http")) {
      window.PEAnalytics.track("outbound_click", { link_url: absolute.href });
    }

    if (href.endsWith(".pdf") || link.hasAttribute("download")) {
      window.PEAnalytics.track("pdf_download", { link_url: absolute.href });
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.closest?.(".kit-form-shell")) {
      window.PEAnalytics.track("newsletter_signup", { page_path: location.pathname });
    }
  });
})();
`
);

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Pilates Explained",
  url: siteUrl,
  logo: `${siteUrl}/assets/brand/logo-mark.svg`,
};

const publisher = {
  "@type": "Organization",
  name: "Pilates Explained",
  url: siteUrl,
  logo: `${siteUrl}/assets/brand/logo-mark.svg`,
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Pilates Explained",
  url: siteUrl,
};

function articleSchema(meta) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.desc,
    datePublished: "2026-05-10",
    dateModified: todayIso,
    author: { "@type": "Organization", name: "Pilates Explained" },
    publisher,
    image: meta.image,
    mainEntityOfPage: meta.url,
  };
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

function faqSection(faqs) {
  return `<section class="article-faq" aria-labelledby="faq-title">
            <h2 id="faq-title">Quick questions</h2>
            ${faqs.map(([q, a]) => `<details><summary>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`).join("\n            ")}
          </section>`;
}

for (const [file, meta] of articleMeta) {
  let html = read(meta.rel);
  html = updateNav(html, "../");
  html = replaceFooterAndScripts(html, "../");
  html = setCanonicalAndSocial(html, {
    canonical: meta.url,
    title: `${meta.title} | Pilates Explained`,
    desc: meta.desc,
    type: "article",
    image: meta.image,
  });

  const schemas = [
    articleSchema(meta),
    breadcrumbSchema([
      { name: "Home", url: `${siteUrl}/` },
      { name: "Articles", url: `${siteUrl}/articles/` },
      { name: meta.title, url: meta.url },
    ]),
  ];
  if (priorityFaqs[file]) schemas.push(faqSchema(priorityFaqs[file]));
  html = injectSchema(html, schemas);

  html = html.replace(
    /<nav class="breadcrumbs" aria-label="Breadcrumb">[\s\S]*?<\/nav>/,
    `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span><a href="index.html">Articles</a></span><span aria-current="page">${escapeHtml(meta.title)}</span></nav>`
  );

  html = html.replace(
    /<div class="article-meta">[\s\S]*?<\/div>/,
    `<div class="article-meta"><span>Published May 10, 2026</span><span>Updated ${todayDisplay}</span><span>${meta.minutes} min read</span></div>`
  );

  if (!html.includes("PE_RELATED_INLINE")) {
    const links = (related[file] || []).slice(0, 3).map((relFile) => articleMeta.get(relFile)).filter(Boolean);
    if (links.length) {
      const sentence = `<p class="related-inline" data-pe-marker="PE_RELATED_INLINE">For context, read this alongside ${links.map((item) => `<a href="${item.file}">${escapeHtml(item.title)}</a>`).join(", ")}.</p>`;
      html = html.replace(/(<div class="article-body">\s*<p>[\s\S]*?<\/p>)/, `$1\n          ${sentence}`);
    }
  }

  if (priorityFaqs[file] && !html.includes("class=\"article-faq\"")) {
    html = html.replace(/(\s*<section class="article-cta-card"|\s*<section class="article-sources")/, `\n          ${faqSection(priorityFaqs[file])}$1`);
  }

  if (apparatus.has(file) && !html.includes("PE_APPARATUS_AFFILIATE")) {
    const apparatusName = meta.title.replace(/^History of the /, "").replace(/Pilates /, "");
    const block = `${disclosureBox()}
          <section class="article-cta-card affiliate-cta" data-pe-marker="PE_APPARATUS_AFFILIATE" aria-labelledby="apparatus-affiliate-${file.replace(/[^a-z0-9]/g, "-")}">
            <p class="eyebrow">Try it today</p>
            <h2 id="apparatus-affiliate-${file.replace(/[^a-z0-9]/g, "-")}">Want to try a ${escapeHtml(apparatusName)}?</h2>
            <p>Take one taught session before buying equipment. A teacher can help you understand spring setup, transitions, and whether this apparatus fits your body and goals.</p>
            <div class="button-row">
              ${affiliateLink("classpass", "Find a class near you")}
              ${affiliateLink("balancedbody", "Shop home equipment")}
            </div>
          </section>
          <aside class="article-note-card" data-pe-marker="PE_GUIDE_CALLOUT">
            <h2>Choosing equipment today?</h2>
            <p>Use the <a href="../guides/best-pilates-reformers-for-home.html">home Reformer guide</a> and <a href="../guides/mat-vs-reformer-vs-online-pilates-cost.html">beginner cost comparison</a> before making a large purchase.</p>
          </aside>`;
    html = html.replace(/(\s*<section class="article-sources")/, `\n          ${block}$1`);
  }

  if (lineageProduct.has(file) && !html.includes("PE_TEACHERS_GUIDE_CALLOUT")) {
    const block = `<aside class="article-note-card" data-pe-marker="PE_TEACHERS_GUIDE_CALLOUT">
            <h2>Teaching this history?</h2>
            <p>The <a href="../teachers-guide/">Pilates History for Teachers sourcebook</a> is being prepared as a deeper, source-cited reference for instructors.</p>
          </aside>`;
    html = html.replace(/(\s*<section class="article-sources")/, `\n          ${block}$1`);
  }

  write(meta.rel, html);
}

let home = read("index.html");
home = updateNav(home, "");
home = replaceFooterAndScripts(home, "");
home = setCanonicalAndSocial(home, {
  canonical: `${siteUrl}/`,
  title: "Pilates Explained | History, Equipment, and Beginner Guides",
  desc: "A friendly, story-driven guide to Pilates history, equipment, and beginner decisions before a first class.",
  type: "website",
  image: `${siteUrl}/assets/brand/site-banner.svg`,
});
home = injectSchema(home, [organization, website]);
home = home.replace(
  /<a class="button primary" href="https:\/\/www\.google\.com\/maps\/search\/Pilates\+studio\+near\+me" target="_blank" rel="noopener">Find local studios<\/a>/,
  affiliateLink("classpass", "Find a class near you", "button primary")
);
if (!home.includes("PE_GUIDES_ROW")) {
  const guidesRow = `<section class="section practical-guides" data-pe-marker="PE_GUIDES_ROW" aria-labelledby="practical-guides-title">
        <div class="section-heading">
          <p class="eyebrow">Practical guides</p>
          <h2 id="practical-guides-title">Use the history to make better choices now</h2>
          <p>Buying equipment, choosing classes, or building a reading shelf is easier when the lineage and tradeoffs are clear.</p>
        </div>
        <div class="article-card-grid compact">
          <a class="article-card" href="guides/best-pilates-reformers-for-home.html"><img src="assets/graphics/blueprint-reformer.png" alt="Universal Reformer blueprint"><span>Guide</span><h3>Best Pilates Reformers for Home</h3><p>A cautious, category-first guide to major home Reformer choices.</p></a>
          <a class="article-card" href="guides/pilates-mat-buying-guide.html"><img src="assets/graphics/dossier-pillars.png" alt="Contrology principles graphic"><span>Guide</span><h3>Pilates Mat Buying Guide</h3><p>What actually matters for mat work and spinal articulation.</p></a>
          <a class="article-card" href="guides/essential-pilates-reading-list.html"><img src="assets/graphics/blueprint-legacy.png" alt="Pilates legacy graphic"><span>Guide</span><h3>Essential Pilates Reading List</h3><p>Original books and respected modern references.</p></a>
          <a class="article-card" href="guides/mat-vs-reformer-vs-online-pilates-cost.html"><img src="assets/graphics/graphic-4-three-paths-hero.svg" alt="Three paths comparison graphic"><span>Guide</span><h3>Mat vs Reformer vs Online</h3><p>Cost math and decision rules for beginners.</p></a>
        </div>
      </section>`;
  home = home.replace(/(\s*<section class="section newsletter-section")/, `\n      ${guidesRow}$1`);
}
if (!home.includes("deeper sourcebook for instructors")) {
  home = home.replace(
    /(<p class="download-note">[\s\S]*?<\/p>)/,
    `$1\n          <p class="download-note">Teaching Pilates? There is a <a href="teachers-guide/">deeper sourcebook for instructors</a> in development.</p>`
  );
}
write("index.html", home);

for (const rel of ["about.html", "privacy.html", "articles/index.html", "404.html"]) {
  let html = read(rel);
  const prefix = rel.startsWith("articles/") ? "../" : "";
  html = updateNav(html, prefix);
  html = replaceFooterAndScripts(html, prefix);
  const title = html.match(/<title>([^<]+)/)?.[1] || "Pilates Explained";
  const desc = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || "Pilates Explained.";
  const canonical =
    rel === "articles/index.html" ? `${siteUrl}/articles/` : rel === "404.html" ? `${siteUrl}/404.html` : `${siteUrl}/${rel}`;
  html = setCanonicalAndSocial(html, {
    canonical,
    title,
    desc,
    type: "website",
    image: `${siteUrl}/assets/brand/site-banner.svg`,
  });
  if (rel === "about.html" && !html.includes("partners/index.html")) {
    html = html.replace(
      /(<h2>Current status<\/h2>)/,
      `<p class="article-note-card">Studios, educators, and media producers can review partnership and licensing options on the <a href="partners/">partners page</a>.</p>\n          $1`
    );
  }
  write(rel, html);
}

let privacy = read("privacy.html");
privacy = privacy.replace(
  /<p>\s*This static MVP does not use advertising scripts, analytics scripts, or a backend database\.[\s\S]*?<\/p>/,
  `<p>
          Pilates Explained is a static website. Email signups are handled by Kit. The site is prepared for Google Analytics, affiliate links, and future advertising, but analytics will not load until a real GA4 measurement ID is configured.
        </p>`
);
if (!privacy.includes("<h2>Analytics</h2>")) {
  privacy = privacy.replace(
    /(\s*<h2>Media<\/h2>)/,
    `
        <h2>Analytics</h2>
        <p>
          The site is prepared to use Google Analytics 4 to understand page views, outbound clicks, PDF downloads, newsletter signups, affiliate clicks, and product-page interactions. Analytics loading respects browser Do Not Track when it is set to <code>1</code>.
        </p>

        <h2>Affiliate programs</h2>
        <p>
          Some pages may contain affiliate links to class marketplaces, equipment makers, online instruction platforms, or booksellers. Those partners may use cookies or similar technologies to attribute purchases or bookings. Affiliate links are marked as sponsored where they appear.
        </p>

        <h2>Advertising cookies</h2>
        <p>
          Pilates Explained may apply for Google AdSense later. If advertising is enabled, Google and its partners may use cookies for ad delivery, measurement, personalization, and fraud prevention. You can manage Google ad personalization through Google's Ads Settings and learn about broader interest-based advertising opt-outs at www.aboutads.info.
        </p>$1`
  );
}
write("privacy.html", privacy);

write(
  "affiliate-disclosure/index.html",
  page({
    title: "Affiliate Disclosure | Pilates Explained",
    desc: "How Pilates Explained uses affiliate links and sponsored relationships.",
    canonical: `${siteUrl}/affiliate-disclosure/`,
    prefix: "../",
    mainClass: "policy-page",
    body: `      <section class="section policy-section" aria-labelledby="affiliate-title">
        <p class="eyebrow">Disclosure</p>
        <h1 id="affiliate-title">Affiliate Disclosure</h1>
        <p>Pilates Explained may earn a commission when readers book classes, buy books, or purchase equipment through links on this site. There is no extra cost to you.</p>
        <h2>How recommendations work</h2>
        <p>Affiliate relationships do not determine the site's editorial conclusions. The site keeps a source-aware, no-hype voice, avoids medical claims, and distinguishes history, beginner guidance, and commercial links.</p>
        <h2>Programs</h2>
        <p>The affiliate infrastructure is prepared for ClassPass, Balanced Body, Merrithew / STOTT, Pilates Anytime, and Amazon Associates. Individual links may remain inactive until the operator adds approved tracking URLs.</p>
        <h2>Sponsored content</h2>
        <p>Sponsored articles or newsletter placements, if accepted, will be clearly labeled. Pilates Explained retains final editorial control and does not publish paid method rankings or medical claims.</p>
      </section>`,
  })
);

function guidePage({ slug, title, desc, image, body, faqs }) {
  const canonical = `${siteUrl}/guides/${slug}.html`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title.replace(" | Pilates Explained", ""),
      description: desc,
      datePublished: todayIso,
      dateModified: todayIso,
      author: { "@type": "Organization", name: "Pilates Explained" },
      publisher,
      image: `${siteUrl}/${image}`,
      mainEntityOfPage: canonical,
    },
    breadcrumbSchema([
      { name: "Home", url: `${siteUrl}/` },
      { name: "Guides", url: `${siteUrl}/guides/` },
      { name: title.replace(" | Pilates Explained", ""), url: canonical },
    ]),
    faqSchema(faqs),
  ];
  write(
    `guides/${slug}.html`,
    page({
      title,
      desc,
      canonical,
      prefix: "../",
      mainClass: "article-page",
      schema,
      ogType: "article",
      ogImage: `${siteUrl}/${image}`,
      body: `      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span><a href="index.html">Guides</a></span><span aria-current="page">${escapeHtml(title.replace(" | Pilates Explained", ""))}</span></nav>
      <article>
        <header class="article-hero">
          <p class="eyebrow">Buying guide</p>
          <h1>${escapeHtml(title.replace(" | Pilates Explained", ""))}</h1>
          <p>${escapeHtml(desc)}</p>
          <img src="../${image}" alt="">
        </header>
        <div class="article-meta"><span>Published ${todayDisplay}</span><span>Updated ${todayDisplay}</span><span>${Math.max(5, Math.ceil(stripTags(body).split(/\s+/).length / 225))} min read</span></div>
        <div class="article-body">
          ${disclosureBox()}
${body}
          ${faqSection(faqs)}
        </div>
      </article>`,
    })
  );
}

const guideCards = [
  ["best-pilates-reformers-for-home.html", "Best Pilates Reformers for Home", "Major home equipment choices, framed by lineage and practical constraints.", "../assets/graphics/blueprint-reformer.png"],
  ["pilates-mat-buying-guide.html", "Pilates Mat Buying Guide", "Thickness, density, surface, and what matters for mat practice.", "../assets/graphics/dossier-pillars.png"],
  ["essential-pilates-reading-list.html", "Essential Pilates Reading List", "Original Pilates books and modern texts worth reading carefully.", "../assets/graphics/blueprint-legacy.png"],
  ["mat-vs-reformer-vs-online-pilates-cost.html", "Mat vs Reformer vs Online Pilates", "Cost ranges and decision rules for beginners.", "../assets/graphics/graphic-4-three-paths-hero.svg"],
];

write(
  "guides/index.html",
  page({
    title: "Guides | Pilates Explained",
    desc: "Practical Pilates buying and decision guides with a history-aware, no-hype editorial voice.",
    canonical: `${siteUrl}/guides/`,
    prefix: "../",
    body: `      <section class="article-index-hero">
        <p class="eyebrow">Guides</p>
        <h1>Practical Pilates Guides</h1>
        <p>Commercial questions deserve the same careful tone as history questions. These guides focus on categories, tradeoffs, and decision rules instead of inflated promises.</p>
      </section>
      <section class="section article-grid-section" aria-labelledby="guides-title">
        <div class="section-heading">
          <p class="eyebrow">Start here</p>
          <h2 id="guides-title">Buying and beginner decisions</h2>
        </div>
        <div class="article-card-grid">
          ${guideCards.map(([href, title, text, img]) => `<a class="article-card" href="${href}"><img src="${img}" alt=""><span>Guide</span><h3>${title}</h3><p>${text}</p></a>`).join("\n          ")}
        </div>
      </section>`,
  })
);

guidePage({
  slug: "best-pilates-reformers-for-home",
  title: "Best Pilates Reformers for Home (2026): A Historian's Guide | Pilates Explained",
  desc: "A category-first guide to home Pilates Reformers, from classical wooden designs to contemporary studio machines and budget foldable options.",
  image: "assets/graphics/blueprint-reformer.png",
  faqs: [
    ["Should a beginner buy a Reformer first?", "Usually not. A few taught sessions are the best first purchase because they show whether the apparatus, space, and setup fit your body and routine."],
    ["Are budget foldable Reformers the same as studio equipment?", "No. Budget machines can be useful for light home practice, but they usually differ in carriage feel, frame stability, spring behavior, and long-term serviceability."],
    ["Which brand is historically closest to classical Pilates?", "Classical wooden Reformers are closest to the older studio look and feel, while contemporary manufacturers often emphasize adjustability, portability, or clinical use."],
  ],
  body: `          <p>A home Reformer is not a small accessory. It is furniture, exercise equipment, and a teaching system in one object. That is why this guide starts with history instead of a ranking. Joseph Pilates' equipment was built to give the body feedback through springs, straps, a moving carriage, and a fixed frame. The best home choice is the one that preserves enough of that feedback for the way you will actually practice.</p>
          <p>For most beginners, the first step is not buying a machine. It is taking a few private, semi-private, or beginner Reformer classes. You learn what spring resistance feels like, how much instruction you need, and whether the apparatus is energizing or stressful. The purchase starts to make sense only when you know you will use it consistently and have a safe place to leave it set up.</p>
          <h2>Three categories to compare</h2>
          <p><strong>Classical-style studio Reformers</strong> usually appeal to people who want a traditional feel, a fixed setup, and a lineage-oriented practice. They often look closer to archival studio equipment and may assume more teacher guidance. They can be beautiful and durable, but they are not usually the cheapest or most flexible home choice.</p>
          <p><strong>Contemporary studio Reformers</strong> from makers such as Balanced Body and Merrithew / STOTT often emphasize adjustability, education programs, accessories, and broader body accommodation. This category is common in contemporary studios, clinical settings, and teacher-training environments. It is often the safest category to evaluate if you want a serious home machine but are not trying to replicate a classical studio exactly.</p>
          <p><strong>Budget and foldable Reformers</strong> solve the obvious home problems: space and cost. They are easier to store and easier to justify financially, but the tradeoff is usually feel. Before choosing one, ask whether the carriage tracks smoothly, whether the frame feels stable, how the springs are replaced, and whether the machine supports the exercises you expect to do.</p>
          <table class="comparison-table"><thead><tr><th scope="col">Category</th><th scope="col">Typical fit</th><th scope="col">Watch closely</th><th scope="col">Good next step</th></tr></thead><tbody><tr><th scope="row">Classical-style</th><td>Lineage-focused practice and teacher-led work.</td><td>Cost, footprint, and whether the fixed setup suits your body.</td><td>Try a classical studio session first.</td></tr><tr><th scope="row">Contemporary studio</th><td>Serious home users who want adjustability and broad exercise options.</td><td>Accessory creep, total footprint, and delivery logistics.</td><td>${affiliateLink("balancedbody", "Check Balanced Body options", "inline-sponsored-link")} ${affiliateLink("merrithew", "Check Merrithew options", "inline-sponsored-link")}</td></tr><tr><th scope="row">Budget foldable</th><td>Small spaces, lighter routines, and cautious first purchases.</td><td>Frame stability, carriage travel, springs, warranty, and resale value.</td><td>${amazonLink("foldable Pilates reformer", "Search budget Reformers")}</td></tr></tbody></table>
          <h2>What actually matters</h2>
          <p>Footprint comes first. Measure the machine, the carriage travel, and the space around it. A Reformer that technically fits but leaves no room to mount, dismount, or move around safely will not become a daily habit. If you live in a shared apartment, also think about noise, storage, and whether folding the equipment after every session will make practice less likely.</p>
          <p>Spring system comes next. The spring is the apparatus' voice. Different manufacturers use different spring lengths, colors, and resistance progressions. Do not assume that all machines feel the same because they use springs. If you have been taught on one studio brand, switching categories can change the body memory of familiar exercises.</p>
          <p>Finally, evaluate support. A home Reformer needs assembly instructions, replacement parts, education materials, and a realistic path to service. This matters more than a small difference in price range. A cheaper machine can become expensive if it cannot be repaired or if it encourages unsafe improvisation.</p>
          <h2>A cautious buying rule</h2>
          <p>Buy the least equipment that supports a real routine. If you are still deciding whether Pilates belongs in your life, pay for instruction. If you already practice weekly and want more access, compare serious home machines. If your goal is occasional movement between studio sessions, a mat, small props, and online instruction may be a better first investment.</p>
          <p>Related reading: <a href="../articles/history-of-the-reformer.html">the history of the Reformer</a>, <a href="../articles/history-of-the-cadillac.html">the Cadillac</a>, and <a href="mat-vs-reformer-vs-online-pilates-cost.html">the beginner cost comparison</a>.</p>`,
});

guidePage({
  slug: "pilates-mat-buying-guide",
  title: "Pilates Mat Buying Guide: What Actually Matters | Pilates Explained",
  desc: "A practical guide to Pilates mat thickness, density, surface, and beginner tradeoffs.",
  image: "assets/graphics/dossier-pillars.png",
  faqs: [
    ["Can I use a yoga mat for Pilates?", "You can start on a yoga mat, but many people prefer a denser or thicker mat for Pilates because rolling, spinal articulation, and seated work can put more pressure on the spine and hips."],
    ["Is the thickest mat always best?", "No. Too much softness can make balance and standing work unstable. Look for support without a sinking, wobbly feel."],
    ["What should beginners buy first?", "Choose a comfortable, non-slip mat you will actually use, then add props later only when your teacher or routine calls for them."],
  ],
  body: `          <p>A Pilates mat is simple compared with a Reformer, but the choice still affects practice. Pilates mat work asks the spine to roll, articulate, press, and stabilize against the floor. That is why a thin yoga mat may feel fine for a standing flow and uncomfortable for rolling like a ball, open leg rocker, or repeated supine abdominal work.</p>
          <p>The best mat is not the most expensive one. It is the mat that gives enough cushioning to practice comfortably while preserving enough contact with the floor to feel alignment. Beginners should avoid turning the purchase into a gear project. Mat practice became powerful because it required attention, not because it required a complicated setup.</p>
          <h2>Thickness versus density</h2>
          <p>Thickness is visible; density is felt. A thick but squishy mat can make balancing harder and can let the pelvis sink unevenly. A thinner dense mat may feel more supportive than a thicker foam mat. For Pilates, the useful middle ground is usually supportive cushioning with a stable surface.</p>
          <p>If you have sensitive knees, hips, or spine, prioritize comfort. If your practice includes more standing balance or transitions, prioritize stability. If you travel, a lighter roll-up mat may beat a luxurious mat that never leaves the closet.</p>
          <table class="comparison-table"><thead><tr><th scope="col">Mat type</th><th scope="col">Best for</th><th scope="col">Tradeoff</th><th scope="col">Search</th></tr></thead><tbody><tr><th scope="row">Dense Pilates mat</th><td>General home mat practice and rolling work.</td><td>Bulkier than a yoga mat.</td><td>${amazonLink("dense Pilates mat", "Check current options")}</td></tr><tr><th scope="row">Extra-thick exercise mat</th><td>Sensitive spine, floor work, and comfort-first practice.</td><td>Can feel unstable for balance.</td><td>${amazonLink("extra thick Pilates exercise mat", "Check current options")}</td></tr><tr><th scope="row">Foldable panel mat</th><td>Home practice spaces where storage is more important than portability.</td><td>Panel seams may interrupt some rolling movements.</td><td>${amazonLink("folding Pilates mat", "Check current options")}</td></tr><tr><th scope="row">Travel mat</th><td>Hotel rooms and carrying to class.</td><td>Less cushioning.</td><td>${amazonLink("travel Pilates mat", "Check current options")}</td></tr></tbody></table>
          <h2>Surface and grip</h2>
          <p>Grip matters, but Pilates grip is different from hot-yoga grip. You need enough traction that hands and feet do not slide unexpectedly, but not so much stickiness that smooth transitions become awkward. If you practice barefoot, test how the mat behaves when dry and when slightly damp.</p>
          <p>Texture also affects cleaning. A deeply textured mat may feel secure, but it can hold dust and lint. A smoother closed-cell surface may clean more easily. If the mat lives in a studio bag, check whether it resists dents and whether it can be wiped down quickly.</p>
          <h2>Props can wait</h2>
          <p>Magic circles, bands, small balls, and rollers can be useful, but they are not the foundation. The foundational question is whether you can lie down, breathe, articulate the spine, and practice consistently. Buy the mat first. Add props when a teacher or a specific routine gives them a job.</p>
          <p>Related reading: <a href="../articles/what-is-contrology.html">Contrology</a>, <a href="../articles/pilates-vs-yoga-history-of-two-parallel-methods.html">Pilates versus yoga</a>, and <a href="mat-vs-reformer-vs-online-pilates-cost.html">the cost comparison for beginners</a>.</p>`,
});

guidePage({
  slug: "essential-pilates-reading-list",
  title: "The Essential Pilates Reading List | Pilates Explained",
  desc: "A source-aware reading list for Joseph Pilates' original books and respected modern Pilates references.",
  image: "assets/graphics/blueprint-legacy.png",
  faqs: [
    ["What should I read first?", "Start with Return to Life Through Contrology if you want the compact original exercise text, then read Your Health for the broader philosophy."],
    ["Are modern Pilates books still useful?", "Yes, especially when they clarify anatomy, teaching language, or contemporary practice. Read them as interpretations, not replacements for historical sources."],
    ["Should teachers own the original books?", "Teachers benefit from reading the originals directly because they show Joseph Pilates' voice, assumptions, and historical context."],
  ],
  body: `          <p>Pilates history is unusually readable because the founder left books, apparatus, photographs, and a strong studio lineage. The challenge is not finding a single official text that explains everything. The challenge is reading across original sources, later teachers, and modern anatomy without flattening them into one voice.</p>
          <p>This list begins with Joseph Pilates' own books, then moves to respected modern references. It is not a certification curriculum and it is not a ranking. It is a practical shelf for readers who want to understand what changed as Contrology became Pilates.</p>
          <h2>The original texts</h2>
          <p><strong>Your Health</strong> (1934) is the broader manifesto. It is opinionated, sometimes strange by modern standards, and useful precisely because it shows Joseph Pilates' health philosophy before the method became a global studio brand. Read it for context, not as modern medical guidance.</p>
          <p><strong>Return to Life Through Contrology</strong> (1945), created with William John Miller, is the compact exercise text most readers associate with the original mat sequence. It is short, direct, and historically important. Read it slowly. The sparseness is part of the lesson: the method assumes attention, repetition, and control.</p>
          <div class="button-row">${amazonLink("Joseph Pilates Your Health Return to Life Contrology", "Search original Pilates books")}</div>
          <h2>Modern references</h2>
          <p><strong>The Pilates Body</strong> by Brooke Siler helped introduce many mainstream readers to a classical vocabulary. It is useful for seeing how the method was translated for home readers during Pilates' wider commercial expansion.</p>
          <p><strong>Pilates</strong> by Rael Isacowitz is often valued for a contemporary, teacher-friendly presentation of exercises and apparatus. It belongs on the shelf when you want structured explanation rather than founder-era rhetoric.</p>
          <p>Annotated or illustrated editions of the original work can also be helpful, especially when they make the old sequence more legible. The key is to notice what is annotation and what is original text. A good modern edition should help you read the source, not hide it.</p>
          <table class="comparison-table"><thead><tr><th scope="col">Book type</th><th scope="col">Why it matters</th><th scope="col">How to read it</th><th scope="col">Search</th></tr></thead><tbody><tr><th scope="row">Founder texts</th><td>Original voice, philosophy, and early exercise presentation.</td><td>As historical source material.</td><td>${amazonLink("Return to Life Through Contrology Your Health Joseph Pilates", "Check current editions")}</td></tr><tr><th scope="row">Classical introductions</th><td>Shows how the inherited method reached mainstream readers.</td><td>As interpretation and teaching translation.</td><td>${amazonLink("The Pilates Body Brooke Siler", "Check current editions")}</td></tr><tr><th scope="row">Comprehensive manuals</th><td>Useful for anatomy, apparatus organization, and teacher reference.</td><td>As modern professional guidance.</td><td>${amazonLink("Rael Isacowitz Pilates book", "Check current editions")}</td></tr></tbody></table>
          <h2>A reading order</h2>
          <p>Start with the short original exercise text, then read the broader 1934 philosophy, then compare a modern classical introduction with a contemporary manual. That order keeps the founder's voice visible while making room for the method's later development.</p>
          <p>For teachers, the most important habit is citation discipline. If a claim comes from Joseph Pilates, say so. If it comes from a later teacher, say that. If it is a modern teaching convention, do not present it as an archival fact.</p>
          <p>Related reading: <a href="../articles/your-health-1934-joseph-pilates-first-book.html">Your Health</a>, <a href="../articles/what-is-contrology.html">Contrology</a>, and <a href="../articles/pilates-elders-lineage.html">the Pilates Elders and lineage</a>.</p>`,
});

guidePage({
  slug: "mat-vs-reformer-vs-online-pilates-cost",
  title: "Mat vs Reformer vs Online Pilates: Cost Comparison for Beginners | Pilates Explained",
  desc: "A practical cost comparison for beginners choosing between mat classes, Reformer studios, online Pilates, and home equipment.",
  image: "assets/graphics/graphic-4-three-paths-hero.svg",
  faqs: [
    ["What is the cheapest way to start Pilates?", "Mat classes or online instruction are usually the lowest-cost entry points, especially if you already have a suitable mat."],
    ["Why are Reformer classes more expensive?", "They require large equipment, smaller class sizes, more setup, and more teacher attention than many mat formats."],
    ["Is online Pilates enough for a beginner?", "It can be a useful start for general movement, but beginners with pain, injuries, or apparatus goals should get live instruction when possible."],
  ],
  body: `          <p>The best Pilates option is not always the most authentic or the most expensive. It is the format you can practice safely, consistently, and with enough instruction to understand what you are doing. A beginner comparing mat, Reformer, online classes, and home equipment is really comparing access, feedback, cost, and commitment.</p>
          <p>Use ranges rather than exact prices. Studio pricing changes by city, teacher, class size, and package. Online subscriptions and class marketplaces change offers frequently. The point is to understand the shape of the decision before clicking a checkout button.</p>
          <table class="comparison-table"><thead><tr><th scope="col">Path</th><th scope="col">Typical cost pattern</th><th scope="col">Best for</th><th scope="col">Main risk</th></tr></thead><tbody><tr><th scope="row">Mat class</th><td>Usually the lowest studio cost.</td><td>Learning fundamentals and building consistency.</td><td>Less individual feedback in large classes.</td></tr><tr><th scope="row">Reformer class</th><td>Typically higher because equipment and class size matter.</td><td>People who benefit from spring feedback and structured apparatus work.</td><td>Cost can limit frequency.</td></tr><tr><th scope="row">Online Pilates</th><td>Often a monthly subscription or library access model.</td><td>Home practice, schedule flexibility, and maintenance between live sessions.</td><td>Limited correction and easy overestimation of form.</td></tr><tr><th scope="row">Home Reformer</th><td>Large upfront equipment purchase plus space.</td><td>Committed practitioners with prior instruction.</td><td>Buying too soon or buying the wrong category.</td></tr></tbody></table>
          <h2>A beginner decision rule</h2>
          <p>If you are simply curious, start with a beginner mat class or a low-pressure online series. If you are drawn to the equipment, take an introductory Reformer session before judging the method. If your schedule is the barrier, combine occasional live instruction with online practice. If you already attend weekly and want more access, then compare home equipment.</p>
          <p>Class marketplaces can be useful for sampling studios, but they should not replace judgment. Look for clear beginner labeling, teacher attention, and studio language that explains what kind of Pilates is being taught. If you are recovering from injury or have a medical concern, ask a qualified professional before using a general fitness class as a solution.</p>
          <div class="button-row">${affiliateLink("classpass", "Check local class options")} ${affiliateLink("pilatesanytime", "Explore online Pilates")} <a class="button secondary" href="../assets/downloads/pilates-starter-decision-guide.pdf" download>Download the starter guide</a></div>
          <h2>How to compare value</h2>
          <p>Do not compare only the posted class price. Compare the amount of feedback you receive, how often you can attend, how much travel friction exists, and whether the format makes you more confident. A more expensive introductory private session can be good value if it prevents months of confused home practice.</p>
          <p>For many beginners, the strongest plan is blended: one or two live sessions to learn orientation, a mat or online routine for consistency, and occasional Reformer classes if the apparatus feels motivating. That path avoids the biggest early mistake: buying a large machine before knowing whether the method fits your life.</p>
          <h2>When home equipment makes sense</h2>
          <p>A home Reformer makes sense when you already know the exercises you plan to practice, have safe space, understand spring changes, and can afford a machine without needing it to replace instruction entirely. It is a practice multiplier, not a substitute for learning.</p>
          <p>Related reading: <a href="../articles/classical-modern-lagree-how-to-choose.html">how to choose a method</a>, <a href="../articles/history-of-the-reformer.html">the Reformer history</a>, and <a href="best-pilates-reformers-for-home.html">the home Reformer guide</a>.</p>`,
});

write(
  "teachers-guide/index.html",
  page({
    title: "Pilates History for Teachers - The Sourcebook | Pilates Explained",
    desc: "A waitlist page for a source-cited Pilates history guide for teachers and studio educators.",
    canonical: `${siteUrl}/teachers-guide/`,
    prefix: "../",
    bodyAttrs: 'data-product-page="true"',
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Pilates History for Teachers - The Sourcebook",
        description: "A compiled, source-cited reference on Joseph and Clara Pilates, Contrology, apparatus history, lineage, and the trademark era.",
        brand: { "@type": "Brand", name: "Pilates Explained" },
        offers: { "@type": "Offer", price: "19.00", priceCurrency: "USD", availability: "https://schema.org/PreOrder", url: `${siteUrl}/teachers-guide/` },
      },
    ],
    body: `      <section class="article-index-hero product-hero">
        <p class="eyebrow">For teachers</p>
        <h1>Pilates History for Teachers - The Sourcebook</h1>
        <p>A compiled, source-cited reference for instructors who want to teach the history accurately in trainings, studio education, and client conversations.</p>
        <div class="button-row product-actions" data-product-actions>
          <a class="button primary" href="CHECKOUT_URL" target="_blank" rel="noopener" data-product-buy data-product-live="false" hidden>Buy the sourcebook - $19</a>
          <div class="kit-form-shell product-waitlist" data-product-waitlist>
            <p><strong>Launching soon.</strong> Join the list for the launch discount.</p>
            <script async data-uid="633f81fc5f" src="https://pilates-explained.kit.com/633f81fc5f/index.js"></script>
          </div>
        </div>
      </section>
      <section class="section split product-detail">
        <div><p class="eyebrow">Inside</p><h2>Built from the article taxonomy</h2></div>
        <div class="prose"><ul><li><strong>Foundations:</strong> Joseph and Clara Pilates, Contrology, original books, and the internment origin story.</li><li><strong>Apparatus:</strong> Reformer, Cadillac, Wunda Chair, barrels, spring resistance, and studio use.</li><li><strong>Legacy:</strong> Elders, lineage, dance transmission, classical versus contemporary development, and the trademark era.</li></ul></div>
      </section>
      <section class="section product-sample" aria-labelledby="sample-title">
        <div class="sample-spread"><span>Sample spread placeholder</span></div>
        <div><p class="eyebrow">Audience</p><h2 id="sample-title">Who it is for</h2><p>Teachers, studio owners, and teacher-training teams who want a concise reference that separates source-backed history from later interpretation. Single-teacher use is planned at launch, with a studio-license option available by request.</p></div>
      </section>
      <section class="section article-faq" aria-labelledby="product-faq-title">
        <h2 id="product-faq-title">Questions</h2>
        <details><summary>Is this different from the free starter guide?</summary><p>Yes. The free guide helps beginners choose a class format. The sourcebook is a deeper reference for teachers and studio education.</p></details>
        <details><summary>Can a studio use it for training?</summary><p>The launch version is planned for single-teacher use. Studio licenses will be handled separately so training teams can use the material cleanly.</p></details>
        <details><summary>Is the product live?</summary><p>No. The page is currently in waitlist mode until the PDF and checkout URL are ready.</p></details>
      </section>
      <script>
        const PRODUCT_LIVE = false;
        document.addEventListener("DOMContentLoaded", () => {
          document.querySelectorAll("[data-product-live]").forEach((item) => item.hidden = !PRODUCT_LIVE);
          document.querySelectorAll("[data-product-waitlist]").forEach((item) => item.hidden = PRODUCT_LIVE);
        });
      </script>`,
  })
);

write(
  "partners/index.html",
  page({
    title: "Partners & Media Kit | Pilates Explained",
    desc: "Sponsorship, licensing, and media partnership information for Pilates Explained.",
    canonical: `${siteUrl}/partners/`,
    prefix: "../",
    bodyAttrs: 'data-page-event="partner_page_view"',
    body: `      <section class="article-index-hero">
        <p class="eyebrow">Partners</p>
        <h1>Partner with Pilates Explained</h1>
        <p>Reach Pilates beginners, instructors, studio owners, and movement-history readers through source-aware editorial work, clearly labeled sponsorship, and licensing of original media assets.</p>
      </section>
      <section class="section stats-strip" aria-label="Audience statistics">
        <div><span data-stat="monthly-readers">-</span><strong>Monthly readers</strong></div>
        <div><span data-stat="newsletter-subscribers">-</span><strong>Newsletter subscribers</strong></div>
        <div><span data-stat="top-channel">-</span><strong>Top traffic channel</strong></div>
      </section>
      <section class="section article-grid-section">
        <div class="article-card-grid compact">
          <article class="article-card text-card"><span>Offer</span><h3>Sponsored articles</h3><p>Historically grounded sponsored work, clearly labeled Sponsored. Pilates Explained retains final edit, uses sourcing rules, and does not publish medical claims.</p></article>
          <article class="article-card text-card"><span>Offer</span><h3>Newsletter sponsorship</h3><p>A single-sponsor slot in the Kit newsletter when the audience is large enough to support it.</p></article>
          <article class="article-card text-card"><span>Offer</span><h3>Content licensing</h3><p>Original videos, graphics, and article content can be licensed by studios, teacher-training programs, and media producers.</p></article>
        </div>
      </section>
      <section class="section article-cta-card">
        <p class="eyebrow">Contact</p>
        <h2>Start a conversation</h2>
        <p>Use the placeholder address until the operator supplies a dedicated inbox.</p>
        <a class="button primary" href="mailto:partners@pilatesexplained.com" data-partner-contact>partners@pilatesexplained.com</a>
      </section>
      <section class="section policy-section">
        <h2>Editorial guardrails</h2>
        <p>Sponsored content is always labeled. Affiliate relationships are disclosed. The site does not publish medical claims or method rankings for pay.</p>
      </section>`,
  })
);

const productCalloutTargets = ["articles/index.html"];
for (const rel of productCalloutTargets) {
  let html = read(rel);
  if (!html.includes("PE_PRODUCT_INDEX_CALLOUT")) {
    html = html.replace(
      /(\s*<\/main>)/,
      `\n      <section class="section article-cta-card" data-pe-marker="PE_PRODUCT_INDEX_CALLOUT" aria-labelledby="teachers-guide-index-title">
        <p class="eyebrow">For teachers</p>
        <h2 id="teachers-guide-index-title">Need the history in one sourcebook?</h2>
        <p>The Pilates History for Teachers sourcebook is being prepared as a deeper, source-cited reference for instructors.</p>
        <a class="button secondary" href="../teachers-guide/">Join the sourcebook waitlist</a>
      </section>$1`
    );
    write(rel, html);
  }
}

const allPublicPages = [
  ["", "index.html"],
  ["about.html", "about.html"],
  ["privacy.html", "privacy.html"],
  ["articles/", "articles/index.html"],
  ...articleFiles.map((file) => [`articles/${file}`, `articles/${file}`]),
  ["guides/", "guides/index.html"],
  ...guideCards.map(([href]) => [`guides/${href}`, `guides/${href}`]),
  ["affiliate-disclosure/", "affiliate-disclosure/index.html"],
  ["teachers-guide/", "teachers-guide/index.html"],
  ["partners/", "partners/index.html"],
];

write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPublicPages
  .map(([loc]) => `  <url><loc>${siteUrl}/${loc}</loc><lastmod>${todayIso}</lastmod></url>`)
  .join("\n")}
</urlset>
`
);

write(
  "robots.txt",
  `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
);

const cssPath = "styles.css";
let css = read(cssPath);
if (!css.includes("PE_MONETIZATION_STYLES")) {
  css += `

/* PE_MONETIZATION_STYLES */
.footer-links,
.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.footer-links a {
  color: var(--muted);
  font-weight: 800;
  text-decoration: none;
}

.related-inline {
  padding: 0.9rem 1rem;
  border-left: 4px solid var(--pe-teal);
  background: var(--teal-soft);
  font-weight: 700;
}

.affiliate-disclosure-box {
  margin: 1.25rem 0;
  padding: 1rem;
  border: 1px solid rgba(120, 77, 54, 0.28);
  border-radius: var(--pe-radius);
  background: var(--pe-cream);
  color: var(--pe-dark);
}

.inline-sponsored-link {
  display: inline-flex;
  margin: 0.15rem 0.25rem 0.15rem 0;
  padding: 0.42rem 0.68rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  color: var(--teal-dark);
  font-weight: 900;
  text-decoration: none;
}

.article-faq {
  margin-top: 2.5rem;
  padding: 1.2rem;
  border: 1px solid var(--line);
  border-radius: var(--pe-radius);
  background: var(--white);
}

.article-faq details {
  padding: 0.85rem 0;
  border-top: 1px solid var(--line);
}

.article-faq details:first-of-type {
  border-top: 0;
}

.article-faq summary {
  cursor: pointer;
  font-weight: 900;
  color: var(--pe-dark);
}

.comparison-table {
  width: 100%;
  margin: 1.5rem 0;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: var(--pe-radius);
  box-shadow: inset 0 0 0 1px var(--line);
}

.comparison-table th,
.comparison-table td {
  padding: 0.85rem;
  border: 1px solid var(--line);
  text-align: left;
  vertical-align: top;
}

.comparison-table thead th {
  background: var(--pe-purple-light);
}

.practical-guides,
.stats-strip {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.text-card {
  display: block;
  padding: 1.2rem;
}

.product-hero {
  padding-bottom: 3rem;
}

.product-detail ul {
  margin: 0;
  padding-left: 1.2rem;
}

.product-detail li {
  margin-bottom: 0.75rem;
}

.product-waitlist {
  width: min(520px, 100%);
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: var(--pe-radius);
  background: var(--white);
}

.product-sample {
  display: grid;
  grid-template-columns: minmax(240px, 0.9fr) minmax(0, 1.1fr);
  gap: 2rem;
  align-items: center;
}

.sample-spread {
  display: grid;
  min-height: 260px;
  place-items: center;
  border: 1px dashed rgba(27, 42, 58, 0.35);
  border-radius: var(--pe-radius);
  background: linear-gradient(135deg, var(--white), var(--pe-purple-light));
  color: var(--muted);
  font-weight: 900;
}

.stats-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.stats-strip div {
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: var(--pe-radius);
  background: var(--white);
}

.stats-strip span {
  display: block;
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--pe-teal-dark);
}

a[aria-disabled="true"] {
  cursor: not-allowed;
}

@media (max-width: 720px) {
  .product-sample,
  .stats-strip {
    grid-template-columns: 1fr;
  }
}
`;
}
write(cssPath, css);

console.log(`Updated ${articleFiles.length} articles and generated monetization foundation pages.`);
