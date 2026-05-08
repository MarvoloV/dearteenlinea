import { notFound } from "next/navigation";

import {
  DearteenlineaObrasCatalogPage,
  type ObrasSearchParams,
} from "@/app/dearteenlinea/obras/obras-catalog-page";
import {
  dearteCategoryApiSlugFromRouteSegment,
  dearteCategoryIdFromSlug,
} from "@/lib/dearte-filter-slugs";

type PageProps = {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<ObrasSearchParams>;
};

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

