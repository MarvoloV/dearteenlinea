"use client";

import type { ChangeEvent } from "react";

import {
  priceSliderDomainMax,
  priceSliderDomainMin,
  priceSliderStep,
} from "@/lib/artwork-taxonomy";
import { cn } from "@/lib/utils";

function formatUsd(n: number): string {
  return `USD ${n.toLocaleString("es-ES", { maximumFractionDigits: 0 })}`;
}

type PriceRangeSliderProps = {
  idSuffix: "m" | "d";
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  className?: string;
  labelClassName?: string;
};

const rangeInputBase =
  "pointer-events-none absolute inset-x-0 top-1/2 h-8 w-full -translate-y-1/2 appearance-none bg-transparent " +
  "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent " +
  "[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent";

const rangeThumb =
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:mt-[-6px] " +
  "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-foreground " +
  "[&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:active:cursor-grabbing " +
  "[&::-webkit-slider-thumb]:focus-visible:outline-none [&::-webkit-slider-thumb]:focus-visible:ring-2 [&::-webkit-slider-thumb]:focus-visible:ring-ring/40 " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:appearance-none " +
  "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-foreground " +
  "[&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:active:cursor-grabbing";

/** Slider de rango USD (dos thumbs) sobre un dominio fijo. */
export function PriceRangeSlider({
  idSuffix,
  valueMin,
  valueMax,
  onChange,
  className,
  labelClassName,
}: PriceRangeSliderProps) {
  const domainMin = priceSliderDomainMin;
  const domainMax = priceSliderDomainMax;
  const step = priceSliderStep;

  const pct = (v: number) =>
    ((v - domainMin) / (domainMax - domainMin)) * 100;

  const handleMin = (e: ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    const capped = Math.min(v, valueMax - step);
    onChange(Math.max(domainMin, capped), valueMax);
  };

  const handleMax = (e: ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    const capped = Math.max(v, valueMin + step);
    onChange(valueMin, Math.min(domainMax, capped));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <p
        className={cn(
          "text-xs tabular-nums leading-snug text-muted-foreground",
          labelClassName,
        )}
      >
        {formatUsd(valueMin)} — {formatUsd(valueMax)}
      </p>
      <div className="relative h-10 px-0.5">
        <div
          className="pointer-events-none absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-foreground/30"
          style={{
            left: `${pct(valueMin)}%`,
            width: `${Math.max(0, pct(valueMax) - pct(valueMin))}%`,
          }}
          aria-hidden
        />
        <input
          id={`price-range-min-${idSuffix}`}
          type="range"
          min={domainMin}
          max={domainMax}
          step={step}
          value={valueMin}
          onChange={handleMin}
          aria-label="Precio mínimo en dólares"
          className={cn(rangeInputBase, rangeThumb, "z-10")}
        />
        <input
          id={`price-range-max-${idSuffix}`}
          type="range"
          min={domainMin}
          max={domainMax}
          step={step}
          value={valueMax}
          onChange={handleMax}
          aria-label="Precio máximo en dólares"
          className={cn(rangeInputBase, rangeThumb, "z-20")}
        />
      </div>
    </div>
  );
}
