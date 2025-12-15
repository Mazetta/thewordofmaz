'use client';

import PostCard from "@/components/post-card";
import { Post } from "@/lib/post.types";
import { useLocale } from "@/lib/locale-context";

interface SearchResultsProps {
  query: string;
  allPosts: Post[];
}

export function SearchResults({ query, allPosts }: SearchResultsProps) {
  const { locale } = useLocale();
  
  const queryLower = query.toLowerCase();
  const filteredPosts = allPosts.filter((post) => {
    // Filtrer d'abord par locale
    if (post.locale !== locale) return false;
    
    // Puis par recherche
    const titleMatch = post.title.toLowerCase().includes(queryLower);
    const descriptionMatch = post.description.toLowerCase().includes(queryLower);
    const contentMatch = post.content.toLowerCase().includes(queryLower);
    const tagsMatch = post.tags?.some(tag => tag.toLowerCase().includes(queryLower));
    
    return titleMatch || descriptionMatch || contentMatch || tagsMatch;
  });

  if (filteredPosts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
          {locale === 'fr' ? 'Aucun résultat' : 'No results'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {locale === 'fr' ? 'Essayez une autre recherche ou explorez tous les posts.' : 'Try another search or explore all posts.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
          {locale === 'fr' ? 'Résultats de recherche' : 'Search results'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {locale === 'fr' 
            ? `${filteredPosts.length} résultat${filteredPosts.length > 1 ? 's' : ''} pour "${query}"`
            : `${filteredPosts.length} result${filteredPosts.length > 1 ? 's' : ''} for "${query}"`
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} />
        ))}
      </div>
    </div>
  );
}
