import Image from "next/image";

import { DearteenlineaLogo } from "@/components/dearteenlinea-logo";
import { QullqaWordmark } from "@/components/qullqa-wordmark";
import type { NosotrosPageContent } from "@/lib/nosotros-page";
import { cn } from "@/lib/utils";

function InstagramLine({
  label,
  href,
  showInstagramName = true,
}: {
  label: string;
  href: string;
  showInstagramName?: boolean;
}) {
  const hasUrl = href.trim().length > 0;
  return (
    <p className="text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{label}</span>
      {" — "}
      {hasUrl ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 transition hover:text-foreground hover:underline"
        >
          {showInstagramName ? "Instagram" : href}
        </a>
      ) : (
        <span className="italic">Instagram (enlace próximo)</span>
      )}
    </p>
  );
}

export function NosotrosPage({ content }: { content: NosotrosPageContent }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <header className="mb-14 max-w-2xl space-y-2">
        <h1
          className="text-balance [font-family:var(--font-cormorant)] text-[2rem] font-light leading-[1.15] tracking-[0.02em] text-foreground md:text-[2.65rem]"
        >
          <span className="italic text-foreground/90">Nosotros</span>
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          De Arte en Línea y nuestra colaboración con Qullqa.
        </p>
      </header>

      <div className="space-y-14 md:space-y-16">
        <section
          className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-10"
          aria-labelledby="nosotros-dearte-heading"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-6">
            <h2
              id="nosotros-dearte-heading"
              className="max-w-xl text-balance [font-family:var(--font-cormorant)] text-2xl font-light leading-snug tracking-[0.015em] text-foreground md:text-3xl"
            >
              <span className="italic text-foreground/85">De Arte</span>{" "}
              <span className="font-semibold not-italic">en Línea</span>
            </h2>
            <div className="shrink-0 opacity-90">
              <DearteenlineaLogo className="h-9 md:h-10" alt="" />
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-2 md:gap-12 md:items-start">
            <div className="space-y-4">
              <div
                className="text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem] [&_a]:underline-offset-4 [&_a:hover]:underline [&_b]:font-medium [&_b]:text-foreground [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-medium [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{ __html: content.introDescriptionHtml }}
              />
              <InstagramLine
                label={content.introInstagramText}
                href={content.introInstagramUrl}
                showInstagramName={false}
              />
            </div>

            <figure className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={content.imageSrc}
                  alt={content.imageAlt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              {content.isFallbackImage ? (
                <figcaption className="border-t border-border/60 px-4 py-3 text-center text-xs italic text-muted-foreground">
                  Espacio reservado para fotografía oficial de Denise.
                </figcaption>
              ) : null}
            </figure>
          </div>
        </section>

        <section
          className="rounded-2xl border border-border/70 bg-background p-6 md:p-10"
          aria-labelledby="nosotros-qullqa-heading"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-6">
            <h2
              id="nosotros-qullqa-heading"
              className={cn(
                "max-w-2xl text-balance text-xl font-medium leading-snug tracking-tight text-foreground md:text-2xl",
                "[font-family:var(--font-manrope)]",
              )}
            >
              Colaboración con{" "}
              <QullqaWordmark className="text-2xl md:text-[1.65rem]" />
            </h2>
          </div>

          <div
              className="space-y-6 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem] [&_a]:underline-offset-4 [&_a:hover]:underline [&_b]:font-medium [&_b]:text-foreground [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-medium [&_strong]:text-foreground"
            >
              <div dangerouslySetInnerHTML={{ __html: content.collaborationDescriptionHtml }}></div>

            <p className="pt-1">
              <a
                href={content.collaborationWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 transition hover:underline"
              >
                {content.collaborationWebsiteText}
              </a>
              {content.collaborationWebsiteUrl.includes("qullqa") && (
                <>
                  <span className="text-muted-foreground"> · </span>
                  <span className="text-muted-foreground">qullqa.art</span>
                </>
              )}
            </p>

            <InstagramLine
              label={content.collaborationInstagramText}
              href={content.collaborationInstagramUrl}
              showInstagramName={false}
            />

            <ul className="grid gap-4 pt-4 sm:grid-cols-2">
              {content.products.map((product) => (
                <li key={product.href}>
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-xl border border-border/80 bg-muted/20 p-5 transition hover:border-border hover:bg-muted/40"
                  >
                    <span
                      className={cn(
                        "mb-1 text-base font-medium text-foreground",
                        "[font-family:var(--font-manrope)]",
                      )}
                    >
                      {product.name}
                      <span className="ml-1 text-muted-foreground transition group-hover:text-foreground">
                        →
                      </span>
                    </span>
                    <span className="mb-3 flex-1 text-sm leading-relaxed text-muted-foreground [font-family:var(--font-manrope)]">
                      {product.description}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-primary underline-offset-4 group-hover:underline">
                      Ver producto
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="pt-2 text-xs italic text-muted-foreground">
              Los enlaces abren en una nueva pestaña.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
