import type { MetadataRoute } from "next";

import { mediumsDearteenlinea } from "@/lib/artwork-taxonomy";
import {
  fetchDearteenlineaArtists,
  fetchDearteenlineaObrasList,
} from "@/lib/dearteenlinea-api";
import {
  dearteCategoryPublicSlugById,
  deartePathSlug,
} from "@/lib/dearte-filter-slugs";
import { fetchQullqaGallerySearchIndex } from "@/lib/qullqa-gallery-api";
import { buildCanonical } from "@/lib/seo";
import type { ArtworkDearteCategory } from "@/lib/types/artwork";

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/dearteenlinea", changeFrequency: "weekly", priority: 0.9 },
  { path: "/dearteenlinea/obras", changeFrequency: "daily", priority: 0.9 },
  { path: "/dearteenlinea/artistas", changeFrequency: "weekly", priority: 0.8 },
  { path: "/dearteenlinea/nosotros", changeFrequency: "monthly", priority: 0.6 },
  { path: "/dearteenlinea/contacto", changeFrequency: "monthly", priority: 0.5 },
  { path: "/qullqa-gallery", changeFrequency: "weekly", priority: 0.8 },
  { path: "/qullqa-gallery/obras", changeFrequency: "daily", priority: 0.7 },
  { path: "/qullqa-gallery/artistas", changeFrequency: "weekly", priority: 0.7 },
  { path: "/qullqa-gallery/nosotros", changeFrequency: "monthly", priority: 0.5 },
  { path: "/qullqa-gallery/contacto", changeFrequency: "monthly", priority: 0.5 },
  { path: "/nosotros", changeFrequency: "monthly", priority: 0.5 },
  { path: "/legal/terminos", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/privacidad", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/cookies", changeFrequency: "yearly", priority: 0.2 },
  { path: "/legal/reclamaciones", changeFrequency: "yearly", priority: 0.3 },
];

const DEARTE_CATEGORIES: ArtworkDearteCategory[] = [
  "mercado_secundario",
  "consolidados",
  "emergentes",
];

function sitemapEntry({
  path,
  changeFrequency,
  priority,
  images,
}: {
  path: string;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: number;
  images?: string[];
}): SitemapEntry {
  return {
    url: buildCanonical(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
    ...(images && images.length > 0 ? { images } : {}),
  };
}

async function dearteenlineaArtistEntries(): Promise<SitemapEntry[]> {
  const result = await fetchDearteenlineaArtists();
  if (!result.ok) return [];

  return result.data.map((artist) =>
    sitemapEntry({
      path: `/dearteenlinea/artistas/${artist.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
      images: artist.imageUrl ? [artist.imageUrl] : undefined,
    }),
  );
}

async function dearteenlineaArtworkEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await fetchDearteenlineaObrasList({
      page,
      perPage: 100,
    });
    if (!result.ok) break;

    totalPages = result.data.pagination.totalPages;
    entries.push(
      ...result.data.artworks.map((artwork) =>
        sitemapEntry({
          path: `/dearteenlinea/obras/${artwork.slug}`,
          changeFrequency: "weekly",
          priority: 0.7,
          images: artwork.imageUrls,
        }),
      ),
    );
    page += 1;
  } while (page <= totalPages && page <= 100);

  return entries;
}

async function qullqaGalleryEntries(): Promise<SitemapEntry[]> {
  const result = await fetchQullqaGallerySearchIndex();
  if (!result.ok) return [];

  const artistEntries = result.data.artists.map((artist) =>
    sitemapEntry({
      path: `/qullqa-gallery/artistas/${artist.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
      images: artist.imageUrl ? [artist.imageUrl] : undefined,
    }),
  );
  const artworkEntries = result.data.artworks.map((artwork) =>
    sitemapEntry({
      path: `/qullqa-gallery/obras/${artwork.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
      images: artwork.imageUrls,
    }),
  );

  return [...artistEntries, ...artworkEntries];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_ROUTES.map(sitemapEntry);
  const categoryEntries = DEARTE_CATEGORIES.map((category) =>
    sitemapEntry({
      path: `/dearteenlinea/obras/artistas/${dearteCategoryPublicSlugById[category]}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );
  const mediumEntries = mediumsDearteenlinea.map((medium) =>
    sitemapEntry({
      path: `/dearteenlinea/obras/medios/${deartePathSlug(medium)}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );
  const [artistEntries, artworkEntries, qullqaEntries] = await Promise.all([
    dearteenlineaArtistEntries(),
    dearteenlineaArtworkEntries(),
    qullqaGalleryEntries(),
  ]);

  return [
    ...staticEntries,
    ...categoryEntries,
    ...mediumEntries,
    ...artistEntries,
    ...artworkEntries,
    ...qullqaEntries,
  ];
}
