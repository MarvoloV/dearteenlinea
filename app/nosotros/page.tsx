import type { Metadata } from "next";

import { FlowHeader } from "@/components/flow-header";
import { NosotrosPage } from "@/components/nosotros-page";
import { getNosotrosPage } from "@/lib/nosotros-page";
import { buildSeoMetadata, stripHtml } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getNosotrosPage();

  return buildSeoMetadata({
    title: `${content.title} | De Arte en Línea`,
    description: stripHtml(content.contentHtml),
    path: "/nosotros",
    image: content.imageSrc,
    imageAlt: content.imageAlt,
  });
}

export default async function NosotrosRootPage() {
  const content = await getNosotrosPage();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <NosotrosPage content={content} />
      </main>
    </div>
  );
}
