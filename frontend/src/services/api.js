import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle common errors
    if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Server error');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    
    return Promise.reject(error);
  }
);

// Destination API calls
export const destinationAPI = {
  // Get all destinations
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/destinations', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch destinations');
    }
  },

  // Get single destination
  getById: async (id) => {
    try {
      const response = await api.get(`/destinations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch destination');
    }
  },

  // Create destination
  create: async (destinationData) => {
    try {
      const response = await api.post('/destinations', destinationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create destination');
    }
  },

  // Update destination
  update: async (id, destinationData) => {
    try {
      const response = await api.put(`/destinations/${id}`, destinationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update destination');
    }
  },

  // Delete destination
  delete: async (id) => {
    try {
      const response = await api.delete(`/destinations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete destination');
    }
  },

  // Get destination suggestions
  getSuggestions: async (query, limit = 5) => {
    try {
      const response = await api.get('/destinations/search/suggestions', {
        params: { q: query, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch suggestions');
    }
  }
};

// Hotel API calls
export const hotelAPI = {
  // Get all hotels
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/hotels', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hotels');
    }
  },

  // Get hotels by destination
  getByDestination: async (destinationId, params = {}) => {
    try {
      const response = await api.get(`/hotels/destination/${destinationId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hotels for destination');
    }
  },

  // Get single hotel
  getById: async (id) => {
    try {
      const response = await api.get(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hotel');
    }
  },

  // Create hotel
  create: async (hotelData) => {
    try {
      const response = await api.post('/hotels', hotelData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create hotel');
    }
  },

  // Update hotel
  update: async (id, hotelData) => {
    try {
      const response = await api.put(`/hotels/${id}`, hotelData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update hotel');
    }
  },

  // Delete hotel
  delete: async (id) => {
    try {
      const response = await api.delete(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete hotel');
    }
  },

  // Get hotel suggestions
  getSuggestions: async (query, destinationId = null, limit = 5) => {
    try {
      const params = { q: query, limit };
      if (destinationId) params.destination = destinationId;
      
      const response = await api.get('/hotels/search/suggestions', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hotel suggestions');
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('API is not available');
  }
};

export default api;
