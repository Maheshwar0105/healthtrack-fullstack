import axios from 'axios';

/**
 * Reverse geocode coordinates to human-readable address using Mapbox
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @returns {Promise<string>} Place name/address
 */
export const reverseGeocode = async (lng, lat) => {
  const token = process.env.MAPBOX_TOKEN;
  
  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
      {
        params: {
          access_token: token,
          types: 'place,poi,address'
        }
      }
    );

    if (response.data.features && response.data.features.length > 0) {
      return response.data.features[0].place_name;
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    return null;
  }
};

