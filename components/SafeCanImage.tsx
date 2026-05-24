"use client";

import { useState } from "react";

type Props = {
  src: string | null;
  slug: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
};

export default function SafeCanImage({ src, slug, alt, className, loading = "lazy" }: Props) {
  const fallback = `/api/cans/${slug}`;
  const [currentSrc, setCurrentSrc] = useState(src ?? fallback);

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
