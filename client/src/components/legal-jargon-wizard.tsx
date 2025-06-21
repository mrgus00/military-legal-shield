import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  BookOpen, 
  Lightbulb, 
  Search, 
  Wand2, 
  Brain, 
  Target, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Scale,
  Users,
  Copy,
  Download
} from "lucide-react";

interface LegalTerm {
  term: string;
  simplification: string;
  explanation: string;
  context: string;
  example: string;
  category: "military" | "criminal" | "administrative" | "veterans" | "family";
  difficulty: "basic" | "intermediate" | "advanced";
  relatedTerms: string[];
}

interface JargonWizardProps {}

export default function LegalJargonWizard({}: JargonWizardProps) {
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [simplificationResult, setSimplificationResult] = useState<any>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const { toast } = useToast();

  // Comprehensive military legal terms database
  const legalTerms: LegalTerm[] = [
    {
      term: "Court-Martial",
      simplification: "Military Trial",
      explanation: "A court-martial is essentially a military trial where service members are judged by other military personnel for alleged crimes or misconduct.",
      context: "Used when a service member is accused of violating military law (UCMJ)",
      example: "Instead of going to civilian court, Sergeant Smith faced a court-martial for the charges against him.",
      category: "military",
      difficulty: "basic",
      relatedTerms: ["UCMJ", "Article 15", "General Court-Martial"]
    },
    {
      term: "Article 15",
      simplification: "Non-Judicial Punishment",
      explanation: "Article 15 is like getting a ticket instead of going to court - it's a way for commanders to handle minor infractions without a full trial.",
      context: "Used for minor disciplinary issues that don't warrant a court-martial",
      example: "The captain received an Article 15 for being late to formation repeatedly, which meant extra duty but no criminal record.",
      category: "military",
      difficulty: "basic",
      relatedTerms: ["Court-Martial", "UCMJ", "Non-Judicial Punishment"]
    },
    {
      term: "UCMJ",
      simplification: "Military Rule Book",
      explanation: "The Uniform Code of Military Justice (UCMJ) is the complete set of laws that govern military personnel - think of it as the military's legal rulebook.",
      context: "The foundation of all military legal proceedings",
      example: "Under the UCMJ, service members follow different rules than civilians, including specific military crimes like desertion.",
      category: "military",
      difficulty: "intermediate",
      relatedTerms: ["Court-Martial", "Article 15", "Military Justice"]
    },
    {
      term: "Administrative Separation",
      simplification: "Military Discharge Process",
      explanation: "Administrative separation is the formal process of removing someone from military service, similar to being fired from a civilian job but with specific military procedures.",
      context: "Used when the military wants to discharge a service member for various reasons",
      example: "After multiple disciplinary issues, Private Johnson faced administrative separation rather than criminal charges.",
      category: "administrative",
      difficulty: "intermediate",
      relatedTerms: ["Discharge", "Chapter Action", "Separation Board"]
    },
    {
      term: "Security Clearance",
      simplification: "Government Trust Level",
      explanation: "A security clearance is like a trust badge that shows the government believes you can handle secret information responsibly.",
      context: "Required for military jobs that involve classified information",
      example: "To work in intelligence, you need a security clearance, which involves a thorough background check.",
      category: "administrative",
      difficulty: "basic",
      relatedTerms: ["Clearance Investigation", "Background Check", "Classified Information"]
    },
    {
      term: "JAG Officer",
      simplification: "Military Lawyer",
      explanation: "A JAG (Judge Advocate General) officer is a military lawyer who provides legal services to service members and the military.",
      context: "Military legal representation and advice",
      example: "When facing court-martial charges, you have the right to be represented by a JAG officer at no cost.",
      category: "military",
      difficulty: "basic",
      relatedTerms: ["Military Defense Counsel", "Legal Assistance", "Court-Martial"]
    },
    {
      term: "VA Disability Rating",
      simplification: "Injury Compensation Level",
      explanation: "A VA disability rating is a percentage (0-100%) that determines how much monthly compensation you receive for injuries or illnesses caused by military service.",
      context: "Veterans Affairs compensation for service-connected disabilities",
      example: "A 30% VA disability rating means you receive monthly payments for a service-connected injury that affects your daily life.",
      category: "veterans",
      difficulty: "basic",
      relatedTerms: ["Service-Connected Disability", "VA Compensation", "Disability Benefits"]
    },
    {
      term: "Service-Connected Disability",
      simplification: "Military-Caused Injury/Illness",
      explanation: "A service-connected disability is any injury, illness, or condition that happened because of or was made worse by your military service.",
      context: "Basis for VA disability compensation and benefits",
      example: "Hearing loss from exposure to loud aircraft engines would be considered a service-connected disability.",
      category: "veterans",
      difficulty: "basic",
      relatedTerms: ["VA Disability Rating", "VA Compensation", "Military Medical Records"]
    },
    {
      term: "Nonjudicial Punishment (NJP)",
      simplification: "Commander's Discipline",
      explanation: "NJP is when your commander disciplines you without going to court - like a parent grounding you instead of calling the police.",
      context: "Alternative to court-martial for minor offenses",
      example: "Instead of court-martial, the soldier received NJP for missing formation, resulting in extra duty and loss of pay.",
      category: "military",
      difficulty: "basic",
      relatedTerms: ["Article 15", "Summary Court-Martial", "Military Discipline"]
    },
    {
      term: "PCS Orders",
      simplification: "Moving Instructions",
      explanation: "PCS (Permanent Change of Station) orders are official instructions telling you to move to a new military base or assignment.",
      context: "Military relocation and assignment changes",
      example: "Receiving PCS orders to Germany means the military is paying to move you and your family there for your next assignment.",
      category: "administrative",
      difficulty: "basic",
      relatedTerms: ["Military Assignment", "Relocation", "Duty Station"]
    },
    {
      term: "Dependent",
      simplification: "Military Family Member",
      explanation: "A dependent is a family member (spouse, child) who relies on the service member for support and is eligible for military benefits.",
      context: "Family members eligible for military benefits and services",
      example: "Your spouse and children are dependents, which means they can use the military hospital and live in base housing.",
      category: "family",
      difficulty: "basic",
      relatedTerms: ["Military Benefits", "Family Separation Allowance", "Military Housing"]
    },
    {
      term: "General Discharge",
      simplification: "Standard Military Exit",
      explanation: "A general discharge is leaving the military with an overall satisfactory record, though not perfect - like graduating with a C average.",
      context: "Type of military discharge affecting veteran benefits",
      example: "A general discharge means you served honorably overall but had some issues, and you'll still get most veteran benefits.",
      category: "administrative",
      difficulty: "intermediate",
      relatedTerms: ["Honorable Discharge", "Other Than Honorable", "Veteran Benefits"]
    }
  ];

  const categories = [
    { id: "all", label: "All Categories", icon: BookOpen },
    { id: "military", label: "Military Law", icon: Scale },
    { id: "criminal", label: "Criminal Defense", icon: AlertCircle },
    { id: "administrative", label: "Administrative", icon: Users },
    { id: "veterans", label: "Veterans Affairs", icon: Target },
    { id: "family", label: "Family Law", icon: Users }
  ];

  const filteredTerms = legalTerms.filter(term => {
    const matchesCategory = currentCategory === "all" || term.category === currentCategory;
    const matchesSearch = searchTerm === "" || 
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.simplification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSimplifyText = async () => {
    if (!inputText.trim()) return;
    
    setIsSimplifying(true);
    
    try {
      const response = await apiRequest('POST', '/api/simplify-legal-text', { 
        text: inputText 
      });
      
      setSimplificationResult(response);
      setSimplifiedText(response.simplifiedText);
      
      toast({
        title: "Text Simplified Successfully!",
        description: `${response.termsReplaced} legal terms were simplified.`,
      });
      
    } catch (error) {
      console.error('Error simplifying text:', error);
      toast({
        title: "Simplification Error",
        description: "Failed to simplify text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSimplifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  const downloadAsText = (text: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "File Downloaded",
      description: `${filename} has been downloaded.`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "basic": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "military": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "criminal": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "administrative": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "veterans": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "family": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Wand2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Legal Jargon Simplification Wizard</h1>
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Transform complex legal language into plain English that makes sense. 
          No more confusion - just clear, simple explanations of military legal terms.
        </p>
      </div>

      {/* Text Simplification Tool */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Magic Text Simplifier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Paste your legal document or text here:</label>
            <Textarea
              placeholder="Example: 'The accused service member will be subject to nonjudicial punishment under Article 15 of the UCMJ for violations of military regulations...'"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>
          
          <Button 
            onClick={handleSimplifyText}
            disabled={!inputText.trim() || isSimplifying}
            className="w-full"
          >
            {isSimplifying ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-spin" />
                Simplifying Magic in Progress...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Cast Simplification Spell
              </>
            )}
          </Button>
          
          {simplifiedText && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800 dark:text-green-200">Simplified Version:</h4>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(simplifiedText)}
                      className="h-8 px-2"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadAsText(simplifiedText, 'simplified-legal-text.txt')}
                      className="h-8 px-2"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <p className="text-green-700 dark:text-green-300 leading-relaxed mb-3">
                  {simplifiedText}
                </p>
                {simplificationResult && (
                  <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {simplificationResult.explanation}
                    </p>
                    {simplificationResult.termsReplaced > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        ✓ Simplified {simplificationResult.termsReplaced} legal terms
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Term Explorer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Legal Term Explorer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <Input
              placeholder="Search for legal terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={currentCategory === category.id ? "default" : "outline"}
                    onClick={() => setCurrentCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="w-4 h-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTerms.map((term, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-lg">{term.term}</h4>
                      <div className="flex gap-1">
                        <Badge className={getDifficultyColor(term.difficulty)}>
                          {term.difficulty}
                        </Badge>
                        <Badge className={getCategoryColor(term.category)}>
                          {term.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <ArrowRight className="w-4 h-4" />
                      <span className="font-medium">{term.simplification}</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-blue-600 dark:text-blue-400">What it means:</span>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{term.explanation}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-purple-600 dark:text-purple-400">When it's used:</span>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{term.context}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-orange-600 dark:text-orange-400">Example:</span>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 italic">"{term.example}"</p>
                    </div>
                    
                    {term.relatedTerms.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Related terms:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {term.relatedTerms.map((related, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
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

          {filteredTerms.length === 0 && (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No terms found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or selecting a different category.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Pro Tips for Understanding Legal Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400">When Reading Legal Documents:</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Break down long sentences into smaller parts</li>
                <li>• Look for the main action or decision being described</li>
                <li>• Don't be afraid to ask for clarification</li>
                <li>• Use this wizard to translate confusing terms</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600 dark:text-green-400">Red Flags to Watch For:</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Deadlines for responses or actions</li>
                <li>• Your rights and available options</li>
                <li>• Consequences of different choices</li>
                <li>• Requirements you must meet</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}