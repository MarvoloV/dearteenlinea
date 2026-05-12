import { SITE_INSTAGRAM_DEARTEENLINEA, SITE_INSTAGRAM_QULLQA, SITE_QULLQA_WEB } from "./site-social";
import { qullqaProducts } from "./qullqa-products";

const DEFAULT_DEARTE_API_URL = "https://dearteenlinea.com";
const NOSOTROS_CONFIG_PATH = "/wp-json/dearte/v1/nosotros-config";
const PAGE_REVALIDATE_SECONDS = 5;

const FALLBACK_CONTENT_HTML = `
<p><strong>De Arte en Línea</strong> es la primera plataforma del Perú para la difusión y venta online de obras de arte moderno y contemporáneo. Lanzada en 2012 por <strong>Denise Dourojeanni</strong>.</p>
<p>La plataforma busca ofrecer una gama amplia de obras en distintos medios y de artistas en diferentes etapas de su carrera: desde nombres consolidados en el circuito local e internacional hasta artistas con proyección profesional y talentos jóvenes al inicio de su trayectoria.</p>
`;

const FALLBACK_IMAGE_SRC =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=960&q=85";
const FALLBACK_IMAGE_ALT =
  "Imagen de referencia; retrato de archivo hasta incorporar fotografía oficial.";

export type NosotrosProduct = {
  title: string;
  description: string;
  button_text: string;
  button_url: string;
};

export type NosotrosPageContent = {
  title: string;
  contentHtml: string;
  imageSrc: string;
  imageAlt: string;
  isFallbackImage: boolean;
  introTitle: string;
  introDescriptionHtml: string;
  introInstagramText: string;
  introInstagramUrl: string;
  collaborationTitle: string;
  collaborationDescriptionHtml: string;
  collaborationWebsiteText: string;
  collaborationWebsiteUrl: string;
  collaborationInstagramText: string;
  collaborationInstagramUrl: string;
  products: { name: string; description: string; href: string }[];
};

type NosotrosImage = {
  id?: number;
  url?: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  sizes?: Record<string, string | number>;
} | null;

type NosotrosIntro = {
  title?: string;
  description?: string;
  instagram_text?: string;
  instagram_url?: string;
  image?: NosotrosImage;
};

type NosotrosCollaborationProduct = {
  title?: string;
  description?: string;
  button_text?: string;
  button_url?: string;
};

type NosotrosCollaboration = {
  title?: string;
  description?: string;
  website_text?: string;
  website_url?: string;
  instagram_text?: string;
  instagram_url?: string;
  products?: NosotrosCollaborationProduct[];
};

type NosotrosConfigResponseData = {
  intro?: NosotrosIntro;
  collaboration?: NosotrosCollaboration;
};

type NosotrosConfigResponse = {
  success?: boolean;
  data?: NosotrosConfigResponseData;
};

const FALLBACK_INTRO_TITLE = "De Arte en Línea";

const FALLBACK_COLLABORATION_TITLE = "Colaboración con Qullqa";

const FALLBACK_COLLABORATION_DESCRIPTION_HTML = `
<p>
  <strong class="font-medium text-foreground">dearteenlinea</strong> trabaja junto a Qullqa para dar mayor visibilidad a artistas y obras, conectando la curaduría de la galería con la tecnología que impulsa a la comunidad artística.
</p>
<p>
  <span class="font-medium text-foreground">Qullqa</span> es una plataforma pensada para <strong class="font-medium text-foreground">coleccionistas</strong> y <strong class="font-medium text-foreground">artistas</strong>: centraliza la gestión de obras y colecciones y reduce fricciones en el día a día. Quienes publican desde Qullqa pueden mostrar parte de su trabajo al público en <strong class="font-medium text-foreground">qullqa gallery</strong>, el espacio abierto donde esta web también participa.
</p>
<p>
  Qullqa ofrece dos líneas de producto: <strong class="font-medium text-foreground">Qullqa Collector</strong>, orientada a quienes coleccionan, y <strong class="font-medium text-foreground">Qullqa Studio</strong>, para quienes crean y gestionan su obra desde el estudio.
</p>
`;

const FALLBACK_COLLABORATION = {
  collaborationWebsiteText: "Sitio web Qullqa",
  collaborationWebsiteUrl: SITE_QULLQA_WEB,
  collaborationInstagramText: "Qullqa",
  collaborationInstagramUrl: SITE_INSTAGRAM_QULLQA,
};

const fallbackNosotrosPage: NosotrosPageContent = {
  title: "Nosotros",
  contentHtml: FALLBACK_CONTENT_HTML,
  imageSrc: FALLBACK_IMAGE_SRC,
  imageAlt: FALLBACK_IMAGE_ALT,
  isFallbackImage: true,
  introTitle: FALLBACK_INTRO_TITLE,
  introDescriptionHtml: FALLBACK_CONTENT_HTML,
  introInstagramText: "dearteenlinea",
  introInstagramUrl: SITE_INSTAGRAM_DEARTEENLINEA,
  collaborationTitle: FALLBACK_COLLABORATION_TITLE,
  collaborationDescriptionHtml: FALLBACK_COLLABORATION_DESCRIPTION_HTML,
  ...FALLBACK_COLLABORATION,
  products: qullqaProducts.map((p) => ({
    name: p.name,
    description: p.description,
    href: p.href,
  })),
};

function nosotrosConfigUrl(): URL | null {
  const raw = process.env.NEXT_PUBLIC_DEARTE_API_URL ?? DEFAULT_DEARTE_API_URL;
  try {
    return new URL(NOSOTROS_CONFIG_PATH, raw.replace(/\/+$/, ""));
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

function normalizeNosotrosConfig(
  payload: unknown,
): NosotrosPageContent | null {
  if (!isRecord(payload)) return null;

  const raw = payload as NosotrosConfigResponse;
  if (!raw.success || !raw.data) return null;

  const data = raw.data;

  const intro = data.intro;
  const collaboration = data.collaboration;

  const introImage = intro?.image?.url ? intro.image : null;
  const imageSrc = introImage?.url ?? fallbackNosotrosPage.imageSrc;
  const isFallbackImage = imageSrc === fallbackNosotrosPage.imageSrc;

  const products = collaboration?.products?.map((p) => ({
    name: p.title ?? "",
    description: p.description ?? "",
    href: p.button_url ?? "#",
  })) ?? fallbackNosotrosPage.products;

  return {
    title: "Nosotros",
    contentHtml: intro?.description ?? fallbackNosotrosPage.contentHtml,
    imageSrc,
    imageAlt: introImage?.alt ?? fallbackNosotrosPage.imageAlt,
    isFallbackImage,
    introTitle: intro?.title ?? fallbackNosotrosPage.introTitle,
    introDescriptionHtml: intro?.description ?? fallbackNosotrosPage.introDescriptionHtml,
    introInstagramText: intro?.instagram_text ?? fallbackNosotrosPage.introInstagramText,
    introInstagramUrl: intro?.instagram_url ?? fallbackNosotrosPage.introInstagramUrl,
    collaborationTitle: collaboration?.title ?? fallbackNosotrosPage.collaborationTitle,
    collaborationDescriptionHtml: collaboration?.description ?? fallbackNosotrosPage.collaborationDescriptionHtml,
    collaborationWebsiteText: collaboration?.website_text ?? fallbackNosotrosPage.collaborationWebsiteText,
    collaborationWebsiteUrl: collaboration?.website_url ?? fallbackNosotrosPage.collaborationWebsiteUrl,
    collaborationInstagramText: collaboration?.instagram_text ?? fallbackNosotrosPage.collaborationInstagramText,
    collaborationInstagramUrl: collaboration?.instagram_url ?? fallbackNosotrosPage.collaborationInstagramUrl,
    products,
  };
}

export async function getNosotrosConfig(): Promise<NosotrosPageContent> {
  const endpoint = nosotrosConfigUrl();
  if (!endpoint) return fallbackNosotrosPage;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: PAGE_REVALIDATE_SECONDS },
      headers: { accept: "application/json" },
    });

    if (!response.ok) return fallbackNosotrosPage;

    return normalizeNosotrosConfig(await response.json()) ?? fallbackNosotrosPage;
  } catch {
    return fallbackNosotrosPage;
  }
}

export function getNosotrosPage(): Promise<NosotrosPageContent> {
  return getNosotrosConfig();
}
