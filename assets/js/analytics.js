(() => {
  const MEASUREMENT_ID = "G-39VK9SEDFK";
  const STARTER_GUIDE_OFFER_ID = "starter_decision_guide";
  const STARTER_GUIDE_FORM_ID = "LrX80a";
  const gaEnabled =
    MEASUREMENT_ID !== "G-XXXXXXXXXX" &&
    navigator.doNotTrack !== "1" &&
    window.doNotTrack !== "1";

  const dataLayer = (() => {
    try {
      if (!window.dataLayer) {
        window.dataLayer = [];
      }
      return window.dataLayer;
    } catch {
      return [];
    }
  })();

  function gtag() {
    dataLayer.push(arguments);
  }

  const cleanText = (value) => (value || "").replace(/\s+/g, " ").trim();
  const trimParam = (value, limit = 100) => {
    const text = cleanText(value);
    return text.length > limit ? `${text.slice(0, limit - 1)}...` : text;
  };
  const compactParams = (params) =>
    Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
    );
  const slugFromPath = (path = location.pathname) => {
    const normalized = path.replace(/\/$/, "").split("/").pop() || "home";
    return normalized.replace(/\.html$/, "");
  };
  const inferContentType = (path = location.pathname) => {
    if (document.body?.dataset.contentType) return document.body.dataset.contentType;
    if (path.startsWith("/articles/")) return "article";
    if (path.startsWith("/guides/")) return "guide";
    if (path.startsWith("/quiz/")) return "quiz";
    if (path.startsWith("/teachers-guide/")) return "product";
    if (path.startsWith("/partners/")) return "partner";
    if (path.startsWith("/thanks/")) return "thank_you";
    if (path === "/" || path.endsWith("/index.html")) return "homepage";
    return "page";
  };
  const categoryForSlug = (slug) => {
    const equipment = ["history-of-the-reformer", "history-of-the-cadillac", "history-of-the-wunda-chair", "pilates-barrels-and-spinal-decompression", "why-springs-not-weights", "best-pilates-reformers-for-home"];
    const comparison = ["classical-modern-lagree-how-to-choose", "classical-vs-contemporary-pilates", "classical-vs-modern-pilates-explained", "what-is-lagree-not-pilates", "pilates-vs-yoga-history-of-two-parallel-methods"];
    const beginner = ["what-happens-first-pilates-class", "mat-vs-reformer-vs-online-pilates-cost", "pilates-mat-buying-guide"];
    const evidence = ["pilates-and-lower-back-pain-evidence"];
    if (equipment.includes(slug)) return "equipment";
    if (comparison.includes(slug)) return "comparison";
    if (beginner.includes(slug)) return "beginner";
    if (evidence.includes(slug)) return "evidence";
    if (slug === "index" || slug === "home") return "hub";
    return "history";
  };
  const currentPageParams = () => {
    const path = location.pathname;
    const slug = document.body?.dataset.articleSlug || slugFromPath(path);
    return {
      page_path: path,
      page_title: document.title,
      content_type: inferContentType(path),
      article_slug: slug,
      article_category: document.body?.dataset.articleCategory || categoryForSlug(slug),
    };
  };
  const linkParams = (link, extra = {}) => {
    const href = link.getAttribute("href") || "";
    const absolute = new URL(href, location.href);
    return {
      ...currentPageParams(),
      link_url: absolute.href,
      link_text: trimParam(link.textContent),
      cta_location: link.dataset.ctaLocation || link.closest("[data-cta-location]")?.dataset.ctaLocation || extra.cta_location,
      ...extra,
    };
  };

  if (gaEnabled) {
    const ga = document.createElement("script");
    ga.async = true;
    ga.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(ga);
    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID);
  }

  const track = (eventName, params = {}) => {
    const eventParams = compactParams({ ...currentPageParams(), ...params });
    if (gaEnabled && typeof gtag === "function") {
      gtag("event", eventName, eventParams);
    }
    document.dispatchEvent(new CustomEvent("pe:analytics", { detail: { eventName, params: eventParams } }));
  };

  try {
    window.PEAnalytics = { track };
  } catch {
    document.documentElement.dataset.analyticsGlobalBlocked = "true";
  }

  document.addEventListener("pe:track", (event) => {
    if (!event.detail?.eventName) return;
    track(event.detail.eventName, event.detail.params || {});
  });

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
          url = `${config.amazonBaseUrl || "https://www.amazon.com/s"}?${params.toString()}`;
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

  function trackLeadPage() {
    const offerId = document.body?.dataset.generateLead;
    if (!offerId) return;
    track("generate_lead", {
      offer_id: offerId,
      form_id: document.body.dataset.formId || STARTER_GUIDE_FORM_ID,
      lead_source: document.body.dataset.leadSource || "mailerlite",
    });
  }

  function bindScrollDepth() {
    let sent = false;
    const checkDepth = () => {
      if (sent) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const depth = (window.scrollY / scrollable) * 100;
      if (depth >= 90) {
        sent = true;
        track("scroll_90", { scroll_depth: 90 });
        window.removeEventListener("scroll", checkDepth);
      }
    };
    window.addEventListener("scroll", checkDepth, { passive: true });
    checkDepth();
  }

  document.addEventListener("DOMContentLoaded", () => {
    hydrateAffiliateLinks();
    trackLeadPage();
    bindScrollDepth();

    const pageEvent = document.body.getAttribute("data-page-event");
    if (pageEvent) {
      track(pageEvent);
    }

    if (document.body.matches("[data-product-page]")) {
      track("view_item", {
        item_name: "Pilates History for Teachers - The Sourcebook",
        content_type: "product",
      });
    }
  });

  document.addEventListener("click", (event) => {
    const formShell = event.target.closest?.(".mailerlite-form-shell");
    if (formShell) {
      track("starter_guide_cta_click", {
        offer_id: STARTER_GUIDE_OFFER_ID,
        form_id: STARTER_GUIDE_FORM_ID,
        cta_location: formShell.dataset.ctaLocation || "embedded_form",
      });
    }

    const link = event.target.closest?.("a[href]");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const absolute = new URL(href, location.href);
    const program = link.getAttribute("data-aff");
    const isPdf = href.endsWith(".pdf") || link.hasAttribute("download");
    const isInternal = absolute.origin === location.origin;

    if (absolute.hash === "#newsletter" || link.matches("[data-starter-guide-cta]")) {
      track("starter_guide_cta_click", linkParams(link, {
        offer_id: STARTER_GUIDE_OFFER_ID,
        cta_location: link.dataset.ctaLocation || "site_cta",
      }));
    }

    if (program) {
      track("affiliate_click", linkParams(link, { program }));
      if (href === "#affiliate-link-pending") {
        event.preventDefault();
      }
      return;
    }

    if (link.matches("[data-product-buy]")) {
      track("begin_checkout", linkParams(link, {
        item_name: "Pilates History for Teachers - The Sourcebook",
      }));
    }

    if (link.matches("[data-partner-contact]")) {
      track("partner_contact_click", linkParams(link));
    }

    if (link.matches("[data-featured-studio]")) {
      track("featured_studio_click", linkParams(link, {
        studio_name: trimParam(link.textContent),
      }));
    }

    if (isPdf) {
      track("pdf_download", linkParams(link, {
        offer_id: absolute.pathname.includes("pilates-starter-decision-guide") ? STARTER_GUIDE_OFFER_ID : undefined,
        cta_location: link.dataset.ctaLocation || "download_link",
      }));
    }

    if (!isInternal && absolute.protocol.startsWith("http")) {
      track("outbound_click", linkParams(link));
      return;
    }

    if (isInternal && !isPdf && absolute.pathname !== location.pathname) {
      track("select_content", linkParams(link, {
        destination_content_type: inferContentType(absolute.pathname),
      }));
    }
  });
})();
