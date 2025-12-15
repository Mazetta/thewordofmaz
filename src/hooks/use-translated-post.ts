'use client';

import { Post } from '@/lib/post.types';
import { getTranslatedPost } from '@/lib/notion';
import { useState, useEffect, useCallback } from 'react';

export function useTranslatedPost(currentPost: Post | null) {
  const [translatedPost, setTranslatedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTranslation = useCallback(
    async (targetLocale: 'fr' | 'en'): Promise<Post | null> => {
      if (!currentPost?.translationId) {
        return null;
      }

      setIsLoading(true);
      try {
        const post = await getTranslatedPost(currentPost, targetLocale);
        setTranslatedPost(post);
        return post;
      } finally {
        setIsLoading(false);
      }
    },
    [currentPost]
  );

  return { translatedPost, isLoading, getTranslation };
}
