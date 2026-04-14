import api from './api';

export const programService = {
  getPopularPrograms: async () => {
    try {
      const response = await api.get('/programs/popular');
      return response.data;
    } catch (error) {
      console.error('Erreur chargement programmes populaires:', error);
      throw error;
    }
  }
};