import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/tests.css';
import api from '../services/api';
import { FULL_TEST_CATEGORIES, TEST_TYPES } from '../utils/riasec';

const EmotionSvgs = {
    sad: (
        <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
            <circle cx="8" cy="9" r="1" fill="currentColor" />
            <circle cx="16" cy="9" r="1" fill="currentColor" />
            <path d="M8 15 Q12 11 16 15" stroke="currentColor" fill="none" strokeLinecap="round" />
        </svg>
    ),
    neutral: (
        <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
            <circle cx="8" cy="9" r="1" fill="currentColor" />
            <circle cx="16" cy="9" r="1" fill="currentColor" />
            <line x1="8" y1="15" x2="16" y2="15" stroke="currentColor" strokeLinecap="round" />
        </svg>
    ),
    happy: (
        <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
            <circle cx="8" cy="9" r="1" fill="currentColor" />
            <circle cx="16" cy="9" r="1" fill="currentColor" />
            <path d="M8 14 Q12 18 16 14" stroke="currentColor" fill="none" strokeLinecap="round" />
        </svg>
    ),
};

const SectionSvgs = {
    realist: (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 17L12 22L20 17M4 12L12 17L20 12M12 2L4 7L12 12L20 7L12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    ),
    investigator: (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    artistic: (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 4V20M8 8L16 16M8 16L16 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
    ),
};

const CATEGORY = [
    {
        name: 'GENERALE',
        label: 'Général',
        icon: SectionSvgs.realist,
        description: 'Première évaluation de vos intérêts professionnels',
        help: 'Imaginez-vous en train de faire chaque activité. Choisissez votre réponse selon ce qui vous attire naturellement, même si vous ne l’avez jamais essayé.',
    },
    {
        name: 'OCCUPATIONS',
        label: 'Occupations',
        icon: SectionSvgs.realist,
        description: 'Préférences pour les activités professionnelles',
        help: 'Imaginez-vous exercer chaque métier au quotidien. Répondez selon l’envie que ce métier pourrait vous donner, sans penser à vos études ou à votre expérience actuelle.',
    },
    {
        name: 'APTITUDES',
        label: 'Aptitudes',
        icon: SectionSvgs.investigator,
        description: 'Compétences et niveaux de maîtrise',
        help: 'Évaluez votre niveau actuel, et non votre potentiel. Pour chaque aptitude, choisissez : Faible, Moyen ou Fort.',
    },
    {
        name: 'PERSONALITY',
        label: 'Personnalité',
        icon: SectionSvgs.artistic,
        description: 'Traits comportementaux et préférences',
        help: 'Pensez à votre manière habituelle d’être et d’agir. Indiquez si chaque affirmation vous correspond réellement, même si vous aimeriez parfois être différent.',
    },
];

const BATCH_SIZE = 6;
const ACTIVE_TEST_STORAGE = {
    sessionToken: 'session_token',
    assessmentId: 'assessment_id',
    testType: 'assessment_test_type',
    currentCategory: 'assessment_current_category',
    flowVersion: 'assessment_flow_version',
};
const ACTIVE_TEST_FLOW_VERSION = 'full-starts-generale-v1';

const clearActiveAssessmentStorage = () => {
    localStorage.removeItem(ACTIVE_TEST_STORAGE.sessionToken);
    localStorage.removeItem(ACTIVE_TEST_STORAGE.assessmentId);
    localStorage.removeItem(ACTIVE_TEST_STORAGE.testType);
    localStorage.removeItem(ACTIVE_TEST_STORAGE.currentCategory);
    localStorage.removeItem(ACTIVE_TEST_STORAGE.flowVersion);
};

const saveActiveAssessmentStorage = ({ sessionToken, assessmentId, testType, currentCategory }) => {
    localStorage.setItem(ACTIVE_TEST_STORAGE.sessionToken, sessionToken);
    localStorage.setItem(ACTIVE_TEST_STORAGE.assessmentId, assessmentId);
    localStorage.setItem(ACTIVE_TEST_STORAGE.testType, testType);
    localStorage.setItem(ACTIVE_TEST_STORAGE.flowVersion, ACTIVE_TEST_FLOW_VERSION);
    if (currentCategory) {
        localStorage.setItem(ACTIVE_TEST_STORAGE.currentCategory, currentCategory);
    }
};

const Spinner = ({ size = 40, color = '#6246E5' }) => (
    <div className="spinner-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div
            className="spinner"
            style={{
                width: size,
                height: size,
                border: `3px solid ${color}20`,
                borderTopColor: color,
            }}
        />
    </div>
);

const Loader = () => (
    <div className="loader" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner"></div>
    </div>
);

const ErrorView = ({ message, onRetry }) => (
    <div className="error-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="error-message" style={{ color: 'red', marginBottom: '20px' }}>
            <strong>Erreur :</strong> {message}
        </div>
        <button
            onClick={onRetry}
            style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#6246E5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
            }}
        >
            Réessayer
        </button>
    </div>
);

const EmptyView = ({ onReload }) => (
    <div className="error-container" style={{ textAlign: 'center', padding: '50px' }}>
        <p>Aucune question disponible</p>
        <button onClick={onReload} className="submit-btn">
            Recharger
        </button>
    </div>
);

const ProgressHeader = ({ currentCategory, completionPercentage, draftCount, batchSize }) => {
    const section = CATEGORY.find((s) => s.name === currentCategory);
    return (
        <div className="test-header">
            <div className="logo-section">
                <span className="logos-text">RIASEC Profiler</span>
            </div>
            <div className="progress-section">
                <div className="category-indicator">
                    <span className="category-name">{section.label}</span>&nbsp;
                    <span className="category-desc">
                        {section?.description || 'Évaluation approfondie'}
                    </span>
                </div>
                <div className="progress-stats">
                    <span>
                        {draftCount}/{batchSize} questions répondues
                    </span>
                    <span>{Math.round(completionPercentage)}%</span>
                </div>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

const QuestionCard = ({ question, value, onAnswer }) => {
    const getOptions = () => {
        if (question.category === 'APTITUDES') {
            return [
                { value: 1, label: 'Faible', emoji: EmotionSvgs.sad },
                { value: 2, label: 'Moyen', emoji: EmotionSvgs.neutral },
                { value: 3, label: 'Fort', emoji: EmotionSvgs.happy },
            ];
        }

        return [
            { value: 0, label: 'Non', emoji: EmotionSvgs.sad },
            { value: 1, label: 'Oui', emoji: EmotionSvgs.happy },
        ];
    };

    const options = getOptions();

    return (
        <div className={`question-card ${value !== undefined ? 'answered' : ''}`}>
            <h3 className="question-text">{question.text}</h3>
            {question.subtext && <p className="question-subtext">{question.subtext}</p>}
            <div className="emotion-slider">
                <div className="slider-options">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            className={`emotion-btn ${value === opt.value ? 'active' : ''}`}
                            onClick={() => onAnswer(question.id, opt.value)}
                        >
                            <div className="emotion-svg">{opt.emoji}</div>
                            <span className="emotion-label">{opt.label}</span>
                            {value === opt.value && <span className="check-mark">✓</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const formatQuestions = (data, category) =>
    data.map((q) => {
        const base = {
            id: q.id,
            text: q.text,
            riasecType: q.riasecType,
            subtext: q.subtext || null,
            pointsValue: q.pointsValue || 1,
            category: q.category || category,
        };
        return {
            ...base,
            sectionType: q.sectionType,
            minValue: category === 'APTITUDES' ? q.minValue || 1 : (q.minValue ?? 0),
            maxValue: category === 'APTITUDES' ? q.maxValue || 3 : 1,
            valueLabels:
                q.valueLabels ||
                (category === 'APTITUDES'
                    ? [
                          'Faible',
                          { emoji: EmotionSvgs.neutral, label: 'Moyen' },
                          { emoji: EmotionSvgs.happy, label: 'Fort' },
                      ]
                    : ['Oui', 'Non']),
        };
    });

const Test = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const requestedTestType = location.state?.testType;
    const selectedCategories = useMemo(
        () =>
            FULL_TEST_CATEGORIES.includes(requestedTestType)
                ? [requestedTestType]
                : FULL_TEST_CATEGORIES,
        [requestedTestType],
    );
    const initialTestType =
        selectedCategories.length === 1 ? selectedCategories[0] : TEST_TYPES.FULL;

    const [currentCategory, setCurrentCategory] = useState(selectedCategories[0]);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [sessionToken, setSessionToken] = useState(null);
    const [assessmentId, setAssessmentId] = useState(null);

    const [currentBatch, setCurrentBatch] = useState([]);
    const [draftAnswers, setDraftAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [loadingBatch, setLoadingBatch] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completedCategories, setCompletedCategories] = useState({});

    const [batchHistory, setBatchHistory] = useState([]);
    const [savedAnswersHistory, setSavedAnswersHistory] = useState([]);
    const [hasUsedPrevious, setHasUsedPrevious] = useState(false);

    const initializeSession = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Veuillez vous connecter pour passer le test');
                return null;
            }
            const existingSessionToken = localStorage.getItem(ACTIVE_TEST_STORAGE.sessionToken);
            const existingAssessmentId = localStorage.getItem(ACTIVE_TEST_STORAGE.assessmentId);
            const existingTestType = localStorage.getItem(ACTIVE_TEST_STORAGE.testType);
            const existingCurrentCategory = localStorage.getItem(
                ACTIVE_TEST_STORAGE.currentCategory,
            );
            const existingFlowVersion = localStorage.getItem(ACTIVE_TEST_STORAGE.flowVersion);
            if (
                existingSessionToken &&
                existingAssessmentId &&
                existingTestType === initialTestType &&
                existingFlowVersion === ACTIVE_TEST_FLOW_VERSION
            ) {
                return {
                    sessionToken: existingSessionToken,
                    assessmentId: existingAssessmentId,
                    currentCategory: existingCurrentCategory || selectedCategories[0],
                };
            }

            if (existingSessionToken || existingAssessmentId || existingTestType) {
                clearActiveAssessmentStorage();
            }

            const response = await api.post('/sessions', {
                testVersionId: 1,
                initialTestType,
                depth: 5,
                profile: {
                    startedAt: new Date().toISOString(),
                    mode: initialTestType === TEST_TYPES.FULL ? 'full' : 'category',
                    testType: initialTestType,
                },
            });
            if (response?.data) {
                const newSessionToken = response.data.sessionToken;
                const newAssessmentId = response.data.assessment.id;
                saveActiveAssessmentStorage({
                    sessionToken: newSessionToken,
                    assessmentId: newAssessmentId,
                    testType: initialTestType,
                    currentCategory: selectedCategories[0],
                });
                return {
                    sessionToken: newSessionToken,
                    assessmentId: newAssessmentId,
                    currentCategory: selectedCategories[0],
                };
            }
            throw new Error("Erreur lors de l'initialisation");
        } catch (err) {
            setError(err.response?.data?.message || "Impossible d'initialiser le test");
            return null;
        }
    }, [initialTestType, selectedCategories]);

    const resolveProgress = useCallback(
        async (token, assessmentIdParam) => {
            try {
                if (!token || token === 'null')
                    return {
                        status: 'IN_PROGRESS',
                        currentCategory: selectedCategories[0],
                    };
                const progressResponse = await api.get(
                    `/assessments/${assessmentIdParam}/progress`,
                    {
                        params: { sessionToken: token },
                    },
                );
                const progressData = progressResponse.data;
                setCompletionPercentage(progressData.completionPercentage || 0);
                return progressData;
            } catch {
                return {
                    status: 'IN_PROGRESS',
                    currentCategory: selectedCategories[0],
                };
            }
        },
        [selectedCategories],
    );

    const fetchBatch = useCallback(
        async (category, tokenParam = null, assessmentIdParam = null, options = {}) => {
            setLoadingBatch(true);
            const tokenToUse = tokenParam || sessionToken;
            const assessmentIdToUse = assessmentIdParam || assessmentId;

            try {
                const response = await api.get('/questions/category', {
                    params: {
                        sessionToken: tokenToUse,
                        assessmentId: assessmentIdToUse,
                        currentCategory: category,
                        lang: 'fr',
                        take: BATCH_SIZE,
                    },
                });

                if (response?.data && response.data.length > 0) {
                    const formatted = formatQuestions(response.data, category);
                    setCurrentCategory(category);
                    setCurrentBatch(formatted);
                    setDraftAnswers({});
                    saveActiveAssessmentStorage({
                        sessionToken: tokenToUse,
                        assessmentId: assessmentIdToUse,
                        testType: initialTestType,
                        currentCategory: category,
                    });
                    return true;
                }
                if (!options.allowEmpty) setError('Aucune donnée reçue');
                return false;
            } catch (err) {
                console.error('Fetch batch error:', err);
                if (!options.allowEmpty) {
                    setError(err.response?.data?.message || 'Impossible de charger les questions');
                }
                return false;
            } finally {
                setLoadingBatch(false);
            }
        },
        [sessionToken, assessmentId, initialTestType],
    );

    const submitBatch = useCallback(async () => {
        if (Object.keys(draftAnswers).length !== currentBatch.length) {
            const remaining = currentBatch.length - Object.keys(draftAnswers).length;
            alert(`Veuillez répondre à toutes les questions (${remaining} restantes)`);
            return null;
        }
        setSubmitting(true);
        try {
            const payload = {
                sessionToken,
                assessmentId,
                responses: Object.entries(draftAnswers).map(([questionId, answer]) => ({
                    questionId: Number(questionId),
                    responseValue:
                        currentCategory === TEST_TYPES.APTITUDES
                            ? Math.min(3, Math.max(1, Number(answer.value)))
                            : Number(answer.value) === 0
                              ? 0
                              : 1,
                })),
            };
            await api.post('/responses/category', payload);

            setDraftAnswers({});
            const updatedProgress = await resolveProgress(sessionToken, assessmentId);
            return updatedProgress;
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || 'Impossible de soumettre les réponses');
            return null;
        } finally {
            setSubmitting(false);
        }
    }, [draftAnswers, currentBatch, currentCategory, sessionToken, assessmentId, resolveProgress]);

    const handlePreviousBatch = useCallback(async () => {
        if (batchHistory.length === 0) {
            const shouldReload = window.confirm(
                'Vous êtes au début du test. Voulez-vous recharger les questions ?',
            );
            if (shouldReload) {
                await fetchBatch(currentCategory, sessionToken, assessmentId);
            }
            return;
        }

        setHasUsedPrevious(true);

        const previousBatchData = batchHistory[batchHistory.length - 1];
        const previousAnswers = savedAnswersHistory[savedAnswersHistory.length - 1];

        setBatchHistory((prev) => prev.slice(0, -1));
        setSavedAnswersHistory((prev) => prev.slice(0, -1));

        setCurrentBatch(previousBatchData.questions);
        setDraftAnswers(previousAnswers || {});

        setCurrentCategory(previousBatchData.category);
    }, [
        batchHistory,
        savedAnswersHistory,
        currentCategory,
        sessionToken,
        assessmentId,
        fetchBatch,
    ]);

    const handleAssessmentCompletion = useCallback(async () => {
        try {
            console.log('📤 Envoi des résultats au serveur...');
            await api.post('/results/compute', { sessionToken, assessmentId });

            console.log('✅ Résultats calculés avec succès');
            console.log('🆔 AssessmentId:', assessmentId);

            localStorage.setItem(ACTIVE_TEST_STORAGE.assessmentId, assessmentId);

            console.log('🔀 Redirection vers /orientations');
            navigate('/orientations');
        } catch (err) {
            console.error('❌ Erreur finalisation:', err);
            if (err.response?.status === 400) {
                localStorage.setItem(ACTIVE_TEST_STORAGE.assessmentId, assessmentId);
                navigate('/orientations');
            } else {
                setError('Impossible de finaliser le test');
            }
        }
    }, [sessionToken, assessmentId, navigate]);

    const handleManualNextBatch = useCallback(async () => {
        if (Object.keys(draftAnswers).length !== currentBatch.length) {
            const remaining = currentBatch.length - Object.keys(draftAnswers).length;
            alert(
                `Veuillez répondre à toutes les questions avant de continuer (${remaining} restante${remaining > 1 ? 's' : ''})`,
            );
            return;
        }

        setBatchHistory((prev) => [
            ...prev,
            {
                batchId: Date.now(),
                category: currentCategory,
                questions: [...currentBatch],
            },
        ]);
        setSavedAnswersHistory((prev) => [...prev, { ...draftAnswers }]);

        const progressData = await submitBatch();
        if (!progressData) return;

        setHasUsedPrevious(false);

        const currentIndex = selectedCategories.indexOf(currentCategory);
        const isLastCategory = currentIndex === selectedCategories.length - 1;

        if (progressData.status === 'COMPLETED' && isLastCategory) {
            handleAssessmentCompletion();
            return;
        }

        const sameCategoryHasQuestions = await fetchBatch(
            currentCategory,
            sessionToken,
            assessmentId,
            {
                allowEmpty: true,
            },
        );
        if (sameCategoryHasQuestions) return;

        setCompletedCategories((prev) => ({ ...prev, [currentCategory]: true }));
        const remainingCategories = selectedCategories.slice(currentIndex + 1);
        for (const category of remainingCategories) {
            const hasQuestions = await fetchBatch(category, sessionToken, assessmentId, {
                allowEmpty: true,
            });
            if (hasQuestions) return;
            setCompletedCategories((prev) => ({ ...prev, [category]: true }));
        }

        handleAssessmentCompletion();
    }, [
        currentCategory,
        selectedCategories,
        fetchBatch,
        submitBatch,
        sessionToken,
        assessmentId,
        currentBatch,
        draftAnswers,
        handleAssessmentCompletion,
    ]);

    useEffect(() => {
        const loadAssessment = async () => {
            setLoading(true);
            setError(null);
            try {
                const sessionData = await initializeSession();
                if (!sessionData) {
                    setLoading(false);
                    return;
                }
                setSessionToken(sessionData.sessionToken);
                setAssessmentId(sessionData.assessmentId);
                const progressData = await resolveProgress(
                    sessionData.sessionToken,
                    sessionData.assessmentId,
                );
                if (progressData.status === 'COMPLETED') {
                    console.log("⚠️ Test déjà terminé, création d'un nouveau...");

                    clearActiveAssessmentStorage();

                    const newSession = await initializeSession();
                    if (newSession) {
                        setSessionToken(newSession.sessionToken);
                        setAssessmentId(newSession.assessmentId);

                        await resolveProgress(newSession.sessionToken, newSession.assessmentId);

                        await fetchBatch(
                            selectedCategories[0],
                            newSession.sessionToken,
                            newSession.assessmentId,
                        );
                        setLoading(false);
                        return;
                    }
                }

                const categoryToLoad = sessionData.currentCategory || selectedCategories[0];
                await fetchBatch(
                    categoryToLoad,
                    sessionData.sessionToken,
                    sessionData.assessmentId,
                );
            } catch (err) {
                console.error('Load assessment error:', err);
                setError(err.message || "Impossible de charger l'évaluation");
            } finally {
                setLoading(false);
            }
        };
        loadAssessment();
    }, [initializeSession, resolveProgress, fetchBatch, selectedCategories, initialTestType]);

    const handleAnswer = useCallback((questionId, value) => {
        setDraftAnswers((prev) => ({ ...prev, [questionId]: { value } }));
    }, []);

    const allAnswered =
        currentBatch.length > 0 && Object.keys(draftAnswers).length === currentBatch.length;

    useEffect(() => {
        if (
            allAnswered &&
            !submitting &&
            !loadingBatch &&
            currentBatch.length > 0 &&
            !hasUsedPrevious
        ) {
            const timer = setTimeout(() => {
                handleManualNextBatch();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [
        allAnswered,
        submitting,
        loadingBatch,
        currentBatch.length,
        hasUsedPrevious,
        handleManualNextBatch,
    ]);

    if (loading)
        return (
            <div className="test-page">
                <div className="test-container">
                    <Loader />
                </div>
            </div>
        );

    if (error)
        return (
            <div className="test-page">
                <div className="test-container">
                    <ErrorView message={error} onRetry={() => window.location.reload()} />
                </div>
            </div>
        );

    if (currentBatch.length === 0)
        return (
            <div className="test-page">
                <div className="test-container">
                    <EmptyView onReload={() => window.location.reload()} />
                </div>
            </div>
        );

    return (
        <div className="test-page">
            <div className="test-container">
                <ProgressHeader
                    currentCategory={currentCategory}
                    completionPercentage={completionPercentage}
                    draftCount={Object.keys(draftAnswers).length}
                    batchSize={currentBatch.length}
                />

                <div className="category-sections-indicator">
                    {CATEGORY.filter((section) => selectedCategories.includes(section.name)).map(
                        (section) => (
                            <div
                                key={section.name}
                                className={`section-badge ${
                                    section.name === currentCategory ? 'active' : ''
                                } ${completedCategories[section.name] ? 'completed' : ''}`}
                            >
                                <div className="sec">
                                    <span className="section-icon">{section.icon}</span>

                                    <span className="section-name">{section.label}</span>

                                    {completedCategories[section.name] && (
                                        <span className="section-check">✓</span>
                                    )}
                                </div>
                            </div>
                        ),
                    )}
                    <div className="section-help">
                        {CATEGORY.find((section) => section.name === currentCategory)?.help}
                    </div>
                </div>

                {loadingBatch ? (
                    <Spinner size={30} />
                ) : (
                    <>
                        <div className="questions-grid">
                            {currentBatch.map((q) => (
                                <QuestionCard
                                    key={q.id}
                                    question={q}
                                    value={draftAnswers[q.id]?.value}
                                    onAnswer={handleAnswer}
                                />
                            ))}
                        </div>

                        <div
                            className="pagination-nav"
                            style={{
                                display: 'flex',
                                gap: '15px',
                                justifyContent: 'space-between',
                            }}
                        >
                            <button
                                className="page-nav-btn prev-btn"
                                onClick={handlePreviousBatch}
                                disabled={submitting || loadingBatch || batchHistory.length === 0}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#f0f0f0',
                                    color: '#333',
                                    border: '1px solid #ddd',
                                }}
                            >
                                ← Page précédente
                            </button>
                            <button
                                className="page-nav-btn next-btn"
                                onClick={handleManualNextBatch}
                                disabled={!allAnswered || submitting || loadingBatch}
                                style={{ flex: 1 }}
                            >
                                {submitting
                                    ? 'Envoi...'
                                    : allAnswered
                                      ? 'Continuer →'
                                      : `Page suivante (${currentBatch.length - Object.keys(draftAnswers).length} restante${currentBatch.length - Object.keys(draftAnswers).length > 1 ? 's' : ''}) →`}
                            </button>
                        </div>

                        {!hasUsedPrevious && allAnswered && !submitting && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    marginTop: '15px',
                                    fontSize: '14px',
                                    color: '#666',
                                }}
                            ></div>
                        )}
                        {hasUsedPrevious && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    marginTop: '15px',
                                    fontSize: '14px',
                                    color: '#ff9800',
                                }}
                            >
                                Cliquez sur "Continuer" pour valider vos modifications
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Test;
