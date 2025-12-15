'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faXTwitter, faBluesky, faReddit, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faRss } from "@fortawesome/free-solid-svg-icons";

export function SocialLinks() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex justify-center gap-6">
        <a href="https://discord.gg/UynQvcv8GQ" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Discord">
          <FontAwesomeIcon icon={faDiscord} size="lg" />
        </a>
        <a href="https://x.com/Mazeriio" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Discord">
          <FontAwesomeIcon icon={faXTwitter} size="lg" />
        </a>
        <a href="https://bsky.app/profile/mazeriio.net" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Discord">
          <FontAwesomeIcon icon={faBluesky} size="lg" />
        </a>
        <a href="https://www.reddit.com/user/Mazeriio" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
          <FontAwesomeIcon icon={faReddit} size="lg" />
        </a>
        <a href="https://www.youtube.com/@Mazeriio" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
          <FontAwesomeIcon icon={faYoutube} size="lg" />
        </a>
        <a href="mailto:contact@mazeriio.net" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
          <FontAwesomeIcon icon={faEnvelope} size="lg" />
        </a>
        <a href="https://www.mazeriio.net/rss.xml" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
          <FontAwesomeIcon icon={faRss} size="lg" />
        </a>
      </div>
      <p className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} Mazeriio. Tous droits réservés.
      </p>
    </div>
  );
}
