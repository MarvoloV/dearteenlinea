import Image from "next/image";

import { qullqaProducts } from "@/lib/qullqa-products";
import { cn } from "@/lib/utils";

export function QullqaProductsSection({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "border-b border-border/60 bg-background px-4 py-12 md:px-6 md:py-16",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Herramientas Qullqa
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2">
          {qullqaProducts.map((product) => (
            <li key={product.href}>
              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card transition hover:border-border hover:shadow-sm"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    fill
                    unoptimized
                    className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="mb-2 text-lg font-medium tracking-tight text-foreground [font-family:var(--font-manrope)]">
                    {product.name}
                    <span className="ml-1 text-muted-foreground transition group-hover:text-foreground">
                      →
                    </span>
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground [font-family:var(--font-manrope)]">
                    {product.description}
                  </p>
                  <span className="text-xs font-medium uppercase tracking-wider text-primary underline-offset-4 group-hover:underline">
                    Abrir en qullqa.art
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
