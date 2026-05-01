import { Navigation } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AppContextType } from '../App';
import { TripBottomNav } from './TripBottomNav';

export function TripInAction({ context }: { context: AppContextType }) {
  const navigate = useNavigate();
  const upcomingStops = [
    { number: 2, fuelLevel: 0.3 },
    { number: 3, fuelLevel: 0.25 },
  ];

  return (
    <div className="h-full flex flex-col bg-white pb-16">
      <div className="h-[560px] bg-[#E6E8E6] relative flex items-center justify-center">
        <span className="text-sm text-[#CED0CE]">Map with route</span>
        <div className="absolute top-1/3 left-1/2 w-1 h-32 bg-[#F15025]" style={{ transform: 'translateX(-50%) rotate(25deg)' }} />
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#F15025] rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
      </div>

      <div className="flex-1 bg-white border-t border-[#CED0CE] px-6 py-4">
        <div className="text-sm text-[#191919] font-medium mb-3">Upcoming stop</div>

        <div className="bg-white border border-[#CED0CE] rounded-xl p-3 mb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="text-sm text-[#191919] font-medium">Shell - Exit 42</div>
              <div className="text-xs text-[#CED0CE]">28 miles until stop</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-[#191919]">Projected fuel:</span>
                <div className="flex-1 h-1 bg-[#E6E8E6] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F15025]" style={{ width: '40%' }} />
                </div>
              </div>
              <div className="text-xs text-[#CED0CE] mt-1">$3.45/gal • Restroom • Car Wash</div>
            </div>
            <button className="ml-3 px-3 py-2 bg-[#F15025] text-white text-sm rounded-lg hover:bg-[#d9471f] transition-colors flex items-center gap-1">
              <Navigation className="w-4 h-4" />
              Navigate
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {upcomingStops.map((stop) => (
            <div
              key={stop.number}
              className="flex-shrink-0 bg-[#E6E8E6] rounded-full px-3 py-1 flex items-center gap-2"
            >
              <span className="text-xs text-[#191919]">Stop {stop.number}</span>
              <div className="w-12 h-1 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F15025]"
                  style={{ width: `${stop.fuelLevel * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <TripBottomNav onExit={() => navigate('/service-selection')} />
    </div>
  );
}
