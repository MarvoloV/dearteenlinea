import type { Artwork } from "@/lib/types/artwork";

import {
  sampleVideoFlowerMp4,
  sampleVideoW3SchoolsBbbMp4,
} from "@/lib/sample-videos";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

/** Fotos Unsplash verificadas: pintura, abstracto, galería, escultura (no retratos). */
const abstractA = img("photo-1620641788421-7a1c342ea42e");
const abstractB = img("photo-1536924940846-227afb31e2a5");
const galleryWall = img("photo-1518998053901-5348d3961a04");
const paintA = img("photo-1513506003901-1e6a229e2d15");
const paintB = img("photo-1513364776144-60967b0f800f");
const sculpture = img("photo-1557672172-298e090bd0f1");
const interior = img("photo-1586023492125-27b2c045efd7");
const studio = img("photo-1524758631624-e2822e304c36");
const booksArt = img("photo-1541961017774-22349e4a1262");
const abstractC = img("photo-1579783902614-a3fb3927b6a5");
const supplies = img("photo-1460661419201-fd4cecdf8a8b");
const exhibit = img("photo-1513519245088-0e12902e5a38");

/**
 * Obras mock dearteenlinea. `artistSlug` debe existir en `mockArtistsDearteenlinea`.
 */
export const mockArtworksDearteenlinea: Artwork[] = [
  {
    slug: "silencio-aguilar",
    title: "Silencio interior",
    artistSlug: "lucia-aguilar",
    description: "Serie sobre el vacío habitado.",
    medium: "Pintura",
    category: "consolidados",
    dimensions: "90 × 120 cm",
    year: 2022,
    technique: "Óleo sobre lienzo",
    priceLabel: "USD 12.000 – 14.500",
    priceMin: 12000,
    priceMax: 14500,
    imageUrls: [abstractA, abstractB],
    videoUrls: [],
    addedAt: "2026-04-02",
  },
  {
    slug: "lineas-benitez",
    title: "Líneas de fuga",
    artistSlug: "martin-benitez",
    medium: "Dibujo",
    category: "emergentes",
    dimensions: "40 × 55 cm",
    year: 2024,
    technique: "Tinta sobre papel",
    priceLabel: "USD 1.200",
    priceMin: 1200,
    priceMax: 1200,
    imageUrls: [supplies],
    videoUrls: [],
    addedAt: "2026-04-14",
  },
  {
    slug: "noche-castro",
    title: "Noche en el estudio",
    artistSlug: "carmen-castro",
    medium: "Fotografía",
    category: "mercado_secundario",
    technique: "Fotografía digital",
    priceLabel: "Consultar",
    imageUrls: [],
    videoUrls: [sampleVideoFlowerMp4],
    addedAt: "2026-04-08",
  },
  {
    slug: "puente-dominguez",
    title: "Puente levadizo",
    artistSlug: "david-dominguez",
    medium: "Escultura",
    category: "consolidados",
    dimensions: "180 × 40 × 35 cm",
    year: 2019,
    technique: "Hierro forjado",
    priceMin: 9500,
    priceMax: 9500,
    priceLabel: "USD 9.500",
    imageUrls: [sculpture],
    videoUrls: [],
    addedAt: "2026-03-01",
  },
  {
    slug: "memoria-estevez",
    title: "Memoria líquida",
    artistSlug: "elena-estevez",
    medium: "Mixto",
    category: "emergentes",
    technique: "Collage",
    priceMin: 3500,
    priceMax: 4200,
    priceLabel: "USD 3.500 – 4.200",
    imageUrls: [paintB, abstractC],
    videoUrls: [sampleVideoFlowerMp4, sampleVideoW3SchoolsBbbMp4],
    addedAt: "2026-04-18",
  },
  {
    slug: "mapa-fernandez",
    title: "Mapa sin escala",
    artistSlug: "fernando-fernandez",
    medium: "Grabado",
    category: "mercado_secundario",
    year: 1998,
    technique: "Serigrafía",
    imageUrls: [interior],
    videoUrls: [],
    addedAt: "2025-11-20",
  },
  {
    slug: "jardin-gomez",
    title: "Jardín de invierno",
    artistSlug: "gabriela-gomez",
    medium: "Pintura",
    category: "consolidados",
    dimensions: "100 × 100 cm",
    technique: "Acrílico",
    priceMin: 6000,
    priceMax: 6000,
    priceLabel: "USD 6.000",
    imageUrls: [paintA],
    videoUrls: [],
    addedAt: "2026-04-12",
  },
  {
    slug: "vacío-herrera",
    title: "Vacío útil",
    artistSlug: "hector-herrera",
    medium: "Instalación",
    category: "emergentes",
    technique: "Mixta sobre tela",
    imageUrls: [studio, booksArt],
    videoUrls: [],
    addedAt: "2026-04-06",
  },
  {
    slug: "espejo-iglesias",
    title: "Espejo roto",
    artistSlug: "ines-iglesias",
    medium: "Fotografía",
    category: "emergentes",
    dimensions: "60 × 90 cm",
    technique: "Fotografía analógica",
    priceMin: 1800,
    priceMax: 1800,
    priceLabel: "USD 1.800",
    imageUrls: [galleryWall],
    videoUrls: [],
    addedAt: "2026-04-16",
  },
  {
    slug: "corte-jimenez",
    title: "Corte seco",
    artistSlug: "jorge-jimenez",
    medium: "Grabado",
    category: "mercado_secundario",
    year: 2015,
    technique: "Giclée",
    priceMin: 4500,
    priceMax: 5200,
    priceLabel: "USD 4.500 – 5.200",
    imageUrls: [exhibit],
    videoUrls: [],
    addedAt: "2024-09-01",
  },
];
