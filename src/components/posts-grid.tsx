'use client';

import PostCard from "@/components/post-card";
import { Post } from "@/lib/post.types";
import { useLocale } from "@/lib/locale-context";

interface PostsGridProps {
  posts: Post[];
}

export function PostsGrid({ posts }: PostsGridProps) {
  const { locale } = useLocale();
  
  const filteredPosts = posts.filter(post => post.locale === locale);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} />
        ))
      ) : (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          <p>{locale === 'fr' ? 'Aucun article trouvé' : 'No posts found'}</p>
        </div>
      )}
    </div>
  );
}
