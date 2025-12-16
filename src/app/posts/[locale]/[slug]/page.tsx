import { getAllPosts, getPostBySlugAndLocale, getWordCount } from "@/lib/notion";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { ResolvingMetadata } from "next";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime, stripHtmlTags } from "@/lib/utils";
import { components } from "@/components/mdx-component";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { fr, enUS } from "date-fns/locale";
import ShareSection from "@/components/ui/share-section";
import GiscusComments from "@/components/giscus-comments";
import NavButtons from "@/components/nav-buttons";

interface PostPageProps {
  params: Promise<{ locale: "fr" | "en"; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({ locale: post.locale, slug: post.slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getPostBySlugAndLocale(slug, locale);

  if (!post) {
    return {
      title: locale === "fr" ? "Erreur 404, Post Introuvable" : "Error 404, Post Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mazeriio.net/";
  const cleanDescription = stripHtmlTags(post.description);

  return {
    title: post.title,
    description: cleanDescription,
    alternates: {
      canonical: `${siteUrl}/posts/${locale}/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: cleanDescription,
      type: "article",
      url: `${siteUrl}/posts/${locale}/${post.slug}`,
      siteName: "The Word of Maz",
      publishedTime: new Date(post.date).toISOString(),
      authors: post.author ? [post.author] : [],
      tags: post.tags,
      images: [
        {
          url: post.coverImage || `${siteUrl}/mushroom-128.png`,
          ...(post.coverImage
            ? { width: 1200, height: 630 }
            : { width: 128, height: 128 }),
          alt: post.coverImage ? post.title : "The Word of Maz",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: cleanDescription,
      images: [
        {
          url: post.coverImage || `${siteUrl}/mushroom-128.png`,
          alt: post.coverImage ? post.title : "The Word of Maz",
        },
      ],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, locale } = await params;
  const post = await getPostBySlugAndLocale(slug, locale);
  const allPosts = await getAllPosts();
  const wordCount = post?.content ? getWordCount(post.content) : 0;

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mazeriio.net/";
  const dateLocale = locale === "fr" ? fr : enUS;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage || `${siteUrl}/mushroom-128.png`,
    datePublished: new Date(post.date).toISOString(),
    author: {
      "@type": "Person",
      name: post.author || "Guest Author",
    },
    publisher: {
      "@type": "Organization",
      name: "Your Site Name",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/posts/${locale}/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto prose dark:prose-invert">

        <header className="mb-8">
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <time>{format(new Date(post.date), "dd MMMM yyyy", { locale: dateLocale })}</time>
            {post.author && <span>{locale === "fr" ? "Par" : "By"} {post.author}</span>}
            <span>{calculateReadingTime(wordCount)}</span>
            <span>{wordCount} {wordCount === 1 ? (locale === "fr" ? "mot" : "word") : (locale === "fr" ? "mots" : "words")}</span>
          </div>

          <h1 className="text-4xl font-bold mb-4 text-foreground">
            {post.title}
          </h1>

          {post.coverImage && (
            <div
              className="
                relative not-prose w-full mb-4 overflow-hidden rounded-2xl
                aspect-[5/2] 
              "
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          )}

          <div className="flex gap-4 mb-4">
            {post.category && (
              <Badge variant="secondary">{post.category}</Badge>
            )}
            {post.tags &&
              post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
          </div>
        </header>

        <ShareSection title={post.title} url={`${siteUrl}/posts/${locale}/${post.slug}`} />

        <div className="max-w-none mb-8">
          <ReactMarkdown
            components={components}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <NavButtons 
          currentSlug={post.slug} 
          allPosts={allPosts.filter(p => p.locale === locale).map(p => ({ slug: p.slug, title: p.title }))}
          locale={locale}
        />

        <GiscusComments locale={locale} />

      </article>
    </>
  );
}

export const revalidate = 60;
