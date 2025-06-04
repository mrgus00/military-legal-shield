import PageLayout from "@/components/page-layout";
import SubscriptionPlans from "@/components/subscription-plans";
import { Shield, AlertTriangle } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-900 via-red-800 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Legal Defense Pricing
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Transparent pricing for military legal defense. From free basic resources to premium attorney matching and emergency services.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SubscriptionPlans />
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Choose Soldier on Fire?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Urgent Response</h3>
              <p className="text-gray-600">
                When legal trouble strikes, get connected with qualified defense attorneys in hours, not days.
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Military Focused</h3>
              <p className="text-gray-600">
                Built specifically for military personnel across all branches with deep understanding of military law.
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">
                Clear, upfront pricing with no hidden fees. Know exactly what you're paying for legal defense.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}