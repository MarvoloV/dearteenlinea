import {
  mediumsDearteenlinea,
  mediumsQullqaGallery,
} from "@/lib/artwork-taxonomy";

export type HomeFlow = "dearteenlinea" | "qullqa-gallery";

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

/** Imagen representativa por etiqueta de medio (Unsplash). */
const mediumImageByLabel: Record<string, string> = {
  Pintura: u("photo-1541961017774-22349e4a1262"),
  Grabado: u("photo-1513519245088-0e12902e5a38"),
  Fotografía: u("photo-1518998053901-5348d3961a04"),
  Dibujo: u("photo-1460661419201-fd4cecdf8a8b"),
  Mixto: u("photo-1579783902614-a3fb3927b6a5"),
  Escultura: u("photo-1557672172-298e090bd0f1"),
  Instalación: u("photo-1586023492125-27b2c045efd7"),
  Cerámica: u("photo-1579783902614-a3fb3927b6a5"),
  "Arte digital": u("photo-1513364776144-60967b0f800f"),
  Performance: u("photo-1524758631624-e2822e304c36"),
};

export function mediumCardImage(_flow: HomeFlow, mediumLabel: string): string {
  return mediumImageByLabel[mediumLabel] ?? u("photo-1513506003901-1e6a229e2d15");
}

export function mediumsForFlow(flow: HomeFlow): readonly string[] {
  return flow === "dearteenlinea" ? mediumsDearteenlinea : mediumsQullqaGallery;
}
