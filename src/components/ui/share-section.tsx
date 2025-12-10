"use client";

import {
  TwitterShareButton,
  WhatsappShareButton,
  FacebookShareButton,
	ThreadsShareButton,
	BlueskyShareButton,
  EmailShareButton,
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

// custom Reddit button component
function CustomRedditButton({ url, title }: { url: string; title: string }) {
  const shareReddit = () => {
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`;

    window.open(redditUrl, "_blank", "noopener,noreferrer,width=800,height=600");
  };

  return (
    <button
      onClick={shareReddit}
      className="p-2 rounded-lg bg-[#FF4500]/10 hover:bg-[#FF4500]/20 transition flex items-center gap-2"
    >
      <RedditIcon className="w-5 h-5 text-[#FF4500]" />
      <span>Reddit</span>
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
    //<div className="mt-10 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
    //<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
    //<Share2 className="w-5 h-5" />
    // Partager cet article
    //</h3>

    <div className="flex flex-wrap gap-3">

      <TwitterShareButton url={url} title={title} className="group">
        <div className="p-2 rounded-lg bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 transition flex items-center gap-2">
          <XIcon className="w-5 h-5 text-[#1DA1F2]" />
          <span>Twitter</span>
        </div>
      </TwitterShareButton>

      {/* bouton reddit */}
      <CustomRedditButton url={url} title={title} />

      <FacebookShareButton url={url} title={title} className="group">
        <div className="p-2 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition flex items-center gap-2">
          <FacebookIcon className="w-5 h-5 text-[#1877F2]" />
          <span>Facebook</span>
        </div>
      </FacebookShareButton>

      <WhatsappShareButton url={url} title={title} separator=" - " className="group">
        <div className="p-2 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 transition flex items-center gap-2">
          <WhatsappIcon className="w-5 h-5 text-[#25D366]" />
          <span>WhatsApp</span>
        </div>
      </WhatsappShareButton>

      <EmailShareButton url={url} subject={title} body={url} className="group">
        <div className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2">
          <EmailIcon className="w-5 h-5" />
          <span>Email</span>
        </div>
      </EmailShareButton>

      {/* Copier le lien */}
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2"
      >
        <Copy className="w-5 h-5" />
        {copied ? "Copié !" : "Copier le lien"}
      </button>
    </div>
    //</div>
  );
}
