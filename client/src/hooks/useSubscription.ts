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

  const isPremium = subscriptionData?.subscription_status === 'premium' || 
                   subscriptionData?.subscription_status === 'active' ||
                   subscriptionData?.isPremium === true;

  return {
    isPremium,
    subscriptionStatus: subscriptionData?.subscription_status || subscriptionData?.status || 'free',
    isLoading,
    canAccessPremiumFeatures: isPremium,
    subscriptionData,
  };
}