'use server';

import { getTranslatedPostAction, getPostBySlugAndLocale } from '@/lib/notion';

export async function fetchTranslatedPost(translationId: string, targetLocale: 'fr' | 'en') {
  return getTranslatedPostAction(translationId, targetLocale);
}

export async function fetchCurrentPost(slug: string, locale: 'fr' | 'en') {
  return getPostBySlugAndLocale(slug, locale);
}
