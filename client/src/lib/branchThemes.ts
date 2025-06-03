export interface BranchTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  terminology: {
    personnel: string;
    unit: string;
    base: string;
    leader: string;
    mission: string;
  };
  ranks: {
    enlisted: string[];
    officers: string[];
  };
  motto: string;
  culture: {
    values: string[];
    traditions: string[];
  };
}

export const branchThemes: Record<string, BranchTheme> = {
  army: {
    id: 'army',
    name: 'U.S. Army',
    colors: {
      primary: '78 81 4', // Army Green
      secondary: '254 240 138', // Army Gold
      accent: '21 128 61', // Forest Green
      background: '248 250 252',
      text: '15 23 42',
      muted: '100 116 139'
    },
    terminology: {
      personnel: 'Soldiers',
      unit: 'Unit',
      base: 'Base/Fort',
      leader: 'Commander',
      mission: 'Mission'
    },
    ranks: {
      enlisted: ['PVT', 'PV2', 'PFC', 'SPC', 'CPL', 'SGT', 'SSG', 'SFC', 'MSG', 'SGM', 'CSM'],
      officers: ['2LT', '1LT', 'CPT', 'MAJ', 'LTC', 'COL', 'BG', 'MG', 'LTG', 'GEN']
    },
    motto: 'This We\'ll Defend',
    culture: {
      values: ['Loyalty', 'Duty', 'Respect', 'Selfless Service', 'Honor', 'Integrity', 'Personal Courage'],
      traditions: ['Army Birthday', 'Dining In', 'Change of Command', 'Reveille', 'Retreat']
    }
  },
  navy: {
    id: 'navy',
    name: 'U.S. Navy',
    colors: {
      primary: '30 58 138', // Navy Blue
      secondary: '254 240 138', // Gold
      accent: '2 132 199', // Ocean Blue
      background: '248 250 252',
      text: '15 23 42',
      muted: '100 116 139'
    },
    terminology: {
      personnel: 'Sailors',
      unit: 'Ship/Squadron',
      base: 'Naval Base/Station',
      leader: 'Commanding Officer',
      mission: 'Operation'
    },
    ranks: {
      enlisted: ['SR', 'SA', 'SN', 'PO3', 'PO2', 'PO1', 'CPO', 'SCPO', 'MCPO', 'MCPON'],
      officers: ['ENS', 'LTJG', 'LT', 'LCDR', 'CDR', 'CAPT', 'RADM(LH)', 'RADM(UH)', 'VADM', 'ADM']
    },
    motto: 'Honor, Courage, Commitment',
    culture: {
      values: ['Honor', 'Courage', 'Commitment'],
      traditions: ['Navy Birthday', 'Crossing the Line', 'Ship Commissioning', 'Anchors Aweigh', 'Liberty Call']
    }
  },
  marines: {
    id: 'marines',
    name: 'U.S. Marine Corps',
    colors: {
      primary: '153 27 27', // Marine Red
      secondary: '254 240 138', // Gold
      accent: '15 23 42', // Dark Blue
      background: '248 250 252',
      text: '15 23 42',
      muted: '100 116 139'
    },
    terminology: {
      personnel: 'Marines',
      unit: 'Unit/Battalion',
      base: 'Marine Corps Base',
      leader: 'Commanding Officer',
      mission: 'Mission'
    },
    ranks: {
      enlisted: ['Pvt', 'PFC', 'LCpl', 'Cpl', 'Sgt', 'SSgt', 'GySgt', 'MSgt', 'MGySgt', 'SgtMaj'],
      officers: ['2ndLt', '1stLt', 'Capt', 'Maj', 'LtCol', 'Col', 'BGen', 'MajGen', 'LtGen', 'Gen']
    },
    motto: 'Semper Fidelis',
    culture: {
      values: ['Honor', 'Courage', 'Commitment'],
      traditions: ['Marine Corps Birthday', 'Dress Blues', 'Eagle Globe and Anchor', 'Oorah', 'Silent Drill Platoon']
    }
  },
  airforce: {
    id: 'airforce',
    name: 'U.S. Air Force',
    colors: {
      primary: '30 58 138', // Air Force Blue
      secondary: '192 192 192', // Silver
      accent: '59 130 246', // Sky Blue
      background: '248 250 252',
      text: '15 23 42',
      muted: '100 116 139'
    },
    terminology: {
      personnel: 'Airmen',
      unit: 'Squadron/Wing',
      base: 'Air Force Base',
      leader: 'Commander',
      mission: 'Mission'
    },
    ranks: {
      enlisted: ['AB', 'Amn', 'A1C', 'SrA', 'SSgt', 'TSgt', 'MSgt', 'SMSgt', 'CMSgt', 'CMSAF'],
      officers: ['2d Lt', '1st Lt', 'Capt', 'Maj', 'Lt Col', 'Col', 'Brig Gen', 'Maj Gen', 'Lt Gen', 'Gen']
    },
    motto: 'Aim High... Fly-Fight-Win',
    culture: {
      values: ['Integrity First', 'Service Before Self', 'Excellence in All We Do'],
      traditions: ['Air Force Birthday', 'Dining Out', 'Flying Heritage', 'The Air Force Song', 'Warrior Week']
    }
  },
  coastguard: {
    id: 'coastguard',
    name: 'U.S. Coast Guard',
    colors: {
      primary: '3 105 161', // Coast Guard Blue
      secondary: '254 240 138', // Gold
      accent: '239 68 68', // Orange/Red
      background: '248 250 252',
      text: '15 23 42',
      muted: '100 116 139'
    },
    terminology: {
      personnel: 'Coast Guardsmen',
      unit: 'Cutter/Station',
      base: 'Coast Guard Base/Station',
      leader: 'Commanding Officer',
      mission: 'Operation'
    },
    ranks: {
      enlisted: ['SR', 'SA', 'SN', 'PO3', 'PO2', 'PO1', 'CPO', 'SCPO', 'MCPO', 'MCPOCG'],
      officers: ['ENS', 'LTJG', 'LT', 'LCDR', 'CDR', 'CAPT', 'RADM', 'VADM', 'ADM']
    },
    motto: 'Semper Paratus',
    culture: {
      values: ['Honor', 'Respect', 'Devotion to Duty'],
      traditions: ['Coast Guard Birthday', 'Rescue Swimmer', 'Lighthouse Service', 'Semper Paratus', 'Maritime Heritage']
    }
  },
  spaceforce: {
    id: 'spaceforce',
    name: 'U.S. Space Force',
    colors: {
      primary: '15 23 42', // Space Force Dark Blue
      secondary: '192 192 192', // Silver
      accent: '139 92 246', // Purple/Violet
      background: '248 250 252',
      text: '15 23 42',
      muted: '100 116 139'
    },
    terminology: {
      personnel: 'Guardians',
      unit: 'Squadron/Delta',
      base: 'Space Force Base',
      leader: 'Commander',
      mission: 'Mission'
    },
    ranks: {
      enlisted: ['Spc1', 'Spc2', 'Spc3', 'Spc4', 'Sgt', 'TSgt', 'MSgt', 'SMSgt', 'CMSgt', 'CMSSF'],
      officers: ['2d Lt', '1st Lt', 'Capt', 'Maj', 'Lt Col', 'Col', 'Brig Gen', 'Maj Gen', 'Lt Gen', 'Gen']
    },
    motto: 'Semper Supra',
    culture: {
      values: ['Character', 'Connection', 'Commitment', 'Courage'],
      traditions: ['Space Force Birthday', 'Space Heritage', 'Guardian Ideal', 'Semper Supra', 'Space Operations']
    }
  }
};

export function getBranchTheme(branchId: string): BranchTheme {
  return branchThemes[branchId] || branchThemes.army;
}

export function applyBranchTheme(branchId: string) {
  const theme = getBranchTheme(branchId);
  const root = document.documentElement;
  
  // Apply CSS custom properties for the selected branch theme
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.text);
  root.style.setProperty('--muted', theme.colors.muted);
  
  // Store the current branch for other components to use
  localStorage.setItem('selectedBranch', branchId);
  
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('branchThemeChanged', { 
    detail: { branchId, theme } 
  }));
}

export function getCurrentBranch(): string {
  return localStorage.getItem('selectedBranch') || 'army';
}

export function getCurrentBranchTheme(): BranchTheme {
  return getBranchTheme(getCurrentBranch());
}