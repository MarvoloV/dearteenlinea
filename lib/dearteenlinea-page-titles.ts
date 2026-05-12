const categorySlugMap: Record<string, string> = {
  "mercado-secundario": "Mercado secundario",
  "consolidados": "Artistas consolidados",
  "emergentes": "Artistas emergentes",
};

function formatSlugToLabel(slug: string): string {
  if (categorySlugMap[slug]) return categorySlugMap[slug];
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}

export function getCuratedWorksTitle(pathname: string): string {
  const mediosMatch = pathname.match(/\/obras\/medios\/([^/]+)/);
  if (mediosMatch) {
    const label = formatSlugToLabel(mediosMatch[1]);
    return `Obras curadas por medio: ${label}`;
  }

  const artistasMatch = pathname.match(/\/obras\/artistas\/([^/]+)/);
  if (artistasMatch) {
    const label = formatSlugToLabel(artistasMatch[1]);
    return `Obras curadas de artistas de: ${label}`;
  }

  return "Obras curadas";
}