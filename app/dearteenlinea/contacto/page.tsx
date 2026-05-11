import type { Metadata } from "next";

import { ContactoPage } from "@/components/contacto-page";
import { FlowHeader } from "@/components/flow-header";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Contacto | De Arte en Línea",
  description:
    "Contáctanos para consultas sobre obras, artistas o información de De Arte en Línea.",
  path: "/dearteenlinea/contacto",
});

export default function DearteenlineaContactoPage() {
  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <ContactoPage />
      </main>
    </>
  );
}
