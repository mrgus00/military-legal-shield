// Branch-specific configuration and terminology
export interface BranchConfig {
  id: string;
  name: string;
  shortName: string;
  emblem: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  terminology: {
    serviceMember: string;
    unit: string;
    deployment: string;
    station: string;
    command: string;
  };
  ranks: {
    enlisted: Array<{ code: string; title: string; payGrade: string; }>;
    warrant: Array<{ code: string; title: string; payGrade: string; }>;
    officer: Array<{ code: string; title: string; payGrade: string; }>;
  };
  specialties: string[];
  culture: {
    greeting: string;
    motto: string;
    values: string[];
  };
}

export const branchConfigs: Record<string, BranchConfig> = {
  army: {
    id: "army",
    name: "United States Army",
    shortName: "Army",
    emblem: "/attached_assets/U.S Army.png",
    colors: {
      primary: "#4B5320", // Army Green
      secondary: "#FFD700", // Gold
      accent: "#000000"    // Black
    },
    terminology: {
      serviceMember: "Soldier",
      unit: "Unit",
      deployment: "Deployment",
      station: "Base/Post",
      command: "Command"
    },
    ranks: {
      enlisted: [
        { code: "PVT", title: "Private", payGrade: "E-1" },
        { code: "PV2", title: "Private Second Class", payGrade: "E-2" },
        { code: "PFC", title: "Private First Class", payGrade: "E-3" },
        { code: "SPC", title: "Specialist", payGrade: "E-4" },
        { code: "CPL", title: "Corporal", payGrade: "E-4" },
        { code: "SGT", title: "Sergeant", payGrade: "E-5" },
        { code: "SSG", title: "Staff Sergeant", payGrade: "E-6" },
        { code: "SFC", title: "Sergeant First Class", payGrade: "E-7" },
        { code: "MSG", title: "Master Sergeant", payGrade: "E-8" },
        { code: "1SG", title: "First Sergeant", payGrade: "E-8" },
        { code: "SGM", title: "Sergeant Major", payGrade: "E-9" },
        { code: "CSM", title: "Command Sergeant Major", payGrade: "E-9" },
        { code: "SMA", title: "Sergeant Major of the Army", payGrade: "E-9" }
      ],
      warrant: [
        { code: "WO1", title: "Warrant Officer 1", payGrade: "W-1" },
        { code: "CW2", title: "Chief Warrant Officer 2", payGrade: "W-2" },
        { code: "CW3", title: "Chief Warrant Officer 3", payGrade: "W-3" },
        { code: "CW4", title: "Chief Warrant Officer 4", payGrade: "W-4" },
        { code: "CW5", title: "Chief Warrant Officer 5", payGrade: "W-5" }
      ],
      officer: [
        { code: "2LT", title: "Second Lieutenant", payGrade: "O-1" },
        { code: "1LT", title: "First Lieutenant", payGrade: "O-2" },
        { code: "CPT", title: "Captain", payGrade: "O-3" },
        { code: "MAJ", title: "Major", payGrade: "O-4" },
        { code: "LTC", title: "Lieutenant Colonel", payGrade: "O-5" },
        { code: "COL", title: "Colonel", payGrade: "O-6" },
        { code: "BG", title: "Brigadier General", payGrade: "O-7" },
        { code: "MG", title: "Major General", payGrade: "O-8" },
        { code: "LTG", title: "Lieutenant General", payGrade: "O-9" },
        { code: "GEN", title: "General", payGrade: "O-10" }
      ]
    },
    specialties: [
      "Infantry", "Armor", "Artillery", "Aviation", "Signal", "Military Intelligence",
      "Military Police", "Engineer", "Logistics", "Medical", "Cyber Operations"
    ],
    culture: {
      greeting: "Hooah!",
      motto: "This We'll Defend",
      values: ["Loyalty", "Duty", "Respect", "Selfless Service", "Honor", "Integrity", "Personal Courage"]
    }
  },
  navy: {
    id: "navy",
    name: "United States Navy",
    shortName: "Navy",
    emblem: "/attached_assets/U.S Navy.png",
    colors: {
      primary: "#000080", // Navy Blue
      secondary: "#FFD700", // Gold
      accent: "#FFFFFF"    // White
    },
    terminology: {
      serviceMember: "Sailor",
      unit: "Command",
      deployment: "Deployment",
      station: "Base/Station",
      command: "Command"
    },
    ranks: {
      enlisted: [
        { code: "SR", title: "Seaman Recruit", payGrade: "E-1" },
        { code: "SA", title: "Seaman Apprentice", payGrade: "E-2" },
        { code: "SN", title: "Seaman", payGrade: "E-3" },
        { code: "PO3", title: "Petty Officer Third Class", payGrade: "E-4" },
        { code: "PO2", title: "Petty Officer Second Class", payGrade: "E-5" },
        { code: "PO1", title: "Petty Officer First Class", payGrade: "E-6" },
        { code: "CPO", title: "Chief Petty Officer", payGrade: "E-7" },
        { code: "SCPO", title: "Senior Chief Petty Officer", payGrade: "E-8" },
        { code: "MCPO", title: "Master Chief Petty Officer", payGrade: "E-9" },
        { code: "MCPON", title: "Master Chief Petty Officer of the Navy", payGrade: "E-9" }
      ],
      warrant: [
        { code: "WO1", title: "Warrant Officer 1", payGrade: "W-1" },
        { code: "CWO2", title: "Chief Warrant Officer 2", payGrade: "W-2" },
        { code: "CWO3", title: "Chief Warrant Officer 3", payGrade: "W-3" },
        { code: "CWO4", title: "Chief Warrant Officer 4", payGrade: "W-4" },
        { code: "CWO5", title: "Chief Warrant Officer 5", payGrade: "W-5" }
      ],
      officer: [
        { code: "ENS", title: "Ensign", payGrade: "O-1" },
        { code: "LTJG", title: "Lieutenant Junior Grade", payGrade: "O-2" },
        { code: "LT", title: "Lieutenant", payGrade: "O-3" },
        { code: "LCDR", title: "Lieutenant Commander", payGrade: "O-4" },
        { code: "CDR", title: "Commander", payGrade: "O-5" },
        { code: "CAPT", title: "Captain", payGrade: "O-6" },
        { code: "RDML", title: "Rear Admiral (lower half)", payGrade: "O-7" },
        { code: "RADM", title: "Rear Admiral", payGrade: "O-8" },
        { code: "VADM", title: "Vice Admiral", payGrade: "O-9" },
        { code: "ADM", title: "Admiral", payGrade: "O-10" }
      ]
    },
    specialties: [
      "Surface Warfare", "Submarine Warfare", "Aviation", "SEAL/Special Operations",
      "Intelligence", "Cyber Warfare", "Nuclear", "Medical", "Supply", "Construction"
    ],
    culture: {
      greeting: "Hooyah!",
      motto: "Semper Fortis (Always Courageous)",
      values: ["Honor", "Courage", "Commitment"]
    }
  },
  airforce: {
    id: "airforce",
    name: "United States Air Force",
    shortName: "Air Force",
    emblem: "/attached_assets/U.S Airforce.png",
    colors: {
      primary: "#004F98", // Air Force Blue
      secondary: "#FFD700", // Gold
      accent: "#FFFFFF"    // White
    },
    terminology: {
      serviceMember: "Airman",
      unit: "Squadron",
      deployment: "Deployment",
      station: "Base",
      command: "Wing/Command"
    },
    ranks: {
      enlisted: [
        { code: "AB", title: "Airman Basic", payGrade: "E-1" },
        { code: "Amn", title: "Airman", payGrade: "E-2" },
        { code: "A1C", title: "Airman First Class", payGrade: "E-3" },
        { code: "SrA", title: "Senior Airman", payGrade: "E-4" },
        { code: "SSgt", title: "Staff Sergeant", payGrade: "E-5" },
        { code: "TSgt", title: "Technical Sergeant", payGrade: "E-6" },
        { code: "MSgt", title: "Master Sergeant", payGrade: "E-7" },
        { code: "SMSgt", title: "Senior Master Sergeant", payGrade: "E-8" },
        { code: "CMSgt", title: "Chief Master Sergeant", payGrade: "E-9" },
        { code: "CMSAF", title: "Chief Master Sergeant of the Air Force", payGrade: "E-9" }
      ],
      warrant: [],
      officer: [
        { code: "2nd Lt", title: "Second Lieutenant", payGrade: "O-1" },
        { code: "1st Lt", title: "First Lieutenant", payGrade: "O-2" },
        { code: "Capt", title: "Captain", payGrade: "O-3" },
        { code: "Maj", title: "Major", payGrade: "O-4" },
        { code: "Lt Col", title: "Lieutenant Colonel", payGrade: "O-5" },
        { code: "Col", title: "Colonel", payGrade: "O-6" },
        { code: "Brig Gen", title: "Brigadier General", payGrade: "O-7" },
        { code: "Maj Gen", title: "Major General", payGrade: "O-8" },
        { code: "Lt Gen", title: "Lieutenant General", payGrade: "O-9" },
        { code: "Gen", title: "General", payGrade: "O-10" }
      ]
    },
    specialties: [
      "Pilot", "Navigator", "Air Battle Manager", "Cyber Operations", "Intelligence",
      "Security Forces", "Maintenance", "Logistics", "Medical", "Space Operations"
    ],
    culture: {
      greeting: "Hooah!",
      motto: "Aim High... Fly-Fight-Win",
      values: ["Integrity First", "Service Before Self", "Excellence In All We Do"]
    }
  },
  marines: {
    id: "marines",
    name: "United States Marine Corps",
    shortName: "Marines",
    emblem: "/attached_assets/U.S Marine Corps.png",
    colors: {
      primary: "#CC0000", // Scarlet
      secondary: "#FFD700", // Gold
      accent: "#000000"    // Black
    },
    terminology: {
      serviceMember: "Marine",
      unit: "Unit",
      deployment: "Deployment",
      station: "Base/Camp",
      command: "Command"
    },
    ranks: {
      enlisted: [
        { code: "Pvt", title: "Private", payGrade: "E-1" },
        { code: "PFC", title: "Private First Class", payGrade: "E-2" },
        { code: "LCpl", title: "Lance Corporal", payGrade: "E-3" },
        { code: "Cpl", title: "Corporal", payGrade: "E-4" },
        { code: "Sgt", title: "Sergeant", payGrade: "E-5" },
        { code: "SSgt", title: "Staff Sergeant", payGrade: "E-6" },
        { code: "GySgt", title: "Gunnery Sergeant", payGrade: "E-7" },
        { code: "MSgt", title: "Master Sergeant", payGrade: "E-8" },
        { code: "1stSgt", title: "First Sergeant", payGrade: "E-8" },
        { code: "MGySgt", title: "Master Gunnery Sergeant", payGrade: "E-9" },
        { code: "SgtMaj", title: "Sergeant Major", payGrade: "E-9" },
        { code: "SMMC", title: "Sergeant Major of the Marine Corps", payGrade: "E-9" }
      ],
      warrant: [
        { code: "WO1", title: "Warrant Officer 1", payGrade: "W-1" },
        { code: "CWO2", title: "Chief Warrant Officer 2", payGrade: "W-2" },
        { code: "CWO3", title: "Chief Warrant Officer 3", payGrade: "W-3" },
        { code: "CWO4", title: "Chief Warrant Officer 4", payGrade: "W-4" },
        { code: "CWO5", title: "Chief Warrant Officer 5", payGrade: "W-5" }
      ],
      officer: [
        { code: "2ndLt", title: "Second Lieutenant", payGrade: "O-1" },
        { code: "1stLt", title: "First Lieutenant", payGrade: "O-2" },
        { code: "Capt", title: "Captain", payGrade: "O-3" },
        { code: "Maj", title: "Major", payGrade: "O-4" },
        { code: "LtCol", title: "Lieutenant Colonel", payGrade: "O-5" },
        { code: "Col", title: "Colonel", payGrade: "O-6" },
        { code: "BGen", title: "Brigadier General", payGrade: "O-7" },
        { code: "MajGen", title: "Major General", payGrade: "O-8" },
        { code: "LtGen", title: "Lieutenant General", payGrade: "O-9" },
        { code: "Gen", title: "General", payGrade: "O-10" }
      ]
    },
    specialties: [
      "Infantry", "Artillery", "Armor", "Aviation", "Logistics", "Intelligence",
      "Communications", "Military Police", "Combat Engineer", "Reconnaissance"
    ],
    culture: {
      greeting: "Oorah!",
      motto: "Semper Fidelis (Always Faithful)",
      values: ["Honor", "Courage", "Commitment"]
    }
  },
  spaceforce: {
    id: "spaceforce",
    name: "United States Space Force",
    shortName: "Space Force",
    emblem: "/attached_assets/U.S Space Force.png",
    colors: {
      primary: "#1C2951", // Space Force Blue
      secondary: "#FFFFFF", // White
      accent: "#FFD700"    // Gold
    },
    terminology: {
      serviceMember: "Guardian",
      unit: "Squadron",
      deployment: "Assignment",
      station: "Base",
      command: "Delta/Command"
    },
    ranks: {
      enlisted: [
        { code: "Spc1", title: "Specialist 1", payGrade: "E-1" },
        { code: "Spc2", title: "Specialist 2", payGrade: "E-2" },
        { code: "Spc3", title: "Specialist 3", payGrade: "E-3" },
        { code: "Spc4", title: "Specialist 4", payGrade: "E-4" },
        { code: "Sgt", title: "Sergeant", payGrade: "E-5" },
        { code: "TSgt", title: "Technical Sergeant", payGrade: "E-6" },
        { code: "MSgt", title: "Master Sergeant", payGrade: "E-7" },
        { code: "SMSgt", title: "Senior Master Sergeant", payGrade: "E-8" },
        { code: "CMSgt", title: "Chief Master Sergeant", payGrade: "E-9" },
        { code: "CMSSF", title: "Chief Master Sergeant of the Space Force", payGrade: "E-9" }
      ],
      warrant: [],
      officer: [
        { code: "2nd Lt", title: "Second Lieutenant", payGrade: "O-1" },
        { code: "1st Lt", title: "First Lieutenant", payGrade: "O-2" },
        { code: "Capt", title: "Captain", payGrade: "O-3" },
        { code: "Maj", title: "Major", payGrade: "O-4" },
        { code: "Lt Col", title: "Lieutenant Colonel", payGrade: "O-5" },
        { code: "Col", title: "Colonel", payGrade: "O-6" },
        { code: "Brig Gen", title: "Brigadier General", payGrade: "O-7" },
        { code: "Maj Gen", title: "Major General", payGrade: "O-8" },
        { code: "Lt Gen", title: "Lieutenant General", payGrade: "O-9" },
        { code: "Gen", title: "General", payGrade: "O-10" }
      ]
    },
    specialties: [
      "Space Operations", "Cyber Operations", "Intelligence", "Acquisition",
      "Engineering", "Communications", "Space Systems", "Orbital Warfare"
    ],
    culture: {
      greeting: "Semper Supra!",
      motto: "Semper Supra (Always Above)",
      values: ["Character", "Connection", "Commitment", "Courage"]
    }
  },
  coastguard: {
    id: "coastguard",
    name: "United States Coast Guard",
    shortName: "Coast Guard",
    emblem: "/attached_assets/U.S Coast Guard.jpg",
    colors: {
      primary: "#003366", // Coast Guard Blue
      secondary: "#FF0000", // Red
      accent: "#FFFFFF"    // White
    },
    terminology: {
      serviceMember: "Coast Guardsman",
      unit: "Unit",
      deployment: "Patrol/Mission",
      station: "Station/Base",
      command: "Sector/District"
    },
    ranks: {
      enlisted: [
        { code: "SR", title: "Seaman Recruit", payGrade: "E-1" },
        { code: "SA", title: "Seaman Apprentice", payGrade: "E-2" },
        { code: "SN", title: "Seaman", payGrade: "E-3" },
        { code: "PO3", title: "Petty Officer Third Class", payGrade: "E-4" },
        { code: "PO2", title: "Petty Officer Second Class", payGrade: "E-5" },
        { code: "PO1", title: "Petty Officer First Class", payGrade: "E-6" },
        { code: "CPO", title: "Chief Petty Officer", payGrade: "E-7" },
        { code: "SCPO", title: "Senior Chief Petty Officer", payGrade: "E-8" },
        { code: "MCPO", title: "Master Chief Petty Officer", payGrade: "E-9" },
        { code: "MCPOCG", title: "Master Chief Petty Officer of the Coast Guard", payGrade: "E-9" }
      ],
      warrant: [
        { code: "WO1", title: "Warrant Officer 1", payGrade: "W-1" },
        { code: "CWO2", title: "Chief Warrant Officer 2", payGrade: "W-2" },
        { code: "CWO3", title: "Chief Warrant Officer 3", payGrade: "W-3" },
        { code: "CWO4", title: "Chief Warrant Officer 4", payGrade: "W-4" }
      ],
      officer: [
        { code: "ENS", title: "Ensign", payGrade: "O-1" },
        { code: "LTJG", title: "Lieutenant Junior Grade", payGrade: "O-2" },
        { code: "LT", title: "Lieutenant", payGrade: "O-3" },
        { code: "LCDR", title: "Lieutenant Commander", payGrade: "O-4" },
        { code: "CDR", title: "Commander", payGrade: "O-5" },
        { code: "CAPT", title: "Captain", payGrade: "O-6" },
        { code: "RDML", title: "Rear Admiral", payGrade: "O-7" },
        { code: "RADM", title: "Rear Admiral", payGrade: "O-8" },
        { code: "VADM", title: "Vice Admiral", payGrade: "O-9" },
        { code: "ADM", title: "Admiral", payGrade: "O-10" }
      ]
    },
    specialties: [
      "Maritime Law Enforcement", "Search and Rescue", "Marine Safety",
      "Port Security", "Environmental Protection", "Ice Operations", "Aviation"
    ],
    culture: {
      greeting: "Semper Paratus!",
      motto: "Semper Paratus (Always Ready)",
      values: ["Honor", "Respect", "Devotion to Duty"]
    }
  }
};

export const getDefaultBranch = (): string => "army";

export const getBranchConfig = (branchId: string): BranchConfig => {
  return branchConfigs[branchId] || branchConfigs[getDefaultBranch()];
};

export const getAllBranches = (): BranchConfig[] => {
  return Object.values(branchConfigs);
};