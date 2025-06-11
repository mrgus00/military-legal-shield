import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Star, Clock, Shield, Target, BookOpen, Award, CheckCircle } from "lucide-react";

// Static data to avoid API calls
const challenges = [
  {
    id: 1,
    title: "UCMJ Article 86 - Absence Without Leave",
    description: "Master the fundamentals of unauthorized absence under military law, including defenses and consequences.",
    category: "military_law",
    difficulty: "beginner",
    branch: "army",
    timeLimit: 15,
    passingScore: 70,
    pointsReward: 100,
    tags: ["UCMJ", "Article 86", "Absence", "Military Law"],
    questions: [
      {
        question: "What constitutes Absence Without Leave (AWOL) under UCMJ Article 86?",
        options: [
          "Being late to formation by 5 minutes",
          "Failing to go to or remain at a place of duty without proper authority",
          "Taking unauthorized leave for medical reasons",
          "Missing a single training event"
        ],
        correct: 1
      },
      {
        question: "What is the maximum punishment for AWOL under Article 86?",
        options: [
          "30 days confinement",
          "Forfeiture of 2/3 pay for 1 month",
          "Both confinement and forfeiture of pay",
          "Reduction in rank only"
        ],
        correct: 2
      }
    ]
  },
  {
    id: 2,
    title: "Court-Martial Procedures and Rights",
    description: "Navigate the complexities of military court proceedings, from charges to appeals.",
    category: "court_martial",
    difficulty: "intermediate",
    branch: "navy",
    timeLimit: 25,
    passingScore: 75,
    pointsReward: 150,
    tags: ["Court-Martial", "Military Justice", "Legal Rights", "Procedures"],
    questions: [
      {
        question: "What are the three types of court-martial in the military justice system?",
        options: [
          "Summary, Special, and General",
          "Administrative, Judicial, and Executive", 
          "Local, Regional, and Federal",
          "Minor, Major, and Capital"
        ],
        correct: 0
      },
      {
        question: "Who has the authority to convene a General Court-Martial?",
        options: [
          "Company Commander",
          "Battalion Commander",
          "General Officers or Officers exercising general court-martial jurisdiction",
          "Any commissioned officer"
        ],
        correct: 2
      }
    ]
  },
  {
    id: 3,
    title: "Administrative Separations",
    description: "Understand the process and implications of administrative discharge from military service.",
    category: "administrative",
    difficulty: "intermediate",
    branch: "air_force",
    timeLimit: 20,
    passingScore: 75,
    pointsReward: 125,
    tags: ["Discharge", "Administrative", "Separation", "Military Career"],
    questions: [
      {
        question: "What characterization of service allows veterans to receive most VA benefits?",
        options: [
          "Other Than Honorable",
          "Honorable or General Under Honorable Conditions",
          "Bad Conduct Discharge",
          "Dishonorable Discharge"
        ],
        correct: 1
      }
    ]
  },
  {
    id: 4,
    title: "VA Disability Claims Process",
    description: "Master the intricacies of filing and appealing VA disability compensation claims.",
    category: "benefits",
    difficulty: "advanced",
    branch: null,
    timeLimit: 30,
    passingScore: 80,
    pointsReward: 200,
    tags: ["VA", "Disability", "Benefits", "Claims", "Compensation"],
    questions: [
      {
        question: "What is the standard of proof required for VA disability claims?",
        options: [
          "Beyond a reasonable doubt",
          "Clear and convincing evidence",
          "Preponderance of evidence (more likely than not)",
          "Substantial evidence"
        ],
        correct: 2
      }
    ]
  },
  {
    id: 5,
    title: "Military Sexual Assault Response",
    description: "Navigate reporting options, legal procedures, and support resources for military sexual assault cases.",
    category: "military_law",
    difficulty: "advanced",
    branch: "marines",
    timeLimit: 35,
    passingScore: 85,
    pointsReward: 250,
    tags: ["Sexual Assault", "SHARP", "SAPR", "Military Justice", "Victim Rights"],
    questions: [
      {
        question: "What are the two primary reporting options for military sexual assault?",
        options: [
          "Formal and Informal",
          "Restricted and Unrestricted",
          "Administrative and Judicial",
          "Military and Civilian"
        ],
        correct: 1
      }
    ]
  },
  {
    id: 6,
    title: "Security Clearance Investigations",
    description: "Understand the security clearance process, requirements, and potential issues that may arise.",
    category: "administrative",
    difficulty: "intermediate",
    branch: "space_force",
    timeLimit: 20,
    passingScore: 75,
    pointsReward: 150,
    tags: ["Security Clearance", "Investigation", "Background Check", "National Security"],
    questions: [
      {
        question: "What is the highest level of security clearance in the US military?",
        options: [
          "Secret",
          "Top Secret",
          "Top Secret/SCI",
          "Classified"
        ],
        correct: 2
      }
    ]
  }
];

const achievementBadges = [
  {
    id: 1,
    name: "Legal Scholar",
    description: "Complete 5 legal challenges",
    icon: "📚",
    requirement: "Complete 5 challenges",
    earned: false
  },
  {
    id: 2,
    name: "UCMJ Expert",
    description: "Master all military law challenges",
    icon: "⚖️",
    requirement: "Complete all military law challenges",
    earned: false
  },
  {
    id: 3,
    name: "Perfect Score",
    description: "Achieve 100% on any challenge",
    icon: "🎯",
    requirement: "Score 100% on a challenge",
    earned: false
  },
  {
    id: 4,
    name: "Speed Runner",
    description: "Complete a challenge in under 10 minutes",
    icon: "⚡",
    requirement: "Finish challenge in under 10 minutes",
    earned: false
  },
  {
    id: 5,
    name: "Court-Martial Master",
    description: "Excel in court-martial procedures",
    icon: "🏛️",
    requirement: "Complete all court-martial challenges",
    earned: false
  },
  {
    id: 6,
    name: "Benefits Navigator",
    description: "Complete all VA benefits challenges",
    icon: "🎖️",
    requirement: "Complete all benefits challenges",
    earned: false
  },
  {
    id: 7,
    name: "Multi-Branch Expert",
    description: "Complete challenges from all military branches",
    icon: "🌟",
    requirement: "Complete challenges from each branch",
    earned: false
  },
  {
    id: 8,
    name: "Legal Champion",
    description: "Achieve top tier in all categories",
    icon: "👑",
    requirement: "Complete all challenges with 85%+ score",
    earned: false
  }
];

export default function LegalChallenges() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const filteredChallenges = challenges.filter((challenge) => {
    if (selectedCategory !== "all" && challenge.category !== selectedCategory) return false;
    if (selectedDifficulty !== "all" && challenge.difficulty !== selectedDifficulty) return false;
    if (selectedBranch !== "all" && challenge.branch !== selectedBranch) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-yellow-500";
      case "advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "military_law": return <Shield className="w-4 h-4" />;
      case "court_martial": return <Target className="w-4 h-4" />;
      case "administrative": return <BookOpen className="w-4 h-4" />;
      case "benefits": return <Award className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getBranchName = (branch: string | null) => {
    const branchNames: { [key: string]: string } = {
      army: "Army",
      navy: "Navy", 
      air_force: "Air Force",
      marines: "Marines",
      coast_guard: "Coast Guard",
      space_force: "Space Force"
    };
    return branch ? branchNames[branch] || branch : "All Branches";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Legal Preparedness Challenges
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sharpen your military legal knowledge through interactive challenges and earn achievement badges
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available Challenges</p>
                <p className="text-2xl font-bold">{challenges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty Levels</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Achievement Badges</p>
                <p className="text-2xl font-bold">{achievementBadges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Badges */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Achievement Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievementBadges.map((badge) => (
            <Card key={badge.id} className={`text-center ${badge.earned ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'opacity-60'}`}>
              <CardContent className="p-4">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{badge.requirement}</p>
                {badge.earned && (
                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto mt-2" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="military_law">Military Law</SelectItem>
              <SelectItem value="court_martial">Court Martial</SelectItem>
              <SelectItem value="administrative">Administrative</SelectItem>
              <SelectItem value="benefits">Benefits</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Military Branch</label>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="army">Army</SelectItem>
              <SelectItem value="navy">Navy</SelectItem>
              <SelectItem value="air_force">Air Force</SelectItem>
              <SelectItem value="marines">Marines</SelectItem>
              <SelectItem value="coast_guard">Coast Guard</SelectItem>
              <SelectItem value="space_force">Space Force</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getCategoryIcon(challenge.category)}
                  {challenge.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white`}>
                    {challenge.difficulty}
                  </Badge>
                  {challenge.branch && (
                    <Badge variant="outline">{getBranchName(challenge.branch)}</Badge>
                  )}
                </div>
              </div>
              <CardDescription>{challenge.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {challenge.timeLimit} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {challenge.pointsReward} points
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Passing Score: {challenge.passingScore}%</span>
                  <span>{challenge.questions?.length || 0} Questions</span>
                </div>

                {challenge.tags && challenge.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {challenge.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {challenge.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{challenge.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <Button className="w-full">
                  Start Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No challenges match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}