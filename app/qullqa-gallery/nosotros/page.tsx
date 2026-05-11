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
    path: "/qullqa-gallery/nosotros",
    image: content.imageSrc,
    imageAlt: content.imageAlt,
    siteName: "Qullqa Gallery",
  });
}

export default async function QullqaNosotrosPage() {
  const content = await getNosotrosPage();

  return (
    <>
      <FlowHeader variant="qullqa-gallery" />
      <main className="flex-1">
        <NosotrosPage content={content} />
      </main>
    </>
  );
}
