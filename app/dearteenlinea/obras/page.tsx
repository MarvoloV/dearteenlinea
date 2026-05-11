import type { Metadata } from "next";

import {
  DearteenlineaObrasCatalogPage,
  type ObrasSearchParams,
} from "@/app/dearteenlinea/obras/obras-catalog-page";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Obras de arte | De Arte en Línea",
  description:
    "Explora obras de arte moderno y contemporáneo por artista, medio, categoría y precio.",
  path: "/dearteenlinea/obras",
});

type PageProps = {
  searchParams: Promise<ObrasSearchParams>;
};

export default function DearteenlineaObrasPage({ searchParams }: PageProps) {
  return <DearteenlineaObrasCatalogPage searchParams={searchParams} />;
}
