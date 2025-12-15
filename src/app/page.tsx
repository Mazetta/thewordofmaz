import { getAllPosts } from "@/lib/notion";
import { PostsGrid } from "@/components/posts-grid";
import { HomeHeader } from "@/components/home-header";
import { SortButtons } from "@/components/sort-buttons";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div>
      <HomeHeader />
      <SortButtons />
      <PostsGrid posts={posts} />
    </div>
  );
}

export const revalidate = 60;
