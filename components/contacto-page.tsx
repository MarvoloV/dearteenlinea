"use client";

import { Send } from "lucide-react";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE_DISPLAY,
  siteContactMailtoHref,
  siteContactTelHref,
} from "@/lib/site-contact";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";

export function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <header className="mb-12 max-w-2xl space-y-1">
        <h1
          className="text-balance [font-family:var(--font-cormorant)] text-[2rem] font-light leading-[1.15] tracking-[0.02em] text-foreground md:text-[2.65rem]"
        >
          <span className="italic text-foreground/90">Contacto</span>
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Escríbenos o usa los datos directos. Respondemos lo antes posible.
        </p>
      </header>

      <div className="grid gap-10 md:grid-cols-2 md:gap-14 lg:gap-16">
        <section
          className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8"
          aria-labelledby="contacto-info-heading"
        >
          <h2
            id="contacto-info-heading"
            className="mb-6 text-balance [font-family:var(--font-cormorant)] text-xl font-light leading-snug tracking-[0.015em] text-foreground md:text-2xl"
          >
            <span className="italic text-foreground/85">Información</span>{" "}
            <span className="font-semibold not-italic">de contacto</span>
          </h2>
          <dl className="space-y-6">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Celular
              </dt>
              <dd className="mt-1">
                <a
                  href={siteContactTelHref()}
                  className="text-base font-medium text-foreground underline-offset-4 transition hover:underline"
                >
                  {SITE_CONTACT_PHONE_DISPLAY}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  href={siteContactMailtoHref()}
                  className="break-all text-base font-medium text-foreground underline-offset-4 transition hover:underline"
                >
                  {SITE_CONTACT_EMAIL}
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section
          className="rounded-2xl border border-border/70 bg-background p-6 md:p-8"
          aria-labelledby="contacto-form-heading"
        >
          <h2
            id="contacto-form-heading"
            className="sr-only"
          >
            Formulario de contacto
          </h2>

          {sent ? (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Gracias. Hemos recibido tu mensaje; en un entorno real se
                enviaría al equipo de la galería.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSent(false);
                  setFullName("");
                  setEmail("");
                  setPhone("");
                  setComment("");
                }}
              >
                Enviar otro mensaje
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Nombres y apellidos
                </span>
                <input
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  autoComplete="name"
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Correo electrónico
                </span>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Teléfono
                </span>
                <input
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  autoComplete="tel"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Comentario
                </span>
                <textarea
                  name="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  className={cn(inputClass, "min-h-[120px] resize-y")}
                  required
                />
              </label>
              <div className="flex flex-col items-end gap-3 pt-1">
                <Button type="submit" variant="outline" className="gap-2">
                  <Send className="size-4" aria-hidden />
                  Enviar
                </Button>
                <p className="max-w-md text-right text-xs italic text-muted-foreground">
                  Su información personal es confidencial y será protegida.
                </p>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
