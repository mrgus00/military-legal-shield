import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, ShieldAlert, Clock } from "lucide-react";
import { Attorney } from "@shared/schema";

interface AttorneyVerificationBadgeProps {
  attorney: Attorney;
  showDetails?: boolean;
}

export default function AttorneyVerificationBadge({ 
  attorney, 
  showDetails = false 
}: AttorneyVerificationBadgeProps) {
  const getVerificationStatus = () => {
    if (attorney.isVerified && attorney.verificationStatus === 'verified') {
      return {
        icon: ShieldCheck,
        label: "Verified Attorney",
        variant: "default" as const,
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200"
      };
    }
    
    if (attorney.verificationStatus === 'pending') {
      return {
        icon: Clock,
        label: "Verification Pending",
        variant: "secondary" as const,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 border-yellow-200"
      };
    }
    
    if (attorney.verificationStatus === 'rejected') {
      return {
        icon: ShieldAlert,
        label: "Verification Issues",
        variant: "destructive" as const,
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200"
      };
    }
    
    return {
      icon: Shield,
      label: "Unverified",
      variant: "outline" as const,
      color: "text-gray-600",
      bgColor: "bg-gray-50 border-gray-200"
    };
  };

  const status = getVerificationStatus();
  const Icon = status.icon;

  if (!showDetails) {
    return (
      <Badge variant={status.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.label}
      </Badge>
    );
  }

  return (
    <div className={`p-3 rounded-lg border ${status.bgColor}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${status.color}`} />
        <span className={`font-medium ${status.color}`}>{status.label}</span>
      </div>
      
      {attorney.isVerified && attorney.verificationDate && (
        <p className="text-sm text-gray-600">
          Verified: {new Date(attorney.verificationDate).toLocaleDateString()}
        </p>
      )}
      
      {attorney.licenseNumber && (
        <p className="text-sm text-gray-600">
          License: {attorney.licenseNumber}
        </p>
      )}
      
      {attorney.barNumber && (
        <p className="text-sm text-gray-600">
          Bar Number: {attorney.barNumber}
        </p>
      )}
      
      {attorney.verificationStatus === 'verified' && (
        <div className="mt-2 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
          ✓ Credentials verified by Soldier on Fire
        </div>
      )}
    </div>
  );
}