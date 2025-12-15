import { createContext, useContext } from 'react';
import { Post } from '@/lib/post.types';

export const PostContext = createContext<Post | null>(null);

export function useCurrentPost() {
  return useContext(PostContext);
}

export function PostProvider({ children, post }: { children: React.ReactNode; post: Post | null }) {
  return (
    <PostContext.Provider value={post}>
      {children}
    </PostContext.Provider>
  );
}
