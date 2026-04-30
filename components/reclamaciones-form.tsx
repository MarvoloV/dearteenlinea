"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";

const DOC_TYPES = [
  { value: "", label: "Seleccione" },
  { value: "dni", label: "DNI" },
  { value: "ce", label: "Carné de extranjería" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "ruc", label: "RUC" },
] as const;

export function ReclamacionesForm({ className }: { className?: string }) {
  const [sent, setSent] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [tipoDoc, setTipoDoc] = useState("");
  const [numDoc, setNumDoc] = useState("");
  const [direccion, setDireccion] = useState("");
  const [pedido, setPedido] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [copiaEmail, setCopiaEmail] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const reset = () => {
    setSent(false);
    setNombre("");
    setApellidos("");
    setTelefono("");
    setEmail("");
    setTipoDoc("");
    setNumDoc("");
    setDireccion("");
    setPedido("");
    setObservaciones("");
    setCopiaEmail(false);
  };

  if (sent) {
    return (
      <div className={cn("rounded-xl border border-border/70 bg-muted/20 p-6", className)}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Hemos registrado tu reclamación (demo: no se envía a ningún servidor).
        </p>
        <Button type="button" variant="outline" className="mt-4 w-full" onClick={reset}>
          Nueva reclamación
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <p className="text-xs text-muted-foreground">
        Los campos marcados con * son obligatorios.
      </p>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-sm font-medium text-foreground">
          Identificación del consumidor reclamante
        </legend>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Nombre(s) <span className="text-destructive">*</span>
          </span>
          <input
            type="text"
            name="nombre"
            required
            autoComplete="given-name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Apellidos <span className="text-destructive">*</span>
          </span>
          <input
            type="text"
            name="apellidos"
            required
            autoComplete="family-name"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Teléfono</span>
          <input
            type="tel"
            name="telefono"
            autoComplete="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Correo electrónico <span className="text-destructive">*</span>
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Tipo de documento <span className="text-destructive">*</span>
          </span>
          <select
            name="tipoDocumento"
            required
            value={tipoDoc}
            onChange={(e) => setTipoDoc(e.target.value)}
            className={inputClass}
          >
            {DOC_TYPES.map((o) => (
              <option key={o.value || "empty"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            N° documento <span className="text-destructive">*</span>
          </span>
          <input
            type="text"
            name="numeroDocumento"
            required
            value={numDoc}
            onChange={(e) => setNumDoc(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Dirección</span>
          <input
            type="text"
            name="direccion"
            autoComplete="street-address"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className={inputClass}
          />
        </label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-sm font-medium text-foreground">
          Detalle de la reclamación y pedido del consumidor
        </legend>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Pedido del consumidor <span className="text-destructive">*</span>
          </span>
          <textarea
            name="pedido"
            required
            rows={4}
            value={pedido}
            onChange={(e) => setPedido(e.target.value)}
            className={cn(inputClass, "min-h-[5rem] resize-y")}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Observaciones o acciones del proveedor{" "}
            <span className="text-destructive">*</span>
          </span>
          <textarea
            name="observaciones"
            required
            rows={4}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className={cn(inputClass, "min-h-[5rem] resize-y")}
          />
        </label>
      </fieldset>

      <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="copiaEmail"
          checked={copiaEmail}
          onChange={(e) => setCopiaEmail(e.target.checked)}
          className="mt-1 size-4 shrink-0 rounded border-input"
        />
        <span>Enviarme una copia por correo electrónico.</span>
      </label>

      <Button type="submit" className="w-full sm:w-auto">
        Enviar reclamación
      </Button>
    </form>
  );
}
