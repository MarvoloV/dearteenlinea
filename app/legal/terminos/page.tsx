import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

import { LegalDocumentBody } from "@/components/legal-document-body";

export const metadata: Metadata = {
  title: "Términos y condiciones | dearteenlinea",
  description:
    "Términos y condiciones de uso del sitio dearteenlinea y qullqa gallery.",
};

export default function TerminosPage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "assets-cursor/dearteenlinea/tyc.md"),
    "utf-8",
  );

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
            <LegalDocumentBody raw={raw} />
          </article>
        </div>
      </main>
    </div>
  );
}
