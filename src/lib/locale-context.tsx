'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'fr' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Récupérer la locale depuis localStorage
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    const browserLocale = navigator.language.startsWith('en') ? 'en' : 'fr';
    setLocaleState(savedLocale || browserLocale);
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {mounted ? children : null}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
