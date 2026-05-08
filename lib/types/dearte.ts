export type DearteTaxonomyTerm = {
  id: number;
  nombre: string;
  slug: string;
  link: string;
  count: number;
};

export type DearteArtistRef = {
  id: number;
  nombre: string;
  slug: string;
  link: string;
  imagen: string | null;
};

export type DearteMediumRef = DearteTaxonomyTerm;

export type DearteCategoryRef = DearteTaxonomyTerm;

export type DearteFiltrosObrasResponse = {
  categorias: Record<string, DearteCategoryRef>;
  medios: DearteMediumRef[];
};

export type DearteObraListado = {
  id: number;
  titulo: string;
  slug: string;
  link: string;
  imagen: string | null;
  artista: DearteArtistRef | null;
  medio: DearteMediumRef | null;
  categorias: DearteCategoryRef[];
  dimensiones: string | null;
};

export type DearteObrasFilters = {
  search: string | null;
  categorias: string[];
  medios: string[];
};

export type DearteObrasResponse = {
  data: DearteObraListado[];
  filters: DearteObrasFilters;
  page: number;
  pages: number;
  per_page: number;
  total: number;
};

export type DearteObraRelacionada = DearteObraListado;

export type DearteObraDetalle = {
  id: number;
  titulo: string;
  slug: string;
  link: string;
  imagen: string | null;
  galeria: unknown[];
  artista: DearteArtistRef | null;
  curaduria: DearteCategoryRef[];
  medio: DearteMediumRef | null;
  tecnica: string | null;
  anio: number | null;
  dimensiones: string | null;
  precio: string | null;
  descripcion: string | null;
  otras_obras_artista: DearteObraRelacionada[];
};

export type DearteArtistaListado = {
  id: number;
  nombre: string;
  slug: string;
  link: string;
  imagen: string | false | null;
};

export type DearteArtistasResponse = {
  letra: string | null;
  search: string | null;
  total: number;
  data: DearteArtistaListado[];
};

export type DearteLetraArtista = {
  letra: string;
  slug: string;
  link: string;
};

export type DearteLetrasArtistasResponse = {
  total: number;
  data: DearteLetraArtista[];
};

export type DearteObraArtistaDetalle = {
  id: number;
  titulo: string;
  slug: string;
  link: string;
  imagen: string | null;
  medio: {
    id: number;
    nombre: string;
    slug: string;
    link: string;
  } | null;
  dimensiones: string | null;
};

export type DearteArtistaDetalle = {
  id: number;
  nombre: string;
  slug: string;
  link: string;
  imagen: string | null;
  descripcion: string | null;
  obras: DearteObraArtistaDetalle[];
};

export type DearteMedio = {
  nombre: string;
  slug: string;
  imagen: string | null;
  link: string;
};

export type DearteObraDisponible = {
  id: number;
  titulo: string;
  url: string;
  imagen: string | null;
  imagen_full: string | null;
  artista: string | null;
  artista_url: string | null;
  medio: string | null;
  dimensiones: string | null;
  stock: boolean;
};

export type DearteCategoriaItem = {
  id: number;
  titulo: string;
  slug: string;
  link: string;
  imagen: string | null;
  artista: {
    id: number;
    nombre: string;
    link: string;
  } | null;
  medio: {
    id: number;
    nombre: string;
    slug: string;
    link: string;
  } | null;
  dimensiones: string | null;
};

export type DearteCategoriaResponse = {
  slug: string;
  taxonomy: string;
  total: number;
  pages: number;
  current_page: number;
  per_page: number;
  data: DearteCategoriaItem[];
};
