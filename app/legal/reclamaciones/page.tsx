import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

import { LegalDocumentBody } from "@/components/legal-document-body";
import { ReclamacionesForm } from "@/components/reclamaciones-form";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Libro de reclamaciones | De Arte en Línea",
  description:
    "Registra una queja o reclamo relacionado con De Arte en Línea.",
  path: "/legal/reclamaciones",
});

const MARKER = "\nLos campos marcados con * son obligatorios";

export default function ReclamacionesPage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "assets-cursor/dearteenlinea/reclamaciones.md"),
    "utf-8",
  );

  const cut = raw.indexOf(MARKER);
  const introRaw = cut >= 0 ? raw.slice(0, cut).trimEnd() : raw;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="shrink-0 border-b border-border/70 bg-background/95 px-4 py-3 backdrop-blur-sm md:px-6">
        <Link
          href="/"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Volver al inicio
        </Link>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-12">
          <article className="text-foreground">
            <LegalDocumentBody raw={introRaw} />
          </article>
          <div className="mt-10 border-t border-border/60 pt-10">
            <h2 className="sr-only">Formulario de reclamación</h2>
            <ReclamacionesForm />
          </div>
        </div>
      </main>
    </div>
  );
}
