/** Clave única en localStorage (mock: no hay lógica de cookies reales). */
export const COOKIE_CONSENT_STORAGE_KEY = "dearteenlinea-cookie-consent";

export type CookieConsentValue = "accepted" | "rejected";

export function isCookieConsentSet(value: string | null): value is CookieConsentValue {
  return value === "accepted" || value === "rejected";
}
