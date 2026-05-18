import type { Metadata } from "next";
import Link from "next/link";

import { ReclamacionesForm } from "@/components/reclamaciones-form";
import { getLibroReclamacionesConfig } from "@/lib/libro-reclamaciones-config";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Libro de reclamaciones | De Arte en Línea",
  description:
    "Registra una queja o reclamo relacionado con De Arte en Línea.",
  path: "/legal/reclamaciones",
});

export default async function ReclamacionesPage() {
  const { informacionGeneralHtml } = await getLibroReclamacionesConfig();

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
            <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
              Libro de Reclamaciones
            </h1>
            <div
              className="[&_br]:hidden [&_p]:mb-4 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: informacionGeneralHtml }}
            />
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
