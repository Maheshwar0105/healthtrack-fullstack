import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const HeatmapOverlay = ({ map, points = [] }) => {
  const heatmapLayer = useRef(null);

  useEffect(() => {
    if (!map || !points.length) return;

    // Create heatmap source
    const heatmapData = {
      type: 'FeatureCollection',
      features: points.map(point => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: point.coordinates
        },
        properties: {
          intensity: 1
        }
      }))
    };

    // Remove existing heatmap layer if it exists
    if (map.getLayer('heatmap-layer')) {
      map.removeLayer('heatmap-layer');
    }
    if (map.getSource('heatmap-source')) {
      map.removeSource('heatmap-source');
    }

    // Add heatmap source
    map.addSource('heatmap-source', {
      type: 'geojson',
      data: heatmapData
    });

    // Add heatmap layer
    map.addLayer({
      id: 'heatmap-layer',
      type: 'heatmap',
      source: 'heatmap-source',
      maxzoom: 15,
      paint: {
        'heatmap-weight': {
          property: 'intensity',
          type: 'identity'
        },
        'heatmap-intensity': {
          stops: [[0, 0], [20, 1]]
        },
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        'heatmap-radius': {
          stops: [[0, 2], [20, 20]]
        },
        'heatmap-opacity': 0.6
      }
    });

    heatmapLayer.current = 'heatmap-layer';

    return () => {
      if (map.getLayer('heatmap-layer')) {
        map.removeLayer('heatmap-layer');
      }
      if (map.getSource('heatmap-source')) {
        map.removeSource('heatmap-source');
      }
    };
  }, [map, points]);

  return null;
};

export default HeatmapOverlay;

