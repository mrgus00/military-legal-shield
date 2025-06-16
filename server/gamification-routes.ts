import { Router } from "express";
import { db } from "./db";
import { 
  legalChallenges, 
  userChallengeProgress, 
  achievementBadges, 
  userBadges,
  userGamificationStats,
  dailyChallenges,
  leaderboards
} from "../shared/gamification-schema";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import { isAuthenticated } from "./replitAuth";

const router = Router();

// Sample challenge data
const sampleChallenges = [
  {
    title: "UCMJ Article 15 Fundamentals",
    description: "Master the basics of non-judicial punishment under the Uniform Code of Military Justice",
    category: "ucmj",
    difficulty: "beginner",
    branch: "All",
    pointsValue: 100,
    timeLimit: 15,
    questions: [
      {
        question: "What is Article 15 of the UCMJ?",
        options: ["Court-martial proceeding", "Non-judicial punishment", "Administrative discharge", "Security clearance review"],
        correct: 1,
        explanation: "Article 15 provides commanders with a tool for maintaining discipline through non-judicial punishment."
      },
      {
        question: "Can you refuse Article 15 proceedings?",
        options: ["No, it's mandatory", "Yes, and demand court-martial", "Only if you're an officer", "Only for minor offenses"],
        correct: 1,
        explanation: "Service members have the right to refuse Article 15 and demand trial by court-martial."
      }
    ],
    badges: ["knowledge-seeker"],
    isActive: true
  },
  {
    title: "Emergency Legal Response",
    description: "Learn rapid response protocols for urgent military legal situations",
    category: "emergency",
    difficulty: "intermediate", 
    branch: "All",
    pointsValue: 200,
    timeLimit: 20,
    questions: [
      {
        question: "What should be your first action when facing criminal allegations?",
        options: ["Contact chain of command", "Request legal counsel", "Gather evidence", "Contact family"],
        correct: 1,
        explanation: "Immediately request legal counsel to protect your rights under Article 31."
      },
      {
        question: "What rights do you have during military investigations?",
        options: ["Right to remain silent only", "Right to counsel and remain silent", "No special rights", "Right to confront accusers only"],
        correct: 1,
        explanation: "You have the right to remain silent and the right to legal counsel during military investigations."
      }
    ],
    badges: ["emergency-ready"],
    isActive: true
  },
  {
    title: "Power of Attorney Essentials",
    description: "Understand when and how to properly execute military power of attorney documents",
    category: "document-prep",
    difficulty: "beginner",
    branch: "All", 
    pointsValue: 150,
    timeLimit: 25,
    questions: [
      {
        question: "When is a general power of attorney typically used?",
        options: ["During deployment", "For medical decisions only", "For financial matters only", "During leave periods"],
        correct: 0,
        explanation: "General power of attorney is commonly used during deployments to handle various legal and financial matters."
      },
      {
        question: "Who can notarize military legal documents?",
        options: ["Only civilian notaries", "Military legal personnel only", "Both military and civilian notaries", "Commanding officers only"],
        correct: 2,
        explanation: "Both military legal personnel and civilian notaries can authenticate military legal documents."
      }
    ],
    badges: ["document-master"],
    isActive: true
  },
  {
    title: "Court-Martial Scenarios",
    description: "Navigate complex court-martial situations with strategic decision-making",
    category: "scenario",
    difficulty: "advanced",
    branch: "All",
    pointsValue: 300,
    timeLimit: 30,
    questions: [
      {
        question: "In a court-martial, who decides guilt or innocence?",
        options: ["Military judge only", "Panel of officers", "Both judge and panel options available", "Commanding officer"],
        correct: 2,
        explanation: "Accused service members can choose trial by military judge alone or by a panel of officers."
      },
      {
        question: "What is the standard of proof in court-martial proceedings?",
        options: ["Preponderance of evidence", "Clear and convincing", "Beyond reasonable doubt", "Probable cause"],
        correct: 2,
        explanation: "Court-martial proceedings require proof beyond a reasonable doubt, same as civilian criminal courts."
      }
    ],
    badges: ["legal-strategist"],
    isActive: true
  },
  {
    title: "Military Financial Regulations",
    description: "Master financial compliance and regulations specific to military personnel",
    category: "financial",
    difficulty: "intermediate",
    branch: "All",
    pointsValue: 175,
    timeLimit: 20,
    questions: [
      {
        question: "What financial obligations must be reported to your command?",
        options: ["All debts over $1000", "Only bankruptcy", "Garnishments and significant financial distress", "Personal loans only"],
        correct: 2,
        explanation: "Service members must report garnishments and situations causing significant financial distress to their command."
      },
      {
        question: "Can military personnel engage in commercial business activities?",
        options: ["Yes, without restrictions", "No, completely prohibited", "Yes, with proper approval and compliance", "Only after retirement"],
        correct: 2,
        explanation: "Military personnel can engage in business activities with proper approval and adherence to ethics regulations."
      }
    ],
    badges: ["financial-guardian"],
    isActive: true
  }
];

// Sample badges
const sampleBadges = [
  {
    name: "Knowledge Seeker",
    description: "Complete your first legal challenge",
    icon: "BookOpen",
    category: "knowledge",
    tier: "bronze",
    requirements: { challengesCompleted: 1 },
    pointsAwarded: 50,
    rarity: "common",
    isSecret: false,
    isActive: true
  },
  {
    name: "Emergency Ready",
    description: "Master emergency legal response protocols",
    icon: "Zap",
    category: "completion",
    tier: "silver", 
    requirements: { emergencyChallengesCompleted: 3 },
    pointsAwarded: 100,
    rarity: "uncommon",
    isSecret: false,
    isActive: true
  },
  {
    name: "Document Master",
    description: "Excel at legal document preparation",
    icon: "FileText",
    category: "knowledge",
    tier: "gold",
    requirements: { documentChallengesCompleted: 5 },
    pointsAwarded: 200,
    rarity: "rare",
    isSecret: false,
    isActive: true
  },
  {
    name: "Legal Strategist", 
    description: "Navigate complex legal scenarios with expertise",
    icon: "Target",
    category: "excellence",
    tier: "platinum",
    requirements: { advancedChallengesCompleted: 10 },
    pointsAwarded: 500,
    rarity: "epic",
    isSecret: false,
    isActive: true
  },
  {
    name: "Streak Master",
    description: "Maintain a 7-day learning streak",
    icon: "Flame",
    category: "streak",
    tier: "gold",
    requirements: { streakDays: 7 },
    pointsAwarded: 300,
    rarity: "rare",
    isSecret: false,
    isActive: true
  },
  {
    name: "Legal Legend",
    description: "Achieve the highest rank in legal preparedness",
    icon: "Crown",
    category: "special",
    tier: "legendary",
    requirements: { totalPoints: 10000, rank: "General" },
    pointsAwarded: 1000,
    rarity: "legendary",
    isSecret: true,
    isActive: true
  }
];

// Get all available challenges
router.get("/api/legal-challenges", async (req, res) => {
  try {
    // For now, return sample data
    // In production, this would query the database
    const challenges = sampleChallenges.map((challenge, index) => ({
      id: index + 1,
      ...challenge,
      isCompleted: false, // TODO: Check user progress
      userScore: null
    }));
    
    res.json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({ message: "Failed to fetch challenges" });
  }
});

// Get user stats
router.get("/api/user-stats", isAuthenticated, async (req, res) => {
  try {
    // Sample user stats - in production, query database
    const userStats = {
      totalPoints: 750,
      currentStreak: 3,
      longestStreak: 12,
      totalChallengesCompleted: 8,
      totalBadgesEarned: 4,
      rank: "Sergeant",
      level: 5,
      experiencePoints: 750,
      nextLevelPoints: 1000
    };
    
    res.json(userStats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
});

// Get user badges
router.get("/api/user-badges", isAuthenticated, async (req, res) => {
  try {
    // Sample badges with earned status
    const badges = sampleBadges.map((badge, index) => ({
      id: index + 1,
      ...badge,
      isEarned: index < 4 // First 4 badges are earned
    }));
    
    res.json(badges);
  } catch (error) {
    console.error("Error fetching user badges:", error);
    res.status(500).json({ message: "Failed to fetch user badges" });
  }
});

// Get daily challenge
router.get("/api/daily-challenge", async (req, res) => {
  try {
    // Return a rotating daily challenge
    const today = new Date().getDate();
    const challengeIndex = today % sampleChallenges.length;
    const dailyChallenge = {
      id: challengeIndex + 1,
      ...sampleChallenges[challengeIndex]
    };
    
    res.json(dailyChallenge);
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    res.status(500).json({ message: "Failed to fetch daily challenge" });
  }
});

// Start a challenge
router.post("/api/legal-challenges/:id/start", isAuthenticated, async (req, res) => {
  try {
    const challengeId = parseInt(req.params.id);
    const userId = req.user?.claims?.sub;
    
    if (!challengeId || challengeId > sampleChallenges.length) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    
    // Create progress record
    const progress = {
      userId,
      challengeId,
      status: "in_progress",
      startedAt: new Date(),
      attempts: 1
    };
    
    res.json({ message: "Challenge started", progress });
  } catch (error) {
    console.error("Error starting challenge:", error);
    res.status(500).json({ message: "Failed to start challenge" });
  }
});

// Submit challenge answers
router.post("/api/legal-challenges/:id/submit", isAuthenticated, async (req, res) => {
  try {
    const challengeId = parseInt(req.params.id);
    const { answers, timeSpent } = req.body;
    const userId = req.user?.claims?.sub;
    
    if (!challengeId || challengeId > sampleChallenges.length) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    
    const challenge = sampleChallenges[challengeId - 1];
    
    // Calculate score
    let correctAnswers = 0;
    const feedback = [];
    
    answers.forEach((answer: number, index: number) => {
      const question = challenge.questions[index];
      if (answer === question.correct) {
        correctAnswers++;
      }
      feedback.push({
        questionIndex: index,
        correct: answer === question.correct,
        explanation: question.explanation
      });
    });
    
    const score = Math.round((correctAnswers / challenge.questions.length) * 100);
    const passed = score >= 70; // 70% passing score
    
    // Award points if passed
    const pointsAwarded = passed ? challenge.pointsValue : 0;
    
    const result = {
      score,
      passed,
      pointsAwarded,
      feedback,
      completedAt: new Date()
    };
    
    res.json(result);
  } catch (error) {
    console.error("Error submitting challenge:", error);
    res.status(500).json({ message: "Failed to submit challenge" });
  }
});

// Get specific challenge details
router.get("/api/legal-challenges/:id", async (req, res) => {
  try {
    const challengeId = parseInt(req.params.id);
    
    if (!challengeId || challengeId > sampleChallenges.length) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    
    const challenge = {
      id: challengeId,
      ...sampleChallenges[challengeId - 1]
    };
    
    res.json(challenge);
  } catch (error) {
    console.error("Error fetching challenge:", error);
    res.status(500).json({ message: "Failed to fetch challenge" });
  }
});

// Get leaderboard
router.get("/api/leaderboard", async (req, res) => {
  try {
    const { category = "overall", period = "all_time" } = req.query;
    
    // Sample leaderboard data
    const leaderboard = [
      { rank: 1, username: "LegalEagle92", points: 2500, branch: "Army" },
      { rank: 2, username: "JusticeSeeker", points: 2350, branch: "Navy" },
      { rank: 3, username: "DefenderPro", points: 2200, branch: "Air Force" },
      { rank: 4, username: "LawWarrior", points: 2100, branch: "Marines" },
      { rank: 5, username: "GuardianLegal", points: 2000, branch: "Coast Guard" }
    ];
    
    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

export default router;