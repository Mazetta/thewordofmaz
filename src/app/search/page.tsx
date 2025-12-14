import { getAllPosts } from "@/lib/notion";
import PostCard from "@/components/post-card";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  const allPosts = await getAllPosts();
  
  const queryLower = query.toLowerCase();
  const filteredPosts = allPosts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(queryLower);
    const descriptionMatch = post.description.toLowerCase().includes(queryLower);
    const contentMatch = post.content.toLowerCase().includes(queryLower);
    const tagsMatch = post.tags?.some(tag => tag.toLowerCase().includes(queryLower));
    
    return titleMatch || descriptionMatch || contentMatch || tagsMatch;
  });

  if (filteredPosts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Aucun résultat pour "{query}"
        </h2>
        <p className="text-muted-foreground">
          Essayez une autre recherche ou explorez tous les posts.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full text-center mb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-2">
            Résultats de recherche
          </h1>
          <p className="text-lg text-muted-foreground">
            {filteredPosts.length} résultat{filteredPosts.length > 1 ? 's' : ''} pour "{query}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  return (
    <div>
      {query ? (
        <Suspense fallback={<div>Chargement...</div>}>
          <SearchResults query={query} />
        </Suspense>
      ) : (
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Recherche
          </h1>
          <p className="text-lg text-muted-foreground">
            Entrez une recherche pour commencer.
          </p>
        </div>
      )}
    </div>
  );
}

export const revalidate = 60;
