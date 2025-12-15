'use client';

import { useTranslations } from '@/lib/use-translations';

export function SearchPrompt() {
  const { t } = useTranslations();

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
        {t('searchPlaceholder')}
      </h1>
      <p className="text-lg text-muted-foreground">
        {t('searchPrompt')}
      </p>
    </div>
  );
}
