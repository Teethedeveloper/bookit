const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000 ';

export const API_ENDPOINTS = {
  experiences: `${API_URL}/api/experiences`,
  bookings: `${API_URL}/api/bookings`,
  promo: `${API_URL}/api/promo`,
};

export const getApiUrl = (endpoint: keyof typeof API_ENDPOINTS) => API_ENDPOINTS[endpoint];