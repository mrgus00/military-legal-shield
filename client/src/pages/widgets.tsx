// Remove helmet import for now - can be added later if needed
import WidgetDashboard from "@/components/WidgetDashboard";
import { Grid3X3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Widgets() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-blue-50 p-4">

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Grid3X3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-navy-900">Smart Widgets</h1>
              <p className="text-gray-600">Enhanced data accessibility for your legal needs</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">Streamlined Legal Management</h2>
            <p className="text-blue-100 mb-4">
              Access your calendar, documents, and AI insights all in one place. These widgets provide 
              quick access to your essential legal information and enhance your workflow efficiency.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <h3 className="font-medium mb-1">Google Calendar</h3>
                <p className="text-blue-100">View legal appointments and consultations</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <h3 className="font-medium mb-1">Google Drive</h3>
                <p className="text-blue-100">Access documents and files directly</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <h3 className="font-medium mb-1">Smart Assistant</h3>
                <p className="text-blue-100">AI-powered insights and quick actions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Widget Dashboard */}
        <WidgetDashboard />

        {/* Integration Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-navy-900 mb-3">Enhanced Productivity</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Quick access to upcoming legal appointments</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Direct file access without switching applications</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>AI-powered recommendations for your cases</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Centralized dashboard for all legal activities</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-navy-900 mb-3">Security & Privacy</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Secure OAuth integration with Google services</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>End-to-end encryption for sensitive data</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>No data stored on external servers</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>GDPR and military security compliant</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/emergency-consultation">
              <Button variant="outline" className="w-full justify-start">
                Emergency Consultation
              </Button>
            </Link>
            <Link href="/ai-case-analysis">
              <Button variant="outline" className="w-full justify-start">
                AI Case Analysis
              </Button>
            </Link>
            <Link href="/attorneys">
              <Button variant="outline" className="w-full justify-start">
                Find Attorneys
              </Button>
            </Link>
            <Link href="/family-law-poas">
              <Button variant="outline" className="w-full justify-start">
                Generate Documents
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}