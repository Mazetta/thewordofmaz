import { getAllPosts } from "@/lib/notion";
import { PostsGrid } from "@/components/posts-grid";
import { HomeHeader } from "@/components/home-header";
import { SortButtons } from "@/components/sort-buttons";
import { Suspense } from "react";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div>
      <HomeHeader />
      <Suspense fallback={<div className="h-10 mb-4" />}>
        <SortButtons />
        <PostsGrid posts={posts} />
      </Suspense>
    </div>
  );
}

export const revalidate = 60;
