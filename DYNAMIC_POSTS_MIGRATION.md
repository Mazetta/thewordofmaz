# Migration vers les posts dynamiques

## 📋 Résumé des changements

Votre site blog a été migré d'un système basé sur le cache statique à un **système dynamique** qui récupère les posts directement depuis Notion. Cela signifie que **plus besoin de rebuild le site à chaque nouveau post** !

## ✨ Avantages

- ✅ **Pas de rebuild requis** : Les nouveaux posts sont visibles immédiatement
- ✅ **Revalidation automatique** : Les pages se mettent à jour tous les 60 secondes (configurable)
- ✅ **Pre-rendering initial** : Les pages sont pré-générées lors du build pour les performances
- ✅ **Fallback dynamique** : Si une page n'existe pas, elle est générée à la demande
- ✅ **SEO optimisé** : Métadonnées dynamiques pour chaque post

## 📝 Fichiers modifiés

### 1. `/src/app/page.tsx` (Page d'accueil)
- Maintenant utilise `getAllPosts()` directement depuis Notion
- Code simplifié et plus maintenable
- Continue à utiliser `revalidate = 60` pour une revalidation toutes les 60 secondes

### 2. `/src/app/posts/[slug]/page.tsx` (Pages individuelles des posts)
- Utilise les nouvelles fonctions `getPostBySlug()` et `getAllPosts()`
- **Nouveau** : Fonction `generateStaticParams()` pour le pre-rendering
- Plus simple et plus performant
- Continue à utiliser `revalidate = 60`

### 3. `/src/lib/notion.ts` (Couche de données)
**Nouvelles fonctions ajoutées** :

```typescript
// Récupère un post par son slug
export async function getPostBySlug(slug: string): Promise<Post | null>

// Récupère tous les posts publiés
export async function getAllPosts(): Promise<Post[]>
```

### 4. `/scripts/cache-posts.ts` (Script de cache)
- Maintenant **optionnel** et n'arrête pas le build
- Le cache est toujours utile pour les optimisations, mais n'est plus obligatoire
- Peut être exécuté manuellement : `pnpm cache:posts`

### 5. `/src/components/post-card.tsx` (Composant de carte)
- Format de date mis à jour pour afficher en français : **"08 déc 2025"** au lieu de **"Dec 8, 2025"**

## 🚀 Fonctionnement

### Build Time
```
Build
├── generateStaticParams() récupère tous les posts de Notion
├── Pré-génère toutes les pages statiques
└── Revalidate défini à 60 secondes
```

### Runtime
```
Request pour /posts/my-post
├── Si page existe en cache (< 60s) → Servir la version en cache
├── Si page existe mais cache expiré → Regenérer en arrière-plan (ISR)
└── Si page n'existe pas → Générer à la demande
```

## ⚙️ Configuration

### Changer l'intervalle de revalidation

Pour mettre à jour plus/moins souvent, modifiez `revalidate` :

```typescript
// Dans /src/app/page.tsx et /src/app/posts/[slug]/page.tsx
export const revalidate = 60; // en secondes
```

Valeurs courantes :
- `revalidate = 10` → Mise à jour toutes les 10 secondes
- `revalidate = 3600` → Mise à jour toutes les heures
- `revalidate = 86400` → Mise à jour une fois par jour
- `revalidate = false` → À la demande seulement (pas de revalidation)

## 🔑 Variables d'environnement requises

```env
NOTION_TOKEN=your_notion_api_token
NOTION_DATABASE_ID=your_database_id
NEXT_PUBLIC_SITE_URL=https://www.mazeriio.net/
```

## 📱 Workflow après migration

### Avant
1. Créer un post dans Notion
2. Exécuter `pnpm cache:posts` pour mettre à jour le cache
3. Redéployer le site

### Après
1. Créer un post dans Notion ✅
2. C'est tout ! Le site se met à jour automatiquement

## 🧪 Test

Pour tester localement :

```bash
# Développement avec hot reload
pnpm dev

# Build et test
pnpm build
pnpm start
```

## 📊 Performance

- **First contentful paint** : Identique (pages pré-générées)
- **Time to interactive** : Amélioré (moins de dépendances au cache)
- **Requêtes Notion** : Optimisées avec `revalidate`
- **Cache Vercel** : Automatique si déployé sur Vercel

## 🔄 Migration Complète

Vous pouvez maintenant :
- ❌ Supprimer le script `cache-posts.ts` du build si vous voulez (optionnel)
- ❌ Supprimer le fichier `posts-cache.json` s'il existe
- ✅ Garder le script et fichier pour la compatibilité

## 📞 Support

Si vous avez des problèmes :
1. Vérifiez que `NOTION_TOKEN` est valide
2. Vérifiez que `NOTION_DATABASE_ID` est correct
3. Vérifiez les logs Vercel pour les erreurs
4. Testez localement avec `pnpm dev`

---

**Dernière mise à jour** : 09/12/2025
