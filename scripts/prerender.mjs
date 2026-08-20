import { readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { getRouteSeo, PRERENDER_ROUTES, SITE_ORIGIN } from "../src/seo.js";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(projectRoot, "dist");
const baseTemplate = await readFile(join(distDir, "index.html"), "utf8");
const manifest = JSON.parse(await readFile(join(distDir, ".vite/manifest.json"), "utf8"));
const clientCssPath = manifest["index.html"]?.css?.[0];
if (!clientCssPath) throw new Error("No client stylesheet found in the Vite manifest");
const clientCss = await readFile(join(distDir, clientCssPath), "utf8");
const criticalFontSource =
  "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2";
const criticalFontPath = manifest[criticalFontSource]?.file;
if (!criticalFontPath) throw new Error("No critical Inter font found in the Vite manifest");
const template = baseTemplate.replace(
  /<link\s+rel="stylesheet"[^>]*>/i,
  `<link rel="preload" as="font" type="font/woff2" href="/${criticalFontPath}" crossorigin />\n    <style data-critical-css>${clientCss}</style>`
);
const { render } = await import(pathToFileURL(join(projectRoot, "dist-ssr/entry-server.js")));

const escapeAttribute = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function replaceMeta(html, attribute, key, content) {
  const pattern = new RegExp(
    `<meta\\s+${attribute}=["']${key}["'][^>]*>`,
    "i"
  );
  return html.replace(pattern, `<meta ${attribute}="${key}" content="${escapeAttribute(content)}" />`);
}

function replaceAssetUrls(html) {
  return html.replace(/file:\/\/\/[^"',\s]+\/assets\/([^"',\s]+)/g, (sourceUrl, relativePath) => {
    const sourceKey = `assets/${decodeURIComponent(relativePath)}`;
    const builtAsset = manifest[sourceKey]?.file;
    if (builtAsset) return `/${builtAsset}`;

    const extension = sourceKey.split(".").at(-1).toLowerCase();
    const mime = {
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    }[extension];
    if (!mime) throw new Error(`No client asset found for SSR URL: ${sourceUrl}`);
    const data = readFileSync(join(projectRoot, sourceKey)).toString("base64");
    return `data:${mime};base64,${data}`;
  });
}

function routeSchema(seo, canonicalUrl, imageUrl) {
  const languageTag = seo.locale === "es" ? "es-ES" : "en-US";
  const homeLabel = seo.locale === "es" ? "Inicio" : "Home";
  const projectsLabel = seo.locale === "es" ? "Proyectos" : "Projects";
  const localeHomeUrl = new URL(`/${seo.locale}`, SITE_ORIGIN).href;
  const localeProjectsUrl = new URL(`/${seo.locale}/projects`, SITE_ORIGIN).href;
  const webPage = {
    "@type": seo.type === "CollectionPage" ? "CollectionPage" : "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: seo.title,
    description: seo.description,
    inLanguage: languageTag,
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    about: { "@id": `${SITE_ORIGIN}/#organization` },
  };
  const graph = [webPage];

  if (seo.type === "CreativeWork") {
    webPage.mainEntity = { "@id": `${canonicalUrl}#project` };
    webPage.breadcrumb = { "@id": `${canonicalUrl}#breadcrumbs` };
    graph.push(
      {
        "@type": "CreativeWork",
        "@id": `${canonicalUrl}#project`,
        name: seo.name,
        url: canonicalUrl,
        description: seo.description,
        image: imageUrl,
        creator: { "@id": `${SITE_ORIGIN}/#organization` },
        inLanguage: languageTag,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: homeLabel,
            item: localeHomeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: projectsLabel,
            item: localeProjectsUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: seo.name,
            item: canonicalUrl,
          },
        ],
      }
    );
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

function applyRouteHead(html, route) {
  const seo = getRouteSeo(route);
  const canonicalUrl = new URL(seo.canonicalPath, SITE_ORIGIN).href;
  const imagePath = seo.imageSource ? manifest[seo.imageSource]?.file : "og.png";
  if (!imagePath) throw new Error(`No social image found for ${route}`);
  const imageUrl = new URL(`/${imagePath}`, SITE_ORIGIN).href;
  const isProject = seo.type === "CreativeWork";
  const lcpImagePath = manifest[seo.lcpImageSource]?.file;
  if (!lcpImagePath) throw new Error(`No LCP image found for ${route}`);

  html = html.replace(/<html\s+lang=["'][^"']+["']>/i, `<html lang="${seo.locale}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(seo.title)}</title>`);
  html = html.replace(
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );
  for (const [hreflang, alternatePath] of [
    ["es", seo.alternates.es],
    ["en", seo.alternates.en],
    ["x-default", seo.alternates.xDefault],
  ]) {
    const alternateUrl = new URL(alternatePath, SITE_ORIGIN).href;
    html = html.replace(
      new RegExp(`<link\\s+rel=["']alternate["']\\s+hreflang=["']${hreflang}["'][^>]*>`, "i"),
      `<link rel="alternate" hreflang="${hreflang}" href="${alternateUrl}" />`
    );
  }
  html = replaceMeta(html, "name", "description", seo.description);
  html = replaceMeta(html, "property", "og:title", seo.title);
  html = replaceMeta(html, "property", "og:description", seo.description);
  html = replaceMeta(html, "property", "og:url", canonicalUrl);
  html = replaceMeta(html, "property", "og:locale", seo.locale === "es" ? "es_ES" : "en_US");
  html = replaceMeta(html, "property", "og:locale:alternate", seo.locale === "es" ? "en_US" : "es_ES");
  html = replaceMeta(html, "property", "og:image", imageUrl);
  html = replaceMeta(html, "property", "og:image:alt", seo.imageAlt);
  html = replaceMeta(html, "property", "og:image:type", isProject ? "image/webp" : "image/png");
  html = replaceMeta(html, "property", "og:image:width", isProject ? "1920" : "1200");
  html = replaceMeta(html, "property", "og:image:height", isProject ? "1536" : "630");
  html = replaceMeta(html, "name", "twitter:title", seo.title);
  html = replaceMeta(html, "name", "twitter:description", seo.description);
  html = replaceMeta(html, "name", "twitter:image", imageUrl);
  html = replaceMeta(html, "name", "twitter:image:alt", seo.imageAlt);

  if (seo.locale === "en") {
    html = html
      .replace(
        "Estudio de diseño y desarrollo de páginas web a medida para negocios de toda España.",
        "Custom website design and development studio for businesses across Spain."
      )
      .replace(
        "Diseño y desarrollo de páginas web a medida para negocios de toda España.",
        "Custom website design and development for businesses across Spain."
      )
      .replace('"inLanguage": "es-ES"', '"inLanguage": "en-US"');
  }

  const responsivePreload = seo.lcpImageSrcSetSources
    ? ` imagesrcset="${seo.lcpImageSrcSetSources
        .map(({ source, width }) => `/${manifest[source]?.file} ${width}w`)
        .join(", ")}" imagesizes="${seo.lcpImageSizes}"`
    : "";
  html = html.replace(
    "</head>",
    `    <link rel="preload" as="image" href="/${lcpImagePath}"${responsivePreload} fetchpriority="high" />\n  </head>`
  );
  const schema = `<script type="application/ld+json">${routeSchema(seo, canonicalUrl, imageUrl)}</script>`;
  return html.replace("</head>", `    ${schema}\n  </head>`);
}

for (const route of PRERENDER_ROUTES) {
  const renderedApp = replaceAssetUrls(await render(route));
  let html = template.replace('<div id="app"></div>', `<div id="app">${renderedApp}</div>`);
  html = applyRouteHead(html, route);

  const outputFile =
    route === "/" ? join(distDir, "index.html") : join(distDir, route.slice(1), "index.html");
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, html);
  console.log(`prerendered ${route}`);
}
