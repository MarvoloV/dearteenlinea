export type DearteenlineaLegalPageContent = {
  title: string;
  contentHtml: string;
};

type DearteenlineaLegalPageResponse = {
  id?: unknown;
  titulo?: unknown;
  slug?: unknown;
  link?: unknown;
  contenido?: unknown;
  contenido_html?: unknown;
  contenido_raw?: unknown;
};

const DEFAULT_DEARTE_API_URL = "https://dearteenlinea.com";
const LEGAL_PAGE_PATH = "/wp-json/dearte/v1/paginas";

function legalPageEndpoint(slug: string): URL | null {
  const raw =
    process.env.NEXT_PUBLIC_DEARTE_API_URL ?? DEFAULT_DEARTE_API_URL;

  try {
    return new URL(
      `${LEGAL_PAGE_PATH}/${encodeURIComponent(slug)}`,
      raw.replace(/\/+$/, ""),
    );
  } catch {
    return null;
  }
}

function stringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeLegalPage(
  payload: unknown,
  fallbackTitle: string,
): DearteenlineaLegalPageContent | null {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return null;
  }

  const raw = payload as DearteenlineaLegalPageResponse;
  const title = stringOrNull(raw.titulo) ?? fallbackTitle;
  const contentHtml =
    stringOrNull(raw.contenido) ??
    stringOrNull(raw.contenido_html) ??
    stringOrNull(raw.contenido_raw);

  if (!contentHtml) return null;

  return { title, contentHtml };
}

export async function fetchDearteenlineaLegalPage({
  slug,
  fallbackTitle,
}: {
  slug: string;
  fallbackTitle: string;
}): Promise<DearteenlineaLegalPageContent | null> {
  const endpoint = legalPageEndpoint(slug);
  if (!endpoint) return null;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 3600 },
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) return null;

    return normalizeLegalPage(await response.json(), fallbackTitle);
  } catch {
    return null;
  }
}
