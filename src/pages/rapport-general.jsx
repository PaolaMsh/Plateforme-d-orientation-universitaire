import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/orientations.css';
import { recommendationService } from '../services/recommendationService';
import api from '../services/api';
import { getRiasecCode } from '../utils/riasec';

const IconInfo = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

const IconSearch = ({ size = 20 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const IconGrid = ({ size = 18 }) => (
    <svg
        width={size}
        height={size}
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

const IconHome = ({ size = 18 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

function RapportGeneral() {
    const navigate = useNavigate();
    const location = useLocation();

    const [rapportData, setRapportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendations, setRecommendations] = useState({
        formations: [],
        metiers: [],
        ecoles: [],
    });

    const fetchRecommendations = async (id, riasecCode) => {
        try {
            const code = riasecCode || getRiasecCode(rapportData) || 'IND';
            const leadingLetter = String(code).charAt(0).toUpperCase();

            console.log('📊 Code RIASEC:', code);
            console.log('📊 Première lettre (axe dominant):', leadingLetter);

            // ✅ UTILISER LA NOUVELLE MÉTHODE AVEC PRIORITÉ BASE DE DONNÉES
            const recoData = await recommendationService.getRiasecRecommendationsWithDB(
                id,
                leadingLetter,
            );
            console.log('📊 Recommandations reçues:', recoData);

            // Mapping des axes
            const axisMapping = {
                R: 'REALISTIC',
                I: 'INVESTIGATIVE',
                A: 'ARTISTIC',
                S: 'SOCIAL',
                E: 'ENTERPRISING',
                C: 'CONVENTIONAL',
            };
            const dominantAxis = axisMapping[leadingLetter] || 'INVESTIGATIVE';

            // Vérifier que l'axe existe
            const axisRecos = recoData.recommendationsByAxis?.[dominantAxis] || {
                formations: ['Information non disponible'],
                metiers: ['Information non disponible'],
                ecoles: ['Information non disponible'],
            };

            setRecommendations({
                formations: axisRecos.formations || ['Aucune formation disponible'],
                metiers: axisRecos.metiers || ['Aucun métier disponible'],
                ecoles: axisRecos.ecoles || ['Aucune école disponible'],
            });
        } catch (err) {
            console.error('❌ Erreur chargement recommandations:', err);

            // ✅ AFFICHER UN MESSAGE CLAIR
            if (err.response?.status === 401) {
                setRecommendations({
                    formations: ['🔒 Veuillez vous reconnecter'],
                    metiers: ['🔒 Veuillez vous reconnecter'],
                    ecoles: ['🔒 Veuillez vous reconnecter'],
                });
            } else if (err.response?.status === 429) {
                setRecommendations({
                    formations: ['⏳ Trop de requêtes - Réessayez plus tard'],
                    metiers: ['⏳ Trop de requêtes - Réessayez plus tard'],
                    ecoles: ['⏳ Trop de requêtes - Réessayez plus tard'],
                });
            } else {
                setRecommendations({
                    formations: ['Information non disponible'],
                    metiers: ['Information non disponible'],
                    ecoles: ['Information non disponible'],
                });
            }
        }
    };

    // ============ CHARGEMENT DES DONNÉES ============
    useEffect(() => {
        const fetchRapport = async () => {
            try {
                setLoading(true);

                // 1. Vérifier les données dans location.state
                const stateResults = location.state?.assessmentResults;
                if (stateResults) {
                    console.log('📦 Données chargées depuis location.state');
                    setRapportData(stateResults);
                    const id = stateResults.assessmentId;
                    await fetchRecommendations(id, getRiasecCode(stateResults));
                    setLoading(false);
                    return;
                }

                // 2. Vérifier les données dans localStorage
                const storedReport = localStorage.getItem('general_report_data');
                if (storedReport) {
                    console.log('📦 Données chargées depuis localStorage');
                    const parsed = JSON.parse(storedReport);
                    setRapportData(parsed);
                    const id = parsed.assessmentId;
                    await fetchRecommendations(id, getRiasecCode(parsed));
                    setLoading(false);
                    return;
                }

                // 3. Récupérer depuis l'API
                const assessmentIdFromState =
                    location.state?.assessmentId || localStorage.getItem('assessment_id');
                if (!assessmentIdFromState) {
                    setError('Identifiant de test non trouvé');
                    setLoading(false);
                    return;
                }

                console.log("🔍 Récupération des données depuis l'API...");
                const response = await api.get(`/results/by-assessment/${assessmentIdFromState}`);

                const data = response?.data;
                setRapportData(data);
                await fetchRecommendations(assessmentIdFromState, getRiasecCode(data));
            } catch (err) {
                console.error('❌ Erreur lors du chargement du rapport:', err);
                setError(err.message || 'Erreur lors du chargement du rapport');
            } finally {
                setLoading(false);
            }
        };

        fetchRapport();
    }, [location.state]);

    // ✅ Nouveau test (avec nettoyage complet)
    const handleNewTest = () => {
        // Supprimer toutes les données temporaires du test général.
        localStorage.removeItem('general_report_data');
        localStorage.removeItem('general_assessment_id');
        localStorage.removeItem('general_session_token');
        localStorage.removeItem('assessment_id');
        localStorage.removeItem('session_token');

        // Naviguer vers un nouveau test général.
        navigate('/test-general', {
            state: {
                newTest: true,
                category: 'GENERALE',
            },
        });
    };

    // ✅ Voir les écoles / formations
    const handleViewSchools = () => {
        navigate('/universites-formations');
    };

    // ============ AFFICHAGE CHARGEMENT ============
    if (loading) {
        return (
            <div className="ori-page">
                <div className="ori-wrapper">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <div className="spinner"></div>
                        <p style={{ marginTop: '20px' }}>Calcul de votre rapport général...</p>
                    </div>
                </div>
            </div>
        );
    }

    // ============ AFFICHAGE ERREUR ============
    if (error) {
        return (
            <div className="ori-page">
                <div className="ori-wrapper">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p style={{ color: '#dc2626', marginBottom: '20px' }}>❌ Erreur: {error}</p>
                        <button onClick={() => navigate('/tests-orientations')} className="button">
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============ AUCUNE DONNÉE ============
    if (!rapportData) {
        return (
            <div className="ori-page">
                <div className="ori-wrapper">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p>Aucune donnée disponible pour ce test.</p>
                        <button
                            onClick={() => navigate('/tests-orientations')}
                            className="button"
                            style={{ marginTop: '20px' }}
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============ PRÉPARATION DES DONNÉES ============
    const riasecCode = getRiasecCode(rapportData) || 'IND';

    const axisFromCode = {
        R: { code: 'REALISTIC', label: 'Réaliste' },
        I: { code: 'INVESTIGATIVE', label: 'Investigateur' },
        A: { code: 'ARTISTIC', label: 'Artistique' },
        S: { code: 'SOCIAL', label: 'Social' },
        E: { code: 'ENTERPRISING', label: 'Entreprenant' },
        C: { code: 'CONVENTIONAL', label: 'Conventionnel' },
    };

    const leadingLetter = String(riasecCode).charAt(0).toUpperCase();
    const fallbackAxis = axisFromCode[leadingLetter] || axisFromCode.I;

    const primaryAxis = rapportData.primaryAxis || {
        ...fallbackAxis,
        score: 100,
    };

    // ============ DÉFINITIONS DES AXES ============
    const definitions = {
        REALISTIC: {
            text: "L'axe Réaliste valorise l'action concrète, la manipulation d'outils, les travaux manuels et techniques. Vous préférez les tâches tangibles, pratiques et bien définies.",
            traits: 'Sens pratique, habileté manuelle, goût pour la technique, autonomie opérationnelle, préférence pour les résultats concrets.',
        },
        INVESTIGATIVE: {
            text: "L'axe Investigateur valorise la curiosité, l'analyse, la résolution de problèmes abstraits. Vous aimez apprendre, observer, expérimenter et comprendre le monde scientifique.",
            traits: 'Rigueur, esprit critique, goût pour la recherche, autonomie intellectuelle, préférence pour les défis complexes.',
        },
        ARTISTIC: {
            text: "L'axe Artistique valorise la créativité, l'expression personnelle et l'innovation. Vous aimez créer, imaginer et vous exprimer à travers différents médiums.",
            traits: 'Créativité, sensibilité, originalité, indépendance, préférence pour les environnements non structurés.',
        },
        SOCIAL: {
            text: "L'axe Social valorise l'aide aux autres, l'éducation et le relationnel. Vous aimez collaborer, enseigner et soutenir les personnes.",
            traits: 'Empathie, patience, sens du service, communication, préférence pour le travail en équipe.',
        },
        ENTERPRISING: {
            text: "L'axe Entreprenant valorise le leadership, la persuasion et la prise de risques. Vous aimez convaincre, diriger et atteindre des objectifs.",
            traits: 'Leadership, persuasion, ambition, énergie, préférence pour les défis commerciaux.',
        },
        CONVENTIONAL: {
            text: "L'axe Conventionnel valorise l'organisation, la précision et le respect des règles. Vous aimez structurer, classer et suivre des procédures.",
            traits: 'Organisation, fiabilité, précision, rigueur, préférence pour les tâches administratives.',
        },
    };

    const def = definitions[primaryAxis.code] || definitions.INVESTIGATIVE;

    // ============ RENDU ============
    return (
        <div className="ori-page">
            <div className="ori-wrapper">
                {/* ===== EN-TÊTE ===== */}
                <div className="ori-header">
                    <div className="ori-header-content">
                        <div className="ori-logo-section">
                            <h1 className="orientations-header" style={{ marginTop: '7rem' }}>
                                Votre rapport général
                            </h1>
                        </div>
                    </div>
                </div>

                {/* ===== PROFIL DOMINANT ===== */}
                <div
                    style={{
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'row',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                        marginBottom: '2rem',
                        marginTop: '2rem',
                    }}
                    className="ria-hero-section"
                >
                    <div className="ria-section-header">
                        <strong style={{ marginRight: '1rem' }} className="ria-section-title">
                            Votre Profil Dominant
                        </strong>
                    </div>

                    <div
                        style={{ display: 'flex', flexDirection: 'row', marginRight: '1rem' }}
                        className="ria-hero-card"
                    >
                        <div style={{ marginRight: '1rem' }} className="ria-hero-score">
                            {primaryAxis.label || 'Non déterminé'}
                        </div>
                        <div className="ria-hero-value">{primaryAxis.score || 0}/100</div>
                    </div>
                </div>

                {/* ===== DÉFINITION ===== */}
                <div className="ria-def-card">
                    <div className="ria-def-title">
                        <IconInfo /> Définition &amp; caractéristiques
                    </div>
                    <p className="ria-def-text">{def.text}</p>
                    <p className="ria-def-traits">
                        <strong>Caractéristiques :</strong> {def.traits}
                    </p>
                </div>

                {/* ===== INTERPRÉTATION ===== */}
                <div className="ria-interp-card">
                    <div className="ria-interp-title">
                        <IconSearch size={16} /> Interprétation personnalisée
                    </div>
                    <p className="ria-interp-text">
                        Votre score ({primaryAxis.score}/100) indique une forte affinité avec l'axe{' '}
                        {primaryAxis.label}. Vous vous épanouissez dans les environnements qui
                        valorisent
                        {primaryAxis.label === 'Réaliste'
                            ? " l'action concrète et les résultats tangibles"
                            : primaryAxis.label === 'Entreprenant'
                              ? " le leadership et la prise d'initiative"
                              : primaryAxis.label === 'Investigateur'
                                ? " l'analyse et la résolution de problèmes"
                                : primaryAxis.label === 'Artistique'
                                  ? " la créativité et l'expression personnelle"
                                  : primaryAxis.label === 'Social'
                                    ? " l'aide aux autres et la collaboration"
                                    : " l'organisation et la précision"}
                        .
                    </p>
                </div>

                {/* ===== RECOMMANDATIONS ===== */}
                <div className="ria-def-card">
                    <div className="ria-reco-title">
                        <IconGrid /> Formations, Métiers &amp; Écoles recommandés
                    </div>
                    <div className="ria-reco-grid">
                        {/* Formations */}
                        <div>
                            <div className="ria-reco-col-label">
                                <IconHome size={16} /> Formations
                            </div>
                            <div className="ria-chip-list">
                                {recommendations.formations.length > 0 ? (
                                    recommendations.formations.map((f, i) => (
                                        <span key={i} className="ria-chip">
                                            {f}
                                        </span>
                                    ))
                                ) : (
                                    <span className="ria-chip">Aucune formation disponible</span>
                                )}
                            </div>
                        </div>

                        {/* Métiers */}
                        <div>
                            <div className="ria-reco-col-label">
                                <IconSearch size={16} /> Métiers
                            </div>
                            <div className="ria-chip-list">
                                {recommendations.metiers.length > 0 ? (
                                    recommendations.metiers.map((m, i) => (
                                        <span key={i} className="ria-chip">
                                            {m}
                                        </span>
                                    ))
                                ) : (
                                    <span className="ria-chip">Aucun métier disponible</span>
                                )}
                            </div>
                        </div>

                        {/* Écoles */}
                        <div>
                            <div className="ria-reco-col-label">
                                <IconHome size={16} /> Écoles
                            </div>
                            <div className="ria-chip-list">
                                {recommendations.ecoles.length > 0 ? (
                                    recommendations.ecoles.map((e, i) => (
                                        <span key={i} className="ria-chip">
                                            {e}
                                        </span>
                                    ))
                                ) : (
                                    <span className="ria-chip">Aucune école disponible</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== BOUTONS D'ACTION ===== */}
                <div
                    className="Buttons"
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        marginTop: '2rem',
                        justifyContent: 'center',
                    }}
                >
                    {/* ✅ Nouveau test (avec nettoyage) */}
                    <button className="button" onClick={handleNewTest}>
                        Nouveau test
                    </button>

                    {/* ✅ Voir les écoles */}
                    <button className="button button-outline" onClick={handleViewSchools}>
                        Voir les écoles
                    </button>
                </div>

                {/* ===== INFORMATION ===== */}
                <div
                    style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        color: '#6b7280',
                    }}
                ></div>
            </div>
        </div>
    );
}

export default RapportGeneral;
