import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Target,
  Zap,
  Trophy,
  ChevronRight,
  Timer
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { MicroChallenge } from "@shared/schema";

interface MicroChallengeCardProps {
  challenge: MicroChallenge;
  onComplete?: (correct: boolean, timeSpent: number) => void;
}

export default function MicroChallengeCard({ challenge, onComplete }: MicroChallengeCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit || 60);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime] = useState(Date.now());
  
  const queryClient = useQueryClient();

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, (challenge.timeLimit || 60) - elapsed);
      
      setTimeLeft(remaining);
      setTimeSpent(elapsed);

      if (remaining === 0) {
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, challenge.timeLimit, startTime]);

  const submitMutation = useMutation({
    mutationFn: async (answer: string) => {
      return await apiRequest('POST', '/api/micro-challenges/attempt', {
        challengeId: challenge.id,
        userAnswer: answer,
        timeSpent,
        userId: 1 // Mock user ID
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/challenge-stats'] });
      setIsCorrect(data.isCorrect);
      setShowExplanation(true);
      onComplete?.(data.isCorrect, timeSpent);
    }
  });

  const handleTimeUp = () => {
    if (!isSubmitted) {
      handleSubmit(selectedAnswer || "");
    }
  };

  const handleSubmit = (answer: string) => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    const correct = answer === challenge.correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    submitMutation.mutate(answer);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'quiz':
        return Target;
      case 'scenario':
        return Lightbulb;
      case 'case-study':
        return Trophy;
      default:
        return Target;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((challenge.timeLimit || 60) - timeLeft) / (challenge.timeLimit || 60) * 100;
  const CategoryIcon = getCategoryIcon(challenge.category);

  return (
    <Card className={`transition-all duration-300 ${
      isSubmitted 
        ? isCorrect 
          ? 'border-green-300 bg-green-50' 
          : 'border-red-300 bg-red-50'
        : 'hover:shadow-lg'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-lg">
              <CategoryIcon className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {challenge.points} pts
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-gray-500" />
            <span className={`text-sm font-mono ${
              timeLeft <= 10 ? 'text-red-600 font-bold' : 'text-gray-600'
            }`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {challenge.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">
          {challenge.description}
        </p>

        {/* Timer Progress Bar */}
        <div className="space-y-1">
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${timeLeft <= 10 ? 'bg-red-100' : 'bg-gray-200'}`}
          />
          <div className="text-xs text-gray-500 text-right">
            Time: {formatTime(timeSpent)} / {formatTime(challenge.timeLimit || 60)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">{challenge.question}</h4>
          
          {challenge.questionType === 'multiple-choice' && challenge.options && (
            <RadioGroup 
              value={selectedAnswer} 
              onValueChange={setSelectedAnswer}
              disabled={isSubmitted}
              className="space-y-2"
            >
              {challenge.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className={`text-sm cursor-pointer ${
                      isSubmitted && isCorrect !== null
                        ? option === challenge.correctAnswer
                          ? 'text-green-700 font-medium'
                          : option === selectedAnswer && !isCorrect
                          ? 'text-red-700'
                          : 'text-gray-600'
                        : ''
                    }`}
                  >
                    {option}
                    {isSubmitted && option === challenge.correctAnswer && (
                      <CheckCircle className="inline-block ml-2 h-4 w-4 text-green-600" />
                    )}
                    {isSubmitted && option === selectedAnswer && !isCorrect && (
                      <XCircle className="inline-block ml-2 h-4 w-4 text-red-600" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {challenge.questionType === 'true-false' && (
            <RadioGroup 
              value={selectedAnswer} 
              onValueChange={setSelectedAnswer}
              disabled={isSubmitted}
              className="space-y-2"
            >
              {['True', 'False'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label 
                    htmlFor={option} 
                    className={`text-sm cursor-pointer ${
                      isSubmitted && isCorrect !== null
                        ? option === challenge.correctAnswer
                          ? 'text-green-700 font-medium'
                          : option === selectedAnswer && !isCorrect
                          ? 'text-red-700'
                          : 'text-gray-600'
                        : ''
                    }`}
                  >
                    {option}
                    {isSubmitted && option === challenge.correctAnswer && (
                      <CheckCircle className="inline-block ml-2 h-4 w-4 text-green-600" />
                    )}
                    {isSubmitted && option === selectedAnswer && !isCorrect && (
                      <XCircle className="inline-block ml-2 h-4 w-4 text-red-600" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        {/* Result and Explanation */}
        {showExplanation && (
          <div className={`p-4 rounded-lg border ${
            isCorrect 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
              {isCorrect && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  +{challenge.points} pts
                </Badge>
              )}
            </div>
            <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {challenge.explanation}
            </p>
          </div>
        )}

        {/* Action Button */}
        {!isSubmitted ? (
          <Button 
            onClick={() => handleSubmit(selectedAnswer)}
            disabled={!selectedAnswer || timeLeft === 0}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            Submit Answer
          </Button>
        ) : (
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Trophy className="h-4 w-4 mr-2" />
            Challenge Complete!
          </div>
        )}

        {/* Tags */}
        {challenge.tags && challenge.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
            {challenge.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}