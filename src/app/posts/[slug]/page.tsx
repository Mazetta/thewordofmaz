import { getPostFromNotion, getWordCount, fetchPublishedPosts, Post } from "@/lib/notion";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { ResolvingMetadata } from "next";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime } from "@/lib/utils";
import { components } from "@/components/mdx-component";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { fr } from "date-fns/locale";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// 🔹 Génération des slugs statiques pour toutes les pages publiées
export async function generateStaticParams() {
  const rawPosts = await fetchPublishedPosts(); // récupère toutes les pages publiées
  const postsWithNulls = await Promise.all(
    rawPosts.map((p) => getPostFromNotion(p.id))
  );
  const posts: Post[] = postsWithNulls.filter((p): p is Post => p !== null);

  // 🔹 On crée un slug "lisible" à partir du titre
  return posts.map((post) => ({
    slug: post.slug, // assure-toi que post.slug est déjà un slug URL-friendly
  }));
}

// 🔹 Génération des métadonnées SEO
export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostFromNotion(slug); // 🔹 récupération par slug

  if (!post) {
    return { title: "Erreur 404, Post Introuvable" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mazeriio.net/";

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${siteUrl}/posts/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${siteUrl}/posts/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      authors: post.author ? [post.author] : [],
      tags: post.tags,
      images: [{ url: post.coverImage || `${siteUrl}/mushroom-128.png`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [{ url: post.coverImage || `${siteUrl}/mushroom-128.png`, alt: post.title }],
    },
  };
}

// 🔹 Page principale
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  // 🔹 Récupération du post depuis Notion par slug
  const post = await getPostFromNotion(slug);

  // 🔹 Si le post n'existe pas, renvoie 404
  if (!post) {
    notFound();
  }

  const wordCount = post.content ? getWordCount(post.content) : 0;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mazeriio.net/";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage || `${siteUrl}/mushroom-128.png`,
    datePublished: new Date(post.date).toISOString(),
    author: { "@type": "Person", name: post.author || "Guest Author" },
    publisher: { "@type": "Organization", name: "Your Site Name", logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/posts/${post.slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto prose dark:prose-invert">
        {post.coverImage && (
          <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <header className="mb-8">
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <time>{format(new Date(post.date), "dd MMMM yyyy", { locale: fr })}</time>
            {post.author && <span>Par {post.author}</span>}
            <span>{calculateReadingTime(wordCount)}</span>
            <span>{wordCount} {wordCount === 1 ? 'mot' : 'mots'}</span>
          </div>

          <h1 className="text-4xl font-bold mb-4 text-foreground">{post.title}</h1>

          <div className="flex gap-4 mb-4">
            {post.category && <Badge variant="secondary">{post.category}</Badge>}
            {post.tags?.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
          </div>
        </header>

        <div className="max-w-none">
          <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
}

// 🔥 ISR : régénère toutes les 60 secondes
export const revalidate = 60;
// 