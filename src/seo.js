import { messages } from "./i18n.js";

export const SITE_ORIGIN = "https://terron-studio.com";
export const SUPPORTED_LOCALES = ["es", "en"];

const CONTENT_ROUTES = [
  "",
  "/projects",
  "/projects/sushi-panda",
  "/projects/the-vegan-roll",
  "/projects/aparicio-alemany",
  "/projects/ducati-w93",
  "/projects/pecatto-burger",
  "/projects/locura-burger",
  "/projects/platypool",
  "/projects/reservas",
  "/projects/collecta",
  "/projects/burntab",
];

export const PRERENDER_ROUTES = SUPPORTED_LOCALES.flatMap((locale) =>
  CONTENT_ROUTES.map((route) => `/${locale}${route}`)
);

const projectData = {
  "sushi-panda": {
    name: "Sushi Panda",
    imageSource: "assets/sushi-panda.webp",
    lcpImageSource: "assets/sushi-panda.webp",
    imageAltIndex: 0,
  },
  "aparicio-alemany": {
    name: "Aparicio & Alemany",
    imageSource: "assets/aparicio-1.webp",
    lcpImageSource: "assets/aparicio.webp",
    imageAltIndex: 2,
  },
  "ducati-w93": {
    name: "Ducati W93",
    imageSource: "assets/ducati-1.webp",
    lcpImageSource: "assets/ducati.webp",
    imageAltIndex: 3,
  },
  "pecatto-burger": {
    name: "Pecatto Burger",
    imageSource: "assets/pecatto-1.webp",
    lcpImageSource: "assets/pecatto.webp",
    imageAltIndex: 4,
  },
  reservas: {
    name: "Sistema de reservas by Terron Studio",
    imageSource: "assets/reservas-1.webp",
    lcpImageSource: "assets/reservas.webp",
    imageAltIndex: 7,
  },
  collecta: {
    name: "Collecta",
    imageSource: "assets/collecta-1.webp",
    lcpImageSource: "assets/collecta.webp",
    imageAltIndex: 8,
  },
  burntab: {
    name: "BurnTab",
    imageSource: "assets/burntab-1.webp",
    lcpImageSource: "assets/burntab.webp",
    imageAltIndex: 9,
  },
  "the-vegan-roll": {
    name: "The Vegan Roll",
    imageSource: "assets/vegan-roll.webp",
    lcpImageSource: "assets/vegan-roll.webp",
    imageAltIndex: 1,
  },
  "locura-burger": {
    name: "Locura Burger",
    imageSource: "assets/locura.webp",
    lcpImageSource: "assets/locura.webp",
    imageAltIndex: 5,
  },
  platypool: {
    name: "Platypool",
    imageSource: "assets/platypool.webp",
    lcpImageSource: "assets/platypool.webp",
    imageAltIndex: 6,
  },
};

function normalizePath(path) {
  const pathname = path.split(/[?#]/)[0] || "/";
  return pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;
}

export function getLocalizedPath(path, locale) {
  const normalizedPath = normalizePath(path);
  const parts = normalizedPath.split("/").filter(Boolean);
  const contentParts = SUPPORTED_LOCALES.includes(parts[0]) ? parts.slice(1) : parts;
  return `/${locale}${contentParts.length ? `/${contentParts.join("/")}` : ""}`;
}

export function getRouteSeo(path, localeOverride) {
  const normalizedPath = normalizePath(path);
  const parts = normalizedPath.split("/").filter(Boolean);
  const routeLocale = SUPPORTED_LOCALES.includes(parts[0]) ? parts.shift() : null;
  const locale = routeLocale ?? (SUPPORTED_LOCALES.includes(localeOverride) ? localeOverride : "es");
  const copy = messages[locale] ?? messages.es;
  const contentPath = parts.length ? `/${parts.join("/")}` : "/";
  const canonicalPath = getLocalizedPath(contentPath, locale);
  const alternates = {
    es: getLocalizedPath(contentPath, "es"),
    en: getLocalizedPath(contentPath, "en"),
    xDefault: contentPath === "/" ? "/" : getLocalizedPath(contentPath, "es"),
  };
  const slug = parts[0] === "projects" ? parts[1] ?? null : null;
  const project = slug ? projectData[slug] : null;

  if (project) {
    return {
      canonicalPath,
      title: copy.projectsPage.seo[slug].title,
      description: copy.projectsPage.seo[slug].description,
      imageSource: project.imageSource,
      lcpImageSource: project.lcpImageSource,
      imageAlt: copy.work.projectAlts[project.imageAltIndex],
      type: "CreativeWork",
      name: copy.projectsPage.names[slug] ?? project.name,
      locale,
      alternates,
    };
  }

  if (contentPath === "/projects") {
    return {
      canonicalPath,
      title: copy.projectsPage.seoTitle,
      description: copy.projectsPage.seoDescription,
      imageSource: null,
      lcpImageSource: "assets/trimmed/aparicio.webp",
      imageAlt:
        locale === "es"
          ? "Terron Studio — diseño web a medida para negocios"
          : "Terron Studio — custom web design for businesses",
      type: "CollectionPage",
      name: copy.projectsPage.title,
      locale,
      alternates,
    };
  }

  return {
    canonicalPath,
    title: copy.docTitle,
    description: copy.docDescription,
    imageSource: null,
    lcpImageSource: "assets/responsive/aparicio-2-480.webp",
    lcpImageSrcSetSources: [
      { source: "assets/responsive/aparicio-2-480.webp", width: 480 },
      { source: "assets/responsive/aparicio-2-768.webp", width: 768 },
      { source: "assets/responsive/aparicio-2-1200.webp", width: 1200 },
      { source: "assets/aparicio-2.webp", width: 1920 },
    ],
    lcpImageSizes: "(max-width: 820px) calc(70vw - 31px), 605px",
    imageAlt:
      locale === "es"
        ? "Terron Studio — diseño web a medida para negocios"
        : "Terron Studio — custom web design for businesses",
    type: "WebPage",
    name: "Terron Studio",
    locale,
    alternates,
  };
}
