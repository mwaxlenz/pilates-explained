const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const status = carousel.querySelector("[data-carousel-status]");
  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const render = () => {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
      slide.setAttribute("aria-hidden", String(index !== activeIndex));
    });
    if (status) {
      status.textContent = `${activeIndex + 1} / ${slides.length}`;
    }
  };

  if (!slides.length) {
    return;
  }

  prev?.addEventListener("click", () => {
    activeIndex = (activeIndex - 1 + slides.length) % slides.length;
    render();
  });

  next?.addEventListener("click", () => {
    activeIndex = (activeIndex + 1) % slides.length;
    render();
  });

  render();
});

document.querySelectorAll("video[data-preview-time]").forEach((video) => {
  const previewTime = Number(video.getAttribute("data-preview-time"));
  if (!Number.isFinite(previewTime) || previewTime <= 0) {
    return;
  }

  const seekToPreview = () => {
    if (video.dataset.previewReady === "true" || !Number.isFinite(video.duration)) {
      return;
    }
    video.currentTime = Math.min(previewTime, Math.max(video.duration - 0.25, 0));
    video.dataset.previewReady = "true";
  };

  video.addEventListener("loadedmetadata", seekToPreview, { once: true });
  if (video.readyState >= 1) {
    seekToPreview();
  }
});

const equipment = {
  reformer: {
    name: "Reformer",
    image: "assets/reformer-diagram.svg",
    alt: "Stylized Reformer diagram",
    description:
      "A sliding carriage, springs, straps, and footbar turn resistance into a precise full-body movement system. It is the clearest visual bridge between early rehabilitation ideas and the modern studio.",
  },
  cadillac: {
    name: "Cadillac",
    image: "assets/cadillac-diagram.svg",
    alt: "Stylized Cadillac diagram",
    description:
      "A raised table with a frame, springs, bars, and straps supports assisted movement, strength work, and rehabilitation-oriented exercises.",
  },
  chair: {
    name: "Wunda Chair",
    image: "assets/chair-diagram.svg",
    alt: "Stylized Wunda Chair diagram",
    description:
      "Compact equipment built around a spring-loaded pedal. Its small footprint makes balance, control, and strength demands immediately visible.",
  },
};

const equipmentButtons = document.querySelectorAll("[data-equipment]");
const equipmentName = document.querySelector("#equipment-name");
const equipmentDescription = document.querySelector("#equipment-description");
const equipmentImage = document.querySelector("#equipment-image");

equipmentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.getAttribute("data-equipment");
    const item = key ? equipment[key] : null;
    if (!item || !equipmentName || !equipmentDescription || !equipmentImage) {
      return;
    }

    equipmentButtons.forEach((candidate) => {
      const isActive = candidate === button;
      candidate.classList.toggle("is-active", isActive);
      candidate.setAttribute("aria-selected", String(isActive));
    });

    equipmentName.textContent = item.name;
    equipmentDescription.textContent = item.description;
    equipmentImage.setAttribute("src", item.image);
    equipmentImage.setAttribute("alt", item.alt);
  });
});

const newsletterForm = document.querySelector("#newsletter-form");
const newsletterMessage = document.querySelector("#newsletter-message");

if (newsletterForm && newsletterMessage) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(newsletterForm);
    const email = String(formData.get("email") || "").trim();

    if (!email) {
      newsletterMessage.textContent = "Enter an email address to receive the starter guide.";
      return;
    }

    const stored = JSON.parse(localStorage.getItem("pilatesNewsletterEmails") || "[]");
    if (!stored.includes(email)) {
      stored.push(email);
      localStorage.setItem("pilatesNewsletterEmails", JSON.stringify(stored));
    }

    newsletterMessage.textContent =
      "Saved in this browser for the MVP. Connect Kit before public launch.";
    newsletterForm.reset();
  });
}
