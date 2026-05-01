import { Navigation } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useEffect, useRef } from 'react';
import { AppContextType } from '../App';
import { TripBottomNav } from './TripBottomNav';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

export function TripInAction({ context }: { context: AppContextType }) {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on UTEP
    const map = L.map(mapRef.current).setView([31.7765, -106.5012], 12);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Define route waypoints (UTEP to gas stations)
    const waypoints = [
      L.latLng(31.7765, -106.5012), // Start: UTEP
      L.latLng(31.7749, -106.4950), // Stop 1: Shell - Exit 42
      L.latLng(31.7800, -106.5100), // Stop 2: Chevron - Exit 89
      L.latLng(31.8200, -106.4800), // Destination
    ];

    // Add routing control
    (L as any).Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      lineOptions: {
        styles: [{ color: '#F15025', weight: 4, opacity: 0.8 }]
      },
      createMarker: function(i: number, waypoint: any, n: number) {
        const isStart = i === 0;
        const isEnd = i === n - 1;
        const isStop = !isStart && !isEnd;

        if (isStop) {
          const marker = L.marker(waypoint.latLng, {
            icon: L.divIcon({
              className: 'custom-route-marker',
              html: `<div style="background-color: #F15025; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 500; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${i}</div>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            })
          });
          return marker;
        }

        return L.marker(waypoint.latLng, {
          icon: L.icon({
            iconUrl: isStart
              ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
              : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })
        });
      }
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);
  const upcomingStops = [
    { number: 2, fuelLevel: 0.3 },
    { number: 3, fuelLevel: 0.25 },
  ];

  return (
    <div className="h-full flex flex-col bg-white pb-16">
      <div ref={mapRef} className="h-[560px] w-full z-0" />

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
