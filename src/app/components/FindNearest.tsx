import { useState, useEffect, useRef } from 'react';
import { Filter, MessageCircle, Star } from 'lucide-react';
import { AppContextType, Station } from '../App';
import { BottomNav } from './BottomNav';
import { FilterPills } from './FilterPills';
import { Chatbot } from './Chatbot';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGasStations } from '../../hooks/useGasStations';

export function FindNearest({ context }: { context: AppContextType }) {
  const { getNearest } = useGasStations();
  const sortedStations = getNearest(); // This is already sorted by price
  const [range, setRange] = useState('10');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
  const saved = localStorage.getItem('gas_favorites');
  return saved ? new Set(JSON.parse(saved)) : new Set();
});
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showChatbot, setShowChatbot] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // 2. Derive the stations to show
  // 1. Parse distance string (e.g., "10") into a number
  const maxDistance = parseFloat(range) || 0;

const displayStations = sortedStations.filter(station => {
  // A: Distance Logic
  const stationDist = parseFloat(station.distance.split(' ')[0]);
  const isWithinRange = stationDist <= maxDistance;
  
  // B: Name/Tag Logic
  // This checks if the station name or any of its tags match the active pill
  const matchesFilter = activeFilter === 'All' || 
                       station.name.includes(activeFilter) || 
                       station.tags.includes(activeFilter);

  // Both MUST be true to show the station
  return isWithinRange && matchesFilter;
});
// 1. EFFECT: Initialize the Map (Runs ONLY once on mount)
useEffect(() => {
  if (!mapRef.current || mapInstanceRef.current) return;

  const map = L.map(mapRef.current).setView([31.7765, -106.5012], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);
  
  mapInstanceRef.current = map;
  markersLayerRef.current = L.layerGroup().addTo(map);

  return () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
  };
}, []); // Empty array = run only once

// 2. EFFECT: Update Markers (Runs every time displayStations changes)
useEffect(() => {
  // Guard: We need the map and the layer to exist before drawing
  if (!mapInstanceRef.current || !markersLayerRef.current) return;

  const markersLayer = markersLayerRef.current;
  markersLayer.clearLayers(); // Wipe old markers

  const gasIcon = L.divIcon({
    className: 'custom-gas-marker',
    html: '<div style="background-color: #F15025; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
    iconSize: [60, 24],
    iconAnchor: [30, 12],
  });

  displayStations.forEach((station) => {
    const marker = L.marker([station.lat, station.lng], { icon: gasIcon });

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
}, [displayStations]); // Re-run whenever the list changes
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
    <div className="h-full flex flex-col bg-white relative overflow-hidden">
      <div className="flex-1 pb-20 overflow-auto">
        {/* Search Bar Section */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-[#CED0CE]">
          <input
            type="text"
            value={`Within ${range} miles`}
            onChange={(e) => {
              // Extract only the numbers from the input
              const val = e.target.value.replace(/[^0-9.]/g, '');
              setRange(val);
            }}
            className="flex-1 px-4 py-2 border border-[#CED0CE] rounded-lg text-sm text-[#191919] focus:outline-none focus:border-[#F15025] focus:border-2"
          />
          <button className="p-2">
            <Filter className="w-5 h-5 text-[#191919]" />
          </button>
        </div>

        <div className="py-3">
          <FilterPills 
    activeFilter={activeFilter} 
    onFilterChange={setActiveFilter} 
  />
        </div>

        <div ref={mapRef} className="h-64 w-full z-0" />

        <div className="px-6 py-4 space-y-3">
          {displayStations.map((station) => (
            <div key={station.id} className="relative">
              <div className="bg-white border border-[#CED0CE] rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="text-sm text-[#191919] font-medium">{station.name}</div>
                    <div className="text-xs text-[#CED0CE]">{station.distance}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-[#F15025] font-medium">{station.price}</div>
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
                <div className="flex flex-wrap gap-2">
                  {station.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[#E6E8E6] text-[#191919] text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {station.membersOnly && (
                    <span className="px-2 py-1 bg-[#F15025] text-white text-xs rounded-full">
                      Members only
                    </span>
                  )}
                </div>
              </div>
              {showConfirmation === station.id && (
                <div className="text-xs text-[#F15025] mt-1 animate-fade-in">
                  Added to favorites
                </div>
              )}
            </div>
          ))}
          {displayStations.length === 0 && (
            <div className="text-center py-10 text-[#CED0CE] text-sm">
              No stations found within {range} miles.
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setShowChatbot(true)}
        className="absolute bottom-20 right-6 w-14 h-14 bg-[#F15025] rounded-full flex items-center justify-center shadow-lg hover:bg-[#d9471f] transition-colors"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}

      <BottomNav active="nearest" />
    </div>
  );
}
