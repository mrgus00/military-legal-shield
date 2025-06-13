import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeZoneData {
  label: string;
  timeZone: string;
  abbreviation: string;
}

const timeZones: TimeZoneData[] = [
  { label: 'LOCAL', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, abbreviation: 'LOCAL' },
  { label: 'PACIFIC', timeZone: 'America/Los_Angeles', abbreviation: 'PST/PDT' },
  { label: 'MOUNTAIN', timeZone: 'America/Denver', abbreviation: 'MST/MDT' },
  { label: 'EASTERN', timeZone: 'America/New_York', abbreviation: 'EST/EDT' },
  { label: 'ZULU', timeZone: 'UTC', abbreviation: 'UTC' }
];

export default function WorldClock() {
  const [currentTimes, setCurrentTimes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const times: { [key: string]: string } = {};

      timeZones.forEach(({ label, timeZone }) => {
        try {
          if (label === 'ZULU') {
            // Display Zulu time in 24-hour format
            times[label] = now.toLocaleTimeString('en-US', {
              timeZone,
              hour12: false,
              hour: '2-digit',
              minute: '2-digit'
            });
          } else {
            // Display other times in 12-hour format
            times[label] = now.toLocaleTimeString('en-US', {
              timeZone,
              hour12: true,
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        } catch (error) {
          times[label] = '--:--';
        }
      });

      setCurrentTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 shadow-lg border border-slate-700">
      <div className="flex items-center justify-center mb-3">
        <Clock className="h-5 w-5 text-amber-400 mr-2" />
        <h3 className="text-amber-400 font-bold text-sm tracking-wider">WORLD CLOCK</h3>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {timeZones.map(({ label, abbreviation }) => (
          <div key={label} className="text-center">
            <div className="text-red-400 font-mono text-lg font-bold tracking-wider">
              {currentTimes[label] || '--:--'}
            </div>
            <div className="text-amber-300 text-xs font-semibold tracking-widest mt-1">
              {label}
            </div>
            <div className="text-slate-400 text-xs">
              {abbreviation}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-3 text-slate-400 text-xs">
        Updated every second • Military Standard Time Display
      </div>
    </div>
  );
}