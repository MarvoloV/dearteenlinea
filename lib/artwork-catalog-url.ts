import type { ArtworkDearteCategory } from "@/lib/types/artwork";

const CATEGORIA_IDS: ArtworkDearteCategory[] = [
  "mercado_secundario",
  "emergentes",
  "consolidados",
];

function firstParam(
  v: string | string[] | undefined,
): string | undefined {
  if (v == null) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

/** Valida `medio` contra la lista permitida del flujo. */
export function parseMedioParam(
  raw: string | string[] | undefined,
  allowedMediums: readonly string[],
): string | undefined {
  const s = firstParam(raw)?.trim();
  if (!s) return undefined;
  return allowedMediums.includes(s) ? s : undefined;
}

export function parseCategoriaParam(
  raw: string | string[] | undefined,
): ArtworkDearteCategory | undefined {
  const s = firstParam(raw)?.trim();
  if (!s) return undefined;
  return CATEGORIA_IDS.includes(s as ArtworkDearteCategory)
    ? (s as ArtworkDearteCategory)
    : undefined;
}
