import type { Vehicle } from 'ws-backend/types/vehicle';
import ScooterIllustration from '../assets/scooter-illustration.svg';
import { getVehicleColor } from '../util/getVehicleColor';
import './VehicleDetails.css';

export function VehicleDetails({ vehicle }: { vehicle: Vehicle }) {
  return (
    <section className="vehicle-details">
      <header className="vehicle-details__content">
        <div className="vehicle-illustration">
          <img src={ScooterIllustration} alt="Scooter" />
        </div>
        <h2 className="vehicle-name">{vehicle.name}</h2>
        <div>
          <p
            className="vehicle-status"
            style={{
              // @ts-expect-error React types don't support custom CSS properties
              '--color': getVehicleColor(vehicle),
            }}
          >
            {vehicle.status.toLowerCase()}
          </p>
        </div>
      </header>

      <footer className="vehicle-details__content">
        <p className="vehicle-plate">
          Plate: <b>{vehicle.plate_number}</b>
        </p>
        <p className="vehicle-batery">
          Battery: <b>{vehicle.battery.toFixed(0)}%</b>
        </p>
      </footer>
    </section>
  );
}
