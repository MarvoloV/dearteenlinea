export type ClaimBookPayload = {
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  tipo_documento: string;
  numero_documento: string;
  direccion: string;
  pedido: string;
  observacion: string;
  send_copy: boolean;
};

const DEFAULT_DEARTE_API_URL = "https://dearteenlinea.com";
const CLAIM_BOOK_PATH = "/wp-json/dearte/v1/reclamaciones";

function claimBookEndpoint(): URL {
  const raw =
    process.env.NEXT_PUBLIC_DEARTE_API_URL ?? DEFAULT_DEARTE_API_URL;

  return new URL(CLAIM_BOOK_PATH, raw.replace(/\/+$/, ""));
}

export async function submitClaimBook(
  payload: ClaimBookPayload,
): Promise<void> {
  const response = await fetch(claimBookEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Claim book request failed with ${response.status}`);
  }
}
