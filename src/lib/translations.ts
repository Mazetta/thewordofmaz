export const translations = {
  fr: {
    // Header & Navigation
    title: "The Word of Maz",
    subtitle: "Je poste (presque) tous les jours",
    
    // Search
    searchPlaceholder: "Rechercher...",
    searchNoResults: "Aucun résultat",
    searchTryAnother: "Essayez une autre recherche ou explorez tous les posts.",
    searchResults: "Résultats de recherche",
    searchResultsFor: (count: number, query: string) => 
      `${count} résultat${count > 1 ? 's' : ''} pour "${query}"`,
    searchPrompt: "Entrez une recherche pour commencer.",
    
    // Home page
    noPostsFound: "Aucun article trouvé",
    sortNewest: "Plus récent",
    sortOldest: "Plus ancien",
    
    // Post page
    by: "Par",
    word: (count: number) => count === 1 ? "mot" : "mots",
    readingTime: "min de lecture",
    
    // Language & Theme
    changeLanguage: "Changer la langue",
    
    // Loading
    loading: "Chargement...",

    //Footer
    footer: "Tous droits réservés.",
    
    // Errors
    error404: "Erreur 404, Post Introuvable",
  },
  
  en: {
    // Header & Navigation
    title: "The Word of Maz",
    subtitle: "I post (almost) every day",
    
    // Search
    searchPlaceholder: "Search...",
    searchNoResults: "No results",
    searchTryAnother: "Try another search or explore all posts.",
    searchResults: "Search results",
    searchResultsFor: (count: number, query: string) => 
      `${count} result${count > 1 ? 's' : ''} for "${query}"`,
    searchPrompt: "Enter a search to get started.",
    
    // Home page
    noPostsFound: "No posts found",
    sortNewest: "Newest",
    sortOldest: "Oldest",
    
    // Post page
    by: "By",
    word: (count: number) => count === 1 ? "word" : "words",
    readingTime: "min read",
    
    // Language & Theme
    changeLanguage: "Change language",
    
    // Loading
    loading: "Loading...",

    //Footer
    footer: "All rights reserved.",
    
    // Errors
    error404: "Error 404, Post Not Found",
  },
} as const;

export type Locale = keyof typeof translations;

export function getTranslation(locale: Locale, key: keyof typeof translations.fr) {
  return translations[locale][key];
}
