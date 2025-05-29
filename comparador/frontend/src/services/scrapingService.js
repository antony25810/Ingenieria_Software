import api from './api';

export const scrapingService = {
  /**
   * Obtiene logs de operaciones de scraping
   */
  getScrapingLogs: async (filters = {}) => {
    const response = await api.get('/scraping/logs', { params: filters });
    return response.data;
  },
  
  /**
   * Inicia el scraping para una marca específica
   */
  runScraping: async (brandId, url) => {
    const response = await api.post('/scraping/run', { brand_id: brandId, url });
    return response.data;
  },
  
  /**
   * Inicia el scraping para todas las marcas
   */
  runScrapingForAllBrands: async () => {
    const response = await api.post('/scraping/run-all');
    return response.data;
  },
  
  /**
   * Verifica el estado de una operación de scraping
   */
  getScrapingStatus: async (logId) => {
    const response = await api.get(`/scraping/logs/${logId}`);
    return response.data;
  }
};