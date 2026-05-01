import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Check, X, Star } from 'lucide-react';
import { TripBottomNav } from './TripBottomNav';

type Station = {
  id: string;
  name: string;
  distanceOffRoute: string;
  price: string;
  grades: string[];
  hours: string;
  lat: number;
  lng: number;
};

const nearbyStations: Station[] = [
  {
    id: '1',
    name: 'Shell - Exit 42',
    distanceOffRoute: '0.3 mi',
    price: '$3.45/gal',
    grades: ['Regular', 'Plus', 'Premium'],
    hours: '24 hours',
    lat: 100,
    lng: 150,
  },
  {
    id: '2',
    name: 'Chevron - Exit 44',
    distanceOffRoute: '0.5 mi',
    price: '$3.52/gal',
    grades: ['Regular', 'Plus', 'Premium', 'Diesel'],
    hours: '6am - 11pm',
    lat: 200,
    lng: 200,
  },
  {
    id: '3',
    name: 'BP - Exit 48',
    distanceOffRoute: '0.2 mi',
    price: '$3.48/gal',
    grades: ['Regular', 'Plus'],
    hours: '24 hours',
    lat: 150,
    lng: 250,
  },
  {
    id: '4',
    name: 'Costco Gas',
    distanceOffRoute: '1.2 mi',
    price: '$3.29/gal',
    grades: ['Regular', 'Premium'],
    hours: '6am - 9pm',
    lat: 250,
    lng: 180,
  },
];

export function ManualTripMode() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [addedStops, setAddedStops] = useState<Set<string>>(new Set());
  const [favorite, setFavorite] = useState(false);
  const navigate = useNavigate();

  const handleAddStop = (stationId: string) => {
    const newStops = new Set(addedStops);
    newStops.add(stationId);
    setAddedStops(newStops);
    setSelectedStation(null);
  };

  return (
    <div className="h-full flex flex-col bg-white pb-16">
      <div className="h-[560px] bg-[#E6E8E6] relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-[#CED0CE]">Live map with route</span>
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 50 50 Q 150 200, 300 400 T 350 500"
            stroke="#F15025"
            strokeWidth="3"
            fill="none"
          />
        </svg>

        {nearbyStations.map((station) => {
          const isAdded = addedStops.has(station.id);
          return (
            <button
              key={station.id}
              onClick={() => setSelectedStation(station)}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isAdded ? 'bg-[#F15025]' : 'bg-[#E6E8E6] border border-[#191919]'
              }`}
              style={{ left: station.lat, top: station.lng }}
            >
              {isAdded ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" className="text-[#191919]">
                  <path
                    d="M8 2C8 2 6 2 6 4V10C6 10 6 12 8 12C10 12 10 10 10 10V4C10 2 8 2 8 2Z"
                    fill="currentColor"
                  />
                  <rect x="5" y="11" width="6" height="3" rx="1" fill="currentColor" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 bg-white border-t border-[#CED0CE] overflow-auto">
        <div className="px-6 py-4">
          <div className="text-sm text-[#191919] font-medium mb-3">Stations along your route</div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {nearbyStations.map((station) => {
              const isAdded = addedStops.has(station.id);
              return (
                <div
                  key={station.id}
                  className="flex-shrink-0 w-[120px] bg-[#E6E8E6] border border-[#CED0CE] rounded-xl p-2"
                >
                  <div className="text-xs text-[#191919] font-medium truncate mb-1">
                    {station.name}
                  </div>
                  <div className="text-xs text-[#CED0CE] mb-1">{station.distanceOffRoute}</div>
                  <div className="text-sm text-[#F15025] mb-2">{station.price}</div>
                  <button
                    onClick={() => handleAddStop(station.id)}
                    disabled={isAdded}
                    className={`w-full py-1 rounded flex items-center justify-center ${
                      isAdded
                        ? 'bg-[#F15025] text-white'
                        : 'bg-white text-[#191919] border border-[#CED0CE]'
                    }`}
                  >
                    {isAdded ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedStation && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-xl w-full max-h-[60vh] overflow-auto animate-slide-up">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-base text-[#191919] font-medium mb-1">
                    {selectedStation.name}
                  </h3>
                  <p className="text-xs text-[#CED0CE]">
                    {selectedStation.distanceOffRoute} off route
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setFavorite(!favorite)} className="p-1">
                    <Star
                      className={`w-5 h-5 ${
                        favorite ? 'fill-[#F15025] text-[#F15025]' : 'text-[#CED0CE]'
                      }`}
                    />
                  </button>
                  <button onClick={() => setSelectedStation(null)} className="p-1">
                    <X className="w-5 h-5 text-[#191919]" />
                  </button>
                </div>
              </div>

              <div className="text-lg text-[#F15025] font-medium mb-3">
                {selectedStation.price}
              </div>

              <div className="mb-4">
                <div className="text-xs text-[#191919] font-medium mb-2">Available grades</div>
                <div className="flex flex-wrap gap-2">
                  {selectedStation.grades.map((grade) => (
                    <span
                      key={grade}
                      className="px-2 py-1 bg-[#E6E8E6] text-[#191919] text-xs rounded-full"
                    >
                      {grade}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-[#CED0CE] mb-6">
                Hours: {selectedStation.hours}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedStation(null)}
                  className="flex-1 py-3 bg-white text-[#191919] border border-[#CED0CE] rounded-xl hover:bg-[#E6E8E6] transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => handleAddStop(selectedStation.id)}
                  className="flex-1 py-3 bg-[#F15025] text-white rounded-xl hover:bg-[#d9471f] transition-colors"
                >
                  Add as stop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <TripBottomNav onExit={() => navigate('/service-selection')} />
    </div>
  );
}
