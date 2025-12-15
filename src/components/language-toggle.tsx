'use client';

import { useLocale } from '@/lib/locale-context';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchTranslatedPost, fetchCurrentPost } from '@/app/actions';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isLoading, setIsLoading] = useState(false);
  const [translationId, setTranslationId] = useState<string | null>(null);

  // Charger le translationId du post actuel si on est sur une page de post
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'posts' && (segments[1] === 'fr' || segments[1] === 'en') && segments[2]) {
      const slug = segments[2];
      const currentLocale = segments[1] as 'fr' | 'en';
      
      console.log(`[LanguageToggle] Fetching post: ${slug}, locale: ${currentLocale}`);
      fetchCurrentPost(slug, currentLocale).then(post => {
        console.log(`[LanguageToggle] Got post:`, post);
        if (post?.translationId) {
          console.log(`[LanguageToggle] Setting translationId: ${post.translationId}`);
          setTranslationId(post.translationId);
        }
      });
    } else {
      // Remettre translationId à null si on n'est pas sur une page de post
      console.log(`[LanguageToggle] Not on a post page, resetting translationId`);
      setTranslationId(null);
    }
  }, [pathname]);

  const handleLocaleChange = async (newLocale: 'fr' | 'en') => {
    // Si on clique sur la même langue, ne rien faire
    console.log(`[LanguageToggle] Clicked on ${newLocale}, current locale: ${locale}`);
    if (newLocale === locale) {
      console.log(`[LanguageToggle] Same locale, returning`);
      return;
    }

    setLocale(newLocale);
    setIsLoading(true);

    try {
      // Si on est sur un post et qu'on a une traduction disponible
      if (translationId) {
        console.log(`[LanguageToggle] Fetching translation for ID: ${translationId}, locale: ${newLocale}`);
        const translatedPost = await fetchTranslatedPost(translationId, newLocale);
        console.log(`[LanguageToggle] Translation result:`, translatedPost);
        if (translatedPost) {
          console.log(`[LanguageToggle] Navigating to /posts/${newLocale}/${translatedPost.slug}`);
          router.push(`/posts/${newLocale}/${translatedPost.slug}`);
          setIsLoading(false);
          return;
        }
      } else {
        console.log(`[LanguageToggle] No translationId found, using fallback`);
      }

      // Fallback: construire le nouveau chemin avec la nouvelle locale
      const segments = pathname.split('/').filter(Boolean);
      
      if (segments[0] === 'posts' && (segments[1] === 'fr' || segments[1] === 'en')) {
        // Remplacer la locale dans le chemin /posts/[locale]/[slug]
        segments[1] = newLocale;
        router.push('/' + segments.join('/'));
      } else if (segments[0] === 'fr' || segments[0] === 'en') {
        // Remplacer la locale à la racine
        segments[0] = newLocale;
        router.push('/' + segments.join('/'));
      } else {
        // Pas de locale spécifique, juste rediriger à la racine
        router.push('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full cursor-pointer transition-all border outline-none",
            isDark
              ? "bg-zinc-950 border-zinc-800 hover:bg-zinc-900"
              : "bg-white border-zinc-200 hover:bg-zinc-100",
            isLoading && "opacity-50"
          )}
          role="button"
          tabIndex={0}
          aria-label="Changer la langue"
        >
          <Globe className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLocaleChange('fr')}
          className={locale === 'fr' ? 'font-bold' : ''}
          disabled={isLoading}
        >
          Français
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLocaleChange('en')}
          className={locale === 'en' ? 'font-bold' : ''}
          disabled={isLoading}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
