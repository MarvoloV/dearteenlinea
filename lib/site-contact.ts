import { digitsForWhatsApp } from "@/lib/contact-links";

/** Texto mostrado en la web. */
export const SITE_CONTACT_PHONE_DISPLAY = "+51 975584084";

export const SITE_CONTACT_EMAIL = "contacto@dearteenlinea.com";

/** `tel:` con prefijo internacional. */
export function siteContactTelHref(): string {
  const d = digitsForWhatsApp(SITE_CONTACT_PHONE_DISPLAY);
  if (!d) return "tel:";
  return `tel:+${d}`;
}

export function siteContactMailtoHref(): string {
  return `mailto:${SITE_CONTACT_EMAIL}`;
}
