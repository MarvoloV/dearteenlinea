import type { Artwork } from "@/lib/types/artwork";

import {
  sampleVideoFlowerMp4,
  sampleVideoW3SchoolsBbbMp4,
} from "@/lib/sample-videos";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

const ceramic = img("photo-1579783902614-a3fb3927b6a5");
const abstractA = img("photo-1620641788421-7a1c342ea42e");
const abstractB = img("photo-1536924940846-227afb31e2a5");
const paintA = img("photo-1513506003901-1e6a229e2d15");
const galleryWall = img("photo-1518998053901-5348d3961a04");
const sculpture = img("photo-1557672172-298e090bd0f1");
const interior = img("photo-1586023492125-27b2c045efd7");
const paintB = img("photo-1513364776144-60967b0f800f");
const studio = img("photo-1524758631624-e2822e304c36");
const booksArt = img("photo-1541961017774-22349e4a1262");

/**
 * Obras mock qullqa gallery. `artistSlug` debe existir en `mockArtistsQullqaGallery`.
 */
export const mockArtworksQullqaGallery: Artwork[] = [
  {
    slug: "rede-avelar",
    title: "Rede de sombras",
    artistSlug: "ana-avelar",
    medium: "Cerámica",
    technique: "Cerámica",
    dimensions: "35 cm diám.",
    year: 2023,
    priceMin: 800,
    priceMax: 800,
    priceLabel: "USD 800",
    imageUrls: [ceramic, abstractA],
    videoUrls: [],
    addedAt: "2026-04-11",
  },
  {
    slug: "onda-barreto",
    title: "Onda tropical",
    artistSlug: "bruno-barreto",
    medium: "Pintura",
    technique: "Acrílico sobre madera",
    priceMin: 2400,
    priceMax: 2400,
    priceLabel: "USD 2.400",
    imageUrls: [abstractA, abstractB],
    videoUrls: [],
    addedAt: "2026-04-17",
  },
  {
    slug: "flux-cordeiro",
    title: "Flux urbano",
    artistSlug: "clara-cordeiro",
    medium: "Arte digital",
    technique: "NFT / video",
    imageUrls: [paintB],
    videoUrls: [sampleVideoFlowerMp4],
    addedAt: "2026-04-05",
  },
  {
    slug: "ruido-duarte",
    title: "Ruido blanco",
    artistSlug: "diego-duarte",
    medium: "Performance",
    technique: "Instalación sonora",
    imageUrls: [],
    videoUrls: [sampleVideoW3SchoolsBbbMp4],
    addedAt: "2026-03-22",
  },
  {
    slug: "mar-eloy",
    title: "Mar adentro",
    artistSlug: "edu-eloy",
    medium: "Fotografía",
    technique: "Fotografía digital",
    dimensions: "70 × 100 cm",
    priceMin: 1500,
    priceMax: 1500,
    priceLabel: "USD 1.500",
    imageUrls: [galleryWall],
    videoUrls: [],
    addedAt: "2026-04-09",
  },
  {
    slug: "capa-freitas",
    title: "Capa de espuma",
    artistSlug: "flavia-freitas",
    medium: "Mixto",
    technique: "Mixta sobre tela",
    priceMin: 3200,
    priceMax: 4000,
    priceLabel: "USD 3.200 – 4.000",
    imageUrls: [abstractA],
    videoUrls: [],
    addedAt: "2026-04-15",
  },
  {
    slug: "nodo-guedes",
    title: "Nodo",
    artistSlug: "gustavo-guedes",
    medium: "Escultura",
    technique: "Resina",
    dimensions: "50 × 40 × 30 cm",
    priceMin: 11000,
    priceMax: 11000,
    priceLabel: "USD 11.000",
    imageUrls: [sculpture],
    videoUrls: [],
    addedAt: "2026-02-10",
  },
  {
    slug: "voz-holanda",
    title: "Voz baja",
    artistSlug: "helena-holanda",
    medium: "Grabado",
    technique: "Grabado calcográfico",
    year: 2021,
    priceMin: 950,
    priceMax: 950,
    priceLabel: "USD 950",
    imageUrls: [booksArt, paintA],
    videoUrls: [],
    addedAt: "2026-04-18",
  },
  {
    slug: "pulso-inacio",
    title: "Pulso",
    artistSlug: "igor-inacio",
    medium: "Dibujo",
    technique: "Tinta sobre papel",
    imageUrls: [interior],
    videoUrls: [],
    addedAt: "2026-04-01",
  },
  {
    slug: "mesa-jardim",
    title: "Mesa de trabajo",
    artistSlug: "julia-jardim",
    medium: "Fotografía",
    technique: "Fotografía digital",
    priceMin: 2100,
    priceMax: 2800,
    priceLabel: "USD 2.100 – 2.800",
    imageUrls: [studio],
    videoUrls: [],
    addedAt: "2025-12-15",
  },
];
