import { Helmet } from "react-helmet-async";
import AnalyticsDashboard from "@/components/analytics-dashboard";

export default function Analytics() {
  return (
    <>
      <Helmet>
        <title>Live Analytics - MilitaryLegalShield</title>
        <meta name="description" content="Real-time platform analytics and traffic monitoring for MilitaryLegalShield" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <AnalyticsDashboard />
        </div>
      </div>
    </>
  );
}