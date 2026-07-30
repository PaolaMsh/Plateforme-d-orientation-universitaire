import api from './api';

// L'URL de base de ton API
const API_BASE_URL = 'https://api-orientation-production.up.railway.app';

// Fonction pour corriger l'URL de l'image
const fixImageUrl = (coverUrl) => {
    if (!coverUrl) return null;

    // Remplacer localhost par l'URL de production
    let fixedUrl = coverUrl
        .replace('http://localhost:5173', API_BASE_URL)
        .replace('http://localhost:5000', API_BASE_URL)
        .replace('localhost:5173', API_BASE_URL)
        .replace('localhost:5000', API_BASE_URL);

    // Si l'URL commence par /api/v1, enlever /api/v1 car les images ne sont pas dans /api
    if (fixedUrl.includes('/api/v1/')) {
        fixedUrl = fixedUrl.replace('/api/v1', '');
    }

    console.log('URL originale:', coverUrl);
    console.log('URL corrigée:', fixedUrl);

    return fixedUrl;
};

export const universityService = {
    getAllUniversities: async () => {
        try {
            const response = await api.get('/universities');
            console.log('Données reçues:', response.data);

            // Corriger les URLs des images
            const processedData = response.data.map((uni) => ({
                ...uni,
                coverUrl: fixImageUrl(uni.coverUrl),
            }));

            console.log('Données traitées:', processedData);
            return processedData;
        } catch (error) {
            console.error('Erreur chargement universités:', error);
            throw error;
        }
    },

    getUniversityById: async (id) => {
        try {
            const response = await api.get(`/universities/${id}`);
            return {
                ...response.data,
                coverUrl: fixImageUrl(response.data.coverUrl),
            };
        } catch (error) {
            console.error(`Erreur chargement université ${id}:`, error);
            throw error;
        }
    },

    searchUniversities: async (query) => {
        try {
            if (!query || query.trim() === '') {
                return [];
            }

            const url = `/universities/search/?q=${encodeURIComponent(query.trim())}`;
            const response = await api.get(url);

            // Corriger les URLs des images dans les résultats
            const processedData = response.data.map((uni) => ({
                ...uni,
                coverUrl: fixImageUrl(uni.coverUrl),
            }));

            return processedData;
        } catch (error) {
            console.error(`Erreur lors de la recherche:`, error);
            throw error;
        }
    },
};
