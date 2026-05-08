export type SearchContext = "dearteenlinea" | "qullqa-gallery";

export type GlobalSearchResult = {
  artists: ArtistSearchResult[];
  artworks: ArtworkSearchResult[];
};

export type ArtistSearchResult = {
  id: number;
  name: string;
  slug: string;
  link?: string;
  image?: string | null;
};

export type ArtworkSearchResult = {
  id: number;
  title: string;
  slug: string;
  link?: string;
  image?: string | null;
  artistName?: string;
  mediumName?: string;
};
