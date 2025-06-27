import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeButtonProps {
  className?: string;
}

export function HomeButton({ className = "" }: HomeButtonProps) {
  return (
    <Button 
      onClick={() => window.location.href = '/'}
      variant="outline" 
      size="sm"
      className={`flex items-center gap-2 ${className}`}
    >
      <Home className="h-4 w-4" />
      Home
    </Button>
  );
}