import type { Metadata } from "next";

import { ContactoPage } from "@/components/contacto-page";
import { FlowHeader } from "@/components/flow-header";
import { getContactoPage } from "@/lib/contacto-page";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Contacto | De Arte en Línea",
  description:
    "Contáctanos para consultas sobre obras, artistas o información de De Arte en Línea.",
  path: "/qullqa-gallery/contacto",
  siteName: "Qullqa Gallery",
});

export default async function QullqaContactoPage() {
  const content = await getContactoPage();

  return (
    <>
      <FlowHeader variant="qullqa-gallery" />
      <main className="flex-1">
        <ContactoPage contentHtml={content?.contentHtml} />
      </main>
    </>
  );
}
