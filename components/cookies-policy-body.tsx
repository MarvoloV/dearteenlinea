import type { ReactNode } from "react";

const H2_EXACT = new Set([
  "Desactivar las cookies.",
  "Cookies de terceros.",
  "Advertencia sobre eliminar cookies.",
]);

/** Convierte el texto plano de `cookies.md` en bloques semánticos simples. */
export function CookiesPolicyBody({ raw }: { raw: string }): ReactNode {
  const lines = raw.split(/\r?\n/);
  const nodes: ReactNode[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ");
    paragraph = [];
    nodes.push(
      <p
        key={nodes.length}
        className="mb-4 text-sm leading-relaxed text-muted-foreground last:mb-0"
      >
        {text}
      </p>,
    );
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      flushParagraph();
      continue;
    }
    if (t === "Aviso de Cookies") {
      flushParagraph();
      nodes.push(
        <h1
          key={nodes.length}
          className="mb-6 text-2xl font-semibold tracking-tight text-foreground"
        >
          {t}
        </h1>,
      );
      continue;
    }
    if (t.startsWith("¿") || H2_EXACT.has(t)) {
      flushParagraph();
      nodes.push(
        <h2
          key={nodes.length}
          className="mb-3 mt-8 text-lg font-medium text-foreground"
        >
          {t}
        </h2>,
      );
      continue;
    }
    paragraph.push(t);
  }
  flushParagraph();

  return <>{nodes}</>;
}
