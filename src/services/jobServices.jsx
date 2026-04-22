import api from './api';

export const jobService = {
    getAllJobs: async () => {
        try {
            const response = await api.get('/jobs');
            return response.data;
        } catch (error) {
            console.error('Erreur chargement métiers:', error);
            throw error;
        }
    },

    getJobsByCategory: async (category) => {
        try {
            const response = await api.get(`/jobs/category/${category}`);
            return response.data;
        } catch (error) {
            console.error('Erreur chargement métiers par catégorie:', error);
            throw error;
        }
    },
};
