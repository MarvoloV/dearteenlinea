import type { Metadata } from "next";

import { ContactoPage } from "@/components/contacto-page";
import { FlowHeader } from "@/components/flow-header";

export const metadata: Metadata = {
  title: "Contacto | dearteenlinea",
  description:
    "Información de contacto y formulario para dearteenlinea: celular, correo y mensaje.",
};

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
