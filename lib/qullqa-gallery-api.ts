import type { Artist, ArtistPurchaseContact } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";

const QULLQA_GALLERY_API_PATH = "/api/public/qullqa-gallery/v1";
const DEFAULT_STUDIO_BASE_URL = "http://localhost:8000";
const ARTWORKS_PAGE_SIZE_MAX = 48;

export type QullqaGalleryMediumFacet = {
  slug: string;
  label: string;
  artworkCount: number;
};

export type QullqaGalleryPagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type QullqaGalleryAppliedFilters = {
  q: string | null;
  medium: string | null;
  sort: "newest";
};

export type QullqaGalleryArtworksQuery = {
  q?: string | null;
  medium?: string | null;
  page?: number;
  pageSize?: number;
  sort?: "newest";
};

export type QullqaGalleryArtworksView = {
  items: Artwork[];
  artists: Artist[];
  pagination: QullqaGalleryPagination;
  facets: {
    mediums: QullqaGalleryMediumFacet[];
  };
  appliedFilters: QullqaGalleryAppliedFilters;
};

export type QullqaGalleryHomeView = {
  latestArtworks: Artwork[];
  latestArtists: Artist[];
  mediums: QullqaGalleryMediumFacet[];
};

export type QullqaGalleryArtworkDetailView = {
  artwork: Artwork;
  artist: Artist;
  artists: Artist[];
  relatedByMedium: Artwork[];
  relatedByArtist: Artwork[];
};

export type QullqaGallerySearchIndex = {
  artworks: Artwork[];
  artists: Artist[];
};

export type QullqaGalleryResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      message: string;
      status?: number;
      notFound?: boolean;
    };

type ApiMedia = {
  type?: string | null;
  url?: string | null;
};

type ApiCardArtist = {
  slug?: string | null;
  displayName?: string | null;
};

type ApiCardArtwork = {
  slug?: string | null;
  title?: string | null;
  medium?: string | null;
  dimensions?: string | null;
  priceLabel?: string | null;
  artist?: ApiCardArtist | null;
  mediaPreview?: ApiMedia[] | null;
  publishedAt?: string | null;
};

type ApiHomeResponse = {
  latestArtworks?: ApiCardArtwork[] | null;
  mediums?: QullqaGalleryMediumFacet[] | null;
};

type ApiArtworksResponse = {
  items?: ApiCardArtwork[] | null;
  pagination?: Partial<QullqaGalleryPagination> | null;
  facets?: {
    mediums?: QullqaGalleryMediumFacet[] | null;
  } | null;
  appliedFilters?: Partial<QullqaGalleryAppliedFilters> | null;
};

type ApiDetailArtwork = {
  slug?: string | null;
  title?: string | null;
  description?: string | null;
  medium?: string | null;
  technique?: string | null;
  year?: number | null;
  dimensions?: string | null;
  priceLabel?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  media?: ApiMedia[] | null;
  publishedAt?: string | null;
};

type ApiDetailArtist = {
  slug?: string | null;
  displayName?: string | null;
  imageUrl?: string | null;
};

type ApiPurchase = {
  mode?: "direct" | "inquiry_form" | string | null;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  web?: string | null;
  instagram?: string | null;
};

type ApiArtworkDetailResponse = {
  artwork?: ApiDetailArtwork | null;
  artist?: ApiDetailArtist | null;
  purchase?: ApiPurchase | null;
  related?: {
    sameMedium?: ApiCardArtwork[] | null;
    sameArtist?: ApiCardArtwork[] | null;
  } | null;
};

function firstNonEmpty(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

function configuredStudioBaseUrl(): string {
  const raw = process.env.QULLQA_STUDIO_BASE_URL ?? DEFAULT_STUDIO_BASE_URL;
  return raw.replace(/\/+$/, "");
}

function apiUrl(path: string): URL {
  return new URL(`${QULLQA_GALLERY_API_PATH}${path}`, configuredStudioBaseUrl());
}

function errorResult<T>(
  message: string,
  status?: number,
  notFound?: boolean,
): QullqaGalleryResult<T> {
  return { ok: false, message, status, notFound };
}

async function fetchApiJson<T>(url: URL): Promise<QullqaGalleryResult<T>> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    });

    if (response.status === 404) {
      return errorResult("No encontrado.", 404, true);
    }

    if (!response.ok) {
      return errorResult(
        `Studio respondió con estado ${response.status}.`,
        response.status,
      );
    }

    return { ok: true, data: (await response.json()) as T };
  } catch {
    return errorResult("No se pudo conectar con Studio.");
  }
}

function splitDisplayName(displayName: string): Pick<Artist, "firstName" | "lastName"> {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }
  if (parts.length === 1) {
    return { firstName: parts[0]!, lastName: "" };
  }
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1)!,
  };
}

function mediaToArtworkFields(media: ApiMedia[] | null | undefined): {
  imageUrls: string[];
  videoUrls: string[];
} {
  const imageUrls: string[] = [];
  const videoUrls: string[] = [];

  for (const item of media ?? []) {
    const url = item.url?.trim();
    if (!url) continue;
    if (item.type === "video") {
      videoUrls.push(url);
    } else {
      imageUrls.push(url);
    }
  }

  return { imageUrls, videoUrls };
}

function purchaseContactFromApi(
  purchase: ApiPurchase | null | undefined,
): ArtistPurchaseContact | undefined {
  if (!purchase) return undefined;
  const contact: ArtistPurchaseContact = {};

  if (purchase.contactName?.trim()) contact.contactName = purchase.contactName.trim();
  if (purchase.email?.trim()) contact.email = purchase.email.trim();
  if (purchase.phone?.trim()) contact.phone = purchase.phone.trim();
  if (purchase.web?.trim()) contact.web = purchase.web.trim();
  if (purchase.instagram?.trim()) contact.instagram = purchase.instagram.trim();

  return Object.keys(contact).length > 0 ? contact : undefined;
}

function artistFromCard(raw: ApiCardArtist | null | undefined): Artist {
  const slug = firstNonEmpty(raw?.slug, "artista");
  const displayName = firstNonEmpty(raw?.displayName, "Artista");
  return {
    slug,
    displayName,
    ...splitDisplayName(displayName),
  };
}

function artistFromDetail(
  raw: ApiDetailArtist | null | undefined,
  purchase?: ApiPurchase | null,
): Artist {
  const slug = firstNonEmpty(raw?.slug, "artista");
  const displayName = firstNonEmpty(raw?.displayName, "Artista");
  return {
    slug,
    displayName,
    ...splitDisplayName(displayName),
    imageUrl: raw?.imageUrl ?? null,
    purchaseContact: purchaseContactFromApi(purchase),
  };
}

function artworkFromCard(raw: ApiCardArtwork): Artwork {
  const artist = artistFromCard(raw.artist);
  return {
    slug: firstNonEmpty(raw.slug, "obra"),
    title: firstNonEmpty(raw.title, "Obra sin título"),
    artistSlug: artist.slug,
    medium: firstNonEmpty(raw.medium, "Sin medio"),
    technique: "",
    dimensions: raw.dimensions ?? null,
    priceLabel: raw.priceLabel ?? null,
    ...mediaToArtworkFields(raw.mediaPreview),
    addedAt: raw.publishedAt ?? undefined,
  };
}

function artworkFromDetail(raw: ApiDetailArtwork, artistSlug: string): Artwork {
  return {
    slug: firstNonEmpty(raw.slug, "obra"),
    title: firstNonEmpty(raw.title, "Obra sin título"),
    artistSlug,
    description: raw.description ?? null,
    medium: firstNonEmpty(raw.medium, "Sin medio"),
    technique: firstNonEmpty(raw.technique, raw.medium, "Sin técnica"),
    year: raw.year ?? null,
    dimensions: raw.dimensions ?? null,
    priceLabel: raw.priceLabel ?? null,
    priceMin: raw.priceMin ?? null,
    priceMax: raw.priceMax ?? null,
    ...mediaToArtworkFields(raw.media),
    addedAt: raw.publishedAt ?? undefined,
  };
}

function uniqueArtistsFromCards(cards: ApiCardArtwork[]): Artist[] {
  const artists = new Map<string, Artist>();
  for (const card of cards) {
    const artist = artistFromCard(card.artist);
    if (!artists.has(artist.slug)) artists.set(artist.slug, artist);
  }
  return [...artists.values()].sort((a, b) =>
    (a.displayName ?? `${a.firstName} ${a.lastName}`).localeCompare(
      b.displayName ?? `${b.firstName} ${b.lastName}`,
      "es",
      { sensitivity: "base" },
    ),
  );
}

function mergeArtists(...groups: Artist[][]): Artist[] {
  const artists = new Map<string, Artist>();
  for (const group of groups) {
    for (const artist of group) {
      const existing = artists.get(artist.slug);
      artists.set(artist.slug, { ...existing, ...artist });
    }
  }
  return [...artists.values()];
}

function normalizeMediums(
  mediums: QullqaGalleryMediumFacet[] | null | undefined,
): QullqaGalleryMediumFacet[] {
  return (mediums ?? [])
    .filter((m) => m.slug?.trim() && m.label?.trim() && m.artworkCount > 0)
    .map((m) => ({
      slug: m.slug,
      label: m.label,
      artworkCount: m.artworkCount,
    }));
}

function normalizePagination(
  raw: Partial<QullqaGalleryPagination> | null | undefined,
  query: QullqaGalleryArtworksQuery,
): QullqaGalleryPagination {
  return {
    page: raw?.page ?? query.page ?? 1,
    pageSize: raw?.pageSize ?? query.pageSize ?? 24,
    totalItems: raw?.totalItems ?? 0,
    totalPages: raw?.totalPages ?? 1,
  };
}

function normalizeAppliedFilters(
  raw: Partial<QullqaGalleryAppliedFilters> | null | undefined,
  query: QullqaGalleryArtworksQuery,
): QullqaGalleryAppliedFilters {
  return {
    q: raw?.q ?? query.q ?? null,
    medium: raw?.medium ?? query.medium ?? null,
    sort: "newest",
  };
}

function clampPageSize(pageSize: number | undefined): number {
  if (!Number.isFinite(pageSize)) return 24;
  return Math.min(Math.max(Math.trunc(pageSize ?? 24), 1), ARTWORKS_PAGE_SIZE_MAX);
}

function clampPage(page: number | undefined): number {
  if (!Number.isFinite(page)) return 1;
  return Math.max(Math.trunc(page ?? 1), 1);
}

function addArtworksQuery(url: URL, query: QullqaGalleryArtworksQuery): void {
  const q = query.q?.trim();
  const medium = query.medium?.trim();

  if (q) url.searchParams.set("q", q);
  if (medium) url.searchParams.set("medium", medium);
  url.searchParams.set("page", String(clampPage(query.page)));
  url.searchParams.set("pageSize", String(clampPageSize(query.pageSize)));
  url.searchParams.set("sort", query.sort ?? "newest");
}

function adaptArtworksResponse(
  payload: ApiArtworksResponse,
  query: QullqaGalleryArtworksQuery,
): QullqaGalleryArtworksView {
  const cards = payload.items ?? [];
  return {
    items: cards.map(artworkFromCard),
    artists: uniqueArtistsFromCards(cards),
    pagination: normalizePagination(payload.pagination, query),
    facets: {
      mediums: normalizeMediums(payload.facets?.mediums),
    },
    appliedFilters: normalizeAppliedFilters(payload.appliedFilters, query),
  };
}

export async function fetchQullqaGalleryHome(): Promise<
  QullqaGalleryResult<QullqaGalleryHomeView>
> {
  const result = await fetchApiJson<ApiHomeResponse>(apiUrl("/home"));
  if (!result.ok) return result;

  const cards = result.data.latestArtworks ?? [];
  return {
    ok: true,
    data: {
      latestArtworks: cards.map(artworkFromCard),
      latestArtists: uniqueArtistsFromCards(cards),
      mediums: normalizeMediums(result.data.mediums),
    },
  };
}

export async function fetchQullqaGalleryArtworks(
  query: QullqaGalleryArtworksQuery = {},
): Promise<QullqaGalleryResult<QullqaGalleryArtworksView>> {
  const normalizedQuery: QullqaGalleryArtworksQuery = {
    ...query,
    page: clampPage(query.page),
    pageSize: clampPageSize(query.pageSize),
    sort: "newest",
  };
  const url = apiUrl("/artworks");
  addArtworksQuery(url, normalizedQuery);

  const result = await fetchApiJson<ApiArtworksResponse>(url);
  if (!result.ok) return result;

  return {
    ok: true,
    data: adaptArtworksResponse(result.data, normalizedQuery),
  };
}

export async function fetchQullqaGalleryArtworkDetail(
  slug: string,
): Promise<QullqaGalleryResult<QullqaGalleryArtworkDetailView>> {
  const result = await fetchApiJson<ApiArtworkDetailResponse>(
    apiUrl(`/artworks/${encodeURIComponent(slug)}`),
  );
  if (!result.ok) return result;

  const apiArtist = result.data.artist;
  const artist = artistFromDetail(apiArtist, result.data.purchase);
  const apiArtwork = result.data.artwork;

  if (!apiArtwork?.slug || !apiArtist?.slug) {
    return errorResult("La respuesta de Studio no incluye la obra solicitada.");
  }

  const sameMediumCards = result.data.related?.sameMedium ?? [];
  const sameArtistCards = result.data.related?.sameArtist ?? [];
  const relatedByMedium = sameMediumCards.map(artworkFromCard);
  const relatedByArtist = sameArtistCards.map(artworkFromCard);
  const relatedArtists = uniqueArtistsFromCards([
    ...sameMediumCards,
    ...sameArtistCards,
  ]);

  return {
    ok: true,
    data: {
      artwork: artworkFromDetail(apiArtwork, artist.slug),
      artist,
      artists: mergeArtists([artist], relatedArtists),
      relatedByMedium,
      relatedByArtist,
    },
  };
}

export async function fetchQullqaGallerySearchIndex(): Promise<
  QullqaGalleryResult<QullqaGallerySearchIndex>
> {
  const first = await fetchQullqaGalleryArtworks({
    page: 1,
    pageSize: ARTWORKS_PAGE_SIZE_MAX,
  });
  if (!first.ok) return first;

  const totalPages = first.data.pagination.totalPages;
  if (totalPages <= 1) {
    return {
      ok: true,
      data: {
        artworks: first.data.items,
        artists: first.data.artists,
      },
    };
  }

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      fetchQullqaGalleryArtworks({
        page: i + 2,
        pageSize: ARTWORKS_PAGE_SIZE_MAX,
      }),
    ),
  );

  const failed = rest.find((result) => !result.ok);
  if (failed && !failed.ok) return failed;

  const views = [
    first.data,
    ...rest.filter((result): result is { ok: true; data: QullqaGalleryArtworksView } => result.ok).map((result) => result.data),
  ];

  return {
    ok: true,
    data: {
      artworks: views.flatMap((view) => view.items),
      artists: mergeArtists(...views.map((view) => view.artists)).sort((a, b) =>
        (a.displayName ?? `${a.firstName} ${a.lastName}`).localeCompare(
          b.displayName ?? `${b.firstName} ${b.lastName}`,
          "es",
          { sensitivity: "base" },
        ),
      ),
    },
  };
}
