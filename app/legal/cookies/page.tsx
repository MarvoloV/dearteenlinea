import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

import { CookiesPolicyBody } from "@/components/cookies-policy-body";

export const metadata: Metadata = {
  title: "Política de cookies | dearteenlinea",
  description:
    "Información sobre el uso de cookies en el sitio dearteenlinea y qullqa gallery.",
};

export default function CookiesPolicyPage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "assets-cursor/dearteenlinea/cookies.md"),
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
            <CookiesPolicyBody raw={raw} />
          </article>
        </div>
      </main>
    </div>
  );
}
