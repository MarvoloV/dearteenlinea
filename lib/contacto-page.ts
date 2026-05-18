export type ContactoPageResponse = {
  id: number;
  titulo: string;
  slug: string;
  link: string;
  contenido_raw: string;
  contenido_html: string;
  bloques: unknown[];
};

export type ContactoPageContent = {
  title: string;
  contentHtml: string;
};

const DEFAULT_DEARTE_API_URL = "https://dearteenlinea.com";
const CONTACTO_PAGE_PATH = "/wp-json/dearte/v1/paginas/contacto";
const CONTACTO_PAGE_REVALIDATE_SECONDS = 300;

function contactoPageEndpoint(): URL | null {
  const raw = process.env.NEXT_PUBLIC_DEARTE_API_URL ?? DEFAULT_DEARTE_API_URL;

  try {
    return new URL(CONTACTO_PAGE_PATH, raw.replace(/\/+$/, ""));
  } catch {
    return null;
  }
}

function stringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeContactoPage(
  payload: ContactoPageResponse,
): ContactoPageContent | null {
  const contentHtml = stringOrNull(payload.contenido_html);
  if (!contentHtml) return null;

  return {
    title: stringOrNull(payload.titulo) ?? "Contacto",
    contentHtml,
  };
}

export async function getContactoPage(): Promise<ContactoPageContent | null> {
  const endpoint = contactoPageEndpoint();
  if (!endpoint) return null;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: CONTACTO_PAGE_REVALIDATE_SECONDS },
      headers: { accept: "application/json" },
    });

    if (!response.ok) return null;

    return normalizeContactoPage((await response.json()) as ContactoPageResponse);
  } catch {
    return null;
  }
}
