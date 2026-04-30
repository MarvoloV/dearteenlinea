import type { Metadata } from "next";

import { FlowHeader } from "@/components/flow-header";
import { NosotrosPage } from "@/components/nosotros-page";

export const metadata: Metadata = {
  title: "Nosotros | dearteenlinea",
  description:
    "De Arte en Línea: historia, fundadora y colaboración con Qullqa. Galería curada y visibilidad para artistas.",
};

export default function DearteenlineaNosotrosPage() {
  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <NosotrosPage />
      </main>
    </>
  );
}
