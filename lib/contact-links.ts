/** Solo dígitos para `https://wa.me/{digits}`. */
export function digitsForWhatsApp(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function whatsAppPurchaseHref(phone: string, message: string): string {
  const d = digitsForWhatsApp(phone);
  if (!d) return "#";
  return `https://wa.me/${d}?text=${encodeURIComponent(message)}`;
}

export function instagramHref(raw: string): string {
  const t = raw.trim();
  if (!t) return "#";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  const h = t.replace(/^@/, "");
  return `https://www.instagram.com/${h.replace(/^\//, "")}`;
}
