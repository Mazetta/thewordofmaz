'use client';

import { useTranslations } from '@/lib/use-translations';

export function HomeHeader() {
  const { t } = useTranslations();

  return (
    <div className="max-w-2xl mx-auto text-center mb-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-2">
        {t('title').trim()}
      </h1>
      <p className="text-lg text-muted-foreground">
        {t('subtitle').trim()}
      </p>
    </div>
  );
}
