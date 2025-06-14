import { Link } from "wouter";
import { Mail, Phone, MapPin, Shield, Scale, Users, BookOpen } from "lucide-react";
import Logo from "@/components/logo";
import { formatEmergencyContact, formatSupportContact, mobileButtonClasses, trackMobileInteraction } from "@/lib/mobile-optimization";

export default function Footer() {
  const emergencyContact = formatEmergencyContact();
  const supportContact = formatSupportContact();

  return (
    <footer className="bg-navy-900 text-white overflow-hidden" role="contentinfo">
      <div className="w-full max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo width={180} height={80} className="" />
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

          {/* Contact - Mobile Optimized */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-4">
              {/* Emergency Contact - Click to Call */}
              <div className="space-y-2">
                <p className="font-medium text-white text-sm">24/7 Emergency Legal Support</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a 
                    href={emergencyContact.callLink}
                    onClick={() => trackMobileInteraction('emergency_call', 'footer_button')}
                    className={`${mobileButtonClasses.call} text-sm bg-red-600 hover:bg-red-700 focus:ring-red-500`}
                    aria-label="Call Emergency Legal Support"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>
                  <a 
                    href={emergencyContact.emailLink}
                    onClick={() => trackMobileInteraction('emergency_email', 'footer_button')}
                    className={`${mobileButtonClasses.email} text-sm focus:ring-blue-500`}
                    aria-label="Email Emergency Legal Support"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
              
              {/* Support Contact */}
              <div className="space-y-2">
                <p className="font-medium text-white text-sm">General Support</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a 
                    href={supportContact.callLink}
                    onClick={() => trackMobileInteraction('support_call', 'footer_button')}
                    className={`${mobileButtonClasses.secondary} border-gray-500 text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-500 text-sm`}
                    aria-label="Call Support"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Support</span>
                  </a>
                  <a 
                    href={supportContact.emailLink}
                    onClick={() => trackMobileInteraction('support_email', 'footer_button')}
                    className={`${mobileButtonClasses.secondary} border-gray-500 text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-500 text-sm`}
                    aria-label="Email Support"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </a>
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
              <p>&copy; 2024 MilitaryLegalShield. All rights reserved.</p>
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