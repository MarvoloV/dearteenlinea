/** Usuario pulsó "Unirme" y abrió el grupo de WhatsApp. */
export const CATALOG_PROMO_WA_JOINED_KEY = "dearteenlinea-catalog-wa-joined";

/** Usuario marcó "no quiero ver esto más" y pulsó "No, gracias". */
export const CATALOG_PROMO_HIDDEN_KEY = "dearteenlinea-catalog-promo-hidden";

const TRUE = "true";

export function readCatalogPromoWaJoined(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CATALOG_PROMO_WA_JOINED_KEY) === TRUE;
  } catch {
    return false;
  }
}

export function readCatalogPromoHidden(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CATALOG_PROMO_HIDDEN_KEY) === TRUE;
  } catch {
    return false;
  }
}

export function setCatalogPromoWaJoined(): void {
  try {
    localStorage.setItem(CATALOG_PROMO_WA_JOINED_KEY, TRUE);
  } catch {
    /* ignore */
  }
}

export function setCatalogPromoHidden(): void {
  try {
    localStorage.setItem(CATALOG_PROMO_HIDDEN_KEY, TRUE);
  } catch {
    /* ignore */
  }
}
