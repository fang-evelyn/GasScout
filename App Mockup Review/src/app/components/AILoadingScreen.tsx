export function AILoadingScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-white px-6">
      <div className="w-24 h-24 rounded-full border-4 border-[#F15025] animate-pulse-ring mb-6" />
      <div className="text-center">
        <p className="text-base text-[#191919] font-medium mb-2">Planning your route</p>
        <p className="text-sm text-[#CED0CE]">Calculating stops based on your current range.</p>
      </div>
    </div>
  );
}
