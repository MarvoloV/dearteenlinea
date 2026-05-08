import {
  DearteenlineaObrasCatalogPage,
  type ObrasSearchParams,
} from "@/app/dearteenlinea/obras/obras-catalog-page";

type PageProps = {
  searchParams: Promise<ObrasSearchParams>;
};

export default function DearteenlineaObrasPage({ searchParams }: PageProps) {
  return <DearteenlineaObrasCatalogPage searchParams={searchParams} />;
}
