import { useEffect } from "react";
import AnalyticsDashboard from "@/components/analytics-dashboard";

export default function Analytics() {
  useEffect(() => {
    document.title = "Live Analytics - MilitaryLegalShield";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}