import type { ReactNode } from "react";

const H1_EXACT = new Set([
  "Términos y condiciones",
  "Política de privacidad",
  "Libro de Reclamaciones",
]);

function isNumberedSectionHeading(line: string): boolean {
  return /^\d+\.\s+[A-ZÁÉÍÓÚÑ0-9]/.test(line.trim());
}

function isAllCapsShortHeading(line: string): boolean {
  const t = line.trim();
  if (t.length < 6 || t.length > 140) return false;
  const letters = t.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g, "");
  if (letters.length < 6) return false;
  return letters === letters.toUpperCase();
}

/**
 * Convierte texto plano de tyc.md / privacidad.md en bloques legibles (sin motor markdown).
 */
export function LegalDocumentBody({ raw }: { raw: string }): ReactNode {
  const lines = raw.split(/\r?\n/);
  const nodes: ReactNode[] = [];
  let paragraph: string[] = [];
  let h1Done = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ");
    paragraph = [];
    nodes.push(
      <p
        key={nodes.length}
        className="mb-4 text-sm leading-relaxed text-muted-foreground"
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

    if (!h1Done && H1_EXACT.has(t)) {
      flushParagraph();
      nodes.push(
        <h1
          key={nodes.length}
          className="mb-6 text-2xl font-semibold tracking-tight text-foreground"
        >
          {t}
        </h1>,
      );
      h1Done = true;
      continue;
    }

    if (isNumberedSectionHeading(t) || t.startsWith("¿")) {
      flushParagraph();
      nodes.push(
        <h2
          key={nodes.length}
          className="mb-3 mt-8 text-base font-semibold text-foreground"
        >
          {t}
        </h2>,
      );
      continue;
    }

    if (isAllCapsShortHeading(t)) {
      flushParagraph();
      nodes.push(
        <h2
          key={nodes.length}
          className="mb-3 mt-8 text-base font-semibold text-foreground"
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
