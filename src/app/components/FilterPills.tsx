import { useState } from 'react';

type FilterPillsProps = {
  onFilterChange?: (filter: string) => void;
};

const filters = [
  'All',
  'Shell',
  'Chevron',
  'BP',
  'Costco',
  "Sam's Club",
  'Tesla',
  'ChargePoint',
  '24 Hours',
  'Car Wash',
];

const membershipRequired = ['Costco', "Sam's Club"];

export function FilterPills({ onFilterChange }: FilterPillsProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showMembershipAlert, setShowMembershipAlert] = useState(false);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);

    if (membershipRequired.includes(filter)) {
      setShowMembershipAlert(true);
      setTimeout(() => setShowMembershipAlert(false), 3000);
    } else {
      setShowMembershipAlert(false);
    }
  };

  return (
    <div className="border-b border-[#CED0CE] pb-3">
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`flex-shrink-0 h-8 px-3 rounded-full text-[13px] transition-colors ${
              activeFilter === filter
                ? 'bg-[#F15025] text-white'
                : 'bg-[#E6E8E6] text-[#191919] border border-[#CED0CE]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      {showMembershipAlert && (
        <div className="px-6 mt-2">
          <p className="text-xs text-[#F15025]">
            Membership required — add one in your profile.
          </p>
        </div>
      )}
    </div>
  );
}
