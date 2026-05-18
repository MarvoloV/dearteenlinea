import { HIDDEN_CATEGORY_SLUGS } from "@/constants/filters.constants";

const hiddenCategorySlugSet = new Set<string>(HIDDEN_CATEGORY_SLUGS);

export function filterVisibleCategories<T extends { slug: string }>(
  categories: T[],
): T[] {
  return categories.filter((category) => !hiddenCategorySlugSet.has(category.slug));
}
