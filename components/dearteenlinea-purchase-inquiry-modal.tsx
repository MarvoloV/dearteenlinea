"use client";

import { Dialog } from "@base-ui/react/dialog";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

import { PurchaseInquiryForm } from "@/components/purchase-inquiry-form";
import { cn } from "@/lib/utils";

type DearteenlineaPurchaseInquiryModalProps = {
  artworkTitle: string;
  artistName: string;
  triggerClassName?: string;
};

export function DearteenlineaPurchaseInquiryModal({
  artworkTitle,
  artistName,
  triggerClassName,
}: DearteenlineaPurchaseInquiryModalProps) {
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
        <Dialog.Popup className="data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 fixed top-1/2 left-1/2 z-50 max-h-[min(90dvh,calc(100dvh-2rem))] w-[min(100vw-2rem,26rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border/80 bg-card p-4 shadow-lg outline-none">
          <Dialog.Title className="text-base font-medium text-foreground">
            Contactar para compra
          </Dialog.Title>
          <p className="mt-1 text-xs text-muted-foreground">
            Completa el formulario; en esta demo no se envía ningún correo.
          </p>
          <div className="mt-4">
            <PurchaseInquiryForm
              key={formKey}
              artworkTitle={artworkTitle}
              artistName={artistName}
              onSentChange={setFormSent}
            />
          </div>
          {!formSent ? (
            <Dialog.Close
              className={cn(
                "mt-4 w-full rounded-lg border border-border/80 py-2 text-sm font-medium text-foreground transition hover:bg-muted",
                triggerClassName,
              )}
            >
              Cerrar
            </Dialog.Close>
          ) : null}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
