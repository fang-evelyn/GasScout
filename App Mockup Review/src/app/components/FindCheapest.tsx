import { useState } from 'react';
import { MessageCircle, Star } from 'lucide-react';
import { AppContextType, Station } from '../App';
import { BottomNav } from './BottomNav';
import { FilterPills } from './FilterPills';

const mockStations: Station[] = [
  {
    id: '1',
    name: 'Costco Gas',
    distance: '2.1 mi',
    price: '$3.29',
    lastUpdated: '5 min ago',
    tags: ['Members only'],
    lat: 37.7649,
    lng: -122.4094,
    membersOnly: true,
  },
  {
    id: '2',
    name: 'Shell Gas Station',
    distance: '0.8 mi',
    price: '$3.45',
    lastUpdated: '12 min ago',
    tags: ['Restroom', 'Car Wash'],
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: '3',
    name: 'Chevron',
    distance: '1.2 mi',
    price: '$3.52',
    lastUpdated: '8 min ago',
    tags: ['24/7', 'Store'],
    lat: 37.7849,
    lng: -122.4294,
  },
];

export function FindCheapest({ context }: { context: AppContextType }) {
  const [radius, setRadius] = useState('5');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);

  const toggleFavorite = (stationId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(stationId)) {
      newFavorites.delete(stationId);
    } else {
      newFavorites.add(stationId);
      setShowConfirmation(stationId);
      setTimeout(() => setShowConfirmation(null), 2000);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 pb-20 overflow-auto">
        <div className="px-6 py-4 border-b border-[#CED0CE]">
          <input
            type="text"
            value={`Within ${radius} mile radius`}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setRadius(val);
            }}
            className="w-full px-4 py-2 border border-[#CED0CE] rounded-lg text-sm text-[#191919] focus:outline-none focus:border-[#F15025] focus:border-2"
          />
        </div>

        <div className="py-3">
          <FilterPills />
        </div>

        <div className="h-64 bg-[#E6E8E6] flex items-center justify-center relative">
          <span className="text-sm text-[#CED0CE]">Map view</span>
          <div className="absolute top-6 left-6 bg-[#F15025] text-white px-3 py-2 rounded-lg text-sm">
            $3.29
          </div>
          <div className="absolute top-16 right-8 bg-[#F15025] text-white px-3 py-2 rounded-lg text-sm">
            $3.45
          </div>
          <div className="absolute bottom-12 left-1/3 bg-[#F15025] text-white px-3 py-2 rounded-lg text-sm">
            $3.52
          </div>
        </div>

        <div className="px-6 py-4 space-y-3">
          <div className="text-xs text-[#CED0CE] mb-2">Sorted by price (lowest first)</div>
          {mockStations.map((station) => (
            <div key={station.id} className="relative">
              <div className="bg-white border border-[#CED0CE] rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="text-sm text-[#191919] font-medium">{station.name}</div>
                    <div className="text-xs text-[#CED0CE]">{station.distance}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-lg text-[#F15025] font-medium">{station.price}</div>
                      <div className="text-xs text-[#CED0CE]">per gallon</div>
                    </div>
                    <button onClick={() => toggleFavorite(station.id)} className="p-1">
                      <Star
                        className={`w-5 h-5 ${
                          favorites.has(station.id)
                            ? 'fill-[#F15025] text-[#F15025]'
                            : 'text-[#CED0CE]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                {station.lastUpdated && (
                  <div className="text-xs text-[#CED0CE]">Last updated: {station.lastUpdated}</div>
                )}
                <div className="flex flex-wrap gap-2">
                  {station.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 text-xs rounded-full ${
                        station.membersOnly && tag === 'Members only'
                          ? 'bg-[#F15025] text-white'
                          : 'bg-[#E6E8E6] text-[#191919]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {showConfirmation === station.id && (
                <div className="text-xs text-[#F15025] mt-1 animate-fade-in">
                  Added to favorites
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button className="absolute bottom-20 right-6 w-14 h-14 bg-[#F15025] rounded-full flex items-center justify-center shadow-lg hover:bg-[#d9471f] transition-colors">
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      <BottomNav active="cheapest" />
    </div>
  );
}
