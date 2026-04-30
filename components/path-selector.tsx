import Image from "next/image";
import Link from "next/link";

import { DearteenlineaLogo } from "@/components/dearteenlinea-logo";

/**
 * Pintura abstracta en sala de museo (Unsplash). Enfoque en obra de arte, no en mobiliario / interiorismo.
 * ID verificado HTTP 200.
 */
const dearteImage =
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=2000&q=85";
const qullqaImage =
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=2000&q=85";

export function PathSelector() {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <Link
        href="/dearteenlinea"
        className="group relative flex min-h-[50dvh] flex-1 flex-col justify-end overflow-hidden outline-offset-0 transition focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring md:min-h-0"
      >
        <Image
          src={dearteImage}
          alt=""
          fill
          unoptimized
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.03] group-active:scale-[1.01]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20 transition group-hover:from-black/80"
          aria-hidden
        />
        <div className="relative z-10 max-w-lg px-6 pb-10 pt-16 text-white md:px-10 md:pb-14">
          <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-white/80">
            Galería
          </p>
          <h1 className="mb-3">
            <span className="sr-only">dearteenlinea</span>
            <DearteenlineaLogo inverted className="h-10 w-auto md:h-12" />
          </h1>
          <p className="text-sm leading-relaxed text-white/90 md:text-base">
            Obras curadas: artistas consolidados, emergentes y piezas de mercado
            secundario, reunidas con criterio para quien busca calidad.
          </p>
        </div>
      </Link>

      <div
        className="h-px w-full shrink-0 bg-border/80 md:h-auto md:w-px md:self-stretch"
        aria-hidden
      />

      <Link
        href="/qullqa-gallery"
        className="group relative flex min-h-[50dvh] flex-1 flex-col justify-end overflow-hidden outline-offset-0 transition focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring md:min-h-0"
      >
        <Image
          src={qullqaImage}
          alt=""
          fill
          unoptimized
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.03] group-active:scale-[1.01]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20 transition group-hover:from-black/80"
          aria-hidden
        />
        <div className="relative z-10 max-w-lg px-6 pb-10 pt-16 text-white md:px-10 md:pb-14">
          <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-white/80">
            Espacio público
          </p>
          <h2 className="mb-3 text-2xl font-medium leading-snug tracking-tight md:text-3xl [font-family:var(--font-manrope)]">
            qullqa gallery
          </h2>
          <p className="text-sm leading-relaxed text-white/90 md:text-base [font-family:var(--font-manrope)]">
            Obras publicadas desde la plataforma qullqa: un escaparate abierto
            para artistas que gestionan y comparten su trabajo con
            coleccionistas.
          </p>
        </div>
      </Link>
    </div>
  );
}
