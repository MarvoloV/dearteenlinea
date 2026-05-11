import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

import { CookiesPolicyBody } from "@/components/cookies-policy-body";
import { buildSeoMetadata, stripHtml } from "@/lib/seo";

const COOKIES_PATH = "assets-cursor/dearteenlinea/cookies.md";

function readCookiesPolicy(): string {
  return fs.readFileSync(path.join(process.cwd(), COOKIES_PATH), "utf-8");
}

export function generateMetadata(): Metadata {
  const raw = readCookiesPolicy();

  return buildSeoMetadata({
    title: "Política de cookies | De Arte en Línea",
    description: stripHtml(raw),
    path: "/legal/cookies",
  });
}

export default function CookiesPolicyPage() {
  const raw = readCookiesPolicy();

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
