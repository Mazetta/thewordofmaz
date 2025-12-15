'use server';

import { getTranslatedPostAction } from '@/lib/notion';

export async function fetchTranslatedPost(translationId: string, targetLocale: 'fr' | 'en') {
  return getTranslatedPostAction(translationId, targetLocale);
}
