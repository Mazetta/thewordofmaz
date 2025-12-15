import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse, BlockObjectResponse } from "@notionhq/client/";
import fs from "fs";
import path from "path";
import { Post } from "./post.types";

export const notion = new Client({ auth: process.env.NOTION_TOKEN });
export const n2m = new NotionToMarkdown({ notionClient: notion });

// Types
interface NotionAnnotations {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: string;
}

interface ColorMapping {
  name: string;
  hex: string;
}

interface RichTextElement {
  plain_text: string;
  annotations: NotionAnnotations;
}

interface NotionBlock {
  type: string;
  has_children?: boolean;
  id: string;
  paragraph?: { rich_text: RichTextElement[] };
  heading_1?: { rich_text: RichTextElement[] };
  heading_2?: { rich_text: RichTextElement[] };
  heading_3?: { rich_text: RichTextElement[] };
  bulleted_list_item?: { rich_text: RichTextElement[] };
  numbered_list_item?: { rich_text: RichTextElement[] };
  quote?: { rich_text: RichTextElement[] };
  code?: { rich_text: RichTextElement[]; language: string };
  image?: { type: string; external?: { url: string }; file?: { url: string } };
  table_row?: { cells: RichTextElement[][] };
}

// Color mapping
const NOTION_COLOR_MAP: Record<string, ColorMapping> = {
  default: { name: "default", hex: "inherit" },
  gray: { name: "gray", hex: "#626264" },
  brown: { name: "brown", hex: "#744210" },
  orange: { name: "orange", hex: "#d9730d" },
  yellow: { name: "yellow", hex: "#dfa000" },
  green: { name: "green", hex: "#33a852" },
  blue: { name: "blue", hex: "#0b6e99" },
  purple: { name: "purple", hex: "#6940a5" },
  pink: { name: "pink", hex: "#d946ef" },
  red: { name: "red", hex: "#d20c0c" },
};

function mapLocaleFromNotion(notionLocale?: string): "fr" | "en" {
  const localeMap: Record<string, "fr" | "en"> = {
    "Français": "fr",
    "French": "fr",
    "fr": "fr",
    "English": "en",
    "en": "en",
  };
  
  return localeMap[notionLocale || ""] || "fr";
}

function extractColorName(color?: string): string | null {
  if (!color || color === "default") return null;
  return color.replace("_background", "");
}

function getTextColor(color?: string): string | null {
  const colorName = extractColorName(color);
  if (!colorName) return null;
  const colorInfo = NOTION_COLOR_MAP[colorName];
  return colorInfo && colorInfo.hex !== "inherit" ? colorInfo.hex : null;
}

function getBackgroundColor(color?: string): string | null {
  if (!color || !color.includes("_background")) return null;
  const colorName = color.replace("_background", "");
  const colorInfo = NOTION_COLOR_MAP[colorName];
  return colorInfo ? colorInfo.hex : null;
}

function convertRichText(richTexts: RichTextElement[]): string {
  return richTexts
    .map(text => convertAnnotations(text.plain_text, text.annotations))
    .join("");
}

function convertAnnotations(text: string, annotations: NotionAnnotations): string {
  let html = text;
  
  // Apply formatting (without color)
  if (annotations?.bold) html = `<strong>${html}</strong>`;
  if (annotations?.italic) html = `<em>${html}</em>`;
  if (annotations?.strikethrough) html = `<del>${html}</del>`;
  if (annotations?.underline) html = `<u>${html}</u>`;
  if (annotations?.code) {
    html = `<code class="bg-gray-200 dark:bg-gray-800 px-1 rounded">${html}</code>`;
  }
  
  // Apply text color
  const textColor = getTextColor(annotations?.color);
  if (textColor) {
    html = `<span style="color: ${textColor}">${html}</span>`;
  }
  
  // Apply background color
  const bgColor = getBackgroundColor(annotations?.color);
  if (bgColor) {
    html = `<span style="background-color: ${bgColor}20; padding: 2px 4px; border-radius: 3px;">${html}</span>`;
  }
  
  return html;
}

async function processChildBlocks(blockId: string): Promise<string> {
  const children = await notion.blocks.children.list({ block_id: blockId });
  const childMarkdown = await notionBlocksToMarkdown(children.results as BlockObjectResponse[]);
  return childMarkdown
    .split("\n")
    .map(line => line ? `  ${line}` : line)
    .join("\n");
}

async function notionBlocksToMarkdown(blocks: BlockObjectResponse[]): Promise<string> {
  let markdown = "";
  
  for (const block of blocks as NotionBlock[]) {
    switch (block.type) {
      case "paragraph": {
        const content = convertRichText(block.paragraph?.rich_text || []);
        markdown += content ? `${content}\n\n` : "\n";
        break;
      }
      
      case "heading_1":
      case "heading_2":
      case "heading_3": {
        const level = parseInt(block.type.split("_")[1]);
        const content = convertRichText((block as any)[block.type]?.rich_text || []);
        markdown += `${"#".repeat(level)} ${content}\n\n`;
        break;
      }
      
      case "bulleted_list_item":
      case "numbered_list_item": {
        const prefix = block.type === "bulleted_list_item" ? "- " : "1. ";
        const content = convertRichText((block as any)[block.type]?.rich_text || []);
        markdown += `${prefix}${content}\n`;
        
        if (block.has_children) {
          markdown += await processChildBlocks(block.id);
        }
        break;
      }
      
      case "quote": {
        const content = convertRichText(block.quote?.rich_text || []);
        markdown += `> ${content}\n\n`;
        break;
      }
      
      case "code": {
        const language = block.code?.language || "text";
        const content = block.code?.rich_text.map(t => t.plain_text).join("") || "";
        markdown += `\`\`\`${language}\n${content}\n\`\`\`\n\n`;
        break;
      }
      
      case "image": {
        const image = block.image;
        let imageUrl = "";
        if (image?.type === "external") {
          imageUrl = image.external?.url || "";
        } else if (image?.type === "file") {
          imageUrl = image.file?.url || "";
        }
        if (imageUrl) markdown += `![](${imageUrl})\n\n`;
        break;
      }
      
      case "divider": {
        markdown += `---\n\n`;
        break;
      }
      
      case "table": {
        if (block.has_children) {
          const rows = await notion.blocks.children.list({ block_id: block.id });
          for (const row of rows.results) {
            const tableRow = row as any;
            if (tableRow.type === "table_row") {
              const cells = tableRow.table_row?.cells || [];
              const normalizedCells = cells.map((cell: RichTextElement[]) =>
                cell.map(text => convertAnnotations(text.plain_text, text.annotations)).join("")
              );
              markdown += "| " + normalizedCells.join(" | ") + " |\n";
            }
          }
          markdown += "\n";
        }
        break;
      }
      
      case "table_of_contents":
        // Skip table of contents
        break;
    }
  }
  
  return markdown;
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

/* Extract media URL from Notion file property
   Supports both external URLs and uploaded files */
function extractMediaUrl(prop: any): string | undefined {
  if (!prop?.files || prop.files.length === 0) return undefined;

  const file = prop.files[0];
  if (file.type === "external") return file.external.url;
  if (file.type === "file") return file.file.url;
  
  return undefined;
}

export async function getPostFromNotion(pageId: string): Promise<Post | null> {
  try {
    const page = (await notion.pages.retrieve({ page_id: pageId })) as PageObjectResponse;
    
    const blocks = await notion.blocks.children.list({ block_id: pageId });
    const contentString = await notionBlocksToMarkdown(blocks.results as BlockObjectResponse[]);

    const paragraphs = contentString
      .split("\n")
      .filter((line: string) => line.trim().length > 0);
    const firstParagraph = paragraphs[0] || "";
    const description = firstParagraph.slice(0, 160) + (firstParagraph.length > 160 ? "..." : "");

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
      coverImage: extractMediaUrl(properties["Featured Image"]),
      description,
      date: properties["Published Date"]?.date?.start || new Date().toISOString(),
      content: contentString,
      author: properties.Author?.people[0]?.name,
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      category: properties.Category?.select?.name,
      locale: mapLocaleFromNotion(properties.Locale?.select?.name),
    };

    return post;
  } catch (error) {
    console.error("Error getting post from Notion:", error);
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

export async function getPostBySlugAndLocale(slug: string, locale: "fr" | "en"): Promise<Post | null> {
  try {
    const rawPosts = await fetchPublishedPosts();
    for (const page of rawPosts) {
      const post = await getPostFromNotion(page.id);
      if (post?.slug === slug && post?.locale === locale) {
        return post;
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting post by slug and locale:", error);
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