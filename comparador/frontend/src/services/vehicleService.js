import api from './api';

export const vehicleService = {
  /**
   * Obtiene todos los vehículos con filtros opcionales
   */
  getVehicles: async (filters = {}) => {
    // Convertir filtros a query params
    const params = {};
    
    if (filters.brandIds?.length) {
      params.brand_ids = filters.brandIds.join(',');
    }
    
    if (filters.minPassengers) {
      params.spec_min_passengers = filters.minPassengers;
    }
    
    if (filters.minHorsepower) {
      params.spec_min_horsepower = filters.minHorsepower;
    }
    
    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice) params.min_price = filters.minPrice;
      if (filters.maxPrice) params.max_price = filters.maxPrice;
    }
    
    const response = await api.get('/vehicles', { params });
    return response.data;
  },
  
  /**
   * Obtiene un vehículo por su ID
   */
  getVehicleById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },
  
  /**
   * Obtiene todas las marcas disponibles
   */
  getBrands: async () => {
    const response = await api.get('/vehicles/brands');
    return response.data;
  },
  
  /**
   * Compara múltiples vehículos
   */
  compareVehicles: async (vehicleIds) => {
    const params = { ids: vehicleIds.join(',') };
    const response = await api.get('/vehicles/compare', { params });
    return response.data;
  }
};