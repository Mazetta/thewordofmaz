'use client';

import PostCard from "@/components/post-card";
import { Post } from "@/lib/post.types";
import { useLocale } from "@/lib/locale-context";
import { useTranslations } from "@/lib/use-translations";
import { useSearchParams } from "next/navigation";

interface PostsGridProps {
  posts: Post[];
}

function PostsGridContent({ posts }: PostsGridProps) {
  const { locale } = useLocale();
  const { t } = useTranslations();
  const searchParams = useSearchParams();
  
  const sort = searchParams.get("sort") || "newest";
  
  let filteredPosts = posts.filter(post => post.locale === locale);
  
  // Sort posts
  filteredPosts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sort === "newest" ? dateB - dateA : dateA - dateB;
  });

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

export function PostsGrid({ posts }: PostsGridProps) {
  return <PostsGridContent posts={posts} />;
}
