'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  useEffect(() => {
    // Extraire la locale de l'URL en priorité
    const segments = pathname.split('/').filter(Boolean);
    const urlLocale = (segments[0] === 'fr' || segments[0] === 'en') ? segments[0] : null;
    const postLocale = (segments[0] === 'posts' && (segments[1] === 'fr' || segments[1] === 'en')) ? segments[1] : null;
    
    console.log(`[LocaleContext] pathname: ${pathname}, urlLocale: ${urlLocale}, postLocale: ${postLocale}`);
    
    if (urlLocale || postLocale) {
      const newLocale = (urlLocale || postLocale) as Locale;
      console.log(`[LocaleContext] Setting locale to ${newLocale} from URL`);
      setLocaleState(newLocale);
      localStorage.setItem('locale', newLocale);
    } else {
      // Si pas de locale dans l'URL, utiliser le navigateur
      const detectedLocale = detectLocaleFromBrowser();
      console.log(`[LocaleContext] No locale in URL, detected from browser: ${detectedLocale}`);
      setLocaleState(detectedLocale);
    }
    setIsMounted(true);
  }, [pathname]);

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
