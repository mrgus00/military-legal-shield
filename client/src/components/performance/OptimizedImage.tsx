import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 80,
  placeholder = 'blur',
  sizes,
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized image URLs
  const generateOptimizedSrc = (originalSrc: string, targetWidth?: number) => {
    const params = new URLSearchParams();
    
    if (targetWidth) {
      params.set('w', targetWidth.toString());
    }
    if (quality !== 80) {
      params.set('q', quality.toString());
    }
    
    const paramString = params.toString();
    const connector = originalSrc.includes('?') ? '&' : '?';
    
    return paramString ? `${originalSrc}${connector}${paramString}` : originalSrc;
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (originalSrc: string) => {
    if (!width) return undefined;
    
    const breakpoints = [640, 768, 1024, 1280, 1536];
    const srcSet = breakpoints
      .filter(bp => bp <= width! * 2) // Only include breakpoints up to 2x the target width
      .map(bp => `${generateOptimizedSrc(originalSrc, bp)} ${bp}w`)
      .join(', ');
    
    return srcSet || undefined;
  };

  // Check if WebP is supported
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // Check if AVIF is supported
  const supportsAVIF = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  };

  // Get the optimized source with format detection
  const getOptimizedSrc = () => {
    let optimizedSrc = src;
    
    // Try to use modern formats if supported
    if (src.startsWith('/api/images/')) {
      if (supportsAVIF()) {
        optimizedSrc = src.replace('/api/images/', '/api/images/avif/');
      } else if (supportsWebP()) {
        optimizedSrc = src.replace('/api/images/', '/api/images/webp/');
      }
    }
    
    return generateOptimizedSrc(optimizedSrc, width);
  };

  useEffect(() => {
    setCurrentSrc(getOptimizedSrc());
  }, [src, width, quality]);

  const handleLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    setImageLoaded(false);
    
    // Fallback to original src if optimized version fails
    if (currentSrc !== src) {
      setCurrentSrc(src);
      return;
    }
    
    onError?.();
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || priority || loading === 'eager') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority, loading]);

  if (imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted text-muted-foreground text-sm ${className}`}
        style={{ width, height }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Show skeleton loader while image is loading */}
      {!imageLoaded && placeholder === 'blur' && (
        <Skeleton 
          className="absolute inset-0 w-full h-full"
          style={{ width, height }}
        />
      )}
      
      <img
        ref={imgRef}
        src={priority || loading === 'eager' ? currentSrc : undefined}
        data-src={priority || loading === 'eager' ? undefined : currentSrc}
        srcSet={generateSrcSet(currentSrc)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        style={{
          ...(width && height ? { aspectRatio: `${width}/${height}` } : {}),
        }}
      />
      
      {/* Preload link for priority images */}
      {priority && typeof window !== 'undefined' && (
        <link
          rel="preload"
          as="image"
          href={currentSrc}
          imageSrcSet={generateSrcSet(currentSrc)}
          imageSizes={sizes}
        />
      )}
    </div>
  );
}

// Higher-order component for automatic optimization
export function withImageOptimization<T extends { src: string }>(
  Component: React.ComponentType<T>
) {
  return function OptimizedComponent(props: T) {
    const optimizedProps = {
      ...props,
      src: props.src.startsWith('/') ? `/api/images${props.src}` : props.src,
    };

    return <Component {...optimizedProps} />;
  };
}

// Hook for preloading critical images
export function useImagePreloader(images: string[]) {
  useEffect(() => {
    const preloadImages = async () => {
      const promises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src.startsWith('/') ? `/api/images${src}` : src;
        });
      });

      try {
        await Promise.allSettled(promises);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    if (images.length > 0) {
      preloadImages();
    }
  }, [images]);
}

export default OptimizedImage;