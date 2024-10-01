import { useState } from 'react';
import { Vehicle } from 'ws-backend/types/vehicle';
import './app.css';
import { Map } from './components/Map';
import { VehicleDetails } from './components/VehicleDetails';
import { YegoHeader } from './components/YegoHeader';
import { useVehicles } from './hooks/useVehicles';

export default function App() {
  const vehicles = useVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  return (
    <>
      <Map
        className="mapview"
        vehicles={vehicles}
        onSelect={setSelectedVehicle}
      />
      <YegoHeader />
      {selectedVehicle ? <VehicleDetails vehicle={selectedVehicle} /> : null}
    </>
  );
}
