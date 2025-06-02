import { useMood, type MoodState } from "@/contexts/MoodContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  AlertTriangle, 
  Brain, 
  Circle, 
  Lightbulb, 
  Award, 
  Waves 
} from "lucide-react";

const moodIcons = {
  urgent: AlertTriangle,
  stressed: Brain,
  neutral: Circle,
  hopeful: Lightbulb,
  confident: Award,
  calm: Waves
};

const moodLabels = {
  urgent: "Urgent",
  stressed: "High Stress",
  neutral: "Normal",
  hopeful: "Optimistic",
  confident: "Confident",
  calm: "Peaceful"
};

const moodDescriptions = {
  urgent: "Emergency support mode - prioritizing immediate assistance",
  stressed: "Focused support - streamlined for high-stress situations",
  neutral: "Standard interface - balanced for general use",
  hopeful: "Encouraging mode - highlighting opportunities and growth",
  confident: "Achievement mode - celebrating progress and success",
  calm: "Learning mode - optimized for education and reflection"
};

interface MoodSelectorProps {
  showLabel?: boolean;
  compact?: boolean;
}

export default function MoodIndicator({ showLabel = true, compact = false }: MoodSelectorProps) {
  const { currentMood, setMood, colors } = useMood();
  
  const Icon = moodIcons[currentMood];
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size={compact ? "sm" : "default"}
          className="flex items-center space-x-2 hover:bg-opacity-10"
          style={{ 
            color: colors.primary,
            backgroundColor: `${colors.secondary}80`
          }}
        >
          <Icon className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          {showLabel && !compact && (
            <span className="text-sm font-medium">
              {moodLabels[currentMood]}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-navy-700 mb-2">Interface Mood</h4>
            <p className="text-sm text-gray-600 mb-4">
              {moodDescriptions[currentMood]}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(moodIcons) as MoodState[]).map((mood) => {
              const MoodIcon = moodIcons[mood];
              const isActive = mood === currentMood;
              
              return (
                <Button
                  key={mood}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMood(mood)}
                  className={`flex items-center justify-start space-x-2 p-3 h-auto ${
                    isActive ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={isActive ? {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                    color: 'white'
                  } : {}}
                >
                  <MoodIcon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs font-medium">
                      {moodLabels[mood]}
                    </div>
                    <div className="text-xs opacity-70">
                      {mood === "urgent" && "Emergency"}
                      {mood === "stressed" && "High focus"}
                      {mood === "neutral" && "Balanced"}
                      {mood === "hopeful" && "Growth"}
                      {mood === "confident" && "Success"}
                      {mood === "calm" && "Learning"}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ 
                borderColor: colors.border,
                color: colors.text 
              }}
            >
              Auto-detected from page content
            </Badge>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}