import type { Metadata } from "next";

import {
  DearteenlineaObrasCatalogPage,
  type ObrasSearchParams,
} from "@/app/dearteenlinea/obras/obras-catalog-page";
import { deartePathSlug } from "@/lib/dearte-filter-slugs";
import { mediumsDearteenlinea } from "@/lib/artwork-taxonomy";
import { buildSeoMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ medio: string }>;
  searchParams: Promise<ObrasSearchParams>;
};

function mediumLabelFromSlug(slug: string): string | undefined {
  return mediumsDearteenlinea.find((medium) => deartePathSlug(medium) === slug);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { medio } = await params;
  const medium = mediumLabelFromSlug(medio) ?? medio;

  return buildSeoMetadata({
    title: `${medium} | Obras de arte | De Arte en Línea`,
    description:
      "Explora obras de arte moderno y contemporáneo por artista, medio, categoría y precio.",
    path: `/dearteenlinea/obras/medios/${medio}`,
  });
}

export default async function DearteenlineaObrasMediosPage({
  params,
  searchParams,
}: PageProps) {
  const { medio } = await params;

  return (
    <DearteenlineaObrasCatalogPage
      searchParams={searchParams}
      routeMedium={medio}
      catalogPath={`/dearteenlinea/obras/medios/${medio}`}
      hideMediumFilters
      fallbackInitialMedio={mediumLabelFromSlug(medio)}
    />
  );
}
