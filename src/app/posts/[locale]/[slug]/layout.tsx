import { ReactNode } from "react";
import { getPostBySlugAndLocale } from "@/lib/notion";
import { PostProvider } from "@/lib/post-context";

interface PostLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: "fr" | "en"; slug: string }>;
}

export default async function PostLayout({ children, params }: PostLayoutProps) {
  const { locale, slug } = await params;
  const post = await getPostBySlugAndLocale(slug, locale);

  return (
    <PostProvider post={post}>
      {children}
    </PostProvider>
  );
}
