import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, ArrowRight, Lock } from "lucide-react";
import { Link } from "wouter";

interface PremiumUpgradePromptProps {
  feature: string;
  description?: string;
  variant?: "card" | "banner" | "inline";
  className?: string;
}

export default function PremiumUpgradePrompt({ 
  feature, 
  description, 
  variant = "card",
  className = "" 
}: PremiumUpgradePromptProps) {
  
  if (variant === "banner") {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-full">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Upgrade to Premium
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {description || `Access ${feature} and other premium features`}
              </p>
            </div>
          </div>
          <Link href="/pricing">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 ${className}`}>
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {feature} requires Premium
          </span>
        </div>
        <Link href="/pricing">
          <Button size="sm" variant="outline">
            <Crown className="w-3 h-3 mr-1" />
            Upgrade
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className={`border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <Badge variant="outline" className="mb-2 border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-400">
          <Shield className="w-3 h-3 mr-1" />
          Premium Feature
        </Badge>
        <CardTitle className="text-xl text-slate-900 dark:text-white">
          Unlock {feature}
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          {description || `${feature} is available with Premium membership. Upgrade now for full access to all legal tools and attorney consultations.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center justify-center">
            <span>✓ Attorney consultations</span>
          </div>
          <div className="flex items-center justify-center">
            <span>✓ Document review services</span>
          </div>
          <div className="flex items-center justify-center">
            <span>✓ 24/7 emergency support</span>
          </div>
          <div className="flex items-center justify-center">
            <span>✓ Priority case management</span>
          </div>
        </div>
        <Link href="/pricing">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}