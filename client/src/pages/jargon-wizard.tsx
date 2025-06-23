import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen, 
  Search, 
  Lightbulb, 
  MessageCircle, 
  Star, 
  ArrowRight,
  ArrowLeft,
  Zap,
  Target,
  Users,
  Award,
  Brain,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface JargonDefinition {
  term: string;
  legalDefinition: string;
  simplifiedDefinition: string;
  examples: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  militaryContext: string;
  relatedTerms: string[];
}

interface SimplificationRequest {
  text: string;
  context: string;
  audienceLevel: 'recruit' | 'nco' | 'officer';
}

export default function JargonWizard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<JargonDefinition | null>(null);
  const [simplificationText, setSimplificationText] = useState("");
  const [context, setContext] = useState("");
  const [audienceLevel, setAudienceLevel] = useState<'recruit' | 'nco' | 'officer'>('recruit');
  const [gameScore, setGameScore] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("search");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [libraryTerms, setLibraryTerms] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch popular terms
  const { data: popularTerms, isLoading: termsLoading } = useQuery({
    queryKey: ['/api/jargon/popular'],
  });

  // Search terms mutation
  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('POST', '/api/jargon/search', { query });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.results && data.results.length > 0) {
        setSelectedTerm(data.results[0]);
        toast({
          title: "Term found!",
          description: `Found ${data.totalFound} result(s) for "${data.query}"`,
        });
      } else {
        toast({
          title: "No results",
          description: "Try searching for terms like 'Article 15' or 'Court-martial'",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Search failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  // Text simplification mutation
  const simplifyMutation = useMutation({
    mutationFn: async (data: SimplificationRequest) => {
      const response = await apiRequest('POST', '/api/jargon/simplify', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Text simplified!",
        description: "Legal jargon has been translated to plain English",
      });
    },
    onError: (error) => {
      toast({
        title: "Simplification failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  // Quiz generation mutation
  const generateQuizMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/jargon/quiz');
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentQuiz(data);
    },
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchMutation.mutate(searchTerm);
    }
  };

  const handleSimplify = () => {
    if (simplificationText.trim()) {
      simplifyMutation.mutate({
        text: simplificationText,
        context,
        audienceLevel
      });
    }
  };

  const handleQuizAnswer = (answer: string) => {
    if (currentQuiz && answer === currentQuiz.correctAnswer) {
      setGameScore(gameScore + 10);
      toast({
        title: "Correct!",
        description: "+10 points added to your score",
      });
    } else {
      toast({
        title: "Not quite",
        description: "Try again or see the explanation",
        variant: "destructive",
      });
    }
  };

  const featuredTerms = [
    {
      term: "Article 15",
      simplifiedDefinition: "Non-judicial punishment - like getting grounded but in the military",
      category: "UCMJ",
      difficulty: "beginner" as const
    },
    {
      term: "Courts-Martial",
      simplifiedDefinition: "Military court trial - the serious version of military justice",
      category: "Military Justice",
      difficulty: "intermediate" as const
    },
    {
      term: "Administrative Separation",
      simplifiedDefinition: "Being discharged from military service for administrative reasons",
      category: "Separations",
      difficulty: "advanced" as const
    },
    {
      term: "Security Clearance",
      simplifiedDefinition: "Government background check that lets you access classified information",
      category: "Security",
      difficulty: "beginner" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full mr-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Legal Jargon Wizard</h1>
              <p className="text-xl text-gray-600 mt-2">
                Making military law simple, one term at a time ⚖️🪄
              </p>
            </div>
          </div>
          
          {/* Score Display */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Badge variant="outline" className="px-4 py-2">
              <Star className="h-4 w-4 mr-1" />
              Score: {gameScore}
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Target className="h-4 w-4 mr-1" />
              Terms Learned: 12
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Award className="h-4 w-4 mr-1" />
              Level: Apprentice
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Term Lookup
            </TabsTrigger>
            <TabsTrigger value="simplify" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Text Simplifier
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Knowledge Quiz
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Term Library
            </TabsTrigger>
          </TabsList>

          {/* Term Lookup Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Legal Terms
                </CardTitle>
                <CardDescription>
                  Enter any legal term and get it explained in plain English
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter legal term (e.g., 'Article 15', 'Court-martial')"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={searchMutation.isPending}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {/* Search Results */}
                {selectedTerm && (
                  <Card className="mt-4 border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-xl">{selectedTerm.term}</span>
                        <Badge variant={
                          selectedTerm.difficulty === 'beginner' ? 'default' :
                          selectedTerm.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                        }>
                          {selectedTerm.difficulty}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Simple Explanation:</h4>
                        <p className="text-lg text-gray-800">{selectedTerm.simplifiedDefinition}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Legal Definition:</h4>
                        <p className="text-sm text-gray-600">{selectedTerm.legalDefinition}</p>
                      </div>

                      {selectedTerm.examples && selectedTerm.examples.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Examples:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {selectedTerm.examples.map((example, i) => (
                              <li key={i} className="text-sm text-gray-600">{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Military Context:</h4>
                        <p className="text-sm text-gray-600">{selectedTerm.militaryContext}</p>
                      </div>

                      {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Related Terms:</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedTerm.relatedTerms.map((term, i) => (
                              <Badge key={i} variant="secondary" className="cursor-pointer"
                                onClick={() => setSearchTerm(term)}>
                                {term}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Featured Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <h3 className="col-span-full text-lg font-semibold text-gray-800 mb-2">Popular Terms</h3>
                  {featuredTerms.map((term, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSearchTerm(term.term);
                        searchMutation.mutate(term.term);
                      }}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{term.term}</h3>
                          <Badge variant={
                            term.difficulty === 'beginner' ? 'default' :
                            term.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                          }>
                            {term.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{term.simplifiedDefinition}</p>
                        <Badge variant="outline">{term.category}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Text Simplifier Tab */}
          <TabsContent value="simplify" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Legal Text Simplifier
                </CardTitle>
                <CardDescription>
                  Paste complex legal text and get it translated to plain English
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <select
                      id="audience"
                      value={audienceLevel}
                      onChange={(e) => setAudienceLevel(e.target.value as any)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="recruit">New Recruit</option>
                      <option value="nco">NCO Level</option>
                      <option value="officer">Officer Level</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="context">Context</Label>
                    <Input
                      id="context"
                      placeholder="e.g., Court-martial, Administrative"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleSimplify} 
                      disabled={simplifyMutation.isPending}
                      className="w-full"
                    >
                      {simplifyMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      Simplify
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="input-text">Legal Text (Original)</Label>
                    <Textarea
                      id="input-text"
                      placeholder="Paste your complex legal text here..."
                      value={simplificationText}
                      onChange={(e) => setSimplificationText(e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <div className="mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSimplificationText("The accused service member shall be subject to administrative separation pursuant to AR 635-200, notwithstanding any prior disciplinary action taken under Article 15 of the Uniform Code of Military Justice.")}
                      >
                        Try Sample Text
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Simplified Version</Label>
                    <div className="border rounded p-3 min-h-[200px] bg-green-50">
                      {simplifyMutation.data ? (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-green-800">Plain English Translation:</h4>
                          <p className="text-gray-700">{simplifyMutation.data.simplified}</p>
                          {simplifyMutation.data.keyTerms && (
                            <div>
                              <h5 className="font-medium text-sm text-gray-600 mt-3">Key Terms:</h5>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {simplifyMutation.data.keyTerms.map((term: string, i: number) => (
                                  <Badge key={i} variant="secondary">{term}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Simplified text will appear here...</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Quiz Tab */}
          <TabsContent value="quiz" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Legal Knowledge Quiz
                </CardTitle>
                <CardDescription>
                  Test your understanding and earn points!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentQuiz ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">{currentQuiz.question}</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {currentQuiz.options.map((option: string, index: number) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleQuizAnswer(option)}
                            className="text-left justify-start"
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => generateQuizMutation.mutate()}
                      variant="outline"
                    >
                      Next Question
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ready to test your knowledge?</h3>
                    <p className="text-gray-600 mb-4">
                      Take our interactive quiz and earn points while learning!
                    </p>
                    <Button 
                      onClick={() => generateQuizMutation.mutate()}
                      disabled={generateQuizMutation.isPending}
                    >
                      Start Quiz
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Term Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Legal Term Library
                </CardTitle>
                <CardDescription>
                  Browse our comprehensive collection of military legal terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'UCMJ', terms: 25, description: 'Uniform Code of Military Justice' },
                    { name: 'Court-Martial', terms: 18, description: 'Military court proceedings' },
                    { name: 'Administrative Law', terms: 22, description: 'Military administrative processes' },
                    { name: 'Security Clearance', terms: 15, description: 'Security and clearance terms' },
                    { name: 'Family Law', terms: 12, description: 'Military family issues' },
                    { name: 'Criminal Law', terms: 20, description: 'Military criminal justice' }
                  ].map((category) => (
                    <Card 
                      key={category.name} 
                      className="cursor-pointer hover:shadow-md transition-shadow hover:bg-blue-50"
                      onClick={async () => {
                        setSelectedCategory(category.name);
                        try {
                          const response = await fetch('/api/jargon/search', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ query: category.name })
                          });
                          const data = await response.json();
                          setLibraryTerms(data.terms || []);
                          toast({
                            title: `Browsing ${category.name}`,
                            description: `Found ${data.terms?.length || 0} terms in this category`,
                          });
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to load terms",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        <BookOpen className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{category.description}</p>
                        <p className="text-xs text-blue-600 font-medium">{category.terms} terms available</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Display selected category terms */}
            {selectedCategory && libraryTerms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {selectedCategory} Terms
                  </CardTitle>
                  <CardDescription>
                    {libraryTerms.length} terms found in {selectedCategory}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {libraryTerms.map((term, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h4 className="text-lg font-semibold text-blue-600">{term.term}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {term.difficulty}
                              </Badge>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-sm text-gray-700 mb-1">Legal Definition</h5>
                                <p className="text-sm text-gray-600">{term.legalDefinition}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm text-gray-700 mb-1">Plain English</h5>
                                <p className="text-sm text-green-700 font-medium">{term.simplifiedDefinition}</p>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-sm text-gray-700 mb-1">Military Context</h5>
                              <p className="text-sm text-gray-600">{term.militaryContext}</p>
                            </div>

                            {term.examples && term.examples.length > 0 && (
                              <div>
                                <h5 className="font-medium text-sm text-gray-700 mb-1">Examples</h5>
                                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                  {term.examples.map((example, i) => (
                                    <li key={i}>{example}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {term.relatedTerms && term.relatedTerms.length > 0 && (
                              <div>
                                <h5 className="font-medium text-sm text-gray-700 mb-1">Related Terms</h5>
                                <div className="flex flex-wrap gap-2">
                                  {term.relatedTerms.map((related, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {related}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Back to categories button */}
            {selectedCategory && (
              <Card>
                <CardContent className="p-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedCategory(null);
                      setLibraryTerms([]);
                    }}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    Back to Categories
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Fun Facts Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Did You Know?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm">
                💡 <strong>Fun Fact:</strong> The term "court-martial" comes from French and literally means "court of Mars" 
                (the Roman god of war). It's been used in military justice since the 1600s!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}