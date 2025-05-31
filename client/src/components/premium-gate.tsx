import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock } from "lucide-react";
import { Link } from "wouter";

interface PremiumGateProps {
  children: ReactNode;
  feature: string;
  description: string;
  userTier?: "free" | "premium";
  showUpgrade?: boolean;
}

export default function PremiumGate({ 
  children, 
  feature, 
  description, 
  userTier = "free",
  showUpgrade = true 
}: PremiumGateProps) {
  // For demo purposes, showing free tier restrictions
  // In production, this would check actual user subscription
  const isPremium = userTier === "premium";
  
  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gray-100 rounded-full">
            <Lock className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          Premium Feature
          <Badge variant="outline" className="ml-2">
            {feature}
          </Badge>
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {showUpgrade && (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-2">Upgrade to Premium Defense</h4>
              <p className="text-sm text-gray-600 mb-4">
                Get access to advanced attorney matching, case tracking, priority support, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link href="/pricing">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </Link>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Starting at $29.99/month or $299/year (save 17%)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}