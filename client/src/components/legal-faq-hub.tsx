import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Search, ChevronDown, ChevronRight, Clock, Star, MessageSquare, AlertTriangle, Scale, Globe, BookOpen, Gavel, Users, Shield, FileText } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  urgency: "critical" | "high" | "medium" | "low";
  lastUpdated: string;
  helpfulVotes: number;
  tags: string[];
  relatedQuestions: string[];
  languages: string[];
}

const faqs: FAQ[] = [
  {
    id: "article-15-rights",
    question: "What are my rights during an Article 15 proceeding?",
    answer: "Under Article 15 (Non-Judicial Punishment), you have several critical rights: 1) Right to remain silent under Article 31 UCMJ - you cannot be compelled to make statements that could incriminate you. 2) Right to examine all evidence against you, including witness statements and documentary evidence. 3) Right to present matters in defense, extenuation, and mitigation - you can provide your side of the story and any circumstances that might reduce punishment. 4) Right to demand trial by court-martial instead of accepting Article 15 punishment (in most cases). 5) Right to legal consultation with a defense attorney or legal assistance officer. IMPORTANT: You typically have 3 duty days to decide whether to demand trial by court-martial. Do not admit guilt without consulting legal counsel first.",
    category: "Article 15/NJP",
    urgency: "critical",
    lastUpdated: "2024-12-01",
    helpfulVotes: 147,
    tags: ["article-15", "njp", "rights", "ucmj", "defense"],
    relatedQuestions: ["Can I refuse Article 15?", "What happens if I demand court-martial?", "How long does Article 15 process take?"],
    languages: ["English", "Spanish", "German", "Japanese", "Korean"]
  },
  {
    id: "security-clearance-issues",
    question: "What should I do if I receive a Statement of Reasons (SOR) for my security clearance?",
    answer: "A Statement of Reasons (SOR) is a formal document outlining security concerns about your clearance eligibility. You have 30 calendar days from receipt to respond. Your options: 1) Submit a written response addressing each concern with supporting documentation, mitigation evidence, and character references. 2) Request a hearing before an administrative judge within 20 days of submitting your response. 3) Both - submit written response AND request hearing for maximum advocacy. Key actions: Engage a qualified security clearance attorney within 15 days if possible. Gather all supporting documents: financial records, character references, medical records, court documents. Address each SOR allegation specifically with facts and mitigation. Consider the 13 adjudicative guidelines and whole-person factors. Never ignore an SOR - failure to respond results in automatic clearance denial.",
    category: "Security Clearance",
    urgency: "high",
    lastUpdated: "2024-11-28",
    helpfulVotes: 128,
    tags: ["security-clearance", "sor", "sead-4", "adjudication", "hearing"],
    relatedQuestions: ["How long does security clearance investigation take?", "Can I appeal clearance denial?", "What disqualifies someone from security clearance?"],
    languages: ["English", "Spanish", "German"]
  },
  {
    id: "sharp-reporting-options",
    question: "What's the difference between restricted and unrestricted SHARP reporting?",
    answer: "SHARP (Sexual Harassment/Assault Response & Prevention) offers two reporting options with different outcomes: RESTRICTED REPORT: Confidential reporting to SARC, chaplain, or healthcare provider. Triggers victim services and medical care but NO investigation or command notification. Allows victim to maintain control and receive support while deciding future actions. Can be changed to unrestricted later but not vice versa. UNRESTRICTED REPORT: Formal report that triggers official investigation and command notification. Provides same victim services as restricted plus full investigative process. May lead to prosecution and command action. Victim receives Special Victims Counsel (SVC) representation. IMPORTANT: Both options provide victim advocacy, medical care, and mental health services. Retaliation against reporters is prohibited under Article 92 UCMJ. Emergency medical care and safety come first - reporting decisions can be made later.",
    category: "SHARP/Sexual Assault",
    urgency: "critical",
    lastUpdated: "2024-12-02",
    helpfulVotes: 156,
    tags: ["sharp", "sexual-assault", "reporting", "victim-services", "confidential"],
    relatedQuestions: ["Who is a SARC?", "What is Special Victims Counsel?", "Can I change from restricted to unrestricted report?"],
    languages: ["English", "Spanish", "German", "Japanese"]
  },
  {
    id: "overseas-jurisdiction",
    question: "What happens if I'm arrested by local authorities while stationed overseas?",
    answer: "When arrested overseas, jurisdiction depends on your Status of Forces Agreement (SOFA) and local laws: IMMEDIATE ACTIONS: 1) Request to contact U.S. embassy/consulate and your command immediately. 2) Invoke right to remain silent - don't make statements without legal counsel. 3) Ask for U.S. military legal representation if available. 4) Document everything: arrest location, time, charges, treatment. JURISDICTION RULES: Host nation has primary jurisdiction for crimes against local laws. U.S. military may have jurisdiction for military-specific offenses. Some SOFAs allow transfer to U.S. military custody for service members. Serious crimes may result in concurrent jurisdiction. YOUR RIGHTS: Consular notification and access to U.S. officials. Right to legal representation (local and U.S. military if applicable). Protection from torture and inhumane treatment. Fair trial procedures under local law. CRITICAL: Contact base legal office and Area Defense Counsel immediately. Embassy can provide consular services and monitor your treatment.",
    category: "Overseas/International",
    urgency: "critical",
    lastUpdated: "2024-11-30",
    helpfulVotes: 94,
    tags: ["overseas", "arrest", "sofa", "jurisdiction", "consular-services"],
    relatedQuestions: ["What is a Status of Forces Agreement?", "Can I be court-martialed for overseas crimes?", "How do I contact U.S. embassy?"],
    languages: ["English", "Spanish", "German", "Japanese", "Korean", "Italian"]
  },
  {
    id: "court-martial-types",
    question: "What are the different types of court-martial and their maximum punishments?",
    answer: "The UCMJ establishes three types of court-martial with different authority levels: SUMMARY COURT-MARTIAL: Simplest form for minor offenses. No right to military defense counsel (but can hire civilian). Maximum punishment: 30 days confinement, hard labor without confinement for 45 days, restriction for 2 months, forfeiture of 2/3 pay for 1 month. Cannot adjudge bad-conduct discharge. SPECIAL COURT-MARTIAL: Intermediate level for moderate offenses. Right to detailed military defense counsel. Maximum punishment: 12 months confinement, hard labor without confinement for 3 months, forfeiture of 2/3 pay for 12 months, reduction to E-1, bad-conduct discharge. GENERAL COURT-MARTIAL: Most serious level for major offenses. Right to detailed military defense counsel and full procedural protections. Maximum punishment: Death (for capital offenses), life imprisonment, dismissal (officers), dishonorable discharge, total forfeiture of pay and allowances, reduction to E-1. IMPORTANT: You can refuse summary court-martial and demand special or general court-martial. Always consult defense counsel before making decisions.",
    category: "Court-Martial",
    urgency: "high",
    lastUpdated: "2024-12-01",
    helpfulVotes: 112,
    tags: ["court-martial", "summary", "special", "general", "punishment", "ucmj"],
    relatedQuestions: ["Can I refuse summary court-martial?", "What is Article 32 investigation?", "How long does court-martial take?"],
    languages: ["English", "Spanish", "German", "Japanese"]
  },
  {
    id: "family-separation-allowance",
    question: "Am I entitled to Family Separation Allowance while deployed or on unaccompanied tours?",
    answer: "Family Separation Allowance (FSA) provides additional pay when military requirements separate you from dependents: ELIGIBILITY REQUIREMENTS: Married service member OR single member with dependent children. Separation due to military orders (not voluntary). Dependents cannot accompany due to military restrictions. Minimum separation period varies by type. FSA-S (Shipboard/Sea Duty): $250/month for continuous duty aboard ship away from homeport for 30+ days. FSA-R (Restricted Assignment): $250/month for assignments where dependents are restricted (Korea, remote locations) for 30+ days. FSA-T (Temporary Duty): $250/month for TDY away from permanent station for 30+ consecutive days. IMPORTANT: FSA is automatic when eligibility criteria are met - no application required. Stops when separation ends or dependents join you. Not authorized for separations due to misconduct, disciplinary action, or voluntary geographic separation. BAH continues during separation. Contact finance office if FSA doesn't appear on your LES after 30 days.",
    category: "Military Pay/Benefits",
    urgency: "medium",
    lastUpdated: "2024-11-25",
    helpfulVotes: 89,
    tags: ["family-separation-allowance", "fsa", "deployment", "unaccompanied-tour", "pay"],
    relatedQuestions: ["What is BAH?", "Do I get FSA for training?", "Can dependents visit during unaccompanied tour?"],
    languages: ["English", "Spanish", "German"]
  }
];

const categories = [
  "All Categories",
  "Article 15/NJP",
  "Security Clearance", 
  "SHARP/Sexual Assault",
  "Overseas/International",
  "Court-Martial",
  "Military Pay/Benefits",
  "Family Law",
  "Administrative Actions",
  "Criminal Defense"
];

const urgencyLevels = [
  "All Urgency",
  "critical",
  "high", 
  "medium",
  "low"
];

export default function LegalFAQHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedUrgency, setSelectedUrgency] = useState("All Urgency");
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"helpful" | "recent" | "alphabetical">("helpful");

  const filteredFAQs = faqs
    .filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "All Categories" || faq.category === selectedCategory;
      const matchesUrgency = selectedUrgency === "All Urgency" || faq.urgency === selectedUrgency;
      return matchesSearch && matchesCategory && matchesUrgency;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "helpful":
          return b.helpfulVotes - a.helpfulVotes;
        case "recent":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case "alphabetical":
          return a.question.localeCompare(b.question);
        default:
          return 0;
      }
    });

  const toggleFAQ = (faqId: string) => {
    const newOpenFAQs = new Set(openFAQs);
    if (newOpenFAQs.has(faqId)) {
      newOpenFAQs.delete(faqId);
    } else {
      newOpenFAQs.add(faqId);
    }
    setOpenFAQs(newOpenFAQs);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "critical": return <AlertTriangle className="h-4 w-4" />;
      case "high": return <Clock className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Military Legal FAQ
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Frequently asked questions about military law, regulations, and procedures. 
          Get immediate answers to common legal concerns from expert military attorneys.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search legal questions, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Urgency Level</label>
                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                >
                  {urgencyLevels.map(urgency => (
                    <option key={urgency} value={urgency}>{urgency}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "helpful" | "recent" | "alphabetical")}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="helpful">Most Helpful</option>
                  <option value="recent">Most Recent</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing {filteredFAQs.length} of {faqs.length} questions
        </p>
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Multilingual support available
          </span>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <Card key={faq.id} className="hover:shadow-md transition-shadow duration-200">
            <Collapsible
              open={openFAQs.has(faq.id)}
              onOpenChange={() => toggleFAQ(faq.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                        <Badge className={`text-xs ${getUrgencyColor(faq.urgency)}`}>
                          <span className="flex items-center space-x-1">
                            {getUrgencyIcon(faq.urgency)}
                            <span>{faq.urgency}</span>
                          </span>
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          <span>{faq.helpfulVotes}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight text-left">
                        {faq.question}
                      </CardTitle>
                    </div>
                    <div className="flex-shrink-0">
                      {openFAQs.has(faq.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {faq.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {faq.relatedQuestions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Related Questions:
                      </h4>
                      <ul className="space-y-1">
                        {faq.relatedQuestions.map((question, index) => (
                          <li key={index} className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                            • {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Updated: {new Date(faq.lastUpdated).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-1">
                        <Globe className="h-3 w-3" />
                        <span>{faq.languages.length} languages</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Was this helpful?
                    </Button>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Still Need Help Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Didn't find what you're looking for?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get personalized legal guidance from SGT Legal Ready or connect with a qualified military defense attorney
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-green-600 hover:bg-green-700">
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask SGT Legal Ready
              </Button>
              <Button variant="outline">
                <Scale className="mr-2 h-4 w-4" />
                Find Defense Attorney
              </Button>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Submit New Question
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}