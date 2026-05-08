import Image from "next/image";
import Link from "next/link";

import {
  HomePastelSection,
  type HomePastelVariant,
} from "@/components/home-pastel-section";
import { HomeSectionHeader } from "@/components/home-section-header";
import { deartePathSlug } from "@/lib/dearte-filter-slugs";
import type { HomeFlow } from "@/lib/medium-explore-images";
import { mediumCardImage, mediumsForFlow } from "@/lib/medium-explore-images";
import { cn } from "@/lib/utils";

type HomeExploreByMediumSectionProps = {
  flow: HomeFlow;
  basePath: "/dearteenlinea" | "/qullqa-gallery";
  variant: HomePastelVariant;
  mediums?: readonly HomeExploreMedium[];
  queryParamName?: "medio" | "medium";
};

type BentoDef = {
  template: string;
  /** Área CSS grid por índice del medio (mismo orden que `mediums`). */
  areaByIndex: string[];
};

function bentoForCount(n: number): BentoDef | null {
  if (n === 6) {
    return {
      template: `"a b d" "a c d" "e f f"`,
      areaByIndex: ["a", "b", "c", "d", "e", "f"],
    };
  }
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

export type HomeExploreMedium = {
  slug?: string;
  label: string;
  imageUrl?: string | null;
  href?: string | null;
  artworkCount?: number;
};

function defaultMediumsForFlow(flow: HomeFlow): HomeExploreMedium[] {
  return mediumsForFlow(flow).map((label) => ({ label }));
}

function artworkCountLabel(count: number): string {
  return count === 1 ? "1 obra" : `${count} obras`;
}

function mediumHref(
  medium: HomeExploreMedium,
  basePath: HomeExploreByMediumSectionProps["basePath"],
  queryParamName: NonNullable<HomeExploreByMediumSectionProps["queryParamName"]>,
): string {
  const queryValue =
    medium.slug ??
    (basePath === "/dearteenlinea" ? deartePathSlug(medium.label) : medium.label);
  if (basePath === "/dearteenlinea") {
    return `${basePath}/obras/medios/${encodeURIComponent(queryValue)}`;
  }
  return `${basePath}/obras?${queryParamName}=${encodeURIComponent(queryValue)}`;
}

function mediumImage(flow: HomeFlow, medium: HomeExploreMedium): string {
  return medium.imageUrl?.trim() || mediumCardImage(flow, medium.label);
}

function MediumCard({
  href,
  src,
  label,
  artworkCount,
  manrope,
  variant,
}: {
  href: string;
  src: string;
  label: string;
  artworkCount?: number;
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
        <span className="min-w-0">
          <span className="block text-lg font-medium leading-snug tracking-tight drop-shadow-md [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] md:text-xl md:leading-tight">
            {label}
          </span>
          {typeof artworkCount === "number" ? (
            <span className="mt-0.5 block text-xs font-medium text-white/85 drop-shadow-md">
              {artworkCountLabel(artworkCount)}
            </span>
          ) : null}
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
  mediums,
  queryParamName = "medio",
}: HomeExploreByMediumSectionProps) {
  const mediumItems = mediums ?? defaultMediumsForFlow(flow);
  const manrope = flow === "qullqa-gallery";
  const bento = bentoForCount(mediumItems.length);

  if (mediumItems.length === 0) return null;

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
            {mediumItems.map((m) => {
              const queryValue = m.slug ?? m.label;
              const href = mediumHref(m, basePath, queryParamName);
              const src = mediumImage(flow, m);
              return (
                <li key={queryValue} className="min-w-0">
                  <MediumCard
                    href={href}
                    src={src}
                    label={m.label}
                    artworkCount={m.artworkCount}
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
                mediumItems.length === 10
                  ? "minmax(0, auto) minmax(0, auto) minmax(0, auto) minmax(0, auto)"
                  : "minmax(0, auto) minmax(0, auto) minmax(0, auto)",
            }}
          >
            {mediumItems.map((m, i) => {
              const queryValue = m.slug ?? m.label;
              const href = mediumHref(m, basePath, queryParamName);
              const src = mediumImage(flow, m);
              const area = bento.areaByIndex[i] ?? "auto";
              const isFill = area === "a" || area === "d";
              return (
                <li
                  key={queryValue}
                  className={cn(
                    "min-h-0 min-w-0 overflow-hidden",
                    isFill && "flex min-h-0 flex-col",
                  )}
                  style={{ gridArea: area }}
                >
                  <MediumCard
                    href={href}
                    src={src}
                    label={m.label}
                    artworkCount={m.artworkCount}
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
          {mediumItems.map((m) => {
            const queryValue = m.slug ?? m.label;
            const href = mediumHref(m, basePath, queryParamName);
            const src = mediumImage(flow, m);
            return (
              <li key={queryValue} className="min-w-0">
                <MediumCard
                  href={href}
                  src={src}
                  label={m.label}
                  artworkCount={m.artworkCount}
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
