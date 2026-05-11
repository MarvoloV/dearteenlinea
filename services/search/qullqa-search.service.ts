import type {
  ArtistSearchResult,
  ArtworkSearchResult,
  GlobalSearchResult,
} from "@/types/search";

const DEFAULT_STUDIO_BASE_URL = "https://studio.qullqa.art";
const ARTISTS_PATH = "/api/public-gallery/filters/artists";
const ARTWORKS_PATH = "/api/public/qullqa-gallery/v1/artworks";
const MAX_RESULTS = 5;

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

function studioSearchUrl(path: string): URL {
  const raw =
    process.env.NEXT_PUBLIC_QULLQA_STUDIO_BASE_URL ?? DEFAULT_STUDIO_BASE_URL;
  return new URL(path, raw.replace(/\/+$/, ""));
}

function artistsUrl(query: string): URL {
  const url = studioSearchUrl(ARTISTS_PATH);
  url.searchParams.set("search", query);
  return url;
}

function artworksUrl(query: string): URL {
  const url = studioSearchUrl(ARTWORKS_PATH);
  url.searchParams.set("q", query);
  url.searchParams.set("pageSize", String(MAX_RESULTS));
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
    throw new Error(`Qullqa search failed with ${response.status}`);
  }

  return response.json();
}

function normalizeArtist(raw: unknown, index: number): ArtistSearchResult | null {
  if (!isRecord(raw)) return null;

  const name = stringOrNull(raw.name);
  const slug = stringOrNull(raw.slug);
  if (!name || !slug) return null;

  return {
    id: numberOrFallback(raw.id, index),
    name,
    slug,
  };
}

function normalizeArtwork(
  raw: unknown,
  index: number,
): ArtworkSearchResult | null {
  if (!isRecord(raw)) return null;

  const title = stringOrNull(raw.title);
  const slug = stringOrNull(raw.slug);
  if (!title || !slug) return null;

  const artist = isRecord(raw.artist) ? raw.artist : null;
  const media = Array.isArray(raw.mediaPreview) ? raw.mediaPreview : [];
  const firstMedia = media.find(isRecord);

  return {
    id: index,
    title,
    slug,
    image: stringOrNull(firstMedia?.url),
    artistName: stringOrNull(artist?.displayName) ?? undefined,
    mediumName: stringOrNull(raw.medium) ?? undefined,
  };
}

function normalizeArtistsPayload(payload: unknown): ArtistSearchResult[] {
  if (!isRecord(payload) || !Array.isArray(payload.data)) return [];

  return payload.data
    .map((item, index) => normalizeArtist(item, index))
    .filter((item): item is ArtistSearchResult => item !== null)
    .slice(0, MAX_RESULTS);
}

function normalizeArtworksPayload(payload: unknown): ArtworkSearchResult[] {
  if (!isRecord(payload) || !Array.isArray(payload.items)) return [];

  return payload.items
    .map((item, index) => normalizeArtwork(item, index))
    .filter((item): item is ArtworkSearchResult => item !== null)
    .slice(0, MAX_RESULTS);
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

export async function searchQullqaGallery(
  query: string,
  signal: AbortSignal,
): Promise<GlobalSearchResult> {
  const cleanQuery = query.trim();

  const [artistsResult, artworksResult] = await Promise.all([
    safeSearch(
      fetchJson(artistsUrl(cleanQuery), signal).then(normalizeArtistsPayload),
    ),
    safeSearch(
      fetchJson(artworksUrl(cleanQuery), signal).then(normalizeArtworksPayload),
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
