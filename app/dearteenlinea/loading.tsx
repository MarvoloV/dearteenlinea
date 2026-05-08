import { FlowHeader } from "@/components/flow-header";
import {
  ArtworkCarouselSkeleton,
  MediumsSkeleton,
} from "@/components/loading-skeletons";

const latestTitle = (
  <>
    <span className="font-semibold not-italic tracking-tight">Últimas</span>{" "}
    <span className="italic font-light text-foreground">obras</span>
  </>
);

const mediumTitle = (
  <>
    <span className="italic font-light">Explorar</span>{" "}
    <span className="font-semibold not-italic tracking-wide">por medio</span>
  </>
);

export default function DearteenlineaLoading() {
  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex flex-1 flex-col">
        <section className="relative isolate min-h-[min(72dvh,720px)] w-full overflow-hidden border-b border-border/60 bg-muted">
          <div className="absolute inset-0 animate-pulse bg-muted-foreground/15" />
          <div className="relative z-10 flex min-h-[min(72dvh,720px)] w-full flex-col justify-end pb-10 pt-32 md:pb-14 md:pt-40">
            <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
              <div className="max-w-xl space-y-4 md:max-w-2xl">
                <div className="h-14 w-64 animate-pulse rounded-md bg-background/30 md:h-16" />
                <div className="h-4 w-full max-w-lg animate-pulse rounded-md bg-background/25" />
                <div className="h-4 w-4/5 animate-pulse rounded-md bg-background/25" />
              </div>
            </div>
          </div>
        </section>
        <div className="flex flex-col gap-10 pb-12 pt-8 md:gap-12 md:pb-16 md:pt-10">
          <ArtworkCarouselSkeleton
            variant="violet"
            title={latestTitle}
            actionLabel="Ver todas las obras"
          />
          <MediumsSkeleton variant="rose" title={mediumTitle} />
        </div>
      </main>
    </>
  );
}
