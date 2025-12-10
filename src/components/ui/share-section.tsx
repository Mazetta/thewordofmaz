"use client";

import {
  TwitterShareButton,
  WhatsappShareButton,
  FacebookShareButton,
  EmailShareButton,
  BlueskyShareButton,
  ThreadsShareButton,
} from "react-share";

import {
  XIcon,
  RedditIcon,
  WhatsappIcon,
  FacebookIcon,
  ThreadsIcon,
  BlueskyIcon,
  EmailIcon,
} from "react-share";

import { Copy } from "lucide-react";
import { useState } from "react";

interface ShareSectionProps {
  title: string;
  url: string;
}

// 🔥 Reddit custom button (version icône round)
function CustomRedditButton({ url, title }: { url: string; title: string }) {
  const shareReddit = () => {
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`;
    window.open(redditUrl, "_blank", "noopener,noreferrer,width=660,height=520");
  };

  return (
    <button onClick={shareReddit} className="rounded-full">
      <RedditIcon size={32} round />
    </button>
  );
}

export default function ShareSection({ title, url }: ShareSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 my-6">

      {/* X */}
      <TwitterShareButton url={url} title={title}>
        <XIcon size={32} round />
      </TwitterShareButton>

      {/* Reddit custom */}
      <CustomRedditButton url={url} title={title} />

      {/* WhatsApp */}
      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      {/* Facebook */}
      <FacebookShareButton url={url} title={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      {/* Threads */}
      <ThreadsShareButton url={url} title={title}>
        <ThreadsIcon size={32} round />
      </ThreadsShareButton>

      {/* Bluesky */}
      <BlueskyShareButton url={url} title={title}>
        <BlueskyIcon size={32} round />
      </BlueskyShareButton>

      {/* Email */}
      <EmailShareButton url={url} subject={title}>
        <EmailIcon size={32} round />
      </EmailShareButton>

      {/* Copy link */}
      <button
        onClick={copyToClipboard}
        className="rounded-full bg-white/10 hover:bg-white/20 transition p-2 flex items-center justify-center"
      >
        <Copy className="w-4 h-4" />
      </button>

    </div>
  );
}
