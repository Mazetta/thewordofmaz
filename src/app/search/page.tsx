import { getAllPosts } from "@/lib/notion";
import { Suspense } from "react";
import { SearchResults } from "@/components/search-results";
import { SearchFallback } from "@/components/search-fallback";
import { SearchPrompt } from "@/components/search-prompt";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const allPosts = await getAllPosts();

  return (
    <div>
      {query ? (
        <Suspense fallback={<SearchFallback />}>
          <SearchResults query={query} allPosts={allPosts} />
        </Suspense>
      ) : (
        <SearchPrompt />
      )}
    </div>
  );
}

export const revalidate = 60;
