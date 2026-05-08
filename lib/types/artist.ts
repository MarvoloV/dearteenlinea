export type ArtistSocial = {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
};

/**
 * Contacto para compra (principalmente qullqa gallery: no checkout en web).
 * Distinto de `web` / `social` del perfil público.
 */
export type ArtistPurchaseContact = {
  contactName?: string;
  email?: string;
  /** Celular; enlaces WhatsApp usan dígitos internacionales. */
  phone?: string;
  web?: string;
  instagram?: string;
};

/** Modelo completo para futuro detalle; el catálogo usa solo nombre, apellido, imagen y slug. */
export type Artist = {
  slug: string;
  /** Nombre público ya compuesto cuando viene de una API externa. */
  displayName?: string | null;
  firstName: string;
  lastName: string;
  imageUrl?: string | null;
  description?: string | null;
  /** HTML rico cuando la fuente lo provee; preferir sobre `description` en la UI. */
  descriptionHtml?: string | null;
  nationality?: string | null;
  /** ISO date string YYYY-MM-DD */
  birthDate?: string | null;
  web?: string | null;
  social?: ArtistSocial;
  /** Solo qullqa gallery: datos opcionales para modal “contacta al artista”. */
  purchaseContact?: ArtistPurchaseContact;
};
