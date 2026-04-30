"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { DearteenlineaLogo } from "@/components/dearteenlinea-logo";
import { Button } from "@/components/ui/button";
import {
  readCatalogPromoHidden,
  readCatalogPromoWaJoined,
  setCatalogPromoHidden,
  setCatalogPromoWaJoined,
} from "@/lib/dearteenlinea-catalog-promo-storage";
import { cn } from "@/lib/utils";

const WA_GROUP_URL =
  "https://chat.whatsapp.com/BXrT7NsCeBCANdbBklflCM";

export function DearteenlineaCatalogPromo() {
  const [mounted, setMounted] = useState(false);
  const [blockedByStorage, setBlockedByStorage] = useState(false);
  const [floatDismissed, setFloatDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [neverAgain, setNeverAgain] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const checkboxId = useId();

  useEffect(() => {
    setMounted(true);
    setPortalEl(document.body);
    if (readCatalogPromoWaJoined() || readCatalogPromoHidden()) {
      setBlockedByStorage(true);
    }
  }, []);

  const showChip =
    mounted && !blockedByStorage && !floatDismissed;

  const handleJoin = () => {
    window.open(WA_GROUP_URL, "_blank", "noopener,noreferrer");
    setCatalogPromoWaJoined();
    setBlockedByStorage(true);
    setModalOpen(false);
  };

  const handleNoThanks = () => {
    if (neverAgain) {
      setCatalogPromoHidden();
      setBlockedByStorage(true);
    }
    setModalOpen(false);
    setNeverAgain(false);
  };

  const chip = showChip && portalEl ? (
    <div
      className={cn(
        /* Portal a body: fixed respecto al viewport (evita ancestros con transform en el layout). */
        "fixed left-5 z-[58] flex max-w-[min(100vw-2.5rem,18rem)] items-center gap-2 rounded-lg border border-border/80 bg-card py-2 pl-3 pr-1 shadow-md md:left-6",
        "bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))]",
      )}
    >
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="min-w-0 flex-1 rounded-md px-1 py-1 text-left text-sm font-medium text-foreground transition hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Recibe un Catálogo
      </button>
      <button
        type="button"
        onClick={() => setFloatDismissed(true)}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Cerrar aviso de catálogo"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  ) : null;

  return (
    <>
      {chip && portalEl ? createPortal(chip, portalEl) : null}

      <Dialog.Root
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setNeverAgain(false);
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 fixed inset-0 z-[65] bg-black/45 backdrop-blur-[1px] transition-[opacity]" />
          <Dialog.Popup className="data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 fixed top-1/2 left-1/2 z-[65] max-h-[min(90dvh,calc(100dvh-2rem))] w-[min(100vw-2rem,24rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border/80 bg-card p-5 shadow-lg outline-none">
            <Dialog.Title className="sr-only">
              Recibir catálogo por WhatsApp
            </Dialog.Title>
            <div className="flex flex-col items-center gap-4 text-center">
              <DearteenlineaLogo className="h-12 w-auto md:h-14" alt="" />
              <div className="space-y-2 text-foreground">
                <p className="text-base font-semibold leading-snug">
                  ¿Quieres recibir un catálogo?
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Únete a nuestro grupo de WhatsApp y descubre las obras que
                  tenemos disponibles cada mes
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 pt-1">
                <Button type="button" className="w-full" onClick={handleJoin}>
                  Unirme
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleNoThanks}
                >
                  No, gracias
                </Button>
              </div>
              <label
                htmlFor={checkboxId}
                className="flex cursor-pointer items-start gap-2 text-left text-xs text-muted-foreground"
              >
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={neverAgain}
                  onChange={(e) => setNeverAgain(e.target.checked)}
                  className="mt-0.5 size-3.5 shrink-0 rounded border-input"
                />
                <span>No quiero ver esto más</span>
              </label>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
