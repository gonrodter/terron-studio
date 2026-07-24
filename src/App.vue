<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const assetMap = {
  "terron-logo.png": new URL("../assets/terron-logo.png", import.meta.url).href,
  "signature.png": new URL("../assets/signature.png", import.meta.url).href,
  "terron-pfp.webp": new URL("../assets/terron-pfp.webp", import.meta.url).href,
  "app-store-logo.png": new URL("../assets/app-store-logo.png", import.meta.url).href,
  "vertical-logo.png": new URL("../assets/vertical-logo.png", import.meta.url).href,
  "konecta-logo.jpeg": new URL("../assets/konecta-logo.jpeg", import.meta.url).href,
  "sngular-logo.webp": new URL("../assets/sngular-logo.webp", import.meta.url).href,
  "tuparty-logo.png": new URL("../assets/tuparty-logo.png", import.meta.url).href,
  "powerpool-logo.webp": new URL("../assets/powerpool-logo.webp", import.meta.url).href,
  "collecta-logo.webp": new URL("../assets/collecta-logo.webp", import.meta.url).href,
  "burntab-logo.png": new URL("../assets/burntab-logo.png", import.meta.url).href,
  "bbva-logo.webp": new URL("../assets/bbva-logo.webp", import.meta.url).href,
  "cambridge-logo.png": new URL("../assets/cambridge-logo.png", import.meta.url).href,
  "collecta-site.png": new URL("../assets/collecta-site.png", import.meta.url).href,
  "burntab-site.png": new URL("../assets/burntab-site.png", import.meta.url).href,
  "powerpool-site.png": new URL("../assets/powerpool-site.png", import.meta.url).href,
  "tuparty-site.png": new URL("../assets/tuparty-site.png", import.meta.url).href,
  "ducati-site.png": new URL("../assets/ducati-site.png", import.meta.url).href,
  "studio-site.png": new URL("../assets/studio-site.png", import.meta.url).href,
  "happy-face.png": new URL("../assets/happy-face.png", import.meta.url).href,
};

const asset = (file) => assetMap[file];

const email = "rodriguez.terron.gonzalo@gmail.com";
const phone = "+34 640 583 966";
const bookCallHref = "https://cal.eu/terron-studio/15min";

const bookModalOpen = ref(false);

const aboutFonts = [
  { label: "Inter", value: "'Inter', system-ui, sans-serif" },
  { label: "Phudu", value: "var(--font-display)" },
  { label: "Caveat", value: "var(--font-hand)" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "'SFMono-Regular', Menlo, monospace" },
];
const aboutWeights = [
  { label: "Light", value: 300 },
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semibold", value: 600 },
  { label: "Bold", value: 700 },
  { label: "Black", value: 800 },
];
const aboutSizes = [20, 28, 40];
const aboutText = {
  family: ref(aboutFonts[0].value),
  weight: ref(600),
  bold: ref(false),
  italic: ref(false),
  underline: ref(false),
  align: ref("left"),
  size: ref(28),
};
const aboutAlignPos = {
  left: { left: "0", tx: "0" },
  center: { left: "50%", tx: "-50%" },
  right: { left: "100%", tx: "-100%" },
};
const aboutTextStyle = computed(() => {
  const pos = aboutAlignPos[aboutText.align.value] || aboutAlignPos.left;
  return {
    fontFamily: aboutText.family.value,
    fontWeight: aboutText.bold.value ? 800 : aboutText.weight.value,
    fontStyle: aboutText.italic.value ? "italic" : "normal",
    textDecoration: aboutText.underline.value ? "underline" : "none",
    fontSize: `${aboutText.size.value}px`,
    left: pos.left,
    transform: `translateX(${pos.tx})`,
  };
});
const aboutBoxStyle = computed(() => ({
  height: `${Math.round(aboutText.size.value * 1.4)}px`,
}));

function openBook(event) {
  if (event) event.preventDefault();
  bookModalOpen.value = true;
  document.body.classList.add("modal-open");
}

function closeBook() {
  bookModalOpen.value = false;
  document.body.classList.remove("modal-open");
}

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/gonzalorodriguezterron/",
    iconPath:
      "M4.98 3.5a2.48 2.48 0 1 1-4.96 0 2.48 2.48 0 0 1 4.96 0ZM.36 8.02h4.28V22H.36V8.02ZM8.03 8.02h4.1v1.9h.06c.57-1.08 1.97-2.22 4.06-2.22 4.34 0 5.14 2.86 5.14 6.57V22h-4.27v-6.85c0-1.63-.03-3.73-2.27-3.73-2.28 0-2.63 1.78-2.63 3.61V22H8.03V8.02Z",
    viewBox: "0 0 22 22",
  },
  {
    name: "GitHub",
    href: "https://github.com/gonrodter",
    iconPath:
      "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.14c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18A10.96 10.96 0 0 1 12 6.06c.98 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13v3.15c0 .31.21.67.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z",
    viewBox: "0 0 24 24",
  },
  {
    name: "X",
    href: "https://x.com/Terr0nzz",
    iconPath:
      "M13.88 10.16 22.51.13h-2.04l-7.5 8.72L6.98.13H.08l9.05 13.17L.08 23.82h2.04l7.92-9.21 6.33 9.21h6.9l-9.39-13.66Zm-2.8 3.26-.92-1.31L2.87 1.67H6l5.89 8.43.92 1.31 7.66 10.97h-3.13l-6.26-8.96Z",
    viewBox: "0 0 24 24",
  },
];

const navItems = [
  { id: "top", label: "Home", href: "#top", icon: "M3 10.2 12 3l9 7.2M5 9v11h5v-6h4v6h5V9" },
  { id: "work", label: "Work", href: "#work", icon: "M4 7h5l2 2h9v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" },
  { id: "services", label: "Services", href: "#services", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4 1.6 3.4L17 12l-3.4 1.6L12 17l-1.6-3.4L7 12l3.4-1.6z" },
  { id: "pricing", label: "Pricing", href: "#pricing", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
  { id: "studio", label: "Studio", href: "#studio", icon: "M4 8h16v11H4zM9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" },
];

const startActions = [
  { label: "Book a call", href: bookCallHref, modal: true, pillIcon: "meet" },
  { label: "Send a message", href: `mailto:${email}`, pillIcon: "send" },
];

const companies = [
  { name: "Konecta", file: "konecta-logo.jpeg", rounded: true },
  { name: "SNGULAR", file: "sngular-logo.webp", rounded: true },
  { name: "TuParty", file: "tuparty-logo.png", rounded: true },
  { name: "PowerPool", file: "powerpool-logo.webp", rounded: true, white: true },
  { name: "Collecta", file: "collecta-logo.webp" },
  { name: "BurnTab", file: "burntab-logo.png" },
];

const projects = [
  {
    name: "Collecta",
    href: "https://trycollecta.com/",
    image: "collecta-site.png",
    alt: "Collecta website screenshot",
    caption: "Mobile app",
  },
  {
    name: "BurnTab",
    href: "https://burntab.com/",
    image: "burntab-site.png",
    alt: "BurnTab website screenshot",
    caption: "macOS product",
  },
  {
    name: "Aparicio & Alemany",
    href: "https://aparicio-alemany-arquitectos.vercel.app/",
    image: "studio-site.png",
    alt: "Aparicio & Alemany architecture studio website screenshot",
    caption: "Premium studio site",
  },
  {
    name: "Ducati W93",
    href: "https://www.ducatiweare93.com/",
    image: "ducati-site.png",
    alt: "Ducati W93 contest website screenshot",
    caption: "Campaign site",
  },
  {
    name: "PowerPool",
    href: "https://powerpool.io/",
    image: "powerpool-site.png",
    alt: "PowerPool website screenshot",
    caption: "Corporate site",
  },
];

const heroSlides = ["collecta-site.png", "burntab-site.png", "studio-site.png", "powerpool-site.png", "tuparty-site.png"];
const heroSlide = ref(0);
let heroTimer = null;

function heroPrev() {
  heroSlide.value = (heroSlide.value - 1 + heroSlides.length) % heroSlides.length;
}

function heroNext() {
  heroSlide.value = (heroSlide.value + 1) % heroSlides.length;
}

const strokeIcon = (d) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

const categories = [
  {
    label: "Website",
    svg: strokeIcon('<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 8.5h18"/><path d="M10 12.5l-2 2 2 2"/><path d="M14 12.5l2 2-2 2"/>'),
  },
  {
    label: "Web App",
    svg: strokeIcon('<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19.5h20"/>'),
  },
  {
    label: "Mobile App",
    svg: strokeIcon('<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M10.5 18h3"/>'),
  },
  {
    label: "Development",
    svg: strokeIcon('<path d="M8.5 8.5 5 12l3.5 3.5"/><path d="M15.5 8.5 19 12l-3.5 3.5"/><path d="M13.5 6l-3 12"/>'),
  },
  {
    label: "App Store screenshots",
    svg: `<span class="brand-clip"><img class="brand-img" src="${asset("app-store-logo.png")}" alt="" /></span>`,
  },
  {
    label: "See all Projects",
    href: "#work",
    featured: true,
    svg: '<svg viewBox="0 0 24 24"><defs><linearGradient id="mf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc5f6"/><stop offset="1" stop-color="#3f8fe6"/></linearGradient></defs><path fill="#a6d1f8" d="M3 7.2A2 2 0 0 1 5 5.2h4.1a2 2 0 0 1 1.42.6l1.06 1.06a2 2 0 0 0 1.42.59H19a2 2 0 0 1 2 2v2.05H3z"/><path fill="url(#mf)" d="M3 9.4a1.6 1.6 0 0 1 1.6-1.6h14.8A1.6 1.6 0 0 1 21 9.4v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  },
];

const board = [
  { image: "collecta-site.png", caption: "Live app", pin: "red", rotate: -4 },
  { image: "burntab-site.png", caption: "macOS app", pin: "green", rotate: 3 },
  { image: "studio-site.png", caption: "Premium studio site", pin: "tape", rotate: -3 },
  { image: "ducati-site.png", caption: "Campaign site", pin: "clip", rotate: 1.5 },
];

const storyArc = [
  { text: "We build our own products too — TuParty, BurnTab, Collecta." },
  { text: "An idea, a rough sketch, that feeling it could become something real.", emoji: "✏️" },
  { text: "But then came the hard part…", mark: "finding people to build it." },
  { text: "One person for UI, another for branding, someone else for motion. Explaining the vision again and again and again…" },
  { text: "Somewhere along the way the product stops feeling exciting — and trust us, it's not you." },
];

const problemPoints = [
  "Freelancers who never talk to each other",
  "Design that doesn't match the product",
  "A brand stitched from spare parts",
];

const services = [
  { index: "01", title: "Landing pages", description: "High-converting pages, designed and coded to load fast and sell clearly." },
  { index: "02", title: "Website design", description: "Full marketing and brand sites, from first layout to a live, responsive launch." },
  { index: "03", title: "Mobile app design", description: "iOS and Android product design — flows, screens and a build-ready UI kit." },
  { index: "04", title: "Web apps", description: "Dashboards, tools and platforms in production-ready React or Vue." },
  { index: "05", title: "Branding & logo", description: "Wordmarks, logos and visual systems that make a product unmistakably yours." },
  { index: "06", title: "Product design", description: "Flows and interfaces simple enough to actually use." },
  { index: "07", title: "Development", description: "We ship the real thing: responsive, accessible and fast — no handoff gap." },
  { index: "08", title: "Animation", description: "Motion for hero sections, product demos and launch moments." },
  { index: "09", title: "Pitch decks", description: "Investor and sales decks that look like the product behind them." },
];

const story = [
  "Careful about the details that matter: if something doesn't feel right, we don't ship it.",
];

const pricingTabs = [
  {
    id: "landing",
    label: "Landing Page",
    title: "Landing Page",
    days: "15–20 days",
    base: 1900,
    label2: "Landing page design",
    addons: {
      dev: { label: "Add Development", price: 1200 },
      pages: { label: "Extra Pages", price: 250, unit: "/page" },
    },
    features: [
      "Custom wireframe & layout",
      "Desktop, tablet & mobile responsive",
      "Figma file included",
      "No limit to revisions",
      "Updates every 48 hours",
    ],
  },
  {
    id: "webapp",
    label: "Web App",
    retainerOnly: true,
  },
  {
    id: "mobile",
    label: "Mobile App",
    retainerOnly: true,
  },
  {
    id: "screenshots",
    label: "App Store Screenshots",
    title: "App Store Screenshots",
    days: "5–8 days",
    base: 800,
    label2: "Store screenshots",
    note: "Price is for 6 screens",
    addons: {
      pages: { label: "Extra Screens", price: 90, unit: "/screen" },
    },
    features: [
      "6 screens included",
      "iOS & Android sizes",
      "Device frames & captions",
      "No limit to revisions",
      "Source files included",
    ],
  },
];

const activeTab = ref("landing");
const addDev = ref(false);
const extraPages = ref(0);
const extraAnims = ref(0);
const activeTier = computed(() => pricingTabs.find((tab) => tab.id === activeTab.value));
const retainerTasks = ref(1);

function selectTab(id) {
  activeTab.value = id;
  addDev.value = false;
  extraPages.value = 0;
  extraAnims.value = 0;
  nextTick(() => {
    updateTabIndicator();
    tabsWrap.value
      ?.querySelector(".pricing-tab.is-active")
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
}

// sliding indicator behind the active pricing tab
const tabsWrap = ref(null);
const tabIndicator = ref({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });
const tabIndicatorStyle = computed(() => ({
  transform: `translate(${tabIndicator.value.left}px, ${tabIndicator.value.top}px)`,
  width: `${tabIndicator.value.width}px`,
  height: `${tabIndicator.value.height}px`,
  opacity: tabIndicator.value.opacity,
}));
function updateTabIndicator() {
  const wrap = tabsWrap.value;
  const active = wrap?.querySelector(".pricing-tab.is-active");
  if (!active) return;
  tabIndicator.value = {
    left: active.offsetLeft,
    top: active.offsetTop,
    width: active.offsetWidth,
    height: active.offsetHeight,
    opacity: 1,
  };
}

// keep the panel container mounted; only tween its height while inner content swaps
const pricingShell = ref(null);
const panelHeight = ref("auto");
const panelAnimating = ref(false);
function tabBeforeLeave() {
  if (pricingShell.value) panelHeight.value = `${pricingShell.value.offsetHeight}px`;
  panelAnimating.value = true;
}
function tabEnter(el, done) {
  const shell = pricingShell.value;
  const target = el.offsetHeight;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    shell?.removeEventListener("transitionend", onEnd);
    done();
  };
  const onEnd = (e) => {
    if (e.target === shell && e.propertyName === "height") finish();
  };
  shell?.addEventListener("transitionend", onEnd);
  window.setTimeout(finish, 480);
  requestAnimationFrame(() => {
    panelHeight.value = `${target}px`;
  });
}
function tabAfterEnter() {
  panelHeight.value = "auto";
  panelAnimating.value = false;
}

const totalPrice = computed(() => {
  const tier = activeTier.value;
  if (!tier || tier.retainerOnly) return 0;
  let total = tier.base;
  if (addDev.value && tier.addons.dev) total += tier.addons.dev.price;
  if (tier.addons.pages) total += extraPages.value * tier.addons.pages.price;
  if (tier.addons.anim) total += extraAnims.value * tier.addons.anim.price;
  return total;
});

const euro = (value) => `€${value.toLocaleString("es-ES")}`;

const categoryGridRef = ref(null);
let categoryMagnetFrame = 0;

function handleCategoryPointerMove(event) {
  const grid = categoryGridRef.value;
  if (!grid) return;
  const clientX = event.clientX;
  const clientY = event.clientY;
  if (categoryMagnetFrame) return;
  categoryMagnetFrame = requestAnimationFrame(() => {
    categoryMagnetFrame = 0;
    const radius = 170;
    grid.querySelectorAll(".category").forEach((item) => {
      const rect = item.getBoundingClientRect();
      const dx = clientX - (rect.left + rect.width / 2);
      const dy = clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const pull = (1 - dist / radius) * 0.42;
        item.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
      } else {
        item.style.transform = "";
      }
    });
  });
}

function resetCategoryMagnet() {
  const grid = categoryGridRef.value;
  if (!grid) return;
  grid.querySelectorAll(".category").forEach((item) => {
    item.style.transform = "";
  });
}

const activeSection = ref("top");
const isMobile = ref(false);
const mobileMenuOpen = ref(false);
const contentRef = ref(null);
const mobileQuery = ref(null);
let navFrame = 0;
let revealObserver = null;

const fragmentation = "INCONSISTENCY".split("");
const companyLogosAnimating = ref(false);
let companyLogosAnimationTimer = null;

function getScrollTop() {
  return isMobile.value ? window.scrollY : contentRef.value?.scrollTop ?? 0;
}

function getSectionTop(section) {
  return isMobile.value
    ? section.getBoundingClientRect().top + window.scrollY
    : section.offsetTop;
}

function setActiveSection() {
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  if (!sections.length) return;

  const anchor = getScrollTop() + 160;
  let current = sections[0].dataset.section;

  sections.forEach((section) => {
    if (anchor >= getSectionTop(section)) {
      current = section.dataset.section;
    }
  });

  const scrollRoot = contentRef.value;
  const maxedDesktopScroll =
    !isMobile.value &&
    scrollRoot &&
    scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 24;
  const maxedPageScroll =
    isMobile.value &&
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 24;

  activeSection.value = maxedDesktopScroll || maxedPageScroll ? sections.at(-1).dataset.section : current;
}

function requestActiveSectionUpdate() {
  if (navFrame) return;
  navFrame = requestAnimationFrame(() => {
    navFrame = 0;
    setActiveSection();
  });
}

function setMobileMenuOpen(isOpen) {
  mobileMenuOpen.value = isOpen;
  document.body.classList.toggle("mobile-menu-open", isOpen);
}

function handleAnchorClick(event) {
  const href = event.currentTarget.getAttribute("href");
  const target = href && href.startsWith("#") ? document.querySelector(href) : null;

  if (mobileMenuOpen.value) {
    setMobileMenuOpen(false);
  }

  if (!target || !contentRef.value || isMobile.value) return;

  event.preventDefault();
  contentRef.value.scrollTo({
    top: target.offsetTop - 24,
    behavior: "smooth",
  });
}

function handleMediaChange(event) {
  isMobile.value = event.matches;
  if (!event.matches) {
    setMobileMenuOpen(false);
  }
  setupRevealObserver();
  requestActiveSectionUpdate();
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    setMobileMenuOpen(false);
    closeBook();
  }
}

function triggerCompanyLogoAnimation() {
  if (companyLogosAnimationTimer) {
    window.clearTimeout(companyLogosAnimationTimer);
  }
  companyLogosAnimating.value = false;
  window.requestAnimationFrame(() => {
    companyLogosAnimating.value = true;
    companyLogosAnimationTimer = window.setTimeout(() => {
      companyLogosAnimating.value = false;
      companyLogosAnimationTimer = null;
    }, 1080);
  });
}

function setupRevealObserver() {
  revealObserver?.disconnect();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = Array.from(
    document.querySelectorAll(
      [
        ".section-observe .section-heading",
        ".hero-inner > *",
        ".hero-media",
        ".narrative p",
        ".problem-block > *",
        ".solution-block > *",
        ".board",
        ".about-block > *",
        ".studio-lead",
        ".studio-section .story-copy p",
        ".section-lead",
        ".category",
        ".transition-note",
        ".pricing-panel",
        ".team-card",
        ".letter p:not(.letter-label)",
        ".letter-sign",
        ".final-cta > *",
        ".service-card",
      ].join(", ")
    )
  );

  const groupCounters = new Map();
  targets.forEach((target) => {
    target.classList.add("scroll-reveal");
    const parent = target.parentElement;
    const order = groupCounters.get(parent) ?? 0;
    groupCounters.set(parent, order + 1);
    target.style.setProperty("--reveal-delay", `${Math.min(order, 6) * 80}ms`);
  });

  // Prose blocks reveal line by line (top→bottom mask wipe) instead of as a
  // single block. Only text paragraphs — not cards, media or headings.
  const proseSelector = [
    ".hero-title",
    ".hero-eyebrow",
    ".narrative p",
    ".problem-lead",
    ".problem-points li",
    ".solution-lead",
    ".transition-note",
    ".section-lead",
    ".studio-lead",
    ".studio-section .story-copy p",
    ".about-block p",
    ".letter p",
  ].join(", ");
  targets.forEach((target) => {
    if (target.matches?.(proseSelector)) target.classList.add("line-reveal");
  });

  // Inline accents (red highlights, hand-font text, bold) animate on their own
  // rhythm. Each accent is owned by its nearest reveal block and lit when that
  // block reveals, so timing always matches when the accent scrolls into view.
  // Split each highlight into per-word spans, group them by rendered line, and
  // give each word a delay so the fill paints word-by-word in reading order with
  // a short pause at every line break — a phrase that wraps paints line by line.
  document
    .querySelectorAll(".mark, .hl")
    .forEach((el) => el.classList.add("reveal-accent"));
  document
    .querySelectorAll(".narrative b")
    .forEach((el) => el.classList.add("reveal-accent"));
  document
    .querySelectorAll(".narrative i, .letter-label")
    .forEach((el) => el.classList.add("reveal-accent", "reveal-write"));

  const accents = Array.from(document.querySelectorAll(".reveal-accent"));
  const accentsByOwner = new Map();
  accents.forEach((accent) => {
    const owner = accent.closest(".scroll-reveal");
    if (!owner) {
      accent.classList.add("is-lit"); // no reveal block above it → just show
      return;
    }
    if (!accentsByOwner.has(owner)) accentsByOwner.set(owner, []);
    accentsByOwner.get(owner).push(accent);
  });

  const reveal = (target) => {
    const delay = Number.parseFloat(target.style.getPropertyValue("--reveal-delay")) || 0;
    window.setTimeout(() => {
      target.classList.add("is-visible");
      const keycaps =
        target.matches?.(".keycaps")
          ? [target]
          : Array.from(target.querySelectorAll(".keycaps"));
      keycaps.forEach((kc) => window.setTimeout(() => kc.classList.add("is-writing"), 120));
      // Multiple accents in the same block light one after another, in
      // reading order, so each finishes before the next begins.
      (accentsByOwner.get(target) || []).forEach((accent, index) => {
        window.setTimeout(() => accent.classList.add("is-lit"), 180 + index * 760);
      });
    }, delay);
  };

  const heroTargets = Array.from(document.querySelectorAll(".hero-inner > .scroll-reveal"));
  window.requestAnimationFrame(() => {
    heroTargets.forEach((target, index) => {
      window.setTimeout(() => reveal(target), index * 90);
    });
  });

  if (reduceMotion || !targets.length) {
    targets.forEach((target) => target.classList.add("is-visible"));
    accents.forEach((accent) => accent.classList.add("is-lit"));
    return;
  }

  const rootBounds = isMobile.value
    ? { top: 0, bottom: window.innerHeight }
    : contentRef.value?.getBoundingClientRect();

  targets.forEach((target) => {
    const bounds = target.getBoundingClientRect();
    if (rootBounds && bounds.top < rootBounds.bottom && bounds.bottom > rootBounds.top) {
      reveal(target);
    }
  });

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        revealObserver?.unobserve(entry.target);
      });
    },
    {
      root: isMobile.value ? null : contentRef.value,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    }
  );

  targets.forEach((target) => revealObserver.observe(target));
}

onMounted(async () => {
  await nextTick();
  mobileQuery.value = window.matchMedia("(max-width: 820px)");
  isMobile.value = mobileQuery.value.matches;
  mobileQuery.value.addEventListener("change", handleMediaChange);

  contentRef.value?.addEventListener("scroll", requestActiveSectionUpdate, { passive: true });
  window.addEventListener("scroll", requestActiveSectionUpdate, { passive: true });
  window.addEventListener("resize", requestActiveSectionUpdate);
  window.addEventListener("keydown", handleKeydown);

  heroTimer = window.setInterval(() => {
    heroSlide.value = (heroSlide.value + 1) % heroSlides.length;
  }, 3200);

  setupRevealObserver();
  setActiveSection();
  updateTabIndicator();
  window.addEventListener("resize", updateTabIndicator);
});

onBeforeUnmount(() => {
  contentRef.value?.removeEventListener("scroll", requestActiveSectionUpdate);
  window.removeEventListener("scroll", requestActiveSectionUpdate);
  window.removeEventListener("resize", requestActiveSectionUpdate);
  window.removeEventListener("resize", updateTabIndicator);
  window.removeEventListener("keydown", handleKeydown);
  mobileQuery.value?.removeEventListener("change", handleMediaChange);
  revealObserver?.disconnect();
  if (companyLogosAnimationTimer) window.clearTimeout(companyLogosAnimationTimer);
  if (heroTimer) window.clearInterval(heroTimer);
  if (categoryMagnetFrame) cancelAnimationFrame(categoryMagnetFrame);
  document.body.classList.remove("mobile-menu-open");
  if (navFrame) cancelAnimationFrame(navFrame);
});

// 3D tilt on price cards, driven by mouse position
const vTilt = {
  mounted(el) {
    if (window.matchMedia("(hover: none)").matches) return;
    const MAX = 10; // deg
    let frame = null;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--ry", `${px * MAX * 2}deg`);
        el.style.setProperty("--rx", `${-py * MAX * 2}deg`);
        el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
        el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
      });
    };
    const onEnter = () => el.classList.add("is-tilting");
    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      el.classList.remove("is-tilting");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--rx", "0deg");
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el._tilt = { onMove, onEnter, onLeave };
  },
  unmounted(el) {
    if (!el._tilt) return;
    el.removeEventListener("mousemove", el._tilt.onMove);
    el.removeEventListener("mouseenter", el._tilt.onEnter);
    el.removeEventListener("mouseleave", el._tilt.onLeave);
  },
};
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar" aria-label="Portfolio navigation">
      <div class="sidebar-top">
        <div class="brand-row">
          <a class="brand" href="#top" aria-label="Terron Studio home" @click="handleAnchorClick">
            <img class="brand-mark" :src="asset('terron-logo.png')" alt="Terron Studio" />
          </a>
        </div>

        <nav class="rail-nav">
          <a
            v-for="item in navItems"
            :key="item.id"
            class="rail-link"
            :class="{ 'is-active': activeSection === item.id }"
            :href="item.href"
            @click="handleAnchorClick"
          >
            <span class="rail-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path :d="item.icon" /></svg>
            </span>
            <span class="rail-text">{{ item.label }}</span>
            <span class="rail-arrow" aria-hidden="true"></span>
          </a>
        </nav>

        <div class="rail-group">
          <p class="rail-group-label">Start project</p>
          <a
            v-for="action in startActions"
            :key="action.label"
            class="rail-action"
            :href="action.href"
            @click="action.modal && openBook($event)"
          >
            <span class="rail-icon accent" aria-hidden="true">
              <span class="pill-icon" :class="action.pillIcon"></span>
            </span>
            <span class="rail-text">{{ action.label }}</span>
          </a>
        </div>

      </div>

      <div class="sidebar-bottom">
        <p class="rail-label"><span class="rail-label-lighter">Trusted by</span> 8+ teams</p>
        <div
          class="company-logo-grid"
          :class="{ 'is-animating': companyLogosAnimating }"
          @pointerenter="triggerCompanyLogoAnimation"
        >
          <img
            v-for="(company, index) in companies"
            :key="company.name"
            :class="{ 'logo-rounded': company.rounded, 'logo-white': company.white }"
            :style="{ '--logo-index': index }"
            :src="asset(company.file)"
            :alt="company.name"
          />
        </div>
      </div>
    </aside>

    <header class="mobile-header" :class="{ 'is-open': mobileMenuOpen }">
      <a class="brand compact" href="#top" aria-label="Terron Studio home" @click="handleAnchorClick">
        <span class="brand-mark">
          <img :src="asset('terron-logo.png')" alt="Terron Studio" />
        </span>
        <span class="brand-text">Terron Studio</span>
      </a>

      <button
        class="mobile-menu-toggle"
        type="button"
        :aria-label="mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
        :aria-expanded="String(mobileMenuOpen)"
        aria-controls="mobile-menu"
        @click="setMobileMenuOpen(!mobileMenuOpen)"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>

    <nav id="mobile-menu" class="mobile-menu" :class="{ 'is-open': mobileMenuOpen }" aria-label="Mobile navigation">
      <div>
        <a
          v-for="item in navItems"
          :key="item.id"
          class="mobile-menu-link"
          :class="{ 'is-active': activeSection === item.id }"
          :href="item.href"
          @click="handleAnchorClick"
        >
          <span>{{ item.label }}</span>
        </a>
        <a class="mobile-menu-contact" :href="bookCallHref" @click="openBook($event); setMobileMenuOpen(false)">
          Book a call
        </a>
      </div>

      <div class="sidebar-bottom">
        <p class="rail-label"><span class="rail-label-lighter">Trusted by</span> 8+ teams</p>
        <div class="company-logo-grid">
          <img
            v-for="company in companies"
            :key="company.name"
            :class="{ 'logo-rounded': company.rounded, 'logo-white': company.white }"
            :src="asset(company.file)"
            :alt="company.name"
          />
        </div>
      </div>
    </nav>

    <main id="top" ref="contentRef" class="content">
      <div class="main-panel">
        <!-- HERO -->
        <section class="hero section-observe" data-section="top">
          <div class="hero-inner">
            <p class="hero-eyebrow">Premium design + code for growing businesses</p>
            <h1 class="hero-title">
              The <img class="hero-inline-logo" :src="asset('terron-logo.png')" alt="" aria-hidden="true" /> studio
              <span class="soft">for businesses ready to give their users</span> a premium experience.
            </h1>
            <div class="hero-actions">
              <a class="pill-button" :href="bookCallHref" @click="openBook($event)">
                <span class="pill-icon meet" aria-hidden="true"></span>
                Book a call
              </a>
              <a class="pill-button" href="#work" @click="handleAnchorClick">
                <span class="pill-icon folder" aria-hidden="true"></span>
                See projects
              </a>
            </div>
          </div>

          <div class="hero-media" aria-label="Selected work preview">
            <div class="hero-media-frame">
              <img
                v-for="(slide, index) in heroSlides"
                :key="slide"
                :class="{ 'is-active': heroSlide === index }"
                :src="asset(slide)"
                alt=""
                aria-hidden="true"
              />
              <div class="hero-media-glow"></div>
              <span class="hero-media-brand">TERRON STUDIO</span>
            </div>
          </div>
        </section>

        <!-- NARRATIVE: how we got here -->
        <section class="section narrative">
          <p>We've built and shipped <b>our own real products</b>, start to finish.</p>
          <p>So we know what a <i>premium experience</i> actually takes <span class="emoji">✨</span></p>
          <p>Most businesses that want to step up hit the same wall… <span class="mark">“finding the right people to build it.”</span></p>
          <p>One person for UI, another for branding, someone else for motion.<br />Explaining the vision again and again and again…</p>
          <p>Somewhere along the way the experience stops feeling premium — and your users notice.</p>
        </section>

        <!-- PROBLEM -->
        <section class="section problem-block">
          <div class="section-heading"><h2>What's the real problem?</h2></div>
          <p class="keycap-line">
            It's
            <span class="keycaps" aria-label="Fragmentation">
              <span v-for="(ch, i) in fragmentation" :key="i" class="keycap" :style="{ '--k': i }">{{ ch }}</span>
            </span>
          </p>
          <ul class="problem-points">
            <li v-for="point in problemPoints" :key="point">{{ point }}</li>
          </ul>
          <p class="problem-lead">
            A premium experience can't be assembled from pieces.<br />
            It has to feel like <span class="mark green">one thing.</span>
          </p>
        </section>

        <!-- SOLUTION + board -->
        <section id="work" class="section solution-block section-observe" data-section="work">
          <div class="section-heading">
            <h2><span class="desk-only">What's the solution?</span><span class="mob-only">Why we exist</span></h2>
          </div>
          <div class="solution-problem mob-only">
            <p class="solution-problem-lead">Most brands hit the same wall: <span class="mark">fragmentation.</span></p>
            <ul class="solution-problem-points">
              <li v-for="point in problemPoints" :key="point">{{ point }}</li>
            </ul>
            <p class="solution-problem-note">A premium experience can't be assembled from pieces — it has to feel like <span class="mark green">one thing.</span></p>
          </div>
          <p class="solution-lead">
            That's why we built
            <span class="brand-inline">Terron Studio</span>
          </p>

          <div class="board" aria-label="Selected work">
            <a
              v-for="(card, index) in board"
              :key="index"
              class="board-card"
              :class="[`pin-${card.pin}`, { cover: card.cover }]"
              :style="{ '--rot': `${card.rotate}deg` }"
              :href="projects[index] ? projects[index].href : '#work'"
              target="_blank"
              rel="noreferrer"
            >
              <span class="board-photo"><img :src="asset(card.image)" :alt="card.caption" /></span>
              <span class="board-caption">{{ card.caption }}</span>
            </a>
          </div>

          <p class="solution-motto">
            <span class="soft">Not another agency.</span>
            <span class="soft">Not a marketplace of freelancers…</span>
            <br />
            But <span class="mark green">one team that sees the whole picture.</span>
          </p>
        </section>

        <!-- ABOUT -->
        <section class="section about-block section-observe" data-section="studio-about">
          <div class="section-heading"><h2>About Terron Studio</h2></div>
          <p class="about-lead">
            There's a reason we work as a studio and not a roster.<br />
            We're known for one thing:
          </p>
          <div class="about-box">
            <div class="edit-toolbar">
              <label class="et-field">
                <select class="et-select" v-model="aboutText.family.value" aria-label="Font">
                  <option v-for="f in aboutFonts" :key="f.label" :value="f.value">{{ f.label }}</option>
                </select>
                <span class="et-chevron"></span>
              </label>
              <label class="et-field">
                <select class="et-select" v-model.number="aboutText.weight.value" aria-label="Weight">
                  <option v-for="w in aboutWeights" :key="w.value" :value="w.value">{{ w.label }}</option>
                </select>
                <span class="et-chevron"></span>
              </label>
              <label class="et-field">
                <select class="et-select" v-model.number="aboutText.size.value" aria-label="Size">
                  <option v-for="s in aboutSizes" :key="s" :value="s">{{ s }}px</option>
                </select>
                <span class="et-chevron"></span>
              </label>
              <span class="et-sep"></span>
              <button type="button" class="et-btn et-bold" :class="{ 'is-active': aboutText.bold.value }" @click="aboutText.bold.value = !aboutText.bold.value">B</button>
              <button type="button" class="et-btn et-italic" :class="{ 'is-active': aboutText.italic.value }" @click="aboutText.italic.value = !aboutText.italic.value">I</button>
              <button type="button" class="et-btn et-underline" :class="{ 'is-active': aboutText.underline.value }" @click="aboutText.underline.value = !aboutText.underline.value">U</button>
              <span class="et-sep"></span>
              <button type="button" class="et-btn et-align" :class="{ 'is-active': aboutText.align.value === 'left' }" @click="aboutText.align.value = 'left'"><i></i><i></i><i></i></button>
              <button type="button" class="et-btn et-align align-center" :class="{ 'is-active': aboutText.align.value === 'center' }" @click="aboutText.align.value = 'center'"><i></i><i></i><i></i></button>
              <button type="button" class="et-btn et-align align-right" :class="{ 'is-active': aboutText.align.value === 'right' }" @click="aboutText.align.value = 'right'"><i></i><i></i><i></i></button>
            </div>
            <span class="about-box-text" :style="aboutBoxStyle">
              <span class="about-box-inner" :style="aboutTextStyle">Versatility</span>
            </span>
          </div>
          <p class="about-body">
            That's how we approach design. We don't force one “Terron style” onto everything…<br />
            Different products. Different audiences. Different energy.
          </p>
          <p class="about-body">Same level of care. See it yourself :)</p>
        </section>

        <!-- SHOWCASE categories -->
        <section id="services" class="section showcase-block section-observe" data-section="services">
          <div class="hero-media compact" aria-label="Studio preview">
            <div class="carousel">
              <div
                class="carousel-track"
                :style="{ transform: `translateX(-${heroSlide * 100}%)` }"
              >
                <div v-for="slide in heroSlides" :key="`c-${slide}`" class="carousel-slide">
                  <img :src="asset(slide)" alt="" aria-hidden="true" />
                </div>
              </div>
              <button class="carousel-arrow prev" type="button" aria-label="Previous" @click="heroPrev">
                <span></span>
              </button>
              <button class="carousel-arrow next" type="button" aria-label="Next" @click="heroNext">
                <span></span>
              </button>
              <div class="carousel-dots">
                <button
                  v-for="(slide, index) in heroSlides"
                  :key="`d-${slide}`"
                  type="button"
                  class="carousel-dot"
                  :class="{ 'is-active': heroSlide === index }"
                  :aria-label="`Go to slide ${index + 1}`"
                  @click="heroSlide = index"
                ></button>
              </div>
            </div>
          </div>

          <div
            class="category-grid"
            ref="categoryGridRef"
            @pointermove="handleCategoryPointerMove"
            @pointerleave="resetCategoryMagnet"
          >
            <component
              :is="cat.href ? 'a' : 'div'"
              v-for="cat in categories"
              :key="cat.label"
              class="category"
              :class="{ 'is-featured': cat.featured }"
              :href="cat.href"
              @click="cat.href && handleAnchorClick($event)"
            >
              <span class="category-icon" aria-hidden="true" v-html="cat.svg"></span>
              <span class="category-label">{{ cat.label }}</span>
            </component>
          </div>

        </section>

        <!-- TRANSITION -->
        <section class="section transition-section">
          <p class="transition-note">
            Okay, you've probably seen enough by now.<br />
            The work makes sense. The approach feels familiar. The process isn't heavy.<br />
            The next step doesn't need convincing — it just needs a <span class="mark green">decision.</span>
          </p>
        </section>

        <!-- PRICING -->
        <section id="pricing" class="section pricing-section section-observe" data-section="pricing">
          <div class="section-heading"><h2>Pricing</h2></div>
          <p class="section-lead">
            Choose between a <span class="hl">one-time plan</span> or a monthly retainer — whatever works for you.
          </p>

          <div class="pricing-tabs" role="tablist" ref="tabsWrap">
            <span class="pricing-tab-indicator" :style="tabIndicatorStyle" aria-hidden="true"></span>
            <button
              v-for="tab in pricingTabs"
              :key="tab.id"
              type="button"
              class="pricing-tab"
              :class="{ 'is-active': activeTab === tab.id }"
              role="tab"
              :aria-selected="String(activeTab === tab.id)"
              @click="selectTab(tab.id)"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="pricing-shell" v-if="!activeTier.retainerOnly" :class="{ 'is-animating': panelAnimating }" ref="pricingShell" :style="{ height: panelHeight }">
          <transition
            name="tab-fade"
            mode="out-in"
            @before-leave="tabBeforeLeave"
            @enter="tabEnter"
            @after-enter="tabAfterEnter"
          >
          <div class="pricing-panel" :key="activeTab">
            <div class="pricing-config">
              <div class="pricing-config-head">
                <h3>{{ activeTier.title }}</h3>
                <span class="pricing-days"><span class="clock" aria-hidden="true"></span>{{ activeTier.days }}</span>
              </div>

              <p v-if="activeTier.note" class="pricing-note">{{ activeTier.note }}</p>

              <button
                v-if="activeTier.addons.dev"
                type="button"
                class="addon-toggle"
                :class="{ 'is-on': addDev }"
                @click="addDev = !addDev"
              >
                <span class="addon-label">
                  {{ activeTier.addons.dev.label }}
                  <span class="addon-price">+{{ euro(activeTier.addons.dev.price) }}</span>
                </span>
                <span class="switch" :class="{ 'is-on': addDev }" aria-hidden="true"><i></i></span>
              </button>

              <div v-if="activeTier.addons.pages" class="addon-row">
                <span class="addon-label">{{ activeTier.addons.pages.label }}</span>
                <span class="addon-stepper">
                  <span class="addon-price">+{{ euro(activeTier.addons.pages.price) }}{{ activeTier.addons.pages.unit }}</span>
                  <span class="stepper">
                    <button type="button" @click="extraPages = Math.max(0, extraPages - 1)" aria-label="Less pages">–</button>
                    <b>{{ extraPages }}</b>
                    <button type="button" @click="extraPages++" aria-label="More pages">+</button>
                  </span>
                </span>
              </div>

              <div v-if="activeTier.addons.anim" class="addon-row">
                <span class="addon-label">{{ activeTier.addons.anim.label }}</span>
                <span class="addon-stepper">
                  <span class="addon-price">+{{ euro(activeTier.addons.anim.price) }}{{ activeTier.addons.anim.unit }}</span>
                  <span class="stepper">
                    <button type="button" @click="extraAnims = Math.max(0, extraAnims - 1)" aria-label="Less animations">–</button>
                    <b>{{ extraAnims }}</b>
                    <button type="button" @click="extraAnims++" aria-label="More animations">+</button>
                  </span>
                </span>
              </div>

              <ul class="pricing-features">
                <li v-for="feature in activeTier.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>

            <div class="pricing-summary">
              <div class="price-card" v-tilt>
                <span class="price-card-glare" aria-hidden="true"></span>
                <span class="price-card-brand">TERRON</span>
                <span class="price-card-label">{{ activeTier.label2 }}</span>
                <span class="price-card-value">{{ euro(totalPrice) }}</span>
              </div>
              <a class="button primary" :href="`mailto:${email}`">
                <span class="pill-icon send" aria-hidden="true"></span>
                Send a message
              </a>
              <a class="button secondary" :href="bookCallHref" @click="openBook($event)">
                <span class="pill-icon meet" aria-hidden="true"></span>
                Book a call
              </a>
            </div>
          </div>
          </transition>
          </div>

          <div class="retainer-card">
            <div class="retainer-config">
              <h3>Terron Retainer</h3>
              <div class="addon-row">
                <span class="addon-label">Active task</span>
                <span class="stepper green">
                  <button type="button" @click="retainerTasks = Math.max(1, retainerTasks - 1)" aria-label="Less tasks">–</button>
                  <b>{{ retainerTasks }}</b>
                  <button type="button" @click="retainerTasks++" aria-label="More tasks">+</button>
                </span>
              </div>
              <ul class="pricing-features">
                <li>All services included — design & development</li>
                <li>Desktop, tablet & mobile responsive</li>
                <li>Unlimited revisions, updates every 48h</li>
                <li>Pause or cancel anytime</li>
              </ul>
            </div>
            <div class="pricing-summary">
              <div class="price-card green" v-tilt>
                <span class="price-card-glare" aria-hidden="true"></span>
                <span class="price-card-brand">TERRON</span>
                <span class="price-card-label">Monthly retainer</span>
                <span class="price-card-value">{{ euro(3900 + (retainerTasks - 1) * 1500) }}<small>/mo</small></span>
              </div>
              <a class="button primary" :href="bookCallHref" @click="openBook($event)">
                <span class="pill-icon meet" aria-hidden="true"></span>
                Book a call
              </a>
            </div>
          </div>
        </section>

        <!-- WHO ARE WE -->
        <section id="studio" class="section studio-section section-observe" data-section="studio">
          <div class="section-heading"><h2>Who we are</h2></div>
          <p class="studio-lead">
            Terron Studio is led by <span class="lead-name"><img :src="asset('terron-pfp.webp')" alt="" aria-hidden="true" /> Gonzalo.</span><br />
            Builder first, founder second.
          </p>
          <div class="story-copy">
            <p v-for="paragraph in story" :key="paragraph">{{ paragraph }}</p>
          </div>
        </section>

        <!-- FINAL LETTER -->
        <section class="section final-cta">
          <div class="letter">
            <p class="letter-label">And here's a personal note</p>
            <p>Thanks for reading this far. Lastly, what I want to add is…</p>
            <p>
              Terron Studio is for businesses that care how their users perceive them — about how
              <span class="mark green">good design</span> impacts conversion and customer experience.
            </p>
            <p>
              If that's you, we'll make sure your product always feels premium. That's our promise.
            </p>
            <p>
              Someday you'll look back at where your brand started, and you'll remember two things: the moment
              it finally felt premium, and the team that helped you get there.
            </p>
            <p>You don't need ten tools. You don't need to overthink this.</p>
            <p class="letter-final">You just need <span class="mark green">Terron Studio.</span></p>
          </div>

          <div class="letter-sign">
            <img class="sign-mark" :src="asset('signature.png')" alt="Gonzalo Terrón signature" />
            <div>
              <p class="sign-name">Gonzalo Rodríguez Terrón</p>
              <p class="sign-role">Founder</p>
            </div>
          </div>

          <div class="hero-actions">
            <a class="pill-button" :href="bookCallHref" @click="openBook($event)">
              <span class="pill-icon meet" aria-hidden="true"></span>
              Book a call
            </a>
            <a class="pill-button" href="#work" @click="handleAnchorClick">
              <span class="pill-icon folder" aria-hidden="true"></span>
              See projects
            </a>
          </div>
        </section>
      </div>
    </main>

    <transition name="book-fade">
      <div v-if="bookModalOpen" class="book-modal" @click.self="closeBook">
        <div class="book-modal-card">
          <div class="book-modal-bar">
            <span class="book-modal-title">Book a call</span>
            <button class="book-modal-close" type="button" aria-label="Close" @click="closeBook">×</button>
          </div>
          <iframe :src="bookCallHref" title="Book a call with Terron Studio" loading="lazy"></iframe>
        </div>
      </div>
    </transition>
  </div>
</template>
