import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import '../styles/parcours.css';
import api from '../services/api';
import { bourseService } from '../services/bourseService';
import { treasureMapService } from '../services/treasureMapService';
import { getCategoryLabel } from '../utils/riasec';

const IconUser = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconHistory = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconFile = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const IconDashboard = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const IconDownload = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const IconEye = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconCalendar = () => (
    <svg
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const IconTrophy = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M4 17L12 22L20 17M4 12L12 17L20 12M12 2L4 7L12 12L20 7L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </svg>
);

const IconLoader = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle cx="12" cy="12" r="10" opacity="0.2" />
        <path d="M22 12a10 10 0 0 0-10-10" />
    </svg>
);

const IconBookmark = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);

const IconCheck = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconChart = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const MENU_ITEMS = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <IconDashboard /> },
    { id: 'tests', label: 'Mes tests', icon: <IconHistory /> },
    { id: 'reports', label: 'Rapports', icon: <IconFile /> },
    { id: 'bourses', label: 'Bourses', icon: <IconTrophy /> },
    { id: 'profile', label: 'Profil', icon: <IconUser /> },
];

const MONTHS = [
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
    'Aoû',
    'Sep',
    'Oct',
    'Nov',
    'Déc',
];

const STATUS_LABELS = {
    completed: 'Terminé',
    in_progress: 'En cours',
    not_started: 'Non commencé',
    abandoned: 'Abandonné',
    unknown: 'Inconnu',
};

function formatDate(value) {
    if (!value) return 'Date inconnue';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Date inconnue';
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function checkIfAssessmentStarted(assessment) {
    if (assessment.responses && assessment.responses.length > 0) return true;
    if (assessment.responseBatches && assessment.responseBatches.length > 0) return true;
    if (assessment.answeredQuestions && assessment.answeredQuestions > 0) return true;
    if (assessment.completionPercentage && assessment.completionPercentage > 0) return true;
    if (assessment.raw) {
        const raw = assessment.raw;
        if (raw.responses && raw.responses.length > 0) return true;
        if (raw.responseBatches && raw.responseBatches.length > 0) return true;
        if (raw.answeredQuestions && raw.answeredQuestions > 0) return true;
        if (raw.completionPercentage && raw.completionPercentage > 0) return true;
    }
    return false;
}

function normalizeStatus(status, assessment) {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'completed') return 'completed';
    if (normalized === 'in_progress') {
        const hasStarted = checkIfAssessmentStarted(assessment);
        return hasStarted ? 'in_progress' : 'not_started';
    }
    if (normalized === 'abandoned') return 'abandoned';
    return 'unknown';
}

function buildAssessmentTitle(assessment) {
    const type = String(assessment?.type || 'RIASEC').toUpperCase();
    return getCategoryLabel(type);
}

function buildAssessmentCode(assessment) {
    return (
        assessment?.specificCode ||
        assessment?.generalCode ||
        assessment?.riasecCode ||
        assessment?.code ||
        ''
    );
}

function flattenAssessments(historyData) {
    const sessions = Array.isArray(historyData?.sessions) ? historyData.sessions : [];
    const directAssessments = Array.isArray(historyData?.assessments)
        ? historyData.assessments
        : [];

    const sessionAssessments = sessions.flatMap((session) => {
        const assessments = Array.isArray(session.assessments) ? session.assessments : [];
        return assessments.map((assessment) => {
            const status = normalizeStatus(assessment.status, assessment);
            return {
                id: assessment.id,
                assessmentId: assessment.id,
                sessionToken: session.sessionToken || null,
                shareToken: session.shareToken || null,
                type: assessment.type || 'RIASEC',
                title: buildAssessmentTitle(assessment),
                date: formatDate(
                    assessment.completedAt || assessment.startedAt || session.createdAt,
                ),
                completedAt: assessment.completedAt || null,
                startedAt: assessment.startedAt || null,
                status: status,
                score: Number(assessment.completionPercentage ?? 0),
                completionPercentage: Number(assessment.completionPercentage ?? 0),
                code: buildAssessmentCode(assessment),
                consistencyLevel: assessment.consistencyLevel || null,
                hasResult: Boolean(assessment.hasResult),
                hasTreasureMap: Boolean(assessment.hasTreasureMap),
                responses: assessment.responses || [],
                responseBatches: assessment.responseBatches || [],
                answeredQuestions: assessment.answeredQuestions || 0,
                raw: assessment,
            };
        });
    });

    const directList = directAssessments.map((assessment) => {
        const status = normalizeStatus(assessment.status, assessment);
        return {
            id: assessment.id,
            assessmentId: assessment.id,
            sessionToken: historyData?.sessionToken || null,
            shareToken: historyData?.shareToken || null,
            type: assessment.type || 'RIASEC',
            title: buildAssessmentTitle(assessment),
            date: formatDate(
                assessment.completedAt || assessment.startedAt || historyData?.createdAt,
            ),
            completedAt: assessment.completedAt || null,
            startedAt: assessment.startedAt || null,
            status: status,
            score: Number(assessment.completionPercentage ?? 0),
            completionPercentage: Number(assessment.completionPercentage ?? 0),
            code: buildAssessmentCode(assessment),
            consistencyLevel: assessment.consistencyLevel || null,
            hasResult: Boolean(assessment.hasResult),
            hasTreasureMap: Boolean(assessment.hasTreasureMap),
            responses: assessment.responses || [],
            responseBatches: assessment.responseBatches || [],
            answeredQuestions: assessment.answeredQuestions || 0,
            raw: assessment,
        };
    });

    const combined = sessionAssessments.length > 0 ? sessionAssessments : directList;
    return combined.sort((left, right) => {
        const leftDate = new Date(left.completedAt || left.startedAt || 0).getTime();
        const rightDate = new Date(right.completedAt || right.startedAt || 0).getTime();
        return rightDate - leftDate;
    });
}

function buildEvolution(assessments) {
    const completed = assessments.filter((assessment) => assessment.status === 'completed');
    const averageScore =
        completed.length > 0
            ? Math.round(
                  completed.reduce(
                      (sum, assessment) => sum + Number(assessment.completionPercentage || 0),
                      0,
                  ) / completed.length,
              )
            : 0;
    const bestScore =
        completed.length > 0
            ? Math.max(
                  ...completed.map((assessment) => Number(assessment.completionPercentage || 0)),
              )
            : 0;
    const currentMonth = new Date().getMonth();
    const months = Array.from(
        { length: 4 },
        (_, index) => MONTHS[Math.max(0, currentMonth - 3 + index)],
    );

    const progression = months.map((month) => {
        const match = completed.find((assessment) => {
            const date = new Date(assessment.completedAt || assessment.startedAt || '');
            if (Number.isNaN(date.getTime())) return false;
            return MONTHS[date.getMonth()] === month;
        });
        return { month, score: match ? Number(match.completionPercentage || 0) : null };
    });

    return {
        testsCompleted: completed.length,
        totalTests: assessments.length,
        averageScore,
        bestScore,
        progression,
    };
}

export default function EspacePersonnel() {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [, setSavingPdfId] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [recommendations, setRecommendations] = useState({});
    const [loadingRecos, setLoadingRecos] = useState({});
    const [, setSaveMessage] = useState(null);

    // ✅ États pour les bourses sauvegardées depuis la base de données
    const [savedBourses, setSavedBourses] = useState([]);
    const [loadingBourses, setLoadingBourses] = useState(false);
    const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
    const [refreshKey, setRefreshKey] = useState(0);

    const assessments = useMemo(() => flattenAssessments(historyData), [historyData]);
    const evolutionData = useMemo(() => buildEvolution(assessments), [assessments]);
    const userInfo = useMemo(() => {
        const firstName = historyData?.firstName || '';
        const lastName = historyData?.lastName || '';
        const displayName =
            historyData?.displayName || [firstName, lastName].filter(Boolean).join(' ').trim();
        return {
            name: displayName || historyData?.email || 'Utilisateur',
            email: historyData?.email || '',
            bio: historyData?.bio || null,
        };
    }, [historyData]);

    const completedAssessments = assessments.filter(
        (assessment) => assessment.status === 'completed',
    );
    const inProgressAssessments = assessments.filter(
        (assessment) => assessment.status === 'in_progress',
    );
    const notStartedAssessments = assessments.filter(
        (assessment) => assessment.status === 'not_started',
    );
    const latestAssessment = assessments[0] || null;

    // ✅ Fonction pour charger toutes les bourses sauvegardées depuis la base de données
    const loadSavedScholarshipsFromDB = useCallback(async () => {
        setLoadingBourses(true);
        setSyncProgress({ current: 0, total: 0 });

        try {
            // Récupérer les IDs depuis localStorage
            const localSaved = localStorage.getItem('savedScholarships');
            if (!localSaved) {
                setSavedBourses([]);
                setLoadingBourses(false);
                return;
            }

            const savedItems = JSON.parse(localSaved);
            setSyncProgress({ current: 0, total: savedItems.length });

            // Récupérer chaque bourse depuis l'API
            const boursesList = [];
            const errors = [];

            for (let i = 0; i < savedItems.length; i++) {
                const item = savedItems[i];
                const scholarshipId = item.id || item;

                try {
                    console.log(
                        `📤 Récupération bourse ${i + 1}/${savedItems.length}: ${scholarshipId}`,
                    );

                    const response = await bourseService.getSpecificSavedScholarship(scholarshipId);

                    // Combiner les données
                    const apiData = response.data || response;
                    boursesList.push({
                        id: apiData.id || scholarshipId,
                        title: apiData.title || apiData.name || item.title || item.name || 'Bourse',
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
                } catch (error) {
                    console.warn(`⚠️ Erreur bourse ${scholarshipId}:`, error);
                    errors.push({ id: scholarshipId, error: error.message });
                    // Garder la version locale
                    boursesList.push(item);
                }

                setSyncProgress({ current: i + 1, total: savedItems.length });
            }

            console.log(`✅ ${boursesList.length} bourses récupérées (${errors.length} erreurs)`);

            // Mettre à jour localStorage avec les données fraîches
            localStorage.setItem('savedScholarships', JSON.stringify(boursesList));
            setSavedBourses(boursesList);
        } catch (error) {
            console.error('❌ Erreur chargement bourses:', error);
            // Fallback vers localStorage
            const localSaved = localStorage.getItem('savedScholarships');
            setSavedBourses(localSaved ? JSON.parse(localSaved) : []);
        } finally {
            setLoadingBourses(false);
        }
    }, []);

    // ✅ Charger les bourses quand on est dans la section bourses
    useEffect(() => {
        if (activeMenu === 'bourses') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadSavedScholarshipsFromDB();
        }
    }, [activeMenu, refreshKey, loadSavedScholarshipsFromDB]);

    const loadRecommendations = useCallback(async (assessmentId) => {
        if (!assessmentId) return null;

        setLoadingRecos((prev) => ({ ...prev, [assessmentId]: true }));

        try {
            const response = await api.get(
                `/users/me/assessments/${assessmentId}/recommendations`,
                { params: { limit: 10 } },
            );
            return response.data;
        } catch (error) {
            console.error('Erreur chargement recommandations:', error);
            return null;
        } finally {
            setLoadingRecos((prev) => ({ ...prev, [assessmentId]: false }));
        }
    }, []);

    useEffect(() => {
        if (activeMenu === 'reports' && completedAssessments.length > 0) {
            completedAssessments.forEach(async (assessment) => {
                if (!recommendations[assessment.id]) {
                    const recos = await loadRecommendations(assessment.assessmentId);
                    if (recos) {
                        setRecommendations((prev) => ({ ...prev, [assessment.id]: recos }));
                    }
                }
            });
        }
    }, [activeMenu, completedAssessments, loadRecommendations, recommendations]);

    const loadHistory = useCallback(async () => {
        setLoading(true);
        setError('');

        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 8000);

        try {
            const response = await api.get('/users/me/history', { signal: controller.signal });
            setHistoryData(response.data || null);
        } catch (apiError) {
            console.error('Erreur chargement historique:', apiError);
            if (apiError.name === 'CanceledError' || apiError.code === 'ERR_CANCELED') {
                setError('Le chargement a pris trop de temps. Réessayez dans quelques instants.');
            } else {
                setError(
                    apiError.response?.data?.message ||
                        'Veuillez vous reconnecter .Impossible de charger votre espace personnel.',
                );
            }
        } finally {
            window.clearTimeout(timeoutId);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadHistory();
    }, [loadHistory]);

    // EspacePersonnel.js - generateLocalPdf avec style pro

    const generateLocalPdf = useCallback(
        async (assessment) => {
            try {
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                });

                // ===== CONSTANTES =====
                const pageWidth = 210;
                const margin = 20;
                const colors = {
                    primary: [26, 86, 219], // #1a56db
                    primaryDark: [30, 58, 138], // #1e3a8a
                    secondary: [13, 148, 136], // #0d9488
                    accent: [245, 158, 11], // #f59e0b
                    success: [16, 185, 129], // #10b981
                    gray: [107, 114, 128], // #6b7280
                    lightGray: [243, 244, 246], // #f3f4f6
                    dark: [31, 41, 55], // #1f2937
                    white: [255, 255, 255],
                    red: [239, 68, 68], // #ef4444
                    blue: [59, 130, 246], // #3b82f6
                    pink: [236, 72, 153], // #ec4899
                    purple: [139, 92, 246], // #8b5cf6
                    orange: [251, 146, 60], // #fb923c
                };

                const title = 'Rapport RIASEC';
                const code = assessment.code || 'N/A';

                // ===== PAGE 1 : EN-TÊTE =====
                // Bandeau dégradé
                pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                pdf.rect(0, 0, pageWidth, 48, 'F');

                // Logo circulaire
                pdf.setFillColor(255, 255, 255);
                pdf.circle(28, 24, 12, 'F');
                pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                pdf.setFontSize(18);
                pdf.setFont('helvetica', 'bold');
                pdf.text('R', 24, 30);

                // Titre
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(22);
                pdf.setFont('helvetica', 'bold');
                pdf.text(title, 48, 23);

                // Date
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                const dateStr = new Date().toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                });
                pdf.text(`📅 ${dateStr}`, 48, 33);

                // ===== CODE RIASEC =====
                let y = 58;

                // Encadré du code
                pdf.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
                pdf.roundedRect(margin, y, pageWidth - margin * 2, 28, 6, 6, 'F');

                pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Code RIASEC', margin + 12, y + 12);

                pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                pdf.setFontSize(28);
                pdf.setFont('helvetica', 'bold');
                const codeX = pageWidth - margin - 12 - code.length * 12;
                pdf.text(code, codeX, y + 20);

                y += 38;

                // ===== SCORES RIASEC =====
                if (assessment.scores) {
                    const scores = assessment.scores || {};
                    const labels = {
                        R: 'Réaliste',
                        I: 'Investigateur',
                        A: 'Artistique',
                        S: 'Social',
                        E: 'Entreprenant',
                        C: 'Conventionnel',
                    };
                    const scoreColors = {
                        R: colors.red,
                        I: colors.blue,
                        A: colors.pink,
                        S: colors.success,
                        E: colors.orange,
                        C: colors.purple,
                    };
                    const icons = {
                        R: '🔧',
                        I: '🔬',
                        A: '🎨',
                        S: '👥',
                        E: '💼',
                        C: '📋',
                    };

                    // Titre de la section
                    pdf.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
                    pdf.roundedRect(margin, y, pageWidth - margin * 2, 10, 4, 4, 'F');
                    pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
                    pdf.setFontSize(13);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text('📊 Scores RIASEC', margin + 10, y + 7);
                    y += 18;

                    const barWidth = pageWidth - margin * 2 - 20;
                    const barHeight = 16;
                    const barSpacing = 6;

                    const scoreEntries = Object.entries(scores);
                    scoreEntries.forEach(([key, value], index) => {
                        const score = typeof value === 'number' ? value : 0;
                        const label = labels[key] || key;
                        const color = scoreColors[key] || colors.gray;
                        const icon = icons[key] || '📌';

                        const yPos = y + index * (barHeight + barSpacing);

                        // Nom
                        pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
                        pdf.setFontSize(10);
                        pdf.setFont('helvetica', 'bold');
                        pdf.text(`${icon} ${label}`, margin + 5, yPos + 11);

                        // Barre de fond
                        pdf.setFillColor(
                            colors.lightGray[0],
                            colors.lightGray[1],
                            colors.lightGray[2],
                        );
                        pdf.roundedRect(margin + 60, yPos, barWidth - 60, barHeight, 3, 3, 'F');

                        // Barre de progression (avec dégradé)
                        const progressWidth = ((barWidth - 60) * Math.min(score, 100)) / 100;
                        if (progressWidth > 0) {
                            pdf.setFillColor(color[0], color[1], color[2]);
                            pdf.roundedRect(
                                margin + 60,
                                yPos,
                                Math.max(progressWidth, 3),
                                barHeight,
                                3,
                                3,
                                'F',
                            );
                        }

                        // Score en pourcentage
                        pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
                        pdf.setFontSize(9);
                        pdf.setFont('helvetica', 'bold');
                        pdf.text(
                            `${Math.round(score)}%`,
                            margin + 60 + progressWidth + 5,
                            yPos + 11,
                        );
                    });

                    y += scoreEntries.length * (barHeight + barSpacing) + 12;
                }

                // ===== INFORMATIONS DU TEST =====
                // Titre
                pdf.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
                pdf.roundedRect(margin, y, pageWidth - margin * 2, 10, 4, 4, 'F');
                pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
                pdf.setFontSize(13);
                pdf.setFont('helvetica', 'bold');
                pdf.text('📋 Détails du test', margin + 10, y + 7);
                y += 18;

                // Informations
                const infoItems = [
                    [
                        'Statut',
                        STATUS_LABELS[assessment.status] || assessment.status || 'Non renseigné',
                    ],
                    ['Cohérence', assessment.consistencyLevel || 'Non renseignée'],
                    ['Complétion', `${assessment.completionPercentage || 0}%`],
                    [
                        'Date de début',
                        assessment.startedAt ? formatDate(assessment.startedAt) : 'Non renseignée',
                    ],
                    [
                        'Date de fin',
                        assessment.completedAt
                            ? formatDate(assessment.completedAt)
                            : 'Non renseignée',
                    ],
                    ['ID du test', assessment.assessmentId || 'Non renseigné'],
                ];

                infoItems.forEach(([label, value]) => {
                    pdf.setFontSize(9.5);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
                    pdf.text(`${label}:`, margin + 10, y + 5);

                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
                    const labelWidth = pdf.getTextWidth(`${label}:`);
                    pdf.text(String(value), margin + 10 + labelWidth + 5, y + 5);
                    y += 7;
                });

                // ===== PAGE 2 : RECOMMANDATIONS =====
                pdf.addPage();
                y = 25;

                // Bandeau titre
                pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                pdf.rect(0, 0, pageWidth, 40, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(18);
                pdf.setFont('helvetica', 'bold');
                pdf.text('🎯 Vos Recommandations', margin, 26);

                // ===== RECOMMANDATIONS =====
                y = 50;
                const recos = recommendations[assessment.id];

                if (
                    recos &&
                    (recos.careers?.length > 0 ||
                        recos.trainings?.length > 0 ||
                        recos.schools?.length > 0)
                ) {
                    // Métiers
                    if (recos.careers && recos.careers.length > 0) {
                        pdf.setFillColor(
                            colors.secondary[0],
                            colors.secondary[1],
                            colors.secondary[2],
                        );
                        pdf.roundedRect(margin, y, pageWidth - margin * 2, 9, 4, 4, 'F');
                        pdf.setTextColor(255, 255, 255);
                        pdf.setFontSize(11);
                        pdf.setFont('helvetica', 'bold');
                        pdf.text('💼 Métiers recommandés', margin + 10, y + 7);
                        y += 16;

                        pdf.setFontSize(9);
                        pdf.setFont('helvetica', 'normal');
                        pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
                        recos.careers.slice(0, 8).forEach((career, i) => {
                            const name = typeof career === 'string' ? career : career.name;
                            pdf.text(`• ${name}`, margin + 15, y + i * 6);
                        });
                        y += Math.min(recos.careers.length, 8) * 6 + 12;
                    }

                    // Formations
                    if (recos.trainings && recos.trainings.length > 0) {
                        pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                        pdf.roundedRect(margin, y, pageWidth - margin * 2, 9, 4, 4, 'F');
                        pdf.setTextColor(255, 255, 255);
                        pdf.setFontSize(11);
                        pdf.setFont('helvetica', 'bold');
                        pdf.text('📚 Formations recommandées', margin + 10, y + 7);
                        y += 16;

                        pdf.setFontSize(9);
                        pdf.setFont('helvetica', 'normal');
                        pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
                        recos.trainings.slice(0, 8).forEach((training, i) => {
                            const name = typeof training === 'string' ? training : training.name;
                            pdf.text(`• ${name}`, margin + 15, y + i * 6);
                        });
                        y += Math.min(recos.trainings.length, 8) * 6 + 12;
                    }

                    // Écoles
                    if (recos.schools && recos.schools.length > 0) {
                        pdf.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
                        pdf.roundedRect(margin, y, pageWidth - margin * 2, 9, 4, 4, 'F');
                        pdf.setTextColor(255, 255, 255);
                        pdf.setFontSize(11);
                        pdf.setFont('helvetica', 'bold');
                        pdf.text('🎓 Écoles / Universités', margin + 10, y + 7);
                        y += 16;

                        pdf.setFontSize(9);
                        pdf.setFont('helvetica', 'normal');
                        pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
                        recos.schools.slice(0, 8).forEach((school, i) => {
                            const name = typeof school === 'string' ? school : school.name;
                            pdf.text(`• ${name}`, margin + 15, y + i * 6);
                        });
                        y += Math.min(recos.schools.length, 8) * 6 + 12;
                    }
                } else {
                    pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'italic');
                    pdf.text('Aucune recommandation disponible pour ce test.', margin + 10, y + 10);
                }

                // ===== PIED DE PAGE =====
                const addFooter = (pageNum, totalPages) => {
                    pdf.setFontSize(8);
                    pdf.setFont('helvetica', 'italic');
                    pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);

                    // Ligne de séparation
                    pdf.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
                    pdf.line(margin, 285, pageWidth - margin, 285);

                    // Texte
                    const footerText = `Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`;
                    pdf.text(footerText, margin, 292);
                    pdf.text(`Page ${pageNum}/${totalPages}`, pageWidth - margin - 20, 292);

                    // Logo miniature
                    pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                    pdf.setFontSize(6);
                    pdf.text('◆', pageWidth - margin - 8, 292);
                };

                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    addFooter(i, totalPages);
                }

                // ===== TÉLÉCHARGEMENT =====
                pdf.save(`${title.replace(/\s/g, '_')}_${assessment.assessmentId}.pdf`);
            } catch (error) {
                console.error('❌ Erreur fallback PDF:', error);
                throw error;
            }
        },
        [recommendations],
    );

    const exportAssessmentPdf = useCallback(
        async (assessment) => {
            if (!assessment) return;

            setSavingPdfId(assessment.id);

            try {
                console.log('📄 Génération du rapport pour:', assessment.assessmentId);

                const result = await treasureMapService.downloadAndSavePdf(
                    assessment,
                    `Rapport_${assessment.type || 'RIASEC'}_${assessment.assessmentId}.pdf`,
                    (message, progress) => {
                        console.log(`📊 Progression: ${progress}% - ${message}`);
                    },
                );

                console.log('✅ Rapport téléchargé avec succès:', result);
            } catch (error) {
                console.error('❌ Erreur téléchargement du rapport:', error);
                console.log('⚠️ Fallback vers la génération PDF locale...');
                await generateLocalPdf(assessment);
            } finally {
                setSavingPdfId(null);
            }
        },
        [generateLocalPdf],
    );

    const openAssessment = useCallback(
        (assessment) => {
            if (!assessment) return;

            navigate('/orientations', {
                state: {
                    assessmentId: assessment.assessmentId,
                    sessionToken: assessment.sessionToken,
                },
            });
        },
        [navigate],
    );

    const resumeAssessment = useCallback(() => {
        navigate('/tests-orientations');
    }, [navigate]);

    if (loading) {
        return (
            <div className="espace-container">
                <div className="loading-container">
                    <div className="simple-loader"></div>
                    <p>Chargement de votre parcours...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="espace-container">
                <div className="loading-container">
                    <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
                    <button className="new-test-btn" onClick={loadHistory}>
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="espace-container">
            <header className="espace-header">
                <div className="espace-header-content">
                    <h1>Mon parcours d'orientation</h1>
                </div>
                <div className="espace-header-stats">
                    <div className="stat-badge">
                        <span className="stat-number">{evolutionData.testsCompleted}</span>
                        <span className="stat-label">Tests complétés</span>
                    </div>
                </div>
            </header>

            <div className="espace-body">
                <aside className="espace-sidebar">
                    <div className="user-card" style={{ marginBottom: '1.5rem' }}>
                        <h3>{userInfo.name}</h3>
                        <p>{userInfo.email}</p>
                    </div>

                    <nav className="sidebar-nav">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
                                onClick={() => setActiveMenu(item.id)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <button className="help-btn" onClick={() => navigate('/support')}>
                            Aide
                        </button>
                        <button className="support-btn" onClick={() => navigate('/contact')}>
                            Contact
                        </button>
                    </div>
                </aside>

                <main className="espace-main">
                    {activeMenu === 'dashboard' && (
                        <section>
                            <div className="section-header">
                                <h2>
                                    <IconDashboard /> Vue d'ensemble
                                </h2>
                                <button className="new-test-btn" onClick={resumeAssessment}>
                                    Nouveau test
                                </button>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">
                                        <IconHistory />
                                    </div>
                                    <div>
                                        <div className="stat-number">
                                            {evolutionData.totalTests}
                                        </div>
                                        <div className="stat-label">Total des évaluations</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">
                                        <IconChart />
                                    </div>
                                    <div>
                                        <div className="stat-number">
                                            {evolutionData.averageScore}
                                        </div>
                                        <div className="stat-label">Moyenne de complétion</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">
                                        <IconTrophy />
                                    </div>
                                    <div>
                                        <div className="stat-number">{evolutionData.bestScore}</div>
                                        <div className="stat-label">Meilleur score</div>
                                    </div>
                                </div>
                            </div>

                            <div className="advice-card">
                                <h3>Dernier test synchronisé</h3>
                                {latestAssessment ? (
                                    <div className="test-result">
                                        <div className="test-info">
                                            <strong>{latestAssessment.title}</strong>
                                            <div className="test-date">
                                                <IconCalendar /> {latestAssessment.date}
                                            </div>
                                        </div>
                                        <div className="test-score-badge">
                                            {latestAssessment.completionPercentage}%
                                        </div>
                                    </div>
                                ) : (
                                    <p>Aucun test trouvé dans votre historique.</p>
                                )}
                            </div>

                            {inProgressAssessments.length > 0 && (
                                <div
                                    className="advice-card"
                                    style={{ marginTop: '1rem', borderLeft: '4px solid #f59e0b' }}
                                >
                                    <h3> Tests en cours</h3>
                                    <p>
                                        Vous avez {inProgressAssessments.length} test(s) à terminer.
                                    </p>
                                    <button
                                        className="new-test-btn"
                                        onClick={resumeAssessment}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        Continuer le test
                                    </button>
                                </div>
                            )}
                        </section>
                    )}

                    {activeMenu === 'tests' && (
                        <section>
                            <div className="section-header">
                                <h2>
                                    <IconHistory /> Mes tests
                                </h2>
                                <button className="new-test-btn" onClick={resumeAssessment}>
                                    Nouveau test
                                </button>
                            </div>

                            <div className="tests-list">
                                {assessments.length === 0 ? (
                                    <div className="advice-card">
                                        <p>Aucun test disponible pour le moment.</p>
                                    </div>
                                ) : (
                                    assessments.map((assessment) => (
                                        <div
                                            key={assessment.id}
                                            className={`test-card ${assessment.status !== 'completed' ? 'pending' : ''}`}
                                        >
                                            <div className="test-card-header">
                                                <div>
                                                    <h4>{assessment.title}</h4>
                                                    <div className="test-type">
                                                        {assessment.type}{' '}
                                                        {assessment.code
                                                            ? `- ${assessment.code}`
                                                            : ''}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`status-badge ${assessment.status === 'completed' ? 'completed' : assessment.status === 'in_progress' ? 'in-progress' : assessment.status === 'not_started' ? 'not-started' : 'pending'}`}
                                                >
                                                    {STATUS_LABELS[assessment.status] ||
                                                        assessment.status}
                                                </span>
                                            </div>

                                            <div className="test-card-body">
                                                <div className="test-meta">
                                                    <IconCalendar /> {assessment.date}
                                                </div>
                                                <div className="test-score-large">
                                                    <span className="score-number">
                                                        {assessment.completionPercentage}
                                                    </span>
                                                    <span className="score-max">%</span>
                                                </div>
                                            </div>

                                            <div className="test-card-footer">
                                                {assessment.status === 'in_progress' && (
                                                    <button
                                                        className="generate-btn"
                                                        onClick={resumeAssessment}
                                                    >
                                                        Continuer
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )}

                    {activeMenu === 'reports' && (
                        <section className="reports-content">
                            <div className="section-header">
                                <h2>
                                    <IconFile /> Rapports
                                </h2>
                                <button className="generate-btn" onClick={resumeAssessment}>
                                    Nouveau rapport
                                </button>
                            </div>

                            <div className="reports-grid">
                                {completedAssessments.length === 0 ? (
                                    <div className="advice-card">
                                        <p>Aucun rapport générable pour le moment.</p>
                                    </div>
                                ) : (
                                    completedAssessments.map((assessment) => {
                                        const recos = recommendations[assessment.id];
                                        const isLoading = loadingRecos[assessment.id];

                                        return (
                                            <div key={assessment.id} className="report-card">
                                                <div className="report-icon">
                                                    <IconFile />
                                                </div>
                                                <div className="report-info">
                                                    <h4>{assessment.title}</h4>
                                                    <div className="report-meta">
                                                        <span>
                                                            <IconCalendar /> {assessment.date}
                                                        </span>
                                                        <span>
                                                            <IconLoader />{' '}
                                                            {assessment.completionPercentage}%
                                                        </span>
                                                    </div>
                                                    {assessment.code && (
                                                        <div className="report-code-badge">
                                                            <strong>Code RIASEC:</strong>{' '}
                                                            {assessment.code}
                                                        </div>
                                                    )}
                                                    <div className="report-recommendations">
                                                        {isLoading ? (
                                                            <div className="reco-loading">
                                                                <div className="loader-small"></div>
                                                                <span>
                                                                    Chargement des
                                                                    recommandations...
                                                                </span>
                                                            </div>
                                                        ) : recos ? (
                                                            <>
                                                                {recos.trainings &&
                                                                    recos.trainings.length > 0 && (
                                                                        <div className="reco-section">
                                                                            <div className="reco-title">
                                                                                📚 Formations
                                                                                recommandées
                                                                            </div>
                                                                            <ul className="reco-list">
                                                                                {recos.trainings
                                                                                    .slice(0, 5)
                                                                                    .map(
                                                                                        (
                                                                                            training,
                                                                                            idx,
                                                                                        ) => (
                                                                                            <li
                                                                                                key={
                                                                                                    idx
                                                                                                }
                                                                                            >
                                                                                                <span className="reco-icon">
                                                                                                    🏫
                                                                                                </span>
                                                                                                {typeof training ===
                                                                                                'string'
                                                                                                    ? training
                                                                                                    : training.name}
                                                                                            </li>
                                                                                        ),
                                                                                    )}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                {recos.schools &&
                                                                    recos.schools.length > 0 && (
                                                                        <div className="reco-section">
                                                                            <div className="reco-title">
                                                                                🎓 Écoles /
                                                                                Universités
                                                                            </div>
                                                                            <ul className="reco-list">
                                                                                {recos.schools
                                                                                    .slice(0, 5)
                                                                                    .map(
                                                                                        (
                                                                                            school,
                                                                                            idx,
                                                                                        ) => (
                                                                                            <li
                                                                                                key={
                                                                                                    idx
                                                                                                }
                                                                                            >
                                                                                                <span className="reco-icon">
                                                                                                    🏛️
                                                                                                </span>
                                                                                                {typeof school ===
                                                                                                'string'
                                                                                                    ? school
                                                                                                    : school.name}
                                                                                            </li>
                                                                                        ),
                                                                                    )}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                            </>
                                                        ) : (
                                                            <div className="reco-empty">
                                                                <button
                                                                    className="load-reco-btn"
                                                                    onClick={async () => {
                                                                        const data =
                                                                            await loadRecommendations(
                                                                                assessment.assessmentId,
                                                                            );
                                                                        if (data) {
                                                                            setRecommendations(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    [assessment.id]:
                                                                                        data,
                                                                                }),
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    Voir les métiers et formations
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="report-actions">
                                                    <button
                                                        className="action-icon"
                                                        onClick={() => openAssessment(assessment)}
                                                        title="Voir"
                                                    >
                                                        <IconEye />
                                                    </button>
                                                    <button
                                                        className="action-icon"
                                                        onClick={() =>
                                                            exportAssessmentPdf(assessment)
                                                        }
                                                        title="Télécharger"
                                                    >
                                                        <IconDownload />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </section>
                    )}

                    {/* ✅ SECTION BOURSES CORRIGÉE AVEC RÉCUPÉRATION DEPUIS LA BASE DE DONNÉES */}
                    {activeMenu === 'bourses' && (
                        <section>
                            <div className="section-header">
                                <h2>
                                    <IconTrophy /> Mes bourses sauvegardées
                                </h2>
                            </div>

                            {loadingBourses ? (
                                <div className="loading-container">
                                    <div className="simple-loader"></div>
                                    <p>Synchronisation des bourses sauvegardées...</p>
                                    <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                        {syncProgress.current} / {syncProgress.total} bourses
                                    </p>
                                </div>
                            ) : (
                                <div className="tests-list">
                                    {savedBourses.length === 0 ? (
                                        <div className="advice-card">
                                            <p>Aucune bourse sauvegardée pour le moment.</p>
                                            <p
                                                style={{
                                                    fontSize: '0.9rem',
                                                    color: '#666',
                                                    marginTop: '0.5rem',
                                                }}
                                            >
                                                Explorez les bourses disponibles et sauvegardez
                                                celles qui vous intéressent.
                                            </p>
                                            <button
                                                className="generate-btn"
                                                onClick={() => navigate('/scholarships')}
                                                style={{ marginTop: '1rem' }}
                                            >
                                                Découvrir les bourses
                                            </button>
                                        </div>
                                    ) : (
                                        savedBourses.map((bourse) => (
                                            <div
                                                key={bourse.id}
                                                className="test-card saved"
                                                style={{
                                                    borderLeft: '4px solid #10b981',
                                                    background:
                                                        'linear-gradient(to right, #f0fdf4, #ffffff)',
                                                }}
                                            >
                                                <div className="test-card-header">
                                                    <div>
                                                        <h4>
                                                            {bourse.emoji
                                                                ? `${bourse.emoji} `
                                                                : '🎓 '}
                                                            {bourse.title ||
                                                                bourse.name ||
                                                                'Bourse sans nom'}
                                                        </h4>
                                                        <div className="test-type">
                                                            {bourse.description ||
                                                                'Aucune description'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="test-card-body">
                                                    <div className="test-meta">
                                                        <IconCalendar />
                                                        Sauvegardée le{' '}
                                                        {formatDate(
                                                            bourse.savedAt ||
                                                                bourse.unlockedAt ||
                                                                new Date().toISOString(),
                                                        )}
                                                    </div>
                                                    {bourse.amount && (
                                                        <div className="test-score-large">
                                                            <span
                                                                className="score-number"
                                                                style={{ fontSize: '1.2rem' }}
                                                            >
                                                                {bourse.amount}
                                                            </span>
                                                            <span className="score-max">💰</span>
                                                        </div>
                                                    )}
                                                    {bourse.country && (
                                                        <div
                                                            style={{
                                                                fontSize: '0.85rem',
                                                                color: '#6b7280',
                                                                marginTop: '0.5rem',
                                                            }}
                                                        >
                                                            🌍 {bourse.country}
                                                        </div>
                                                    )}
                                                    {bourse.university && (
                                                        <div
                                                            style={{
                                                                fontSize: '0.85rem',
                                                                color: '#6b7280',
                                                            }}
                                                        >
                                                            🏛️ {bourse.university}
                                                        </div>
                                                    )}
                                                    {bourse.type && (
                                                        <div
                                                            style={{
                                                                fontSize: '0.8rem',
                                                                color: '#4f46e5',
                                                                marginTop: '0.25rem',
                                                                background: '#eef2ff',
                                                                padding: '0.2rem 0.6rem',
                                                                borderRadius: '12px',
                                                                display: 'inline-block',
                                                            }}
                                                        >
                                                            {bourse.type}
                                                        </div>
                                                    )}
                                                </div>

                                                <div
                                                    className="test-card-footer"
                                                    style={{
                                                        display: 'flex',
                                                        gap: '0.5rem',
                                                        flexWrap: 'wrap',
                                                    }}
                                                >
                                                    {bourse.link && (
                                                        <button
                                                            className="apply-btn"
                                                            onClick={() =>
                                                                window.open(bourse.link, '_blank')
                                                            }
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                background: '#059669',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.9rem',
                                                            }}
                                                        >
                                                            🔗 Voir la bourse
                                                        </button>
                                                    )}
                                                    <button
                                                        className="remove-btn"
                                                        onClick={async () => {
                                                            try {
                                                                await bourseService.removeSavedScholarship(
                                                                    bourse.id,
                                                                );
                                                                console.log(
                                                                    "✅ Bourse supprimée de l'API",
                                                                );
                                                            } catch (error) {
                                                                console.warn(
                                                                    '⚠️ Erreur suppression API:',
                                                                    error,
                                                                );
                                                            }

                                                            const updated = savedBourses.filter(
                                                                (s) => s.id !== bourse.id,
                                                            );
                                                            localStorage.setItem(
                                                                'savedScholarships',
                                                                JSON.stringify(updated),
                                                            );
                                                            setSavedBourses(updated);
                                                            setRefreshKey((prev) => prev + 1);

                                                            setSaveMessage({
                                                                id: bourse.id,
                                                                text: '🗑️ Bourse retirée des favoris',
                                                                type: 'info',
                                                            });
                                                            setTimeout(
                                                                () => setSaveMessage(null),
                                                                3000,
                                                            );
                                                        }}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            background: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem',
                                                        }}
                                                    >
                                                        Retirer
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </section>
                    )}

                    {activeMenu === 'profile' && (
                        <section>
                            <div className="section-header">
                                <h2>
                                    <IconUser /> Profil
                                </h2>
                            </div>

                            <div className="profile-form">
                                <div className="form-group">
                                    <label>Nom complet</label>
                                    <input type="text" value={userInfo.name} readOnly disabled />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={userInfo.email} readOnly disabled />
                                </div>
                            </div>

                            <div className="reports-summary">
                                <h3>
                                    <IconCheck /> Résumé
                                </h3>
                                <p>
                                    {completedAssessments.length} test(s) terminé(s),{' '}
                                    {inProgressAssessments.length} en cours,{' '}
                                    {notStartedAssessments.length} non commencé(s).
                                </p>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
