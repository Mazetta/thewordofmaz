import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse } from "@notionhq/client/";
import fs from "fs";
import path from "path";

export const notion = new Client({ auth: process.env.NOTION_TOKEN });
export const n2m = new NotionToMarkdown({ notionClient: notion });

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
}

export async function getDatabaseStructure() {
  const database = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID!,
  });
  return database;
}

export function getWordCount(content: string): number {
  const cleanText = content
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleanText.split(" ").length;
}

export function getPostsFromCache(): Post[] {
  const cachePath = path.join(process.cwd(), "posts-cache.json");
  if (fs.existsSync(cachePath)) {
    try {
      const cache = fs.readFileSync(cachePath, "utf-8");
      return JSON.parse(cache);
    } catch (error) {
      console.error("Error reading posts cache:", error);
      return [];
    }
  }
  return [];
}

export async function fetchPublishedPosts() {
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Status",
          status: {
            equals: "Published",
          },
        },
      ],
    },
    sorts: [
      {
        property: "Published Date",
        direction: "descending",
      },
    ],
  });

  return posts.results as PageObjectResponse[];
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = getPostsFromCache();
  const post = posts.find((p) => p.slug === slug);
  return post || null;
}

/* 🔧 Fonction ajoutée : permet d'extraire une image depuis une propriété Notion de type "files"
   (ce qui est le cas lorsque tu utilises "media" au lieu de "url")
*/
function extractMediaUrl(prop: any): string | undefined {
  if (!prop || !prop.files || prop.files.length === 0) return undefined;

  const file = prop.files[0];

  // 🔹 Cas d'une image externe
  if (file.type === "external") {
    return file.external.url;
  }

  // 🔹 Cas d'une image envoyée dans Notion (URL signée qui expire)
  if (file.type === "file") {
    return file.file.url;
  }

  return undefined;
}

export async function getPostFromNotion(pageId: string): Promise<Post | null> {
  try {
    const page = (await notion.pages.retrieve({
      page_id: pageId,
    })) as PageObjectResponse;
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const { parent: contentString } = n2m.toMarkdownString(mdBlocks);

    const paragraphs = contentString
      .split("\n")
      .filter((line: string) => line.trim().length > 0);
    const firstParagraph = paragraphs[0] || "";
    const description =
      firstParagraph.slice(0, 160) + (firstParagraph.length > 160 ? "..." : "");

    const properties = page.properties as any;
    const rawTitle = properties.Title.title[0]?.plain_text || "Untitled";

    const slugified = rawTitle
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/œ/g, "oe")
      .replace(/æ/g, "ae")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const post: Post = {
      id: page.id,
      title: rawTitle,
      slug: slugified || "untitled",

      /* 🛠️ MODIFIÉ :
         Avant → properties["Featured Image"]?.url
         Maintenant → supporte une propriété Notion de type "Media" (files)
      */
      coverImage: extractMediaUrl(properties["Featured Image"]),

      description,
      date:
        properties["Published Date"]?.date?.start || new Date().toISOString(),
      content: contentString,
      author: properties.Author?.people[0]?.name,
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      category: properties.Category?.select?.name,
    };

    return post;
  } catch (error) {
    console.error("Error getting post:", error);
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const rawPosts = await fetchPublishedPosts();
    for (const page of rawPosts) {
      const post = await getPostFromNotion(page.id);
      if (post?.slug === slug) {
        return post;
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting post by slug:", error);
    return null;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const rawPosts = await fetchPublishedPosts();
    const posts = await Promise.all(
      rawPosts.map(async (page) => {
        const post = await getPostFromNotion(page.id);
        return post;
      })
    );
    return posts.filter((p) => p !== null) as Post[];
  } catch (error) {
    console.error("Error getting all posts:", error);
    return [];
  }
}