"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  Check,
  Copy,
  ExternalLink,
  Link2,
  MessageCircle,
  Share2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ArtistShareModalProps = {
  artistName: string;
  /** Clases extra en el botón disparador (p. ej. Manrope en qullqa). */
  triggerClassName?: string;
};

function shareUrls(pageUrl: string, artistName: string) {
  const line = `Conoce a ${artistName}: ${pageUrl}`;
  const encodedLine = encodeURIComponent(line);
  const encodedUrl = encodeURIComponent(pageUrl);
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedLine}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedLine}`,
  };
}

export function ArtistShareModal({
  artistName,
  triggerClassName,
}: ArtistShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const copyUrl = useCallback(() => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const openExternal = useCallback(
    (href: string) => {
      window.open(href, "_blank", "noopener,noreferrer");
    },
    [],
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-xs transition hover:bg-muted",
          triggerClassName,
        )}
      >
        <Share2 className="size-4 shrink-0" aria-hidden />
        Compartir
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] transition-[opacity]" />
        <Dialog.Popup className="data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 fixed top-1/2 left-1/2 z-50 w-[min(100vw-2rem,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border/80 bg-card p-4 shadow-lg outline-none">
          <Dialog.Title className="text-base font-medium text-foreground">
            Compartir
          </Dialog.Title>
          <p className="mt-1 text-xs text-muted-foreground">
            Enlace a la ficha de {artistName}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() =>
                openExternal(
                  shareUrls(
                    typeof window !== "undefined" ? window.location.href : "",
                    artistName,
                  ).twitter,
                )
              }
            >
              <span className="font-semibold" aria-hidden>
                𝕏
              </span>
              Twitter / X
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() =>
                openExternal(
                  shareUrls(
                    typeof window !== "undefined" ? window.location.href : "",
                    artistName,
                  ).facebook,
                )
              }
            >
              <ExternalLink className="size-4" aria-hidden />
              Facebook
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() =>
                openExternal(
                  shareUrls(
                    typeof window !== "undefined" ? window.location.href : "",
                    artistName,
                  ).whatsapp,
                )
              }
            >
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={copyUrl}
            >
              {copied ? (
                <Check className="size-4 text-green-600" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
              {copied ? "Copiado" : "Copiar enlace"}
            </Button>
          </div>
          {pageUrl ? (
            <div className="mt-3 flex items-start gap-2 rounded-md border border-border/60 bg-muted/30 px-2 py-1.5 text-[11px] text-muted-foreground">
              <Link2 className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span className="break-all">{pageUrl}</span>
            </div>
          ) : null}
          <Dialog.Close
            className={cn(
              "mt-4 w-full rounded-lg border border-border/80 py-2 text-sm font-medium text-foreground transition hover:bg-muted",
              triggerClassName,
            )}
          >
            Cerrar
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
