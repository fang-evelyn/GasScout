import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus } from 'lucide-react';
import { AppContextType } from '../App';
import { AILoadingScreen } from './AILoadingScreen';
import { AIRoutePreview } from './AIRoutePreview';

export function TripPlanner({ context }: { context: AppContextType }) {
  const [startingPoint, setStartingPoint] = useState('Current location');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState<'manual' | 'ai'>('ai');
  const [showLoading, setShowLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (showLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
        setShowPreview(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showLoading]);

  const plannedStops = [
    { number: 1, name: 'Shell - Exit 42', fuelLevel: 0.4 },
    { number: 2, name: 'Chevron - Exit 89', fuelLevel: 0.3 },
  ];

  const handleStartTrip = () => {
    if (mode === 'ai') {
      setShowLoading(true);
    } else {
      navigate('/manual-trip-mode');
    }
  };

  if (showLoading) {
    return <AILoadingScreen />;
  }

  if (showPreview) {
    return <AIRoutePreview />;
  }

  return (
    <div className="h-full flex flex-col bg-white px-6 py-8">
      <h2 className="text-lg text-[#191919] font-medium mb-4">Plan your trip</h2>

      <div className="flex-1 space-y-4 overflow-auto">
        <input
          type="text"
          placeholder="Starting point"
          value={startingPoint}
          onChange={(e) => setStartingPoint(e.target.value)}
          className="w-full px-4 py-3 border border-[#CED0CE] rounded-xl text-[#191919] placeholder:text-[#191919] focus:outline-none focus:border-[#F15025] focus:border-2"
        />

        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-4 py-3 border border-[#CED0CE] rounded-xl text-[#191919] placeholder:text-[#191919] focus:outline-none focus:border-[#F15025] focus:border-2"
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode('manual')}
            className={`p-4 rounded-xl transition-all ${
              mode === 'manual'
                ? 'bg-[#F15025]/5 border-2 border-[#F15025]'
                : 'bg-[#E6E8E6] border border-[#CED0CE]'
            }`}
          >
            <div className="text-sm text-[#191919] font-medium mb-1">Manual</div>
            <div className="text-xs text-[#CED0CE]">Plan your own stops</div>
          </button>
          <button
            onClick={() => setMode('ai')}
            className={`p-4 rounded-xl transition-all ${
              mode === 'ai'
                ? 'bg-[#F15025]/5 border-2 border-[#F15025]'
                : 'bg-[#E6E8E6] border border-[#CED0CE]'
            }`}
          >
            <div className="text-sm text-[#191919] font-medium mb-1">AI-assisted</div>
            <div className="text-xs text-[#CED0CE]">Auto-plan optimal route</div>
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-[#191919] font-medium">Planned stops</div>
            <button className="p-1">
              <Plus className="w-5 h-5 text-[#F15025]" />
            </button>
          </div>

          <div className="space-y-2">
            {plannedStops.map((stop) => (
              <div key={stop.number} className="bg-[#E6E8E6] rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#F15025] rounded-full flex items-center justify-center text-white text-sm">
                  {stop.number}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#191919]">{stop.name}</div>
                  <div className="h-1 bg-white rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-[#F15025]"
                      style={{ width: `${stop.fuelLevel * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleStartTrip}
        className="w-full py-3 bg-[#F15025] text-white rounded-xl hover:bg-[#d9471f] transition-colors mt-4"
      >
        Start Trip
      </button>
    </div>
  );
}
