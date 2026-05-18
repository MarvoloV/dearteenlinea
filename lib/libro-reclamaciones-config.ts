export type LibroReclamacionesConfigResponse = {
  success: boolean;
  id: number;
  titulo: string;
  slug: string;
  link: string;
  informacion_general: string;
};

export type LibroReclamacionesConfig = {
  informacionGeneralHtml: string;
};

const DEFAULT_DEARTE_API_URL = "https://dearteenlinea.com";
const LIBRO_RECLAMACIONES_CONFIG_PATH =
  "/wp-json/dearte/v1/libro-reclamaciones-config";
const LIBRO_RECLAMACIONES_REVALIDATE_SECONDS = 300;

const fallbackLibroReclamacionesConfig: LibroReclamacionesConfig = {
  informacionGeneralHtml: `
<p>DEARTE EIRL RUC: 20550218306 LIMA, PERÚ</p>
<p>1) RECLAMO: Disconformidad relacionada a los productos o servicios.</p>
<p>2) QUEJA Disconformidad no relacionada a los productos o servicios o malestar o descontento respecto a la atención al público.</p>
<p>La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI. El proveedor deberá dar respuesta al reclamo en un plazo no mayor de treinta (30) días calendario, pudiendo ampliar el plazo hasta por treinta (30) días más, previa comunicación al consumidor.</p>
`,
};

function libroReclamacionesConfigEndpoint(): URL | null {
  const raw = process.env.NEXT_PUBLIC_DEARTE_API_URL ?? DEFAULT_DEARTE_API_URL;

  try {
    return new URL(
      LIBRO_RECLAMACIONES_CONFIG_PATH,
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

function normalizeLibroReclamacionesConfig(
  payload: unknown,
): LibroReclamacionesConfig | null {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return null;
  }

  const raw = payload as Partial<LibroReclamacionesConfigResponse>;
  const informacionGeneralHtml = stringOrNull(raw.informacion_general);
  if (!informacionGeneralHtml) return null;

  return { informacionGeneralHtml };
}

export async function getLibroReclamacionesConfig(): Promise<LibroReclamacionesConfig> {
  const endpoint = libroReclamacionesConfigEndpoint();
  if (!endpoint) return fallbackLibroReclamacionesConfig;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: LIBRO_RECLAMACIONES_REVALIDATE_SECONDS },
      headers: { accept: "application/json" },
    });

    if (!response.ok) return fallbackLibroReclamacionesConfig;

    return (
      normalizeLibroReclamacionesConfig(await response.json()) ??
      fallbackLibroReclamacionesConfig
    );
  } catch {
    return fallbackLibroReclamacionesConfig;
  }
}
