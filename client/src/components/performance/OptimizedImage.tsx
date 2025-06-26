import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  quality = 85,
  format = 'auto',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  loading = 'lazy',
  className,
  onLoad,
  onError,
  placeholder = 'blur',
  blurDataURL
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Generate optimized image URL
  const getOptimizedUrl = (w: number, f?: string) => {
    const params = new URLSearchParams({
      src: encodeURIComponent(src),
      w: w.toString(),
      h: height.toString(),
      q: quality.toString(),
      ...(f && { f })
    });
    return `/api/images/optimize?${params.toString()}`;
  };

  // Generate responsive image sources
  const generateSources = () => {
    const widths = [320, 640, 960, 1280, 1920];
    const formats = ['avif', 'webp'];
    
    return formats.map(fmt => (
      <source
        key={fmt}
        type={`image/${fmt}`}
        srcSet={widths
          .filter(w => w <= width * 2)
          .map(w => `${getOptimizedUrl(w, fmt)} ${w}w`)
          .join(', ')
        }
        sizes={sizes}
      />
    ));
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Placeholder component
  const renderPlaceholder = () => {
    if (placeholder === 'empty') return null;
    
    return (
      <div
        className={cn(
          'absolute inset-0 bg-gray-200 animate-pulse',
          'flex items-center justify-center text-gray-400',
          !isLoaded && !hasError ? 'block' : 'hidden'
        )}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  };

  // Error component
  const renderError = () => {
    if (!hasError) return null;
    
    return (
      <div
        className={cn(
          'absolute inset-0 bg-gray-100 border-2 border-dashed border-gray-300',
          'flex items-center justify-center text-gray-500'
        )}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <div className="text-center">
          <svg
            className="w-8 h-8 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-sm">Failed to load image</p>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {isInView && !hasError && (
        <picture>
          {generateSources()}
          <img
            src={getOptimizedUrl(width)}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            sizes={sizes}
          />
        </picture>
      )}
      
      {renderPlaceholder()}
      {renderError()}
      
      {/* Preload critical images */}
      {priority && isInView && (
        <>
          <link
            rel="preload"
            as="image"
            href={getOptimizedUrl(width, 'avif')}
            type="image/avif"
          />
          <link
            rel="preload"
            as="image"
            href={getOptimizedUrl(width, 'webp')}
            type="image/webp"
          />
        </>
      )}
    </div>
  );
}

// Hero image component with specific optimizations
export function HeroImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      quality={90}
      priority={true}
      loading="eager"
      sizes="100vw"
      className={className}
    />
  );
}

// Avatar image component
export function AvatarImage({ src, alt, size = 64 }: { src: string; alt: string; size?: number }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      quality={95}
      format="webp"
      className="rounded-full"
      placeholder="empty"
    />
  );
}

// Card image component
export function CardImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={400}
      height={240}
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
      className={cn('rounded-lg', className)}
    />
  );
}