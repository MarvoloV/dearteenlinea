import type { Metadata } from "next";
import Link from "next/link";

import { fetchDearteenlineaLegalPage } from "@/lib/dearteenlinea-legal-page";

export const metadata: Metadata = {
  title: "Términos y condiciones | dearteenlinea",
  description:
    "Términos y condiciones de uso del sitio dearteenlinea y qullqa gallery.",
};

const FALLBACK_TITLE = "Términos y condiciones";
const TERMS_SLUG = "terminos-y-condiciones";

export default async function TerminosPage() {
  const legalPage = await fetchDearteenlineaLegalPage({
    slug: TERMS_SLUG,
    fallbackTitle: FALLBACK_TITLE,
  });

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
          <article className="wp-content text-foreground">
            <h1>{legalPage?.title ?? FALLBACK_TITLE}</h1>
            {legalPage ? (
              <div
                dangerouslySetInnerHTML={{ __html: legalPage.contentHtml }}
              />
            ) : (
              <p>
                No se pudieron cargar los términos y condiciones en este
                momento.
              </p>
            )}
          </article>
        </div>
      </main>
    </div>
  );
}
