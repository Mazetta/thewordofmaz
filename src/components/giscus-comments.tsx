"use client";

import Giscus from "@giscus/react";

export default function GiscusComments() {
  return (
    <Giscus
      repo="Mazetta/thewordofmaz"
      repoId="R_kgDOQk7bdw"
      category="Giscus"
      categoryId="DIC_kwDOQk7bd84CzlyU"
      mapping="og:title"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="transparent_dark"
      lang="fr"
      loading="lazy"
    />
  );
}
