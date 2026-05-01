type FilterPillsProps = {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
};

export function FilterPills({ activeFilter, onFilterChange }: FilterPillsProps) {
  const filters = ['All', '7-Eleven', 'Shell', 'Car Wash', 'Air'];

  return (
    <div className="flex gap-2 px-6 overflow-x-auto no-scrollbar">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)} // This updates the state in FindNearest
          className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
            activeFilter === filter
              ? 'bg-[#F15025] text-white'
              : 'bg-[#E6E8E6] text-[#191919]'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}