import { useEffect, useRef, useState } from "react";

import { searchDearteenlinea } from "@/services/search/dearte-search.service";
import { searchQullqaGallery } from "@/services/search/qullqa-search.service";
import type { GlobalSearchResult, SearchContext } from "@/types/search";

const EMPTY_RESULTS: GlobalSearchResult = {
  artists: [],
  artworks: [],
};

type UseGlobalSearchArgs = {
  context: SearchContext;
  query: string;
  debounceMs?: number;
  minLength?: number;
};

type UseGlobalSearchResult = {
  results: GlobalSearchResult;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  searchedQuery: string;
};

async function searchByContext(
  context: SearchContext,
  query: string,
  signal: AbortSignal,
): Promise<GlobalSearchResult> {
  if (context === "dearteenlinea") {
    return searchDearteenlinea(query, signal);
  }

  return searchQullqaGallery(query, signal);
}

export function useGlobalSearch({
  context,
  query,
  debounceMs = 350,
  minLength = 2,
}: UseGlobalSearchArgs): UseGlobalSearchResult {
  const requestIdRef = useRef(0);
  const [results, setResults] = useState<GlobalSearchResult>(EMPTY_RESULTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState("");
  const cleanQuery = query.trim();
  const isSearchable = cleanQuery.length >= minLength;

  useEffect(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (!isSearchable) {
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      setResults(EMPTY_RESULTS);
      setIsLoading(true);
      setError(null);
      setHasSearched(false);
      setSearchedQuery(cleanQuery);

      searchByContext(context, cleanQuery, controller.signal)
        .then((nextResults) => {
          if (controller.signal.aborted || requestId !== requestIdRef.current) {
            return;
          }
          setResults(nextResults);
          setError(null);
          setHasSearched(true);
        })
        .catch(() => {
          if (controller.signal.aborted || requestId !== requestIdRef.current) {
            return;
          }
          setResults(EMPTY_RESULTS);
          setError("No pudimos cargar resultados. Inténtalo nuevamente.");
          setHasSearched(true);
        })
        .finally(() => {
          if (controller.signal.aborted || requestId !== requestIdRef.current) {
            return;
          }
          setIsLoading(false);
        });
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [cleanQuery, context, debounceMs, isSearchable]);

  if (!isSearchable) {
    return {
      results: EMPTY_RESULTS,
      isLoading: false,
      error: null,
      hasSearched: false,
      searchedQuery: "",
    };
  }

  const isCurrentQuery = searchedQuery === cleanQuery;

  return {
    results: isCurrentQuery ? results : EMPTY_RESULTS,
    isLoading: isLoading || !isCurrentQuery,
    error: isCurrentQuery ? error : null,
    hasSearched: isCurrentQuery ? hasSearched : false,
    searchedQuery,
  };
}
