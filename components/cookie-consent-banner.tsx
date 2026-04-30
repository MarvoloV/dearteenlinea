"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  isCookieConsentSet,
} from "@/lib/cookie-consent-storage";
import { cn } from "@/lib/utils";

const COOKIES_POLICY_PATH = "/legal/cookies";

function inGalleryFlow(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith("/dearteenlinea") || pathname.startsWith("/qullqa-gallery")
  );
}

export function CookieConsentBanner() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [stored, setStored] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      setStored(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
    } catch {
      setStored(null);
    }
  }, [mounted]);

  const inFlow = inGalleryFlow(pathname);
  const hasStoredChoice =
    stored !== null && isCookieConsentSet(stored);
  const visible = mounted && inFlow && !hasStoredChoice;

  const save = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setStored(value);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-5 left-5 z-[60] w-[min(100vw-2.5rem,22rem)] rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg md:left-6 md:bottom-6 md:w-[min(100vw-3rem,24rem)]"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <h2
        id="cookie-consent-title"
        className="text-sm font-semibold leading-snug text-foreground"
      >
        Cookies
      </h2>
      <p
        id="cookie-consent-desc"
        className="mt-2 text-xs leading-relaxed text-muted-foreground"
      >
        Usamos cookies para mejorar la experiencia en este sitio. Puedes aceptarlas,
        rechazarlas o leer la política de cookies (se abre en una pestaña nueva).
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 min-w-[6rem]"
            onClick={() => save("rejected")}
          >
            Rechazar
          </Button>
          <Button
            type="button"
            size="sm"
            className="flex-1 min-w-[6rem]"
            onClick={() => save("accepted")}
          >
            Aceptar
          </Button>
        </div>
        <Link
          href={COOKIES_POLICY_PATH}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-full justify-center text-muted-foreground hover:text-foreground",
          )}
        >
          Política de cookies
        </Link>
      </div>
    </div>
  );
}
