import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateReadingTime(wordCount: number): string {
  const WORDS_PER_MINUTE = 225; // Average adult reading speed
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  if (minutes === 1) {
    return `${minutes} minute`;
  } else
    return `${minutes} minutes`;
}

export function getWordCount(content: string): number {
  const cleanText = content
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleanText.split(" ").length;
}

export function stripHtmlTags(html: string): string {
  if (!html) return "";
  // Remove all HTML tags but preserve the text content
  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/^#+\s+/, "") // Remove markdown headings at the start
    .replace(/^\s*[-*_>]+\s*/, "") // Remove markdown symbols at the start
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
}