import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/orientations.css';

const IconDoc = () => (
    <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

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

const IconBar = () => (
    <svg
        width="20"
        height="20"
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

const IconWrench = ({ size = 16 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
);

const IconUsers = ({ size = 16 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const IconPhone = ({ size = 16 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-.45a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
);

const IconCalendar = ({ size = 16 }) => (
    <svg
        width={size}
        height={size}
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

const IconClipboard = ({ size = 16 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <rect x="9" y="2" width="6" height="4" rx="1" />
        <path d="M9 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2h-2" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
);

const IconHome = ({ size = 20 }) => (
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

const IconTrend = ({ size = 13 }) => (
    <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const IconBarChart = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

// Données mockées pour les scores
const MOCK_SCORES = {
    REALISTIC: 78,
    INVESTIGATIVE: 92,
    ARTISTIC: 35,
    SOCIAL: 40,
    ENTERPRISING: 70,
    CONVENTIONAL: 45,
};

// Données mockées pour les recommandations
const MOCK_RECOMMENDATIONS = {
    INVESTIGATIVE: {
        formations: [
            'Master Data Science & IA',
            'Doctorat en Physique/Chimie',
            'Ingénierie Recherche & Développement',
            'Master Biotechnologies',
        ],
        metiers: [
            'Data Scientist',
            'Chercheur en laboratoire',
            'Ingénieur R&D',
            'Analyste cybersécurité',
            'Bio-informaticien',
        ],
        ecoles: [
            'Ecole Polytechnique (X)',
            'CentraleSupelec',
            'INRIA - Institut national de recherche',
            'Université Paris-Saclay (Master IA)',
            'EPFL Lausanne - Doctorat sciences exactes',
        ],
    },
    REALISTIC: {
        formations: [
            'BTS Maintenance industrielle',
            'Licence Pro Génie Civil',
            'DUT Génie Mécanique',
        ],
        metiers: ['Ingénieur Procédés', 'Technicien de maintenance', 'Conducteur de travaux'],
        ecoles: [],
    },
};

/* ─── RADAR CHART ─── */
function RadarChart({ scores }) {
    const cx = 200,
        cy = 175,
        maxR = 130;
    const axes = [
        { label: 'Realiste (R)', angle: -90, value: scores?.REALISTIC || 0 },
        {
            label: 'Investigateur (I)',
            angle: -30,
            value: scores?.INVESTIGATIVE || 0,
        },
        { label: 'Artistique (A)', angle: 30, value: scores?.ARTISTIC || 0 },
        { label: 'Social (S)', angle: 90, value: scores?.SOCIAL || 0 },
        { label: 'Entreprenant (E)', angle: 150, value: scores?.ENTERPRISING || 0 },
        {
            label: 'Conventionnel (C)',
            angle: 210,
            value: scores?.CONVENTIONAL || 0,
        },
    ];

    const toRad = (d) => (d * Math.PI) / 180;
    const polar = (angle, r) => ({
        x: cx + r * Math.cos(toRad(angle)),
        y: cy + r * Math.sin(toRad(angle)),
    });
    const pts = (arr) => arr.map((p) => `${p.x},${p.y}`).join(' ');

    const levels = [20, 40, 60, 80, 100];

    const gridPolygons = levels.map((lvl) => {
        const points = pts(axes.map((a) => polar(a.angle, (lvl / 100) * maxR)));
        return <polygon key={lvl} points={points} fill="none" stroke="#e5e7eb" strokeWidth="1" />;
    });

    const scaleLabels = levels.map((lvl) => {
        const p = polar(-90, (lvl / 100) * maxR);
        return (
            <text
                key={lvl}
                x={p.x + 4}
                y={p.y + 4}
                fontSize="10"
                fill="#9ca3af"
                fontFamily="Inter,sans-serif"
            >
                {lvl}
            </text>
        );
    });

    const axisLines = axes.map((a, i) => {
        const end = polar(a.angle, maxR);
        return (
            <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#d1d5db" strokeWidth="1" />
        );
    });

    const axisLabels = axes.map((a, i) => {
        const p = polar(a.angle, maxR + 22);
        return (
            <text
                key={i}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#6b7280"
                fontFamily="Inter,sans-serif"
            >
                {a.label}
            </text>
        );
    });

    const dataPoints = pts(axes.map((a) => polar(a.angle, (a.value / 100) * maxR)));

    const dots = axes.map((a, i) => {
        const p = polar(a.angle, (a.value / 100) * maxR);
        return (
            <circle key={i} cx={p.x} cy={p.y} r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
        );
    });

    return (
        <div className="ria-radar-wrap">
            <svg width="400" height="360" viewBox="0 0 400 360" style={{ overflow: 'visible' }}>
                <g>{gridPolygons}</g>
                <g>{scaleLabels}</g>
                <g>{axisLines}</g>
                <polygon
                    points={dataPoints}
                    fill="rgba(13,148,136,0.18)"
                    stroke="#0d9488"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />
                <g>{axisLabels}</g>
                <g>{dots}</g>
            </svg>
            <div className="ria-radar-legend">
                <div className="ria-radar-legend-line" />
                <span>Votre profil</span>
            </div>
        </div>
    );
}

/* ─── TAB CONTENT ─── */
function TabInvestigateur({ scores, recommendations }) {
    const score = scores?.INVESTIGATIVE || 0;
    const reco = recommendations?.INVESTIGATIVE || MOCK_RECOMMENDATIONS.INVESTIGATIVE;

    return (
        <>
            <div className="ria-def-card">
                <div className="ria-def-title">
                    <IconInfo /> Definition &amp; caracteristiques
                </div>
                <p className="ria-def-text">
                    L'axe Investigateur valorise la curiosite, l'analyse, la resolution de problemes
                    abstraits. Vous aimez apprendre, observer, experimenter et comprendre le monde
                    scientifique.
                </p>
                <p className="ria-def-traits">
                    <strong>Caracteristiques :</strong> Rigueur, esprit critique, gout pour la
                    recherche, autonomie intellectuelle, preference pour les defis complexes.
                </p>
            </div>

            <div className="ria-interp-card">
                <div className="ria-interp-title">
                    <IconSearch size={16} /> Interpretation personnalisee
                </div>
                <p className="ria-interp-text">
                    Votre score ({score}/100) revele un besoin profond de comprendre les mecanismes
                    sous-jacents. Vous excellez dans les environnements ou l'on vous confie des
                    missions d'analyse, de R&amp;D ou de veille technologique.
                </p>
            </div>

            <div className="ria-def-card">
                <div className="ria-reco-title">
                    <IconGrid /> Formations &amp; metiers recommandes
                </div>
                <div className="ria-reco-grid">
                    <div>
                        <div className="ria-reco-col-label">Formations</div>
                        <div className="ria-chip-list">
                            {reco.formations?.map((f, i) => (
                                <span key={i} className="ria-chip">
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="ria-reco-col-label">Metiers</div>
                        <div className="ria-chip-list">
                            {reco.metiers?.map((m, i) => (
                                <span key={i} className={`ria-chip ${i === 0 ? 'active' : ''}`}>
                                    {m}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="ria-ecoles-title">
                    <IconHome size={18} /> Ecoles / Centres de formation
                </div>
                <div>
                    {reco.ecoles?.map((e, i) => (
                        <div className="ria-ecole-item" key={i}>
                            <span className="ria-ecole-dot" />
                            {e}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function TabRealiste({ scores, recommendations }) {
    const score = scores?.REALISTIC || 0;
    const reco = recommendations?.REALISTIC || MOCK_RECOMMENDATIONS.REALISTIC;

    return (
        <>
            <div className="ria-def-card">
                <div className="ria-def-title">
                    <IconInfo /> Definition &amp; caracteristiques
                </div>
                <p className="ria-def-text">
                    L'axe Realiste valorise l'action concrete, la manipulation d'outils, les travaux
                    manuels et techniques. Vous preferez les taches tangibles, pratiques et bien
                    definies.
                </p>
                <p className="ria-def-traits">
                    <strong>Caracteristiques :</strong> Sens pratique, habilete manuelle, gout pour
                    la technique, autonomie operationnelle, preference pour les resultats concrets.
                </p>
            </div>

            <div className="ria-interp-card">
                <div className="ria-interp-title">
                    <IconSearch size={16} /> Interpretation personnalisee
                </div>
                <p className="ria-interp-text">
                    Votre score ({score}/100) indique une forte inclination pour les environnements
                    de travail concrets. Vous vous epanouissez dans les metiers de terrain, de
                    fabrication ou d'ingenierie appliquee.
                </p>
            </div>

            <div className="ria-def-card">
                <div className="ria-reco-title">
                    <IconGrid /> Formations &amp; metiers recommandes
                </div>
                <div className="ria-reco-grid">
                    <div>
                        <div className="ria-reco-col-label">Formations</div>
                        <div className="ria-chip-list">
                            {reco.formations?.map((f, i) => (
                                <span key={i} className="ria-chip">
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="ria-reco-col-label">Metiers</div>
                        <div className="ria-chip-list">
                            {reco.metiers?.map((m, i) => (
                                <span key={i} className={`ria-chip ${i === 0 ? 'active' : ''}`}>
                                    {m}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ─── MAIN COMPONENT ─── */
export default function Orientations() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('investigative');

    // Utiliser les données mockées
    const scores = MOCK_SCORES;
    const recommendations = MOCK_RECOMMENDATIONS;
    const assessmentInfo = {
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
    };

    // Trouver les scores dominants
    const getDominantScores = () => {
        if (!scores) return [];
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        return sorted.slice(0, 3);
    };

    const dominantScores = getDominantScores();
    const topScoreValue = dominantScores[0]?.[1] || 0;
    const code = dominantScores.map(([key]) => key[0]).join('');

    return (
        <div className="ria-body">
            <div className="ria-container">
                {/* PAGE HEADER */}
                <div className="ria-page-header">
                    <div className="ria-page-header-icon">
                        <IconBarChart />
                    </div>
                    <h1>Explorateur de carrieres &mdash; Axes RIASEC</h1>
                    <span className="ria-dominant-badge">dominants detectes</span>
                </div>

                {/* HEADER RAPPORT */}
                <div className="ria-card ria-header-card">
                    <div className="orientations-header">
                        <h1>🎯 Mon rapport d'orientation RIASEC</h1>
                        <p className="report-date">
                            Test effectué le{' '}
                            {new Date().toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                        <div className="report-badge">
                            <span className="badge-code">
                                Code RIASEC: <strong>{code}</strong>
                            </span>
                            <span className="badge-status">
                                Statut:{' '}
                                {assessmentInfo?.status === 'COMPLETED'
                                    ? '✅ Terminé'
                                    : assessmentInfo?.status === 'IN_PROGRESS'
                                      ? '🔄 En cours'
                                      : '⏸️ Abandonné'}
                            </span>
                            <span className="star-icon">&#9733;</span>
                            Score global de compatibilite : <strong>{topScoreValue}%</strong>
                        </div>
                    </div>
                </div>

                {/* SECTION 1 : RESUME */}
                <section className="ria-section">
                    <div className="ria-section-label">
                        <span className="ria-section-label-icon">
                            <IconInfo />
                        </span>
                        <h2>1. Resume du test</h2>
                    </div>
                    <div className="ria-card">
                        <div className="ria-card-subtitle">
                            <IconClipboard /> Synthese de l'evaluation
                        </div>
                        <p className="ria-summary-text">
                            Test d'interets professionnels et de personnalite base sur la typologie
                            de Holland (RIASEC). Objectif : identifier vos affinites naturelles pour
                            guider vos choix de formation et metier.
                        </p>
                        <ul className="ria-stats-list">
                            <li>
                                <strong>Statut :</strong> {assessmentInfo?.status || 'COMPLETED'}
                            </li>
                            <li>
                                <strong>Coherence des reponses :</strong> Élevée
                            </li>
                            <li>
                                <strong>Axes dominants detectes :</strong>{' '}
                                {dominantScores
                                    .map(([key, val]) => {
                                        const name =
                                            key === 'INVESTIGATIVE'
                                                ? 'Investigateur'
                                                : key === 'REALISTIC'
                                                  ? 'Realiste'
                                                  : key === 'ENTERPRISING'
                                                    ? 'Entreprenant'
                                                    : key === 'SOCIAL'
                                                      ? 'Social'
                                                      : key === 'ARTISTIC'
                                                        ? 'Artistique'
                                                        : 'Conventionnel';
                                        return `${name}: ${val}/100`;
                                    })
                                    .join(' & ')}
                            </li>
                        </ul>
                    </div>
                </section>

                {/* SECTION 2 : DETAIL & OBSERVATIONS */}
                <section className="ria-section">
                    <div className="ria-section-label">
                        <span className="ria-section-label-icon">
                            <IconBar />
                        </span>
                        <h2>2. Detail &amp; observations</h2>
                    </div>
                    <div className="ria-card">
                        <div className="ria-group-title teal">
                            <span className="dot" /> Points forts identifies
                        </div>

                        <div className="ria-obs-item">
                            <div className="ria-obs-icon-box teal">
                                <IconSearch size={16} />
                            </div>
                            <div>
                                <strong>Curiosite intellectuelle :</strong> Vous aimez resoudre des
                                problemes complexes et apprendre par vous-meme.
                            </div>
                        </div>
                        <div className="ria-obs-item">
                            <div className="ria-obs-icon-box teal">
                                <IconWrench />
                            </div>
                            <div>
                                <strong>Pragmatisme :</strong> Capacite a passer a l'action et a
                                manipuler des outils concrets.
                            </div>
                        </div>

                        <div className="ria-group-title amber">
                            <span className="dot" /> Axes d'amelioration
                        </div>

                        <div className="ria-obs-item">
                            <div className="ria-obs-icon-box amber">
                                <IconUsers />
                            </div>
                            <div>
                                <strong>Travail collaboratif :</strong> Developper la collaboration
                                en equipe.
                            </div>
                        </div>

                        <div className="ria-behavioral-note">
                            <IconInfo />
                            <span>Analyse basee sur vos reponses au questionnaire RIASEC.</span>
                        </div>
                    </div>
                </section>

                {/* SECTION 3 : PROFIL HEXAGRAMME */}
                <section className="ria-section">
                    <div className="ria-section-label">
                        <span className="ria-section-label-icon">
                            <IconHome />
                        </span>
                        <h2>3. Profil utilisateur &mdash; Hexagramme RIASEC</h2>
                    </div>
                    <div className="ria-card">
                        <RadarChart scores={scores} />

                        <div className="ria-dominantes-title">Votre carte des dominantes</div>
                        <div className="ria-dominante-tags">
                            {dominantScores.map(([key, val], idx) => {
                                let colorClass = 'teal';
                                if (idx === 1) colorClass = 'gray';
                                if (idx === 2) colorClass = 'amber';
                                let icon = <IconSearch size={13} />;
                                let label = key.charAt(0) + key.slice(1).toLowerCase();
                                if (key === 'REALISTIC') {
                                    icon = <IconWrench size={13} />;
                                    label = 'Realiste';
                                }
                                if (key === 'ENTERPRISING') {
                                    icon = <IconTrend />;
                                    label = 'Entreprenant';
                                }
                                if (key === 'INVESTIGATIVE') label = 'Investigateur';
                                if (key === 'SOCIAL') label = 'Social';
                                if (key === 'ARTISTIC') label = 'Artistique';
                                if (key === 'CONVENTIONAL') label = 'Conventionnel';

                                return (
                                    <span key={key} className={`ria-dominante-tag ${colorClass}`}>
                                        {icon} {label} ({val})
                                    </span>
                                );
                            })}
                        </div>

                        <p className="ria-profile-desc">
                            Votre profil met en evidence une forte appetence pour la{' '}
                            <strong>recherche, l'analyse</strong> et les activites
                            <strong> pratiques/manuelles</strong>. Les metiers d'ingenierie, de
                            R&amp;D ou de conception technique correspondent naturellement a vos
                            aspirations.
                        </p>
                    </div>
                </section>

                {/* SECTION 4 : EXPLORATEUR */}
                <section className="ria-section">
                    <div className="ria-explorer-header">
                        <span className="ria-explorer-header-icon">
                            <IconSearch />
                        </span>
                        <h2>Explorateur de carrieres &mdash; Axes RIASEC</h2>
                    </div>

                    <div className="ria-tabs">
                        <button
                            className={`ria-tab${activeTab === 'investigative' ? ' active' : ''}`}
                            onClick={() => setActiveTab('investigative')}
                        >
                            Investigateur ({scores.INVESTIGATIVE})
                        </button>
                        <button
                            className={`ria-tab${activeTab === 'realistic' ? ' active' : ''}`}
                            onClick={() => setActiveTab('realistic')}
                        >
                            Realiste ({scores.REALISTIC})
                        </button>
                    </div>

                    {activeTab === 'investigative' && (
                        <TabInvestigateur scores={scores} recommendations={recommendations} />
                    )}
                    {activeTab === 'realistic' && (
                        <TabRealiste scores={scores} recommendations={recommendations} />
                    )}
                </section>

                {/* BOUTONS DE NAVIGATION */}
                <div className="Buttons">
                    <button 
                        className="button"
                        onClick={() => navigate('/tests')}
                    >
                        Retour
                    </button>

                    <button 
                        className="button"
                        onClick={() => navigate('/universites-formations')}
                    >
                        Voir les écoles
                    </button>
                </div>
            </div>
        </div>
    );
}