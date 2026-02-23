import { useState } from "react";

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
  fallback = "/placeholder.svg"
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallback) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  // Codificar URL para lidar com espaços e caracteres especiais
  const encodedSrc = imgSrc.startsWith('data:') 
    ? imgSrc 
    : encodeURI(imgSrc);

  return (
    <img
      src={encodedSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      decoding="async"
    />
  );
};

