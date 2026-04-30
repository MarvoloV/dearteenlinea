"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import {
  FlowHeaderNav,
  type FlowHeaderVariant,
} from "@/components/flow-header-nav";
import { cn } from "@/lib/utils";

/** Por encima del hero (z-10), chips promocionales (z-58) y diálogos (z-65). */
const MENU_Z = 200;

type FlowHeaderMobileDrawerProps = {
  variant: FlowHeaderVariant;
  /** Bloque opcional bajo el título (p. ej. marca); si no se pasa, solo enlaces. */
  children?: ReactNode;
};

export function FlowHeaderMobileDrawer({
  variant,
  children,
}: FlowHeaderMobileDrawerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const qullqa = variant === "qullqa-gallery";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const overlay = (
    <div
      className="fixed inset-0 md:hidden"
      style={{ zIndex: MENU_Z }}
      role="dialog"
      aria-modal="true"
      aria-label="Navegación"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Cerrar menú"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "absolute inset-y-0 right-0 flex h-dvh max-h-dvh w-[min(21rem,92vw)] flex-col border-l border-border bg-background shadow-2xl",
          qullqa && "[font-family:var(--font-manrope)]",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3.5">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Menú
          </span>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground outline-none transition hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-background px-4 py-4",
            children ? "gap-6" : "gap-0",
          )}
        >
          {children ? (
            <div className="shrink-0 border-b border-border/60 pb-5">{children}</div>
          ) : null}
          <div className="min-h-0 flex-1 bg-background pb-6 pt-1">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Explorar
            </p>
            <FlowHeaderNav variant={variant} stacked />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mounted && open ? createPortal(overlay, document.body) : null}
      <button
        type="button"
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground outline-none transition hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          qullqa && "[font-family:var(--font-manrope)]",
        )}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? "Menú abierto" : "Abrir menú de navegación"}
        onClick={() => setOpen(true)}
      >
        <Menu className="size-6" aria-hidden />
      </button>
    </>
  );
}
