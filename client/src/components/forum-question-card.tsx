import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  ThumbsUp, 
  Clock, 
  User,
  Send,
  Shield,
  Award,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { ForumQuestion, ForumAnswer } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ForumQuestionCardProps {
  question: ForumQuestion;
  answers?: ForumAnswer[];
}

export default function ForumQuestionCard({ question, answers = [] }: ForumQuestionCardProps) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const queryClient = useQueryClient();

  const answerMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest('POST', '/api/forum/answers', {
        questionId: question.id,
        content,
        userId: 1, // Mock user ID
        isExpert: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/questions'] });
      queryClient.invalidateQueries({ queryKey: [`/api/forum/questions/${question.id}/answers`] });
      setNewAnswer("");
      setIsSubmitting(false);
    }
  });

  const upvoteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', `/api/forum/questions/${question.id}/upvote`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/questions'] });
    }
  });

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) return;
    setIsSubmitting(true);
    answerMutation.mutate(newAnswer.trim());
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'court-martial':
        return Shield;
      case 'administrative':
        return Award;
      case 'general':
        return MessageSquare;
      default:
        return MessageSquare;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'court-martial':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'administrative':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'urgent':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const IconComponent = getCategoryIcon(question.category || 'general');

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-2">
            <IconComponent className="h-5 w-5 text-blue-600" />
            <Badge variant="outline" className={getCategoryColor(question.category || 'general')}>
              {question.category}
            </Badge>
            {question.isUrgent && (
              <Badge variant="destructive" className="text-xs">
                Urgent
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {formatTimeAgo(question.createdAt)}
          </div>
        </div>
        
        <CardTitle className="text-lg leading-tight">{question.title}</CardTitle>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{question.branch || 'Service Member'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{answers.length} answers</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{question.upvotes || 0} helpful</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{question.content}</p>
        </div>
        
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {question.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => upvoteMutation.mutate()}
              disabled={upvoteMutation.isPending}
              className="flex items-center gap-1"
            >
              <ThumbsUp className="h-4 w-4" />
              Helpful ({question.upvotes || 0})
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center gap-1"
            >
              {showAnswers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showAnswers ? 'Hide' : 'Show'} Answers ({answers.length})
            </Button>
          </div>
        </div>
        
        {showAnswers && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            {answers.map((answer) => (
              <div key={answer.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {answer.isExpert ? 'Legal Expert' : 'Service Member'}
                    </span>
                    {answer.isExpert && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        Verified Expert
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(answer.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{answer.content}</p>
                {answer.upvotes && answer.upvotes > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                    <ThumbsUp className="h-3 w-3" />
                    {answer.upvotes} helpful
                  </div>
                )}
              </div>
            ))}
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Add your answer or advice:
                </label>
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Share your experience, advice, or legal insights..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              
              <Button
                onClick={handleSubmitAnswer}
                disabled={!newAnswer.trim() || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Post Answer
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}