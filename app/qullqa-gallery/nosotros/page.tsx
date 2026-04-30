import type { Metadata } from "next";

import { FlowHeader } from "@/components/flow-header";
import { NosotrosPage } from "@/components/nosotros-page";

export const metadata: Metadata = {
  title: "Nosotros | qullqa gallery",
  description:
    "De Arte en Línea y Qullqa: historia, colaboración y enlaces a productos Collector y Studio.",
};

export default function QullqaNosotrosPage() {
  return (
    <>
      <FlowHeader variant="qullqa-gallery" />
      <main className="flex-1">
        <NosotrosPage />
      </main>
    </>
  );
}
