import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AppContextType } from '../App';
import { BottomNav } from './BottomNav';

export function Profile({ context }: { context: AppContextType }) {
  const navigate = useNavigate();
  const user = context.user;
  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 px-6 py-8 pb-20 overflow-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#E6E8E6] flex items-center justify-center mb-3">
            <span className="text-2xl text-[#191919]">{initials}</span>
          </div>
          <div className="text-lg text-[#191919] font-medium">{user?.name || 'User'}</div>
        </div>

        <div className="bg-[#F15025]/10 rounded-xl p-4 mb-6 text-center">
          <div className="text-sm text-[#191919] mb-1">Total saved</div>
          <div className="text-[22px] text-[#F15025] font-medium">
            ${context.totalSaved.toFixed(2)}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-[#191919] font-medium">My vehicles</div>
            <button
              onClick={() => navigate('/getting-started', { state: { fromProfile: true } })}
              className="w-8 h-8 rounded-full bg-[#F15025] flex items-center justify-center"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>

          {context.vehicles.length === 0 ? (
            <div className="bg-[#E6E8E6] rounded-xl p-4 text-center text-sm text-[#CED0CE]">
              No vehicles added yet
            </div>
          ) : (
            <div className="space-y-2">
              {context.vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-[#E6E8E6] rounded-xl p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm text-[#191919]">{vehicle.model}</div>
                      <div className="text-xs text-[#CED0CE]">{vehicle.year}</div>
                    </div>
                    <div className="text-xs text-[#191919] capitalize">{vehicle.fuelType}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F15025]"
                        style={{ width: `${vehicle.energyLevel * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#191919]">{vehicle.range} mi</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="text-sm text-[#191919] font-medium mb-3">Favorite locations</div>
          {context.favoriteLocations.length === 0 ? (
            <div className="bg-[#E6E8E6] rounded-xl p-4 text-center text-sm text-[#CED0CE]">
              No favorites yet
            </div>
          ) : (
            <div className="space-y-2">
              {context.favoriteLocations.map((location) => (
                <div key={location.id} className="bg-white border border-[#CED0CE] rounded-xl p-3">
                  <div className="text-sm text-[#191919] font-medium">{location.name}</div>
                  <div className="text-xs text-[#CED0CE]">{location.distance}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-sm text-[#191919] font-medium mb-3">Journey history</div>
          <div className="space-y-2">
            {context.journeyHistory.map((journey, index) => (
              <div
                key={index}
                className="bg-white border border-[#CED0CE] rounded-xl p-3 flex justify-between items-center"
              >
                <div>
                  <div className="text-sm text-[#191919]">{journey.destination}</div>
                  <div className="text-xs text-[#CED0CE]">{journey.date}</div>
                </div>
                <div className="text-sm text-[#F15025] font-medium">{journey.saved}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
