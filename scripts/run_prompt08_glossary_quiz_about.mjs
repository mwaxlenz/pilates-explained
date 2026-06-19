import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://pilatesexplained.com";
const todayIso = "2026-06-14";

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

const jsonScript = (data) => `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n    </script>`;

const glossaryGroups = [
  {
    title: "Apparatus / Equipment",
    terms: [
      ["Barrel", "A curved, padded piece of equipment (Spine Corrector, Ladder Barrel, or Small Barrel) used to support and stretch the spine into extension. Helps with posture and spinal articulation.", "History of the Barrels article.", "../articles/pilates-barrels-and-spinal-decompression.html"],
      ["Cadillac (Trapeze Table)", "A bed-sized frame with bars, straps, and springs, originally developed from hospital-bed design. Used for both gentle rehabilitation and advanced full-body work.", "History of the Cadillac article.", "../articles/history-of-the-cadillac.html"],
      ["Magic Circle (Pilates Ring)", "A flexible ring, roughly 13-15 inches across, with padded handles on both sides. Used to add resistance to mat exercises, often pressed between the hands, ankles, or thighs."],
      ["Reformer", "The most recognizable Pilates apparatus: a sliding carriage attached to a frame by springs, with a footbar, straps, and shoulder blocks. Provides adjustable resistance for hundreds of exercises.", "History of the Reformer article.", "../articles/history-of-the-reformer.html"],
      ["Wunda Chair", "A compact, box-like apparatus with a spring-loaded pedal, originally designed to double as a piece of home furniture. Known for being deceptively challenging.", "History of the Wunda Chair article.", "../articles/history-of-the-wunda-chair.html"],
    ],
  },
  {
    title: "Method & Principles",
    terms: [
      ["Centering", "One of the original Contrology principles: the idea that all movement originates from the body's center (the \"powerhouse\") and radiates outward."],
      ["Control", "A core Contrology principle: movements are performed deliberately, without momentum, so the mind directs the body rather than the body moving on autopilot."],
      ["Contrology", "Joseph Pilates' original name for his method, emphasizing control of the body through the mind. \"Pilates\" became the common name only after his death.", "What Is Contrology? article.", "../articles/what-is-contrology.html"],
      ["Flow", "The principle that movements connect smoothly into one another, rather than starting and stopping abruptly. In practice, this is what gives a well-taught Pilates class its rhythm."],
      ["Neutral Spine", "A pelvis and spine position that maintains the natural curves of the back (rather than flattening or arching), often used as a default starting position for exercises."],
      ["Powerhouse", "Joseph Pilates' term for the core: the muscles of the abdomen, lower back, hips, and glutes, which he considered the source of all controlled movement."],
      ["Precision", "A core Contrology principle: small, exact adjustments in alignment and movement matter more than how many repetitions are performed."],
      ["The Hundred", "One of the best-known mat exercises from Return to Life Through Contrology: a sustained core-engagement position with rhythmic arm pumps, performed for roughly 100 breath counts."],
    ],
  },
  {
    title: "Lineage & Schools",
    terms: [
      ["Classical Pilates", "The original Contrology method as preserved through direct teacher-to-teacher lineage from Joseph and Clara Pilates and their first-generation students.", "Classical vs Modern Pilates article.", "../articles/classical-vs-modern-pilates-explained.html"],
      ["Contemporary / Modern Pilates", "A broad category of Pilates schools (BASI, STOTT/Merrithew, Polestar, Balanced Body, and others) that retain the core method while incorporating modern biomechanics and rehabilitation science.", "Classical vs Modern Pilates article.", "../articles/classical-vs-modern-pilates-explained.html"],
      ["The Elders", "The informal name for Joseph and Clara Pilates' first-generation students (including Romana Kryzanowska, Kathy Grant, Ron Fletcher, Eve Gentry, and others) who preserved and taught the method after Joseph's death in 1967.", "Pilates Elders and Lineage article.", "../articles/pilates-elders-lineage.html"],
      ["Lagree", "A separate, proprietary fitness system founded by Sebastien Lagree in 1998, performed on Megaformer-style machines. Lagree itself states it is not Pilates, despite visual similarities to reformer work.", "What Is Lagree? article.", "../articles/what-is-lagree-not-pilates.html"],
    ],
  },
  {
    title: "Practical / Class Terms",
    terms: [
      ["Duet / Trio", "A private Pilates session with two or three clients sharing an instructor's attention, common in classical-lineage studios."],
      ["Mat Pilates", "Pilates performed on the floor using bodyweight (and sometimes small props like the Magic Circle or resistance bands), without large apparatus. The original 34 exercises from Return to Life are mat exercises."],
      ["Reformer Class", "A group or private class performed on Reformers, ranging from slow, classical-style sequencing to faster, more athletic contemporary formats."],
      ["Tower / Cadillac Wall Unit", "A modern, wall-mounted adaptation of the Cadillac, common in contemporary studios with limited floor space."],
    ],
  },
].map((group) => ({
  ...group,
  terms: group.terms
    .map(([term, definition, linkLabel, linkHref]) => ({ term, definition, linkLabel, linkHref, slug: slugify(term) }))
    .sort((a, b) => a.term.localeCompare(b.term)),
}));

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function nav(prefix = "", staticClass = false) {
  const cls = staticClass ? "nav-links is-static" : "nav-links";
  return `<div class="${cls}" id="nav-menu">
          <a href="${prefix}index.html#story">Story</a>
          <a href="${prefix}articles/index.html">Articles</a>
          <a href="${prefix}guides/">Guides</a>
          <a href="${prefix}glossary/">Glossary</a>
          <a href="${prefix}quiz/">Quiz</a>
          <a href="${prefix}index.html#comparison">Compare</a>
          <a href="${prefix}about.html">About</a>
        </div>`;
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

function scripts(prefix = "", extra = "") {
  return `<script src="${prefix}assets/js/affiliates.js" defer></script>
    <script src="${prefix}assets/js/analytics.js" defer></script>
    <script src="${prefix}script.js" defer></script>${extra}`;
}

function shell({ title, desc, canonical, prefix = "", mainClass = "", schema = [], body = "", extraScripts = "", ogType = "website" }) {
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
    <meta property="og:image" content="${siteUrl}/assets/brand/site-banner.svg">
    <meta name="twitter:card" content="summary_large_image">
    ${schema.map(jsonScript).join("\n    ")}
    <link rel="icon" href="/assets/brand/logo-mark.svg" type="image/svg+xml">
    <link rel="stylesheet" href="${prefix}styles.css">
  </head>
  <body>
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
        ${nav(prefix)}
      </nav>
    </header>

    <main id="main"${mainClass ? ` class="${mainClass}"` : ""}>
${body}
    </main>

    ${footer(prefix)}
    ${scripts(prefix, extraScripts)}
  </body>
</html>
`;
}

const allTerms = glossaryGroups.flatMap((group) => group.terms);
const letters = [...new Set(allTerms.map((item) => item.term[0].toUpperCase()))].sort();
const glossarySeenLetters = new Set();
const definedTermSet = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Pilates Explained Glossary",
  url: `${siteUrl}/glossary/`,
  hasDefinedTerm: allTerms.map((item) => ({
    "@type": "DefinedTerm",
    name: item.term,
    description: item.definition,
    url: `${siteUrl}/glossary/#${item.slug}`,
  })),
};

const breadcrumb = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

const glossaryBody = `      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-current="page">Glossary</span></nav>
      <section class="article-index-hero glossary-hero">
        <p class="eyebrow">Glossary</p>
        <h1>Pilates Glossary</h1>
        <p>Short definitions for the apparatus, principles, lineage terms, and class language that appear across Pilates Explained.</p>
        <nav class="az-nav" aria-label="Glossary letters">
          ${letters.map((letter) => `<a href="#letter-${letter.toLowerCase()}">${letter}</a>`).join("")}
        </nav>
      </section>
      <section class="section glossary-section" aria-labelledby="glossary-title">
        <h2 id="glossary-title" class="sr-only">Glossary terms</h2>
        ${glossaryGroups
          .map(
            (group) => `<section class="glossary-group" aria-labelledby="${slugify(group.title)}">
          <h2 id="${slugify(group.title)}">${escapeHtml(group.title)}</h2>
          ${group.terms
            .map(
              (item) => {
                const letter = item.term[0].toLowerCase();
                const letterAnchor = !glossarySeenLetters.has(letter) ? `<p class="letter-anchor" id="letter-${letter}" aria-hidden="true"></p>` : "";
                glossarySeenLetters.add(letter);
                return `<article class="glossary-term" id="${item.slug}">
            ${letterAnchor}
            <h3>${escapeHtml(item.term)}</h3>
            <p>${escapeHtml(item.definition)}${
                item.linkHref ? ` <a href="${item.linkHref}">${escapeHtml(item.linkLabel)}</a>` : ""
              }</p>
          </article>`;
              }
            )
            .join("\n          ")}
        </section>`
          )
          .join("\n        ")}
      </section>`;

write(
  "glossary/index.html",
  shell({
    title: "Pilates Glossary | Pilates Explained",
    desc: "Definitions for Pilates apparatus, Contrology principles, lineage terms, and class language.",
    canonical: `${siteUrl}/glossary/`,
    prefix: "../",
    schema: [
      definedTermSet,
      breadcrumb([
        { name: "Home", url: `${siteUrl}/` },
        { name: "Glossary", url: `${siteUrl}/glossary/` },
      ]),
    ],
    body: glossaryBody,
  })
);

write(
  "assets/js/quiz.js",
  `(() => {
  const root = document.querySelector("[data-quiz]");
  if (!root) return;

  const order = ["classical", "contemporary", "lagree", "onlineMat"];
  const labels = {
    classical: "Classical Pilates",
    contemporary: "Contemporary Pilates",
    lagree: "Lagree",
    onlineMat: "Online / Mat at Home",
  };
  const profiles = {
    classical: {
      headline: "Classical Pilates - go to the source",
      copy: "You're drawn to the original method as Joseph and Clara Pilates taught it - precise, apparatus-based, and lineage-driven. Look for instructors trained directly in classical lineages (often through schools like Romana's Pilates or The Pilates Center), and expect a slower, more deliberate introduction than a typical gym class.",
      links: [
        ["What Is Contrology?", "../articles/what-is-contrology.html"],
        ["Classical vs Modern Pilates", "../articles/classical-vs-modern-pilates-explained.html"],
        ["History of the Reformer", "../articles/history-of-the-reformer.html"],
      ],
      cta: '<a class="button primary" href="../assets/downloads/pilates-starter-decision-guide.pdf" download>Download the starter guide</a>',
    },
    contemporary: {
      headline: "Contemporary Pilates - the adaptable middle path",
      copy: "You'd benefit from a contemporary approach - same roots, but adapted with modern movement science to your body, goals, and any injuries. This is the most widely available style, found at most studios and many gyms.",
      links: [
        ["Classical vs Modern Pilates", "../articles/classical-vs-modern-pilates-explained.html"],
        ["History of the Reformer", "../articles/history-of-the-reformer.html"],
        ["Mat vs Reformer vs Online cost guide", "../guides/mat-vs-reformer-vs-online-pilates-cost.html"],
      ],
      cta: '<a class="button primary" href="#affiliate-link-pending" data-aff="classpass" data-affiliate-link target="_blank" rel="sponsored noopener">Find a class near you</a>',
    },
    lagree: {
      headline: "Lagree - a serious workout, not Pilates (and that's OK)",
      copy: "Based on your answers, you're after intensity more than the Pilates method itself - and Lagree, a separate proprietary system performed on Megaformer-style machines, is likely a better fit than classical or contemporary Pilates. Worth knowing going in: Lagree is historically and pedagogically distinct from Pilates, even though the machines look similar.",
      links: [
        ["What Is Lagree? Not Pilates", "../articles/what-is-lagree-not-pilates.html"],
        ["Classical/Modern/Lagree: How to Choose", "../articles/classical-modern-lagree-how-to-choose.html"],
      ],
      cta: '<a class="button primary" href="../assets/downloads/pilates-starter-decision-guide.pdf" download>Download the starter guide</a>',
    },
    onlineMat: {
      headline: "Start at home - mat Pilates and online classes",
      copy: "You want flexibility, low cost, and the ability to start today. Mat Pilates - many of it drawn from Joseph Pilates' original 34 exercises - is a great low-barrier entry point, and online platforms can guide you through it.",
      links: [
        ["Pilates Starter Decision Guide", "../assets/downloads/pilates-starter-decision-guide.pdf"],
        ["Mat Buying Guide", "../guides/pilates-mat-buying-guide.html"],
        ["Mat vs Reformer vs Online cost guide", "../guides/mat-vs-reformer-vs-online-pilates-cost.html"],
      ],
      cta: '<a class="button primary" href="../assets/downloads/pilates-starter-decision-guide.pdf" download>Download the starter guide</a><a class="button secondary" href="#affiliate-link-pending" data-aff="pilatesanytime" data-affiliate-link target="_blank" rel="sponsored noopener">Explore Pilates Anytime</a>',
    },
  };

  const questions = [
    {
      text: "What's pulling you toward Pilates right now?",
      options: [
        ["A", "I want to get stronger and move better generally", { contemporary: 2, classical: 1 }],
        ["B", "I'm recovering from an injury, surgery, or a health setback", { contemporary: 2, rehabAdjacent: 2 }],
        ["C", "I want a serious, sweaty workout", { lagree: 3 }],
        ["D", "I'm curious about the original method and its history", { classical: 3 }],
      ],
    },
    {
      text: "How much time and money do you want to commit per week, realistically?",
      options: [
        ["A", "A few minutes a day, on my own, free", { onlineMat: 3 }],
        ["B", "1-2 classes a week at a studio", { contemporary: 2, classical: 1 }],
        ["C", "I want to invest seriously - private sessions, real progression", { classical: 3 }],
        ["D", "High-intensity group classes, a few times a week", { lagree: 2, contemporary: 1 }],
      ],
    },
    {
      text: "How do you feel about equipment?",
      options: [
        ["A", "Never used a reformer - a bit intimidated", { contemporary: 1, onlineMat: 2 }],
        ["B", "I'd love to learn the full apparatus system properly", { classical: 3 }],
        ["C", "I just want a great workout, equipment doesn't matter", { lagree: 2, contemporary: 1 }],
        ["D", "I prefer working out at home", { onlineMat: 3 }],
      ],
    },
    {
      text: "What matters most to you in an instructor?",
      options: [
        ["A", "Deep knowledge of the method and its history/lineage", { classical: 3 }],
        ["B", "Someone who can adapt the work to my body and goals", { contemporary: 3 }],
        ["C", "High energy, motivating, pushes me", { lagree: 3 }],
        ["D", "Doesn't matter much - I'm mostly doing this on my own", { onlineMat: 2 }],
      ],
    },
    {
      text: "Which sounds most appealing for a first session?",
      options: [
        ["A", "A calm, precise, one-on-one introduction to the original exercises", { classical: 3 }],
        ["B", "A welcoming small-group class that adapts to all levels", { contemporary: 3 }],
        ["C", "An intense, fast-paced studio class with a machine", { lagree: 3 }],
        ["D", "A free video I can try at home tonight", { onlineMat: 3 }],
      ],
    },
  ];

  let index = 0;
  let answers = [];
  let started = false;

  const track = (name, params = {}) => window.PEAnalytics?.track?.(name, params);
  const scoreAnswers = () => {
    const scores = { classical: 0, contemporary: 0, lagree: 0, onlineMat: 0, rehabAdjacent: 0 };
    answers.forEach((answer) => {
      Object.entries(answer.scores).forEach(([key, value]) => {
        scores[key] = (scores[key] || 0) + value;
      });
    });
    const result = order.reduce((best, key) => (scores[key] > scores[best] ? key : best), order[0]);
    return { scores, result };
  };

  const renderQuestion = () => {
    const question = questions[index];
    root.innerHTML = \`
      <div class="quiz-progress" aria-label="Question \${index + 1} of \${questions.length}">
        <span>Question \${index + 1} of \${questions.length}</span>
        <div><i style="width: \${((index + 1) / questions.length) * 100}%"></i></div>
      </div>
      <fieldset class="quiz-card">
        <legend>\${question.text}</legend>
        <div class="quiz-options">
          \${question.options.map((option) => \`<button type="button" data-answer="\${option[0]}"><strong>\${option[0]}.</strong> \${option[1]}</button>\`).join("")}
        </div>
      </fieldset>
    \`;

    root.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!started) {
          started = true;
          track("quiz_start", { page_path: location.pathname });
        }
        const selected = question.options.find((option) => option[0] === button.dataset.answer);
        answers[index] = { label: selected[0], scores: selected[2] };
        track(\`quiz_question_\${index + 1}_answer\`, { answer: selected[0] });
        if (index === questions.length - 1) {
          renderResult();
        } else {
          index += 1;
          renderQuestion();
        }
      });
    });
  };

  const renderResult = () => {
    const { scores, result } = scoreAnswers();
    const profile = profiles[result];
    track("quiz_complete", { result: result === "onlineMat" ? "online-mat" : result });
    root.innerHTML = \`
      <section class="quiz-result" aria-live="polite">
        <p class="eyebrow">Your path</p>
        <h2>\${profile.headline}</h2>
        <p>\${profile.copy}</p>
        <ul>\${profile.links.map(([label, href]) => \`<li><a href="\${href}">\${label}</a></li>\`).join("")}</ul>
        <div class="button-row">\${profile.cta}<button class="button ghost" type="button" data-retake>Retake quiz</button></div>
        <p class="form-note">Scores: \${order.map((key) => \`\${labels[key]} \${scores[key]}\`).join(" · ")}</p>
      </section>
    \`;
    root.querySelector("[data-retake]").addEventListener("click", () => {
      index = 0;
      answers = [];
      started = false;
      renderQuestion();
    });
  };

  renderQuestion();
})();
`
);

write(
  "quiz/index.html",
  shell({
    title: "Which Pilates Path Fits You? | Pilates Explained",
    desc: "A five-question quiz to help beginners choose between classical Pilates, contemporary Pilates, Lagree, and online or mat practice.",
    canonical: `${siteUrl}/quiz/`,
    prefix: "../",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Which Pilates Path Fits You?",
        url: `${siteUrl}/quiz/`,
        description: "A five-question Pilates path quiz for beginners.",
      },
      breadcrumb([
        { name: "Home", url: `${siteUrl}/` },
        { name: "Quiz", url: `${siteUrl}/quiz/` },
      ]),
    ],
    body: `      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-current="page">Quiz</span></nav>
      <section class="article-index-hero quiz-hero">
        <p class="eyebrow">Quiz</p>
        <h1>Which Pilates Path Fits You?</h1>
        <p>Answer five quick questions to compare classical Pilates, contemporary Pilates, Lagree, and online or mat practice.</p>
      </section>
      <section class="section quiz-shell" aria-label="Pilates path quiz" data-quiz></section>
      <section class="section article-cta-card" aria-labelledby="quiz-newsletter-title">
        <p class="eyebrow">Free guide</p>
        <h2 id="quiz-newsletter-title">Get the Pilates Starter Decision Guide</h2>
        <p>You'll get your guide right away, plus a few short emails over the next two weeks - then occasional updates.</p>
        <div class="kit-form-shell">
          <script async data-uid="633f81fc5f" src="https://pilates-explained.kit.com/633f81fc5f/index.js"></script>
          <p class="form-note">Powered by Kit. You can unsubscribe at any time.</p>
        </div>
      </section>`,
    extraScripts: `\n    <script src="../assets/js/quiz.js" defer></script>`,
  })
);

function updateAllNavigation() {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".git") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html")) files.push(full);
    }
  };
  walk(root);
  files.forEach((file) => {
    const rel = path.relative(root, file);
    if (rel === "glossary/index.html" || rel === "quiz/index.html") return;
    const prefix = rel.includes("/") ? "../" : "";
    let html = fs.readFileSync(file, "utf8");
    html = html.replace(/<div class="nav-links(?: is-static)?"(?: id="nav-menu")?>[\s\S]*?<\/div>/, (match) =>
      nav(prefix, match.includes("is-static"))
    );
    fs.writeFileSync(file, html);
  });
}

function replaceFooterAndScriptsOnPage(rel, prefix) {
  let html = read(rel);
  html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, footer(prefix));
  html = html.replace(/\n    <script src="(?:\.\.\/)?assets\/js\/affiliates\.js" defer><\/script>[\s\S]*?<script src="(?:\.\.\/)?script\.js" defer><\/script>/, "");
  html = html.replace(/\n    <script src="(?:\.\.\/)?script\.js" defer><\/script>/, "");
  html = html.replace(/\n    <script src="(?:\.\.\/)?script\.js"><\/script>/, "");
  html = html.replace(/\n  <\/body>/, `\n    ${scripts(prefix)}\n  </body>`);
  write(rel, html);
}

function setHeadSchema(rel, schemaBlocks) {
  let html = read(rel).replace(/\n    <!-- PE_PROMPT08_SCHEMA_START -->[\s\S]*?<!-- PE_PROMPT08_SCHEMA_END -->/g, "");
  const block = `\n    <!-- PE_PROMPT08_SCHEMA_START -->\n    ${schemaBlocks.map(jsonScript).join("\n    ")}\n    <!-- PE_PROMPT08_SCHEMA_END -->`;
  html = html.replace("    <link rel=\"icon\"", `${block}\n    <link rel="icon"`);
  write(rel, html);
}

function updateAbout() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Michael",
    url: `${siteUrl}/about.html`,
    affiliation: {
      "@type": "Organization",
      name: "Pilates Explained",
      url: siteUrl,
    },
  };

  write(
    "about.html",
    shell({
      title: "About | Pilates Explained",
      desc: "Why Michael built Pilates Explained, how the site is sourced, and what it is not.",
      canonical: `${siteUrl}/about.html`,
      mainClass: "article-page",
      schema: [personSchema],
      body: `      <article>
        <header class="article-hero about-hero">
          <div>
            <p class="eyebrow">About</p>
            <h1>Why I Built Pilates Explained</h1>
            <p>Pilates Explained is a source-aware, story-first guide to where this method came from, what the equipment is for, and how to think about choosing a class.</p>
          </div>
          <div class="portrait-placeholder" role="img" aria-label="Simple illustrated portrait placeholder for Michael">
            <span aria-hidden="true"></span>
          </div>
        </header>
        <div class="article-body">
          <p>My name is Michael, and I started Pilates about seven years ago - initially as something to try, and then, without quite planning it, as part of getting through cancer treatment and the recovery that followed.</p>
          <blockquote class="pull-quote"><p>Pilates became part of how I rebuilt my strength - and how I started feeling like myself again.</p></blockquote>
          <p>I work with an instructor trained in classical Pilates, twice a week, and most days I try to spend even just a few minutes on a handful of the exercises on my own. Some days that's all the structure I need; other days it's the thing that makes the rest of the day possible.</p>
          <p>What surprised me wasn't just the physical change, though that's been real. It was learning that the method I was doing had a history - a real story, with real people, going back a hundred years - and that almost none of that story shows up when you search for "Pilates" online. Most of what's out there is either a class schedule or a sales pitch.</p>
          <p>I've also always loved hearing about people in their eighties and beyond for whom Pilates is still a daily part of life - not as an exercise trend, but as something woven into how they move through the world. That's the version of this practice that interests me most, and it's part of why this site leans into history and context rather than quick-fix promises.</p>
          <p>Pilates Explained is the result: a source-aware, story-first guide to where this method came from, what the equipment is for, and how to think about choosing a class - written from the perspective of someone who uses it, not someone selling it.</p>
          <p><strong>A note on what this site is (and isn't):</strong> I'm not a Pilates instructor, physical therapist, or doctor, and nothing here is medical advice. Where the site discusses health benefits or rehabilitation uses of Pilates, it aims to reflect the existing evidence honestly, including its limits. If you're considering Pilates as part of recovery from an illness, injury, or treatment, talk with your medical team and find an instructor experienced with your situation.</p>
          <h2>How This Site Is Built</h2>
          <p>This site combines project source materials, primary Pilates texts, external references, custom graphics, and AI-assisted research and production. Drafts are treated as working material and revised toward careful, source-aware storytelling.</p>
          <ul>
            <li><cite>Return to Life Through Contrology</cite> and Joseph Pilates' early writing are used to frame the original method and its language.</li>
            <li>External references include the Pilates Method Alliance, Britannica, Balanced Body legal-history material, and BBC Witness History.</li>
            <li>Project materials such as PilatesWebsiteStrategy, Pilates SEO and Content Strategy, The Pilates Blueprint, and The Biomechanical Dossier inform the site's architecture, article plan, and visual system.</li>
          </ul>
          <p class="article-note-card">Studios, educators, and media producers can review partnership and licensing options on the <a href="partners/">partners page</a>.</p>
        </div>
      </article>`,
    })
  );
}

function updateHomepage() {
  let html = read("index.html");
  if (!html.includes("PE_QUIZ_CALLOUT")) {
    const callout = `\n      <section class="section quiz-callout" data-pe-marker="PE_QUIZ_CALLOUT" aria-labelledby="quiz-callout-title">
        <div>
          <p class="eyebrow">Choose your path</p>
          <h2 id="quiz-callout-title">Not sure where to start?</h2>
          <p>Take the five-question quiz to compare classical Pilates, contemporary Pilates, Lagree, and online or mat practice.</p>
        </div>
        <a class="button primary" href="quiz/">Take the quiz</a>
      </section>`;
    html = html.replace(/(\s*<section class="section timeline-section")/, `${callout}$1`);
  }
  if (!html.includes("a few short emails over the next two weeks")) {
    const note = `          <p class="form-note">You'll get your guide right away, plus a few short emails over the next two weeks - then occasional updates.</p>\n`;
    html = html.replace(/(\s*<p class="download-note">)/, `\n${note}$1`);
  }
  write("index.html", html);
}

function updateHowToChooseArticle() {
  let html = read("articles/classical-modern-lagree-how-to-choose.html");
  if (!html.includes("PE_QUIZ_ARTICLE_CALLOUT")) {
    const callout = `<aside class="article-note-card" data-pe-marker="PE_QUIZ_ARTICLE_CALLOUT">
            <h2>Still choosing?</h2>
            <p>Take the <a href="../quiz/">Pilates path quiz</a> to compare classical Pilates, contemporary Pilates, Lagree, and online or mat practice.</p>
          </aside>`;
    html = html.replace(/(\s*<section class="article-sources")/, `\n          ${callout}$1`);
  }
  write("articles/classical-modern-lagree-how-to-choose.html", html);
}

function linkFirstInBody(rel, replacements) {
  let html = read(rel);
  const start = html.indexOf('<div class="article-body">');
  if (start < 0) return;
  const end = html.indexOf("</div>", start);
  if (end < 0) return;
  let body = html.slice(start, end);
  replacements.forEach(([text, href]) => {
    if (body.includes(`href="${href}"`)) return;
    const re = new RegExp(`(?<![">])\\b${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    body = body.replace(re, `<a href="${href}">${text}</a>`);
  });
  write(rel, html.slice(0, start) + body + html.slice(end));
}

function updateInlineGlossaryLinks() {
  linkFirstInBody("articles/history-of-the-reformer.html", [["Reformer", "../glossary/#reformer"], ["springs", "../glossary/#reformer"]]);
  linkFirstInBody("articles/history-of-the-cadillac.html", [["Cadillac", "../glossary/#cadillac"], ["springs", "../glossary/#cadillac"]]);
  linkFirstInBody("articles/history-of-the-wunda-chair.html", [["Wunda Chair", "../glossary/#wunda-chair"]]);
  linkFirstInBody("articles/pilates-barrels-and-spinal-decompression.html", [["Barrels", "../glossary/#barrel"], ["spine", "../glossary/#barrel"]]);
  linkFirstInBody("articles/what-is-contrology.html", [["Contrology", "../glossary/#contrology"], ["powerhouse", "../glossary/#powerhouse"], ["Precision", "../glossary/#precision"]]);
  linkFirstInBody("articles/pilates-elders-lineage.html", [["Elders", "../glossary/#the-elders"], ["Classical Pilates", "../glossary/#classical-pilates"]]);
}

function updateSitemap() {
  let xml = read("sitemap.xml");
  [
    ["https://pilatesexplained.com/glossary/", todayIso],
    ["https://pilatesexplained.com/quiz/", todayIso],
  ].forEach(([loc, lastmod]) => {
    if (!xml.includes(`<loc>${loc}</loc>`)) {
      xml = xml.replace("</urlset>", `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>\n</urlset>`);
    }
  });
  xml = xml.replace(/<loc>https:\/\/pilatesexplained\.com\/about\.html<\/loc><lastmod>[^<]+<\/lastmod>/, `<loc>https://pilatesexplained.com/about.html</loc><lastmod>${todayIso}</lastmod>`);
  xml = xml.replace(/<loc>https:\/\/pilatesexplained\.com\/<\/loc><lastmod>[^<]+<\/lastmod>/, `<loc>https://pilatesexplained.com/</loc><lastmod>${todayIso}</lastmod>`);
  write("sitemap.xml", xml);
}

function updateStyles() {
  let css = read("styles.css");
  if (!css.includes("PE_PROMPT08_STYLES")) {
    css += `

/* PE_PROMPT08_STYLES */
.glossary-hero,
.quiz-hero {
  padding-bottom: 2rem;
}

.az-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 1.25rem;
}

.az-nav a {
  display: inline-grid;
  min-width: 2.1rem;
  min-height: 2.1rem;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--white);
  color: var(--teal-dark);
  font-weight: 900;
  text-decoration: none;
}

.glossary-section {
  display: grid;
  gap: 2rem;
}

.glossary-group {
  display: grid;
  gap: 0.9rem;
}

.glossary-term {
  padding: 1.1rem;
  border: 1px solid var(--line);
  border-radius: var(--pe-radius);
  background: var(--white);
}

.glossary-term h3 {
  margin: 0 0 0.45rem;
}

.glossary-term p {
  margin: 0;
}

.letter-anchor {
  position: relative;
  top: -100px;
  margin: 0;
}

.quiz-callout,
.quiz-shell {
  display: grid;
  gap: 1rem;
  align-items: center;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.quiz-callout {
  grid-template-columns: minmax(0, 1fr) auto;
}

.quiz-progress {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--muted);
  font-weight: 900;
}

.quiz-progress div {
  height: 0.65rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--pe-purple-light);
}

.quiz-progress i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--pe-teal);
}

.quiz-card {
  margin: 0;
  padding: 1.2rem;
  border: 1px solid var(--line);
  border-radius: var(--pe-radius);
  background: var(--white);
}

.quiz-card legend {
  padding: 0;
  font-family: var(--pe-font-heading);
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  font-weight: 900;
}

.quiz-options {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.2rem;
}

.quiz-options button {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: var(--pe-radius);
  background: var(--pe-cream);
  color: var(--pe-dark);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.quiz-options button:hover,
.quiz-options button:focus-visible {
  border-color: var(--pe-teal);
  background: var(--teal-soft);
}

.quiz-result {
  padding: 1.2rem;
  border: 1px solid var(--line);
  border-radius: var(--pe-radius);
  background: var(--white);
}

.pull-quote {
  margin: 2rem 0;
  padding: 1.2rem 1.4rem;
  border-left: 5px solid var(--pe-teal);
  background: var(--teal-soft);
  font-family: var(--pe-font-heading);
  font-size: 1.45rem;
  font-weight: 900;
}

.about-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(180px, 280px);
  gap: 2rem;
  align-items: center;
}

.portrait-placeholder {
  display: grid;
  width: min(280px, 100%);
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: radial-gradient(circle at 50% 35%, var(--pe-purple-light) 0 18%, transparent 19%),
    linear-gradient(180deg, var(--white), var(--pe-cream));
}

.portrait-placeholder span {
  width: 46%;
  aspect-ratio: 1 / 1.35;
  border-radius: 999px 999px 40px 40px;
  background: var(--pe-teal);
  opacity: 0.22;
}

@media (max-width: 720px) {
  .quiz-callout,
  .about-hero {
    grid-template-columns: 1fr;
  }
}
`;
  }
  write("styles.css", css);
}

updateAllNavigation();
replaceFooterAndScriptsOnPage("index.html", "");
replaceFooterAndScriptsOnPage("about.html", "");
replaceFooterAndScriptsOnPage("articles/classical-modern-lagree-how-to-choose.html", "../");
updateAbout();
updateAllNavigation();
updateHomepage();
updateHowToChooseArticle();
updateInlineGlossaryLinks();
updateSitemap();
updateStyles();

console.log("Prompt 08 glossary, quiz, about, newsletter, nav, and sitemap updates complete.");
