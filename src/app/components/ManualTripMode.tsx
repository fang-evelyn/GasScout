import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Check, X, Star } from 'lucide-react';
import { TripBottomNav } from './TripBottomNav';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([31.7765, -106.5012], 12);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add initial route (UTEP to destination)
    const initialRoute = (L as any).Routing.control({
      waypoints: [
        L.latLng(31.7765, -106.5012), // Start: UTEP
        L.latLng(31.8200, -106.4800), // Destination
      ],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      lineOptions: {
        styles: [{ color: '#F15025', weight: 4, opacity: 0.8 }]
      },
      createMarker: function(i: number, waypoint: any, n: number) {
        return L.marker(waypoint.latLng, {
          icon: L.icon({
            iconUrl: i === 0
              ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
              : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })
        });
      }
    }).addTo(map);

    routingControlRef.current = initialRoute;

    // Add nearby station markers
    nearbyStations.forEach((station) => {
      const marker = L.marker([station.lat, station.lng], {
        icon: L.divIcon({
          className: 'custom-gas-marker',
          html: `<div style="background-color: #E6E8E6; border: 2px solid #191919; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path d="M8 2C8 2 6 2 6 4V10C6 10 6 12 8 12C10 12 10 10 10 10V4C10 2 8 2 8 2Z" fill="#191919"/>
              <rect x="5" y="11" width="6" height="3" rx="1" fill="#191919"/>
            </svg>
          </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })
      }).addTo(map);

      marker.on('click', () => {
        setSelectedStation(station);
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleAddStop = (stationId: string) => {
    const newStops = new Set(addedStops);
    newStops.add(stationId);
    setAddedStops(newStops);
    setSelectedStation(null);

    // Update route to include new stop
    const station = nearbyStations.find(s => s.id === stationId);
    if (station && routingControlRef.current && mapInstanceRef.current) {
      const currentWaypoints = routingControlRef.current.getWaypoints();
      const newWaypoints = [
        currentWaypoints[0],
        ...Array.from(newStops).map(id => {
          const s = nearbyStations.find(st => st.id === id);
          return s ? L.latLng(s.lat, s.lng) : null;
        }).filter(Boolean),
        currentWaypoints[currentWaypoints.length - 1]
      ];
      routingControlRef.current.setWaypoints(newWaypoints);

      // Update marker icon to show it's added
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          const pos = layer.getLatLng();
          if (pos.lat === station.lat && pos.lng === station.lng) {
            layer.setIcon(L.divIcon({
              className: 'custom-gas-marker-added',
              html: `<div style="background-color: #F15025; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                  <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" stroke-width="2" fill="none"/>
                </svg>
              </div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            }));
          }
        }
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-white pb-16">
      <div ref={mapRef} className="h-[560px] w-full z-0" />

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
