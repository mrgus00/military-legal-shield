import { ReactNode, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  HelpCircle, 
  BookOpen, 
  ExternalLink,
  Info,
  Scale,
  Shield,
  Users,
  FileText,
  AlertTriangle
} from "lucide-react";

interface MilitaryTerm {
  term: string;
  definition: string;
  category: 'legal' | 'administrative' | 'operational' | 'rank' | 'procedure';
  examples?: string[];
  relatedTerms?: string[];
  reference?: string;
  importance: 'high' | 'medium' | 'low';
}

interface MilitaryTooltipProps {
  term: string;
  children: ReactNode;
  variant?: 'inline' | 'button' | 'icon';
  className?: string;
}

// Comprehensive military terminology database
const MILITARY_TERMS: Record<string, MilitaryTerm> = {
  "UCMJ": {
    term: "Uniform Code of Military Justice",
    definition: "The foundation of military law in the United States, establishing the legal framework for military justice and defining crimes, punishments, and procedures for military personnel.",
    category: 'legal',
    examples: [
      "Article 86 - Absence without leave (AWOL)",
      "Article 92 - Failure to obey order or regulation",
      "Article 134 - General article (disorders and neglects)"
    ],
    relatedTerms: ["Court-Martial", "Article 15", "Manual for Courts-Martial"],
    reference: "10 U.S.C. §§ 801-946",
    importance: 'high'
  },
  "Article 15": {
    term: "Article 15 (Nonjudicial Punishment)",
    definition: "A disciplinary procedure that allows commanding officers to impose punishment for minor offenses without convening a court-martial.",
    category: 'legal',
    examples: [
      "Reduction in rank",
      "Forfeiture of pay",
      "Extra duties",
      "Restriction to quarters"
    ],
    relatedTerms: ["UCMJ", "Company Grade Article 15", "Field Grade Article 15"],
    reference: "UCMJ Article 15",
    importance: 'high'
  },
  "Court-Martial": {
    term: "Court-Martial",
    definition: "A military court proceeding used to try members of the armed forces for violations of military law, similar to civilian criminal courts.",
    category: 'legal',
    examples: [
      "Summary Court-Martial - Minor offenses",
      "Special Court-Martial - Intermediate offenses", 
      "General Court-Martial - Serious offenses"
    ],
    relatedTerms: ["UCMJ", "Convening Authority", "Military Judge"],
    reference: "UCMJ Articles 16-20",
    importance: 'high'
  },
  "Security Clearance": {
    term: "Security Clearance",
    definition: "A status granted to individuals allowing them access to classified information or restricted areas after a thorough background investigation.",
    category: 'administrative',
    examples: [
      "Confidential - Lowest level of classified information",
      "Secret - Could cause serious damage if disclosed",
      "Top Secret - Could cause exceptionally grave damage"
    ],
    relatedTerms: ["Background Investigation", "SCI", "Polygraph"],
    reference: "Executive Order 12968",
    importance: 'high'
  },
  "JAG": {
    term: "Judge Advocate General",
    definition: "Military lawyers who serve as legal advisors to commanders and provide legal services to military personnel and their families.",
    category: 'legal',
    examples: [
      "Legal assistance with personal matters",
      "Court-martial prosecution and defense",
      "Administrative law advice"
    ],
    relatedTerms: ["TDS", "Legal Assistance", "Military Justice"],
    reference: "10 U.S.C. § 806",
    importance: 'high'
  },
  "TDS": {
    term: "Trial Defense Service",
    definition: "Military attorneys who provide independent legal representation to service members in court-martial proceedings and administrative actions.",
    category: 'legal',
    examples: [
      "Court-martial defense",
      "Administrative separation boards",
      "Article 15 appeals"
    ],
    relatedTerms: ["JAG", "Defense Counsel", "Military Justice"],
    reference: "Army Regulation 27-10",
    importance: 'high'
  },
  "AWOL": {
    term: "Absent Without Leave",
    definition: "The offense of being absent from one's unit, organization, or place of duty without proper authority.",
    category: 'legal',
    examples: [
      "Failure to report for duty",
      "Leaving duty station without permission",
      "Missing scheduled formations"
    ],
    relatedTerms: ["Desertion", "UCMJ Article 86", "UA"],
    reference: "UCMJ Article 86",
    importance: 'medium'
  },
  "Command": {
    term: "Command Authority",
    definition: "The legal authority and responsibility of a military commander to direct, coordinate, and control military forces.",
    category: 'operational',
    examples: [
      "Commanding Officer responsibilities",
      "Chain of command structure",
      "Disciplinary authority"
    ],
    relatedTerms: ["Chain of Command", "Commanding Officer", "UCMJ"],
    reference: "Joint Publication 1",
    importance: 'high'
  },
  "NJP": {
    term: "Non-Judicial Punishment",
    definition: "Another term for Article 15 proceedings, allowing commanders to address minor disciplinary infractions without formal court proceedings.",
    category: 'legal',
    examples: [
      "Captain's Mast (Navy/Marines)",
      "Article 15 (Army/Air Force)",
      "Office Hours (Coast Guard)"
    ],
    relatedTerms: ["Article 15", "UCMJ", "Commanding Officer"],
    reference: "UCMJ Article 15",
    importance: 'high'
  },
  "SGLI": {
    term: "Servicemembers' Group Life Insurance",
    definition: "Low-cost term life insurance coverage for military personnel, providing financial protection for service members and their beneficiaries.",
    category: 'administrative',
    examples: [
      "Basic SGLI coverage up to $400,000",
      "Family SGLI for spouses and children",
      "Traumatic injury protection"
    ],
    relatedTerms: ["TSGLI", "VGLI", "Beneficiary"],
    reference: "38 U.S.C. Chapter 19",
    importance: 'medium'
  }
};

const getCategoryIcon = (category: MilitaryTerm['category']) => {
  switch (category) {
    case 'legal':
      return Scale;
    case 'administrative':
      return FileText;
    case 'operational':
      return Shield;
    case 'rank':
      return Users;
    case 'procedure':
      return BookOpen;
    default:
      return Info;
  }
};

const getCategoryColor = (category: MilitaryTerm['category']) => {
  switch (category) {
    case 'legal':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'administrative':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'operational':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rank':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'procedure':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getImportanceColor = (importance: MilitaryTerm['importance']) => {
  switch (importance) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function MilitaryTooltip({ 
  term, 
  children, 
  variant = 'inline', 
  className = "" 
}: MilitaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find the term in our database (case-insensitive)
  const termKey = Object.keys(MILITARY_TERMS).find(
    key => key.toLowerCase() === term.toLowerCase()
  );
  
  const termData = termKey ? MILITARY_TERMS[termKey] : null;
  
  // If term not found, return children without tooltip
  if (!termData) {
    return <>{children}</>;
  }

  const CategoryIcon = getCategoryIcon(termData.category);

  const TooltipContentCard = () => (
    <Card className="w-80 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold text-gray-900 mb-2">
              {termData.term}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getCategoryColor(termData.category)}>
                <CategoryIcon className="h-3 w-3 mr-1" />
                {termData.category}
              </Badge>
              <Badge variant="outline" className={getImportanceColor(termData.importance)}>
                {termData.importance === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {termData.importance}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          {termData.definition}
        </p>
        
        {termData.examples && termData.examples.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Examples:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {termData.examples.map((example, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {termData.relatedTerms && termData.relatedTerms.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Related Terms:</h4>
            <div className="flex flex-wrap gap-1">
              {termData.relatedTerms.map((relatedTerm, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {relatedTerm}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {termData.reference && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <BookOpen className="h-3 w-3" />
              <span>Reference: {termData.reference}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (variant === 'button') {
    return (
      <TooltipProvider>
        <Tooltip open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-auto p-1 text-blue-600 hover:text-blue-800 ${className}`}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="p-0 border-0 bg-transparent">
            <TooltipContentCard />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            <button className={`inline-flex items-center text-blue-600 hover:text-blue-800 ${className}`}>
              <HelpCircle className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="p-0 border-0 bg-transparent">
            <TooltipContentCard />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Default inline variant
  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <span 
            className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-help border-b border-dotted border-blue-400 ${className}`}
          >
            {children}
            <HelpCircle className="h-3 w-3" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-0 border-0 bg-transparent">
          <TooltipContentCard />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}