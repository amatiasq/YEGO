import type { Vehicle } from 'ws-backend/types/vehicle';

const VEHICLE_COLORS: Record<Vehicle['status'], string> = {
  AVAILABLE: '#FFA500',
  BOOKED: '#000000',
  MAINTENANCE: '#FF0000',
  DISABLED: '#808080',
};

export function getVehicleColor(vehicle: Vehicle) {
  return VEHICLE_COLORS[vehicle.status];
}
