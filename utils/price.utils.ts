import type { DeartePrice } from "@/lib/types/dearte";

export type PriceRange = {
  min: number;
  max: number;
};

export type ArtworkPriceSource = {
  precio?: DeartePrice | string | null;
  valor_estimado?: string | null;
};

function cleanMoneyText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:#x?[0-9a-f]+|[a-z]+);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeNumericToken(token: string): string | null {
  const clean = token.replace(/[^0-9.,]/g, "");
  if (!clean) return null;

  const commaIndex = clean.lastIndexOf(",");
  const dotIndex = clean.lastIndexOf(".");

  if (commaIndex !== -1 && dotIndex !== -1) {
    const decimalSeparator = commaIndex > dotIndex ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";
    return clean
      .replace(new RegExp(`\\${thousandsSeparator}`, "g"), "")
      .replace(decimalSeparator, ".");
  }

  const separator = commaIndex !== -1 ? "," : dotIndex !== -1 ? "." : null;
  if (!separator) return clean;

  const parts = clean.split(separator);
  const last = parts.at(-1) ?? "";
  const hasThousandsGroups =
    parts.length > 1 && parts.slice(1).every((part) => part.length === 3);

  if (hasThousandsGroups || (parts.length === 2 && last.length === 3)) {
    return parts.join("");
  }

  if (parts.length === 2 && last.length > 0 && last.length <= 2) {
    return `${parts[0]}.${last}`;
  }

  return parts.join("");
}

export function parseMoneyToNumber(value: string): number | null {
  const match = cleanMoneyText(value).match(/\d[\d.,]*/);
  if (!match) return null;

  const normalized = normalizeNumericToken(match[0]);
  if (!normalized) return null;

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

export function parseEstimatedValueRange(value: string | null): PriceRange | null {
  const clean = value ? cleanMoneyText(value) : "";
  if (!clean) return null;

  const amounts = (clean.match(/\d[\d.,]*/g) ?? [])
    .map(parseMoneyToNumber)
    .filter((amount): amount is number => amount !== null);

  if (amounts.length === 0) return null;

  return {
    min: Math.min(...amounts),
    max: Math.max(...amounts),
  };
}

export function doRangesOverlap(
  artworkRange: PriceRange,
  filterRange: { min?: number | null; max?: number | null },
): boolean {
  const artworkMin = Math.min(artworkRange.min, artworkRange.max);
  const artworkMax = Math.max(artworkRange.min, artworkRange.max);
  const filterMin = filterRange.min ?? Number.NEGATIVE_INFINITY;
  const filterMax = filterRange.max ?? Number.POSITIVE_INFINITY;

  return artworkMin <= filterMax && artworkMax >= filterMin;
}

export function getArtworkPriceRange(obra: ArtworkPriceSource): PriceRange | null {
  const price = obra.precio;

  if (typeof price === "string") {
    const amount = parseMoneyToNumber(price);
    if (amount !== null) return { min: amount, max: amount };
  }

  if (price && typeof price === "object") {
    const current = parseMoneyToNumber(price.current ?? "");
    if (current !== null) return { min: current, max: current };

    const html = parseMoneyToNumber(price.html ?? "");
    if (html !== null) return { min: html, max: html };
  }

  return parseEstimatedValueRange(obra.valor_estimado ?? null);
}
