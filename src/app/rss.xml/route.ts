import { getAllPosts } from "@/lib/notion";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await getAllPosts();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mazeriio.net/";

  const rssItems = posts
    .map((post) => `
      <item>
        <title>${post.title}</title>
        <link>${siteUrl}posts/${post.locale}/${post.slug}</link>
        <description>${post.description}</description>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <guid>${siteUrl}posts/${post.locale}/${post.slug}</guid>
      </item>
    `)
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>The Word of Maz</title>
        <link>${siteUrl}</link>
        <description>Flux RSS du Word of Maz</description>
        ${rssItems}
      </channel>
    </rss>
  `;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
