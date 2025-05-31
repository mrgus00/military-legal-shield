import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle } from "lucide-react";

export default function SecurityReminder() {
  return (
    <Card className="bg-gradient-to-r from-sage-50 to-military-gold-50 border-sage-200 mb-6 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-navy-700">
          <Shield className="h-5 w-5 mr-2 text-sage-400" />
          Security Reminder: Use Smart Digital Habits
          <AlertTriangle className="h-5 w-5 ml-2 text-military-gold-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-navy-600 space-y-3">
        <p className="font-medium">
          While this app is built with your safety and security in mind, please remember to protect 
          your personal and operational information at all times.
        </p>
        
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Do NOT share Personally Identifiable Information (PII)</span> such as your 
            Social Security Number, home address, or full date of birth.
          </p>
          
          <p>
            <span className="font-semibold">Apply Operational Security (OPSEC):</span> Do not discuss unit movements, 
            mission details, or any sensitive military operations—even in private messages.
          </p>
        </div>
        
        <p className="font-semibold text-navy-700 bg-military-gold-100 px-3 py-2 rounded-md">
          Stay secure. Stay sharp. Protect yourself and your team.
        </p>
      </CardContent>
    </Card>
  );
}