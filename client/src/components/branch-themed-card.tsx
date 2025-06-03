import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBranch } from "@/contexts/BranchContext";
import { ReactNode } from "react";

interface BranchThemedCardProps {
  title: string;
  description: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export default function BranchThemedCard({ 
  title, 
  description, 
  children, 
  icon, 
  className = "" 
}: BranchThemedCardProps) {
  const { branchTheme } = useBranch();

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 border-2 ${className}`}
      style={{
        borderColor: `hsl(${branchTheme.colors.primary} / 0.2)`,
        background: `linear-gradient(135deg, hsl(${branchTheme.colors.background}) 0%, hsl(${branchTheme.colors.primary} / 0.05) 100%)`
      }}
    >
      <CardHeader>
        <div className="flex items-center space-x-3">
          {icon && (
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `hsl(${branchTheme.colors.primary} / 0.1)` }}
            >
              <div style={{ color: `hsl(${branchTheme.colors.primary})` }}>
                {icon}
              </div>
            </div>
          )}
          <div>
            <CardTitle 
              className="text-lg font-semibold"
              style={{ color: `hsl(${branchTheme.colors.text})` }}
            >
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}