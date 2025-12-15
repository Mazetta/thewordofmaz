'use client';

import PostCard from "@/components/post-card";
import { Post } from "@/lib/post.types";
import { useLocale } from "@/lib/locale-context";
import { useTranslations } from "@/lib/use-translations";

interface PostsGridProps {
  posts: Post[];
}

export function PostsGrid({ posts }: PostsGridProps) {
  const { locale } = useLocale();
  const { t } = useTranslations();
  
  const filteredPosts = posts.filter(post => post.locale === locale);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} />
        ))
      ) : (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          <p>{t('noPostsFound')}</p>
        </div>
      )}
    </div>
  );
}
