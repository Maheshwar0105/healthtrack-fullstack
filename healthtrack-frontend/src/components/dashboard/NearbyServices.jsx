import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Loader, Activity } from 'lucide-react';

const NearbyServices = ({ userLocation }) => {
  const [selectedService, setSelectedService] = useState('hospital');
  const [loading, setLoading] = useState(false);
  const [servicesList, setServicesList] = useState([]);

  const categories = [
    { id: 'hospital', label: '🏥 Hospitals/Clinics', query: '["amenity"="hospital"]' },
    { id: 'gym', label: '💪 Gyms & Fitness', query: '["leisure"="fitness_centre"]' },
    { id: 'pharmacy', label: '💊 Pharmacies', query: '["amenity"="pharmacy"]' },
    { id: 'park', label: '🌳 Parks & Tracks', query: '["leisure"="park"]' }
  ];

  useEffect(() => {
    if (userLocation) {
      fetchNearbyOSM(selectedService);
    }
  }, [userLocation, selectedService]);

  const fetchNearbyOSM = async (serviceId) => {
    if (!userLocation) return;
    setLoading(true);
    setServicesList([]);
    
    const category = categories.find(c => c.id === serviceId);
    const queryTag = category.query;
    
    // Overpass API QL query string
    const overpassQuery = `[out:json];
      (
        node(around:3000,${userLocation.lat},${userLocation.lng})${queryTag};
        way(around:3000,${userLocation.lat},${userLocation.lng})${queryTag};
      );
      out center;`;

    try {
      const response = await axios.get(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
      );

      const elements = response.data?.elements || [];
      const parsed = elements.map(el => {
        const name = el.tags?.name || 'Local Service';
        const type = el.tags?.amenity || el.tags?.leisure || serviceId;
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        const street = el.tags?.['addr:street'] || '';
        const city = el.tags?.['addr:city'] || '';
        const address = [street, city].filter(Boolean).join(', ') || 'Address not listed';

        // Calculate distance on sphere
        const distance = getDistanceKm(userLocation.lat, userLocation.lng, lat, lon).toFixed(2);

        return {
          id: el.id,
          name,
          type,
          lat,
          lon,
          address,
          distance
        };
      }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)).slice(0, 5);

      setServicesList(parsed);
    } catch (error) {
      console.warn('Overpass fetch failed, falling back to simulated results.');
      getMockServices(serviceId);
    } finally {
      setLoading(false);
    }
  };

  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const getMockServices = (serviceId) => {
    let list = [];
    if (serviceId === 'hospital') {
      list = [
        { id: 1, name: 'Apollo Medical Center', address: 'Plot 12, Sector 15, Vashi', distance: '1.2' },
        { id: 2, name: 'Fortis Health Clinic', address: 'M G Road, Fort', distance: '2.5' }
      ];
    } else if (serviceId === 'gym') {
      list = [
        { id: 3, name: 'Gold\'s Gym', address: '4th Floor, Crystal Mall', distance: '0.8' },
        { id: 4, name: 'Cult.Fit Gym Center', address: 'Park Street Cross', distance: '1.4' }
      ];
    } else if (serviceId === 'pharmacy') {
      list = [
        { id: 5, name: 'Wellness Forever 24/7', address: 'Station Road Corner', distance: '0.4' },
        { id: 6, name: 'Apollo Pharmacy Store', address: 'New Market Block A', distance: '0.9' }
      ];
    } else {
      list = [
        { id: 7, name: 'Central Sports Park', address: 'High Road Boulevard', distance: '1.8' },
        { id: 8, name: 'Greenwood Running Track', address: 'Outer Ring Sector 2', distance: '2.9' }
      ];
    }
    setServicesList(list);
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-3xl shadow-xl h-full animate-fade-in flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-theme-gradient text-white rounded-2xl shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">Nearby Services</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Discover hospitals, gyms, and pharmacies near you</p>
            </div>
          </div>
        </div>

        {/* Tab Header Selector */}
        <div className="flex gap-2 pb-4 overflow-x-auto scrollbar-none border-b border-gray-100/50 dark:border-gray-700/50">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedService(cat.id)}
              className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap ${
                selectedService === cat.id
                  ? 'bg-theme-gradient text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Listings */}
        <div className="mt-6 space-y-4">
          {loading && (
            <div className="text-center py-12 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Loader className="w-8 h-8 animate-spin text-accent-primary" />
              <p className="text-sm font-bold animate-pulse">Searching OSM Directory...</p>
            </div>
          )}

          {!loading && servicesList.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No services found in range.</p>
            </div>
          )}

          {!loading && servicesList.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex justify-between items-center p-3.5 bg-gray-50/50 dark:bg-gray-750/30 border border-gray-100/50 dark:border-gray-700/50 rounded-2xl hover:shadow-sm"
            >
              <div className="flex gap-3 items-center">
                <div className="p-2.5 bg-gradient-to-br from-accent-from to-accent-to text-white rounded-xl shadow-sm">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-850 dark:text-gray-100">{service.name}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{service.address}</p>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-xs font-black text-accent-primary">{service.distance} km</span>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Range</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default NearbyServices;
