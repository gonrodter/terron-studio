<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import posthog from "posthog-js";
import { lang, messages } from "./i18n";

const t = computed(() => messages[lang.value]);

const langFading = ref(false);
let langFadeTimer = null;

function setLang(l) {
  if (lang.value === l || langFading.value) return;
  captureEvent("language_changed", { language: l });
  langFading.value = true;
  if (langFadeTimer) clearTimeout(langFadeTimer);
  langFadeTimer = setTimeout(() => {
    lang.value = l;
    nextTick(() => {
      langFadeTimer = setTimeout(() => {
        langFading.value = false;
        langFadeTimer = null;
      }, 20);
    });
  }, 240);
}

watch(
  lang,
  (l) => {
    document.documentElement.lang = l;
    document.title = messages[l].docTitle;
  },
  { immediate: true }
);

const posthogEnabled = Boolean(
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST
);
const captureEvent = (eventName, properties) => {
  if (posthogEnabled) posthog.capture(eventName, properties);
};

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
  "ducati-logo.png": new URL("../assets/ducati-logo.png", import.meta.url).href,
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

function openBook(event) {
  if (event) event.preventDefault();
  bookModalOpen.value = true;
  document.body.classList.add("modal-open");
  captureEvent("book_call_clicked");
}

function closeBook() {
  bookModalOpen.value = false;
  document.body.classList.remove("modal-open");
}

const serviceRows = computed(() => t.value.how.serviceRows);

const faqs = computed(() => t.value.faq.items);

const openFaq = ref(-1);

function toggleFaq(index) {
  const isOpening = openFaq.value !== index;
  openFaq.value = isOpening ? index : -1;
  captureEvent("faq_toggled", { question_index: index, opened: isOpening });
}

function handleProjectLinkClick(project) {
  captureEvent("project_link_clicked", { project_name: project.name });
}

function handleMessageClick() {
  captureEvent("message_clicked");
}

function handleServiceCategoryClick(cat, event) {
  captureEvent("service_category_clicked", { category_label: cat.label });
  if (cat.href) handleAnchorClick(event);
}

function toggleDevAddon() {
  addDev.value = !addDev.value;
  captureEvent("dev_addon_toggled", { enabled: addDev.value });
}

function decrementRetainerTasks() {
  if (retainerTasks.value === 1) return;
  retainerTasks.value = Math.max(1, retainerTasks.value - 1);
  captureEvent("retainer_task_count_changed", { task_count: retainerTasks.value });
}

function incrementRetainerTasks() {
  retainerTasks.value++;
  captureEvent("retainer_task_count_changed", { task_count: retainerTasks.value });
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

const navMeta = [
  { id: "top", href: "#top", icon: "M3 10.2 12 3l9 7.2M5 9v11h5v-6h4v6h5V9" },
  { id: "work", href: "#our-work", icon: "M4 7h5l2 2h9v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" },
  { id: "how", href: "#how", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4 1.6 3.4L17 12l-3.4 1.6L12 17l-1.6-3.4L7 12l3.4-1.6z" },
  { id: "pricing", href: "#pricing", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
  { id: "studio", href: "#studio", icon: "M4 8h16v11H4zM9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" },
];

const navItems = computed(() =>
  navMeta.map((item) => ({ ...item, label: t.value.nav[item.id] }))
);

const mobileHiddenNav = new Set(["studio"]);
const mobileNavItems = computed(() =>
  navMeta.flatMap((item) => {
    if (mobileHiddenNav.has(item.id)) return [];
    if (item.id === "work") return [{ ...item, label: t.value.nav.workMobile, href: "#work" }];
    return [{ ...item, label: t.value.nav[item.id] }];
  })
);

const startActions = computed(() => [
  { label: t.value.bookCall, href: bookCallHref, modal: true, pillIcon: "meet" },
  { label: t.value.sendMessage, href: `mailto:${email}`, pillIcon: "send" },
]);

const companies = [
  { name: "Konecta", file: "konecta-logo.jpeg", rounded: true },
  { name: "SNGULAR", file: "sngular-logo.webp", rounded: true },
  { name: "Vertical Group", file: "vertical-logo.png", rounded: true, white: true, inset: true },
  { name: "Ducati", file: "ducati-logo.png" },
  { name: "PowerPool", file: "powerpool-logo.webp", rounded: true, white: true },
  { name: "Collecta", file: "collecta-logo.webp" },
];

const projectMeta = [
  { name: "Collecta", href: "https://trycollecta.com/", image: "collecta-site.png" },
  { name: "BurnTab", href: "https://burntab.com/", image: "burntab-site.png" },
  { name: "Aparicio & Alemany", href: "https://aparicio-alemany-arquitectos.vercel.app/", image: "studio-site.png" },
  { name: "Ducati W93", href: "https://www.ducatiweare93.com/", image: "ducati-site.png" },
  { name: "PowerPool", href: "https://powerpool.io/", image: "powerpool-site.png" },
];

const projects = computed(() =>
  projectMeta.map((p, i) => ({ ...p, alt: t.value.work.projectAlts[i] }))
);

const heroSlides = ["collecta-site.png", "burntab-site.png", "studio-site.png", "powerpool-site.png", "tuparty-site.png"];
const heroSlide = ref(0);
let heroTimer = null;

function heroPrev() {
  heroSlide.value = (heroSlide.value - 1 + heroSlides.length) % heroSlides.length;
}

function heroNext() {
  heroSlide.value = (heroSlide.value + 1) % heroSlides.length;
}

const workSlide = ref(0);
let workTimer = null;

function workPrev() {
  const n = projects.value.length;
  workSlide.value = (workSlide.value - 1 + n) % n;
}

function workNext() {
  const n = projects.value.length;
  workSlide.value = (workSlide.value + 1) % n;
}

const strokeIcon = (d) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

const categoryMeta = [
  { svg: strokeIcon('<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 8.5h18"/><path d="M10 12.5l-2 2 2 2"/><path d="M14 12.5l2 2-2 2"/>') },
  { svg: strokeIcon('<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19.5h20"/>') },
  { svg: strokeIcon('<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M10.5 18h3"/>') },
  { svg: strokeIcon('<path d="M8.5 8.5 5 12l3.5 3.5"/><path d="M15.5 8.5 19 12l-3.5 3.5"/><path d="M13.5 6l-3 12"/>') },
  { svg: `<span class="brand-clip"><img class="brand-img" src="${asset("app-store-logo.png")}" alt="" /></span>` },
  {
    href: "#work",
    featured: true,
    svg: '<svg viewBox="0 0 24 24"><defs><linearGradient id="mf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc5f6"/><stop offset="1" stop-color="#3f8fe6"/></linearGradient></defs><path fill="#a6d1f8" d="M3 7.2A2 2 0 0 1 5 5.2h4.1a2 2 0 0 1 1.42.6l1.06 1.06a2 2 0 0 0 1.42.59H19a2 2 0 0 1 2 2v2.05H3z"/><path fill="url(#mf)" d="M3 9.4a1.6 1.6 0 0 1 1.6-1.6h14.8A1.6 1.6 0 0 1 21 9.4v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  },
];

const categories = computed(() =>
  categoryMeta.map((c, i) => ({ ...c, label: t.value.categories[i] }))
);

const boardMeta = [
  { image: "collecta-site.png", pin: "red", rotate: -4 },
  { image: "burntab-site.png", pin: "green", rotate: 3 },
  { image: "studio-site.png", pin: "tape", rotate: -3 },
  { image: "ducati-site.png", pin: "clip", rotate: 1.5 },
];

const board = computed(() =>
  boardMeta.map((c, i) => ({ ...c, caption: t.value.solution.boardCaptions[i] }))
);

const storyArc = [
  { text: "We build our own products too — TuParty, BurnTab, Collecta." },
  { text: "An idea, a rough sketch, that feeling it could become something real.", emoji: "✏️" },
  { text: "But then came the hard part…", mark: "finding people to build it." },
  { text: "One person for UI, another for branding, someone else for motion. Explaining the vision again and again and again…" },
  { text: "Somewhere along the way the product stops feeling exciting — and trust us, it's not you." },
];

const problemPoints = computed(() => t.value.problem.points);

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

const story = computed(() => t.value.studio.story);

const pricingNums = {
  landing: { base: 1200, addons: { dev: { price: 850 }, pages: { price: 250 } } },
  webapp: { retainerOnly: true },
  mobile: { retainerOnly: true },
  screenshots: { base: 550, addons: { pages: { price: 90 } } },
};
const tabOrder = ["landing", "webapp", "mobile", "screenshots"];

const pricingTabs = computed(() =>
  tabOrder.map((id) => {
    const num = pricingNums[id];
    const txt = t.value.pricing.tabs[id];
    if (num.retainerOnly) return { id, label: txt.label, retainerOnly: true };
    const addons = {};
    for (const key in num.addons) addons[key] = { ...num.addons[key], ...txt.addons[key] };
    return {
      id,
      label: txt.label,
      title: txt.title,
      days: txt.days,
      base: num.base,
      label2: txt.label2,
      note: txt.note,
      addons,
      features: txt.features,
    };
  })
);

const activeTab = ref("landing");
const addDev = ref(false);
const extraPages = ref(0);
const extraAnims = ref(0);
const activeTier = computed(() => pricingTabs.value.find((tab) => tab.id === activeTab.value));
const retainerTasks = ref(1);

function selectTab(id) {
  const tab = pricingTabs.value.find((tb) => tb.id === id);
  activeTab.value = id;
  addDev.value = false;
  extraPages.value = 0;
  extraAnims.value = 0;
  captureEvent("pricing_tab_selected", { tab_id: id, tab_label: tab?.label });
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

const euro = (value) => `€${value.toLocaleString(lang.value === "es" ? "es-ES" : "en-IE")}`;

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

const fragmentation = computed(() => t.value.problem.keycapWord.split(""));
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
  const sections = Array.from(document.querySelectorAll("[data-section]")).filter(
    (section) => section.offsetParent !== null
  );
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

  if (href === "#top") {
    event.preventDefault();
    if (isMobile.value) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      contentRef.value?.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
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
        ".problem-block > *:not(.problem-points)",
        ".problem-points li",
        ".solution-block > *:not(.board)",
        ".board-card",
        ".about-block > *",
        ".studio-lead",
        ".studio-section .story-copy p",
        ".section-lead",
        ".category",
        ".transition-note",
        ".pricing-tabs",
        ".pricing-panel",
        ".retainer-card",
        ".faq-title",
        ".faq-item",
        ".team-card",
        ".letter p:not(.letter-label)",
        ".letter-sign",
        ".final-cta > *",
        ".service-card",
        ".how-card",
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
    ".solution-motto",
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

  const reveal = (target, delayOverride) => {
    const delay =
      delayOverride != null
        ? delayOverride
        : Number.parseFloat(target.style.getPropertyValue("--reveal-delay")) || 0;
    window.setTimeout(() => {
      target.classList.add("is-visible");
      if (target.classList.contains("line-reveal")) {
        window.setTimeout(() => target.classList.add("reveal-done"), 1000);
      }
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

  // Visual blocks (media, board, tabs, card grids) only wait for the copy above
  // them when they share the first screen — e.g. the hero, where text and media
  // reveal together on load: read first, then the visual lands. This longer gate
  // is stored separately and applied ONLY to elements already in view at load.
  // Scrolled-to blocks skip it (the copy above is already read) and just use
  // their normal stagger, so they never lag behind the scroll.
  const seqDelay = new Map();
  const sequencedSelector = [
    ".hero-media",
    ".board",
    ".category-grid",
    ".how-steps",
    ".pricing-tabs",
    ".pricing-shell",
    ".retainer-card",
  ].join(", ");
  const REVEAL_GAP = 120;
  const revealDuration = (el) => (el.classList.contains("line-reveal") ? 900 : 760);
  const startOf = (el) => {
    const base = Number.parseFloat(el.style.getPropertyValue("--reveal-delay")) || 0;
    const heroIndex = heroTargets.indexOf(el);
    return base + (heroIndex >= 0 ? heroIndex * 90 : 0);
  };
  Array.from(document.querySelectorAll(sequencedSelector)).forEach((comp) => {
    const section = comp.closest(".hero, .section");
    if (!section) return;
    let textFinish = 0;
    targets.forEach((t) => {
      if (comp.contains(t) || !section.contains(t)) return;
      if (t.closest(sequencedSelector)) return; // gate on copy, not on other visuals
      if (!(comp.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING)) return;
      textFinish = Math.max(textFinish, startOf(t) + revealDuration(t));
    });
    const start = textFinish + REVEAL_GAP;
    const compTargets = comp.matches(".scroll-reveal")
      ? [comp]
      : targets.filter((t) => comp.contains(t));
    if (!compTargets.length) return;
    const localBase = Math.min(...compTargets.map(startOf));
    compTargets.forEach((t) => {
      seqDelay.set(t, start + (startOf(t) - localBase));
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
      reveal(target, seqDelay.get(target));
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

  workTimer = window.setInterval(workNext, 4600);

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
  if (workTimer) window.clearInterval(workTimer);
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
  <div class="app-shell" :class="{ 'lang-fading': langFading }">
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
          <p class="rail-group-label">{{ t.startProject }}</p>
          <a
            v-for="action in startActions"
            :key="action.label"
            class="rail-action"
            :href="action.href"
            @click="action.modal ? openBook($event) : handleMessageClick()"
          >
            <span class="rail-icon accent" aria-hidden="true">
              <span class="pill-icon" :class="action.pillIcon"></span>
            </span>
            <span class="rail-text">{{ action.label }}</span>
          </a>
        </div>

        <div class="lang-toggle" :class="`lang-${lang}`" role="group" aria-label="Language">
          <span class="lang-slider" aria-hidden="true"></span>
          <button type="button" class="lang-option" :class="{ 'is-active': lang === 'es' }" :aria-pressed="String(lang === 'es')" @click="setLang('es')">ES</button>
          <button type="button" class="lang-option" :class="{ 'is-active': lang === 'en' }" :aria-pressed="String(lang === 'en')" @click="setLang('en')">EN</button>
        </div>

      </div>

      <div class="sidebar-bottom">
        <p class="rail-label"><span class="rail-label-lighter">{{ t.trustedPre }}</span> {{ t.trustedCompanies }}</p>
        <div
          class="company-logo-grid"
          :class="{ 'is-animating': companyLogosAnimating }"
          @pointerenter="triggerCompanyLogoAnimation"
        >
          <img
            v-for="(company, index) in companies"
            :key="company.name"
            :class="{ 'logo-rounded': company.rounded, 'logo-white': company.white, 'logo-inset': company.inset }"
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
        :aria-label="mobileMenuOpen ? t.aria.closeNav : t.aria.openNav"
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
      <div class="mobile-menu-panel">
        <a
          v-for="item in mobileNavItems"
          :key="item.id"
          class="mobile-menu-link"
          :class="{ 'is-active': activeSection === item.id }"
          :href="item.href"
          @click="handleAnchorClick"
        >
          <span>{{ item.label }}</span>
        </a>
        <a class="mobile-menu-contact" :href="bookCallHref" @click="openBook($event); setMobileMenuOpen(false)">
          {{ t.bookCall }}
        </a>
        <div class="lang-toggle" :class="`lang-${lang}`" role="group" aria-label="Language">
          <span class="lang-slider" aria-hidden="true"></span>
          <button type="button" class="lang-option" :class="{ 'is-active': lang === 'es' }" :aria-pressed="String(lang === 'es')" @click="setLang('es')">ES</button>
          <button type="button" class="lang-option" :class="{ 'is-active': lang === 'en' }" :aria-pressed="String(lang === 'en')" @click="setLang('en')">EN</button>
        </div>
      </div>

      <div class="sidebar-bottom">
        <p class="rail-label"><span class="rail-label-lighter">{{ t.trustedPre }}</span> {{ t.trustedCompanies }}</p>
        <div class="company-logo-grid">
          <img
            v-for="company in companies"
            :key="company.name"
            :class="{ 'logo-rounded': company.rounded, 'logo-white': company.white, 'logo-inset': company.inset }"
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
            <p class="hero-eyebrow">{{ t.hero.eyebrow }}</p>
            <h1 class="hero-title">
              {{ t.hero.titlePre }} <img class="hero-inline-logo" :src="asset('terron-logo.png')" alt="" aria-hidden="true" /> {{ t.hero.titleMid }}
              <span class="soft">{{ t.hero.titleSoft }}</span> {{ t.hero.titlePost }}
            </h1>
            <div class="hero-actions">
              <a class="pill-button" :href="bookCallHref" @click="openBook($event)">
                <span class="pill-icon meet" aria-hidden="true"></span>
                {{ t.bookCall }}
              </a>
              <a class="pill-button" href="#work" @click="handleAnchorClick">
                <span class="pill-icon folder" aria-hidden="true"></span>
                {{ t.seeProjects }}
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
          <p v-for="(para, i) in t.narrative" :key="i" v-html="para"></p>
        </section>

        <!-- PROBLEM -->
        <section class="section problem-block">
          <div class="section-heading"><h2>{{ t.problem.heading }}</h2></div>
          <p class="keycap-line">
            {{ t.problem.keycapPre }}
            <span class="keycaps" :aria-label="t.problem.keycapLabel">
              <span v-for="(ch, i) in fragmentation" :key="i" class="keycap" :style="{ '--k': i }">{{ ch }}</span>
            </span>
          </p>
          <ul class="problem-points">
            <li v-for="point in problemPoints" :key="point">{{ point }}</li>
          </ul>
          <p class="problem-lead" v-html="t.problem.leadHtml"></p>
        </section>

        <!-- SOLUTION + board -->
        <section id="work" class="section solution-block section-observe" data-section="work">
          <div class="section-heading">
            <h2><span class="desk-only">{{ t.solution.headingDesk }}</span><span class="mob-only">{{ t.solution.headingMob }}</span></h2>
          </div>
          <div class="solution-problem mob-only">
            <p class="solution-problem-lead" v-html="t.solution.probLeadHtml"></p>
            <ul class="solution-problem-points">
              <li v-for="point in problemPoints" :key="point">{{ point }}</li>
            </ul>
            <p class="solution-problem-note" v-html="t.solution.probNoteHtml"></p>
          </div>
          <p class="solution-lead" v-html="t.solution.leadHtml"></p>

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
              @click="projects[index] && handleProjectLinkClick(projects[index])"
            >
              <span class="board-photo"><img :src="asset(card.image)" :alt="card.caption" /></span>
              <span class="board-caption">{{ card.caption }}</span>
            </a>
          </div>

          <p class="solution-motto" v-html="t.solution.mottoHtml"></p>
        </section>

        <!-- ABOUT -->
        <section id="our-work" class="section about-block section-observe" data-section="work">
          <div class="section-heading"><h2>{{ t.work.heading }}</h2></div>
          <p class="work-lead" v-html="t.work.leadHtml"></p>
          <div class="hero-media compact work-media" aria-label="Selected work">
            <div class="carousel">
              <div
                class="carousel-track"
                :style="{ transform: `translateX(-${workSlide * 100}%)` }"
              >
                <a
                  v-for="project in projects"
                  :key="`w-${project.name}`"
                  class="carousel-slide work-slide"
                  :href="project.href"
                  target="_blank"
                  rel="noreferrer"
                  @click="handleProjectLinkClick(project)"
                >
                  <img :src="asset(project.image)" :alt="project.alt" />
                </a>
              </div>
              <button class="carousel-arrow prev" type="button" :aria-label="t.aria.prev" @click="workPrev">
                <span></span>
              </button>
              <button class="carousel-arrow next" type="button" :aria-label="t.aria.next" @click="workNext">
                <span></span>
              </button>
              <div class="carousel-dots">
                <button
                  v-for="(project, index) in projects"
                  :key="`wd-${project.name}`"
                  type="button"
                  class="carousel-dot"
                  :class="{ 'is-active': workSlide === index }"
                  :aria-label="`${t.aria.goTo} ${project.name}`"
                  @click="workSlide = index"
                ></button>
              </div>
            </div>
          </div>
        </section>

        <!-- SHOWCASE categories -->
        <section id="services" class="section showcase-block section-observe">
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
              @click="handleServiceCategoryClick(cat, $event)"
            >
              <span class="category-icon" aria-hidden="true" v-html="cat.svg"></span>
              <span class="category-label">{{ cat.label }}</span>
            </component>
          </div>

        </section>

        <!-- HOW IT WORKS -->
        <section id="how" class="section how-section section-observe" data-section="how">
          <div class="section-heading"><h2>{{ t.how.heading }}</h2></div>
          <p class="section-lead" v-html="t.how.leadHtml"></p>
          <div class="how-steps">
            <!-- 1 · Book a call -->
            <article class="how-card how-card--book">
              <div class="how-visual">
                <div class="how-mock">
                  <div class="how-mock-head">
                    <span>{{ t.how.book.badge }}</span>
                    <span class="how-mock-clock" aria-hidden="true"></span>
                  </div>
                  <div class="how-mock-time">{{ t.how.book.time }}</div>
                  <ul class="how-mock-rows">
                    <li v-for="(row, i) in t.how.book.rows" :key="i">{{ row }}</li>
                  </ul>
                  <a class="how-mock-cta" :href="bookCallHref" @click="openBook($event)">
                    <span class="pill-icon meet" aria-hidden="true"></span>
                    {{ t.bookCall }}
                  </a>
                </div>
              </div>
              <div class="how-body">
                <h3>{{ t.how.book.title }}</h3>
                <p>{{ t.how.book.body }}</p>
              </div>
            </article>

            <!-- 2 · We design & build -->
            <article class="how-card how-card--build">
              <div class="how-visual">
                <div class="how-marquee" aria-hidden="true">
                  <div class="how-mq-row" v-for="(row, ri) in serviceRows" :key="ri">
                    <div class="how-mq-track" :class="`how-mq-track--${ri}`">
                      <span v-for="(p, i) in [...row, ...row]" :key="i" class="how-pill">{{ p }}</span>
                    </div>
                  </div>
                </div>
                <span class="how-logo-tile" aria-hidden="true">
                  <img :src="asset('terron-logo.png')" alt="" />
                </span>
              </div>
              <div class="how-body">
                <h3>{{ t.how.build.title }}</h3>
                <p>{{ t.how.build.body }}</p>
              </div>
            </article>

            <!-- 3 · Launch -->
            <article class="how-card how-card--launch">
              <div class="how-visual">
                <div class="how-stack" aria-hidden="true">
                  <img class="how-shot how-shot--1" :src="asset('burntab-site.png')" alt="" />
                  <img class="how-shot how-shot--2" :src="asset('collecta-site.png')" alt="" />
                  <img class="how-shot how-shot--3" :src="asset('studio-site.png')" alt="" />
                </div>
              </div>
              <div class="how-body">
                <h3>{{ t.how.launch.title }}</h3>
                <p>{{ t.how.launch.body }}</p>
              </div>
            </article>
          </div>
        </section>

        <!-- TRANSITION -->
        <section class="section transition-section">
          <p class="transition-note" v-html="t.transitionHtml"></p>
        </section>

        <!-- PRICING -->
        <section id="pricing" class="section pricing-section section-observe" data-section="pricing">
          <div class="section-heading"><h2>{{ t.pricing.heading }}</h2></div>
          <p class="section-lead" v-html="t.pricing.leadHtml"></p>

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
                @click="toggleDevAddon()"
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
                    <button type="button" @click="extraPages = Math.max(0, extraPages - 1)" :aria-label="t.aria.lessPages">–</button>
                    <b>{{ extraPages }}</b>
                    <button type="button" @click="extraPages++" :aria-label="t.aria.morePages">+</button>
                  </span>
                </span>
              </div>

              <div v-if="activeTier.addons.anim" class="addon-row">
                <span class="addon-label">{{ activeTier.addons.anim.label }}</span>
                <span class="addon-stepper">
                  <span class="addon-price">+{{ euro(activeTier.addons.anim.price) }}{{ activeTier.addons.anim.unit }}</span>
                  <span class="stepper">
                    <button type="button" @click="extraAnims = Math.max(0, extraAnims - 1)" :aria-label="t.aria.lessAnims">–</button>
                    <b>{{ extraAnims }}</b>
                    <button type="button" @click="extraAnims++" :aria-label="t.aria.moreAnims">+</button>
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
              <a class="button primary" :href="`mailto:${email}`" @click="handleMessageClick()">
                <span class="pill-icon send" aria-hidden="true"></span>
                {{ t.sendMessage }}
              </a>
              <a class="button secondary" :href="bookCallHref" @click="openBook($event)">
                <span class="pill-icon meet" aria-hidden="true"></span>
                {{ t.bookCall }}
              </a>
            </div>
          </div>
          </transition>
          </div>

          <div class="retainer-card">
            <div class="retainer-config">
              <h3>{{ t.pricing.retainer.title }}</h3>
              <div class="addon-row">
                <span class="addon-label">{{ t.pricing.retainer.activeTask }}</span>
                <span class="stepper green">
                  <button type="button" @click="decrementRetainerTasks()" :aria-label="t.aria.lessTasks">–</button>
                  <b>{{ retainerTasks }}</b>
                  <button type="button" @click="incrementRetainerTasks()" :aria-label="t.aria.moreTasks">+</button>
                </span>
              </div>
              <ul class="pricing-features">
                <li v-for="(feature, i) in t.pricing.retainer.features" :key="i">{{ feature }}</li>
              </ul>
            </div>
            <div class="pricing-summary">
              <div class="price-card green" v-tilt>
                <span class="price-card-glare" aria-hidden="true"></span>
                <span class="price-card-brand">TERRON</span>
                <span class="price-card-label">{{ t.pricing.retainer.monthly }}</span>
                <span class="price-card-value">{{ euro(2800 + (retainerTasks - 1) * 1500) }}<small>{{ t.pricing.retainer.perMo }}</small></span>
              </div>
              <a class="button primary" :href="bookCallHref" @click="openBook($event)">
                <span class="pill-icon meet" aria-hidden="true"></span>
                {{ t.bookCall }}
              </a>
            </div>
          </div>
        </section>

        <!-- WHO ARE WE -->
        <section id="studio" class="section studio-section section-observe" data-section="studio">
          <div class="section-heading"><h2>{{ t.studio.heading }}</h2></div>
          <p class="studio-lead">
            {{ t.studio.leadPre }} <span class="lead-name"><img :src="asset('terron-pfp.webp')" alt="" aria-hidden="true" /> {{ t.studio.leadName }}</span><br />
            {{ t.studio.leadPost }}
          </p>
          <div class="story-copy">
            <p v-for="paragraph in story" :key="paragraph">{{ paragraph }}</p>
          </div>
        </section>

        <!-- FINAL LETTER -->
        <section class="section final-cta">
          <div class="letter">
            <p class="letter-label">{{ t.letter.label }}</p>
            <p>{{ t.letter.p1 }}</p>
            <p v-html="t.letter.p2Html"></p>
            <p>{{ t.letter.p3 }}</p>
            <p>{{ t.letter.p4 }}</p>
            <p>{{ t.letter.p5 }}</p>
            <p class="letter-final" v-html="t.letter.finalHtml"></p>
          </div>

          <div class="letter-sign">
            <img class="sign-mark" :src="asset('signature.png')" alt="Gonzalo Terrón signature" />
            <div>
              <p class="sign-name">Gonzalo Rodríguez Terrón</p>
              <p class="sign-role">{{ t.letter.role }}</p>
            </div>
          </div>

          <div class="hero-actions">
            <a class="pill-button" :href="bookCallHref" @click="openBook($event)">
              <span class="pill-icon meet" aria-hidden="true"></span>
              {{ t.bookCall }}
            </a>
            <a class="pill-button" href="#work" @click="handleAnchorClick">
              <span class="pill-icon folder" aria-hidden="true"></span>
              {{ t.seeProjects }}
            </a>
          </div>
        </section>

        <!-- FAQ -->
        <section id="faq" class="section faq-section section-observe">
          <h2 class="faq-title">{{ t.faq.title }}</h2>
          <ul class="faq-list">
            <li
              v-for="(item, i) in faqs"
              :key="i"
              class="faq-item"
              :class="{ 'is-open': openFaq === i }"
            >
              <button
                type="button"
                class="faq-q"
                :aria-expanded="String(openFaq === i)"
                @click="toggleFaq(i)"
              >
                <span>{{ item.q }}</span>
                <span class="faq-chevron" aria-hidden="true"></span>
              </button>
              <div class="faq-a-wrap">
                <div class="faq-a-inner">
                  <p class="faq-a">{{ item.a }}</p>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </main>

    <transition name="book-fade">
      <div v-if="bookModalOpen" class="book-modal" @click.self="closeBook">
        <div class="book-modal-card">
          <div class="book-modal-bar">
            <span class="book-modal-title">{{ t.bookModalTitle }}</span>
            <button class="book-modal-close" type="button" aria-label="Close" @click="closeBook">×</button>
          </div>
          <iframe :src="bookCallHref" :title="t.iframeTitle" loading="lazy"></iframe>
        </div>
      </div>
    </transition>
  </div>
</template>
