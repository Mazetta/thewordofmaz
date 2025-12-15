'use client';

import { useLocale } from '@/lib/locale-context';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: 'fr' | 'en') => {
    setLocale(newLocale);
    
    // Construire le nouveau chemin avec la nouvelle locale
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
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Changer la langue</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLocaleChange('fr')}
          className={locale === 'fr' ? 'font-bold' : ''}
        >
          Français
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLocaleChange('en')}
          className={locale === 'en' ? 'font-bold' : ''}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
