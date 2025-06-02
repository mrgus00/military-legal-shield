import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import SecurityReminder from "@/components/security-reminder";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import ForumQuestionCard from "@/components/forum-question-card";
import ForumPostForm from "@/components/forum-post-form";
import { ForumQuestion, ForumAnswer } from "@shared/schema";

export default function Forum() {
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const { data: questions = [], isLoading } = useQuery<ForumQuestion[]>({
    queryKey: ['/api/forum/questions', selectedCategory !== "all" ? selectedCategory : undefined],
  });

  const { data: answers = [] } = useQuery<ForumAnswer[]>({
    queryKey: ['/api/forum/answers'],
  });

  // Group answers by question ID
  const answersByQuestion = answers.reduce((acc, answer) => {
    if (!answer.questionId) return acc;
    if (!acc[answer.questionId]) {
      acc[answer.questionId] = [];
    }
    acc[answer.questionId].push(answer);
    return acc;
  }, {} as Record<number, ForumAnswer[]>);

  // Filter and sort questions
  const filteredQuestions = questions
    .filter(question => {
      const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || question.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "popular":
          return (b.upvotes || 0) - (a.upvotes || 0);
        case "unanswered":
          const aAnswers = answersByQuestion[a.id]?.length || 0;
          const bAnswers = answersByQuestion[b.id]?.length || 0;
          return aAnswers - bAnswers;
        case "urgent":
          return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0);
        default:
          return 0;
      }
    });

  const categories = [
    { value: "all", label: "All Categories", count: questions.length },
    { value: "Court-Martial", label: "Court-Martial", count: questions.filter(q => q.category === "Court-Martial").length },
    { value: "Administrative", label: "Administrative", count: questions.filter(q => q.category === "Administrative").length },
    { value: "Security Clearance", label: "Security Clearance", count: questions.filter(q => q.category === "Security Clearance").length },
    { value: "Military Justice", label: "Military Justice", count: questions.filter(q => q.category === "Military Justice").length },
    { value: "Benefits", label: "Benefits & VA", count: questions.filter(q => q.category === "Benefits").length },
    { value: "General", label: "General Legal", count: questions.filter(q => q.category === "General").length },
  ];

  const urgentQuestions = questions.filter(q => q.isUrgent).length;
  const unansweredQuestions = questions.filter(q => !(answersByQuestion[q.id]?.length > 0)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                Military Community Forum
              </h1>
              <p className="mt-2 text-gray-600">
                Connect with fellow service members, share experiences, and get legal guidance from the community.
              </p>
            </div>
            <Button onClick={() => setShowPostForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ask Question
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Questions</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-1">{questions.length}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">Urgent</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{urgentQuestions}</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">Unanswered</span>
              </div>
              <p className="text-2xl font-bold text-red-900 mt-1">{unansweredQuestions}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Active Today</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {questions.filter(q => {
                  const today = new Date();
                  const questionDate = new Date(q.createdAt || 0);
                  return questionDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Security Reminder */}
        <div className="mb-6">
          <SecurityReminder />
        </div>

        {showPostForm && (
          <div className="mb-6">
            <ForumPostForm onCancel={() => setShowPostForm(false)} />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Search */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Questions
              </h3>
              <Input
                placeholder="Search by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Sort Options */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Sort By
              </h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="unanswered">Unanswered First</SelectItem>
                  <SelectItem value="urgent">Urgent First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Categories */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Community Guidelines</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Be respectful and professional</li>
                <li>• No personal identifying information</li>
                <li>• Responses are not official legal advice</li>
                <li>• For emergencies, contact your command</li>
                <li>• Help others by sharing your experience</li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedCategory !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Be the first to ask a question!"}
                </p>
                {!showPostForm && (
                  <Button onClick={() => setShowPostForm(true)}>
                    Ask the First Question
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredQuestions.map((question) => (
                  <ForumQuestionCard
                    key={question.id}
                    question={question}
                    answers={answersByQuestion[question.id] || []}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}