import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useBranch } from "@/contexts/BranchContext";
import { getAllBranches } from "@/lib/branchContext";
import { useToast } from "@/hooks/use-toast";

export default function InteractiveBranchSelector() {
  const { selectedBranch, branchConfig, setSelectedBranch, isPersonalized } = useBranch();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const allBranches = getAllBranches();

  const handleBranchSelect = (branchId: string) => {
    const newBranch = getAllBranches().find(b => b.id === branchId);
    if (newBranch) {
      setSelectedBranch(branchId);
      setIsOpen(false);
      
      toast({
        title: `${newBranch.shortName} Selected`,
        description: `Website personalized for ${newBranch.terminology.serviceMember}s. ${newBranch.culture.greeting}`,
      });
    }
  };

  return (
    <>
      {/* Branch Selection Banner */}
      <section 
        className="py-8 transition-all duration-500"
        style={{
          backgroundColor: isPersonalized ? branchConfig.colors.primary : '#1f2937',
          background: isPersonalized 
            ? `linear-gradient(135deg, ${branchConfig.colors.primary} 0%, ${branchConfig.colors.secondary}20 100%)`
            : 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {!isPersonalized ? (
              <>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Select Your Branch of Service
                </h3>
                <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
                  Choose your military branch to personalize the website with branch-specific terminology, ranks, and relevant information.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
                  {allBranches.map((branch) => (
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
                          />
                        </div>
                        <h4 className="font-semibold text-white text-sm group-hover:text-yellow-300 transition-colors">
                          {branch.shortName}
                        </h4>
                        <p className="text-xs text-gray-300 mt-1">
                          {branch.terminology.serviceMember}
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
                    src={branchConfig.emblem} 
                    alt={`${branchConfig.shortName} emblem`}
                    className="w-12 h-12 object-contain"
                  />
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">
                      {branchConfig.name}
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Personalized for {branchConfig.terminology.serviceMember}s
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {branchConfig.culture.motto}
                  </Badge>
                  
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Change Branch
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Select Your Branch</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-3 py-4">
                        {allBranches.map((branch) => (
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
                                />
                              </div>
                              <h4 className="font-semibold text-sm text-navy-700">
                                {branch.shortName}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {branch.terminology.serviceMember}
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
      {isPersonalized && (
        <section className="py-4 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-navy-600">
                <span className="font-semibold" style={{ color: branchConfig.colors.primary }}>
                  {branchConfig.culture.greeting}
                </span>
                {" "}Welcome, {branchConfig.terminology.serviceMember}! This site is now personalized with {branchConfig.shortName}-specific information.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}