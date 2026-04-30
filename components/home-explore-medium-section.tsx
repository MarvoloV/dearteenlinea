import Image from "next/image";
import Link from "next/link";

import {
  HomePastelSection,
  type HomePastelVariant,
} from "@/components/home-pastel-section";
import { HomeSectionHeader } from "@/components/home-section-header";
import type { HomeFlow } from "@/lib/medium-explore-images";
import { mediumCardImage, mediumsForFlow } from "@/lib/medium-explore-images";
import { cn } from "@/lib/utils";

type HomeExploreByMediumSectionProps = {
  flow: HomeFlow;
  basePath: "/dearteenlinea" | "/qullqa-gallery";
  variant: HomePastelVariant;
};

type BentoDef = {
  template: string;
  /** Área CSS grid por índice del medio (mismo orden que `mediums`). */
  areaByIndex: string[];
};

function bentoForCount(n: number): BentoDef | null {
  if (n === 7) {
    return {
      template: `"a b d" "a c d" "e f g"`,
      areaByIndex: ["a", "b", "c", "d", "e", "f", "g"],
    };
  }
  if (n === 10) {
    return {
      template: `"a b d" "a c d" "e f g" "h i j"`,
      areaByIndex: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
    };
  }
  return null;
}

function MediumCard({
  href,
  src,
  label,
  manrope,
  variant,
}: {
  href: string;
  src: string;
  label: string;
  manrope: boolean;
  /** `fill`: ocupa toda la celda del grid (laterales que cruzan 2 filas). `ratio`: proporción fija 3/2. */
  variant: "fill" | "ratio";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block min-h-0 w-full overflow-hidden rounded-lg border border-border/50 shadow-xs ring-1 ring-black/[0.04] transition",
        "hover:border-border hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "ratio" && "aspect-[3/2]",
        variant === "fill" && "h-full min-h-0 flex-1",
        manrope && "[font-family:var(--font-manrope)]",
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        unoptimized
        className="object-cover transition duration-300 group-hover:scale-[1.02]"
        sizes={
          variant === "fill"
            ? "(max-width: 768px) 45vw, 28vw"
            : "(max-width: 768px) 45vw, 22vw"
        }
      />
      {/* Móvil: gradiente inferior para leer el título sin hover */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent md:hidden"
        aria-hidden
      />
      {/* Desktop: oscurece al hover / foco */}
      <div
        className="pointer-events-none absolute inset-0 hidden bg-black/0 transition-colors duration-200 group-hover:bg-black/50 group-focus-visible:bg-black/50 md:block"
        aria-hidden
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white",
          "opacity-100 md:opacity-0 md:transition-opacity md:duration-200",
          "md:group-hover:opacity-100 md:group-focus-visible:opacity-100",
        )}
      >
        <span className="min-w-0 text-lg font-medium leading-snug tracking-tight drop-shadow-md [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] md:text-xl md:leading-tight">
          {label}
        </span>
        <span
          className="shrink-0 text-xl text-white/95 transition duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)] md:text-2xl"
          aria-hidden
        >
          →
        </span>
      </div>
      <span className="sr-only">{`Ver obras de ${label}`}</span>
    </Link>
  );
}

export function HomeExploreByMediumSection({
  flow,
  basePath,
  variant,
}: HomeExploreByMediumSectionProps) {
  const mediums = mediumsForFlow(flow);
  const manrope = flow === "qullqa-gallery";
  const bento = bentoForCount(mediums.length);

  return (
    <HomePastelSection variant={variant}>
      <HomeSectionHeader
        title={
          <>
            <span className="italic font-light">Explorar</span>{" "}
            <span className="font-semibold not-italic tracking-wide">
              por medio
            </span>
          </>
        }
        manrope={manrope}
        titleSize="display"
        action={{ label: "Ver todas las obras", href: `${basePath}/obras` }}
      />
      {bento ? (
        <>
          <ul className="grid grid-cols-2 gap-2.5 sm:gap-3 md:hidden">
            {mediums.map((m) => {
              const href = `${basePath}/obras?medio=${encodeURIComponent(m)}`;
              const src = mediumCardImage(flow, m);
              return (
                <li key={m} className="min-w-0">
                  <MediumCard
                    href={href}
                    src={src}
                    label={m}
                    manrope={manrope}
                    variant="ratio"
                  />
                </li>
              );
            })}
          </ul>
          <ul
            className="hidden min-h-0 gap-2.5 md:grid md:grid-cols-3 md:gap-3"
            style={{
              gridTemplateAreas: bento.template,
              gridTemplateRows:
                mediums.length === 10
                  ? "minmax(0, auto) minmax(0, auto) minmax(0, auto) minmax(0, auto)"
                  : "minmax(0, auto) minmax(0, auto) minmax(0, auto)",
            }}
          >
            {mediums.map((m, i) => {
              const href = `${basePath}/obras?medio=${encodeURIComponent(m)}`;
              const src = mediumCardImage(flow, m);
              const area = bento.areaByIndex[i] ?? "auto";
              const isFill = area === "a" || area === "d";
              return (
                <li
                  key={m}
                  className={cn(
                    "min-h-0 min-w-0 overflow-hidden",
                    isFill && "flex min-h-0 flex-col",
                  )}
                  style={{ gridArea: area }}
                >
                  <MediumCard
                    href={href}
                    src={src}
                    label={m}
                    manrope={manrope}
                    variant={isFill ? "fill" : "ratio"}
                  />
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
          {mediums.map((m) => {
            const href = `${basePath}/obras?medio=${encodeURIComponent(m)}`;
            const src = mediumCardImage(flow, m);
            return (
              <li key={m} className="min-w-0">
                <MediumCard
                  href={href}
                  src={src}
                  label={m}
                  manrope={manrope}
                  variant="ratio"
                />
              </li>
            );
          })}
        </ul>
      )}
    </HomePastelSection>
  );
}
