import api from './api';

const RIASEC_AXES = [
    'REALISTIC',
    'INVESTIGATIVE',
    'ARTISTIC',
    'SOCIAL',
    'ENTERPRISING',
    'CONVENTIONAL',
];

const riasecMapping = {
    R: 'REALISTIC',
    I: 'INVESTIGATIVE',
    A: 'ARTISTIC',
    S: 'SOCIAL',
    E: 'ENTERPRISING',
    C: 'CONVENTIONAL',
};

export const recommendationService = {
    fetchCareerRecommendations: async (assessmentId) => {
        const sessionToken = localStorage.getItem('session_token');
        if (!sessionToken) {
            throw new Error('X-Session-Token manquant');
        }

        const response = await api.get('/careers/career-recommendations', {
            params: {
                assessmentId,
                limit: 20,
                category: 'NUMERIQUE',
                force: true,
                advanced: true,
            },
            headers: {
                'X-Session-Token': sessionToken,
            },
        });

        return response.data;
    },

    fetchFormationRecommendations: async (assessmentId) => {
        const sessionToken = localStorage.getItem('session_token');
        if (!sessionToken) {
            throw new Error('X-Session-Token manquant');
        }

        const response = await api.get('/careers/formation-recommendations', {
            params: {
                assessmentId,
                limit: 20,
                category: 'NUMERIQUE',
                force: true,
                advanced: true,
            },
            headers: {
                'X-Session-Token': sessionToken,
            },
        });

        return response.data;
    },

    getRiasecRecommendations: async (assessmentId, riasecCode = null) => {
        try {
            const [careersData, formationsData] = await Promise.all([
                recommendationService.fetchCareerRecommendations(assessmentId).catch(() => []),
                recommendationService.fetchFormationRecommendations(assessmentId).catch(() => []),
            ]);

            const careersList = careersData
                .map((item) => ({
                    name: item.career?.name,
                    codes: item.career?.riasecCodes || [],
                }))
                .filter((c) => c.name);

            const formationsList = formationsData
                .map((item) => ({
                    name: item.formation?.name || item.formation?.title,
                    field: item.formation?.field,
                    school: item.university?.name,
                }))
                .filter((f) => f.name);

            const recommendationsByAxis = {};

            RIASEC_AXES.forEach((axis) => {
                recommendationsByAxis[axis] = {
                    formations: [],
                    metiers: [],
                    ecoles: [],
                };
            });

            careersList.forEach((career) => {
                if (career.codes.length === 0) {
                    if (!recommendationsByAxis.INVESTIGATIVE.metiers.includes(career.name)) {
                        recommendationsByAxis.INVESTIGATIVE.metiers.push(career.name);
                    }
                } else {
                    career.codes.forEach((code) => {
                        const axis = riasecMapping[code];
                        if (axis && !recommendationsByAxis[axis].metiers.includes(career.name)) {
                            recommendationsByAxis[axis].metiers.push(career.name);
                        }
                    });
                }
            });

            formationsList.forEach((formation) => {
                const formationField = (formation.field || '').toLowerCase();

                RIASEC_AXES.forEach((axis) => {
                    let shouldAdd = false;

                    if (
                        axis === 'REALISTIC' &&
                        (formationField.includes('ingenierie') ||
                            formationField.includes('technique') ||
                            formationField.includes('genie'))
                    ) {
                        shouldAdd = true;
                    } else if (
                        axis === 'INVESTIGATIVE' &&
                        (formationField.includes('informatique') ||
                            formationField.includes('data') ||
                            formationField.includes('science'))
                    ) {
                        shouldAdd = true;
                    } else if (
                        axis === 'ARTISTIC' &&
                        (formationField.includes('design') ||
                            formationField.includes('graphique') ||
                            formationField.includes('multimedia'))
                    ) {
                        shouldAdd = true;
                    } else if (
                        axis === 'SOCIAL' &&
                        (formationField.includes('communication') ||
                            formationField.includes('journalisme') ||
                            formationField.includes('gestion des medias'))
                    ) {
                        shouldAdd = true;
                    } else if (
                        axis === 'ENTERPRISING' &&
                        (formationField.includes('management') ||
                            formationField.includes('commerce') ||
                            formationField.includes('marketing'))
                    ) {
                        shouldAdd = true;
                    } else if (
                        axis === 'CONVENTIONAL' &&
                        (formationField.includes('comptabilite') ||
                            formationField.includes('administration') ||
                            formationField.includes('gestion'))
                    ) {
                        shouldAdd = true;
                    }

                    if (shouldAdd) {
                        if (!recommendationsByAxis[axis].formations.includes(formation.name)) {
                            recommendationsByAxis[axis].formations.push(formation.name);
                        }
                        if (
                            formation.school &&
                            !recommendationsByAxis[axis].ecoles.includes(formation.school)
                        ) {
                            recommendationsByAxis[axis].ecoles.push(formation.school);
                        }
                    }
                });
            });

            if (riasecCode) {
                const targetAxis = riasecMapping[riasecCode.toUpperCase()];
                if (targetAxis && recommendationsByAxis[targetAxis]) {
                    return {
                        careers: recommendationsByAxis[targetAxis].metiers,
                        formations: recommendationsByAxis[targetAxis].formations,
                        recommendationsByAxis: {
                            [targetAxis]: recommendationsByAxis[targetAxis],
                        },
                    };
                }
            }

            RIASEC_AXES.forEach((axis) => {
                recommendationsByAxis[axis].metiers = [
                    ...new Set(recommendationsByAxis[axis].metiers),
                ].slice(0, 10);
                recommendationsByAxis[axis].formations = [
                    ...new Set(recommendationsByAxis[axis].formations),
                ].slice(0, 10);
                recommendationsByAxis[axis].ecoles = [
                    ...new Set(recommendationsByAxis[axis].ecoles),
                ].slice(0, 10);
            });

            const allCareers = careersList.map((c) => c.name);
            const allFormations = formationsList.map((f) => f.name);

            return {
                careers: allCareers,
                formations: allFormations,
                recommendationsByAxis: recommendationsByAxis,
            };
        } catch (error) {
            console.error('Erreur getRiasecRecommendations:', error);
            const emptyRecommendations = {};
            RIASEC_AXES.forEach((axis) => {
                emptyRecommendations[axis] = { formations: [], metiers: [], ecoles: [] };
            });
            return {
                careers: [],
                formations: [],
                recommendationsByAxis: emptyRecommendations,
            };
        }
    },
};
