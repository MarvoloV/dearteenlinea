import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  DearteenlineaObrasCatalogPage,
  type ObrasSearchParams,
} from "@/app/dearteenlinea/obras/obras-catalog-page";
import {
  dearteCategoryApiSlugFromRouteSegment,
  dearteCategoryIdFromSlug,
} from "@/lib/dearte-filter-slugs";
import { dearteCategoryOptions } from "@/lib/artwork-taxonomy";
import { buildSeoMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<ObrasSearchParams>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categoria } = await params;
  const categoryId = dearteCategoryIdFromSlug(categoria);
  const category = dearteCategoryOptions.find((item) => item.id === categoryId);
  const titleLabel = category?.label ?? "Obras de arte";

  return buildSeoMetadata({
    title: `${titleLabel} | De Arte en Línea`,
    description:
      "Explora obras de arte moderno y contemporáneo por artista, medio, categoría y precio.",
    path: `/dearteenlinea/obras/artistas/${categoria}`,
  });
}

export default async function DearteenlineaObrasArtistasPage({
  params,
  searchParams,
}: PageProps) {
  const { categoria } = await params;
  const apiCategory = dearteCategoryApiSlugFromRouteSegment(categoria);
  const fallbackInitialCategoria = dearteCategoryIdFromSlug(categoria);

  if (!apiCategory || !fallbackInitialCategoria) notFound();

  return (
    <DearteenlineaObrasCatalogPage
      searchParams={searchParams}
      routeCategory={apiCategory}
      catalogPath={`/dearteenlinea/obras/artistas/${categoria}`}
      hideCategoryFilters
      fallbackInitialCategoria={fallbackInitialCategoria}
    />
  );
}
