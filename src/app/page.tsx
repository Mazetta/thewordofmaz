import { getAllPosts } from "@/lib/notion";
import PostCard from "@/components/post-card";
import { PostsGrid } from "@/components/posts-grid";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
          The Word of Maz
        </h1>
        <p className="text-lg text-muted-foreground">
          Je poste (presque) tous les jours 
        </p>
      </div>
    
      <PostsGrid posts={posts} />
    </div>
  );
}

export const revalidate = 60;
