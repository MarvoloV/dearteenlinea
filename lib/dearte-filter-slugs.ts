import type { ArtworkDearteCategory } from "@/lib/types/artwork";

export type DeartePublicCategorySlug =
  | "mercado-secundario"
  | "consolidados"
  | "emergentes";

export const dearteCategoryApiSlugById: Record<ArtworkDearteCategory, string> = {
  mercado_secundario: "artistas-destacados",
  consolidados: "artistas-consagrados",
  emergentes: "artistas-emergente",
};

export const dearteCategoryPublicSlugById: Record<
  ArtworkDearteCategory,
  DeartePublicCategorySlug
> = {
  mercado_secundario: "mercado-secundario",
  consolidados: "consolidados",
  emergentes: "emergentes",
};

const categoryIdBySlug: Record<string, ArtworkDearteCategory> = {
  "mercado-secundario": "mercado_secundario",
  mercado_secundario: "mercado_secundario",
  "artistas-destacados": "mercado_secundario",
  consolidados: "consolidados",
  "artistas-consagrados": "consolidados",
  emergentes: "emergentes",
  "artistas-emergente": "emergentes",
};

export function deartePathSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function dearteCategoryIdFromSlug(
  slug: string | null | undefined,
): ArtworkDearteCategory | undefined {
  const cleanSlug = slug?.trim();
  if (!cleanSlug) return undefined;
  return categoryIdBySlug[cleanSlug];
}

export function dearteCategoryApiSlugFromFilterValue(value: string): string {
  const cleanValue = value.trim();
  const categoryId = dearteCategoryIdFromSlug(cleanValue);
  return categoryId ? dearteCategoryApiSlugById[categoryId] : cleanValue;
}

export function dearteCategoryApiSlugFromRouteSegment(
  slug: string,
): string | null {
  const categoryId = dearteCategoryIdFromSlug(slug);
  return categoryId ? dearteCategoryApiSlugById[categoryId] : null;
}

