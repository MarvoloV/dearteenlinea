/**
 * Productos Qullqa enlazables desde la web.
 * Mantener alineado con assets-cursor/qullqa/products.md (URLs y mensajes cortos).
 * Las imágenes son editoriales (Unsplash); al cambiarlas, verificar HTTP 200 en el CDN.
 */
export type QullqaProduct = {
  name: string;
  description: string;
  href: string;
  /** Imagen representativa para la tarjeta (referencia visual). */
  imageSrc: string;
  imageAlt: string;
};

export const qullqaProducts: QullqaProduct[] = [
  {
    name: "Qullqa Collector",
    description: "Diseñada y pensada para coleccionistas.",
    href: "https://www.qullqa.art/productos-1-1",
    imageSrc:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Personas contemplando obras en una galería de arte",
  },
  {
    name: "Qullqa Studio",
    description: "Diseñada y pensada para artistas.",
    href: "https://www.qullqa.art/productos-1",
    imageSrc:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Materiales de pintura y pinceles en un taller",
  },
];
