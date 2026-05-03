import { mockArtworksDearteenlinea } from "@/lib/mock-artworks-dearteenlinea";
import type { Artist } from "@/lib/types/artist";
import type { Artwork, ArtworkDearteCategory } from "@/lib/types/artwork";

const OBRAS_DISPONIBLES_PATH = "/wp-json/dearte/v1/obras-disponibles";
const MEDIOS_PATH = "/wp-json/dearte/v1/medios";
const CATEGORIA_PATH = "/wp-json/dearte/v1/categoria";
const DEFAULT_DEARTE_API_URL = "https://dearteenlinea.com";
const HOME_CATEGORY_LIMIT = 5;

const categoryEndpointById: Record<ArtworkDearteCategory, string> = {
  mercado_secundario: "artistas-destacados",
  consolidados: "artistas-consagrados",
  emergentes: "artistas-emergente",
};

export type ObraDisponible = {
  id: number;
  titulo: string;
  url: string;
  imagen: string | null;
  imagen_full: string | null;
  artista: string | null;
  artista_url: string | null;
  medio: string | null;
  dimensiones: string | null;
  stock: boolean;
};

export type MedioDearte = {
  nombre: string;
  slug: string;
  imagen: string | null;
  link: string;
};

export type ObraCategoria = {
  id: number;
  titulo: string;
  slug: string;
  link: string;
  imagen: string | null;
  artista: {
    id: number;
    nombre: string;
    link: string;
  } | null;
  medio: {
    id: number;
    nombre: string;
    slug: string;
    link: string;
  } | null;
  dimensiones: string | null;
};

export type CategoriaObrasResponse = {
  slug: string;
  taxonomy: string;
  total: number;
  pages: number;
  current_page: number;
  per_page: number;
  data: ObraCategoria[];
};

export type DearteenlineaLatestArtworksView = {
  artworks: Artwork[];
  artists: Artist[];
};

export type DearteenlineaCategoryArtworksView = {
  artworks: Artwork[];
  artists: Artist[];
};

export type DearteenlineaHomeMedium = {
  label: string;
  slug?: string;
  imageUrl?: string | null;
  href?: string | null;
};

export type DearteenlineaApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; status?: number };

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function configuredDearteApiUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_DEARTE_API_URL ?? DEFAULT_DEARTE_API_URL;
  return raw.replace(/\/+$/, "");
}

function apiUrl(path: string): URL {
  return new URL(path, configuredDearteApiUrl());
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function firstNonEmpty(
  ...values: Array<string | null | undefined>
): string | null {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return null;
}

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    const key = String(entity).toLowerCase();

    if (key.startsWith("#x")) {
      const code = Number.parseInt(key.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }

    if (key.startsWith("#")) {
      const code = Number.parseInt(key.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }

    const named: Record<string, string> = {
      amp: "&",
      apos: "'",
      gt: ">",
      lt: "<",
      nbsp: " ",
      quot: '"',
      times: "×",
    };

    return named[key] ?? match;
  });
}

function normalizeText(value: string | null | undefined): string | null {
  const decoded = value ? decodeHtmlEntities(value) : "";
  return firstNonEmpty(decoded?.replace(/\s+/g, " "));
}

function fallbackArtworkImages(): string[] {
  return mockArtworksDearteenlinea.flatMap((artwork) => artwork.imageUrls);
}

function fallbackImageFor(index: number): string | null {
  const images = fallbackArtworkImages();
  if (images.length === 0) return null;
  return images[index % images.length] ?? null;
}

function slugFromUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts.at(-1) ?? null;
  } catch {
    return null;
  }
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitDisplayName(
  displayName: string,
): Pick<Artist, "firstName" | "lastName"> {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0]!, lastName: "" };
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1)!,
  };
}

function artistSlugFromObra(obra: ObraDisponible): string {
  const displayName = normalizeText(obra.artista);
  return (
    slugFromUrl(firstNonEmpty(obra.artista_url)) ??
    (displayName ? slugify(displayName) : "")
  );
}

function normalizeObra(raw: UnknownRecord, index: number): ObraDisponible {
  return {
    id: typeof raw.id === "number" ? raw.id : index,
    titulo: stringOrNull(raw.titulo) ?? "",
    url: stringOrNull(raw.url) ?? "",
    imagen: stringOrNull(raw.imagen),
    imagen_full: stringOrNull(raw.imagen_full),
    artista: stringOrNull(raw.artista),
    artista_url: stringOrNull(raw.artista_url),
    medio: stringOrNull(raw.medio),
    dimensiones: stringOrNull(raw.dimensiones),
    stock: raw.stock === true,
  };
}

function normalizeObrasPayload(payload: unknown): ObraDisponible[] | null {
  if (!Array.isArray(payload)) return null;
  const obras: ObraDisponible[] = [];

  for (const [index, item] of payload.entries()) {
    if (!isRecord(item)) return null;
    obras.push(normalizeObra(item, index));
  }

  return obras;
}

function normalizeApiArtist(raw: unknown): ObraCategoria["artista"] {
  if (!isRecord(raw)) return null;
  return {
    id: typeof raw.id === "number" ? raw.id : 0,
    nombre: stringOrNull(raw.nombre) ?? "",
    link: stringOrNull(raw.link) ?? "",
  };
}

function normalizeApiMedium(raw: unknown): ObraCategoria["medio"] {
  if (!isRecord(raw)) return null;
  return {
    id: typeof raw.id === "number" ? raw.id : 0,
    nombre: stringOrNull(raw.nombre) ?? "",
    slug: stringOrNull(raw.slug) ?? "",
    link: stringOrNull(raw.link) ?? "",
  };
}

function normalizeObraCategoria(
  raw: UnknownRecord,
  index: number,
): ObraCategoria {
  return {
    id: typeof raw.id === "number" ? raw.id : index,
    titulo: stringOrNull(raw.titulo) ?? "",
    slug: stringOrNull(raw.slug) ?? "",
    link: stringOrNull(raw.link) ?? "",
    imagen: stringOrNull(raw.imagen),
    artista: normalizeApiArtist(raw.artista),
    medio: normalizeApiMedium(raw.medio),
    dimensiones: stringOrNull(raw.dimensiones),
  };
}

function normalizeCategoriaPayload(
  payload: unknown,
): CategoriaObrasResponse | null {
  if (!isRecord(payload) || !Array.isArray(payload.data)) return null;

  const data: ObraCategoria[] = [];
  for (const [index, item] of payload.data.entries()) {
    if (!isRecord(item)) return null;
    data.push(normalizeObraCategoria(item, index));
  }

  return {
    slug: stringOrNull(payload.slug) ?? "",
    taxonomy: stringOrNull(payload.taxonomy) ?? "",
    total: typeof payload.total === "number" ? payload.total : data.length,
    pages: typeof payload.pages === "number" ? payload.pages : 1,
    current_page:
      typeof payload.current_page === "number" ? payload.current_page : 1,
    per_page: typeof payload.per_page === "number" ? payload.per_page : data.length,
    data,
  };
}

function normalizeMedio(raw: UnknownRecord): MedioDearte {
  return {
    nombre: stringOrNull(raw.nombre) ?? "",
    slug: stringOrNull(raw.slug) ?? "",
    imagen: stringOrNull(raw.imagen),
    link: stringOrNull(raw.link) ?? "",
  };
}

function normalizeMediosPayload(payload: unknown): MedioDearte[] | null {
  if (!Array.isArray(payload)) return null;
  const medios: MedioDearte[] = [];

  for (const item of payload) {
    if (!isRecord(item)) return null;
    medios.push(normalizeMedio(item));
  }

  return medios;
}

function artworkFromObra(obra: ObraDisponible, index: number): Artwork {
  const title = normalizeText(obra.titulo) ?? "Obra sin título";
  const medium = normalizeText(obra.medio) ?? "";
  const imageUrl =
    firstNonEmpty(obra.imagen, obra.imagen_full) ?? fallbackImageFor(index);

  return {
    slug: `dearte-${obra.id}`,
    title,
    artistSlug: artistSlugFromObra(obra),
    externalUrl: firstNonEmpty(obra.url),
    medium,
    technique: medium,
    dimensions: normalizeText(obra.dimensiones),
    imageUrls: imageUrl ? [imageUrl] : [],
    videoUrls: [],
    stock: obra.stock,
  };
}

function artistSlugFromCategoriaObra(obra: ObraCategoria): string {
  const displayName = normalizeText(obra.artista?.nombre);
  return (
    slugFromUrl(firstNonEmpty(obra.artista?.link)) ??
    (displayName ? slugify(displayName) : "")
  );
}

function artworkFromCategoriaObra(
  obra: ObraCategoria,
  category: ArtworkDearteCategory,
  index: number,
): Artwork {
  const title = normalizeText(obra.titulo) ?? "Obra sin título";
  const medium = normalizeText(obra.medio?.nombre) ?? "";
  const imageUrl = firstNonEmpty(obra.imagen) ?? fallbackImageFor(index);

  return {
    slug: firstNonEmpty(obra.slug) ?? `dearte-categoria-${obra.id}`,
    title,
    artistSlug: artistSlugFromCategoriaObra(obra),
    externalUrl: firstNonEmpty(obra.link),
    medium,
    mediumUrl: firstNonEmpty(obra.medio?.link),
    category,
    technique: medium,
    dimensions: normalizeText(obra.dimensiones),
    imageUrls: imageUrl ? [imageUrl] : [],
    videoUrls: [],
  };
}

function artistsFromObras(obras: ObraDisponible[]): Artist[] {
  const artists = new Map<string, Artist>();

  for (const obra of obras) {
    const displayName = normalizeText(obra.artista);
    const slug = artistSlugFromObra(obra);
    if (!displayName || !slug || artists.has(slug)) continue;

    artists.set(slug, {
      slug,
      displayName,
      ...splitDisplayName(displayName),
      web: firstNonEmpty(obra.artista_url),
    });
  }

  return [...artists.values()];
}

function artistsFromCategoriaObras(obras: ObraCategoria[]): Artist[] {
  const artists = new Map<string, Artist>();

  for (const obra of obras) {
    const displayName = normalizeText(obra.artista?.nombre);
    const slug = artistSlugFromCategoriaObra(obra);
    if (!displayName || !slug || artists.has(slug)) continue;

    artists.set(slug, {
      slug,
      displayName,
      ...splitDisplayName(displayName),
      web: firstNonEmpty(obra.artista?.link),
    });
  }

  return [...artists.values()];
}

function homeMediumFromMedio(
  medio: MedioDearte,
  index: number,
): DearteenlineaHomeMedium | null {
  const label = normalizeText(medio.nombre);
  if (!label) return null;

  const slug = firstNonEmpty(medio.slug) ?? slugify(label);

  return {
    label,
    slug,
    imageUrl: firstNonEmpty(medio.imagen) ?? fallbackImageFor(index),
    href: firstNonEmpty(medio.link),
  };
}

function errorResult<T>(
  message: string,
  status?: number,
): DearteenlineaApiResult<T> {
  return { ok: false, message, status };
}

async function fetchDearteJson(
  path: string,
): Promise<DearteenlineaApiResult<unknown>> {
  let url: URL;

  try {
    url = apiUrl(path);
  } catch {
    return errorResult("La URL base de Dearte en Línea no es válida.");
  }

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      return errorResult(
        `Dearte en Línea respondió con estado ${response.status}.`,
        response.status,
      );
    }

    return { ok: true, data: await response.json() };
  } catch {
    return errorResult("No se pudo conectar con Dearte en Línea.");
  }
}

export async function getObrasDisponibles(): Promise<
  DearteenlineaApiResult<ObraDisponible[]>
> {
  const result = await fetchDearteJson(OBRAS_DISPONIBLES_PATH);
  if (!result.ok) return result;

  const obras = normalizeObrasPayload(result.data);
  if (!obras) {
    return errorResult("La respuesta de obras de Dearte en Línea no es válida.");
  }

  return { ok: true, data: obras };
}

export async function getMediosDearte(): Promise<
  DearteenlineaApiResult<MedioDearte[]>
> {
  const result = await fetchDearteJson(MEDIOS_PATH);
  if (!result.ok) return result;

  const medios = normalizeMediosPayload(result.data);
  if (!medios) {
    return errorResult("La respuesta de medios de Dearte en Línea no es válida.");
  }

  return { ok: true, data: medios };
}

export async function getObrasCategoria(
  slug: string,
  page = 1,
): Promise<DearteenlineaApiResult<CategoriaObrasResponse>> {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : 1;
  const result = await fetchDearteJson(
    `${CATEGORIA_PATH}/${encodeURIComponent(slug)}?page=${safePage}`,
  );
  if (!result.ok) return result;

  const category = normalizeCategoriaPayload(result.data);
  if (!category) {
    return errorResult(
      "La respuesta de categoría de Dearte en Línea no es válida.",
    );
  }

  return { ok: true, data: category };
}

export function getObrasMercadoSecundario(page = 1) {
  return getObrasCategoria(categoryEndpointById.mercado_secundario, page);
}

export function getObrasEmergentes(page = 1) {
  return getObrasCategoria(categoryEndpointById.emergentes, page);
}

export function getObrasConsolidados(page = 1) {
  return getObrasCategoria(categoryEndpointById.consolidados, page);
}

export async function fetchDearteenlineaLatestArtworks(
  limit = 5,
): Promise<DearteenlineaApiResult<DearteenlineaLatestArtworksView>> {
  const result = await getObrasDisponibles();
  if (!result.ok) return result;

  const selectedObras = result.data.slice(0, limit);

  return {
    ok: true,
    data: {
      artworks: selectedObras.map(artworkFromObra),
      artists: artistsFromObras(selectedObras),
    },
  };
}

export async function fetchDearteenlineaHomeMediums(): Promise<
  DearteenlineaApiResult<DearteenlineaHomeMedium[]>
> {
  const result = await getMediosDearte();
  if (!result.ok) return result;

  const mediums = result.data
    .map(homeMediumFromMedio)
    .filter((medium): medium is DearteenlineaHomeMedium => medium !== null);

  if (mediums.length === 0) {
    return errorResult("La respuesta de medios no incluye items válidos.");
  }

  return { ok: true, data: mediums };
}

export async function fetchDearteenlineaCategoryArtworks(
  category: ArtworkDearteCategory,
  page = 1,
): Promise<DearteenlineaApiResult<DearteenlineaCategoryArtworksView>> {
  const result = await getObrasCategoria(categoryEndpointById[category], page);
  if (!result.ok) return result;

  const selectedObras = result.data.data.slice(0, HOME_CATEGORY_LIMIT);

  return {
    ok: true,
    data: {
      artworks: selectedObras.map((obra, index) =>
        artworkFromCategoriaObra(obra, category, index),
      ),
      artists: artistsFromCategoriaObras(selectedObras),
    },
  };
}
