import { useState } from 'react';
import { Route, MapPin, Fuel, X } from 'lucide-react';

type TripBottomNavProps = {
  onExit?: () => void;
};

export function TripBottomNav({ onExit }: TripBottomNavProps) {
  const [active, setActive] = useState('route');
  const [showExitDialog, setShowExitDialog] = useState(false);

  const tabs = [
    { id: 'route', label: 'Route', icon: Route },
    { id: 'stops', label: 'Stops', icon: MapPin },
    { id: 'fuel', label: 'Fuel', icon: Fuel },
    { id: 'exit', label: 'Exit', icon: X },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'exit') {
      setShowExitDialog(true);
    } else {
      setActive(tabId);
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    onExit?.();
  };

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-[#CED0CE] flex items-center justify-around px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
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

      {showExitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 mx-6 w-full max-w-sm">
            <h3 className="text-lg text-[#191919] font-medium mb-4">End this trip?</h3>
            <p className="text-sm text-[#CED0CE] mb-6">
              Are you sure you want to exit navigation? Your route will be saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitDialog(false)}
                className="flex-1 py-2 text-[#191919] border border-[#CED0CE] rounded-lg hover:bg-[#E6E8E6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExit}
                className="flex-1 py-2 bg-[#F15025] text-white rounded-lg hover:bg-[#d9471f] transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
