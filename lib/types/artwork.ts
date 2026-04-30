/** Categoría de curaduría solo en dearteenlinea. */
export type ArtworkDearteCategory =
  | "mercado_secundario"
  | "emergentes"
  | "consolidados";

export type Artwork = {
  slug: string;
  title: string;
  artistSlug: string;
  description?: string | null;
  medium: string;
  /** Solo obras dearteenlinea; omitir en qullqa gallery. */
  category?: ArtworkDearteCategory;
  dimensions?: string | null;
  year?: number | null;
  technique: string;
  /** Texto libre para la UI (p. ej. rango o “Consultar”). */
  priceLabel?: string | null;
  /** Valores en USD para filtro por rango (opcionales). */
  priceMin?: number | null;
  priceMax?: number | null;
  imageUrls: string[];
  videoUrls: string[];
  /** Fecha de alta para listados “últimas obras” (ISO YYYY-MM-DD). */
  addedAt?: string;
};
