import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useSubscription() {
  const { isAuthenticated } = useAuth();

  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ["/api/subscription-status"],
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    isPremium: subscriptionData?.isPremium || false,
    subscriptionStatus: subscriptionData?.status || 'free',
    isLoading,
    canAccessPremiumFeatures: subscriptionData?.isPremium || false,
  };
}