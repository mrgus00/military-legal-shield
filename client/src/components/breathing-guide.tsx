import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface BreathingGuideProps {
  exerciseType: "tactical" | "box" | "478";
  onClose?: () => void;
}

export default function BreathingGuide({ exerciseType, onClose }: BreathingGuideProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "pause">("inhale");
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycle, setCycle] = useState(0);

  const exercises = {
    tactical: {
      name: "Tactical Breathing",
      pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
      description: "Military-tested 4-4-4-4 pattern for stress control"
    },
    box: {
      name: "Box Breathing", 
      pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
      description: "Square breathing used by special forces"
    },
    478: {
      name: "4-7-8 Breathing",
      pattern: { inhale: 4, hold: 7, exhale: 8, pause: 0 },
      description: "Natural tranquilizer for the nervous system"
    }
  };

  const currentExercise = exercises[exerciseType];
  const { pattern } = currentExercise;

  const phaseSequence: Array<keyof typeof pattern> = ["inhale", "hold", "exhale", "pause"];
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 0.1);
      }, 100);
    } else if (isActive && timeLeft <= 0) {
      // Move to next phase
      const currentPhaseIndex = phaseSequence.indexOf(phase);
      const nextPhaseIndex = (currentPhaseIndex + 1) % phaseSequence.length;
      const nextPhase = phaseSequence[nextPhaseIndex];
      
      if (nextPhase === "inhale") {
        setCycle(c => c + 1);
      }
      
      setPhase(nextPhase);
      setTimeLeft(pattern[nextPhase]);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, pattern]);

  const startExercise = () => {
    setIsActive(true);
    setPhase("inhale");
    setTimeLeft(pattern.inhale);
    setCycle(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimeLeft(0);
    setCycle(0);
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale": return "from-sage-200 to-sage-300";
      case "hold": return "from-military-gold-200 to-military-gold-300";
      case "exhale": return "from-navy-200 to-navy-300";
      case "pause": return "from-warm-gray-200 to-warm-gray-300";
      default: return "from-sage-200 to-sage-300";
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      case "pause": return "Pause";
      default: return "Ready";
    }
  };

  const circleScale = () => {
    if (!isActive) return "scale-100";
    
    const progress = 1 - (timeLeft / pattern[phase]);
    
    switch (phase) {
      case "inhale": return `scale-${Math.floor(100 + progress * 50)}`;
      case "exhale": return `scale-${Math.floor(150 - progress * 50)}`;
      default: return "scale-125";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-sage-50 to-white border-sage-200">
      <CardHeader className="text-center">
        <CardTitle className="text-navy-700">{currentExercise.name}</CardTitle>
        <p className="text-sm text-navy-600">{currentExercise.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Breathing Circle */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div 
              className={`absolute w-32 h-32 rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-300 ease-in-out ${circleScale()}`}
            />
            <div className="absolute text-center text-navy-700">
              <div className="text-lg font-semibold">{getPhaseInstruction()}</div>
              <div className="text-2xl font-bold">{Math.ceil(timeLeft)}</div>
            </div>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="flex justify-center space-x-2">
          {phaseSequence.map((p, index) => (
            pattern[p] > 0 && (
              <div
                key={p}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  phase === p
                    ? "bg-sage-200 text-sage-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)} {pattern[p]}s
              </div>
            )
          ))}
        </div>

        {/* Cycle Counter */}
        <div className="text-center">
          <div className="text-sm text-navy-600">Completed Cycles</div>
          <div className="text-xl font-bold text-navy-700">{cycle}</div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          {!isActive ? (
            <Button onClick={startExercise} className="bg-sage-500 hover:bg-sage-600">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={pauseExercise} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={resetExercise} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Tips */}
        <div className="bg-sage-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sage-800 mb-2">Tips:</h4>
          <ul className="text-sm text-sage-700 space-y-1">
            <li>• Find a comfortable position</li>
            <li>• Focus on the visual guide</li>
            <li>• Don't force your breathing</li>
            <li>• Practice regularly for best results</li>
          </ul>
        </div>

        {onClose && (
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        )}
      </CardContent>
    </Card>
  );
}