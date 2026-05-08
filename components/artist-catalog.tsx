"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  ALPHABET_LETTERS,
  artistFullName,
  artistInitials,
  lastNameIndexLetter,
  matchesArtistQuery,
} from "@/lib/artist-utils";
import type { Artist } from "@/lib/types/artist";
import { cn } from "@/lib/utils";

function artistIndexLetter(artist: Artist): string {
  return lastNameIndexLetter(artist.lastName || artist.firstName);
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
  /** Valor actual del query param `search` cuando el catálogo depende de la URL. */
  searchValue?: string;
  /** Letra activa del query param `letra` cuando el catálogo depende de la URL. */
  selectedLetter?: string | null;
  /** Letras disponibles desde API; si se proveen, el catálogo usa modo URL/API. */
  availableLetters?: string[];
};

export function ArtistCatalog({
  title,
  artists,
  basePath,
  nameClassName,
  searchInputClassName,
  searchValue = "",
  selectedLetter = null,
  availableLetters,
}: ArtistCatalogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isUrlDriven = Array.isArray(availableLetters);
  const [letter, setLetter] = useState<string | null>(selectedLetter);
  const [search, setSearch] = useState(searchValue);

  useEffect(() => {
    if (!isUrlDriven) return;
    const trimmed = search.trim();
    const committed = searchValue.trim();
    if (trimmed === committed) return;

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (letter) params.set("letra", letter.toLowerCase());
      if (trimmed) params.set("search", trimmed);
      const qs = params.toString();

      startTransition(() => {
        router.replace(
          qs ? `${basePath}/artistas?${qs}` : `${basePath}/artistas`,
          { scroll: false },
        );
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [basePath, isUrlDriven, letter, router, search, searchValue]);

  const byLetter = useMemo(() => {
    if (isUrlDriven) return artists;
    if (letter === null) return artists;
    return artists.filter((a) => artistIndexLetter(a) === letter);
  }, [artists, isUrlDriven, letter]);

  const filtered = useMemo(() => {
    if (isUrlDriven) return byLetter;
    return byLetter.filter((a) => matchesArtistQuery(a, search));
  }, [byLetter, isUrlDriven, search]);

  const countsByLetter = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of artists) {
      const L = artistIndexLetter(a);
      if (L === "#") continue;
      m.set(L, (m.get(L) ?? 0) + 1);
    }
    return m;
  }, [artists]);

  const visibleLetters = useMemo(() => {
    if (isUrlDriven) return availableLetters ?? [];
    return ALPHABET_LETTERS;
  }, [availableLetters, isUrlDriven]);

  function navigateWith(nextLetter: string | null) {
    const params = new URLSearchParams();
    const trimmed = search.trim();
    if (nextLetter) params.set("letra", nextLetter.toLowerCase());
    if (trimmed) params.set("search", trimmed);
    const qs = params.toString();

    setLetter(nextLetter);
    startTransition(() => {
      router.replace(qs ? `${basePath}/artistas?${qs}` : `${basePath}/artistas`, {
        scroll: false,
      });
    });
  }

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
            onClick={() => (isUrlDriven ? navigateWith(null) : setLetter(null))}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
              letter === null
                ? "border-foreground bg-foreground text-background"
                : "border-border/80 bg-muted/50 text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
            )}
          >
            Todos
          </button>
          {visibleLetters.map((L) => {
            const count = countsByLetter.get(L) ?? 0;
            const disabled = isUrlDriven ? false : count === 0;
            const active = letter === L;
            return (
              <button
                key={L}
                type="button"
                disabled={disabled}
                onClick={() =>
                  !disabled && (isUrlDriven ? navigateWith(L) : setLetter(L))
                }
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
        <p
          className={cn(
            "text-sm text-muted-foreground",
            isPending && "opacity-70 transition-opacity",
          )}
        >
          {isUrlDriven
            ? search.trim()
              ? "Ningún artista coincide con tu búsqueda."
              : letter
                ? "No hay artistas con esta letra."
                : "No hay artistas disponibles."
            : byLetter.length === 0
              ? "No hay artistas con esta letra."
              : "Ningún artista coincide con tu búsqueda."}
        </p>
      ) : (
        <ul
          className={cn(
            "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-4",
            isPending && "opacity-70 transition-opacity",
          )}
        >
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
                      alt={`Retrato de ${artistFullName(artist)}`}
                      fill
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
                    {artistFullName(artist)}
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
