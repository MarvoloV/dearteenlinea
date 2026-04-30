import type { Metadata } from "next";

import { ContactoPage } from "@/components/contacto-page";
import { FlowHeader } from "@/components/flow-header";

export const metadata: Metadata = {
  title: "Contacto | qullqa gallery",
  description:
    "Información de contacto y formulario para qullqa gallery: celular, correo y mensaje.",
};

export default function QullqaContactoPage() {
  return (
    <>
      <FlowHeader variant="qullqa-gallery" />
      <main className="flex-1">
        <ContactoPage />
      </main>
    </>
  );
}
