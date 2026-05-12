import { FlowHeader } from "@/components/flow-header";
import { ArtworkDetailSkeleton } from "@/components/loading-skeletons";

export default function DearteenlineaObraLoading() {
  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <ArtworkDetailSkeleton />
        </div>
      </main>
    </>
  );
}