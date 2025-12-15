'use client';

import { useTranslations } from '@/lib/use-translations';

export function SearchFallback() {
  const { t } = useTranslations();

  return <div>{t('loading')}</div>;
}
