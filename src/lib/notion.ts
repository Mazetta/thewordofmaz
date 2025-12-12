import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse, BlockObjectResponse } from "@notionhq/client/";
import fs from "fs";
import path from "path";

export const notion = new Client({ auth: process.env.NOTION_TOKEN });
export const n2m = new NotionToMarkdown({ notionClient: notion });

// 🎨 Mappage des couleurs Notion vers des couleurs CSS
const NOTION_COLOR_MAP: { [key: string]: string } = {
  "default": "inherit",
  "gray": "#626264",
  "brown": "#744210",
  "orange": "#d9730d",
  "yellow": "#dfa000",
  "green": "#33a852",
  "blue": "#0b6e99",
  "purple": "#6940a5",
  "pink": "#d946ef",
  "red": "#d20c0c",
};

// 🎨 Conversion des annotations Notion en HTML avec data-attributes pour les couleurs
function convertAnnotations(text: string, annotations: any): string {
  let html = text;
  
  // 🎨 Appliquer les couleurs EN PREMIER (avant autres formatages)
  // Couleur de texte
  if (annotations?.color && annotations.color !== "default" && !annotations.color.includes("_background")) {
    const color = NOTION_COLOR_MAP[annotations.color] || annotations.color;
    html = `<span data-color="${color}">${html}</span>`;
  }
  
  // Couleur de fond
  if (annotations?.color && annotations.color.includes("_background")) {
    const colorName = annotations.color.replace("_background", "");
    const bgColor = NOTION_COLOR_MAP[colorName] || colorName;
    html = `<span style="background-color: ${bgColor}20; padding: 2px 4px; border-radius: 3px;">${html}</span>`;
  }
  
  // Puis appliquer les autres styles de texte
  if (annotations?.bold) {
    html = `<strong>${html}</strong>`;
  }
  if (annotations?.italic) {
    html = `<em>${html}</em>`;
  }
  if (annotations?.strikethrough) {
    html = `<del>${html}</del>`;
  }
  if (annotations?.underline) {
    html = `<u>${html}</u>`;
  }
  if (annotations?.code) {
    html = `<code class="bg-gray-200 dark:bg-gray-800 px-1 rounded">${html}</code>`;
  }
  
  return html;
}

// 📝 Conversion personnalisée des blocs Notion en Markdown avec support des couleurs
async function notionBlocksToMarkdown(blocks: BlockObjectResponse[]): Promise<string> {
  let markdown = "";
  
  for (const block of blocks) {
    // Traiter les blocs
    if (block.type === "paragraph") {
      const paragraph = (block as any).paragraph;
      const content = paragraph.rich_text
        .map((text: any) => convertAnnotations(text.plain_text, text.annotations))
        .join("");
      markdown += content ? `${content}\n\n` : "\n";
    } else if (block.type === "heading_1") {
      const heading = (block as any).heading_1;
      const content = heading.rich_text
        .map((text: any) => convertAnnotations(text.plain_text, text.annotations))
        .join("");
      markdown += `# ${content}\n\n`;
    } else if (block.type === "heading_2") {
      const heading = (block as any).heading_2;
      const content = heading.rich_text
        .map((text: any) => convertAnnotations(text.plain_text, text.annotations))
        .join("");
      markdown += `## ${content}\n\n`;
    } else if (block.type === "heading_3") {
      const heading = (block as any).heading_3;
      const content = heading.rich_text
        .map((text: any) => convertAnnotations(text.plain_text, text.annotations))
        .join("");
      markdown += `### ${content}\n\n`;
    } else if (block.type === "bulleted_list_item") {
      const item = (block as any).bulleted_list_item;
      const content = item.rich_text
        .map((text: any) => convertAnnotations(text.plain_text, text.annotations))
        .join("");
      markdown += `- ${content}\n`;
      
      // Gérer les enfants
      if (block.has_children) {
        const children = await notion.blocks.children.list({ block_id: block.id });
        const childMarkdown = await notionBlocksToMarkdown(children.results as BlockObjectResponse[]);
        const indented = childMarkdown
          .split("\n")
          .map(line => line ? `  ${line}` : line)
          .join("\n");
        markdown += indented;
      }
    } else if (block.type === "numbered_list_item") {
      const item = (block as any).numbered_list_item;
      const content = item.rich_text
        .map((text: any) => convertAnnotations(text.plain_text, text.annotations))
        .join("");
      markdown += `1. ${content}\n`;
      
      // Gérer les enfants
      if (block.has_children) {
        const children = await notion.blocks.children.list({ block_id: block.id });
        const childMarkdown = await notionBlocksToMarkdown(children.results as BlockObjectResponse[]);
        const indented = childMarkdown
          .split("\n")
          .map(line => line ? `  ${line}` : line)
          .join("\n");
        markdown += indented;
      }
    } else if (block.type === "quote") {
      const quote = (block as any).quote;
      const content = quote.rich_text
        .map((text: any) => convertAnnotations(text.plain_text, text.annotations))
        .join("");
      markdown += `> ${content}\n\n`;
    } else if (block.type === "code") {
      const code = (block as any).code;
      const language = code.language || "text";
      const content = code.rich_text
        .map((text: any) => text.plain_text)
        .join("");
      markdown += `\`\`\`${language}\n${content}\n\`\`\`\n\n`;
    } else if (block.type === "image") {
      const image = (block as any).image;
      let imageUrl = "";
      if (image.type === "external") {
        imageUrl = image.external.url;
      } else if (image.type === "file") {
        imageUrl = image.file.url;
      }
      if (imageUrl) {
        markdown += `![](${imageUrl})\n\n`;
      }
    } else if (block.type === "divider") {
      markdown += `---\n\n`;
    } else if (block.type === "table_of_contents") {
      // Ignorer la table des matières
      continue;
    } else if (block.type === "table") {
      // Gérer les tableaux simples
      if (block.has_children) {
        const rows = await notion.blocks.children.list({ block_id: block.id });
        for (const row of rows.results) {
          if ((row as any).type === "table_row") {
            const cells = (row as any).table_row?.cells || [];
            const normalizedCells = cells.map((cell: any[]) => 
              cell.map((text: any) => convertAnnotations(text.plain_text, text.annotations)).join("")
            );
            markdown += "| " + normalizedCells.join(" | ") + " |\n";
          }
        }
        markdown += "\n";
      }
    }
  }
  
  return markdown;
}

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
    
    // 🎨 Utiliser la conversion personnalisée qui préserve les couleurs
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });
    const contentString = await notionBlocksToMarkdown(blocks.results as BlockObjectResponse[]);

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