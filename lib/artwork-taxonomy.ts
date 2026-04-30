import type { ArtworkDearteCategory } from "@/lib/types/artwork";

/** Medios compartidos conceptualmente; listas separadas por flujo. */
export const mediumsDearteenlinea = [
  "Pintura",
  "Grabado",
  "Fotografía",
  "Dibujo",
  "Mixto",
  "Escultura",
  "Instalación",
] as const;

export const mediumsQullqaGallery = [
  "Pintura",
  "Grabado",
  "Fotografía",
  "Dibujo",
  "Mixto",
  "Escultura",
  "Cerámica",
  "Arte digital",
  "Performance",
] as const;

export const techniquesDearteenlinea = [
  "Óleo sobre lienzo",
  "Acrílico",
  "Acuarela",
  "Tinta sobre papel",
  "Giclée",
  "Fotografía analógica",
  "Fotografía digital",
  "Hierro forjado",
  "Mármol",
  "Collage",
  "Serigrafía",
] as const;

export const techniquesQullqaGallery = [
  "Óleo sobre lienzo",
  "Acrílico sobre madera",
  "NFT / video",
  "Cerámica",
  "Resina",
  "Tinta sobre papel",
  "Fotografía digital",
  "Instalación sonora",
  "Mixta sobre tela",
  "Grabado calcográfico",
] as const;

export const dearteCategoryOptions: {
  id: ArtworkDearteCategory;
  label: string;
}[] = [
  { id: "mercado_secundario", label: "Mercado secundario" },
  { id: "emergentes", label: "Artistas emergentes" },
  { id: "consolidados", label: "Artistas consolidados" },
];

/** Buckets de precio para filtros (USD, mocks). */
export const priceBucketOptions = [
  { id: "all", label: "Todos" },
  { id: "none", label: "Sin precio" },
  { id: "low", label: "Menos de USD 2.000" },
  { id: "mid", label: "USD 2.000 – 8.000" },
  { id: "high", label: "Más de USD 8.000" },
] as const;

export type PriceBucketId = (typeof priceBucketOptions)[number]["id"];

/** Rango del slider de precio en catálogo (USD); mocks deben encajar en solapamiento. */
export const priceSliderDomainMin = 0;
export const priceSliderDomainMax = 25000;
export const priceSliderStep = 500;
