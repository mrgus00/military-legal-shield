import { useState } from "react";
import ScenarioSimulator from "@/components/scenario-simulator";
import ScenarioSessionComponent from "@/components/scenario-session";

export default function ScenariosPage() {
  const [activeScenarioId, setActiveScenarioId] = useState<number | null>(null);

  const handleStartScenario = (scenarioId: number) => {
    setActiveScenarioId(scenarioId);
  };

  const handleBackToScenarios = () => {
    setActiveScenarioId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {activeScenarioId ? (
        <ScenarioSessionComponent 
          scenarioId={activeScenarioId}
          onBack={handleBackToScenarios}
        />
      ) : (
        <ScenarioSimulator onStartScenario={handleStartScenario} />
      )}
    </div>
  );
}