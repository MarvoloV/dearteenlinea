import type {
  ArtistSearchResult,
  ArtworkSearchResult,
  GlobalSearchResult,
} from "@/types/search";

const DEFAULT_DEARTE_API_URL = "https://dearteenlinea.com";
const ARTISTS_PATH = "/wp-json/dearte/v1/artistas";
const ARTWORKS_PATH = "/wp-json/dearte/v1/obras";

type UnknownRecord = Record<string, unknown>;

type SearchRequestResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: unknown };

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function numberOrFallback(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function dearteSearchUrl(path: string, query: string): URL {
  const raw =
    process.env.NEXT_PUBLIC_DEARTE_API_URL ?? DEFAULT_DEARTE_API_URL;
  const url = new URL(path, raw.replace(/\/+$/, ""));
  url.searchParams.set("search", query);
  return url;
}

async function fetchJson(url: URL, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, {
    signal,
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Dearte search failed with ${response.status}`);
  }

  return response.json();
}

function normalizeArtist(raw: unknown, index: number): ArtistSearchResult | null {
  if (!isRecord(raw)) return null;

  const name = stringOrNull(raw.nombre);
  const slug = stringOrNull(raw.slug);
  if (!name || !slug) return null;

  return {
    id: numberOrFallback(raw.id, index),
    name,
    slug,
    link: stringOrNull(raw.link) ?? undefined,
    image: stringOrNull(raw.imagen),
  };
}

function normalizeArtwork(
  raw: unknown,
  index: number,
): ArtworkSearchResult | null {
  if (!isRecord(raw)) return null;

  const title = stringOrNull(raw.titulo);
  const slug = stringOrNull(raw.slug);
  if (!title || !slug) return null;

  const artist = isRecord(raw.artista) ? raw.artista : null;
  const medium = isRecord(raw.medio) ? raw.medio : null;

  return {
    id: numberOrFallback(raw.id, index),
    title,
    slug,
    link: stringOrNull(raw.link) ?? undefined,
    image: stringOrNull(raw.imagen),
    artistName: stringOrNull(artist?.nombre) ?? undefined,
    mediumName: stringOrNull(medium?.nombre) ?? undefined,
  };
}

function normalizeArtistsPayload(payload: unknown): ArtistSearchResult[] {
  if (!isRecord(payload) || !Array.isArray(payload.data)) return [];

  return payload.data
    .map((item, index) => normalizeArtist(item, index))
    .filter((item): item is ArtistSearchResult => item !== null);
}

function normalizeArtworksPayload(payload: unknown): ArtworkSearchResult[] {
  if (!isRecord(payload) || !Array.isArray(payload.data)) return [];

  return payload.data
    .map((item, index) => normalizeArtwork(item, index))
    .filter((item): item is ArtworkSearchResult => item !== null);
}

async function safeSearch<T>(
  request: Promise<T>,
): Promise<SearchRequestResult<T>> {
  try {
    return { ok: true, data: await request };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function searchDearteenlinea(
  query: string,
  signal: AbortSignal,
): Promise<GlobalSearchResult> {
  const cleanQuery = query.trim();

  const [artistsResult, artworksResult] = await Promise.all([
    safeSearch(
      fetchJson(dearteSearchUrl(ARTISTS_PATH, cleanQuery), signal).then(
        normalizeArtistsPayload,
      ),
    ),
    safeSearch(
      fetchJson(dearteSearchUrl(ARTWORKS_PATH, cleanQuery), signal).then(
        normalizeArtworksPayload,
      ),
    ),
  ]);

  if (!artistsResult.ok && !artworksResult.ok) {
    throw new Error("No se pudieron cargar resultados de búsqueda.");
  }

  return {
    artists: artistsResult.ok ? artistsResult.data : [],
    artworks: artworksResult.ok ? artworksResult.data : [],
  };
}
