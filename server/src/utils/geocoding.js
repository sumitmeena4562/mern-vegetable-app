import axios from 'axios';

/**
 * Address se Latitude aur Longitude nikalne ke liye
 */
export const getCoordinatesFromAddress = async (address) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        success: true,
        coordinates: [location.lng, location.lat], // MongoDB format: [lng, lat]
        formattedAddress: response.data.results[0].formatted_address
      };
    }
    
    return { success: false, message: 'Address not found' };
  } catch (error) {
    console.error('Geocoding Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Do points ke beech ki distance (Haversine Formula) calculate karne ke liye
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; 
  
  return distance; // Distance in km
};