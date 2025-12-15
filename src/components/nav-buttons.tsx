'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/use-translations';

interface Post {
  slug: string;
  title: string;
}

interface NavButtonsProps {
  currentSlug: string;
  allPosts: Post[];
  locale?: 'fr' | 'en';
}

const NavButtons = ({ currentSlug, allPosts, locale = 'fr' }: NavButtonsProps) => {
  const { t } = useTranslations();
  const currentIndex = allPosts.findIndex((p) => p.slug === currentSlug);
  
  const previousPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mb-8 pb-6 border-b border-border font-medium">
      {previousPost ? (
        <Link 
          href={`/posts/${locale}/${previousPost.slug}`}
          className="text-muted-foreground hover:text-foreground transition-colors no-underline"
        >
          ← {t('previousPost')}
        </Link>
      ) : (
        <div />
      )}
      
      {nextPost && (
        <Link 
          href={`/posts/${locale}/${nextPost.slug}`}
          className="text-muted-foreground hover:text-foreground transition-colors no-underline"
        >
          {t('nextPost')} →
        </Link>
      )}
    </div>
  );
};

export default NavButtons;
