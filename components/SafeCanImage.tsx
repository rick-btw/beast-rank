"use client";

import { useState } from "react";
import { publicPath } from "@/lib/public-path";

type Props = {
  src: string | null;
  slug: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
};

export default function SafeCanImage({ src, slug, alt, className, loading = "lazy" }: Props) {
  const fallback = publicPath(`/cans/generated/${slug}.svg`);
  const [currentSrc, setCurrentSrc] = useState(src ? publicPath(src) : fallback);

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      onError={() => setCurrentSrc(fallback)}
      className={className}
    />
  );
}
