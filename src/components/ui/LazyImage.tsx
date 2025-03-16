
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto" | "wide";
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  blurEffect?: boolean;
  priority?: boolean;
}

export const LazyImage = ({
  src,
  alt,
  placeholderSrc = "/placeholder.svg",
  aspectRatio = "auto",
  objectFit = "cover",
  blurEffect = true,
  priority = false,
  className,
  ...props
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }
    
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
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  useEffect(() => {
    // Reset error state when src changes
    setImgError(false);
    setIsLoaded(false);
  }, [src]);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    wide: "aspect-[16/9]",
    auto: "",
  };

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setImgError(true);
    setIsLoaded(false);
  };

  // Immediately check if the URL is valid by creating an Image object
  useEffect(() => {
    if (src !== placeholderSrc && src !== "" && isInView) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (isInView) setIsLoaded(true);
      };
      img.onerror = handleError;
    }
  }, [src, placeholderSrc, isInView]);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100 rounded-md",
        aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses],
        className
      )}
      ref={imgRef}
    >
      {/* Low quality placeholder */}
      {(!isLoaded || imgError) && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          <img
            src={placeholderSrc}
            alt={alt}
            className={cn(
              "w-full h-full absolute inset-0 transition-opacity duration-500",
              objectFit === "contain" ? "object-contain" : "object-cover",
              isLoaded && !imgError ? "opacity-0" : "opacity-100"
            )}
            aria-hidden="true"
          />
        </div>
      )}
      
      {/* Main image */}
      {isInView && !imgError && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={cn(
            "w-full h-full transition-all duration-500",
            objectFit === "contain" ? "object-contain" : "object-cover",
            blurEffect && !isLoaded ? "blur-sm scale-105" : "blur-0 scale-100",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          {...props}
        />
      )}
      
      {/* Visual loading indicator */}
      {!isLoaded && isInView && !imgError && blurEffect && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
