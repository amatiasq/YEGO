import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from 'ws-backend/types/socket';
import { Vehicle } from 'ws-backend/types/vehicle';
import './app.css';
import { Map } from './components/Map';
import { YegoHeader } from './components/YegoHeader';

type YegoSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export default function App() {
  const socketClient = useRef(
    io('http://localhost:3000', { autoConnect: false }) as YegoSocket
  );

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const socket = socketClient.current;
    if (!socket) return;

    socket.on('vehicle', (vehicle) => {
      // Feel free to change the data structure to fit your needs.
      setVehicles((prevVehicles) => {
        const vehicleIndex = prevVehicles.findIndex((v) => v.id === vehicle.id);

        if (vehicleIndex === -1) {
          return [...prevVehicles, vehicle];
        }

        return [
          ...prevVehicles.slice(0, vehicleIndex),
          vehicle,
          ...prevVehicles.slice(vehicleIndex + 1),
        ];
      });
    });

    socket.on('vehicles', setVehicles);

    socket.connect();

    return () => {
      socket.off('vehicle');
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <Map className="mapview" vehicles={vehicles} />
      <YegoHeader className="header" />
    </div>
  );
}
