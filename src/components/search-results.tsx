'use client';

import PostCard from "@/components/post-card";
import { Post } from "@/lib/post.types";
import { useLocale } from "@/lib/locale-context";
import { useTranslations } from "@/lib/use-translations";

interface SearchResultsProps {
  query: string;
  allPosts: Post[];
}

export function SearchResults({ query, allPosts }: SearchResultsProps) {
  const { locale } = useLocale();
  const { t } = useTranslations();
  
  const queryLower = query.toLowerCase();
  const filteredPosts = allPosts.filter((post) => {
    // Filtrer d'abord par locale
    if (post.locale !== locale) return false;
    
    // Puis par recherche
    const titleMatch = post.title.toLowerCase().includes(queryLower);
    const descriptionMatch = post.description.toLowerCase().includes(queryLower);
    const contentMatch = post.content.toLowerCase().includes(queryLower);
    const tagsMatch = post.tags?.some(tag => tag.toLowerCase().includes(queryLower));
    const slugMatch = post.slug.toLowerCase().includes(queryLower);
    // Aussi chercher dans l'URL complète du post
    const urlMatch = `${post.locale}/${post.slug}`.toLowerCase().includes(queryLower);
    
    return titleMatch || descriptionMatch || contentMatch || tagsMatch || slugMatch || urlMatch;
  });

  if (filteredPosts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
          {t('searchNoResults')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('searchTryAnother')}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
          {t('searchResults')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {typeof t('searchResultsFor') === 'function' 
            ? (t('searchResultsFor') as any)(filteredPosts.length, query)
            : `${filteredPosts.length} results for "${query}"`
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
