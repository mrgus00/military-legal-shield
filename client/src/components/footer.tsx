import { Link } from "wouter";
import { Mail, Phone, MapPin, Shield, Scale, Users, BookOpen } from "lucide-react";
import Logo from "@/components/logo";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo width={140} height={50} className="filter brightness-0 invert" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Comprehensive legal support for military personnel and veterans. 
              24/7 emergency assistance, expert attorney matching, and AI-powered resources.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Shield className="w-4 h-4" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Scale className="w-4 h-4" />
                <span>Attorney Verified</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/urgent-match" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Emergency Legal Support
                </Link>
              </li>
              <li>
                <Link href="/attorneys" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Attorney Matching
                </Link>
              </li>
              <li>
                <Link href="/consultation-booking" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Legal Consultations
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Legal Resources
                </Link>
              </li>
              <li>
                <Link href="/scenarios" className="text-gray-300 hover:text-white transition-colors text-sm">
                  AI Training Scenarios
                </Link>
              </li>
              <li>
                <Link href="/career-assessment" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Career Transition
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help-center" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="/contact-support" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Education Center
                </Link>
              </li>
              <li>
                <Link href="/weekend-safety" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Weekend Safety
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">24/7 Emergency</p>
                  <p>1-800-MIL-HELP</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Support Email</p>
                  <p>support@mil-legal.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm text-gray-300">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Headquarters</p>
                  <p>Washington, DC<br />Serving All States</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-start space-x-6 text-sm text-gray-300">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/legal-disclaimers" className="hover:text-white transition-colors">
                Legal Disclaimers
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400 text-center lg:text-right">
              <p>&copy; 2024 Mil-Legal. All rights reserved.</p>
              <p className="mt-1">Supporting our nation's heroes with comprehensive legal assistance.</p>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="bg-red-800 rounded-lg p-4 mt-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-red-200 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-red-100">Emergency Legal Assistance Available 24/7</p>
              <p className="text-red-200 mt-1">
                For immediate military legal emergencies, use our Urgent Matching service or call 1-800-MIL-HELP
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}