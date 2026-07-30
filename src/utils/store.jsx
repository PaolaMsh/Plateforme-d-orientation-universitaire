// src/utils/store.js
// Hub centralisé : lecture/écriture localStorage + dispatch d'événements

const KEYS = {
    testHistory: 'testHistory',
    pdfReports: 'pdfReports',
    savedScholarships: 'savedScholarships',
    orientationReports: 'orientationReports',
    assessmentId: 'assessment_id',
    sessionToken: 'session_token',
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function read(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? [];
    } catch {
        return [];
    }
}

function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    // Notifie les autres onglets ET les listeners dans le même onglet
    window.dispatchEvent(new CustomEvent('store:update', { detail: { key, value } }));
}

// ─── Tests ─────────────────────────────────────────────────────────────────

export function saveTestResult(testResult) {
    const newTest = {
        id: Date.now(),
        title: testResult.title || "Test d'orientation",
        date: new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }),
        score: testResult.score,
        type: testResult.type || 'RIASEC',
        code: testResult.code || '',
        status: 'completed',
        fullReport: testResult.fullReport || {},
        assessmentId: testResult.assessmentId || null, // Lien avec l'API
    };

    const tests = [newTest, ...read(KEYS.testHistory)];
    write(KEYS.testHistory, tests);

    // Rapport PDF automatique
    const reports = read(KEYS.pdfReports);
    const newReport = {
        id: Date.now() + 1,
        title: `Rapport ${newTest.type} - ${newTest.date}`,
        date: newTest.date,
        size: `${(Math.random() * 3 + 1).toFixed(1)} Mo`,
        type: newTest.type.toLowerCase(),
        testId: newTest.id,
        assessmentId: testResult.assessmentId || null,
        content: newTest.fullReport,
    };
    write(KEYS.pdfReports, [newReport, ...reports]);

    return newTest;
}

export function getTestHistory() {
    return read(KEYS.testHistory);
}

// ─── Rapports d'orientation ─────────────────────────────────────────────────

export function saveOrientationReport(reportData) {
    const { assessmentId, scores, code, recommendations, behavioral, assessmentInfo } = reportData;

    // Evite les doublons : si ce assessmentId est déjà enregistré, on met à jour
    const existing = read(KEYS.orientationReports);
    const filtered = existing.filter((r) => r.assessmentId !== assessmentId);

    const report = {
        id: Date.now(),
        assessmentId,
        savedAt: new Date().toISOString(),
        completedAt: assessmentInfo?.completedAt || new Date().toISOString(),
        code: code || '',
        coherence: assessmentInfo?.coherence || '',
        scores: scores || {},
        recommendations: recommendations || {},
        behavioral: behavioral || {},
        topAxes: buildTopAxes(scores),
    };

    write(KEYS.orientationReports, [report, ...filtered]);
    return report;
}

export function getOrientationReports() {
    return read(KEYS.orientationReports);
}

export function deleteOrientationReport(id) {
    const list = read(KEYS.orientationReports).filter((r) => r.id !== id);
    write(KEYS.orientationReports, list);
}

// Helper interne
function buildTopAxes(scores) {
    if (!scores) return [];
    const labels = {
        REALISTIC: { label: 'Réaliste', icon: '🔧' },
        INVESTIGATIVE: { label: 'Investigateur', icon: '🔬' },
        ARTISTIC: { label: 'Artistique', icon: '🎨' },
        SOCIAL: { label: 'Social', icon: '👥' },
        ENTERPRISING: { label: 'Entreprenant', icon: '💼' },
        CONVENTIONAL: { label: 'Conventionnel', icon: '📋' },
    };
    return Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key, score]) => ({ key, score, ...labels[key] }));
}

// ─── Bourses ────────────────────────────────────────────────────────────────

export function saveScholarship(scholarship) {
    const list = read(KEYS.savedScholarships);
    if (list.some((s) => s.id === scholarship.id)) return false; // déjà enregistrée

    const enriched = {
        ...scholarship,
        savedAt: new Date().toISOString(),
    };
    write(KEYS.savedScholarships, [enriched, ...list]);
    return true;
}

export function removeScholarship(id) {
    const list = read(KEYS.savedScholarships).filter((s) => s.id !== id);
    write(KEYS.savedScholarships, list);
}

export function getSavedScholarships() {
    return read(KEYS.savedScholarships);
}

// ─── Synchronisation avec l'API ────────────────────────────────────────────

export async function syncUserData(token) {
    if (!token) return null;

    const API_BASE = 'https://api-orientation-production.up.railway.app/api/v1';

    try {
        // Récupérer les infos utilisateur
        const userResponse = await fetch(`${API_BASE}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userResponse.json();

        // Récupérer l'historique complet
        const historyResponse = await fetch(`${API_BASE}/users/me/history`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const historyData = await historyResponse.json();

        // Mettre à jour le localStorage avec les données de l'API
        if (historyData?.assessments) {
            const apiTests = historyData.assessments.map((assessment) => ({
                id: assessment.id,
                title: `Test RIASEC - ${new Date(assessment.createdAt).toLocaleDateString()}`,
                date: new Date(assessment.createdAt).toLocaleDateString('fr-FR'),
                score: assessment.progress?.completionPercentage || 0,
                type: 'RIASEC',
                code: assessment.results?.riasecCode || '',
                status: assessment.status === 'COMPLETED' ? 'completed' : 'in_progress',
                assessmentId: assessment.id,
                fullReport: assessment.results || {},
            }));

            write(KEYS.testHistory, apiTests);
        }

        return { userData, historyData };
    } catch (error) {
        console.error('Sync error:', error);
        return null;
    }
}

// ─── Listener helper ────────────────────────────────────────────────────────
// Utilisation : const off = onStoreUpdate('testHistory', (value) => setState(value))
// Appelez off() dans le return du useEffect pour nettoyer.

export function onStoreUpdate(key, callback) {
    const handler = (e) => {
        if (e.detail?.key === key) callback(e.detail.value);
    };
    // événements du même onglet
    window.addEventListener('store:update', handler);
    // événements des autres onglets (storage natif)
    const storageHandler = (e) => {
        if (e.key === key) {
            try {
                callback(JSON.parse(e.newValue) ?? []);
            } catch {}
        }
    };
    window.addEventListener('storage', storageHandler);

    return () => {
        window.removeEventListener('store:update', handler);
        window.removeEventListener('storage', storageHandler);
    };
}
