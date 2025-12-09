import { fetchPublishedPosts, getPostFromNotion, Post } from "@/lib/notion";
import PostCard from "@/components/post-card";

export default async function Home() {
  // 🔥 Fetch direct depuis Notion
  const rawPosts = await fetchPublishedPosts();

  // 🔥 Map chaque PageObjectResponse vers ton type Post
  const posts: Post[] = await Promise.all(
    rawPosts.map(async (page) => {
      const post = await getPostFromNotion(page.id);
      if (!post) throw new Error(`Post Notion invalide pour id ${page.id}`);
      return post;
    })
  );

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
          Bienvenue !
        </h1>
        <p className="text-lg text-muted-foreground">
          Je poste (presque) tous les jours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export const revalidate = 60;
