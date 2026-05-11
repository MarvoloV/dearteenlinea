import { PathSelector } from "@/components/path-selector";
import { getHomeConfig } from "@/lib/home-config";

export default async function Home() {
  const homeConfig = await getHomeConfig();

  return (
    <PathSelector
      dearte={homeConfig.paths.dearte}
      qullqa={homeConfig.paths.qullqa}
    />
  );
}
