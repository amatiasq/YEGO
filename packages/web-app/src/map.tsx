import { useEffect, useMemo, useRef } from 'react';
import type { Vehicle } from 'ws-backend/types/vehicle';

let lastId = 0;
const mapref = Symbol();

const MARKER_COLORS: Record<Vehicle['status'], string> = {
  AVAILABLE: '#FFA500',
  BOOKED: '#000000',
  MAINTENANCE: '#FF0000',
  DISABLED: '#808080',
};

const mapboxgl = window.mapboxgl as typeof import('mapbox-gl');
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

type MapDiv = HTMLDivElement & {
  [mapref]: mapboxgl.Map & {
    markers: Record<string, mapboxgl.Marker>;
  };
};

export function Map({ vehicles }: { vehicles: Vehicle[] }) {
  const ref = useRef<MapDiv | null>(null);
  const id = useMemo(() => `map-${lastId++}`, []);

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
        color: MARKER_COLORS[vehicle.status],
      });

      updateMarker(marker, vehicle);
      marker.addTo(map);
      map.markers[vehicle.id] = marker;
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

  return (
    <div
      id={id}
      ref={ref}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100dvw',
        height: '100dvh',
      }}
    />
  );
}

function initializeMap(containerId: string) {
  const map = new mapboxgl.Map({
    container: containerId,
    style: 'mapbox://styles/mapbox/streets-v9',
    projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    zoom: 13,
    center: [2.165, 41.395],
  });

  map.addControl(new mapboxgl.NavigationControl());
  map.scrollZoom.disable();

  return Object.assign(map, { markers: {} });
}

function updateMarker(marker: mapboxgl.Marker, vehicle: Vehicle) {
  const lnglat = marker.getLngLat();

  if (!lnglat || lnglat.lng !== vehicle.lng || lnglat.lat !== vehicle.lat) {
    marker.setLngLat([vehicle.lng, vehicle.lat]);
  }
}
