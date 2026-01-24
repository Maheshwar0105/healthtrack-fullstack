import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Reverse geocoding using Mapbox
export const reverseGeocode = async (lng, lat) => {
  if (!MAPBOX_TOKEN) {
    console.warn('Mapbox token not configured');
    return null;
  }

  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
      {
        params: {
          access_token: MAPBOX_TOKEN,
          types: 'place,poi,address'
        }
      }
    );

    if (response.data.features && response.data.features.length > 0) {
      return response.data.features[0].place_name;
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

export default api;
