import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";

interface MeditationSession {
  id: string;
  title: string;
  duration: number; // in minutes
  description: string;
  type: "guided" | "ambient" | "breathing";
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface MeditationPlayerProps {
  session: MeditationSession;
  onComplete?: () => void;
}

export default function MeditationPlayer({ session, onComplete }: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const totalSeconds = session.duration * 60;
  const progress = (currentTime / totalSeconds) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTime < totalSeconds) {
      interval = setInterval(() => {
        setCurrentTime(time => {
          const newTime = time + 1;
          if (newTime >= totalSeconds) {
            setIsPlaying(false);
            onComplete?.();
            return totalSeconds;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, totalSeconds, onComplete]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const skip = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(totalSeconds, currentTime + seconds)));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = () => {
    switch (session.difficulty) {
      case "beginner": return "text-sage-600";
      case "intermediate": return "text-military-gold-600";
      case "advanced": return "text-navy-600";
      default: return "text-sage-600";
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-gradient-to-br from-sage-50 to-white border-sage-200">
      <CardHeader className="text-center">
        <CardTitle className="text-navy-700">{session.title}</CardTitle>
        <p className="text-sm text-navy-600">{session.description}</p>
        <div className="flex justify-center space-x-2 mt-2">
          <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${getDifficultyColor()}`}>
            {session.difficulty}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-sage-100 text-sage-700">
            {session.duration} min
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Meditation Visual */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-sage-200 to-sage-300 ${isPlaying ? 'animate-pulse' : ''}`} />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-sage-100 to-white" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-sage-50 to-sage-100" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-navy-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalSeconds)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => skip(-30)}
            disabled={currentTime === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={togglePlayPause}
            size="lg"
            className="bg-sage-500 hover:bg-sage-600 rounded-full w-16 h-16"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => skip(30)}
            disabled={currentTime >= totalSeconds}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <Volume2 className="h-4 w-4 text-navy-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-sage-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-navy-600 w-8">{Math.round(volume * 100)}</span>
        </div>

        {/* Session Info */}
        <div className="bg-sage-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sage-800 mb-2">Session Guide:</h4>
          <ul className="text-sm text-sage-700 space-y-1">
            {session.type === "guided" && (
              <>
                <li>• Follow the voice instructions</li>
                <li>• Focus on your breathing</li>
                <li>• Let thoughts pass without judgment</li>
              </>
            )}
            {session.type === "ambient" && (
              <>
                <li>• Use the sounds as a focus point</li>
                <li>• Find a comfortable position</li>
                <li>• Allow your mind to settle naturally</li>
              </>
            )}
            {session.type === "breathing" && (
              <>
                <li>• Follow the breathing rhythm</li>
                <li>• Count breaths if it helps focus</li>
                <li>• Return attention to breath when distracted</li>
              </>
            )}
          </ul>
        </div>

        {/* Reset Button */}
        <Button onClick={restart} variant="outline" className="w-full">
          Start Over
        </Button>
      </CardContent>
    </Card>
  );
}