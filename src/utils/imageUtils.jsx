// src/utils/imageUtils.js

const API_URL =
    import.meta.env.VITE_API_URL || 'https://api-orientation-production.up.railway.app/api/v1';

/**
 * Nettoie et construit l'URL complète d'une image
 * @param {string} coverUrl - L'URL de l'image depuis la base de données
 * @param {string} defaultImage - Image par défaut si coverUrl est null
 * @returns {string} L'URL complète de l'image
 */
export const getFullImageUrl = (coverUrl, defaultImage = '/images/default-university.jpg') => {
    if (!coverUrl) {
        return defaultImage;
    }

    // 1. Si l'URL contient localhost:5173, remplacer par l'URL de production
    if (coverUrl.includes('localhost:5173') || coverUrl.includes('localhost:5000')) {
        // Extraire le chemin après localhost
        const path = coverUrl.replace(/^https?:\/\/localhost:\d+/, '');
        // Si le chemin commence par /api/v1, on le garde, sinon on ajoute le chemin complet
        if (path.startsWith('/api/v1')) {
            return `${API_URL}${path.replace('/api/v1', '')}`;
        }
        return `${API_URL}${path}`;
    }

    // 2. Si l'URL est déjà absolue (http ou https)
    if (coverUrl.startsWith('http://') || coverUrl.startsWith('https://')) {
        return coverUrl;
    }

    // 3. Si l'URL commence par /, c'est un chemin relatif
    if (coverUrl.startsWith('/')) {
        // Si c'est /api/v1/..., on enlève /api/v1
        if (coverUrl.startsWith('/api/v1/')) {
            const baseUrl = API_URL.replace('/api/v1', '');
            return `${baseUrl}${coverUrl.replace('/api/v1', '')}`;
        }
        return `${API_URL}${coverUrl}`;
    }

    // 4. Pour les chemins simples comme "ENA.jpg"
    return `${API_URL}/${coverUrl}`;
};

/**
 * Vérifie si une image existe
 */
export const checkImageExists = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
};
