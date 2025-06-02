interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`} />
  );
}

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`loading-skeleton rounded ${className}`} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}