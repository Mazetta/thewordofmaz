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

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface ShareSectionProps {
  title: string;
  url: string;
}

// reddit custom button
function CustomRedditButton({ url, title }: { url: string; title: string }) {
  const shareReddit = () => {
    const width = 660
    const height = 460
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`;
    window.open(redditUrl,"RedditShare",`width=${width},height=${height},top=${top},left=${left},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`)
  };

  return (
    <button
      onClick={shareReddit}
      className="rounded-full cursor-pointer"
    >
      <RedditIcon size={24} round />
    </button>
  );
}

export default function ShareSection({ title, url }: ShareSectionProps) {
  const [copied, setCopied] = useState(false);

  // lazy fix
  const cleanUrl = url.replace(/([^:]\/)\/+/g, "$1");

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(cleanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 my-6">

      <TwitterShareButton url={cleanUrl} title={title}>
        <XIcon size={24} round />
      </TwitterShareButton>

      <CustomRedditButton url={cleanUrl} title={title} />

      <WhatsappShareButton url={cleanUrl} title={title}>
        <WhatsappIcon size={24} round />
      </WhatsappShareButton>

      <FacebookShareButton url={cleanUrl} title={title}>
        <FacebookIcon size={24} round />
      </FacebookShareButton>

      <ThreadsShareButton url={cleanUrl} title={title}>
        <ThreadsIcon size={24} round />
      </ThreadsShareButton>

      <BlueskyShareButton url={cleanUrl} title={title}>
        <BlueskyIcon size={24} round />
      </BlueskyShareButton>

      <EmailShareButton url={cleanUrl} subject={title}>
        <EmailIcon size={24} round />
      </EmailShareButton>

      {/* copy */}
      <button
        onClick={copyToClipboard}
        className="rounded-full bg-white/10 hover:bg-white/20 transition p-1.5 flex items-center justify-center cursor-pointer"
      >
        {/* copy -> check */}
        <div className="transition-opacity duration-200">
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </div>
      </button>

    </div>
  );
}
