import { useEffect, useMemo, useRef } from 'react';

let lastId = 0;
const mapref = Symbol();

const mapboxgl = window.mapboxgl as typeof import('mapbox-gl');
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

type MapDiv = HTMLDivElement & { [mapref]: mapboxgl.Map };

export function Map() {
  const ref = useRef<MapDiv | null>(null);
  const id = useMemo(() => `map-${lastId++}`, []);

  useEffect(() => {
    if (ref.current && !ref.current[mapref]) {
      ref.current[mapref] = initializeMap(id);
    }
  });

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
    zoom: 1,
    center: [30, 15],
  });

  map.addControl(new mapboxgl.NavigationControl());
  map.scrollZoom.disable();

  return map;
}
