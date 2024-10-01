import { useEffect, useMemo, useRef } from 'react';
import type { Vehicle } from 'ws-backend/types/vehicle';
import { getVehicleColor } from '../util/getVehicleColor';

const mapboxgl = window.mapboxgl as typeof import('mapbox-gl');
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

let lastId = 0;
const mapref = Symbol();

type MapDiv = HTMLDivElement & {
  [mapref]: ReturnType<typeof initializeMap>;
};

export interface MapProps {
  vehicles: Vehicle[];
  onSelect: (vehicle: Vehicle) => void;
  className?: string;
}

export function Map({ vehicles, onSelect, ...props }: MapProps) {
  const id = useMemo(() => `map-${lastId++}`, []);
  const ref = useRef<MapDiv | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (!ref.current[mapref]) {
      ref.current[mapref] = initializeMap(id);
    }

    const map = ref.current[mapref];
    const renderedMarkerIds = new Set(Object.keys(map.markers));

    for (const vehicle of vehicles) {
      if (vehicle.status === 'DISABLED') continue;

      renderedMarkerIds.delete(String(vehicle.id));

      if (map.markers[vehicle.id]) {
        updateMarker(map.markers[vehicle.id], vehicle);
        continue;
      }

      const marker = new mapboxgl.Marker({
        // TODO: we need a way to handle status change
        color: getVehicleColor(vehicle),
        anchor: 'bottom',
      });

      updateMarker(marker, vehicle);

      marker.addTo(map);
      map.markers[vehicle.id] = marker;

      marker.getElement().addEventListener('click', () => {
        map.onMarkerClick(marker, vehicle);
      });
    }

    // Remove extra markers
    for (const id of renderedMarkerIds) {
      map.markers[id].remove();
      delete map.markers[id];
    }
  }, [
    // id won't change but ESLint will complain if we don't include it
    id,
    ref,
    vehicles,
  ]);

  useEffect(() => {
    if (!ref.current) return;
    const map = ref.current[mapref];
    map.onMarkerClick = (_marker, vehicle) => onSelect(vehicle);
  }, [ref, onSelect]);

  return <div {...props} id={id} ref={ref} />;
}

function initializeMap(containerId: string) {
  const map = new mapboxgl.Map({
    container: containerId,
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 13,
    center: [2.165, 41.395],
    // TODO: add bounds to the map
  });

  map.scrollZoom.disable();

  return Object.assign(map, {
    markers: {} as Record<string, mapboxgl.Marker>,
    // On the React side we'll replace this function with
    // the callback from the component properties
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMarkerClick: (_marker: mapboxgl.Marker, _vehicle: Vehicle) => {},
  });
}

function updateMarker(marker: mapboxgl.Marker, vehicle: Vehicle) {
  const lnglat = marker.getLngLat();

  if (!lnglat || lnglat.lng !== vehicle.lng || lnglat.lat !== vehicle.lat) {
    marker.setLngLat([vehicle.lng, vehicle.lat]);
  }
}
