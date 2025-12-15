'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'fr' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

function detectLocaleFromBrowser(): Locale {
  // Vérifier localStorage d'abord
  const savedLocale = localStorage.getItem('locale') as Locale | null;
  if (savedLocale) {
    return savedLocale;
  }

  // Détecter à partir du navigateur
  if (typeof navigator === 'undefined') {
    return 'fr'; // Fallback côté serveur
  }

  const browserLocale = navigator.language || navigator.languages?.[0] || 'fr';
  
  // Supporter les variantes: en-US, en-GB, en-*, etc.
  if (browserLocale.startsWith('en')) {
    return 'en';
  }
  
  // Supporter les variantes: fr-FR, fr-CA, fr-*, etc.
  if (browserLocale.startsWith('fr')) {
    return 'fr';
  }
  
  // Fallback par défaut
  return 'fr';
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const detectedLocale = detectLocaleFromBrowser();
    setLocaleState(detectedLocale);
    // Sauvegarder dans localStorage si pas déjà présent
    if (!localStorage.getItem('locale')) {
      localStorage.setItem('locale', detectedLocale);
    }
    setIsMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
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
