import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

interface GoogleSignInProps {
  onSignIn?: () => void;
  disabled?: boolean;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
}

export function GoogleSignIn({ 
  onSignIn, 
  disabled = false, 
  variant = "outline",
  size = "default" 
}: GoogleSignInProps) {
  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      // Direct navigation to Google OAuth endpoint
      window.location.href = '/api/auth/google';
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={disabled}
      variant={variant}
      size={size}
      className="w-full flex items-center gap-3 border-gray-300 hover:border-gray-400"
    >
      <FaGoogle className="h-4 w-4 text-red-500" />
      Sign in with Google
    </Button>
  );
}

export default GoogleSignIn;