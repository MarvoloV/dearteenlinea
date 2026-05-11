import type { Metadata } from "next";

import { PathSelector } from "@/components/path-selector";
import { getHomeConfig } from "@/lib/home-config";
import { buildSeoMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const homeConfig = await getHomeConfig();

  return buildSeoMetadata({
    title: "dearteenlinea × qullqa",
    description: `${homeConfig.paths.dearte.description} ${homeConfig.paths.qullqa.description}`,
    path: "/",
    image: homeConfig.paths.dearte.imageUrl,
    imageAlt: homeConfig.paths.dearte.imageAlt,
  });
}

export default async function Home() {
  const homeConfig = await getHomeConfig();

  return (
    <PathSelector
      dearte={homeConfig.paths.dearte}
      qullqa={homeConfig.paths.qullqa}
    />
  );
}
