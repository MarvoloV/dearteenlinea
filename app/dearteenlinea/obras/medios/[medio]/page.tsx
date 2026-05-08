import {
  DearteenlineaObrasCatalogPage,
  type ObrasSearchParams,
} from "@/app/dearteenlinea/obras/obras-catalog-page";
import { deartePathSlug } from "@/lib/dearte-filter-slugs";
import { mediumsDearteenlinea } from "@/lib/artwork-taxonomy";

type PageProps = {
  params: Promise<{ medio: string }>;
  searchParams: Promise<ObrasSearchParams>;
};

function mediumLabelFromSlug(slug: string): string | undefined {
  return mediumsDearteenlinea.find((medium) => deartePathSlug(medium) === slug);
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

