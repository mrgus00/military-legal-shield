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
    enlisted: Array<{payGrade: string; rank: string; abbreviation: string}>;
    officers: Array<{payGrade: string; rank: string; abbreviation: string}>;
    warrantOfficers?: Array<{payGrade: string; rank: string; abbreviation: string}>;
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
      enlisted: [
        {payGrade: 'E-1', rank: 'Private', abbreviation: 'PVT'},
        {payGrade: 'E-2', rank: 'Private Second Class', abbreviation: 'PV2'},
        {payGrade: 'E-3', rank: 'Private First Class', abbreviation: 'PFC'},
        {payGrade: 'E-4', rank: 'Specialist', abbreviation: 'SPC'},
        {payGrade: 'E-4', rank: 'Corporal', abbreviation: 'CPL'},
        {payGrade: 'E-5', rank: 'Sergeant', abbreviation: 'SGT'},
        {payGrade: 'E-6', rank: 'Staff Sergeant', abbreviation: 'SSG'},
        {payGrade: 'E-7', rank: 'Sergeant First Class', abbreviation: 'SFC'},
        {payGrade: 'E-8', rank: 'Master Sergeant', abbreviation: 'MSG'},
        {payGrade: 'E-8', rank: 'First Sergeant', abbreviation: '1SG'},
        {payGrade: 'E-9', rank: 'Sergeant Major', abbreviation: 'SGM'},
        {payGrade: 'E-9', rank: 'Command Sergeant Major', abbreviation: 'CSM'},
        {payGrade: 'E-9', rank: 'Sergeant Major of the Army', abbreviation: 'SMA'}
      ],
      officers: [
        {payGrade: 'O-1', rank: 'Second Lieutenant', abbreviation: '2LT'},
        {payGrade: 'O-2', rank: 'First Lieutenant', abbreviation: '1LT'},
        {payGrade: 'O-3', rank: 'Captain', abbreviation: 'CPT'},
        {payGrade: 'O-4', rank: 'Major', abbreviation: 'MAJ'},
        {payGrade: 'O-5', rank: 'Lieutenant Colonel', abbreviation: 'LTC'},
        {payGrade: 'O-6', rank: 'Colonel', abbreviation: 'COL'},
        {payGrade: 'O-7', rank: 'Brigadier General', abbreviation: 'BG'},
        {payGrade: 'O-8', rank: 'Major General', abbreviation: 'MG'},
        {payGrade: 'O-9', rank: 'Lieutenant General', abbreviation: 'LTG'},
        {payGrade: 'O-10', rank: 'General', abbreviation: 'GEN'}
      ],
      warrantOfficers: [
        {payGrade: 'W-1', rank: 'Warrant Officer 1', abbreviation: 'WO1'},
        {payGrade: 'W-2', rank: 'Chief Warrant Officer 2', abbreviation: 'CW2'},
        {payGrade: 'W-3', rank: 'Chief Warrant Officer 3', abbreviation: 'CW3'},
        {payGrade: 'W-4', rank: 'Chief Warrant Officer 4', abbreviation: 'CW4'},
        {payGrade: 'W-5', rank: 'Chief Warrant Officer 5', abbreviation: 'CW5'}
      ]
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
      enlisted: [
        {payGrade: 'E-1', rank: 'Seaman Recruit', abbreviation: 'SR'},
        {payGrade: 'E-2', rank: 'Seaman Apprentice', abbreviation: 'SA'},
        {payGrade: 'E-3', rank: 'Seaman', abbreviation: 'SN'},
        {payGrade: 'E-4', rank: 'Petty Officer Third Class', abbreviation: 'PO3'},
        {payGrade: 'E-5', rank: 'Petty Officer Second Class', abbreviation: 'PO2'},
        {payGrade: 'E-6', rank: 'Petty Officer First Class', abbreviation: 'PO1'},
        {payGrade: 'E-7', rank: 'Chief Petty Officer', abbreviation: 'CPO'},
        {payGrade: 'E-8', rank: 'Senior Chief Petty Officer', abbreviation: 'SCPO'},
        {payGrade: 'E-9', rank: 'Master Chief Petty Officer', abbreviation: 'MCPO'},
        {payGrade: 'E-9', rank: 'Master Chief Petty Officer of the Navy', abbreviation: 'MCPON'}
      ],
      officers: [
        {payGrade: 'O-1', rank: 'Ensign', abbreviation: 'ENS'},
        {payGrade: 'O-2', rank: 'Lieutenant Junior Grade', abbreviation: 'LTJG'},
        {payGrade: 'O-3', rank: 'Lieutenant', abbreviation: 'LT'},
        {payGrade: 'O-4', rank: 'Lieutenant Commander', abbreviation: 'LCDR'},
        {payGrade: 'O-5', rank: 'Commander', abbreviation: 'CDR'},
        {payGrade: 'O-6', rank: 'Captain', abbreviation: 'CAPT'},
        {payGrade: 'O-7', rank: 'Rear Admiral (Lower Half)', abbreviation: 'RADM(LH)'},
        {payGrade: 'O-8', rank: 'Rear Admiral (Upper Half)', abbreviation: 'RADM(UH)'},
        {payGrade: 'O-9', rank: 'Vice Admiral', abbreviation: 'VADM'},
        {payGrade: 'O-10', rank: 'Admiral', abbreviation: 'ADM'}
      ]
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
      enlisted: [
        {payGrade: 'E-1', rank: 'Private', abbreviation: 'Pvt'},
        {payGrade: 'E-2', rank: 'Private First Class', abbreviation: 'PFC'},
        {payGrade: 'E-3', rank: 'Lance Corporal', abbreviation: 'LCpl'},
        {payGrade: 'E-4', rank: 'Corporal', abbreviation: 'Cpl'},
        {payGrade: 'E-5', rank: 'Sergeant', abbreviation: 'Sgt'},
        {payGrade: 'E-6', rank: 'Staff Sergeant', abbreviation: 'SSgt'},
        {payGrade: 'E-7', rank: 'Gunnery Sergeant', abbreviation: 'GySgt'},
        {payGrade: 'E-8', rank: 'Master Sergeant', abbreviation: 'MSgt'},
        {payGrade: 'E-8', rank: 'First Sergeant', abbreviation: '1stSgt'},
        {payGrade: 'E-9', rank: 'Master Gunnery Sergeant', abbreviation: 'MGySgt'},
        {payGrade: 'E-9', rank: 'Sergeant Major', abbreviation: 'SgtMaj'},
        {payGrade: 'E-9', rank: 'Sergeant Major of the Marine Corps', abbreviation: 'SMMC'}
      ],
      officers: [
        {payGrade: 'O-1', rank: 'Second Lieutenant', abbreviation: '2ndLt'},
        {payGrade: 'O-2', rank: 'First Lieutenant', abbreviation: '1stLt'},
        {payGrade: 'O-3', rank: 'Captain', abbreviation: 'Capt'},
        {payGrade: 'O-4', rank: 'Major', abbreviation: 'Maj'},
        {payGrade: 'O-5', rank: 'Lieutenant Colonel', abbreviation: 'LtCol'},
        {payGrade: 'O-6', rank: 'Colonel', abbreviation: 'Col'},
        {payGrade: 'O-7', rank: 'Brigadier General', abbreviation: 'BGen'},
        {payGrade: 'O-8', rank: 'Major General', abbreviation: 'MajGen'},
        {payGrade: 'O-9', rank: 'Lieutenant General', abbreviation: 'LtGen'},
        {payGrade: 'O-10', rank: 'General', abbreviation: 'Gen'}
      ]
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
      enlisted: [
        {payGrade: 'E-1', rank: 'Airman Basic', abbreviation: 'AB'},
        {payGrade: 'E-2', rank: 'Airman', abbreviation: 'Amn'},
        {payGrade: 'E-3', rank: 'Airman First Class', abbreviation: 'A1C'},
        {payGrade: 'E-4', rank: 'Senior Airman', abbreviation: 'SrA'},
        {payGrade: 'E-5', rank: 'Staff Sergeant', abbreviation: 'SSgt'},
        {payGrade: 'E-6', rank: 'Technical Sergeant', abbreviation: 'TSgt'},
        {payGrade: 'E-7', rank: 'Master Sergeant', abbreviation: 'MSgt'},
        {payGrade: 'E-8', rank: 'Senior Master Sergeant', abbreviation: 'SMSgt'},
        {payGrade: 'E-9', rank: 'Chief Master Sergeant', abbreviation: 'CMSgt'},
        {payGrade: 'E-9', rank: 'Chief Master Sergeant of the Air Force', abbreviation: 'CMSAF'}
      ],
      officers: [
        {payGrade: 'O-1', rank: 'Second Lieutenant', abbreviation: '2d Lt'},
        {payGrade: 'O-2', rank: 'First Lieutenant', abbreviation: '1st Lt'},
        {payGrade: 'O-3', rank: 'Captain', abbreviation: 'Capt'},
        {payGrade: 'O-4', rank: 'Major', abbreviation: 'Maj'},
        {payGrade: 'O-5', rank: 'Lieutenant Colonel', abbreviation: 'Lt Col'},
        {payGrade: 'O-6', rank: 'Colonel', abbreviation: 'Col'},
        {payGrade: 'O-7', rank: 'Brigadier General', abbreviation: 'Brig Gen'},
        {payGrade: 'O-8', rank: 'Major General', abbreviation: 'Maj Gen'},
        {payGrade: 'O-9', rank: 'Lieutenant General', abbreviation: 'Lt Gen'},
        {payGrade: 'O-10', rank: 'General', abbreviation: 'Gen'}
      ]
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
      enlisted: [
        {payGrade: 'E-1', rank: 'Seaman Recruit', abbreviation: 'SR'},
        {payGrade: 'E-2', rank: 'Seaman Apprentice', abbreviation: 'SA'},
        {payGrade: 'E-3', rank: 'Seaman', abbreviation: 'SN'},
        {payGrade: 'E-4', rank: 'Petty Officer Third Class', abbreviation: 'PO3'},
        {payGrade: 'E-5', rank: 'Petty Officer Second Class', abbreviation: 'PO2'},
        {payGrade: 'E-6', rank: 'Petty Officer First Class', abbreviation: 'PO1'},
        {payGrade: 'E-7', rank: 'Chief Petty Officer', abbreviation: 'CPO'},
        {payGrade: 'E-8', rank: 'Senior Chief Petty Officer', abbreviation: 'SCPO'},
        {payGrade: 'E-9', rank: 'Master Chief Petty Officer', abbreviation: 'MCPO'},
        {payGrade: 'E-9', rank: 'Master Chief Petty Officer of the Coast Guard', abbreviation: 'MCPOCG'}
      ],
      officers: [
        {payGrade: 'O-1', rank: 'Ensign', abbreviation: 'ENS'},
        {payGrade: 'O-2', rank: 'Lieutenant Junior Grade', abbreviation: 'LTJG'},
        {payGrade: 'O-3', rank: 'Lieutenant', abbreviation: 'LT'},
        {payGrade: 'O-4', rank: 'Lieutenant Commander', abbreviation: 'LCDR'},
        {payGrade: 'O-5', rank: 'Commander', abbreviation: 'CDR'},
        {payGrade: 'O-6', rank: 'Captain', abbreviation: 'CAPT'},
        {payGrade: 'O-7', rank: 'Rear Admiral', abbreviation: 'RADM'},
        {payGrade: 'O-8', rank: 'Vice Admiral', abbreviation: 'VADM'},
        {payGrade: 'O-9', rank: 'Admiral', abbreviation: 'ADM'}
      ]
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
      enlisted: [
        {payGrade: 'E-1', rank: 'Specialist 1', abbreviation: 'Spc1'},
        {payGrade: 'E-2', rank: 'Specialist 2', abbreviation: 'Spc2'},
        {payGrade: 'E-3', rank: 'Specialist 3', abbreviation: 'Spc3'},
        {payGrade: 'E-4', rank: 'Specialist 4', abbreviation: 'Spc4'},
        {payGrade: 'E-5', rank: 'Sergeant', abbreviation: 'Sgt'},
        {payGrade: 'E-6', rank: 'Technical Sergeant', abbreviation: 'TSgt'},
        {payGrade: 'E-7', rank: 'Master Sergeant', abbreviation: 'MSgt'},
        {payGrade: 'E-8', rank: 'Senior Master Sergeant', abbreviation: 'SMSgt'},
        {payGrade: 'E-9', rank: 'Chief Master Sergeant', abbreviation: 'CMSgt'},
        {payGrade: 'E-9', rank: 'Chief Master Sergeant of the Space Force', abbreviation: 'CMSSF'}
      ],
      officers: [
        {payGrade: 'O-1', rank: 'Second Lieutenant', abbreviation: '2d Lt'},
        {payGrade: 'O-2', rank: 'First Lieutenant', abbreviation: '1st Lt'},
        {payGrade: 'O-3', rank: 'Captain', abbreviation: 'Capt'},
        {payGrade: 'O-4', rank: 'Major', abbreviation: 'Maj'},
        {payGrade: 'O-5', rank: 'Lieutenant Colonel', abbreviation: 'Lt Col'},
        {payGrade: 'O-6', rank: 'Colonel', abbreviation: 'Col'},
        {payGrade: 'O-7', rank: 'Brigadier General', abbreviation: 'Brig Gen'},
        {payGrade: 'O-8', rank: 'Major General', abbreviation: 'Maj Gen'},
        {payGrade: 'O-9', rank: 'Lieutenant General', abbreviation: 'Lt Gen'},
        {payGrade: 'O-10', rank: 'General', abbreviation: 'Gen'}
      ]
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
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return; // Skip on server-side rendering
  }
  
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
  if (window.localStorage) {
    localStorage.setItem('selectedBranch', branchId);
  }
  
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('branchThemeChanged', { 
    detail: { branchId, theme } 
  }));
}

export function getCurrentBranch(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('selectedBranch') || 'army';
  }
  return 'army';
}

export function getCurrentBranchTheme(): BranchTheme {
  return getBranchTheme(getCurrentBranch());
}