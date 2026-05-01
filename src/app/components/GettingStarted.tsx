import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { AppContextType } from '../App';

export function GettingStarted({ context }: { context: AppContextType }) {
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState<'gas' | 'electric'>('gas');
  const [energyLevel, setEnergyLevel] = useState(2);
  const navigate = useNavigate();
  const location = useLocation();

  const fromProfile = location.state?.fromProfile;
  const energyLevels = ['Empty', '1/4', '1/2', '3/4', 'Full'];
  const batteryLevels = [0, 25, 50, 75, 100];

  const handleContinue = () => {
    const vehicle = {
      id: Date.now().toString(),
      model,
      year,
      fuelType,
      energyLevel: energyLevel / 4,
      range: fuelType === 'electric' ? 250 : 350,
    };
    context.addVehicle(vehicle);
    navigate('/service-selection');
  };

  return (
    <div className="h-full flex flex-col bg-white px-6 py-8">
      <div className="mb-6">
        {fromProfile && (
          <button onClick={() => navigate('/profile')} className="mb-4 p-1">
            <ArrowLeft className="w-5 h-5 text-[#191919]" />
          </button>
        )}
        <div className="text-xs text-[#CED0CE] mb-4">Step 1 of 1</div>
        <h2 className="text-lg text-[#191919] font-medium">Tell us about your vehicle</h2>
      </div>

      <div className="flex-1 space-y-6">
        <input
          type="text"
          placeholder="Car Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full px-4 py-3 border border-[#CED0CE] rounded-xl text-[#191919] placeholder:text-[#191919] focus:outline-none focus:border-[#F15025] focus:border-2"
        />

        <input
          type="text"
          placeholder="Model Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full px-4 py-3 border border-[#CED0CE] rounded-xl text-[#191919] placeholder:text-[#191919] focus:outline-none focus:border-[#F15025] focus:border-2"
        />

        <div>
          <div className="text-sm text-[#191919] mb-2">Fuel type</div>
          <div className="flex gap-3">
            <button
              onClick={() => setFuelType('gas')}
              className={`flex-1 py-2 px-4 rounded-full transition-colors ${
                fuelType === 'gas'
                  ? 'bg-[#F15025] text-white'
                  : 'bg-[#E6E8E6] text-[#191919] border border-[#CED0CE]'
              }`}
            >
              Gas
            </button>
            <button
              onClick={() => setFuelType('electric')}
              className={`flex-1 py-2 px-4 rounded-full transition-colors ${
                fuelType === 'electric'
                  ? 'bg-[#F15025] text-white'
                  : 'bg-[#E6E8E6] text-[#191919] border border-[#CED0CE]'
              }`}
            >
              Electric
            </button>
          </div>
        </div>

        <div>
          <div className="text-sm text-[#191919] mb-4">Current energy level</div>

          {fuelType === 'gas' ? (
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-32 mb-4">
                <svg viewBox="0 0 200 120" className="w-full h-full">
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#191919"
                    strokeWidth="3"
                  />
                  {[0, 1, 2, 3, 4].map((i) => {
                    const angle = (i * 45 - 90) * (Math.PI / 180);
                    const x1 = 100 + 70 * Math.cos(angle);
                    const y1 = 100 + 70 * Math.sin(angle);
                    const x2 = 100 + 80 * Math.cos(angle);
                    const y2 = 100 + 80 * Math.sin(angle);
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#191919"
                        strokeWidth="2"
                      />
                    );
                  })}
                  <text x="20" y="110" fill={energyLevel === 0 ? '#F15025' : '#191919'} fontSize="14">E</text>
                  <text x="170" y="110" fill="#191919" fontSize="14">F</text>
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + 60 * Math.cos((energyLevel * 45 - 180) * (Math.PI / 180))}
                    y2={100 + 60 * Math.sin((energyLevel * 45 - 180) * (Math.PI / 180))}
                    stroke={energyLevel === 0 ? '#F15025' : '#191919'}
                    strokeWidth="2"
                  />
                  <circle cx="100" cy="100" r="4" fill="#191919" />
                </svg>
              </div>
              <div className="flex gap-4 mb-2">
                {energyLevels.map((level, index) => (
                  <button
                    key={level}
                    onClick={() => setEnergyLevel(index)}
                    className={`text-sm ${
                      energyLevel === index ? 'text-[#F15025]' : 'text-[#191919]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-sm text-[#191919] font-medium mb-2">
                {batteryLevels[energyLevel]}%
              </div>
              <div className="relative w-48 h-20 mb-4">
                <svg viewBox="0 0 200 80" className="w-full h-full">
                  <rect
                    x="10"
                    y="20"
                    width="170"
                    height="40"
                    rx="4"
                    fill="none"
                    stroke="#191919"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="180"
                    y="30"
                    width="10"
                    height="20"
                    rx="2"
                    fill="#191919"
                  />
                  <rect
                    x="13"
                    y="23"
                    width={(164 * batteryLevels[energyLevel]) / 100}
                    height="34"
                    rx="2"
                    fill={batteryLevels[energyLevel] > 50 ? '#47d62a' : '#F15025'}
                  />
                  <rect
                    x={13 + (164 * batteryLevels[energyLevel]) / 100}
                    y="23"
                    width={164 - (164 * batteryLevels[energyLevel]) / 100}
                    height="34"
                    rx="2"
                    fill="#E6E8E6"
                  />
                </svg>
              </div>
              <div className="flex gap-4 mb-2">
                {batteryLevels.map((level, index) => (
                  <button
                    key={level}
                    onClick={() => setEnergyLevel(index)}
                    className={`text-sm ${
                      energyLevel === index ? 'text-[#F15025]' : 'text-[#191919]'
                    }`}
                  >
                    {level}%
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-[#CED0CE] text-center mt-2">
            This helps us estimate your range
          </p>
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-3 bg-[#F15025] text-white rounded-xl hover:bg-[#d9471f] transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
