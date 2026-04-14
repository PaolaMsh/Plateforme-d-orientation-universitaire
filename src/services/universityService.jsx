import api from './api';

export const universityService = {
  getAllUniversities: async () => {
    try {
      const response = await api.get('/universities');
      return response.data;
    } catch (error) {
      console.error('Erreur chargement universités:', error);
      throw error;
    }
  },

  getUniversityById: async (id) => {
    try {
      const response = await api.get(`/universities/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur chargement université ${id}:`, error);
      throw error;
    }
  },

  searchUniversities: async (query) => {
    try {
      const response = await api.get(`/universities/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Erreur recherche:', error);
      throw error;
    }
  }
};