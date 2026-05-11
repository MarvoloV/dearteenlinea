const DEFAULT_DEARTE_API_URL = "https://dearteenlinea.com";
const PAGE_PATH = "/wp-json/dearte/v1/paginas";
const NOSOTROS_SLUG = "quienes-somos";
const PAGE_REVALIDATE_SECONDS = 3600;

const FALLBACK_CONTENT_HTML = `
<p><strong>De Arte en Línea</strong> es la primera plataforma del Perú para la difusión y venta online de obras de arte moderno y contemporáneo. Lanzada en 2012 por <strong>Denise Dourojeanni</strong>.</p>
<p>La plataforma busca ofrecer una gama amplia de obras en distintos medios y de artistas en diferentes etapas de su carrera: desde nombres consolidados en el circuito local e internacional hasta artistas con proyección profesional y talentos jóvenes al inicio de su trayectoria.</p>
`;

const FALLBACK_IMAGE_SRC =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=960&q=85";
const FALLBACK_IMAGE_ALT =
  "Imagen de referencia; retrato de archivo hasta incorporar fotografía oficial.";

export type NosotrosPageContent = {
  title: string;
  contentHtml: string;
  imageSrc: string;
  imageAlt: string;
  isFallbackImage: boolean;
};

type NosotrosFeaturedImage = {
  id?: unknown;
  url?: unknown;
  large?: unknown;
  medium?: unknown;
  thumbnail?: unknown;
  alt?: unknown;
};

type NosotrosPageResponse = {
  id?: unknown;
  titulo?: unknown;
  slug?: unknown;
  link?: unknown;
  contenido_raw?: unknown;
  contenido_html?: unknown;
  bloques?: unknown;
  imagen_destacada?: NosotrosFeaturedImage | null;
};

const fallbackNosotrosPage: NosotrosPageContent = {
  title: "Nosotros",
  contentHtml: FALLBACK_CONTENT_HTML,
  imageSrc: FALLBACK_IMAGE_SRC,
  imageAlt: FALLBACK_IMAGE_ALT,
  isFallbackImage: true,
};

function pageEndpoint(slug: string): URL | null {
  const raw =
    process.env.NEXT_PUBLIC_DEARTE_API_URL ?? DEFAULT_DEARTE_API_URL;

  try {
    return new URL(
      `${PAGE_PATH}/${encodeURIComponent(slug)}`,
      raw.replace(/\/+$/, ""),
    );
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeNosotrosPage(
  payload: unknown,
): NosotrosPageContent | null {
  if (!isRecord(payload)) return null;

  const raw = payload as NosotrosPageResponse;
  const title = stringOrNull(raw.titulo) ?? fallbackNosotrosPage.title;
  const contentHtml = stringOrNull(raw.contenido_html);
  const image = isRecord(raw.imagen_destacada) ? raw.imagen_destacada : null;
  const imageSrc =
    stringOrNull(image?.large) ??
    stringOrNull(image?.url) ??
    fallbackNosotrosPage.imageSrc;

  return {
    title,
    contentHtml: contentHtml ?? fallbackNosotrosPage.contentHtml,
    imageSrc,
    imageAlt: stringOrNull(image?.alt) ?? fallbackNosotrosPage.imageAlt,
    isFallbackImage: imageSrc === fallbackNosotrosPage.imageSrc,
  };
}

export async function getPageBySlug(
  slug: string,
): Promise<NosotrosPageContent> {
  const endpoint = pageEndpoint(slug);
  if (!endpoint) return fallbackNosotrosPage;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: PAGE_REVALIDATE_SECONDS },
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) return fallbackNosotrosPage;

    return normalizeNosotrosPage(await response.json()) ?? fallbackNosotrosPage;
  } catch {
    return fallbackNosotrosPage;
  }
}

export function getNosotrosPage(): Promise<NosotrosPageContent> {
  return getPageBySlug(NOSOTROS_SLUG);
}
