import { FlowFooter } from "@/components/flow-footer";

export default function QullqaGalleryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {children}
      <FlowFooter variant="qullqa-gallery" />
    </div>
  );
}
