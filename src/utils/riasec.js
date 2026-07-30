export const TEST_TYPES = {
    GENERALE: 'GENERALE',
    OCCUPATIONS: 'OCCUPATIONS',
    APTITUDES: 'APTITUDES',
    PERSONALITY: 'PERSONALITY',
    FULL: 'FULL',
};

export const FULL_TEST_CATEGORIES = [
    TEST_TYPES.GENERALE,
    TEST_TYPES.OCCUPATIONS,
    TEST_TYPES.APTITUDES,
    TEST_TYPES.PERSONALITY,
];

export const RIASEC_AXIS_KEYS = {
    R: 'REALISTIC',
    I: 'INVESTIGATIVE',
    A: 'ARTISTIC',
    S: 'SOCIAL',
    E: 'ENTERPRISING',
    C: 'CONVENTIONAL',
};

export const RIASEC_LABELS = {
    REALISTIC: 'Réaliste',
    INVESTIGATIVE: 'Investigateur',
    ARTISTIC: 'Artistique',
    SOCIAL: 'Social',
    ENTERPRISING: 'Entreprenant',
    CONVENTIONAL: 'Conventionnel',
};

export function getRiasecCode(result) {
    return result?.riasecCode || result?.specificCode || result?.generalCode || result?.code || '';
}

export function getNormalizedScores(result) {
    const scoresByCategory = result?.scoresByCategory || result?.sectionScores || {};
    const normalized =
        scoresByCategory.totalNormalized ||
        scoresByCategory.normalized ||
        result?.specificNormalizedScores ||
        result?.scores ||
        {};

    return {
        REALISTIC: Number(normalized.R ?? normalized.REALISTIC ?? 0),
        INVESTIGATIVE: Number(normalized.I ?? normalized.INVESTIGATIVE ?? 0),
        ARTISTIC: Number(normalized.A ?? normalized.ARTISTIC ?? 0),
        SOCIAL: Number(normalized.S ?? normalized.SOCIAL ?? 0),
        ENTERPRISING: Number(normalized.E ?? normalized.ENTERPRISING ?? 0),
        CONVENTIONAL: Number(normalized.C ?? normalized.CONVENTIONAL ?? 0),
    };
}

export function getDominantAxisFromCode(code) {
    return (
        RIASEC_AXIS_KEYS[
            String(code || '')
                .charAt(0)
                .toUpperCase()
        ] || 'INVESTIGATIVE'
    );
}

export function getCategoryLabel(category) {
    const labels = {
        [TEST_TYPES.GENERALE]: 'Général',
        [TEST_TYPES.OCCUPATIONS]: 'Occupations',
        [TEST_TYPES.APTITUDES]: 'Aptitudes',
        [TEST_TYPES.PERSONALITY]: 'Personnalité',
        [TEST_TYPES.FULL]: 'Test complet',
    };
    return labels[category] || category || 'Test RIASEC';
}
