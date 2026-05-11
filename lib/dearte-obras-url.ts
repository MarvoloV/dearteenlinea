export function buildDearteObrasHref({
  catalogPath,
  search,
  categorias,
  medios,
  precioMin,
  precioMax,
  page,
}: {
  catalogPath: string;
  search?: string;
  categorias?: string[];
  medios?: string[];
  precioMin?: number | null;
  precioMax?: number | null;
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
  if (typeof precioMin === "number" && Number.isFinite(precioMin)) {
    params.set("precio_min", String(Math.trunc(precioMin)));
  }
  if (typeof precioMax === "number" && Number.isFinite(precioMax)) {
    params.set("precio_max", String(Math.trunc(precioMax)));
  }
  if (page && page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `${catalogPath}?${query}` : catalogPath;
}
