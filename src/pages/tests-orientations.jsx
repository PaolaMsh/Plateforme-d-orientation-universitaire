import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/tests-orientations.css';
import api from '../services/api';

const IconSeedling = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 2v5M12 2c-2 0-4 2-4 4v3h8V6c0-2-2-4-4-4z" />
        <path d="M12 22v-8M8 14h8" />
        <path d="M12 14c-3 0-5 2-5 4h10c0-2-2-4-5-4z" />
    </svg>
);

const IconBulb = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9.5 19.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-1.5h-5z" />
        <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6v3h8v-3c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
        <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
);

const IconTarget = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const IconBrain = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9.5 3A4.5 4.5 0 0 0 5 7.5c0 1.5.5 2.5 1.5 3.5a4 4 0 0 1 1 4c0 1.5-1 3-2.5 3.5" />
        <path d="M14.5 3A4.5 4.5 0 0 1 19 7.5c0 1.5-.5 2.5-1.5 3.5a4 4 0 0 0-1 4c0 1.5 1 3 2.5 3.5" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <path d="M8 18c-1.5-.5-2.5-2-2.5-3.5" />
        <path d="M16 18c1.5-.5 2.5-2 2.5-3.5" />
    </svg>
);

const IconMicroscope = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M10 2v8M6 6h8" />
        <path d="M16 16l-4-4M18 18l-4-4" />
        <circle cx="18" cy="18" r="4" />
    </svg>
);

const IconCheck = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconChart = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
        <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
    </svg>
);

const IconGraduation = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
);

const IconClipboard = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
);

const IconTargetSmall = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const IconEdit = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M17 3l4 4L7 21H3v-4L17 3z" />
        <line x1="9" y1="7" x2="17" y2="15" />
        <line x1="11" y1="5" x2="19" y2="13" />
    </svg>
);

const IconArrowRight = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const IconStepArrow = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const IconCheckCircle = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const IconClock = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const testOptions = [
    {
        id: 'GENERALE',
        name: 'Général',
        icon: <IconSeedling />,
        desc: 'Premiers intérêts professionnels',
        to: '/test-general',
    },
    {
        id: 'OCCUPATIONS',
        name: 'Occupations',
        icon: <IconTarget />,
        desc: 'Préférences d’activités',
        to: '/tests',
    },
    {
        id: 'APTITUDES',
        name: 'Aptitudes',
        icon: <IconBulb />,
        desc: 'Compétences et aptitudes',
        to: '/tests',
    },
    {
        id: 'PERSONALITY',
        name: 'Personnalité',
        icon: <IconBrain />,
        desc: 'Traits comportementaux',
        to: '/tests',
    },
];

const steps = [
    {
        num: '01',
        icon: <IconEdit />,
        title: 'Réponds aux questions',
        desc: "Lis chaque affirmation et choisis l'option qui te correspond le mieux. Sois honnête !",
    },
    {
        num: '02',
        icon: <IconChart />,
        title: 'Analyse RIASEC',
        desc: 'Nos algorithmes calculent tes 6 scores et identifient ton profil dominant.',
    },
    {
        num: '03',
        icon: <IconGraduation />,
        title: 'Découvre ton orientation',
        desc: 'Reçois une liste personnalisée de métiers, filières et établissements adaptés.',
    },
];

const Testsorientations = () => {
    const [stats, setStats] = useState({ totalTests: 0, avgTime: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await api.get('/tests/stats', { headers });

                if (response.data) {
                    setStats({
                        totalTests: response.data.totalTests || response.data.total || 50,
                        avgTime: response.data.avgTime || response.data.averageTime || 12,
                    });
                } else {
                    setStats({ totalTests: 50, avgTime: 12 });
                }
            } catch (error) {
                console.error('Erreur chargement stats:', error);
                setStats({ totalTests: 50, avgTime: 12 });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="to-page">
            <div className="to-hero">
                <div className="to-hero-inner">
                    <h1 className="to-hero-title">
                        Découvre la filière
                        <br />
                        <span className="to-hero-accent">qui te correspond</span>
                    </h1>
                    <p className="to-hero-sub">
                        Un test scientifique de questions pour identifier ton profil parmi 6
                        dimensions et te recommander les meilleures formations au Bénin.
                    </p>
                    <div className="to-hero-pills">
                        <span className="to-pill">
                            <IconMicroscope /> 6 dimensions
                        </span>
                        <span className="to-pill">
                            <IconCheck /> 100% gratuit
                        </span>
                    </div>
                    {!loading && (
                        <div className="to-stats">
                            <span>
                                <IconChart /> {stats.totalTests.toLocaleString()} tests déjà
                                réalisés
                            </span>
                            <span>
                                <IconClock /> Durée moyenne : {stats.avgTime} min
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="to-wrapper">
                <div className="to-section-label">Comment souhaitez-vous passer le test ?</div>

                <div className="to-cards">
                    <div className="to-card to-card--featured">
                        <div className="to-card-badge">Recommandé</div>

                        <h2 className="to-card-title">Test complet</h2>
                        <p className="to-card-desc">
                            Enchaînez les 4 tests en une seule session pour obtenir un profil RIASEC
                            complet et des recommandations précises.
                        </p>
                        <ul className="to-card-features">
                            <li>
                                <IconCheckCircle /> Général, occupations, aptitudes et personnalité
                            </li>
                            <li>
                                <IconCheckCircle /> Profil détaillé sur 6 dimensions
                            </li>
                            <li>
                                <IconCheckCircle /> Métiers et formations personnalisés
                            </li>
                            <li>
                                <IconCheckCircle /> Rapport imprimable
                            </li>
                        </ul>
                        <Link
                            to="/tests"
                            state={{ mode: 'full' }}
                            className="to-btn to-btn--primary"
                        >
                            Commencer le test complet →
                        </Link>
                    </div>

                    <div className="to-card">
                        <h2 className="to-card-title">Choisir un test</h2>
                        <p className="to-card-desc">
                            Explorez une dimension spécifique du test si vous souhaitez approfondir
                            un aspect particulier de votre profil.
                        </p>
                        <div className="to-tests-grid">
                            {testOptions.map((option) => (
                                <Link
                                    key={option.id}
                                    to={option.to}
                                    state={
                                        option.id === 'GENERALE'
                                            ? undefined
                                            : { mode: 'single', testType: option.id }
                                    }
                                    className="to-test-btn"
                                >
                                    <span className="to-test-icon">{option.icon}</span>
                                    <span className="to-test-info">
                                        <span className="to-category-name">{option.name}</span>
                                        <span className="to-test-sub">{option.desc}</span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="to-how">
                    <div className="to-how-title">Comment ça marche ?</div>
                    <div className="to-steps">
                        {steps.map((s, i) => (
                            <div key={i} className="to-step">
                                <div className="to-step-num">{s.num}</div>
                                <div className="to-step-icon">{s.icon}</div>
                                <h3 className="to-step-title">{s.title}</h3>
                                <p className="to-step-desc">{s.desc}</p>
                                {i < steps.length - 1 && (
                                    <div className="to-step-arrow">
                                        <IconStepArrow />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testsorientations;
