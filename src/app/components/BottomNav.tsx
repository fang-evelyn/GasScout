import { useNavigate } from 'react-router';
import { Home, MapPin, DollarSign, User } from 'lucide-react';

type BottomNavProps = {
  active: 'home' | 'nearest' | 'cheapest' | 'profile';
};

export function BottomNav({ active }: BottomNavProps) {
  const navigate = useNavigate();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/service-selection' },
    { id: 'nearest', label: 'Nearest', icon: MapPin, path: '/find-nearest' },
    { id: 'cheapest', label: 'Cheapest', icon: DollarSign, path: '/find-cheapest' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-[#CED0CE] flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center gap-1"
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-[#F15025]' : 'text-[#CED0CE]'}`} />
            <span className={`text-xs ${isActive ? 'text-[#F15025]' : 'text-[#CED0CE]'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
