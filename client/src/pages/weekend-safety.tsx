import WeekendSafetyBrief from "@/components/weekend-safety-brief";

export default function WeekendSafetyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Weekend Safety Brief</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your weekly dose of common sense reminders and light-hearted wisdom to keep you safe and out of trouble during liberty.
          </p>
        </div>
        
        <WeekendSafetyBrief />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Remember: The goal is to have stories worth telling, not stories you have to explain to your command.
          </p>
        </div>
      </div>
    </div>
  );
}