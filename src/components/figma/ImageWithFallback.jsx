import { useState } from "react";

export function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className || ""}`}>
        <span>No image</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
}
