export type ContactFormPayload = {
  nombre: string;
  correo: string;
  telefono: string;
  comentario: string;
};

const DEFAULT_DEARTE_API_URL = "https://dearteenlinea.com";
const CONTACT_PATH = "/wp-json/dearte/v1/contacto";

function contactEndpoint(): URL {
  const raw =
    process.env.NEXT_PUBLIC_DEARTE_API_URL ?? DEFAULT_DEARTE_API_URL;

  return new URL(CONTACT_PATH, raw.replace(/\/+$/, ""));
}

export async function sendContactForm(
  payload: ContactFormPayload,
): Promise<void> {
  const response = await fetch(contactEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Contact form request failed with ${response.status}`);
  }
}
