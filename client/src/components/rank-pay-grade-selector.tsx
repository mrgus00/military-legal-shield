import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useBranch } from "@/contexts/BranchContext";
import { Badge } from "@/components/ui/badge";

interface RankPayGradeSelectorProps {
  onRankSelect?: (rank: {payGrade: string; rank: string; abbreviation: string}) => void;
  selectedRank?: {payGrade: string; rank: string; abbreviation: string} | null;
  required?: boolean;
  className?: string;
}

export default function RankPayGradeSelector({ 
  onRankSelect, 
  selectedRank, 
  required = false,
  className = "" 
}: RankPayGradeSelectorProps) {
  const { branchTheme, getRanks, getTerminology } = useBranch();
  const [selectedCategory, setSelectedCategory] = useState<'enlisted' | 'officers' | 'warrantOfficers'>('enlisted');

  const enlistedRanks = getRanks('enlisted');
  const officerRanks = getRanks('officers');
  const warrantRanks = branchTheme.ranks.warrantOfficers ? getRanks('warrantOfficers') : [];

  const getCurrentRanks = () => {
    switch (selectedCategory) {
      case 'enlisted':
        return enlistedRanks;
      case 'officers':
        return officerRanks;
      case 'warrantOfficers':
        return warrantRanks;
      default:
        return enlistedRanks;
    }
  };

  const handleRankSelection = (rankKey: string) => {
    const currentRanks = getCurrentRanks();
    const rank = currentRanks.find(r => `${r.payGrade}-${r.abbreviation}` === rankKey);
    if (rank && onRankSelect) {
      onRankSelect(rank);
    }
  };

  return (
    <Card className={`${className}`} style={{ borderColor: `hsl(${branchTheme.colors.primary} / 0.2)` }}>
      <CardHeader>
        <CardTitle 
          className="text-lg flex items-center space-x-2"
          style={{ color: `hsl(${branchTheme.colors.primary})` }}
        >
          <span>{branchTheme.name} Rank & Pay Grade</span>
          {required && <span className="text-red-500">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="rank-category">Rank Category</Label>
          <Select value={selectedCategory} onValueChange={(value: 'enlisted' | 'officers' | 'warrantOfficers') => setSelectedCategory(value)}>
            <SelectTrigger id="rank-category">
              <SelectValue placeholder="Select rank category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enlisted">Enlisted {getTerminology('personnel')}</SelectItem>
              <SelectItem value="officers">Officers</SelectItem>
              {warrantRanks.length > 0 && (
                <SelectItem value="warrantOfficers">Warrant Officers</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Rank Selection */}
        <div className="space-y-2">
          <Label htmlFor="specific-rank">
            {selectedCategory === 'enlisted' ? 'Enlisted Rank' : 
             selectedCategory === 'officers' ? 'Officer Rank' : 'Warrant Officer Rank'}
          </Label>
          <Select 
            value={selectedRank ? `${selectedRank.payGrade}-${selectedRank.abbreviation}` : ''} 
            onValueChange={handleRankSelection}
          >
            <SelectTrigger id="specific-rank">
              <SelectValue placeholder={`Select your ${selectedCategory === 'enlisted' ? 'enlisted' : selectedCategory === 'officers' ? 'officer' : 'warrant officer'} rank`} />
            </SelectTrigger>
            <SelectContent>
              {getCurrentRanks().map((rank) => (
                <SelectItem key={`${rank.payGrade}-${rank.abbreviation}`} value={`${rank.payGrade}-${rank.abbreviation}`}>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{rank.payGrade}</span>
                    <span className="mx-2">-</span>
                    <span>{rank.abbreviation}</span>
                    <span className="mx-2">-</span>
                    <span className="text-sm text-gray-600">{rank.rank}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Rank Display */}
        {selectedRank && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: `hsl(${branchTheme.colors.primary} / 0.05)` }}>
            <div className="flex items-center space-x-3">
              <Badge 
                variant="outline"
                style={{ 
                  borderColor: `hsl(${branchTheme.colors.primary})`,
                  color: `hsl(${branchTheme.colors.primary})`
                }}
              >
                {selectedRank.payGrade}
              </Badge>
              <div>
                <div className="font-semibold">{selectedRank.rank}</div>
                <div className="text-sm text-gray-600">{selectedRank.abbreviation}</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference Guide */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Pay Grade Reference:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <strong>Enlisted:</strong> E-1 through E-9
            </div>
            <div>
              <strong>Officers:</strong> O-1 through O-10
            </div>
            {warrantRanks.length > 0 && (
              <div>
                <strong>Warrant:</strong> W-1 through W-5
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}