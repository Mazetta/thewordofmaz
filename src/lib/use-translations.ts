'use client';

import { useLocale } from '@/lib/locale-context';
import { translations, type Locale } from '@/lib/translations';

export function useTranslations() {
  const { locale } = useLocale();
  
  const t = (key: keyof typeof translations.fr): string => {
    const translation = translations[locale as Locale][key];
    if (typeof translation === 'function') {
      return translation as unknown as string;
    }
    return translation as string;
  };

  return { t, locale };
}
