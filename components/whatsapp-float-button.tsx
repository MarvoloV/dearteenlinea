"use client";

const WHATSAPP_URL = "https://wa.me/51975584084";
const WHATSAPP_GREEN = "#25D366";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/** Botón flotante global: WhatsApp con tooltip y enlace a wa.me. */
export function WhatsAppFloatButton() {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[55] md:bottom-6 md:right-6">
      <div className="pointer-events-auto group relative flex items-end justify-end">
        <div
          className="pointer-events-none absolute bottom-1 right-[calc(100%+0.75rem)] z-10 w-[min(100vw-6rem,16rem)] origin-bottom-right scale-95 rounded-lg opacity-0 shadow-lg transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100"
          style={{ backgroundColor: WHATSAPP_GREEN }}
          role="tooltip"
        >
          <div className="relative px-3.5 py-2.5 text-left text-xs font-medium leading-snug text-white sm:text-[13px]">
            <p>¿Necesitas comunicarte con nosotros?</p>
            <p className="mt-0.5">Contáctanos por Whatsapp.</p>
            <span
              className="absolute -right-2 top-1/2 z-10 size-0 -translate-y-1/2 border-y-[7px] border-l-[8px] border-y-transparent"
              style={{ borderLeftColor: WHATSAPP_GREEN }}
              aria-hidden
            />
          </div>
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Contáctanos por WhatsApp"
          className="motion-safe:animate-whatsapp-float-bounce motion-reduce:animate-none flex size-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg ring-offset-2 ring-offset-background transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 active:brightness-95"
          style={{ backgroundColor: WHATSAPP_GREEN }}
          aria-label="Abrir WhatsApp: contáctanos"
        >
          <WhatsAppIcon className="size-8" />
        </a>
      </div>
    </div>
  );
}
