import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Star } from 'lucide-react';

type RouteStop = {
  number: number;
  name: string;
  milesFromPrevious: number;
  fuelLevel: number;
  price: string;
  fuelType: 'gas' | 'electric';
};

const mockStops: RouteStop[] = [
  {
    number: 1,
    name: 'Shell - Exit 42',
    milesFromPrevious: 120,
    fuelLevel: 0.4,
    price: '$3.45/gal',
    fuelType: 'gas',
  },
  {
    number: 2,
    name: 'Chevron - Exit 89',
    milesFromPrevious: 135,
    fuelLevel: 0.35,
    price: '$3.52/gal',
    fuelType: 'gas',
  },
  {
    number: 3,
    name: 'BP - Exit 142',
    milesFromPrevious: 140,
    fuelLevel: 0.3,
    price: '$3.48/gal',
    fuelType: 'gas',
  },
];

export function AIRoutePreview() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const toggleFavorite = (stopNumber: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(stopNumber)) {
      newFavorites.delete(stopNumber);
    } else {
      newFavorites.add(stopNumber);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-[360px] bg-[#E6E8E6] relative flex items-center justify-center">
        <span className="text-sm text-[#CED0CE]">Route map</span>
        <div className="absolute top-8 left-8">
          <div className="w-8 h-8 rounded-full bg-[#F15025] flex items-center justify-center text-white text-sm">
            1
          </div>
        </div>
        <div className="absolute top-24 right-12">
          <div className="w-8 h-8 rounded-full bg-[#F15025] flex items-center justify-center text-white text-sm">
            2
          </div>
        </div>
        <div className="absolute bottom-16 left-16">
          <div className="w-8 h-8 rounded-full bg-[#F15025] flex items-center justify-center text-white text-sm">
            3
          </div>
        </div>
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M 50 50 Q 200 150, 320 200 T 100 300"
            stroke="#F15025"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="text-sm text-[#191919] font-medium mb-3">Planned route stops</div>
        <div className="space-y-3 mb-4">
          {mockStops.map((stop) => (
            <div key={stop.number} className="bg-white border border-[#CED0CE] rounded-xl p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-6 h-6 rounded-full bg-[#F15025] flex items-center justify-center text-white text-xs flex-shrink-0">
                    {stop.number}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#191919] font-medium">{stop.name}</div>
                    <div className="text-xs text-[#CED0CE]">
                      {stop.milesFromPrevious} mi from {stop.number === 1 ? 'start' : 'previous'}
                    </div>
                  </div>
                </div>
                <button onClick={() => toggleFavorite(stop.number)} className="p-1">
                  <Star
                    className={`w-5 h-5 ${
                      favorites.has(stop.number)
                        ? 'fill-[#F15025] text-[#F15025]'
                        : 'text-[#CED0CE]'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs text-[#191919]">Fuel on arrival:</span>
                  {stop.fuelType === 'gas' ? (
                    <div className="flex-1 h-1 bg-[#E6E8E6] rounded-full overflow-hidden max-w-[80px]">
                      <div
                        className="h-full bg-[#F15025]"
                        style={{ width: `${stop.fuelLevel * 100}%` }}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 h-1 bg-[#E6E8E6] rounded-full overflow-hidden max-w-[80px]">
                      <div
                        className="h-full bg-[#F15025]"
                        style={{ width: `${stop.fuelLevel * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="text-sm text-[#F15025] font-medium">{stop.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6 space-y-3">
        <button
          onClick={() => navigate('/trip-in-action')}
          className="w-full py-3 bg-[#F15025] text-white rounded-xl hover:bg-[#d9471f] transition-colors"
        >
          Accept and navigate
        </button>
        <button
          onClick={() => navigate('/trip-planner')}
          className="w-full py-3 bg-white text-[#191919] border border-[#CED0CE] rounded-xl hover:bg-[#E6E8E6] transition-colors"
        >
          Replan route
        </button>
      </div>
    </div>
  );
}
