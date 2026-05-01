import { useNavigate } from 'react-router';
import { ChevronRight, User } from 'lucide-react';
import { AppContextType } from '../App';
import { BottomNav } from './BottomNav';

export function ServiceSelection({ context }: { context: AppContextType }) {
  const navigate = useNavigate();
  const currentVehicle = context.currentVehicle;

  const options = [
    {
      title: 'Find Nearest Station',
      subtitle: 'Locate the closest fueling option',
      path: '/find-nearest',
    },
    {
      title: 'Find Cheapest Station',
      subtitle: 'Get the best price in your area',
      path: '/find-cheapest',
    },
    {
      title: 'Plan a Trip',
      subtitle: 'Route your journey with fuel stops',
      path: '/trip-planner',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 px-6 py-8 pb-20">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-[#191919]">Good morning</p>
            <p className="text-xs text-[#CED0CE]">
              {currentVehicle ? `${currentVehicle.model} ${currentVehicle.year}` : 'No vehicle'}
            </p>
          </div>
          <button onClick={() => navigate('/profile')} className="p-2">
            <div className="w-10 h-10 rounded-full bg-[#E6E8E6] flex items-center justify-center">
              <User className="w-5 h-5 text-[#191919]" />
            </div>
          </button>
        </div>

        <h2 className="text-lg text-[#191919] font-medium mb-4">What do you need today?</h2>

        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <button
              key={option.path}
              onClick={() => navigate(option.path)}
              className="w-full bg-[#E6E8E6] border border-[#CED0CE] rounded-xl p-4 flex items-center justify-between hover:bg-[#CED0CE] transition-colors"
            >
              <div className="text-left">
                <div className="text-sm text-[#191919] font-medium">{option.title}</div>
                <div className="text-xs text-[#CED0CE]">{option.subtitle}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#CED0CE]" />
            </button>
          ))}
        </div>

        {currentVehicle && (
          <div className="bg-[#E6E8E6] rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-[#191919]">Fuel Level</span>
              <span className="text-xs text-[#191919]">{currentVehicle.range} mi remaining</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F15025]"
                style={{ width: `${currentVehicle.energyLevel * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
}
