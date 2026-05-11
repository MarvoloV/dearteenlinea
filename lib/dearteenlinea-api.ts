import { mockArtworksDearteenlinea } from "@/lib/mock-artworks-dearteenlinea";
import {
  dearteCategoryApiSlugById,
  dearteCategoryApiSlugFromFilterValue,
  dearteCategoryIdFromSlug,
} from "@/lib/dearte-filter-slugs";
import type { Artist } from "@/lib/types/artist";
import type { Artwork, ArtworkDearteCategory } from "@/lib/types/artwork";
import type {
  DearteArtistaDetalle,
  DearteArtistaListado,
  DearteArtistasResponse,
  DearteCategoriaItem,
  DearteCategoriaResponse,
  DearteFiltrosObrasResponse,
  DearteLetraArtista,
  DearteLetrasArtistasResponse,
  DearteMedio,
  DearteObraArtistaDetalle,
  DearteObraDetalle,
  DearteObraDisponible,
  DearteObraListado,
  DearteObraRelacionada,
  DearteObrasResponse,
  DearteTaxonomyTerm,
} from "@/lib/types/dearte";
export type {
  DearteArtistaDetalle as ArtistaDetalleDearte,
  DearteArtistaListado as ArtistaDearte,
  DearteArtistasResponse as ArtistasDearteResponse,
  DearteCategoriaItem as ObraCategoria,
  DearteCategoriaResponse as CategoriaObrasResponse,
  DearteFiltrosObrasResponse as FiltrosObrasResponse,
  DearteLetraArtista as LetraArtistaDearte,
  DearteLetrasArtistasResponse as LetrasArtistasResponse,
  DearteMedio as MedioDearte,
  DearteObraArtistaDetalle as ObraArtista,
  DearteObraDetalle,
  DearteObraDisponible as ObraDisponible,
  DearteObraListado,
  DearteObraRelacionada,
  DearteObrasResponse,
  DearteTaxonomyTerm,
} from "@/lib/types/dearte";

type ArtistaDearte = DearteArtistaListado;
type ArtistasDearteResponse = DearteArtistasResponse;
type FiltrosObrasResponse = DearteFiltrosObrasResponse;
type ObraDisponible = DearteObraDisponible;
type MedioDearte = DearteMedio;
type ObraCategoria = DearteCategoriaItem;
type CategoriaObrasResponse = DearteCategoriaResponse;
type LetraArtistaDearte = DearteLetraArtista;
type LetrasArtistasResponse = DearteLetrasArtistasResponse;
type ArtistaDetalleDearte = DearteArtistaDetalle;
type ObraArtista = DearteObraArtistaDetalle;

const FILTROS_OBRAS_PATH = "/wp-json/dearte/v1/filtros-obras";
const OBRAS_PATH = "/wp-json/dearte/v1/obras";
const OBRAS_DISPONIBLES_PATH = "/wp-json/dearte/v1/obras-disponibles";
const MEDIOS_PATH = "/wp-json/dearte/v1/medios";
const CATEGORIA_PATH = "/wp-json/dearte/v1/categoria";
const ARTISTAS_PATH = "/wp-json/dearte/v1/artistas";
const ARTISTAS_LETRAS_PATH = "/wp-json/dearte/v1/artistas-letras";
const DEFAULT_DEARTE_API_URL = "https://dearteenlinea.com";
const HOME_CATEGORY_LIMIT = 5;
const HOME_REVALIDATE_SECONDS = 300;
const LIST_REVALIDATE_SECONDS = 300;
const TAXONOMY_REVALIDATE_SECONDS = 600;

type DearteFetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};

export type DearteenlineaLatestArtworksView = {
  artworks: Artwork[];
  artists: Artist[];
};

export type DearteenlineaCategoryArtworksView = {
  artworks: Artwork[];
  artists: Artist[];
};

export type DearteenlineaFilterOption = {
  label: string;
  slug: string;
  count: number;
  href?: string | null;
};

export type DearteenlineaObrasPagination = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
};

export type DearteenlineaAppliedArtworkFilters = {
  search: string;
  categorias: string[];
  medios: string[];
};

export type DearteenlineaObrasCatalogView = {
  artworks: Artwork[];
  artists: Artist[];
  categories: DearteenlineaFilterOption[];
  mediums: DearteenlineaFilterOption[];
  pagination: DearteenlineaObrasPagination;
  appliedFilters: DearteenlineaAppliedArtworkFilters;
};

export type DearteenlineaObrasFiltersView = {
  categories: DearteenlineaFilterOption[];
  mediums: DearteenlineaFilterOption[];
};

export type DearteenlineaObrasListView = {
  artworks: Artwork[];
  artists: Artist[];
  pagination: DearteenlineaObrasPagination;
  appliedFilters: DearteenlineaAppliedArtworkFilters;
};

export type DearteenlineaHomeMedium = {
  label: string;
  slug?: string;
  imageUrl?: string | null;
  href?: string | null;
};

export type DearteenlineaArtistsParams = {
  letra?: string;
  search?: string;
};

export type DearteenlineaObrasParams = {
  page?: number;
  perPage?: number;
  categorias?: string[];
  medios?: string[];
  search?: string;
};

export type DearteenlineaArtistDetailView = {
  artist: Artist;
  artworks: Artwork[];
};

export type DearteenlineaArtworkDetailView = {
  artwork: Artwork;
  artist: Artist | null;
  artists: Artist[];
  relatedByArtist: Artwork[];
  relatedByMedium: Artwork[];
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

function normalizeUrl(value: string | null | undefined): string | null {
  return firstNonEmpty(value);
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

function normalizeArtistaDearte(raw: UnknownRecord): ArtistaDearte {
  const imagen = raw.imagen;

  return {
    id: typeof raw.id === "number" ? raw.id : 0,
    nombre: stringOrNull(raw.nombre) ?? "",
    slug: stringOrNull(raw.slug) ?? "",
    imagen:
      typeof imagen === "string" || imagen === false || imagen === null
        ? imagen
        : null,
    link: stringOrNull(raw.link) ?? "",
  };
}

function normalizeArtistasPayload(payload: unknown): ArtistasDearteResponse | null {
  if (!isRecord(payload) || !Array.isArray(payload.data)) return null;

  const data: ArtistaDearte[] = [];
  for (const item of payload.data) {
    if (!isRecord(item)) return null;
    data.push(normalizeArtistaDearte(item));
  }

  return {
    letra: stringOrNull(payload.letra),
    search: stringOrNull(payload.search),
    total: typeof payload.total === "number" ? payload.total : data.length,
    data,
  };
}

function normalizeLetraArtista(raw: UnknownRecord): LetraArtistaDearte {
  return {
    letra: stringOrNull(raw.letra) ?? "",
    slug: stringOrNull(raw.slug) ?? "",
    link: stringOrNull(raw.link) ?? "",
  };
}

function normalizeLetrasArtistasPayload(
  payload: unknown,
): LetrasArtistasResponse | null {
  if (!isRecord(payload) || !Array.isArray(payload.data)) return null;

  const data: LetraArtistaDearte[] = [];
  for (const item of payload.data) {
    if (!isRecord(item)) return null;
    data.push(normalizeLetraArtista(item));
  }

  return {
    total: typeof payload.total === "number" ? payload.total : data.length,
    data,
  };
}

function normalizeTaxonomyTerm(raw: unknown): DearteTaxonomyTerm | null {
  if (!isRecord(raw)) return null;

  const nombre = stringOrNull(raw.nombre) ?? "";
  const slug = stringOrNull(raw.slug) ?? "";
  const link = stringOrNull(raw.link) ?? "";
  if (!nombre || !slug || !link || typeof raw.id !== "number") return null;

  return {
    id: raw.id,
    nombre,
    slug,
    link,
    count: typeof raw.count === "number" ? raw.count : 0,
  };
}

function normalizeTaxonomyTermArray(payload: unknown): DearteTaxonomyTerm[] | null {
  if (!Array.isArray(payload)) return null;

  const terms: DearteTaxonomyTerm[] = [];
  for (const item of payload) {
    const term = normalizeTaxonomyTerm(item);
    if (!term) return null;
    terms.push(term);
  }

  return terms;
}

function normalizeIndexedTaxonomyTerms(
  payload: unknown,
): Record<string, DearteTaxonomyTerm> | null {
  if (!isRecord(payload)) return null;

  const entries: Array<[string, DearteTaxonomyTerm]> = [];
  for (const [key, value] of Object.entries(payload)) {
    const term = normalizeTaxonomyTerm(value);
    if (!term) return null;
    entries.push([key, term]);
  }

  entries.sort((a, b) => Number(a[0]) - Number(b[0]));
  return Object.fromEntries(entries);
}

function normalizeFiltrosObrasPayload(
  payload: unknown,
): FiltrosObrasResponse | null {
  if (!isRecord(payload)) return null;

  const categorias = normalizeIndexedTaxonomyTerms(payload.categorias);
  const medios = normalizeTaxonomyTermArray(payload.medios);
  if (!categorias || !medios) return null;

  return {
    categorias,
    medios,
  };
}

function normalizeObraListadoArtist(raw: unknown): DearteObraListado["artista"] {
  if (!isRecord(raw)) return null;

  const nombre = stringOrNull(raw.nombre) ?? "";
  const slug = stringOrNull(raw.slug) ?? "";
  const link = stringOrNull(raw.link) ?? "";
  if (!nombre || !slug || !link || typeof raw.id !== "number") return null;

  return {
    id: raw.id,
    nombre,
    slug,
    link,
    imagen: stringOrNull(raw.imagen),
  };
}

function normalizeObraListadoMedium(raw: unknown): DearteObraListado["medio"] {
  return normalizeTaxonomyTerm(raw);
}

function normalizeDeartePrice(raw: unknown): DearteObraListado["precio"] {
  if (!isRecord(raw)) return null;

  return {
    html: stringOrNull(raw.html),
    regular: stringOrNull(raw.regular),
    sale: stringOrNull(raw.sale),
    current: stringOrNull(raw.current),
    currency: stringOrNull(raw.currency),
  };
}

function normalizeObraListado(
  raw: UnknownRecord,
  index: number,
): DearteObraListado {
  return {
    id: typeof raw.id === "number" ? raw.id : index,
    titulo: stringOrNull(raw.titulo) ?? "",
    slug: stringOrNull(raw.slug) ?? "",
    link: stringOrNull(raw.link) ?? "",
    imagen: stringOrNull(raw.imagen),
    artista: normalizeObraListadoArtist(raw.artista),
    medio: normalizeObraListadoMedium(raw.medio),
    categorias: normalizeTaxonomyTermArray(raw.categorias) ?? [],
    dimensiones: stringOrNull(raw.dimensiones),
    precio: normalizeDeartePrice(raw.precio),
  };
}

function normalizeStringList(value: unknown): string[] {
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanStringList(values: string[] | undefined): string[] {
  return [
    ...new Set((values ?? []).map((item) => item.trim()).filter(Boolean)),
  ];
}

function cleanCategoryStringList(values: string[] | undefined): string[] {
  return cleanStringList(values).map(dearteCategoryApiSlugFromFilterValue);
}

function normalizeObrasResponsePayload(
  payload: unknown,
): DearteObrasResponse | null {
  if (!isRecord(payload) || !Array.isArray(payload.data) || !isRecord(payload.filters)) {
    return null;
  }

  const data: DearteObraListado[] = [];
  for (const [index, item] of payload.data.entries()) {
    if (!isRecord(item)) return null;
    data.push(normalizeObraListado(item, index));
  }

  return {
    data,
    filters: {
      search: stringOrNull(payload.filters.search),
      categorias: normalizeStringList(
        payload.filters.categorias ?? payload.filters.categoria,
      ).map(dearteCategoryApiSlugFromFilterValue),
      medios: normalizeStringList(
        payload.filters.medios ?? payload.filters.medio,
      ),
    },
    page: typeof payload.page === "number" ? payload.page : 1,
    pages: typeof payload.pages === "number" ? payload.pages : 1,
    per_page: typeof payload.per_page === "number" ? payload.per_page : data.length,
    total: typeof payload.total === "number" ? payload.total : data.length,
  };
}

function normalizeObraDetallePayload(payload: unknown): DearteObraDetalle | null {
  if (!isRecord(payload)) return null;

  return {
    id: typeof payload.id === "number" ? payload.id : 0,
    titulo: stringOrNull(payload.titulo) ?? "",
    slug: stringOrNull(payload.slug) ?? "",
    link: stringOrNull(payload.link) ?? "",
    imagen: stringOrNull(payload.imagen),
    galeria: Array.isArray(payload.galeria) ? payload.galeria : [],
    artista: normalizeObraListadoArtist(payload.artista),
    curaduria: normalizeTaxonomyTermArray(payload.curaduria) ?? [],
    medio: normalizeObraListadoMedium(payload.medio),
    tecnica: stringOrNull(payload.tecnica),
    anio: typeof payload.anio === "number" ? payload.anio : null,
    dimensiones: stringOrNull(payload.dimensiones),
    precio: stringOrNull(payload.precio),
    descripcion: stringOrNull(payload.descripcion),
    otras_obras_artista: Array.isArray(payload.otras_obras_artista)
      ? payload.otras_obras_artista
          .filter(isRecord)
          .map((item, index) => normalizeObraListado(item, index))
      : [],
  };
}

function normalizeArtistDetailMedium(raw: unknown): ObraArtista["medio"] {
  if (!isRecord(raw)) return null;
  return {
    id: typeof raw.id === "number" ? raw.id : 0,
    nombre: stringOrNull(raw.nombre) ?? "",
    slug: stringOrNull(raw.slug) ?? "",
    link: stringOrNull(raw.link) ?? "",
  };
}

function normalizeObraArtista(raw: UnknownRecord, index: number): ObraArtista {
  return {
    id: typeof raw.id === "number" ? raw.id : index,
    titulo: stringOrNull(raw.titulo) ?? "",
    slug: stringOrNull(raw.slug) ?? "",
    link: stringOrNull(raw.link) ?? "",
    imagen: stringOrNull(raw.imagen),
    medio: normalizeArtistDetailMedium(raw.medio),
    dimensiones: stringOrNull(raw.dimensiones),
  };
}

function normalizeArtistaDetallePayload(
  payload: unknown,
): ArtistaDetalleDearte | null {
  if (!isRecord(payload) || !Array.isArray(payload.obras)) return null;

  const obras: ObraArtista[] = [];
  for (const [index, item] of payload.obras.entries()) {
    if (!isRecord(item)) return null;
    obras.push(normalizeObraArtista(item, index));
  }

  return {
    id: typeof payload.id === "number" ? payload.id : 0,
    nombre: stringOrNull(payload.nombre) ?? "",
    slug: stringOrNull(payload.slug) ?? "",
    link: stringOrNull(payload.link) ?? "",
    imagen: stringOrNull(payload.imagen),
    descripcion: stringOrNull(payload.descripcion),
    obras,
  };
}

function artworkFromObra(obra: ObraDisponible, index: number): Artwork {
  const title = normalizeText(obra.titulo) ?? "Obra sin título";
  const medium = normalizeText(obra.medio) ?? "";
  const imageUrl =
    firstNonEmpty(obra.imagen, obra.imagen_full) ?? fallbackImageFor(index);

  return {
    slug: getSlugFromUrl(firstNonEmpty(obra.url)) ?? `dearte-${obra.id}`,
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

function dearteCategoryEnumFromSlug(
  slug: string | null | undefined,
): ArtworkDearteCategory | undefined {
  return dearteCategoryIdFromSlug(slug);
}

function categoryTermsForArtwork(
  categories: DearteTaxonomyTerm[] | undefined,
): Artwork["categories"] {
  const items =
    categories?.map((category) => ({
      slug: category.slug,
      label: normalizeText(category.nombre) ?? category.nombre,
      href: firstNonEmpty(category.link),
      count: category.count,
    })) ?? [];

  return items.length > 0 ? items : undefined;
}

function primaryCategoryEnumFromTerms(
  categories: DearteTaxonomyTerm[] | undefined,
): ArtworkDearteCategory | undefined {
  return categories
    ?.map((category) => dearteCategoryEnumFromSlug(category.slug))
    .find((category): category is ArtworkDearteCategory => Boolean(category));
}

function artistFromObraListadoRef(raw: DearteObraListado["artista"]): Artist | null {
  const displayName = normalizeText(raw?.nombre);
  const slug =
    firstNonEmpty(raw?.slug, slugFromUrl(firstNonEmpty(raw?.link) ?? null)) ??
    (displayName ? slugify(displayName) : null);

  if (!displayName || !slug) return null;

  return {
    slug,
    displayName,
    ...splitDisplayName(displayName),
    imageUrl: normalizeUrl(raw?.imagen),
    web: firstNonEmpty(raw?.link),
  };
}

function numericDeartePrice(value: string | null | undefined): number | null {
  const raw = firstNonEmpty(value);
  if (!raw) return null;

  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  const amount = Number(digits);
  return Number.isFinite(amount) ? amount : null;
}

function formatDearteCurrentPrice(
  price: DearteObraListado["precio"],
): { label: string; amount: number } | null {
  const amount = numericDeartePrice(price?.current);
  if (amount === null) return null;

  const currency = normalizeText(price?.currency) ?? "USD";
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return { label: `${currency} ${formatted}`, amount };
}

function artworkFromObraListado(
  obra: DearteObraListado | DearteObraRelacionada,
  index: number,
): Artwork {
  const title = normalizeText(obra.titulo) ?? "Obra sin título";
  const medium = normalizeText(obra.medio?.nombre) ?? "";
  const imageUrl = firstNonEmpty(obra.imagen) ?? fallbackImageFor(index);
  const currentPrice = formatDearteCurrentPrice(obra.precio);

  return {
    slug: firstNonEmpty(obra.slug) ?? `dearte-obra-${obra.id}`,
    title,
    artistSlug:
      firstNonEmpty(
        obra.artista?.slug,
        slugFromUrl(firstNonEmpty(obra.artista?.link) ?? null),
      ) ?? "",
    externalUrl: firstNonEmpty(obra.link),
    medium,
    mediumUrl: firstNonEmpty(obra.medio?.link),
    category: primaryCategoryEnumFromTerms(obra.categorias),
    categories: categoryTermsForArtwork(obra.categorias),
    technique: medium,
    dimensions: normalizeText(obra.dimensiones),
    priceLabel: currentPrice?.label,
    priceMin: currentPrice?.amount,
    priceMax: currentPrice?.amount,
    imageUrls: imageUrl ? [imageUrl] : [],
    videoUrls: [],
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
  obra: DearteCategoriaItem,
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
    categories: [
      {
        slug: dearteCategoryApiSlugById[category],
        label:
          category === "mercado_secundario"
            ? "Mercado secundario"
            : category === "consolidados"
              ? "Artistas consagrados"
              : "Artistas emergentes",
      },
    ],
    technique: medium,
    dimensions: normalizeText(obra.dimensiones),
    imageUrls: imageUrl ? [imageUrl] : [],
    videoUrls: [],
  };
}


function getSlugFromUrl(url?: string | null): string | null {
  if (!url) return null;

  try {
    const pathname = new URL(url).pathname;
    const parts = pathname.split("/").filter(Boolean);

    const obrasIndex = parts.indexOf("obras");

    if (obrasIndex !== -1 && parts[obrasIndex + 1]) {
      return parts[obrasIndex + 1];
    }

    return null;
  } catch {
    return null;
  }
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

function artistsFromCategoriaObras(obras: DearteCategoriaItem[]): Artist[] {
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

function artistsFromObraListadoItems(
  obras: Array<DearteObraListado | DearteObraRelacionada>,
): Artist[] {
  const artists = new Map<string, Artist>();

  for (const obra of obras) {
    const artist = artistFromObraListadoRef(obra.artista);
    if (!artist || artists.has(artist.slug)) continue;
    artists.set(artist.slug, artist);
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

function artistFromDearte(raw: ArtistaDearte): Artist | null {
  const displayName = normalizeText(raw.nombre);
  if (!displayName) return null;

  const slug =
    firstNonEmpty(raw.slug, slugFromUrl(firstNonEmpty(raw.link) ?? null)) ??
    slugify(displayName);
  if (!slug) return null;

  const imageUrl = normalizeUrl(
    typeof raw.imagen === "string" ? raw.imagen : null,
  );

  return {
    slug,
    displayName,
    ...splitDisplayName(displayName),
    imageUrl,
    web: firstNonEmpty(raw.link),
  };
}

function artistFromDetail(raw: ArtistaDetalleDearte): Artist | null {
  const displayName = normalizeText(raw.nombre);
  if (!displayName) return null;

  const slug =
    firstNonEmpty(raw.slug, slugFromUrl(firstNonEmpty(raw.link) ?? null)) ??
    slugify(displayName);
  if (!slug) return null;

  return {
    slug,
    displayName,
    ...splitDisplayName(displayName),
    imageUrl: normalizeUrl(raw.imagen),
    descriptionHtml: firstNonEmpty(raw.descripcion),
    web: firstNonEmpty(raw.link),
  };
}

function galleryImageUrls(items: unknown[]): string[] {
  const urls: string[] = [];

  for (const item of items) {
    if (typeof item === "string") {
      const url = firstNonEmpty(item);
      if (url) urls.push(url);
      continue;
    }

    if (!isRecord(item)) continue;
    const url = firstNonEmpty(
      stringOrNull(item.url),
      stringOrNull(item.src),
      stringOrNull(item.imagen),
      stringOrNull(item.image),
      stringOrNull(item.full),
    );
    if (url) urls.push(url);
  }

  return urls;
}

function artworkFromObraDetalle(raw: DearteObraDetalle): Artwork {
  const title = normalizeText(raw.titulo) ?? "Obra sin título";
  const medium = normalizeText(raw.medio?.nombre) ?? "";
  const mainImage = firstNonEmpty(raw.imagen);
  const gallery = galleryImageUrls(raw.galeria);
  const imageUrls = Array.from(new Set([mainImage, ...gallery].filter(Boolean))) as string[];
  const fallbackImage = imageUrls.length > 0 ? null : fallbackImageFor(0);

  return {
    slug: firstNonEmpty(raw.slug) ?? `dearte-obra-${raw.id}`,
    title,
    artistSlug:
      firstNonEmpty(
        raw.artista?.slug,
        slugFromUrl(firstNonEmpty(raw.artista?.link) ?? null),
      ) ?? "",
    externalUrl: firstNonEmpty(raw.link),
    description: normalizeText(stripHtml(raw.descripcion ?? "")),
    descriptionHtml: firstNonEmpty(raw.descripcion),
    medium,
    mediumUrl: firstNonEmpty(raw.medio?.link),
    category: primaryCategoryEnumFromTerms(raw.curaduria),
    categories: categoryTermsForArtwork(raw.curaduria),
    dimensions: normalizeText(raw.dimensiones),
    year: raw.anio,
    technique: normalizeText(raw.tecnica) ?? medium,
    priceLabel: normalizeText(raw.precio),
    imageUrls:
      imageUrls.length > 0
        ? imageUrls
        : fallbackImage
          ? [fallbackImage]
          : [],
    videoUrls: [],
  };
}

function artworkFromArtistDetail(
  obra: ObraArtista,
  artistSlug: string,
  index: number,
): Artwork | null {
  const title = normalizeText(obra.titulo) ?? "Obra sin título";
  const slug =
    firstNonEmpty(obra.slug, slugFromUrl(firstNonEmpty(obra.link) ?? null)) ??
    `dearte-artista-obra-${obra.id}`;
  if (!slug) return null;

  const medium = normalizeText(obra.medio?.nombre) ?? "";
  const imageUrl = firstNonEmpty(obra.imagen) ?? fallbackImageFor(index);

  return {
    slug,
    title,
    artistSlug,
    externalUrl: firstNonEmpty(obra.link),
    medium,
    mediumUrl: firstNonEmpty(obra.medio?.link),
    technique: medium,
    dimensions: normalizeText(obra.dimensiones),
    imageUrls: imageUrl ? [imageUrl] : [],
    videoUrls: [],
  };
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ");
}

function metadataDescriptionFromArtist(artist: Artist): string | null {
  if (artist.description?.trim()) return artist.description.trim();
  if (artist.descriptionHtml?.trim()) {
    return normalizeText(stripHtml(artist.descriptionHtml));
  }
  return null;
}

function metadataDescriptionFromArtwork(artwork: Artwork): string | null {
  if (artwork.description?.trim()) return artwork.description.trim();
  if (artwork.descriptionHtml?.trim()) {
    return normalizeText(stripHtml(artwork.descriptionHtml));
  }
  return null;
}

function artistLettersFromDearte(
  response: LetrasArtistasResponse,
): string[] {
  const letters = response.data
    .map((item) => normalizeText(item.letra)?.slice(0, 1).toUpperCase() ?? null)
    .filter((letter): letter is string => Boolean(letter && /[A-Z]/.test(letter)));

  return [...new Set(letters)];
}

function errorResult<T>(
  message: string,
  status?: number,
): DearteenlineaApiResult<T> {
  return { ok: false, message, status };
}

async function fetchDearteJson(
  path: string,
  options: DearteFetchOptions = {},
): Promise<DearteenlineaApiResult<unknown>> {
  let url: URL;

  try {
    url = apiUrl(path);
  } catch {
    return errorResult("La URL base de Dearte en Línea no es válida.");
  }

  try {
    const fetchOptions: RequestInit & {
      next?: { revalidate?: number; tags?: string[] };
    } = {
      headers: {
        accept: "application/json",
      },
    };

    if (typeof options.revalidate === "number") {
      fetchOptions.next = {
        revalidate: options.revalidate,
        ...(options.tags ? { tags: options.tags } : {}),
      };
    } else {
      fetchOptions.cache = options.cache ?? "no-store";
    }

    const response = await fetch(url, fetchOptions);

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
  const result = await fetchDearteJson(OBRAS_DISPONIBLES_PATH, {
    revalidate: HOME_REVALIDATE_SECONDS,
  });
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
  const result = await fetchDearteJson(MEDIOS_PATH, {
    revalidate: TAXONOMY_REVALIDATE_SECONDS,
  });
  if (!result.ok) return result;

  const medios = normalizeMediosPayload(result.data);
  if (!medios) {
    return errorResult("La respuesta de medios de Dearte en Línea no es válida.");
  }

  return { ok: true, data: medios };
}

export async function getFiltrosObras(): Promise<
  DearteenlineaApiResult<FiltrosObrasResponse>
> {
  const result = await fetchDearteJson(FILTROS_OBRAS_PATH, {
    revalidate: TAXONOMY_REVALIDATE_SECONDS,
  });
  if (!result.ok) return result;

  const filters = normalizeFiltrosObrasPayload(result.data);
  if (!filters) {
    return errorResult("La respuesta de filtros de obras no es válida.");
  }

  return { ok: true, data: filters };
}

export async function getObras(
  params: DearteenlineaObrasParams = {},
): Promise<DearteenlineaApiResult<DearteObrasResponse>> {
  const safePage = Number.isFinite(params.page) ? Math.max(1, Math.trunc(params.page!)) : 1;
  const safePerPage = Number.isFinite(params.perPage)
    ? Math.max(1, Math.trunc(params.perPage!))
    : 9;
  const query = new URLSearchParams();
  query.set("page", String(safePage));
  query.set("per_page", String(safePerPage));

  const categorias = cleanCategoryStringList(params.categorias);
  const medios = cleanStringList(params.medios);
  const search = firstNonEmpty(params.search);

  if (categorias.length > 0) query.set("categoria", categorias.join(","));
  if (medios.length > 0) query.set("medios", medios.join(","));
  if (search) query.set("search", search);

  const result = await fetchDearteJson(`${OBRAS_PATH}?${query.toString()}`, {
    revalidate: LIST_REVALIDATE_SECONDS,
  });
  if (!result.ok) return result;

  const obras = normalizeObrasResponsePayload(result.data);
  if (!obras) {
    return errorResult("La respuesta del listado de obras no es válida.");
  }

  return { ok: true, data: obras };
}

export async function getObrasCategoria(
  slug: string,
  page = 1,
): Promise<DearteenlineaApiResult<CategoriaObrasResponse>> {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : 1;
  const result = await fetchDearteJson(
    `${CATEGORIA_PATH}/${encodeURIComponent(slug)}?page=${safePage}`,
    { revalidate: HOME_REVALIDATE_SECONDS },
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
  return getObrasCategoria(dearteCategoryApiSlugById.mercado_secundario, page);
}

export function getObrasEmergentes(page = 1) {
  return getObrasCategoria(dearteCategoryApiSlugById.emergentes, page);
}

export function getObrasConsolidados(page = 1) {
  return getObrasCategoria(dearteCategoryApiSlugById.consolidados, page);
}

export async function getArtistas(
  params: DearteenlineaArtistsParams = {},
): Promise<DearteenlineaApiResult<ArtistasDearteResponse>> {
  const query = new URLSearchParams();
  const letra = firstNonEmpty(params.letra)?.slice(0, 1).toLowerCase();
  const search = firstNonEmpty(params.search);

  if (letra) query.set("letra", letra);
  if (search) query.set("search", search);

  const path = query.size > 0 ? `${ARTISTAS_PATH}?${query}` : ARTISTAS_PATH;
  const result = await fetchDearteJson(path, {
    revalidate: LIST_REVALIDATE_SECONDS,
  });
  if (!result.ok) return result;

  const artists = normalizeArtistasPayload(result.data);
  if (!artists) {
    return errorResult(
      "La respuesta de artistas de Dearte en Línea no es válida.",
    );
  }

  return { ok: true, data: artists };
}

export async function getLetrasArtistas(): Promise<
  DearteenlineaApiResult<LetrasArtistasResponse>
> {
  const result = await fetchDearteJson(ARTISTAS_LETRAS_PATH, {
    revalidate: TAXONOMY_REVALIDATE_SECONDS,
  });
  if (!result.ok) return result;

  const letters = normalizeLetrasArtistasPayload(result.data);
  if (!letters) {
    return errorResult(
      "La respuesta de letras de artistas de Dearte en Línea no es válida.",
    );
  }

  return { ok: true, data: letters };
}

export async function getArtistaDetalle(
  slug: string,
): Promise<DearteenlineaApiResult<ArtistaDetalleDearte>> {
  const cleanSlug = firstNonEmpty(slug);
  if (!cleanSlug) {
    return errorResult("El slug del artista no es válido.");
  }

  const result = await fetchDearteJson(
    `${ARTISTAS_PATH}/${encodeURIComponent(cleanSlug)}`,
  );
  if (!result.ok) return result;

  const artist = normalizeArtistaDetallePayload(result.data);
  if (!artist) {
    return errorResult(
      "La respuesta del detalle de artista de Dearte en Línea no es válida.",
    );
  }

  return { ok: true, data: artist };
}

export async function getObraDetalle(
  slug: string,
): Promise<DearteenlineaApiResult<DearteObraDetalle>> {
  const cleanSlug = firstNonEmpty(slug);
  if (!cleanSlug) {
    return errorResult("El slug de la obra no es válido.");
  }

  const result = await fetchDearteJson(
    `${OBRAS_PATH}/${encodeURIComponent(cleanSlug)}`,
  );
  if (!result.ok) return result;

  const artwork = normalizeObraDetallePayload(result.data);
  if (!artwork) {
    return errorResult("La respuesta del detalle de obra no es válida.");
  }

  return { ok: true, data: artwork };
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
  const result = await getObrasCategoria(dearteCategoryApiSlugById[category], page);
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

export async function fetchDearteenlineaArtists(
  params: DearteenlineaArtistsParams = {},
): Promise<DearteenlineaApiResult<Artist[]>> {
  const result = await getArtistas(params);
  if (!result.ok) return result;

  const artists = result.data.data
    .map(artistFromDearte)
    .filter((artist): artist is Artist => artist !== null);

  if (artists.length === 0 && result.data.total > 0) {
    return errorResult("La respuesta de artistas no incluye items válidos.");
  }

  return { ok: true, data: artists };
}

export async function fetchDearteenlineaArtistLetters(): Promise<
  DearteenlineaApiResult<string[]>
> {
  const result = await getLetrasArtistas();
  if (!result.ok) return result;

  const letters = artistLettersFromDearte(result.data);
  if (letters.length === 0) {
    return errorResult("La respuesta de letras no incluye items válidos.");
  }

  return { ok: true, data: letters };
}

export async function fetchDearteenlineaArtistDetail(
  slug: string,
): Promise<DearteenlineaApiResult<DearteenlineaArtistDetailView>> {
  const result = await getArtistaDetalle(slug);
  if (!result.ok) return result;

  const artist = artistFromDetail(result.data);
  if (!artist) {
    return errorResult("La respuesta del artista no incluye un nombre válido.");
  }

  const artworks = result.data.obras
    .map((obra, index) => artworkFromArtistDetail(obra, artist.slug, index))
    .filter((obra): obra is Artwork => obra !== null);

  return {
    ok: true,
    data: {
      artist,
      artworks,
    },
  };
}

function filtersViewFromDearte(
  filters: FiltrosObrasResponse,
): DearteenlineaObrasFiltersView {
  return {
    categories: Object.values(filters.categorias).map((category) => ({
      label: normalizeText(category.nombre) ?? category.nombre,
      slug: category.slug,
      count: category.count,
      href: firstNonEmpty(category.link),
    })),
    mediums: filters.medios.map((medium) => ({
      label: normalizeText(medium.nombre) ?? medium.nombre,
      slug: medium.slug,
      count: medium.count,
      href: firstNonEmpty(medium.link),
    })),
  };
}

function obrasListViewFromDearte(
  obras: DearteObrasResponse,
  params: DearteenlineaObrasParams,
): DearteenlineaObrasListView {
  const requestedCategories = cleanCategoryStringList(params.categorias);
  const requestedMediums = cleanStringList(params.medios);

  return {
    artworks: obras.data.map((obra, index) => artworkFromObraListado(obra, index)),
    artists: artistsFromObraListadoItems(obras.data),
    pagination: {
      page: obras.page,
      totalPages: obras.pages,
      totalItems: obras.total,
      pageSize: obras.per_page,
    },
    appliedFilters: {
      search: obras.filters.search ?? "",
      categorias:
        obras.filters.categorias.length > 0
          ? obras.filters.categorias
          : requestedCategories,
      medios:
        obras.filters.medios.length > 0 ? obras.filters.medios : requestedMediums,
    },
  };
}

export async function fetchDearteenlineaObrasFilters(): Promise<
  DearteenlineaApiResult<DearteenlineaObrasFiltersView>
> {
  const result = await getFiltrosObras();
  if (!result.ok) return result;

  return { ok: true, data: filtersViewFromDearte(result.data) };
}

export async function fetchDearteenlineaObrasList(
  params: DearteenlineaObrasParams = {},
): Promise<DearteenlineaApiResult<DearteenlineaObrasListView>> {
  const result = await getObras(params);
  console.log("DEBUGPRINT[112]: dearteenlinea-api.ts:1473: result=", result)
  if (!result.ok) return result;

  return { ok: true, data: obrasListViewFromDearte(result.data, params) };
}

export async function fetchDearteenlineaObrasCatalog(
  params: DearteenlineaObrasParams = {},
): Promise<DearteenlineaApiResult<DearteenlineaObrasCatalogView>> {
  const [filtersResult, obrasResult] = await Promise.all([
    fetchDearteenlineaObrasFilters(),
    fetchDearteenlineaObrasList(params),
  ]);

  if (!filtersResult.ok) return filtersResult;
  if (!obrasResult.ok) return obrasResult;

  return {
    ok: true,
    data: {
      ...obrasResult.data,
      categories: filtersResult.data.categories,
      mediums: filtersResult.data.mediums,
    },
  };
}

export async function fetchDearteenlineaArtworkDetail(
  slug: string,
): Promise<DearteenlineaApiResult<DearteenlineaArtworkDetailView>> {
  const result = await getObraDetalle(slug);
  if (!result.ok) return result;

  const artwork = artworkFromObraDetalle(result.data);
  const artist = artistFromObraListadoRef(result.data.artista);
  const relatedByArtist = result.data.otras_obras_artista.map((obra, index) =>
    artworkFromObraListado(obra, index),
  );

  return {
    ok: true,
    data: {
      artwork,
      artist,
      artists: [
        ...(artist ? [artist] : []),
        ...artistsFromObraListadoItems(result.data.otras_obras_artista),
      ],
      relatedByArtist,
      relatedByMedium: [],
    },
  };
}

export function dearteenlineaArtistMetadataDescription(
  artist: Artist,
): string | null {
  return metadataDescriptionFromArtist(artist);
}

export function dearteenlineaArtworkMetadataDescription(
  artwork: Artwork,
): string | null {
  return metadataDescriptionFromArtwork(artwork);
}
