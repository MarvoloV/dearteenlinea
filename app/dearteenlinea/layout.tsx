import { DearteenlineaCatalogPromo } from "@/components/dearteenlinea-catalog-promo";
import { FlowFooter } from "@/components/flow-footer";

export default function DearteenlineaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex min-h-dvh flex-col bg-background">
        {children}
        <FlowFooter variant="dearteenlinea" />
      </div>
      <DearteenlineaCatalogPromo />
    </>
  );
}
