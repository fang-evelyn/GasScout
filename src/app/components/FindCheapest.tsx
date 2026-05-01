import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Star } from 'lucide-react';
import { AppContextType, Station } from '../App';
import { BottomNav } from './BottomNav';
import { FilterPills } from './FilterPills';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGasStations } from '../../hooks/useGasStations';



export function FindCheapest({ context }: { context: AppContextType }) {
  const { getCheapest } = useGasStations();
  const sortedStations = getCheapest(); // This is already sorted by price
  const [radius, setRadius] = useState('5');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
  const saved = localStorage.getItem('gas_favorites');
  return saved ? new Set(JSON.parse(saved)) : new Set();
});
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // 2. Derive the stations to show
  const filteredStations = sortedStations.filter(station => {
    if (activeFilter === 'All') return true;
    
    // Check if the station name matches the brand filter OR if the tags contain the filter (like "Car Wash")
    return station.name.includes(activeFilter) || station.tags.includes(activeFilter);
  });

  useEffect(() => {
    console.log("Effect used");
    if (!mapRef.current) return;

    // 1. Initialize Map & LayerGroup once
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([31.7765, -106.5012], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
      
      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    const markersLayer = markersLayerRef.current;
    if (!markersLayer) return;

    // 2. Clear old markers before redrawing
    markersLayer.clearLayers();

    const gasIcon = L.divIcon({
      className: 'custom-gas-marker',
      html: '<div style="background-color: #F15025; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
      iconSize: [60, 24],
      iconAnchor: [30, 12],
    });

    // 3. Add markers with an 'add' listener for the label
    filteredStations.forEach((station) => {
      const marker = L.marker([station.lat, station.lng], { icon: gasIcon });

      // This ensures the element exists before we try to put text in it
      marker.on('add', () => {
        const el = marker.getElement();
        if (el) {
          const div = el.querySelector('div');
          if (div) div.textContent = station.price;
        }
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif;">
          <strong style="color: #191919;">${station.name}</strong><br/>
          <span style="color: #F15025; font-weight: 500;">${station.price}</span>
        </div>
      `);

      marker.addTo(markersLayer);
    });

    // Clean up only when the component is actually destroyed
    return () => {
      if (!mapRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [filteredStations]); // Dependency array is correct

  useEffect(() => {
  // We convert the Set to an Array because JSON doesn't support Sets directly
  localStorage.setItem('gas_favorites', JSON.stringify(Array.from(favorites)));
}, [favorites]);

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
          <FilterPills onFilterChange={setActiveFilter} />
        </div>

        <div ref={mapRef} className="h-64 w-full z-0" />

        <div className="px-6 py-4 space-y-3">
          <div className="text-xs text-[#CED0CE] mb-2">Sorted by price (lowest first)</div>
          {filteredStations.map((station) => (
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
