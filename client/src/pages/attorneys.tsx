import PageLayout from "@/components/page-layout";
import AttorneyCard from "@/components/attorney-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Shield, MapPin, Users, Phone, Globe, Star, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { Attorney } from "@shared/schema";

const militaryBases = [
  { id: 1, name: "Fort Stewart", state: "Georgia", location: "Fort Stewart, GA" },
  { id: 2, name: "Edwards Air Force Base", state: "California", location: "Edwards AFB, CA" },
  { id: 3, name: "Joint Base Lewis-McChord", state: "Washington", location: "Joint Base Lewis-McChord, WA" },
  { id: 4, name: "Eglin Air Force Base", state: "Florida", location: "Eglin AFB, FL" },
  { id: 5, name: "29 Palms Marine Corps Air Ground Combat Center", state: "California", location: "29 Palms, CA" },
  { id: 6, name: "China Lake Naval Air Weapons Station", state: "California", location: "China Lake, CA" },
  { id: 7, name: "Fort Jonathan Wainwright", state: "Alaska", location: "Fort Wainwright, AK" },
  { id: 8, name: "Yuma Proving Ground", state: "Arizona", location: "Yuma, AZ" },
  { id: 9, name: "Fort Bliss", state: "Texas", location: "Fort Bliss, TX" },
  { id: 10, name: "Fort Shafter", state: "Hawaii", location: "Fort Shafter, HI" },
  { id: 11, name: "U.S. Military Europe", state: "Europe", location: "Germany, Italy, UK" },
  { id: 12, name: "Fort Stewart", state: "Georgia", location: "Fort Stewart, GA" }
];

const militaryBaseAttorneys = {
  2: [ // Edwards AFB, California
    {
      id: "edwards-1",
      name: "Law Office of Patrick J. McLain, PLLC",
      location: "Nationwide",
      phone: "(888) 606-3385",
      website: "https://www.courtmartialdefenselawyer.com",
      specialties: ["Court-martial defense", "Administrative actions", "Appeals", "Security clearance issues"],
      description: "Former Marine Corps military judge with over 20 years of experience.",
      experience: "20+ years",
      rating: 4.9
    },
    {
      id: "edwards-2", 
      name: "Aaron Meyer Law",
      location: "California",
      phone: "Contact via website",
      website: "https://www.aaronmeyerlaw.com",
      specialties: ["Military criminal defense", "UCMJ violations", "Administrative separations"],
      description: "Former Marine Judge Advocate with extensive trial experience.",
      experience: "15+ years",
      rating: 4.8
    },
    {
      id: "edwards-3",
      name: "Gonzalez & Waddington, LLC", 
      location: "Nationwide",
      phone: "(800) 921-8607",
      website: "https://www.ucmjdefense.com",
      specialties: ["Court-martial defense", "Sexual assault allegations", "Administrative actions", "Appeals"],
      description: "Experienced military defense firm with nationwide practice.",
      experience: "25+ years",
      rating: 4.9
    },
    {
      id: "edwards-4",
      name: "Joseph L. Jordan, Attorney at Law",
      location: "Nationwide", 
      phone: "Contact via website",
      website: "https://www.jordanucmj.com",
      specialties: ["UCMJ defense", "Article 120 cases", "Article 15 proceedings", "Administrative boards"],
      description: "Former Army Judge Advocate with a strong track record.",
      experience: "18+ years",
      rating: 4.7
    },
    {
      id: "edwards-5",
      name: "Military Law Center",
      location: "California",
      phone: "Contact via website", 
      website: "https://www.militarylawcenter.com",
      specialties: ["Military defense", "Court-martial representation", "Legal guidance for service members"],
      description: "Experienced civilian military defense attorneys.",
      experience: "12+ years",
      rating: 4.6
    },
    {
      id: "edwards-6",
      name: "Kern Law, APC",
      location: "Southern California",
      phone: "(619) 202-5583",
      website: "https://www.kernlawsd.com", 
      specialties: ["Defense against civilian criminal charges", "DUI defense", "Domestic violence defense"],
      description: "Defense against civilian criminal charges affecting military personnel.",
      experience: "10+ years",
      rating: 4.5
    },
    {
      id: "edwards-7",
      name: "Richard V. Stevens, Attorney at Law",
      location: "Nationwide",
      phone: "Contact via website",
      website: "https://www.militaryappealslawyer.com",
      specialties: ["Court-martial defense", "Discharge upgrades", "Administrative actions"],
      description: "Former active duty JAG defense lawyer with worldwide practice.",
      experience: "22+ years", 
      rating: 4.8
    }
  ],
  3: [ // Joint Base Lewis-McChord, Washington
    {
      id: "jblm-1",
      name: "Law Office of Patrick J. McLain, PLLC",
      location: "Nationwide",
      phone: "(888) 606-3385",
      website: "https://www.courtmartialdefenselawyer.com",
      specialties: ["Court-martial defense", "Administrative actions", "Appeals", "Security clearance issues"],
      description: "Former Marine Corps military judge with over 20 years of experience.",
      experience: "20+ years",
      rating: 4.9
    },
    {
      id: "jblm-2",
      name: "Mangan Law",
      location: "Washington",
      phone: "(360) 908-2203",
      website: "https://www.manganlaw.com",
      specialties: ["Criminal investigations", "Administrative investigations", "Military medical privileging/credentialing", "Adverse administrative actions", "Court-martial representation"],
      description: "Led by Sean Mangan, a former military judge and law enforcement officer with over 30 years of experience.",
      experience: "30+ years",
      rating: 4.9
    },
    {
      id: "jblm-3",
      name: "Gagne, Scherer & Associates, LLC",
      location: "Nationwide",
      phone: "(800) 319-3134",
      website: "https://www.gagnescherer.com",
      specialties: ["Court-martial defense", "Sexual assault allegations", "Administrative actions", "Appeals"],
      description: "All attorneys are former military members who served in the Judge Advocate General's (JAG) Corps.",
      experience: "25+ years",
      rating: 4.8
    },
    {
      id: "jblm-4",
      name: "JAG Defense",
      location: "Nationwide",
      phone: "(877) 222-4199",
      website: "https://www.jagdefense.com",
      specialties: ["Military courts-martial", "Security clearance defense", "Administrative discharge boards", "Sex offenses", "Positive urinalysis tests", "Courts-martial appeals", "Non-judicial punishment/Article 15", "Flying evaluation boards", "Senior officer cases"],
      description: "Led by Grover H. Baxley, a former U.S. Air Force Judge Advocate.",
      experience: "22+ years",
      rating: 4.7
    },
    {
      id: "jblm-5",
      name: "Guy L. Womack & Associates, P.C.",
      location: "Nationwide",
      phone: "(713) 364-9913",
      website: "https://www.guywomack.com",
      specialties: ["Court-martial defense", "Court-martial appeals", "Discharge hearings", "Drug crimes", "Fraud crimes", "Officer misconduct", "Sex offenses"],
      description: "Led by Guy Womack, a former judge advocate and retired lieutenant colonel of the Marine Corps.",
      experience: "25+ years",
      rating: 4.8
    },
    {
      id: "jblm-6",
      name: "Beckwith Law Group",
      location: "Tacoma & Seattle, WA",
      phone: "(253) 238-8273",
      website: "https://www.beckwithlaw.com",
      specialties: ["Defense against civilian criminal charges", "DUI defense", "Domestic violence defense"],
      description: "Defense against civilian criminal charges affecting military personnel. Offers a 10% discount for active-duty military members.",
      experience: "15+ years",
      rating: 4.6
    },
    {
      id: "jblm-7",
      name: "Federal Practice Group",
      location: "Nationwide",
      phone: "Contact via website",
      website: "https://www.federalpracticegroup.com",
      specialties: ["Military criminal defense", "Administrative actions", "Security clearance issues"],
      description: "Over 100 years of combined military law experience.",
      experience: "100+ years combined",
      rating: 4.7
    }
  ],
  4: [ // Eglin Air Force Base, Florida
    {
      id: "eglin-1",
      name: "Joseph L. Jordan, Attorney at Law",
      location: "Nationwide",
      phone: "Contact via website",
      website: "https://www.jordanucmj.com",
      specialties: ["UCMJ defense", "Article 120 cases", "Article 15 proceedings", "Administrative boards"],
      description: "Former Army Judge Advocate with a strong track record.",
      experience: "18+ years",
      rating: 4.7
    },
    {
      id: "eglin-2",
      name: "Gonzalez & Waddington, LLC",
      location: "Nationwide",
      phone: "(800) 921-8607",
      website: "https://www.ucmjdefense.com",
      specialties: ["Court-martial defense", "Sexual assault allegations", "Administrative actions", "Appeals"],
      description: "Experienced military defense firm with nationwide practice.",
      experience: "25+ years",
      rating: 4.9
    },
    {
      id: "eglin-3",
      name: "Bilecki Law Group, PLLC",
      location: "Tampa, FL",
      phone: "(813) 669-3500",
      website: "https://www.bileckilaw.com",
      specialties: ["Court-martial defense", "UCMJ investigations", "Administrative separations", "Non-judicial punishment (NJP)", "GOMOR rebuttals"],
      description: "Specialized military defense firm serving Florida military personnel.",
      experience: "15+ years",
      rating: 4.8
    },
    {
      id: "eglin-4",
      name: "Flaherty & Merrifield",
      location: "Fort Walton Beach, FL",
      phone: "(850) 243-6097",
      website: "https://www.flahertymerrifield.com",
      specialties: ["Criminal defense", "DUI", "Domestic violence", "Sex offenses"],
      description: "Local criminal defense firm serving military personnel in the Fort Walton Beach area.",
      experience: "20+ years",
      rating: 4.6
    },
    {
      id: "eglin-5",
      name: "Gagne, Scherer & Associates, LLC",
      location: "Nationwide",
      phone: "(800) 319-3134",
      website: "https://www.gagnescherer.com",
      specialties: ["Court-martial defense", "Sexual assault allegations", "Administrative actions", "Appeals"],
      description: "All attorneys are former military members who served in the Judge Advocate General's (JAG) Corps.",
      experience: "25+ years",
      rating: 4.8
    },
    {
      id: "eglin-6",
      name: "Military Justice Attorneys",
      location: "Nationwide",
      phone: "Contact via website",
      website: "https://www.militaryjusticeattorneys.com",
      specialties: ["Court-martial defense", "Administrative actions", "Security clearance issues"],
      description: "Over 100 years of combined military law experience.",
      experience: "100+ years combined",
      rating: 4.7
    },
    {
      id: "eglin-7",
      name: "The Hanzel Law Firm",
      location: "Serves Florida",
      phone: "(843) 202-4714",
      website: "https://www.hanzellaw.com",
      specialties: ["Military sexual offenses", "Urinalysis & drug crimes", "UCMJ offenses", "Officer misconduct", "Military appeals", "Security clearances"],
      description: "Specialized military defense firm serving Florida military bases.",
      experience: "12+ years",
      rating: 4.6
    }
  ],
  5: [ // 29 Palms Marine Corps Air Ground Combat Center, California
    {
      id: "palms-1",
      name: "Law Office of Patrick J. McLain, PLLC",
      location: "Nationwide",
      phone: "(888) 606-3385",
      website: "https://www.courtmartialdefenselawyer.com",
      specialties: ["Court-martial defense", "Administrative actions", "Appeals", "Security clearance issues"],
      description: "Former Marine Corps military judge with over 20 years of experience.",
      experience: "20+ years",
      rating: 4.9
    },
    {
      id: "palms-2",
      name: "Military Law Center",
      location: "California",
      phone: "Contact via website",
      website: "https://www.militarylawcenter.com",
      specialties: ["Court-martial defense", "Administrative separations", "NJP", "Corrections of military records"],
      description: "Staffed by Marine veterans with extensive experience in military law.",
      experience: "15+ years",
      rating: 4.7
    },
    {
      id: "palms-3",
      name: "Aaron Meyer Law",
      location: "California",
      phone: "Contact via website",
      website: "https://www.aaronmeyerlaw.com",
      specialties: ["Military criminal defense", "UCMJ violations", "Administrative separations"],
      description: "Former Marine Judge Advocate with extensive trial experience.",
      experience: "15+ years",
      rating: 4.8
    },
    {
      id: "palms-4",
      name: "JAG Defense",
      location: "Nationwide",
      phone: "(877) 222-4199",
      website: "https://www.jagdefense.com",
      specialties: ["Military courts-martial", "Security clearance defense", "Administrative discharge boards", "Sex offenses", "Positive urinalysis tests", "Courts-martial appeals", "Non-judicial punishment/Article 15", "Flying evaluation boards", "Senior officer cases"],
      description: "Led by Grover H. Baxley, a former U.S. Air Force Judge Advocate.",
      experience: "22+ years",
      rating: 4.7
    },
    {
      id: "palms-5",
      name: "Richard V. Stevens, Attorney at Law",
      location: "Nationwide",
      phone: "Contact via website",
      website: "https://www.militaryappealslawyer.com",
      specialties: ["Court-martial defense", "Discharge upgrades", "Administrative actions"],
      description: "Former active duty JAG defense lawyer with worldwide practice.",
      experience: "22+ years",
      rating: 4.8
    },
    {
      id: "palms-6",
      name: "Military Justice Attorneys",
      location: "Nationwide",
      phone: "Contact via website",
      website: "https://www.militaryjusticeattorneys.com",
      specialties: ["Court-martial defense", "Administrative actions", "Security clearance issues"],
      description: "Over 100 years of combined military law experience.",
      experience: "100+ years combined",
      rating: 4.7
    }
  ],
  6: [ // NAWS China Lake, California
    {
      id: "china-1",
      name: "Gonzalez & Waddington, LLC",
      location: "Nationwide",
      phone: "(800) 921-8607",
      website: "https://www.ucmjdefense.com",
      specialties: ["Court-martial defense", "Sexual assault allegations", "Administrative actions", "Appeals"],
      description: "Experienced military defense firm with nationwide practice.",
      experience: "25+ years",
      rating: 4.9
    },
    {
      id: "china-2",
      name: "Kral Military Defense",
      location: "California",
      phone: "Contact via website",
      website: "https://www.kralmilitarydefense.com",
      specialties: ["Courts-martial", "Military discipline defense", "Military investigations", "Military sexual assault", "UCMJ crimes"],
      description: "Attorneys Stephanie Kral and Abbigayle Hunter are military veterans with over 25 years of combined experience.",
      experience: "25+ years combined",
      rating: 4.8
    },
    {
      id: "china-3",
      name: "Law Office of Patrick J. McLain, PLLC",
      location: "Nationwide",
      phone: "(888) 606-3385",
      website: "https://www.courtmartialdefenselawyer.com",
      specialties: ["Court-martial defense", "Administrative actions", "Appeals", "Security clearance issues"],
      description: "Former Marine Corps military judge with over 20 years of experience.",
      experience: "20+ years",
      rating: 4.9
    },
    {
      id: "china-4",
      name: "Military Law Center",
      location: "California",
      phone: "(760) 536-9038",
      website: "https://www.militarylawcenter.com",
      specialties: ["Court-martial defense", "Administrative separations", "NJP", "Corrections of military records"],
      description: "Staffed by Marine veterans with extensive experience in military law.",
      experience: "15+ years",
      rating: 4.7
    },
    {
      id: "china-5",
      name: "Richard V. Stevens, Attorney at Law",
      location: "Nationwide",
      phone: "Contact via website",
      website: "https://www.militaryappealslawyer.com",
      specialties: ["Court-martial defense", "Discharge upgrades", "Administrative actions"],
      description: "Former active duty JAG defense lawyer with worldwide practice.",
      experience: "22+ years",
      rating: 4.8
    }
  ],
  7: [ // Fort Wainwright, Alaska
    {
      id: "wainwright-1",
      name: "Mangan Law",
      location: "Fort Wainwright, AK",
      phone: "(360) 908-2203",
      website: "https://www.manganlaw.com",
      specialties: ["Court-martial defense", "Administrative actions", "Military medical privileging/credentialing", "Adverse administrative actions"],
      description: "Led by LTC (Ret) Sean F. Mangan, a former military judge with over 30 years of experience.",
      experience: "30+ years",
      rating: 4.9
    },
    {
      id: "wainwright-2",
      name: "JAG Defense",
      location: "Nationwide",
      phone: "(877) 222-4199",
      website: "https://www.jagdefense.com",
      specialties: ["Military courts-martial", "Security clearance defense", "Administrative discharge boards", "Sex offenses", "Positive urinalysis tests", "Courts-martial appeals", "Non-judicial punishment/Article 15", "Flying evaluation boards", "Senior officer cases"],
      description: "Led by Grover H. Baxley, a former U.S. Air Force Judge Advocate.",
      experience: "22+ years",
      rating: 4.7
    },
    {
      id: "wainwright-3",
      name: "Gonzalez & Waddington, LLC",
      location: "Nationwide",
      phone: "(800) 921-8607",
      website: "https://www.ucmjdefense.com",
      specialties: ["Court-martial defense", "Sexual assault allegations", "Administrative actions", "Appeals"],
      description: "Experienced military defense firm with nationwide practice.",
      experience: "25+ years",
      rating: 4.9
    },
    {
      id: "wainwright-4",
      name: "Joseph L. Jordan, Attorney at Law",
      location: "Nationwide",
      phone: "Contact via website",
      website: "https://www.jordanucmj.com",
      specialties: ["UCMJ defense", "Article 120 cases", "Article 15 proceedings", "Administrative boards"],
      description: "Former Army Judge Advocate with a strong track record.",
      experience: "18+ years",
      rating: 4.7
    },
    {
      id: "wainwright-5",
      name: "Timothy J.L. FitzGibbon",
      location: "Fairbanks, AK",
      phone: "(617) 826-9306",
      website: "https://www.fitzgibbonlaw.com",
      specialties: ["Military law", "Administrative law", "Immigration law"],
      description: "Offers video conferencing for remote consultations.",
      experience: "15+ years",
      rating: 4.6
    }
  ],
  8: [ // Yuma Proving Ground, Arizona
    {
      id: "yuma-1",
      name: "Capovilla & Williams",
      location: "Nationwide",
      phone: "(855) 684-0743",
      website: "https://www.capovilla-williams.com",
      specialties: ["Court-martial defense", "Administrative actions", "UCMJ violations", "Sexual assault", "Domestic violence", "Drug offenses", "AWOL"],
      description: "Nationwide military defense firm specializing in complex UCMJ cases.",
      experience: "18+ years",
      rating: 4.8
    },
    {
      id: "yuma-2",
      name: "Gonzalez & Waddington, LLC",
      location: "Nationwide",
      phone: "(800) 921-8607",
      website: "https://www.ucmjdefense.com",
      specialties: ["Court-martial defense", "Sexual assault allegations", "Administrative actions", "Appeals"],
      description: "Experienced military defense firm with nationwide practice.",
      experience: "25+ years",
      rating: 4.9
    },
    {
      id: "yuma-3",
      name: "Law Office of Patrick J. McLain, PLLC",
      location: "Nationwide",
      phone: "(888) 606-3385",
      website: "https://www.courtmartialdefenselawyer.com",
      specialties: ["Court-martial defense", "Administrative actions", "Appeals", "Security clearance issues"],
      description: "Former Marine Corps military judge with over 20 years of experience.",
      experience: "20+ years",
      rating: 4.9
    },
    {
      id: "yuma-4",
      name: "Stone Rose Law",
      location: "Arizona",
      phone: "(480) 498-8998",
      website: "https://www.stoneroselaw.com",
      specialties: ["Court-martial defense", "Administrative separation (ADSEP)", "UCMJ violations"],
      description: "Arizona-based military defense firm serving southwestern installations.",
      experience: "12+ years",
      rating: 4.7
    },
    {
      id: "yuma-5",
      name: "Military Law Center",
      location: "California & Arizona",
      phone: "(760) 536-9038",
      website: "https://www.militarylawcenter.com",
      specialties: ["Court-martial defense", "Administrative separations", "NJP", "Corrections of military records"],
      description: "Staffed by Marine veterans with extensive experience in military law.",
      experience: "15+ years",
      rating: 4.7
    }
  ],
  9: [ // Fort Bliss, Texas
    {
      id: "bliss-1",
      name: "Capovilla & Williams",
      location: "Nationwide",
      phone: "(404) 496-7674",
      website: "https://www.capovilla-williams.com",
      specialties: ["Court-martial defense", "Administrative actions", "UCMJ violations", "Sexual assault", "Domestic violence", "Drug offenses", "AWOL"],
      description: "Nationwide military defense firm specializing in complex UCMJ cases.",
      experience: "18+ years",
      rating: 4.8
    },
    {
      id: "bliss-2",
      name: "Law Office of Patrick J. McLain, PLLC",
      location: "Nationwide",
      phone: "(888) 606-3385",
      website: "https://www.courtmartialdefenselawyer.com",
      specialties: ["Court-martial defense", "Administrative actions", "Appeals", "Security clearance issues"],
      description: "Former Marine Corps military judge with over 20 years of experience.",
      experience: "20+ years",
      rating: 4.9
    },
    {
      id: "bliss-3",
      name: "Military Trial Defenders",
      location: "El Paso, TX",
      phone: "Contact via website",
      website: "https://www.militarytrialdefenders.com",
      specialties: ["Court-martial defense", "Administrative separations", "UCMJ violations"],
      description: "Team of experienced military defense attorneys serving the El Paso area.",
      experience: "15+ years",
      rating: 4.7
    },
    {
      id: "bliss-4",
      name: "Aaron Meyer Law",
      location: "California",
      phone: "Contact via website",
      website: "https://www.aaronmeyerlaw.com",
      specialties: ["Military criminal defense", "UCMJ violations", "Administrative separations"],
      description: "Former Marine Judge Advocate with extensive trial experience.",
      experience: "15+ years",
      rating: 4.8
    },
    {
      id: "bliss-5",
      name: "R. Davis Younts, Esq.",
      location: "Nationwide",
      phone: "Contact via website",
      website: "https://www.yountslawfirm.com",
      specialties: ["Court-martial defense", "Administrative actions", "UCMJ violations"],
      description: "Former Air Force JAG with extensive experience in military justice.",
      experience: "20+ years",
      rating: 4.8
    },
    {
      id: "bliss-6",
      name: "Colby Vokey Law",
      location: "Nationwide",
      phone: "Contact via website",
      website: "https://www.colbyvokeylaw.com",
      specialties: ["Court-martial defense", "Administrative actions", "UCMJ violations"],
      description: "Retired Marine Corps Lieutenant Colonel with over 20 years of experience.",
      experience: "20+ years",
      rating: 4.8
    },
    {
      id: "bliss-7",
      name: "Law Office of Abrar & Vergara",
      location: "El Paso, TX",
      phone: "(915) 444-6675",
      website: "https://www.abrarvergara.com",
      specialties: ["Military defense", "Court-martial representation", "Administrative actions"],
      description: "Experienced legal team dedicated to defending service members in the El Paso area.",
      experience: "12+ years",
      rating: 4.6
    }
  ],
  10: [ // White Sands Missile Range, New Mexico
    {
      id: "sands-1",
      name: "Gonzalez & Waddington, LLC",
      location: "Nationwide",
      phone: "(800) 921-8607",
      website: "https://www.ucmjdefense.com",
      specialties: ["Court-martial defense", "Sexual assault allegations", "Administrative actions", "Appeals"],
      description: "Experienced military defense firm with nationwide practice.",
      experience: "25+ years",
      rating: 4.9
    },
    {
      id: "sands-2",
      name: "Richard V. Stevens, Attorney at Law",
      location: "Nationwide",
      phone: "(888) 399-0693",
      website: "https://www.militaryappealslawyer.com",
      specialties: ["Court-martial defense", "Administrative actions", "UCMJ violations"],
      description: "Former active duty JAG defense lawyer with worldwide practice.",
      experience: "22+ years",
      rating: 4.8
    },
    {
      id: "sands-3",
      name: "The Matthew James",
      location: "Las Cruces, NM",
      phone: "(575) 526-7765",
      website: "https://www.thematthewjames.com",
      specialties: ["Military defense", "Court-martial representation", "Administrative actions"],
      description: "Experienced legal team dedicated to defending service members in the Las Cruces area.",
      experience: "12+ years",
      rating: 4.6
    },
    {
      id: "sands-4",
      name: "Ray Rojas Law L.L.C.",
      location: "Las Cruces, NM",
      phone: "(575) 526-7765",
      website: "https://www.rayrojaslaw.com",
      specialties: ["Criminal defense", "Military law", "Immigration law"],
      description: "Local Las Cruces firm offering comprehensive legal services including military law.",
      experience: "10+ years",
      rating: 4.5
    },
    {
      id: "sands-5",
      name: "Military Law Center",
      location: "Nationwide",
      phone: "(760) 536-9038",
      website: "https://www.militarylawcenter.com",
      specialties: ["Court-martial defense", "Administrative separations", "NJP", "Corrections of military records"],
      description: "Staffed by Marine veterans with extensive experience in military law.",
      experience: "15+ years",
      rating: 4.7
    }
  ],
  10: [ // Fort Shafter, Hawaii
    {
      id: "shafter-1",
      name: "Bilecki Law Group, PLLC",
      location: "Honolulu, HI",
      phone: "(808) 745-1041",
      website: "https://www.bileckilaw.com",
      specialties: ["Court-martial defense", "Administrative separations", "UCMJ violations"],
      description: "Led by Timothy J. Bilecki, former Army JAG with extensive trial experience.",
      experience: "15+ years",
      rating: 4.8
    },
    {
      id: "shafter-2",
      name: "Ganz & Bridges Law Office",
      location: "Honolulu, HI",
      phone: "(808) 358-7318",
      website: "https://www.ganzbridges.com",
      specialties: ["Court-martial defense", "GOMOR rebuttals", "Military sexual assault defense", "Administrative separations"],
      description: "Led by COL (Ret.) Mark Bridges, former Army JAG.",
      experience: "25+ years",
      rating: 4.9
    },
    {
      id: "shafter-3",
      name: "Court & Carpenter, PC",
      location: "Serving Hawaii",
      phone: "(202) 695-8499",
      website: "https://www.courtcarpenter.com",
      specialties: ["Court-martial defense", "Administrative separations", "UCMJ violations"],
      description: "Military-only law firm with global experience.",
      experience: "20+ years",
      rating: 4.8
    },
    {
      id: "shafter-4",
      name: "David S. Hendrickson",
      location: "Honolulu, HI",
      phone: "(808) 729-8937",
      website: "https://www.hendricksonlaw.com",
      specialties: ["Court-martial defense", "Military criminal defense", "Administrative actions"],
      description: "Former Army JAG with a high success rate in courts-martial.",
      experience: "18+ years",
      rating: 4.7
    },
    {
      id: "shafter-5",
      name: "Military Justice Attorneys",
      location: "Serving Hawaii",
      phone: "(843) 773-5501",
      website: "https://www.militaryjusticeattorneys.com",
      specialties: ["Court-martial defense", "Administrative actions", "Discharge upgrades"],
      description: "Team of former military officers with over 40 years of combined experience.",
      experience: "40+ years combined",
      rating: 4.7
    }
  ],
  11: [ // U.S. Military Europe
    {
      id: "europe-1",
      name: "The Hanzel Law Firm",
      location: "Europe",
      phone: "(843) 202-4714",
      website: "https://www.hanzellaw.com",
      specialties: ["Military sexual offenses", "Urinalysis & drug crimes", "UCMJ offenses", "Officer misconduct", "Hazing", "Appeals", "Security clearances", "NJP/Article 15", "Administrative separation"],
      description: "Led by Michael B. Hanzel, former U.S. Navy JAG officer with European litigation experience.",
      experience: "20+ years",
      rating: 4.8
    },
    {
      id: "europe-2",
      name: "Bilecki Law Group, PLLC",
      location: "Europe",
      phone: "(813) 669-3500",
      website: "https://www.bileckilaw.com",
      specialties: ["Court-martial defense", "Administrative separations", "UCMJ violations"],
      description: "Led by Timothy J. Bilecki, former Army JAG with extensive European trial experience.",
      experience: "15+ years",
      rating: 4.8
    },
    {
      id: "europe-3",
      name: "Court & Carpenter, PC",
      location: "Kaiserslautern, Germany",
      phone: "(202) 695-8499",
      website: "https://www.courtcarpenter.com",
      specialties: ["Court-martial defense", "Administrative separations", "UCMJ violations"],
      description: "Military-only law firm with global experience and German presence.",
      experience: "20+ years",
      rating: 4.8
    },
    {
      id: "europe-4",
      name: "Law Office of Will M. Helixon",
      location: "Vilseck & Wiesbaden, Germany",
      phone: "Contact via website",
      website: "https://www.helixonlaw.com",
      specialties: ["Court-martial defense", "Administrative boards", "Adverse administrative actions", "GOMORs", "NJP", "QMP Boards"],
      description: "Military lawyers residing in Germany with deep understanding of local legal landscape.",
      experience: "12+ years",
      rating: 4.7
    },
    {
      id: "europe-5",
      name: "Gonzalez & Waddington, LLC",
      location: "Germany & United Kingdom",
      phone: "(800) 921-8607",
      website: "https://www.ucmjdefense.com",
      specialties: ["Court-martial defense", "Sexual assault allegations", "Administrative actions", "Appeals"],
      description: "Experienced military defense firm serving Germany and UK installations.",
      experience: "25+ years",
      rating: 4.9
    },
    {
      id: "europe-6",
      name: "Peter Kageleiry, Jr., Attorney at Law",
      location: "Kaiserslautern, Germany & Italy",
      phone: "Contact via website",
      website: "https://www.kageleiry.com",
      specialties: ["Court-martial defense", "Administrative actions", "UCMJ violations"],
      description: "Experienced military defense lawyer focused on protecting service members' careers.",
      experience: "18+ years",
      rating: 4.7
    },
    {
      id: "europe-7",
      name: "Saccucci & Partners",
      location: "Italy",
      phone: "Contact via website",
      website: "https://www.saccuccipartners.com",
      specialties: ["Military personnel law", "Armed forces representation"],
      description: "Well-established team of lawyers specializing in military law for Italian installations.",
      experience: "15+ years",
      rating: 4.6
    },
    {
      id: "europe-8",
      name: "Karns Law Firm",
      location: "Germany",
      phone: "Contact via website",
      website: "https://www.karnslaw.com",
      specialties: ["Court-martial defense", "Administrative adverse actions"],
      description: "Represents service members across various U.S. military installations in Germany.",
      experience: "14+ years",
      rating: 4.6
    }
  ],
  12: [ // Fort Stewart, Georgia
    {
      id: "stewart-1",
      name: "JAG Defense",
      location: "Serves Fort Stewart",
      phone: "(877) 222-4199",
      website: "https://www.jagdefense.com",
      specialties: ["Military courts-martial", "Security clearance defense", "Military sexual assault", "Administrative discharges", "NJP/Article 15", "Courts-martial appeals"],
      description: "Specialized military defense firm serving Fort Stewart with comprehensive UCMJ expertise.",
      experience: "20+ years",
      rating: 4.8
    },
    {
      id: "stewart-2",
      name: "Mangan Law",
      location: "Savannah, GA",
      phone: "(360) 908-2203",
      website: "https://www.manganlaw.com",
      specialties: ["Criminal investigations", "Administrative investigations", "Military medical privileging/credentialing", "Adverse administrative actions", "Court-martial representation"],
      description: "Savannah-based firm specializing in military legal defense and medical credentialing issues.",
      experience: "15+ years",
      rating: 4.7
    },
    {
      id: "stewart-3",
      name: "Arnold & Stafford",
      location: "Hinesville, GA",
      phone: "(912) 289-0673",
      website: "https://www.arnoldstafford.com",
      specialties: ["Courts-martial", "Article 15", "Chapter separations", "Letters of reprimand", "Medical boards", "Military medical malpractice"],
      description: "Local Hinesville firm with extensive Fort Stewart military legal experience.",
      experience: "18+ years",
      rating: 4.7
    },
    {
      id: "stewart-4",
      name: "Balbo & Gregg, Attorneys at Law, PC",
      location: "Hinesville, GA",
      phone: "(866) 580-3089",
      website: "https://www.balbogregg.com",
      specialties: ["Military law", "Criminal defense", "Family law", "DUI & traffic offenses"],
      description: "Comprehensive legal services for Fort Stewart personnel and families in Hinesville.",
      experience: "12+ years",
      rating: 4.6
    },
    {
      id: "stewart-5",
      name: "The Hanzel Law Firm",
      location: "Serves Georgia",
      phone: "(843) 202-4714",
      website: "https://www.hanzellaw.com",
      specialties: ["Military sexual offenses", "Urinalysis & drug crimes", "UCMJ offenses", "Officer misconduct", "Military appeals", "Security clearances"],
      description: "Former U.S. Navy JAG officer serving Georgia military installations.",
      experience: "20+ years",
      rating: 4.8
    },
    {
      id: "stewart-6",
      name: "Capovilla & Williams",
      location: "Serves Fort Stewart",
      phone: "(855) 684-0743",
      website: "https://www.capovilla-williams.com",
      specialties: ["Disciplinary measures", "Courts-martial", "Separation boards", "GOMOR rebuttals", "OER/NCOER rebuttals"],
      description: "Nationwide firm with dedicated Fort Stewart military defense coverage.",
      experience: "18+ years",
      rating: 4.8
    },
    {
      id: "stewart-7",
      name: "Shewmaker & Shewmaker",
      location: "Serves Fort Stewart",
      phone: "(770) 939-1939",
      website: "https://www.shewmakerlaw.com",
      specialties: ["UCMJ offenses", "Administrative hearings", "Sexual assault defense"],
      description: "Georgia-based military defense specialists serving Fort Stewart personnel.",
      experience: "16+ years",
      rating: 4.7
    },
    {
      id: "stewart-8",
      name: "Gonzalez & Waddington",
      location: "Serves Fort Stewart",
      phone: "(800) 921-8607",
      website: "https://www.ucmjdefense.com",
      specialties: ["Court-martial defense", "UCMJ actions", "Administrative separation boards", "Article 120 offenses"],
      description: "Experienced military defense firm with Fort Stewart coverage and Article 120 expertise.",
      experience: "25+ years",
      rating: 4.9
    }
  ]
};

export default function Attorneys() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBase, setSelectedBase] = useState<number | null>(null);
  const [showMilitaryBases, setShowMilitaryBases] = useState<boolean>(true);
  
  const { data: attorneys, isLoading } = useQuery<Attorney[]>({
    queryKey: ["/api/attorneys"],
  });

  const filteredAttorneys = attorneys?.filter(attorney => {
    if (searchQuery === "") return true;
    const query = searchQuery.toLowerCase();
    return attorney.firstName.toLowerCase().includes(query) ||
           attorney.lastName.toLowerCase().includes(query) ||
           attorney.location.toLowerCase().includes(query) ||
           attorney.specialties.some(specialty => specialty.toLowerCase().includes(query));
  }) || [];

  return (
    <PageLayout className="bg-white">
      
      {/* Simplified Hero */}
      <section className="bg-navy-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Find Your Military Attorney
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Connect with experienced military law attorneys
          </p>
          
          {/* Simple Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, location, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Top 10 Military Bases Section */}
      {showMilitaryBases && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy-900 mb-4">
                Top 10 Largest Military Bases in the United States
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Each military base listed below includes a curated selection of reputable military defense attorneys and law firms. Select a base to view attorneys available in that location.
              </p>
              <Button
                variant="outline"
                onClick={() => setShowMilitaryBases(false)}
                className="mb-8"
              >
                View All Attorneys Instead
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {militaryBases.map((base, index) => (
                <Card 
                  key={base.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                    selectedBase === base.id ? 'ring-2 ring-yellow-400 bg-yellow-50' : 'hover:border-yellow-400'
                  }`}
                  onClick={() => setSelectedBase(base.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <Users className="w-5 h-5 text-yellow-600" />
                    </div>
                    
                    <h3 className="font-semibold text-navy-900 mb-2 text-sm leading-tight">
                      {base.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {base.location}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {base.state}
                      </span>
                      <span className="text-xs text-yellow-600 font-medium">
                        View Attorneys →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedBase && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-navy-900 mb-2">
                      🛡️ Military Defense Attorneys Serving {militaryBases.find(b => b.id === selectedBase)?.name}
                    </h3>
                    <p className="text-gray-600">
                      {militaryBases.find(b => b.id === selectedBase)?.location} • {militaryBaseAttorneys[selectedBase]?.length || 0} Attorneys Available
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedBase(null)}
                    >
                      ← Back to Bases
                    </Button>
                    <Button
                      onClick={() => {
                        setShowMilitaryBases(false);
                        setSelectedBase(null);
                      }}
                    >
                      View All Attorneys
                    </Button>
                  </div>
                </div>

                {militaryBaseAttorneys[selectedBase] ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {militaryBaseAttorneys[selectedBase].map((attorney) => (
                      <Card key={attorney.id} className="hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-navy-900 text-lg mb-2 leading-tight">
                                {attorney.name}
                              </h4>
                              <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{attorney.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-700">{attorney.rating}</span>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {attorney.description}
                          </p>

                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1 mb-3">
                              {attorney.specialties.slice(0, 3).map((specialty, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-navy-100 text-navy-800 text-xs rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                              {attorney.specialties.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{attorney.specialties.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{attorney.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <a 
                                href={attorney.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-yellow-600 hover:text-yellow-700 hover:underline"
                              >
                                Visit Website
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">{attorney.experience}</span>
                            <Button size="sm" className="bg-navy-900 hover:bg-navy-800">
                              Contact Attorney
                              <ExternalLink className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Attorneys Coming Soon
                    </h4>
                    <p className="text-gray-600">
                      Attorney listings for {militaryBases.find(b => b.id === selectedBase)?.name} will be available soon.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Clean Attorney Grid */}
      {!showMilitaryBases && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Button
                variant="outline"
                onClick={() => setShowMilitaryBases(true)}
                className="mb-6"
              >
                ← Browse by Military Base
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-navy-900 mb-2">
                    {filteredAttorneys.length} Available Attorneys
                  </h2>
                  <p className="text-gray-600">
                    Ready to provide expert military legal assistance
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAttorneys.map((attorney) => (
                    <AttorneyCard key={attorney.id} attorney={attorney} />
                  ))}
                </div>
                
                {filteredAttorneys.length === 0 && (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No attorneys found</h3>
                    <p className="text-gray-600">Try adjusting your search terms</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}
      
    </PageLayout>
  );
}