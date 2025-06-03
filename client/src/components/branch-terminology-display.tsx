import { useBranch } from "@/contexts/BranchContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BranchTerminologyDisplay() {
  const { branchTheme, getTerminology, getRanks, getValues } = useBranch();

  return (
    <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
      <CardHeader>
        <CardTitle 
          className="text-lg font-semibold flex items-center space-x-2"
          style={{ color: `hsl(${branchTheme.colors.primary})` }}
        >
          <span>{branchTheme.name} Terminology</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Personnel:</span>
            <span className="ml-2" style={{ color: `hsl(${branchTheme.colors.primary})` }}>
              {getTerminology('personnel')}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Unit:</span>
            <span className="ml-2" style={{ color: `hsl(${branchTheme.colors.primary})` }}>
              {getTerminology('unit')}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Base:</span>
            <span className="ml-2" style={{ color: `hsl(${branchTheme.colors.primary})` }}>
              {getTerminology('base')}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Leader:</span>
            <span className="ml-2" style={{ color: `hsl(${branchTheme.colors.primary})` }}>
              {getTerminology('leader')}
            </span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">Core Values:</h4>
          <div className="flex flex-wrap gap-2">
            {getValues().map((value, index) => (
              <Badge 
                key={index} 
                variant="outline"
                style={{ 
                  borderColor: `hsl(${branchTheme.colors.primary})`,
                  color: `hsl(${branchTheme.colors.primary})`
                }}
              >
                {value}
              </Badge>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">Officer Ranks (Sample):</h4>
          <div className="flex flex-wrap gap-1 text-xs">
            {getRanks('officers').slice(0, 5).map((rank, index) => (
              <span 
                key={index}
                className="px-2 py-1 rounded"
                style={{ 
                  backgroundColor: `hsl(${branchTheme.colors.primary} / 0.1)`,
                  color: `hsl(${branchTheme.colors.primary})`
                }}
              >
                {rank.payGrade} - {rank.abbreviation}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}