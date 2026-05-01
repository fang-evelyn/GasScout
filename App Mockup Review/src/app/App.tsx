import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useState } from 'react';
import { Login } from './components/Login';
import { GettingStarted } from './components/GettingStarted';
import { ServiceSelection } from './components/ServiceSelection';
import { FindNearest } from './components/FindNearest';
import { FindCheapest } from './components/FindCheapest';
import { TripPlanner } from './components/TripPlanner';
import { TripInAction } from './components/TripInAction';
import { ManualTripMode } from './components/ManualTripMode';
import { Profile } from './components/Profile';

export type Vehicle = {
  id: string;
  model: string;
  year: string;
  fuelType: 'gas' | 'electric';
  gasGrade?: string;
  energyLevel: number;
  range: number;
};

export type Station = {
  id: string;
  name: string;
  distance: string;
  price: string;
  lastUpdated?: string;
  tags: string[];
  lat: number;
  lng: number;
  membersOnly?: boolean;
};

export type AppContextType = {
  user: { email: string; name: string } | null;
  vehicles: Vehicle[];
  currentVehicle: Vehicle | null;
  addVehicle: (vehicle: Vehicle) => void;
  setCurrentVehicle: (vehicle: Vehicle) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  totalSaved: number;
  favoriteLocations: Station[];
  journeyHistory: Array<{ date: string; destination: string; saved: string }>;
};

export default function App() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentVehicle, setCurrentVehicleState] = useState<Vehicle | null>(null);

  const login = (email: string, password: string) => {
    setUser({ email, name: email.split('@')[0] });
  };

  const logout = () => {
    setUser(null);
    setVehicles([]);
    setCurrentVehicleState(null);
  };

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles([...vehicles, vehicle]);
    setCurrentVehicleState(vehicle);
  };

  const appContext: AppContextType = {
    user,
    vehicles,
    currentVehicle,
    addVehicle,
    setCurrentVehicle: setCurrentVehicleState,
    login,
    logout,
    totalSaved: 1247.32,
    favoriteLocations: [],
    journeyHistory: [
      { date: '2026-04-28', destination: 'San Francisco, CA', saved: '$24.50' },
      { date: '2026-04-22', destination: 'Los Angeles, CA', saved: '$18.20' },
      { date: '2026-04-15', destination: 'San Diego, CA', saved: '$31.80' },
    ],
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-[390px] h-[844px] bg-white relative overflow-hidden shadow-2xl">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/service-selection" /> : <Login context={appContext} />} />
            <Route path="/getting-started" element={<GettingStarted context={appContext} />} />
            <Route path="/service-selection" element={<ServiceSelection context={appContext} />} />
            <Route path="/find-nearest" element={<FindNearest context={appContext} />} />
            <Route path="/find-cheapest" element={<FindCheapest context={appContext} />} />
            <Route path="/trip-planner" element={<TripPlanner context={appContext} />} />
            <Route path="/trip-in-action" element={<TripInAction context={appContext} />} />
            <Route path="/manual-trip-mode" element={<ManualTripMode />} />
            <Route path="/profile" element={<Profile context={appContext} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
