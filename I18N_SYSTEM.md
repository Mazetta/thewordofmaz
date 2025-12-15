# Système de Traduction i18n

## Overview
Un système de traduction simple a été implémenté pour supporter le français et l'anglais.

## Changements Principaux

### 1. **Structure des Posts (Notion)**
- Ajout d'une propriété `locale` à l'interface `Post` (`"fr" | "en"`)
- La propriété `locale` est extraite depuis la base de données Notion (propriété `Locale` en tant que select)
- Chaque post doit avoir une propriété `Locale` dans Notion configurée en tant que "Français" ou "English"

### 2. **Routes des Posts**
- **Ancien**: `/posts/[slug]`
- **Nouveau**: `/posts/[locale]/[slug]`
  - Exemple: `/posts/fr/mon-article` ou `/posts/en/my-article`
- Les posts sont générés statiquement pour chaque locale disponible

### 3. **Context et Hook pour la Locale**
#### Fichier: `src/lib/locale-context.tsx`
- `LocaleProvider`: Composant fournisseur React Context
  - Gère la locale actuelle (stockée dans localStorage)
  - Détecte la langue du navigateur au premier chargement
  - Stocke les préférences de l'utilisateur

- `useLocale()`: Hook personnalisé
  - Accès à la locale actuelle et fonction pour la modifier
  - Utilisé dans les composants client ('use client')

### 4. **Toggle de Langue**
#### Fichier: `src/components/language-toggle.tsx`
- Composant client affichant un menu déroulant avec les langues disponibles
- Positionné dans le header (navigation)
- Redirige l'utilisateur vers la même page dans la nouvelle langue
- Marque la langue actuelle comme active dans le menu

### 5. **Filtrage par Locale**
#### Composants:
- `PostsGrid` (`src/components/posts-grid.tsx`): Filtre les posts par locale actuelle
- `SearchResults` (`src/components/search-results.tsx`): Filtre les résultats de recherche par locale
- Page d'accueil `/`: Affiche uniquement les posts de la locale sélectionnée

### 6. **Navigation et URLs**
- Les liens PostCard incluent la locale: `/posts/{locale}/{slug}`
- Les URLs dans le sitemap et RSS incluent la locale
- La page de recherche filtre par locale

## Architecture des Fichiers

```
src/
├── lib/
│   ├── locale-context.tsx       # Context et hook pour la locale
│   ├── post.types.ts            # Interface Post (types purs)
│   ├── notion.ts                # Logique Notion (serveur)
│   └── utils.ts                 # Utilitaires (getWordCount, etc)
│
├── components/
│   ├── language-toggle.tsx      # Toggle de langue
│   ├── posts-grid.tsx           # Grille de posts avec filtrage
│   ├── search-results.tsx       # Résultats de recherche avec filtrage
│   ├── post-card.tsx            # Carte de post (mise à jour)
│   ├── layout.tsx               # Layout principal avec toggle
│
├── app/
│   ├── posts/
│   │   └── [locale]/
│   │       └── [slug]/
│   │           └── page.tsx     # Page du post (nouvelle structure)
│   ├── page.tsx                 # Page d'accueil avec PostsGrid
│   ├── search/
│   │   └── page.tsx             # Page de recherche avec SearchResults
│   ├── layout.tsx               # RootLayout avec LocaleProvider
│   ├── sitemap.ts               # Sitemap avec locales
│   └── rss.xml/
│       └── route.ts             # RSS avec locales
```

## Workflow Utilisateur

1. **Premier accès**:
   - La locale est détectée à partir de la langue du navigateur (par défaut "fr")
   - Stockée dans localStorage

2. **Changement de langue**:
   - Clic sur le toggle de langue dans le header
   - Sélection de la nouvelle langue
   - Redirection vers la même page dans la nouvelle locale
   - Mise à jour de localStorage

3. **Navigation**:
   - La page d'accueil affiche les posts de la locale sélectionnée
   - La recherche filtre par locale
   - Les liens de navigation incluent la locale dans l'URL

## Configuration Notion

Assurez-vous que votre base de données Notion a une propriété `Locale` de type "Select" avec les options:
- "Français" (valeur mappée à "fr")
- "English" (valeur mappée à "en")

## Exemple d'Utilisation dans les Composants

```tsx
'use client';

import { useLocale } from '@/lib/locale-context';

export function MyComponent() {
  const { locale, setLocale } = useLocale();
  
  return (
    <div>
      Locale actuelle: {locale}
      <button onClick={() => setLocale('en')}>Anglais</button>
      <button onClick={() => setLocale('fr')}>Français</button>
    </div>
  );
}
```

## Points d'Attention

- Les composants qui utilisent `useLocale()` doivent être marqués `'use client'`
- L'interface `Post` est importée depuis `post.types.ts` pour éviter les imports côté client de modules serveur (fs, path)
- Le changement de locale redirige automatiquement vers le bon chemin
- La recherche et l'affichage des posts se font automatiquement par locale

## Améliorations Futures

- [ ] Support de plus de langues
- [ ] Traduction de l'interface utilisateur (UI i18n)
- [ ] Cookies pour persister la préférence de langue
- [ ] Redirection automatique basée sur Accept-Language header côté serveur
