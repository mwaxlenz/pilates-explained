(() => {
  const MEASUREMENT_ID = "G-39VK9SEDFK";
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
    ga.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
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
