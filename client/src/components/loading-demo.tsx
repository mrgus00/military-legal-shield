import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMilitaryLoading, useApiLoading, useEmergencyLoading, useSecurityLoading, useLegalLoading } from "@/hooks/useMilitaryLoading";
import { Shield, Target, Zap, Award, Compass, Play, Loader } from "lucide-react";

export default function LoadingDemo() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  
  const { startMilitarySequence: startDefault } = useMilitaryLoading({
    variant: "default",
    showProgress: true
  });
  
  const { startMilitarySequence: startTactical } = useMilitaryLoading({
    variant: "tactical",
    showProgress: true,
    loadingMessages: [
      "Tactical systems initializing...",
      "Loading mission parameters...",
      "Establishing command link...",
      "All systems operational...",
      "Mission ready"
    ]
  });
  
  const { startMilitarySequence: startApi } = useApiLoading();
  const { startMilitarySequence: startEmergency } = useEmergencyLoading();
  const { startMilitarySequence: startSecurity } = useSecurityLoading();
  const { startMilitarySequence: startLegal } = useLegalLoading();

  const loadingDemos = [
    {
      id: "default",
      name: "Default Military Loading",
      description: "Standard military system initialization",
      icon: Shield,
      color: "from-blue-600 to-blue-800",
      action: () => startDefault(3000)
    },
    {
      id: "security",
      name: "Security Operations",
      description: "High-security clearance verification",
      icon: Target,
      color: "from-red-600 to-red-800",
      action: () => startSecurity(4000)
    },
    {
      id: "emergency",
      name: "Emergency Response",
      description: "Urgent legal assistance activation",
      icon: Zap,
      color: "from-orange-600 to-red-700",
      action: () => startEmergency(3500)
    },
    {
      id: "legal",
      name: "Legal System Access",
      description: "UCMJ database and legal resources",
      icon: Award,
      color: "from-green-600 to-green-800",
      action: () => startLegal(4500)
    },
    {
      id: "tactical",
      name: "Tactical Operations",
      description: "Mission-critical system deployment",
      icon: Compass,
      color: "from-gray-700 to-gray-900",
      action: () => startTactical(4000)
    },
    {
      id: "api",
      name: "API Communications",
      description: "Secure data transmission protocols",
      icon: Loader,
      color: "from-purple-600 to-purple-800",
      action: () => startApi(3000)
    }
  ];

  const handleDemoClick = (demo: any) => {
    setActiveDemo(demo.id);
    demo.action();
    setTimeout(() => setActiveDemo(null), 6000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy-800 mb-4">
          Military Loading Screen Demonstrations
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience our military-themed loading animations designed to provide 
          professional feedback during system operations and data processing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingDemos.map((demo) => {
          const IconComponent = demo.icon;
          const isActive = activeDemo === demo.id;
          
          return (
            <Card 
              key={demo.id} 
              className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
                isActive ? 'ring-2 ring-blue-500 shadow-xl' : ''
              }`}
              onClick={() => handleDemoClick(demo)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${demo.color} rounded-full flex items-center justify-center mb-4 border-4 border-yellow-400 transition-transform duration-300 hover:scale-110`}>
                  <IconComponent className="w-8 h-8 text-yellow-400" />
                </div>
                <CardTitle className="text-lg font-bold text-navy-800">
                  {demo.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4 text-sm">
                  {demo.description}
                </p>
                
                <Button 
                  variant={isActive ? "default" : "outline"}
                  className={`w-full ${isActive ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  disabled={isActive}
                >
                  {isActive ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Active
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Demo
                    </>
                  )}
                </Button>
                
                {isActive && (
                  <Badge variant="secondary" className="mt-2 animate-pulse">
                    Loading Active
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-navy-800">
              Integration Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-navy-700 mb-2">Attorney Search</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Military loading screens activate during attorney database searches 
                  and emergency legal consultations.
                </p>
                <Badge variant="outline">Security Variant</Badge>
              </div>
              
              <div>
                <h3 className="font-semibold text-navy-700 mb-2">Document Generation</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Legal document preparation uses specialized loading animations 
                  with progress tracking for complex operations.
                </p>
                <Badge variant="outline">Legal Variant</Badge>
              </div>
              
              <div>
                <h3 className="font-semibold text-navy-700 mb-2">Emergency Response</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Urgent legal assistance triggers high-priority loading screens 
                  with immediate response indicators.
                </p>
                <Badge variant="outline">Emergency Variant</Badge>
              </div>
              
              <div>
                <h3 className="font-semibold text-navy-700 mb-2">System Operations</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Standard platform operations use tactical loading themes 
                  maintaining military professionalism throughout.
                </p>
                <Badge variant="outline">Tactical Variant</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}