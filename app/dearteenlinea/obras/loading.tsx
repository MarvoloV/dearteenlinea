import { FlowHeader } from "@/components/flow-header";
import { DearteObrasCatalogSkeleton } from "@/components/loading-skeletons";

function title() {
  return (
    <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
      Obras curadas
    </h1>
  );
}

export default function DearteenlineaObrasLoading() {
  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <DearteObrasCatalogSkeleton title={title()} />
        </div>
      </main>
    </>
  );
}
