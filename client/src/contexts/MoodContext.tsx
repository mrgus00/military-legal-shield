import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type MoodState = 
  | "urgent"      // Red tones - emergency legal situations
  | "stressed"    // Orange tones - high stress situations
  | "neutral"     // Default blue/navy - normal browsing
  | "hopeful"     // Green tones - positive progress, learning
  | "confident"   // Gold tones - successful outcomes, achievements
  | "calm";       // Soft blue - resources, education

export interface MoodColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

const moodColorSchemes: Record<MoodState, MoodColors> = {
  urgent: {
    primary: "#DC2626", // Red-600
    secondary: "#FEF2F2", // Red-50
    accent: "#F87171", // Red-400
    background: "#FFF5F5", // Red-25
    text: "#7F1D1D", // Red-900
    border: "#FECACA" // Red-200
  },
  stressed: {
    primary: "#EA580C", // Orange-600
    secondary: "#FFF7ED", // Orange-50
    accent: "#FB923C", // Orange-400
    background: "#FFFBF5", // Orange-25
    text: "#9A3412", // Orange-800
    border: "#FED7AA" // Orange-200
  },
  neutral: {
    primary: "#1E40AF", // Blue-700 (Navy)
    secondary: "#EFF6FF", // Blue-50
    accent: "#3B82F6", // Blue-500
    background: "#F8FAFC", // Slate-50
    text: "#1E293B", // Slate-800
    border: "#CBD5E1" // Slate-300
  },
  hopeful: {
    primary: "#059669", // Emerald-600
    secondary: "#ECFDF5", // Emerald-50
    accent: "#10B981", // Emerald-500
    background: "#F0FDF4", // Green-50
    text: "#064E3B", // Emerald-900
    border: "#A7F3D0" // Emerald-200
  },
  confident: {
    primary: "#D97706", // Amber-600
    secondary: "#FFFBEB", // Amber-50
    accent: "#F59E0B", // Amber-500
    background: "#FEFCE8", // Yellow-50
    text: "#92400E", // Amber-800
    border: "#FDE68A" // Amber-200
  },
  calm: {
    primary: "#0369A1", // Sky-700
    secondary: "#F0F9FF", // Sky-50
    accent: "#0EA5E9", // Sky-500
    background: "#F8FAFC", // Slate-50
    text: "#0C4A6E", // Sky-900
    border: "#BAE6FD" // Sky-200
  }
};

interface MoodContextType {
  currentMood: MoodState;
  colors: MoodColors;
  setMood: (mood: MoodState) => void;
  detectMoodFromContext: (context: string) => void;
  detectMoodFromContent: (content: string) => MoodState;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

interface MoodProviderProps {
  children: ReactNode;
}

export function MoodProvider({ children }: MoodProviderProps) {
  const [currentMood, setCurrentMood] = useState<MoodState>("neutral");
  const [colors, setColors] = useState<MoodColors>(moodColorSchemes.neutral);

  // Update CSS variables when mood changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--mood-primary', colors.primary);
    root.style.setProperty('--mood-secondary', colors.secondary);
    root.style.setProperty('--mood-accent', colors.accent);
    root.style.setProperty('--mood-background', colors.background);
    root.style.setProperty('--mood-text', colors.text);
    root.style.setProperty('--mood-border', colors.border);
  }, [colors]);

  const setMood = (mood: MoodState) => {
    setCurrentMood(mood);
    setColors(moodColorSchemes[mood]);
  };

  // Detect mood from page context/route
  const detectMoodFromContext = (context: string) => {
    const lowerContext = context.toLowerCase();
    
    if (lowerContext.includes("urgent") || lowerContext.includes("emergency") || lowerContext.includes("crisis")) {
      setMood("urgent");
    } else if (lowerContext.includes("court-martial") || lowerContext.includes("legal-issue") || lowerContext.includes("disciplinary")) {
      setMood("stressed");
    } else if (lowerContext.includes("education") || lowerContext.includes("resources") || lowerContext.includes("help-center")) {
      setMood("calm");
    } else if (lowerContext.includes("success") || lowerContext.includes("review") || lowerContext.includes("achievement")) {
      setMood("confident");
    } else if (lowerContext.includes("career") || lowerContext.includes("transition") || lowerContext.includes("future")) {
      setMood("hopeful");
    } else {
      setMood("neutral");
    }
  };

  // Analyze content text to determine appropriate mood
  const detectMoodFromContent = (content: string): MoodState => {
    const lowerContent = content.toLowerCase();
    
    // Urgent keywords
    const urgentKeywords = ["emergency", "immediate", "urgent", "crisis", "arrest", "investigation", "charges"];
    const urgentScore = urgentKeywords.filter(keyword => lowerContent.includes(keyword)).length;
    
    // Stressed keywords
    const stressedKeywords = ["court-martial", "article 15", "disciplinary", "misconduct", "violation", "punishment"];
    const stressedScore = stressedKeywords.filter(keyword => lowerContent.includes(keyword)).length;
    
    // Hopeful keywords
    const hopefulKeywords = ["career", "transition", "future", "opportunity", "growth", "potential", "planning"];
    const hopefulScore = hopefulKeywords.filter(keyword => lowerContent.includes(keyword)).length;
    
    // Confident keywords
    const confidentKeywords = ["success", "achievement", "victory", "cleared", "dismissed", "won", "favorable"];
    const confidentScore = confidentKeywords.filter(keyword => lowerContent.includes(keyword)).length;
    
    // Calm keywords
    const calmKeywords = ["education", "learn", "understand", "guide", "resource", "information", "knowledge"];
    const calmScore = calmKeywords.filter(keyword => lowerContent.includes(keyword)).length;
    
    // Determine mood based on highest score
    const scores = {
      urgent: urgentScore,
      stressed: stressedScore,
      hopeful: hopefulScore,
      confident: confidentScore,
      calm: calmScore
    };
    
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return "neutral";
    
    return Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as MoodState || "neutral";
  };

  return (
    <MoodContext.Provider value={{
      currentMood,
      colors,
      setMood,
      detectMoodFromContext,
      detectMoodFromContent
    }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}

// Hook for automatic mood detection based on page content
export function useMoodDetection() {
  const { detectMoodFromContext, detectMoodFromContent } = useMood();
  
  useEffect(() => {
    // Detect mood from current URL path
    const path = window.location.pathname;
    detectMoodFromContext(path);
  }, [detectMoodFromContext]);
  
  return { detectMoodFromContent };
}