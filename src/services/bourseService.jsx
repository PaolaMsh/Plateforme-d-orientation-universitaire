import api from './api';

export const bourseService = {
    getAllScholarships: async () => {
        try {
            const response = await api.get('/scholarships');
            return response.data;
        } catch (error) {
            console.error('Erreur chargement bourses:', error);
            throw error;
        }
    },

    saveScholarship: async (scholarshipId) => {
        try {
            const response = await api.post(`/users/me/scholarship/${scholarshipId}`);
            console.log('✅ Bourse sauvegardée:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur sauvegarde bourse:', error);
            throw error;
        }
    },

    removeSavedScholarship: async (scholarshipId) => {
        try {
            const response = await api.delete(`/users/me/scholarship/${scholarshipId}`);
            console.log('✅ Bourse supprimée:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur suppression bourse:', error);
            throw error;
        }
    },

    getSpecificSavedScholarship: async (scholarshipId) => {
        try {
            const response = await api.get('/users/me/scholarship', {
                params: { scholarshipId },
            });
            console.log('✅ Bourse spécifique récupérée:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération bourse:', error);
            throw error;
        }
    },

    getAllSavedScholarships: async () => {
        try {
            const localSaved = localStorage.getItem('savedScholarships');
            if (!localSaved) {
                return [];
            }

            const savedIds = JSON.parse(localSaved);
            if (savedIds.length === 0) {
                return [];
            }

            console.log(
                `📚 Récupération de ${savedIds.length} bourses depuis la base de données...`,
            );

            const scholarships = [];
            const errors = [];

            for (const item of savedIds) {
                try {
                    const scholarshipId = item.id || item;
                    const response = await bourseService.getSpecificSavedScholarship(scholarshipId);

                    if (response && response.data) {
                        const apiData = response.data;
                        scholarships.push({
                            id: apiData.id || scholarshipId,
                            title: apiData.title || apiData.name || item.title || 'Bourse',
                            description: apiData.description || item.description || '',
                            country: apiData.country || item.country || '',
                            university: apiData.university || item.university || '',
                            type: apiData.type || item.type || '',
                            level: apiData.level || item.level || '',
                            amount: apiData.amount || item.amount || '',
                            link: apiData.link || apiData.applicationUrl || item.link || '',
                            emoji: apiData.emoji || item.emoji || '🎓',
                            savedAt: item.savedAt || new Date().toISOString(),
                            ...item,
                            ...(apiData.data || apiData),
                        });
                    } else {
                        scholarships.push(item);
                    }
                } catch (error) {
                    console.warn(`⚠️ Erreur récupération bourse ${item.id || item}:`, error);
                    errors.push({ id: item.id || item, error: error.message });
                    scholarships.push(item);
                }
            }

            console.log(`✅ ${scholarships.length} bourses récupérées (${errors.length} erreurs)`);

            localStorage.setItem('savedScholarships', JSON.stringify(scholarships));

            return scholarships;
        } catch (error) {
            console.error('❌ Erreur récupération toutes les bourses:', error);
            const localSaved = localStorage.getItem('savedScholarships');
            return localSaved ? JSON.parse(localSaved) : [];
        }
    },

    isScholarshipSaved: async (scholarshipId) => {
        try {
            await bourseService.getSpecificSavedScholarship(scholarshipId);
            return true;
        } catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            const saved = bourseService.getSavedScholarships();
            return saved.some((s) => s.id === scholarshipId);
        }
    },

    getSavedScholarships: () => {
        try {
            const localSaved = localStorage.getItem('savedScholarships');
            if (localSaved) {
                return JSON.parse(localSaved);
            }
            return [];
        } catch (error) {
            console.error('❌ Erreur chargement bourses locales:', error);
            return [];
        }
    },
};
