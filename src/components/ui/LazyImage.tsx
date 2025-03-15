
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export const LazyImage = ({
  src,
  alt,
  placeholderSrc = "/placeholder.svg",
  aspectRatio = "auto",
  objectFit = "cover",
  className,
  ...props
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Load when within 200px of viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Reset error state when src changes
    setImgError(false);
    setIsLoaded(false);
  }, [src]);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setImgError(true);
    setIsLoaded(false);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100",
        aspectRatioClasses[aspectRatio]
      )}
    >
      {/* Low quality placeholder */}
      {(!isLoaded || imgError) && (
        <img
          src={placeholderSrc}
          alt={alt}
          className={cn(
            "w-full h-full absolute inset-0 transition-opacity duration-500",
            objectFit === "contain" ? "object-contain" : "object-cover",
            isLoaded && !imgError ? "opacity-0" : "opacity-100",
            className
          )}
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      {isInView && !imgError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={cn(
            "w-full h-full transition-opacity duration-500",
            objectFit === "contain" ? "object-contain" : "object-cover",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      )}
    </div>
  );
};
