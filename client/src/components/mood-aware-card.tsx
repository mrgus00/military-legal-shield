import { useMood } from "@/contexts/MoodContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface MoodAwareCardProps {
  children: ReactNode;
  title?: string;
  priority?: "low" | "normal" | "high" | "critical";
  className?: string;
}

export default function MoodAwareCard({ 
  children, 
  title, 
  priority = "normal", 
  className = "" 
}: MoodAwareCardProps) {
  const { colors, currentMood } = useMood();
  
  // Adjust card styling based on mood and priority
  const getCardStyle = () => {
    const baseStyle = {
      borderColor: colors.border,
      backgroundColor: colors.background,
    };
    
    // Critical priority cards always use urgent styling
    if (priority === "critical") {
      return {
        ...baseStyle,
        borderColor: "#DC2626",
        backgroundColor: "#FEF2F2",
        borderWidth: "2px",
        boxShadow: "0 4px 6px -1px rgba(220, 38, 38, 0.1)"
      };
    }
    
    // High priority cards use accent colors
    if (priority === "high") {
      return {
        ...baseStyle,
        borderColor: colors.accent,
        borderWidth: "2px",
        boxShadow: `0 4px 6px -1px ${colors.primary}20`
      };
    }
    
    return baseStyle;
  };
  
  const getTitleStyle = () => {
    if (priority === "critical") {
      return { color: "#7F1D1D" }; // Red-900
    }
    return { color: colors.text };
  };
  
  return (
    <Card 
      className={`transition-all duration-300 ${className}`}
      style={getCardStyle()}
    >
      {title && (
        <CardHeader className="pb-3">
          <CardTitle 
            className="text-lg font-semibold"
            style={getTitleStyle()}
          >
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent style={{ color: colors.text }}>
        {children}
      </CardContent>
    </Card>
  );
}