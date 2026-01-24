import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapView = ({ points = [], center, zoom = 12, onMarkerClick, showHeatmap = false }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    
    if (!token) {
      console.warn('Mapbox token not found. Map will not render.');
      return;
    }

    mapboxgl.accessToken = token;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center || [0, 0],
        zoom: zoom
      });

      map.current.on('load', () => {
        setMapLoaded(true);
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each point
    points.forEach((point, index) => {
      if (!point.coordinates || point.coordinates.length !== 2) return;

      const [lng, lat] = point.coordinates;
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = getColorForType(point.type);
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <strong>${point.placeName || 'Location'}</strong><br/>
                <span class="text-sm">${point.type || 'Entry'}</span><br/>
                <span class="text-xs text-gray-500">${point.date ? new Date(point.date).toLocaleDateString() : ''}</span>
              </div>
            `)
        )
        .addTo(map.current);

      if (onMarkerClick) {
        marker.getElement().addEventListener('click', () => {
          onMarkerClick(point);
        });
      }

      markers.current.push(marker);
    });

    // Fit bounds if points exist
    if (points.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      points.forEach(point => {
        if (point.coordinates && point.coordinates.length === 2) {
          bounds.extend(point.coordinates);
        }
      });
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, { padding: 50 });
      }
    }
  }, [points, mapLoaded, onMarkerClick]);

  const getColorForType = (type) => {
    const colors = {
      workout: '#ef4444',
      meal: '#10b981',
      weight: '#3b82f6'
    };
    return colors[type] || '#6b7280';
  };

  if (!import.meta.env.VITE_MAPBOX_TOKEN) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Mapbox token not configured</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
      <style>{`
        .mapboxgl-popup-content {
          border-radius: 8px;
        }
        .marker {
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default MapView;

