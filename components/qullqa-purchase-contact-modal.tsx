"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ExternalLink, Mail, MessageCircle, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

import { PurchaseInquiryForm } from "@/components/purchase-inquiry-form";
import { hasQullqaPurchaseChannels } from "@/lib/artist-utils";
import {
  digitsForWhatsApp,
  instagramHref,
  whatsAppPurchaseHref,
} from "@/lib/contact-links";
import type { Artist } from "@/lib/types/artist";
import { cn } from "@/lib/utils";

type QullqaPurchaseContactModalProps = {
  artist: Artist;
  artworkTitle: string;
  artistDisplayName: string;
  triggerClassName?: string;
};

function purchaseWhatsAppMessage(
  artworkTitle: string,
  artistName: string,
  link: string,
) {
  return `Me interesa la obra "${artworkTitle}" del artista ${artistName} que encontré en ${link}`;
}

function QullqaContactInfoBody({
  artist,
  artworkTitle,
  artistDisplayName,
}: {
  artist: Artist;
  artworkTitle: string;
  artistDisplayName: string;
}) {
  const p = artist.purchaseContact!;
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(typeof window !== "undefined" ? window.location.href : "");
  }, []);

  const waMsg = purchaseWhatsAppMessage(
    artworkTitle,
    artistDisplayName,
    pageUrl || "…",
  );
  const phoneDigits = p.phone ? digitsForWhatsApp(p.phone) : "";
  const waHref =
    p.phone && phoneDigits
      ? whatsAppPurchaseHref(p.phone, waMsg)
      : null;

  const rowClass =
    "flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5";

  return (
    <div className="space-y-3">
      {p.contactName ? (
        <p className="text-sm text-muted-foreground">{p.contactName}</p>
      ) : null}
      {p.email ? (
        <a
          href={`mailto:${p.email}?subject=${encodeURIComponent(`Interés en «${artworkTitle}»`)}`}
          className={cn(rowClass, "transition hover:bg-muted/40")}
        >
          <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 break-all text-sm font-medium text-foreground">
            {p.email}
          </span>
        </a>
      ) : null}
      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(rowClass, "transition hover:bg-muted/40")}
        >
          <Smartphone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            WhatsApp
          </span>
        </a>
      ) : null}
      {p.web ? (
        <a
          href={p.web}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(rowClass, "transition hover:bg-muted/40")}
        >
          <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Web</span>
        </a>
      ) : null}
      {p.instagram ? (
        <a
          href={instagramHref(p.instagram)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(rowClass, "transition hover:bg-muted/40")}
        >
          <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Instagram
          </span>
        </a>
      ) : null}
    </div>
  );
}

export function QullqaPurchaseContactModal({
  artist,
  artworkTitle,
  artistDisplayName,
  triggerClassName,
}: QullqaPurchaseContactModalProps) {
  const direct = hasQullqaPurchaseChannels(artist);
  const [formKey, setFormKey] = useState(0);
  const [formSent, setFormSent] = useState(false);

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open) {
          setFormKey((k) => k + 1);
          setFormSent(false);
        }
      }}
    >
      <Dialog.Trigger
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90",
          triggerClassName,
        )}
      >
        <MessageCircle className="size-4 shrink-0" aria-hidden />
        Contactar para compra
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] transition-[opacity]" />
        <Dialog.Popup className="data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 fixed top-1/2 left-1/2 z-50 max-h-[min(90dvh,calc(100dvh-2rem))] w-[min(100vw-2rem,26rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border/80 bg-card p-4 shadow-lg outline-none [font-family:var(--font-manrope)]">
          <Dialog.Title className="text-base font-medium text-foreground">
            {direct ? "Contacta para compra" : "Contactar para compra"}
          </Dialog.Title>
          {direct ? (
            <>
              <p className="mt-1 text-xs text-muted-foreground">
                Datos de contacto del artista para esta obra.
              </p>
              <div className="mt-4">
                <QullqaContactInfoBody
                  artist={artist}
                  artworkTitle={artworkTitle}
                  artistDisplayName={artistDisplayName}
                />
              </div>
            </>
          ) : (
            <>
              <p className="mt-1 text-xs text-muted-foreground">
                No hay canal directo publicado; usa el formulario (demo sin
                envío).
              </p>
              <div className="mt-4">
                <PurchaseInquiryForm
                  key={formKey}
                  artworkTitle={artworkTitle}
                  artistName={artistDisplayName}
                  className="[font-family:var(--font-manrope)]"
                  onSentChange={setFormSent}
                />
              </div>
            </>
          )}
          {direct ? (
            <Dialog.Close className="mt-4 w-full rounded-lg border border-border/80 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
              Cerrar
            </Dialog.Close>
          ) : !formSent ? (
            <Dialog.Close className="mt-4 w-full rounded-lg border border-border/80 py-2 text-sm font-medium text-foreground transition hover:bg-muted">
              Cerrar
            </Dialog.Close>
          ) : null}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
