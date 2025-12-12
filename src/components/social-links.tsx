'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export function SocialLinks() {
  return (
    <div className="flex flex-col items-center gap-4 mb-4">
      <div className="flex justify-center gap-6">
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
          <FontAwesomeIcon icon={faTwitter} size="lg" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
          <FontAwesomeIcon icon={faGithub} size="lg" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
          <FontAwesomeIcon icon={faLinkedin} size="lg" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
          <FontAwesomeIcon icon={faEnvelope} size="lg" />
        </a>
      </div>
    </div>
  );
}
