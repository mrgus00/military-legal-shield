import React, { useState } from 'react';
import { HelpCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface MilitaryTooltipProps {
  content: string;
  type?: 'info' | 'warning' | 'success' | 'help';
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  children: React.ReactNode;
  militaryStyle?: boolean;
}

const MilitaryTooltip: React.FC<MilitaryTooltipProps> = ({
  content,
  type = 'info',
  position = 'top',
  trigger = 'hover',
  children,
  militaryStyle = true
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'help':
        return <HelpCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTooltipClasses = () => {
    const baseClasses = `
      absolute z-50 px-3 py-2 text-sm font-medium text-white rounded-lg shadow-lg
      transition-opacity duration-300 max-w-xs
      ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `;

    const typeClasses = {
      info: 'bg-blue-900 border border-blue-700',
      warning: 'bg-yellow-900 border border-yellow-700',
      success: 'bg-green-900 border border-green-700',
      help: 'bg-gray-900 border border-gray-700'
    };

    const positionClasses = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };

    return `${baseClasses} ${typeClasses[type]} ${positionClasses[position]}`;
  };

  const getArrowClasses = () => {
    const arrowClasses = {
      top: 'top-full left-1/2 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-4 border-l-4 border-r-4 border-transparent',
      left: 'left-full top-1/2 transform -translate-y-1/2 border-l-4 border-t-4 border-b-4 border-transparent',
      right: 'right-full top-1/2 transform -translate-y-1/2 border-r-4 border-t-4 border-b-4 border-transparent'
    };

    const arrowColors = {
      info: 'border-t-blue-900',
      warning: 'border-t-yellow-900',
      success: 'border-t-green-900',
      help: 'border-t-gray-900'
    };

    return `absolute w-0 h-0 ${arrowClasses[position]} ${arrowColors[type]}`;
  };

  const formatMilitaryContent = (text: string) => {
    if (!militaryStyle) return text;
    
    // Add military communication style formatting
    return text
      .replace(/\b(important|critical|urgent)\b/gi, '⚠️ $1'.toUpperCase())
      .replace(/\b(complete|completed|done)\b/gi, '✓ $1')
      .replace(/\b(required|mandatory)\b/gi, '🔒 $1'.toUpperCase())
      .replace(/\b(classified|confidential)\b/gi, '🔐 $1'.toUpperCase());
  };

  const handleTrigger = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsVisible(false);
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTrigger}
    >
      {children}
      
      <div className={getTooltipClasses()}>
        <div className="flex items-start space-x-2">
          {getIcon()}
          <div 
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatMilitaryContent(content) }}
          />
        </div>
        <div className={getArrowClasses()}></div>
      </div>
    </div>
  );
};

export default MilitaryTooltip;

// Pre-defined military-style tooltip content for common scenarios
export const MILITARY_TOOLTIPS = {
  // Authentication & Security
  LOGIN: "🔐 SECURE ACCESS: Enter your credentials to access classified legal resources. All sessions are encrypted and monitored for security.",
  PASSWORD: "🔒 OPSEC REQUIREMENT: Use a strong password with 12+ characters. Avoid personal information that could compromise operational security.",
  MFA: "⚠️ MULTI-FACTOR AUTHENTICATION: Additional security layer required for accessing sensitive legal documents and attorney communications.",
  
  // Legal Process
  COURT_MARTIAL: "⚠️ CRITICAL: Court-martial proceedings require immediate legal representation. Time-sensitive - contact attorney within 24 hours.",
  ARTICLE_15: "🔒 DISCIPLINARY ACTION: Article 15 proceedings can impact your career. You have the right to demand trial by court-martial instead.",
  SECURITY_CLEARANCE: "🔐 CLASSIFIED: Security clearance issues can affect your military career and civilian opportunities. Immediate legal consultation recommended.",
  
  // Emergency Procedures
  EMERGENCY_CONTACT: "🚨 EMERGENCY PROTOCOL: 24/7 hotline for urgent legal situations. Response time: <2 hours for critical cases.",
  DEPLOYMENT_LEGAL: "⚠️ DEPLOYMENT READY: Ensure all legal documents (POA, will, family care plan) are current before deployment.",
  
  // Documentation
  POWER_OF_ATTORNEY: "🔒 LEGAL AUTHORITY: Power of Attorney grants legal authority to act on your behalf. Choose your representative carefully.",
  WILL_TESTAMENT: "📋 ESTATE PLANNING: Military wills have special provisions for combat zones and hazardous duty. Update before each deployment.",
  
  // Family & Benefits
  FAMILY_CARE_PLAN: "🔒 MANDATORY: Family Care Plan required for single parents and military couples. Must be updated annually and before deployments.",
  VA_BENEFITS: "✓ EARNED BENEFITS: Veterans benefits are earned compensation, not charity. File claims within one year of separation when possible.",
  
  // Career & Transition
  DISCHARGE_UPGRADE: "⚠️ CAREER IMPACT: Discharge characterization affects veteran benefits and civilian opportunities. Legal review recommended.",
  TRANSITION_ASSISTANCE: "📋 CAREER READY: Legal review of employment contracts and veteran preferences can prevent civilian workplace issues.",
  
  // General Legal
  CONFIDENTIALITY: "🔐 ATTORNEY-CLIENT PRIVILEGE: All communications with military attorneys are protected by law. Speak freely about your situation.",
  UCMJ: "🔒 MILITARY LAW: Uniform Code of Military Justice applies 24/7, worldwide. Different rules than civilian law.",
  JAG_SERVICES: "✓ NO COST: JAG legal assistance is free for eligible service members and families. No fees for basic legal services."
};

// Hook for easy tooltip access
export const useMilitaryTooltip = () => {
  return {
    tooltips: MILITARY_TOOLTIPS,
    formatMilitaryText: (text: string) => {
      return text
        .replace(/\b(important|critical|urgent)\b/gi, '⚠️ $1'.toUpperCase())
        .replace(/\b(complete|completed|done)\b/gi, '✓ $1')
        .replace(/\b(required|mandatory)\b/gi, '🔒 $1'.toUpperCase())
        .replace(/\b(classified|confidential)\b/gi, '🔐 $1'.toUpperCase());
    }
  };
};