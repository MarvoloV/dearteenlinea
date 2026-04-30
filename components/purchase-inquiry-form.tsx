"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const roleOptions = [
  { id: "artista", label: "Artista" },
  { id: "coleccionista", label: "Coleccionista" },
  { id: "visitante", label: "Visitante" },
] as const;

export type PurchaseInquiryFormProps = {
  artworkTitle: string;
  artistName: string;
  className?: string;
  /** Al enviar, solo estado visual “gracias”. */
  onSubmitVisual?: () => void;
  /** Para ocultar el pie del modal duplicado al mostrar “gracias”. */
  onSentChange?: (sent: boolean) => void;
};

function buildMessage(artworkTitle: string, artistName: string, pageUrl: string) {
  return `La obra "${artworkTitle}" ${pageUrl} del artista "${artistName}" es de mi interés. Por favor contactarme para más información.`;
}

export function PurchaseInquiryForm({
  artworkTitle,
  artistName,
  className,
  onSubmitVisual,
  onSentChange,
}: PurchaseInquiryFormProps) {
  const [sent, setSent] = useState(false);
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState<(typeof roleOptions)[number]["id"]>(
    "visitante",
  );

  useEffect(() => {
    const pageUrl =
      typeof window !== "undefined" ? window.location.href : "";
    setBody(buildMessage(artworkTitle, artistName, pageUrl));
  }, [artworkTitle, artistName]);

  useEffect(() => {
    onSentChange?.(sent);
  }, [sent, onSentChange]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    onSubmitVisual?.();
  };

  if (sent) {
    return (
      <div className={cn("space-y-4", className)}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Gracias. Hemos recibido tu mensaje; en un entorno real se enviaría un
          correo al equipo de la galería.
        </p>
        <Dialog.Close
          className="w-full rounded-lg border border-border/80 bg-background py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          Cerrar
        </Dialog.Close>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Nombre
          </span>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            autoComplete="name"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Correo
          </span>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoComplete="email"
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
            Ciudad
          </span>
          <input
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
            autoComplete="address-level2"
          />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-muted-foreground">Soy</span>
        <select
          name="role"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as (typeof roleOptions)[number]["id"])
          }
          className={cn(inputClass, "cursor-pointer")}
        >
          {roleOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-muted-foreground">
          Mensaje
        </span>
        <textarea
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          className={cn(inputClass, "min-h-[120px] resize-y")}
        />
      </label>
      <Button type="submit" className="w-full">
        Enviar
      </Button>
    </form>
  );
}
