import type { Artist } from "@/lib/types/artist";
import type { Artwork } from "@/lib/types/artwork";

/** Quita marcas diacríticas para comparar iniciales (Á → A). */
export function stripDiacritics(input: string): string {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Primera letra del apellido en A–Z o `#` si no es letra latina. */
export function lastNameIndexLetter(lastName: string): string {
  const base = stripDiacritics(lastName.trim());
  if (!base) return "#";
  const c = base[0]?.toUpperCase() ?? "#";
  return /[A-Z]/.test(c) ? c : "#";
}

export const ALPHABET_LETTERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i),
) as readonly string[];

/** Coincidencia parcial (substring) en nombre, apellido o nombre completo; ignora mayúsculas y acentos. */
export function matchesArtistSearch(
  firstName: string,
  lastName: string,
  rawQuery: string,
): boolean {
  const q = stripDiacritics(rawQuery.trim().toLowerCase());
  if (!q) return true;
  const first = stripDiacritics(firstName.trim().toLowerCase());
  const last = stripDiacritics(lastName.trim().toLowerCase());
  const full = `${first} ${last}`;
  return full.includes(q) || first.includes(q) || last.includes(q);
}

export function matchesArtistQuery(artist: Artist, rawQuery: string): boolean {
  const q = stripDiacritics(rawQuery.trim().toLowerCase());
  if (!q) return true;
  const display = stripDiacritics((artist.displayName ?? "").toLowerCase());
  return (
    display.includes(q) ||
    matchesArtistSearch(artist.firstName, artist.lastName, rawQuery)
  );
}

export function artistBySlugFromList(
  artists: Artist[],
  slug: string,
): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}

export function artworksByArtistSlug(
  artworks: Artwork[],
  artistSlug: string,
): Artwork[] {
  return artworks.filter((a) => a.artistSlug === artistSlug);
}

export function artistFullName(artist: Artist): string {
  const displayName = artist.displayName?.trim();
  if (displayName) return displayName;
  return `${artist.firstName} ${artist.lastName}`.trim();
}

export function formatArtistBirthDate(
  iso: string | null | undefined,
): string | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Código ISO 3166-1 alpha-2 → nombre del país en español (p. ej. ES → España). */
export function formatNationality(
  code: string | null | undefined,
): string | null {
  if (!code?.trim()) return null;
  const upper = code.trim().toUpperCase();
  try {
    const dn = new Intl.DisplayNames(["es"], { type: "region" });
    return dn.of(upper) ?? upper;
  } catch {
    return upper;
  }
}

export function artistInitials(firstName: string, lastName: string): string {
  const a = firstName.trim()[0] ?? "";
  const b = lastName.trim()[0] ?? "";
  return `${a}${b}`.toUpperCase() || "?";
}

/**
 * Al menos uno de email, teléfono, web o instagram en `purchaseContact`.
 * El nombre de contacto solo no activa el modal informativo de qullqa.
 */
export function hasQullqaPurchaseChannels(artist: Artist): boolean {
  const p = artist.purchaseContact;
  if (!p) return false;
  const s = (v: string | undefined) => v?.trim() ?? "";
  return Boolean(
    s(p.email) || s(p.phone) || s(p.web) || s(p.instagram),
  );
}
