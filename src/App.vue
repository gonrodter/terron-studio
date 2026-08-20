<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { captureEvent } from "./analytics.js";
import { lang, messages } from "./i18n";
import { getLocalizedPath, getRouteSeo, SITE_ORIGIN, SUPPORTED_LOCALES } from "./seo.js";

const props = defineProps({
  initialPath: {
    type: String,
    default: "/",
  },
});

const t = computed(() => messages[lang.value]);

const langFading = ref(false);
let langFadeTimer = null;

function currentPathForLocale(locale) {
  const pathname = typeof window === "undefined" ? props.initialPath : window.location.pathname;
  return getLocalizedPath(pathname, locale);
}

function setLang(l, event) {
  event?.preventDefault();
  if (lang.value === l || langFading.value) return;
  const targetPath = currentPathForLocale(l);
  captureEvent("language_changed", { language: l });
  langFading.value = true;
  if (langFadeTimer) clearTimeout(langFadeTimer);
  langFadeTimer = setTimeout(() => {
    lang.value = l;
    if (typeof window !== "undefined") navigate(targetPath, false);
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
    if (typeof document !== "undefined") document.documentElement.lang = l;
  },
  { immediate: true }
);

function setHeadMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

function syncSeoMeta() {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const project = activeProject.value;
  const seo = getRouteSeo(window.location.pathname, lang.value);
  const canonicalUrl = new URL(seo.canonicalPath, SITE_ORIGIN).href;
  const projectImagePath = project
    ? new URL(asset(project.image), window.location.origin).pathname
    : null;
  const image = project ? new URL(projectImagePath, SITE_ORIGIN).href : `${SITE_ORIGIN}/og.png`;

  document.documentElement.lang = lang.value;
  document.title = seo.title;
  setHeadMeta('meta[name="description"]', "content", seo.description);
  setHeadMeta('link[rel="canonical"]', "href", canonicalUrl);
  setHeadMeta('link[rel="alternate"][hreflang="es"]', "href", new URL(seo.alternates.es, SITE_ORIGIN).href);
  setHeadMeta('link[rel="alternate"][hreflang="en"]', "href", new URL(seo.alternates.en, SITE_ORIGIN).href);
  setHeadMeta('link[rel="alternate"][hreflang="x-default"]', "href", new URL(seo.alternates.xDefault, SITE_ORIGIN).href);
  setHeadMeta('meta[property="og:title"]', "content", seo.title);
  setHeadMeta('meta[property="og:description"]', "content", seo.description);
  setHeadMeta('meta[property="og:url"]', "content", canonicalUrl);
  setHeadMeta('meta[property="og:locale"]', "content", lang.value === "es" ? "es_ES" : "en_US");
  setHeadMeta('meta[property="og:locale:alternate"]', "content", lang.value === "es" ? "en_US" : "es_ES");
  setHeadMeta('meta[property="og:image"]', "content", image);
  setHeadMeta('meta[property="og:image:alt"]', "content", project ? project.alt : seo.imageAlt);
  setHeadMeta('meta[property="og:image:type"]', "content", project ? "image/webp" : "image/png");
  setHeadMeta('meta[property="og:image:width"]', "content", project ? "1920" : "1200");
  setHeadMeta('meta[property="og:image:height"]', "content", project ? "1536" : "630");
  setHeadMeta('meta[name="twitter:title"]', "content", seo.title);
  setHeadMeta('meta[name="twitter:description"]', "content", seo.description);
  setHeadMeta('meta[name="twitter:image"]', "content", image);
  setHeadMeta('meta[name="twitter:image:alt"]', "content", project ? project.alt : seo.imageAlt);
}

const assetMap = {
  "terron-logo.png": new URL("../assets/responsive/terron-logo-320.webp", import.meta.url).href,
  "signature.png": new URL("../assets/signature.png", import.meta.url).href,
  "terron-pfp.webp": new URL("../assets/terron-pfp.webp", import.meta.url).href,
  "vertical-logo.png": new URL("../assets/optimized-logos/vertical-logo.webp", import.meta.url).href,
  "konecta-logo.jpeg": new URL("../assets/optimized-logos/konecta-logo.webp", import.meta.url).href,
  "sngular-logo.webp": new URL("../assets/optimized-logos/sngular-logo.webp", import.meta.url).href,
  "powerpool-logo.webp": new URL("../assets/optimized-logos/powerpool-logo.webp", import.meta.url).href,
  "collecta-logo.webp": new URL("../assets/optimized-logos/collecta-logo.webp", import.meta.url).href,
  "ducati-logo.png": new URL("../assets/optimized-logos/ducati-logo.webp", import.meta.url).href,
  "collecta-1.png": new URL("../assets/collecta-1.webp", import.meta.url).href,
  "collecta-2.png": new URL("../assets/collecta-2.webp", import.meta.url).href,
  "collecta-3.png": new URL("../assets/collecta-3.webp", import.meta.url).href,
  "burntab-1.png": new URL("../assets/burntab-1.webp", import.meta.url).href,
  "burntab-2.png": new URL("../assets/burntab-2.webp", import.meta.url).href,
  "burntab-3.png": new URL("../assets/burntab-3.webp", import.meta.url).href,
  "aparicio-1.png": new URL("../assets/aparicio-1.webp", import.meta.url).href,
  "aparicio-2.png": new URL("../assets/aparicio-2.webp", import.meta.url).href,
  "aparicio-3.png": new URL("../assets/aparicio-3.webp", import.meta.url).href,
  "aparicio-4.png": new URL("../assets/aparicio-4.webp", import.meta.url).href,
  "ducati-1.png": new URL("../assets/ducati-1.webp", import.meta.url).href,
  "collecta.png": new URL("../assets/collecta.webp", import.meta.url).href,
  "burntab.png": new URL("../assets/burntab.webp", import.meta.url).href,
  "aparicio.png": new URL("../assets/aparicio.webp", import.meta.url).href,
  "ducati.png": new URL("../assets/ducati.webp", import.meta.url).href,
};

const asset = (file) => assetMap[file];

const imageSizeMap = {
  "terron-logo.png": { width: 320, height: 132 },
  "signature.png": { width: 899, height: 928 },
  "terron-pfp.webp": { width: 256, height: 256 },
  "vertical-logo.png": { width: 192, height: 27 },
  "konecta-logo.jpeg": { width: 192, height: 192 },
  "sngular-logo.webp": { width: 192, height: 192 },
  "powerpool-logo.webp": { width: 192, height: 192 },
  "collecta-logo.webp": { width: 192, height: 192 },
  "ducati-logo.png": { width: 181, height: 192 },
  "collecta.png": { width: 1920, height: 957 },
  "burntab.png": { width: 1920, height: 966 },
  "aparicio.png": { width: 1920, height: 961 },
  "ducati.png": { width: 1920, height: 972 },
  "collecta-2.png": { width: 1920, height: 1536 },
  "collecta-3.png": { width: 1920, height: 1536 },
  "collecta-4.png": { width: 1920, height: 1536 },
  "burntab-2.png": { width: 1920, height: 1536 },
  "burntab-3.png": { width: 1920, height: 1536 },
  "burntab-4.png": { width: 1920, height: 1536 },
  "aparicio-2.png": { width: 1920, height: 1536 },
  "aparicio-3.png": { width: 1920, height: 1536 },
  "aparicio-4.png": { width: 1920, height: 1536 },
  "ducati-2.png": { width: 742, height: 2432 },
};

const coverSizeMap = {
  "collecta.png": { width: 1440, height: 720 },
  "burntab.png": { width: 1440, height: 721 },
  "aparicio.png": { width: 1440, height: 725 },
  "ducati.png": { width: 1440, height: 723 },
};

const imageSize = (file) => imageSizeMap[file];
const coverSize = (file) => coverSizeMap[file];

// List covers use margin-trimmed copies so they fill their frame.
const coverMap = {
  "collecta.png": new URL("../assets/trimmed/collecta.webp", import.meta.url).href,
  "burntab.png": new URL("../assets/trimmed/burntab.webp", import.meta.url).href,
  "aparicio.png": new URL("../assets/trimmed/aparicio.webp", import.meta.url).href,
  "ducati.png": new URL("../assets/trimmed/ducati.webp", import.meta.url).href,
};

// Detail galleries use the exports as they are — same size, no crop, no upscale.
const shotMap = {
  "collecta.png": new URL("../assets/collecta.webp", import.meta.url).href,
  "burntab.png": new URL("../assets/burntab.webp", import.meta.url).href,
  "aparicio.png": new URL("../assets/aparicio.webp", import.meta.url).href,
  "ducati.png": new URL("../assets/ducati.webp", import.meta.url).href,
  "collecta-2.png": new URL("../assets/collecta-2.webp", import.meta.url).href,
  "collecta-3.png": new URL("../assets/collecta-3.webp", import.meta.url).href,
  "collecta-4.png": new URL("../assets/collecta-4.webp", import.meta.url).href,
  "burntab-2.png": new URL("../assets/burntab-2.webp", import.meta.url).href,
  "burntab-3.png": new URL("../assets/burntab-3.webp", import.meta.url).href,
  "burntab-4.png": new URL("../assets/burntab-4.webp", import.meta.url).href,
  "aparicio-2.png": new URL("../assets/aparicio-2.webp", import.meta.url).href,
  "aparicio-3.png": new URL("../assets/aparicio-3.webp", import.meta.url).href,
  "aparicio-4.png": new URL("../assets/aparicio-4.webp", import.meta.url).href,
  "ducati-2.png": new URL("../assets/ducati-2.webp", import.meta.url).href,
};

const cover = (file) => coverMap[file];
const shot = (file) => shotMap[file];

const email = "info@terron-studio.com";
const phone = "+34 640 583 966";
const bookCallHref = "https://cal.eu/terron-studio/15min";

const bookModalOpen = ref(false);
const contactModalOpen = ref(false);
const contactSending = ref(false);
const contactStatus = ref("");
const contactDraft = ref({
  name: "",
  replyTo: "",
  subject: "",
  message: "",
  website: "",
  context: "general",
});

function openBook(event) {
  if (event) event.preventDefault();
  bookModalOpen.value = true;
  document.body.classList.add("modal-open");
  captureEvent("book_call_clicked");
}

function closeBook() {
  bookModalOpen.value = false;
  if (!contactModalOpen.value) document.body.classList.remove("modal-open");
}

function contactTemplate(context = "general") {
  if (context !== "pricing") {
    return {
      subject: t.value.contact.generalSubject,
      message: t.value.contact.generalMessage,
      context: "general",
    };
  }

  const tier = activeTier.value;
  const details = [`${t.value.contact.service}: ${tier.label}`];
  details.push(
    `${t.value.pricing.bookingSystem.title}: ${bookingAddonOpen.value
      ? t.value.contact.yes
      : t.value.contact.no}`
  );

  return {
    subject: t.value.contact.pricingSubjects.landing,
    message: `${t.value.contact.greeting}\n\n${t.value.contact.pricingIntro}\n\n${details
      .map((detail) => `• ${detail}`)
      .join("\n")}\n\n${t.value.contact.pricingClosing}\n`,
    context: "pricing:website",
  };
}

function openContact(event, context = "general") {
  event?.preventDefault();
  const template = contactTemplate(context);
  contactDraft.value = {
    name: contactDraft.value.name,
    replyTo: contactDraft.value.replyTo,
    website: "",
    ...template,
  };
  contactStatus.value = "";
  contactModalOpen.value = true;
  document.body.classList.add("modal-open");
  captureEvent("message_composer_opened", { context: template.context });
}

function closeContact() {
  if (contactSending.value) return;
  contactModalOpen.value = false;
  contactStatus.value = "";
  if (!bookModalOpen.value) document.body.classList.remove("modal-open");
}

async function sendContactMessage() {
  if (contactSending.value) return;
  contactSending.value = true;
  contactStatus.value = "";

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactDraft.value),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(t.value.contact.error);

    contactStatus.value = "sent";
    captureEvent("message_sent", { context: contactDraft.value.context });
  } catch (error) {
    contactStatus.value = error.message || t.value.contact.error;
    captureEvent("message_send_failed", { context: contactDraft.value.context });
  } finally {
    contactSending.value = false;
  }
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

function handleServiceCategoryClick(cat, event) {
  captureEvent("service_category_clicked", { category_label: cat.label });
  if (cat.toProjects) goProjects(event);
  else if (cat.href) handleAnchorClick(event);
}

async function toggleBookingAddon() {
  const opened = !bookingAddonOpen.value;
  bookingAddonOpen.value = opened;
  captureEvent("booking_addon_toggled", { opened });

  if (opened && isMobile.value) {
    await nextTick();
    await new Promise((resolve) => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
    });
    const addon = bookingAddonRef.value;
    const header = document.querySelector(".mobile-header");
    if (addon) {
      const headerBottom = header?.getBoundingClientRect().bottom || 66;
      const targetTop = window.scrollY + addon.getBoundingClientRect().top - headerBottom - 8;
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }
  }
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
  { label: t.value.sendMessage, href: "#contact", contact: true, pillIcon: "send" },
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
  {
    slug: "aparicio-alemany",
    cover: "aparicio.png",
    name: "Aparicio & Alemany",
    href: "https://aparicio-alemany-arquitectos.vercel.app/",
    image: "aparicio-1.png",
    shots: ["aparicio.png", "aparicio-2.png", "aparicio-3.png", "aparicio-4.png"],
  },
  {
    slug: "ducati-w93",
    cover: "ducati.png",
    name: "Ducati W93",
    href: "https://www.ducatiweare93.com/",
    image: "ducati-1.png",
    shots: ["ducati.png", { file: "ducati-2.png", tall: true }],
  },
  {
    slug: "collecta",
    cover: "collecta.png",
    name: "Collecta",
    href: "https://trycollecta.com/",
    image: "collecta-1.png",
    shots: ["collecta.png", "collecta-2.png", "collecta-3.png", "collecta-4.png"],
  },
  {
    slug: "burntab",
    cover: "burntab.png",
    name: "BurnTab",
    href: "https://burntab.com/",
    image: "burntab-1.png",
    shots: ["burntab.png", "burntab-2.png", "burntab-3.png", "burntab-4.png"],
  },
];

const projects = computed(() =>
  projectMeta.map((p, i) => ({ ...p, alt: t.value.work.projectAlts[i] }))
);

const projectPages = computed(() =>
  projectMeta.map((p, i) => ({
    ...p,
    projectPath: `/${lang.value}/projects/${p.slug}`,
    alt: t.value.work.projectAlts[i],
    tag: t.value.projectsPage.tags[p.slug],
    brief: t.value.projectsPage.briefs[p.slug],
    seo: t.value.projectsPage.seo[p.slug],
    shots: p.shots.map((shot, si) =>
      typeof shot === "string"
        ? { file: shot, tall: false, alt: `${p.name} — ${si + 1}` }
        : { ...shot, alt: `${p.name} — ${si + 1}` }
    ),
  }))
);

/* ── /projects routing (history API, no router dependency) ───── */
const view = ref("home");
const activeSlug = ref(null);
const activeProject = computed(() =>
  projectPages.value.find((p) => p.slug === activeSlug.value) ?? null
);
const projectsContentRef = ref(null);

function readRoute() {
  const pathname = typeof window === "undefined" ? props.initialPath : window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);
  const routeLocale = SUPPORTED_LOCALES.includes(parts[0]) ? parts.shift() : "es";
  if (lang.value !== routeLocale) lang.value = routeLocale;
  if (parts[0] === "projects") {
    view.value = "projects";
    activeSlug.value = projectMeta.some((p) => p.slug === parts[1]) ? parts[1] : null;
  } else {
    view.value = "home";
    activeSlug.value = null;
  }
}

readRoute();

function scrollViewTop() {
  nextTick(() => {
    window.scrollTo({ top: 0 });
    projectsContentRef.value?.scrollTo({ top: 0 });
  });
}

function navigate(path, shouldScroll = true) {
  if (window.location.pathname !== path) window.history.pushState({}, "", path);
  readRoute();
  if (shouldScroll) scrollViewTop();
}

const homePath = computed(() => `/${lang.value}`);
const projectsPath = computed(() => `/${lang.value}/projects`);

function goProjects(event) {
  if (event) event.preventDefault();
  captureEvent("projects_page_opened");
  if (mobileMenuOpen.value) setMobileMenuOpen(false);
  navigate(projectsPath.value);
}

function openProject(project) {
  captureEvent("project_detail_opened", { project_name: project.name });
  navigate(`/${lang.value}/projects/${project.slug}`);
}

function closeProject() {
  navigate(projectsPath.value);
}

function handlePopState() {
  readRoute();
  scrollViewTop();
}

watch([view, activeSlug, lang], () => {
  syncSeoMeta();
});

watch(view, (v) => {
  if (v !== "home") return;
  nextTick(() => {
    setupRevealObserver();
    requestActiveSectionUpdate();
  });
});

watch([view, activeSlug], () => {
  if (view.value !== "projects") {
    projectsListObserver?.disconnect();
    projectShotsObserver?.disconnect();
    return;
  }
  if (activeSlug.value) {
    projectsListObserver?.disconnect();
    nextTick(() => setupProjectShotsReveal());
    return;
  }
  projectShotsObserver?.disconnect();
  nextTick(() => setupProjectsListReveal());
});

const heroImage = new URL("../assets/responsive/aparicio-2-1200.webp", import.meta.url).href;
const heroImageSrcset = [
  `${new URL("../assets/responsive/aparicio-2-480.webp", import.meta.url).href} 480w`,
  `${new URL("../assets/responsive/aparicio-2-768.webp", import.meta.url).href} 768w`,
  `${heroImage} 1200w`,
  `${asset("aparicio-2.png")} 1920w`,
].join(", ");

const workSlide = ref(0);
let workTimer = null;

function workAdvance() {
  const n = projects.value.length;
  workSlide.value = (workSlide.value + 1) % n;
}

function restartWorkTimer() {
  if (workTimer) window.clearInterval(workTimer);
  workTimer = window.setInterval(workAdvance, 4600);
}

function workPrev() {
  const n = projects.value.length;
  workSlide.value = (workSlide.value - 1 + n) % n;
  restartWorkTimer();
}

function workNext() {
  workAdvance();
  restartWorkTimer();
}

function workGoTo(index) {
  workSlide.value = index;
  restartWorkTimer();
}

const strokeIcon = (d) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

const categoryMeta = [
  { svg: strokeIcon('<path d="M4 17.5 16.8 4.7a2.1 2.1 0 0 1 3 3L7 20.5 3 21z"/><path d="m14.8 6.7 3 3"/>') },
  { svg: strokeIcon('<path d="M8.5 8.5 5 12l3.5 3.5"/><path d="M15.5 8.5 19 12l-3.5 3.5"/><path d="M13.5 6l-3 12"/>') },
  { svg: strokeIcon('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/><path d="M8.5 11h5M11 8.5v5"/>') },
  { svg: strokeIcon('<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M10.5 18h3"/>') },
  { svg: strokeIcon('<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M7 3v4M17 3v4M3 10h18"/><path d="M8 14h3v3H8z"/>') },
  {
    href: "/projects",
    toProjects: true,
    featured: true,
    svg: '<svg viewBox="0 0 24 24"><defs><linearGradient id="mf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc5f6"/><stop offset="1" stop-color="#3f8fe6"/></linearGradient></defs><path fill="#a6d1f8" d="M3 7.2A2 2 0 0 1 5 5.2h4.1a2 2 0 0 1 1.42.6l1.06 1.06a2 2 0 0 0 1.42.59H19a2 2 0 0 1 2 2v2.05H3z"/><path fill="url(#mf)" d="M3 9.4a1.6 1.6 0 0 1 1.6-1.6h14.8A1.6 1.6 0 0 1 21 9.4v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  },
];

const categories = computed(() =>
  categoryMeta.map((c, i) => ({
    ...c,
    href: c.toProjects ? projectsPath.value : c.href,
    label: t.value.categories[i],
  }))
);

const boardMeta = [
  { slug: "collecta", image: "collecta.png", pin: "red", rotate: -4 },
  { slug: "burntab", image: "burntab.png", pin: "green", rotate: 3 },
  { slug: "aparicio-alemany", image: "aparicio.png", pin: "tape", rotate: -3 },
  { slug: "ducati-w93", image: "ducati.png", pin: "clip", rotate: 1.5 },
];

const board = computed(() =>
  boardMeta.map((c, i) => ({
    ...c,
    caption: t.value.solution.boardCaptions[i],
    project: projects.value.find((project) => project.slug === c.slug),
  }))
);

const problemPoints = computed(() => t.value.problem.points);

const story = computed(() => t.value.studio.story);

const activeTier = computed(() => ({
  ...t.value.pricing.tabs.landing,
  base: 399,
  addons: {},
}));
const bookingAddonOpen = ref(false);
const bookingAddonRef = ref(null);

const totalPrice = computed(() => activeTier.value.base);

const euro = (value) => `${value.toLocaleString(lang.value === "es" ? "es-ES" : "en-IE")} €`;

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
let projectsListObserver = null;
let projectShotsObserver = null;

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

  if (view.value !== "home" && href && href.startsWith("#")) {
    event.preventDefault();
    navigate(homePath.value);
    if (href === "#top") return;
    nextTick(() => {
      const dest = document.querySelector(href);
      if (!dest) return;
      if (isMobile.value) window.scrollTo({ top: dest.getBoundingClientRect().top + window.scrollY - 12 });
      else contentRef.value?.scrollTo({ top: dest.offsetTop - 24 });
    });
    return;
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
    closeContact();
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
        ".hero-inner > .hero-actions",
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

function setupProjectsListReveal(listRoot = document.querySelector(".pg-list")) {
  projectsListObserver?.disconnect();
  if (!listRoot) return;

  const heading = listRoot.querySelector(".pg-head h1");
  const cards = Array.from(listRoot.querySelectorAll(".pg-card"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  heading?.classList.add("pg-list-reveal");
  cards.forEach((card) => card.classList.add("pg-list-reveal"));

  if (reduceMotion) {
    heading?.classList.add("is-visible");
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => heading?.classList.add("is-visible"));
  });

  projectsListObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        window.setTimeout(() => entry.target.classList.add("is-visible"), 180);
        projectsListObserver?.unobserve(entry.target);
      });
    },
    {
      root: isMobile.value ? null : projectsContentRef.value,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    }
  );

  cards.forEach((card) => projectsListObserver.observe(card));
}

function handleProjectPanelBeforeEnter(element) {
  if (element.classList.contains("pg-list")) {
    window.requestAnimationFrame(() => setupProjectsListReveal(element));
  } else if (element.classList.contains("pg-detail")) {
    window.requestAnimationFrame(() => setupProjectShotsReveal(element));
  }
}

function setupProjectShotsReveal(detailRoot = document.querySelector(".pg-detail")) {
  projectShotsObserver?.disconnect();
  if (!detailRoot) return;

  const shots = Array.from(detailRoot.querySelectorAll(".pg-shot-item"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    shots.forEach((shotItem) => shotItem.classList.add("is-visible"));
    return;
  }

  projectShotsObserver = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .forEach((entry, index) => {
          window.setTimeout(() => entry.target.classList.add("is-visible"), index * 90);
          projectShotsObserver?.unobserve(entry.target);
        });
    },
    {
      root: isMobile.value ? null : projectsContentRef.value,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    }
  );

  shots.forEach((shotItem) => projectShotsObserver.observe(shotItem));
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
  window.addEventListener("popstate", handlePopState);

  workTimer = window.setInterval(workAdvance, 4600);

  syncSeoMeta();
  setupRevealObserver();
  if (view.value === "projects" && !activeSlug.value) setupProjectsListReveal();
  if (view.value === "projects" && activeSlug.value) setupProjectShotsReveal();
  setActiveSection();
});

onBeforeUnmount(() => {
  contentRef.value?.removeEventListener("scroll", requestActiveSectionUpdate);
  window.removeEventListener("scroll", requestActiveSectionUpdate);
  window.removeEventListener("resize", requestActiveSectionUpdate);
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("popstate", handlePopState);
  mobileQuery.value?.removeEventListener("change", handleMediaChange);
  revealObserver?.disconnect();
  projectsListObserver?.disconnect();
  projectShotsObserver?.disconnect();
  if (companyLogosAnimationTimer) window.clearTimeout(companyLogosAnimationTimer);
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
            <img class="brand-mark" :src="asset('terron-logo.png')" v-bind="imageSize('terron-logo.png')" alt="Terron Studio" decoding="async" />
          </a>
        </div>

        <nav class="rail-nav">
          <a
            v-for="item in navItems"
            :key="item.id"
            class="rail-link"
            :class="{ 'is-active': view === 'home' && activeSection === item.id }"
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
            @click="action.modal ? openBook($event) : openContact($event)"
          >
            <span class="rail-icon accent" aria-hidden="true">
              <span class="pill-icon" :class="action.pillIcon"></span>
            </span>
            <span class="rail-text">{{ action.label }}</span>
          </a>
        </div>

      </div>

      <div class="sidebar-bottom">
        <div class="lang-toggle desktop-lang" :class="`lang-${lang}`" role="group" aria-label="Language">
          <span class="lang-slider" aria-hidden="true"></span>
          <a :href="currentPathForLocale('es')" class="lang-option" :class="{ 'is-active': lang === 'es' }" :aria-current="lang === 'es' ? 'page' : undefined" hreflang="es" lang="es" @click="setLang('es', $event)">ES</a>
          <a :href="currentPathForLocale('en')" class="lang-option" :class="{ 'is-active': lang === 'en' }" :aria-current="lang === 'en' ? 'page' : undefined" hreflang="en" lang="en" @click="setLang('en', $event)">EN</a>
        </div>
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
            v-bind="imageSize(company.file)"
            :alt="company.name"
            decoding="async"
          />
        </div>
      </div>
    </aside>

    <header class="mobile-header" :class="{ 'is-open': mobileMenuOpen }">
      <a class="brand compact" href="#top" aria-label="Terron Studio home" @click="handleAnchorClick">
        <span class="brand-mark">
          <img :src="asset('terron-logo.png')" v-bind="imageSize('terron-logo.png')" alt="" aria-hidden="true" decoding="async" />
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
          :class="{ 'is-active': view === 'home' && activeSection === item.id }"
          :href="item.href"
          @click="handleAnchorClick"
        >
          <span>{{ item.label }}</span>
        </a>
        <a class="mobile-menu-contact" :href="bookCallHref" @click="openBook($event); setMobileMenuOpen(false)">
          <span class="pill-icon meet" aria-hidden="true"></span>
          {{ t.bookCall }}
        </a>
      </div>

      <div class="sidebar-bottom">
        <div class="lang-toggle mobile-lang" :class="`lang-${lang}`" role="group" aria-label="Language">
          <span class="lang-slider" aria-hidden="true"></span>
          <a :href="currentPathForLocale('es')" class="lang-option" :class="{ 'is-active': lang === 'es' }" :aria-current="lang === 'es' ? 'page' : undefined" hreflang="es" lang="es" @click="setLang('es', $event)">ES</a>
          <a :href="currentPathForLocale('en')" class="lang-option" :class="{ 'is-active': lang === 'en' }" :aria-current="lang === 'en' ? 'page' : undefined" hreflang="en" lang="en" @click="setLang('en', $event)">EN</a>
        </div>
        <p class="rail-label"><span class="rail-label-lighter">{{ t.trustedPre }}</span> {{ t.trustedCompanies }}</p>
        <div class="company-logo-grid">
          <img
            v-for="company in companies"
            :key="company.name"
            :class="{ 'logo-rounded': company.rounded, 'logo-white': company.white, 'logo-inset': company.inset }"
            :src="asset(company.file)"
            v-bind="imageSize(company.file)"
            :alt="company.name"
            decoding="async"
          />
        </div>
      </div>
    </nav>

    <main v-if="view === 'home'" id="top" ref="contentRef" class="content">
      <div class="main-panel">
        <!-- HERO -->
        <section class="hero section-observe" data-section="top">
          <div class="hero-inner">
            <p class="hero-eyebrow">{{ t.hero.eyebrow }}</p>
            <h1 class="hero-title">
              {{ t.hero.titlePre }} <img class="hero-inline-logo" :src="asset('terron-logo.png')" v-bind="imageSize('terron-logo.png')" alt="" aria-hidden="true" decoding="async" /> {{ t.hero.titleMid }}
              <span class="soft">{{ t.hero.titleSoft }}</span> {{ t.hero.titlePost }}
            </h1>
            <div class="hero-actions">
              <a class="pill-button" :href="bookCallHref" @click="openBook($event)">
                <span class="pill-icon meet" aria-hidden="true"></span>
                {{ t.bookCall }}
              </a>
              <a class="pill-button" :href="projectsPath" @click="goProjects">
                <span class="pill-icon folder" aria-hidden="true"></span>
                {{ t.seeProjects }}
              </a>
            </div>
          </div>

          <div class="hero-media" role="img" aria-label="Selected work preview">
            <div class="hero-media-frame">
              <img
                class="is-active"
                :src="heroImage"
                :srcset="heroImageSrcset"
                sizes="(max-width: 820px) calc(70vw - 31px), 605px"
                width="1200"
                height="960"
                alt=""
                aria-hidden="true"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
              <div class="hero-media-glow"></div>
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
              v-for="card in board"
              :key="card.slug"
              class="board-card"
              :class="[`pin-${card.pin}`, { cover: card.cover }]"
              :style="{ '--rot': `${card.rotate}deg` }"
              :href="card.project?.href ?? '#work'"
              target="_blank"
              rel="noreferrer"
              @click="card.project && handleProjectLinkClick(card.project)"
            >
              <span class="board-photo"><img :src="asset(card.image)" v-bind="imageSize(card.image)" alt="" aria-hidden="true" loading="lazy" decoding="async" /></span>
              <span class="board-caption">{{ card.caption }}</span>
            </a>
          </div>

          <p class="solution-motto" v-html="t.solution.mottoHtml"></p>
        </section>

        <!-- ABOUT -->
        <section id="our-work" class="section about-block section-observe" data-section="work">
          <div class="section-heading"><h2>{{ t.work.heading }}</h2></div>
          <p class="work-lead" v-html="t.work.leadHtml"></p>
          <div class="hero-media compact work-media" role="region" aria-label="Selected work">
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
                  <img :src="asset(project.cover)" v-bind="imageSize(project.cover)" :alt="project.alt" loading="lazy" decoding="async" />
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
                  @click="workGoTo(index)"
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
                  <img :src="asset('terron-logo.png')" v-bind="imageSize('terron-logo.png')" alt="" loading="lazy" decoding="async" />
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
                  <img class="how-shot how-shot--1" :src="asset('burntab.png')" v-bind="imageSize('burntab.png')" alt="" loading="lazy" decoding="async" />
                  <img class="how-shot how-shot--2" :src="asset('collecta.png')" v-bind="imageSize('collecta.png')" alt="" loading="lazy" decoding="async" />
                  <img class="how-shot how-shot--3" :src="asset('ducati.png')" v-bind="imageSize('ducati.png')" alt="" loading="lazy" decoding="async" />
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

          <div class="pricing-shell">
          <div class="pricing-panel">
            <div class="pricing-config">
              <div class="pricing-config-head">
                <h3>{{ activeTier.title }}</h3>
                <span class="pricing-days pricing-days--mobile"><span class="clock" aria-hidden="true"></span>{{ activeTier.days }}</span>
              </div>

              <p v-if="activeTier.note" class="pricing-note">{{ activeTier.note }}</p>

              <ul class="pricing-features">
                <li v-for="feature in activeTier.features" :key="feature">{{ feature }}</li>
              </ul>

              <div ref="bookingAddonRef" class="booking-addon-inline">
                <button
                  type="button"
                  class="addon-toggle booking-addon-trigger"
                  :class="{ 'is-on': bookingAddonOpen }"
                  :aria-expanded="String(bookingAddonOpen)"
                  @click="toggleBookingAddon()"
                >
                  <span class="addon-label">
                    <span class="desk-only">{{ t.pricing.bookingSystem.question }}</span>
                    <span class="mob-only">{{ t.pricing.bookingSystem.questionShort }}</span>
                  </span>
                  <span class="switch" :class="{ 'is-on': bookingAddonOpen }" aria-hidden="true"><i></i></span>
                </button>

                <transition name="tab-fade">
                  <div v-if="bookingAddonOpen" class="booking-addon-details">
                    <span class="booking-addon-details-title">{{ t.pricing.bookingSystem.setup }}</span>
                    <span class="addon-price">{{ euro(100) }} · {{ t.pricing.bookingSystem.oneTime }}</span>
                    <ul class="pricing-features">
                      <li v-for="feature in t.pricing.bookingSystem.features" :key="feature">{{ feature }}</li>
                    </ul>
                  </div>
                </transition>
              </div>
            </div>

            <div class="pricing-summary">
              <span class="pricing-days pricing-days--desktop"><span class="clock" aria-hidden="true"></span>{{ activeTier.days }}</span>
              <div class="price-card" v-tilt>
                <span class="price-card-glare" aria-hidden="true"></span>
                <span class="price-card-brand">TERRON</span>
                <span class="price-card-label">{{ activeTier.label2 }}</span>
                <span class="price-card-value">{{ euro(totalPrice) }}</span>
              </div>
              <div v-if="bookingAddonOpen" class="price-card green booking-price-card" v-tilt>
                <span class="price-card-glare" aria-hidden="true"></span>
                <span class="price-card-brand">EXTRAS</span>
                <span class="price-card-label">{{ t.pricing.bookingSystem.title }}</span>
                <div class="booking-price-lines">
                  <span><strong>{{ euro(100) }}</strong>{{ t.pricing.bookingSystem.oneTime }}</span>
                  <span><strong>{{ euro(29) }}</strong>{{ t.pricing.bookingSystem.perMo }}</span>
                </div>
              </div>
            </div>
            <div class="pricing-actions">
              <a class="button primary" href="#contact" @click="openContact($event, 'pricing')">
                <span class="pill-icon send" aria-hidden="true"></span>
                {{ t.sendMessage }}
              </a>
              <a class="button secondary" :href="bookCallHref" @click="openBook($event)">
                <span class="pill-icon meet" aria-hidden="true"></span>
                {{ t.bookCall }}
              </a>
            </div>
          </div>
          </div>

        </section>

        <!-- WHO ARE WE -->
        <section id="studio" class="section studio-section section-observe" data-section="studio">
          <div class="section-heading"><h2>{{ t.studio.heading }}</h2></div>
          <p class="studio-lead">
            {{ t.studio.leadPre }} <span class="lead-name"><img :src="asset('terron-pfp.webp')" v-bind="imageSize('terron-pfp.webp')" alt="" aria-hidden="true" loading="lazy" decoding="async" /> {{ t.studio.leadName }}</span><br />
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
            <p v-html="t.letter.p4Html"></p>
            <p>{{ t.letter.p5 }}</p>
            <p class="letter-final" v-html="t.letter.finalHtml"></p>
          </div>

          <div class="letter-sign">
            <img class="sign-mark" :src="asset('signature.png')" v-bind="imageSize('signature.png')" alt="Firma de Gonzalo Terrón" loading="lazy" decoding="async" />
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
            <a class="pill-button" :href="projectsPath" @click="goProjects">
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

    <main v-if="view === 'projects'" ref="projectsContentRef" class="content projects-content">
      <div class="projects-panel">
        <transition name="proj-swap" mode="out-in" @before-enter="handleProjectPanelBeforeEnter">
          <!-- LIST -->
          <div v-if="!activeProject" key="list" class="pg-list">
            <header class="pg-head">
              <h1 class="pg-list-reveal">{{ t.projectsPage.title }}</h1>
            </header>

            <div class="pg-grid">
              <a
                v-for="(project, index) in projectPages"
                :key="project.slug"
                :href="project.projectPath"
                class="pg-card pg-list-reveal"
                @click.prevent="openProject(project)"
              >
                <span class="pg-shot">
                  <img
                    :src="cover(project.cover)"
                    v-bind="coverSize(project.cover)"
                    :alt="project.alt"
                    :loading="index < 2 ? 'eager' : 'lazy'"
                    :fetchpriority="index === 0 ? 'high' : 'auto'"
                    decoding="async"
                  />
                </span>
                <span class="pg-caption">
                  <span class="pg-name">{{ project.name }}</span>
                </span>
              </a>
            </div>
          </div>

          <!-- DETAIL -->
          <div v-else :key="activeProject.slug" class="pg-detail" :class="{ 'is-ducati': activeProject.slug === 'ducati-w93' }">
            <header class="pg-detail-head">
              <a
                :href="projectsPath"
                class="pg-back"
                :aria-label="t.projectsPage.back"
                @click.prevent="closeProject"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
              <h1 class="pg-title-wrap">
                <span class="pg-title">{{ activeProject.name }}</span>
                <span class="pg-subtitle">{{ activeProject.tag }}</span>
              </h1>
              <a
                class="pg-visit"
                :href="activeProject.href"
                target="_blank"
                rel="noreferrer"
                @click="handleProjectLinkClick(activeProject)"
              >
                {{ t.projectsPage.visit }}
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 16 16 8M9.5 8H16v6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </header>

            <blockquote class="pg-brief">
              <p>
                {{ activeProject.brief.start }}
                <em>{{ activeProject.brief.emphasis }}</em>
                {{ activeProject.brief.end }}
                <span v-if="activeProject.brief.brand" class="pg-brief-brand">{{ activeProject.brief.brand }}</span>
              </p>
            </blockquote>

            <div class="pg-shots">
              <figure
                v-for="(item, index) in activeProject.shots"
                :key="item.file"
                class="pg-shot-item pg-shot-reveal"
                :class="{ 'is-tall': item.tall }"
              >
                <img
                  :src="shot(item.file)"
                  v-bind="imageSize(item.file)"
                  :alt="item.alt"
                  :loading="index === 0 ? 'eager' : 'lazy'"
                  :fetchpriority="index === 0 ? 'high' : 'auto'"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </transition>
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

    <transition name="contact-compose">
      <div v-if="contactModalOpen" class="contact-modal" @click.self="closeContact">
        <form class="contact-composer" :aria-label="t.contact.title" @submit.prevent="sendContactMessage">
          <div class="contact-composer-bar">
            <span>{{ t.contact.title }}</span>
            <button type="button" :aria-label="t.contact.close" @click="closeContact">×</button>
          </div>

          <div v-if="contactStatus === 'sent'" class="contact-success" role="status">
            <svg class="contact-success-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m5 12.5 4.25 4.25L19 7" />
            </svg>
            <h2>{{ t.contact.sentTitle }}</h2>
            <p>{{ t.contact.sentBody }}</p>
            <button class="button primary contact-success-button" type="button" @click="closeContact">{{ t.contact.done }}</button>
          </div>

          <template v-else>
            <div class="contact-field contact-recipient">
              <span>{{ t.contact.to }}</span>
              <strong>Terron Studio &lt;{{ email }}&gt;</strong>
            </div>
            <label class="contact-field">
              <span>{{ t.contact.from }}</span>
              <input v-model.trim="contactDraft.name" type="text" :placeholder="t.contact.namePlaceholder" maxlength="100" autocomplete="name" required />
            </label>
            <label class="contact-field">
              <span>{{ t.contact.replyTo }}</span>
              <input v-model.trim="contactDraft.replyTo" type="email" :placeholder="t.contact.emailPlaceholder" maxlength="254" autocomplete="email" required />
            </label>
            <label class="contact-field contact-subject">
              <span>{{ t.contact.subject }}</span>
              <input v-model.trim="contactDraft.subject" type="text" maxlength="160" required />
            </label>
            <label class="contact-honeypot" aria-hidden="true">
              Website
              <input v-model="contactDraft.website" type="text" tabindex="-1" autocomplete="off" />
            </label>
            <textarea v-model="contactDraft.message" class="contact-message" :aria-label="t.contact.message" maxlength="5000" required></textarea>
            <div class="contact-composer-footer">
              <button class="contact-send" type="submit" :disabled="contactSending">
                <span v-if="contactSending" class="contact-spinner" aria-hidden="true"></span>
                {{ contactSending ? t.contact.sending : t.contact.send }}
              </button>
              <p v-if="contactStatus" class="contact-error" role="alert">{{ contactStatus }}</p>
              <button class="contact-discard" type="button" :aria-label="t.contact.discard" @click="closeContact">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" /></svg>
              </button>
            </div>
          </template>
        </form>
      </div>
    </transition>
  </div>
</template>
