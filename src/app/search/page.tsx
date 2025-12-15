import { getAllPosts } from "@/lib/notion";
import { Suspense } from "react";
import { SearchResults } from "@/components/search-results";
import { translations } from "@/lib/translations";

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
        <Suspense fallback={<div>Chargement...</div>}>
          <SearchResults query={query} allPosts={allPosts} />
        </Suspense>
      ) : (
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            {translations.fr.searchPlaceholder}
          </h1>
          <p className="text-lg text-muted-foreground">
            {translations.fr.searchPrompt}
          </p>
        </div>
      )}
    </div>
  );
}

export const revalidate = 60;
