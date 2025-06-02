import { useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const branches = [
  {
    id: "army",
    name: "United States Army",
    shortName: "Army",
    emblem: "/attached_assets/U.S%20Army.png",
    serviceMember: "Soldier",
    greeting: "Hooah!",
    motto: "This We'll Defend",
    colors: { primary: "#4B5320", secondary: "#FFD700" }
  },
  {
    id: "navy",
    name: "United States Navy",
    shortName: "Navy",
    emblem: "/attached_assets/U.S%20Navy.png",
    serviceMember: "Sailor",
    greeting: "Hooyah!",
    motto: "Semper Fortis",
    colors: { primary: "#000080", secondary: "#FFD700" }
  },
  {
    id: "airforce",
    name: "United States Air Force",
    shortName: "Air Force",
    emblem: "/attached_assets/U.S%20Airforce.png",
    serviceMember: "Airman",
    greeting: "Hooah!",
    motto: "Aim High... Fly-Fight-Win",
    colors: { primary: "#004F98", secondary: "#FFD700" }
  },
  {
    id: "marines",
    name: "United States Marine Corps",
    shortName: "Marines",
    emblem: "/attached_assets/U.S%20Marine%20Corps.png",
    serviceMember: "Marine",
    greeting: "Oorah!",
    motto: "Semper Fidelis",
    colors: { primary: "#CC0000", secondary: "#FFD700" }
  },
  {
    id: "spaceforce",
    name: "United States Space Force",
    shortName: "Space Force",
    emblem: "/attached_assets/U.S%20Space%20Force.png",
    serviceMember: "Guardian",
    greeting: "Semper Supra!",
    motto: "Semper Supra",
    colors: { primary: "#1C2951", secondary: "#FFFFFF" }
  },
  {
    id: "coastguard",
    name: "United States Coast Guard",
    shortName: "Coast Guard",
    emblem: "/attached_assets/U.S%20Coast%20Guard.jpg",
    serviceMember: "Coast Guardsman",
    greeting: "Semper Paratus!",
    motto: "Semper Paratus",
    colors: { primary: "#003366", secondary: "#FF0000" }
  }
];

export default function SimpleBranchSelector() {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const selectedBranchData = branches.find(b => b.id === selectedBranch);

  const handleBranchSelect = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setSelectedBranch(branchId);
      setIsOpen(false);
      
      toast({
        title: `${branch.shortName} Selected`,
        description: `Website personalized for ${branch.serviceMember}s. ${branch.greeting}`,
      });
    }
  };

  return (
    <>
      {/* Branch Selection Banner */}
      <section 
        className="py-3 transition-all duration-500"
        style={{
          backgroundColor: selectedBranchData ? selectedBranchData.colors.primary : '#1f2937',
          background: selectedBranchData 
            ? `linear-gradient(135deg, ${selectedBranchData.colors.primary} 0%, ${selectedBranchData.colors.secondary}20 100%)`
            : 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {!selectedBranch ? (
              <>
                <h3 className="text-xl font-bold text-white mb-2">
                  Select Your Branch of Service
                </h3>
                <p className="text-gray-200 mb-4 max-w-2xl mx-auto text-sm">
                  Personalize with branch-specific information
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
                  {branches.map((branch) => (
                    <Card 
                      key={branch.id}
                      className="cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl group bg-white/10 backdrop-blur-sm border-white/20"
                      onClick={() => handleBranchSelect(branch.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="mb-3">
                          <img 
                            src={branch.emblem} 
                            alt={`${branch.shortName} emblem`}
                            className="w-16 h-16 mx-auto object-contain group-hover:scale-110 transition-transform"
                            onError={(e) => {
                              console.log(`Failed to load image: ${branch.emblem}`);
                              // Fallback to a colored circle if image fails
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div 
                            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg hidden"
                            style={{ backgroundColor: branch.colors.primary }}
                          >
                            {branch.shortName.slice(0, 2)}
                          </div>
                        </div>
                        <h4 className="font-semibold text-white text-sm group-hover:text-yellow-300 transition-colors">
                          {branch.shortName}
                        </h4>
                        <p className="text-xs text-gray-300 mt-1">
                          {branch.serviceMember}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedBranchData!.emblem} 
                    alt={`${selectedBranchData!.shortName} emblem`}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      console.log(`Failed to load selected image: ${selectedBranchData!.emblem}`);
                      // Fallback to colored circle
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold hidden"
                    style={{ backgroundColor: selectedBranchData!.colors.primary }}
                  >
                    {selectedBranchData!.shortName.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">
                      {selectedBranchData!.name}
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Personalized for {selectedBranchData!.serviceMember}s
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {selectedBranchData!.motto}
                  </Badge>
                  
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                        Change Branch
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Select Your Branch</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-3 py-4">
                        {branches.map((branch) => (
                          <Card 
                            key={branch.id}
                            className={`cursor-pointer hover:scale-105 transition-all duration-300 ${
                              branch.id === selectedBranch 
                                ? 'ring-2 ring-military-gold-500 bg-military-gold-50' 
                                : 'hover:shadow-md'
                            }`}
                            onClick={() => handleBranchSelect(branch.id)}
                          >
                            <CardContent className="p-4 text-center relative">
                              {branch.id === selectedBranch && (
                                <div className="absolute top-2 right-2">
                                  <Check className="w-4 h-4 text-military-gold-600" />
                                </div>
                              )}
                              <div className="mb-2">
                                <img 
                                  src={branch.emblem} 
                                  alt={`${branch.shortName} emblem`}
                                  className="w-12 h-12 mx-auto object-contain"
                                  onError={(e) => {
                                    console.log(`Failed to load dialog image: ${branch.emblem}`);
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                                <div 
                                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-sm hidden"
                                  style={{ backgroundColor: branch.colors.primary }}
                                >
                                  {branch.shortName.slice(0, 2)}
                                </div>
                              </div>
                              <h4 className="font-semibold text-sm text-navy-700">
                                {branch.shortName}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {branch.serviceMember}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Branch-specific welcome message */}
      {selectedBranch && selectedBranchData && (
        <section className="py-2 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-navy-600 text-sm">
                <span className="font-semibold" style={{ color: selectedBranchData.colors.primary }}>
                  {selectedBranchData.greeting}
                </span>
                {" "}Welcome, {selectedBranchData.serviceMember}! Site personalized for {selectedBranchData.shortName}.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}