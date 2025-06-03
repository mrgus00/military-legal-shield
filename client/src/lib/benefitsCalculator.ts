import { BranchTheme } from "./branchThemes";

export interface ServiceRecord {
  branch: string;
  rank: {payGrade: string; rank: string; abbreviation: string};
  yearsOfService: number;
  serviceStatus: 'active' | 'veteran' | 'retired' | 'guard' | 'reserve';
  dischargeType?: 'honorable' | 'general' | 'other-than-honorable' | 'bad-conduct' | 'dishonorable';
  serviceConnectedDisability?: number; // Percentage 0-100
  combatVeteran: boolean;
  deployments: number;
  dependents: number;
  annualIncome?: number;
  state: string;
}

export interface BenefitEligibility {
  benefitType: string;
  eligible: boolean;
  eligibilityPercentage: number;
  requirements: string[];
  missingRequirements: string[];
  estimatedValue?: string;
  applicationDeadline?: string;
  notes: string[];
}

export interface BenefitsCalculationResult {
  overall: {
    totalEligibleBenefits: number;
    totalPotentialValue: string;
    eligibilityScore: number;
  };
  benefits: BenefitEligibility[];
  recommendations: string[];
}

// Authentic VA disability compensation rates (2024)
const DISABILITY_COMPENSATION_RATES = {
  10: { veteran: 171, spouse: 0, child: 0 },
  20: { veteran: 338, spouse: 0, child: 0 },
  30: { veteran: 524, spouse: 63, child: 32 },
  40: { veteran: 755, spouse: 90, child: 46 },
  50: { veteran: 1075, spouse: 128, child: 64 },
  60: { veteran: 1361, spouse: 162, child: 81 },
  70: { veteran: 1716, spouse: 204, child: 102 },
  80: { veteran: 1995, spouse: 237, child: 119 },
  90: { veteran: 2241, spouse: 267, child: 133 },
  100: { veteran: 3737, spouse: 418, child: 209 }
};

// GI Bill rates (2024 academic year)
const GI_BILL_RATES = {
  'private-university': 28751.58, // Annual max for private schools
  'public-university': 0, // Covers full tuition at public universities
  'housing-allowance': 2200, // Average monthly housing allowance
  'book-stipend': 1000 // Annual book stipend
};

export function calculateBenefitsEligibility(serviceRecord: ServiceRecord): BenefitsCalculationResult {
  const benefits: BenefitEligibility[] = [];

  // VA Disability Compensation
  benefits.push(calculateDisabilityCompensation(serviceRecord));
  
  // GI Bill Education Benefits
  benefits.push(calculateGIBillBenefits(serviceRecord));
  
  // VA Home Loan Guarantee
  benefits.push(calculateHomeLoanBenefits(serviceRecord));
  
  // VA Healthcare
  benefits.push(calculateHealthcareBenefits(serviceRecord));
  
  // Vocational Rehabilitation
  benefits.push(calculateVocRehabBenefits(serviceRecord));
  
  // SGLI/Veterans' Group Life Insurance
  benefits.push(calculateLifeInsuranceBenefits(serviceRecord));
  
  // Dependency and Indemnity Compensation
  benefits.push(calculateDICBenefits(serviceRecord));
  
  // State-Specific Benefits
  benefits.push(calculateStateBenefits(serviceRecord));

  const eligibleBenefits = benefits.filter(b => b.eligible).length;
  const totalBenefits = benefits.length;
  const eligibilityScore = Math.round((eligibleBenefits / totalBenefits) * 100);

  const totalPotentialValue = calculateTotalPotentialValue(benefits);

  const recommendations = generateRecommendations(serviceRecord, benefits);

  return {
    overall: {
      totalEligibleBenefits: eligibleBenefits,
      totalPotentialValue,
      eligibilityScore
    },
    benefits,
    recommendations
  };
}

function calculateDisabilityCompensation(record: ServiceRecord): BenefitEligibility {
  const eligible = record.serviceStatus !== 'active' && 
                  record.dischargeType === 'honorable' &&
                  (record.serviceConnectedDisability ?? 0) >= 10;

  const requirements = [
    "Honorable discharge from military service",
    "Service-connected disability rating of 10% or higher",
    "Medical evidence linking disability to military service"
  ];

  const missingRequirements = [];
  if (record.dischargeType !== 'honorable') {
    missingRequirements.push("Honorable discharge required");
  }
  if ((record.serviceConnectedDisability ?? 0) < 10) {
    missingRequirements.push("Service-connected disability rating of at least 10% required");
  }

  let estimatedValue = "$0/month";
  if (eligible && record.serviceConnectedDisability) {
    const rate = DISABILITY_COMPENSATION_RATES[record.serviceConnectedDisability as keyof typeof DISABILITY_COMPENSATION_RATES];
    if (rate) {
      const monthlyAmount = rate.veteran + (rate.spouse * (record.dependents > 0 ? 1 : 0)) + (rate.child * Math.max(0, record.dependents - 1));
      estimatedValue = `$${monthlyAmount.toLocaleString()}/month`;
    }
  }

  return {
    benefitType: "VA Disability Compensation",
    eligible,
    eligibilityPercentage: eligible ? 100 : 0,
    requirements,
    missingRequirements,
    estimatedValue,
    notes: [
      "Tax-free monthly payments for service-connected disabilities",
      "Ratings from 10% to 100% in 10% increments",
      "Additional compensation available for dependents at 30% or higher"
    ]
  };
}

function calculateGIBillBenefits(record: ServiceRecord): BenefitEligibility {
  const eligible = record.yearsOfService >= 2 || 
                  (record.serviceStatus === 'active' && record.yearsOfService >= 1.5) ||
                  record.combatVeteran;

  const eligibilityPercentage = Math.min(100, Math.max(0, (record.yearsOfService / 3) * 100));

  const requirements = [
    "Minimum 90 days of active duty service",
    "Honorable discharge (or still serving)",
    "Service after September 10, 2001"
  ];

  const missingRequirements = [];
  if (record.yearsOfService < 0.25) { // 90 days
    missingRequirements.push("Minimum 90 days of active duty required");
  }
  if (record.dischargeType && record.dischargeType !== 'honorable' && record.dischargeType !== 'general') {
    missingRequirements.push("Honorable or general discharge required");
  }

  const estimatedValue = eligible ? 
    `Up to $${GI_BILL_RATES['private-university'].toLocaleString()}/year tuition + housing allowance` : 
    "$0";

  return {
    benefitType: "Post-9/11 GI Bill",
    eligible,
    eligibilityPercentage: Math.round(eligibilityPercentage),
    requirements,
    missingRequirements,
    estimatedValue,
    notes: [
      "36 months of education benefits",
      "Covers tuition, housing allowance, and book stipend",
      "Can be transferred to dependents if certain conditions are met"
    ]
  };
}

function calculateHomeLoanBenefits(record: ServiceRecord): BenefitEligibility {
  const eligible = (record.yearsOfService >= 2 && record.dischargeType === 'honorable') ||
                  (record.serviceStatus === 'active' && record.yearsOfService >= 2) ||
                  (record.combatVeteran && record.yearsOfService >= 0.25);

  const requirements = [
    "Minimum service requirements based on era and status",
    "Sufficient credit and income for loan",
    "Property must be primary residence"
  ];

  const missingRequirements = [];
  if (!eligible) {
    missingRequirements.push("Minimum service requirements not met");
  }

  return {
    benefitType: "VA Home Loan Guarantee",
    eligible,
    eligibilityPercentage: eligible ? 100 : 0,
    requirements,
    missingRequirements,
    estimatedValue: eligible ? "Up to $766,550 (no down payment required)" : "$0",
    notes: [
      "No down payment required",
      "No private mortgage insurance",
      "Competitive interest rates",
      "Can be used multiple times"
    ]
  };
}

function calculateHealthcareBenefits(record: ServiceRecord): BenefitEligibility {
  const eligible = record.dischargeType === 'honorable' || record.serviceStatus === 'active';
  
  const requirements = [
    "Honorable discharge or current active duty",
    "Enrollment in VA healthcare system"
  ];

  const missingRequirements = [];
  if (!eligible) {
    missingRequirements.push("Honorable discharge required");
  }

  // Priority group determination
  let priorityGroup = 8; // Default lowest priority
  if (record.serviceConnectedDisability && record.serviceConnectedDisability >= 50) {
    priorityGroup = 1;
  } else if (record.serviceConnectedDisability && record.serviceConnectedDisability >= 30) {
    priorityGroup = 2;
  } else if (record.combatVeteran) {
    priorityGroup = 6;
  }

  return {
    benefitType: "VA Healthcare",
    eligible,
    eligibilityPercentage: eligible ? 100 : 0,
    requirements,
    missingRequirements,
    estimatedValue: eligible ? `Priority Group ${priorityGroup} (lower is better)` : "Not eligible",
    notes: [
      "Comprehensive medical care",
      "Prescription medications",
      "Mental health services",
      "Priority based on service-connected disabilities"
    ]
  };
}

function calculateVocRehabBenefits(record: ServiceRecord): BenefitEligibility {
  const eligible = (record.serviceConnectedDisability ?? 0) >= 20;

  const requirements = [
    "Service-connected disability rating of 20% or higher",
    "Need for vocational rehabilitation due to service-connected disability"
  ];

  const missingRequirements = [];
  if ((record.serviceConnectedDisability ?? 0) < 20) {
    missingRequirements.push("Service-connected disability rating of 20% or higher required");
  }

  return {
    benefitType: "Vocational Rehabilitation & Employment",
    eligible,
    eligibilityPercentage: eligible ? 100 : 0,
    requirements,
    missingRequirements,
    estimatedValue: eligible ? "Up to 48 months of training + subsistence allowance" : "$0",
    notes: [
      "Education and training programs",
      "Employment assistance",
      "Monthly subsistence allowance during training"
    ]
  };
}

function calculateLifeInsuranceBenefits(record: ServiceRecord): BenefitEligibility {
  const eligible = record.serviceStatus === 'active' || 
                  (record.serviceStatus === 'veteran' && record.dischargeType === 'honorable');

  const requirements = [
    "Current active duty or honorably discharged veteran",
    "Good health (for some programs)"
  ];

  const missingRequirements = [];
  if (!eligible) {
    missingRequirements.push("Active duty or honorable discharge required");
  }

  return {
    benefitType: "Veterans' Group Life Insurance",
    eligible,
    eligibilityPercentage: eligible ? 100 : 0,
    requirements,
    missingRequirements,
    estimatedValue: eligible ? "Up to $500,000 coverage" : "$0",
    notes: [
      "Low-cost group life insurance",
      "Coverage continues after separation from service",
      "Family coverage available"
    ]
  };
}

function calculateDICBenefits(record: ServiceRecord): BenefitEligibility {
  // This would typically apply to surviving spouses/dependents
  const eligible = false; // Would need additional family/survivor information

  return {
    benefitType: "Dependency and Indemnity Compensation",
    eligible,
    eligibilityPercentage: 0,
    requirements: [
      "Death of service member due to service-connected cause",
      "Surviving spouse or eligible dependent"
    ],
    missingRequirements: ["Applicable only to surviving family members"],
    estimatedValue: "$1,612.75/month (2024 rate)",
    notes: [
      "Monthly benefit for surviving spouses",
      "Additional amounts for dependent children",
      "Special monthly compensation may apply"
    ]
  };
}

function calculateStateBenefits(record: ServiceRecord): BenefitEligibility {
  // This would require state-specific benefit data
  const eligible = true; // Most states have some veteran benefits

  return {
    benefitType: `${record.state} State Veterans Benefits`,
    eligible,
    eligibilityPercentage: 100,
    requirements: [
      "State residency",
      "Qualifying military service"
    ],
    missingRequirements: [],
    estimatedValue: "Varies by state and program",
    notes: [
      "Property tax exemptions",
      "Educational benefits",
      "Employment preferences",
      "Hunting/fishing license discounts"
    ]
  };
}

function calculateTotalPotentialValue(benefits: BenefitEligibility[]): string {
  // This would sum up all eligible benefits
  // For now, return a general estimate
  const eligibleCount = benefits.filter(b => b.eligible).length;
  
  if (eligibleCount >= 6) {
    return "$500,000+ lifetime value";
  } else if (eligibleCount >= 4) {
    return "$250,000+ lifetime value";
  } else if (eligibleCount >= 2) {
    return "$100,000+ lifetime value";
  } else {
    return "Varies by benefit";
  }
}

function generateRecommendations(record: ServiceRecord, benefits: BenefitEligibility[]): string[] {
  const recommendations = [];

  // Disability rating recommendation
  if (!record.serviceConnectedDisability || record.serviceConnectedDisability < 30) {
    recommendations.push("Consider filing for VA disability rating if you have service-connected conditions");
  }

  // Education benefits
  const giBill = benefits.find(b => b.benefitType === "Post-9/11 GI Bill");
  if (giBill && giBill.eligible && giBill.eligibilityPercentage < 100) {
    recommendations.push("Continue service to reach 100% GI Bill eligibility");
  }

  // Healthcare enrollment
  const healthcare = benefits.find(b => b.benefitType === "VA Healthcare");
  if (healthcare && healthcare.eligible) {
    recommendations.push("Enroll in VA healthcare to secure medical benefits");
  }

  // Home loan
  const homeLoan = benefits.find(b => b.benefitType === "VA Home Loan Guarantee");
  if (homeLoan && homeLoan.eligible) {
    recommendations.push("Consider using VA home loan benefit for favorable mortgage terms");
  }

  return recommendations;
}