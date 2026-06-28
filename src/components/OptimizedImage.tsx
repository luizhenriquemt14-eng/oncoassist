import { useEffect, useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  className = "",
  fallback = "/placeholder.svg",
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError && imgSrc !== fallback) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  const normalizedSrc = (() => {
    if (imgSrc.startsWith("data:") || imgSrc.startsWith("blob:")) {
      return imgSrc;
    }

    try {
      return encodeURI(decodeURI(imgSrc));
    } catch {
      return imgSrc;
    }
  })();

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      decoding="async"
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    />
  );
};
