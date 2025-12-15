export interface Post {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  description: string;
  date: string;
  content: string;
  author?: string;
  tags?: string[];
  category?: string;
  locale: "fr" | "en";
  translationId?: string; // ID du post traduit associé
}
