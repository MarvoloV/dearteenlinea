"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import {
  ALPHABET_LETTERS,
  lastNameIndexLetter,
  matchesArtistSearch,
} from "@/lib/artist-utils";
import type { Artist } from "@/lib/types/artist";
import { cn } from "@/lib/utils";

function artistInitials(firstName: string, lastName: string): string {
  const a = firstName.trim()[0] ?? "";
  const b = lastName.trim()[0] ?? "";
  return `${a}${b}`.toUpperCase() || "?";
}

type ArtistCatalogProps = {
  /** Título de la página (p. ej. un `h1`), alineado con el buscador desde `md`. */
  title: ReactNode;
  artists: Artist[];
  basePath: "/dearteenlinea" | "/qullqa-gallery";
  /** Estilo del nombre (p. ej. Manrope en flujo qullqa). */
  nameClassName?: string;
  /** Clases extra para el input de búsqueda (p. ej. Manrope en qullqa). */
  searchInputClassName?: string;
};

export function ArtistCatalog({
  title,
  artists,
  basePath,
  nameClassName,
  searchInputClassName,
}: ArtistCatalogProps) {
  const [letter, setLetter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const byLetter = useMemo(() => {
    if (letter === null) return artists;
    return artists.filter((a) => lastNameIndexLetter(a.lastName) === letter);
  }, [artists, letter]);

  const filtered = useMemo(() => {
    return byLetter.filter((a) =>
      matchesArtistSearch(a.firstName, a.lastName, search),
    );
  }, [byLetter, search]);

  const countsByLetter = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of artists) {
      const L = lastNameIndexLetter(a.lastName);
      if (L === "#") continue;
      m.set(L, (m.get(L) ?? 0) + 1);
    }
    return m;
  }, [artists]);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="min-w-0 shrink">{title}</div>
        <div className="relative w-full md:max-w-[min(100%,18rem)] md:shrink-0 lg:max-w-xs">
          <label htmlFor="artist-search" className="sr-only">
            Buscar por nombre o apellido
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            id="artist-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o apellido…"
            autoComplete="off"
            className={cn(
              "h-10 w-full rounded-lg border border-border/80 bg-background pl-10 pr-4 text-sm text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
              searchInputClassName,
            )}
          />
        </div>
      </div>

      <div className="relative -mx-1">
        <div className="flex max-w-full gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
          <button
            type="button"
            onClick={() => setLetter(null)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
              letter === null
                ? "border-foreground bg-foreground text-background"
                : "border-border/80 bg-muted/50 text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
            )}
          >
            Todos
          </button>
          {ALPHABET_LETTERS.map((L) => {
            const count = countsByLetter.get(L) ?? 0;
            const disabled = count === 0;
            const active = letter === L;
            return (
              <button
                key={L}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setLetter(L)}
                className={cn(
                  "size-9 shrink-0 rounded-full border text-xs font-medium transition",
                  disabled &&
                    "cursor-not-allowed border-transparent bg-muted/30 text-muted-foreground/40",
                  !disabled && !active && "border-border/80 bg-background hover:border-border",
                  !disabled &&
                    active &&
                    "border-foreground bg-foreground text-background",
                  !disabled &&
                    !active &&
                    "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {L}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {byLetter.length === 0
            ? "No hay artistas con esta letra."
            : "Ningún artista coincide con tu búsqueda."}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-4">
          {filtered.map((artist) => (
            <li key={artist.slug} className="min-w-0">
              <Link
                href={`${basePath}/artistas/${artist.slug}`}
                className="group block overflow-hidden rounded-lg border border-border/80 bg-card transition hover:border-border hover:shadow-sm"
              >
                <div className="relative aspect-[3/4] w-full bg-muted">
                  {artist.imageUrl ? (
                    <Image
                      src={artist.imageUrl}
                      alt={`Retrato de ${artist.firstName} ${artist.lastName}`}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
                      <span className="text-xl font-medium text-muted-foreground sm:text-2xl">
                        {artistInitials(artist.firstName, artist.lastName)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="border-t border-border/60 px-2 py-2 sm:px-2.5">
                  <span
                    className={cn(
                      "block text-xs font-medium leading-snug text-foreground sm:text-[13px]",
                      nameClassName,
                    )}
                  >
                    {artist.firstName} {artist.lastName}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
