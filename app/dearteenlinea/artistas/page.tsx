import { ArtistCatalog } from "@/components/artist-catalog";
import { FlowHeader } from "@/components/flow-header";
import { lastNameIndexLetter } from "@/lib/artist-utils";
import {
  fetchDearteenlineaArtistLetters,
  fetchDearteenlineaArtists,
} from "@/lib/dearteenlinea-api";
import { mockArtistsDearteenlinea } from "@/lib/mock-artists";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function fallbackLetters(): string[] {
  const letters = mockArtistsDearteenlinea
    .map((artist) => lastNameIndexLetter(artist.lastName || artist.firstName))
    .filter((letter) => /[A-Z]/.test(letter));

  return [...new Set(letters)];
}

export default async function DearteenlineaArtistasPage({
  searchParams,
}: PageProps) {
  const sp = await searchParams;
  const rawSearch = firstParam(sp.search)?.trim() ?? "";
  const rawLetter = firstParam(sp.letra)?.trim().slice(0, 1) ?? "";
  const selectedLetter = /^[A-Za-z]$/.test(rawLetter)
    ? rawLetter.toUpperCase()
    : null;

  const [artistsResult, lettersResult] = await Promise.all([
    fetchDearteenlineaArtists({
      letra: selectedLetter?.toLowerCase(),
      search: rawSearch,
    }),
    fetchDearteenlineaArtistLetters(),
  ]);

  const artists = artistsResult.ok ? artistsResult.data : mockArtistsDearteenlinea;
  const availableLetters = lettersResult.ok ? lettersResult.data : fallbackLetters();

  return (
    <>
      <FlowHeader variant="dearteenlinea" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <ArtistCatalog
            key={`dearteenlinea-${selectedLetter ?? "all"}-${rawSearch}`}
            title={
              <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                Artistas curados
              </h1>
            }
            artists={artists}
            basePath="/dearteenlinea"
            searchValue={rawSearch}
            selectedLetter={selectedLetter}
            availableLetters={availableLetters}
          />
        </div>
      </main>
    </>
  );
}
