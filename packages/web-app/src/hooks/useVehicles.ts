import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from 'ws-backend/types/socket';
import { Vehicle } from 'ws-backend/types/vehicle';

export function useVehicles() {
  type YegoSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

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

  return vehicles;
}
