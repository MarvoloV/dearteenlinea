export function buildDearteObrasHref({
  catalogPath,
  search,
  categorias,
  medios,
  page,
}: {
  catalogPath: string;
  search?: string;
  categorias?: string[];
  medios?: string[];
  page?: number;
}): string {
  const params = new URLSearchParams();
  const trimmedSearch = search?.trim();
  const cleanCategorias = [
    ...new Set((categorias ?? []).map((item) => item.trim()).filter(Boolean)),
  ];
  const cleanMedios = [
    ...new Set((medios ?? []).map((item) => item.trim()).filter(Boolean)),
  ];

  if (trimmedSearch) params.set("search", trimmedSearch);
  if (cleanCategorias.length > 0) {
    params.set("categoria", cleanCategorias.join(","));
  }
  if (cleanMedios.length > 0) params.set("medios", cleanMedios.join(","));
  if (page && page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `${catalogPath}?${query}` : catalogPath;
}
