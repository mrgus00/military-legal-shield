import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useAuth() {
  const [replitUser, setReplitUser] = useState<any>(null);
  const [isLoadingReplit, setIsLoadingReplit] = useState(true);

  // Check for Replit's built-in authentication
  useEffect(() => {
    // Check if we're in Replit environment
    if (typeof window !== 'undefined' && window.location.hostname.includes('replit')) {
      // Replit provides user info via global variables or API
      const checkReplitAuth = async () => {
        try {
          // Try to get user from Replit's built-in auth
          const response = await fetch('/api/auth/user', {
            credentials: 'include',
          });
          
          if (response.ok) {
            const userData = await response.json();
            setReplitUser(userData);
          }
        } catch (error) {
          console.log('No Replit authentication found');
        }
        setIsLoadingReplit(false);
      };
      
      checkReplitAuth();
    } else {
      setIsLoadingReplit(false);
    }
  }, []);

  // Fallback to API-based auth for non-Replit environments
  const { data: apiUser, isLoading: isLoadingApi } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !replitUser && !isLoadingReplit,
  });

  const user = replitUser || apiUser;
  const isLoading = isLoadingReplit || isLoadingApi;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}