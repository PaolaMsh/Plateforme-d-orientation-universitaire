// services/treasureMapService.js
import api from './api';

export const treasureMapService = {
    /**
     * Génère une nouvelle treasure map pour un assessment
     */
    generateTreasureMap: async (sessionToken, assessmentId) => {
        try {
            console.log('🔄 Génération de la treasure map...', { sessionToken, assessmentId });
            const response = await api.post('/treasure-map', {
                sessionToken,
                assessmentId,
                generatePdf: true,
            });
            console.log('✅ Treasure map générée:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur génération treasure map:', error);
            throw error;
        }
    },

    /**
     * Récupère une treasure map existante
     */
    getTreasureMapByToken: async (sessionToken) => {
        try {
            console.log('🔍 Récupération de la treasure map...', sessionToken);
            const response = await api.get(`/treasure-map/by-token/${sessionToken}`);
            console.log('✅ Treasure map récupérée:', response.data);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('ℹ️ Pas de treasure map existante');
                return null;
            }
            throw error;
        }
    },

    /**
     * Récupère le PDF d'une treasure map
     */
    getTreasureMapPdf: async (shareToken) => {
        try {
            console.log('📄 Récupération du PDF...', shareToken);
            const response = await api.get(`/treasure-map/pdf/${shareToken}`, {
                responseType: 'blob',
                headers: {
                    Accept: 'application/pdf',
                },
            });
            console.log('✅ PDF récupéré:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur récupération PDF:', error);
            throw error;
        }
    },

    /**
     * Télécharge le rapport complet en PDF
     */
    downloadReportPdf: async (assessment, onProgress = null) => {
        try {
            if (onProgress) onProgress('Préparation du rapport...', 10);

            // 1. Vérifier si une treasure map existe déjà
            let treasureMapData = null;
            try {
                treasureMapData = await treasureMapService.getTreasureMapByToken(
                    assessment.sessionToken,
                );
            } catch {
                console.log('ℹ️ Pas de carte existante, le serveur va préparer le rapport');
            }

            // 2. Si pas de carte, demander au backend de préparer le rapport
            if (!treasureMapData) {
                if (onProgress) onProgress('Préparation du rapport côté serveur...', 30);
                treasureMapData = await treasureMapService.generateTreasureMap(
                    assessment.sessionToken,
                    assessment.assessmentId,
                );
            } else {
                if (onProgress) onProgress('Carte récupérée', 40);
            }

            // 3. Récupérer le PDF
            if (treasureMapData.shareToken) {
                if (onProgress) onProgress('Téléchargement du PDF...', 60);
                const pdfBlob = await treasureMapService.getTreasureMapPdf(
                    treasureMapData.shareToken,
                );

                if (onProgress) onProgress('PDF prêt', 90);

                return {
                    blob: pdfBlob,
                    shareToken: treasureMapData.shareToken,
                    data: treasureMapData,
                };
            } else {
                throw new Error('Aucun shareToken disponible');
            }
        } catch (error) {
            console.error('❌ Erreur téléchargement rapport:', error);
            throw error;
        }
    },

    /**
     * Télécharge et sauvegarde le rapport en PDF
     */
    downloadAndSavePdf: async (assessment, fileName = null, onProgress = null) => {
        try {
            const result = await treasureMapService.downloadReportPdf(assessment, onProgress);

            // Le PDF est fourni par le backend. Le front ne fait que déclencher le téléchargement.
            const url = window.URL.createObjectURL(result.blob);
            const link = document.createElement('a');
            link.href = url;

            const defaultName = `Rapport_${assessment.type || 'RIASEC'}_${assessment.assessmentId}.pdf`;
            link.download = fileName || defaultName;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);

            if (onProgress) onProgress('Téléchargement terminé', 100);

            return result;
        } catch (error) {
            console.error('❌ Erreur sauvegarde PDF:', error);
            throw error;
        }
    },
};

export default treasureMapService;
