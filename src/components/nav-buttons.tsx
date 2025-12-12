'use client';

import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
}

interface NavButtonsProps {
  currentSlug: string;
  allPosts: Post[];
}

const NavButtons = ({ currentSlug, allPosts }: NavButtonsProps) => {
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
          href={`/posts/${previousPost.slug}`}
          className="text-muted-foreground"
        >
          ← Post Précédent
        </Link>
      ) : (
        <div />
      )}
      
      {nextPost && (
        <Link 
          href={`/posts/${nextPost.slug}`}
          className="text-muted-foreground"
        >
          Post Suivant →
        </Link>
      )}
    </div>
  );
};

export default NavButtons;
