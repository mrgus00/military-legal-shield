import { useEffect } from "react";
import LegalJargonWizard from "@/components/legal-jargon-wizard";

export default function JargonWizardPage() {
  useEffect(() => {
    document.title = "Legal Jargon Wizard - MilitaryLegalShield";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <LegalJargonWizard />
      </div>
    </div>
  );
}