import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/tests.css';
import api from '../services/api';
import { TEST_TYPES } from '../utils/riasec';

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

const BATCH_SIZE = 6;
const GENERAL_TEST_STORAGE = {
    sessionToken: 'general_session_token',
    assessmentId: 'general_assessment_id',
};

const clearGeneralAssessmentStorage = () => {
    localStorage.removeItem(GENERAL_TEST_STORAGE.sessionToken);
    localStorage.removeItem(GENERAL_TEST_STORAGE.assessmentId);
};

const Spinner = ({ size = 40 }) => (
    <div className="spinner-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner" style={{ width: size, height: size }}></div>
    </div>
);

const ProgressHeader = ({ completionPercentage, draftCount, batchSize }) => {
    return (
        <div className="test-header">
            <div className="logo-section">
                <span className="logos-text">RIASEC Profiler</span>
            </div>
            <div className="progress-section">
                <div className="category-indicator">
                    <span className="category-name">Général - Intérêts</span>
                    <span className="category-desc">Évaluation de vos intérêts professionnels</span>
                </div>
                <div className="progress-stats">
                    <span>
                        {draftCount}/{batchSize} questions
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
    const options = [
        { value: 0, label: 'Non', emoji: EmotionSvgs.sad },
        { value: 1, label: 'Oui', emoji: EmotionSvgs.happy },
    ];

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

const formatQuestions = (data) => {
    return data.map((q) => ({
        id: q.id,
        text: q.text,
        subtext: q.subtext || null,
        category: q.category || TEST_TYPES.GENERALE,
        riasecType: q.riasecType,
    }));
};

const GeneralTest = () => {
    const navigate = useNavigate();

    const [sessionToken, setSessionToken] = useState(null);
    const [assessmentId, setAssessmentId] = useState(null);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [currentBatch, setCurrentBatch] = useState([]);
    const [draftAnswers, setDraftAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingBatch, setLoadingBatch] = useState(true);
    const [error, setError] = useState(null);
    const [assessmentCompleted] = useState(false);

    const resolveProgress = useCallback(async (token, assessmentIdParam) => {
        try {
            const progressResponse = await api.get(`/assessments/${assessmentIdParam}/progress`, {
                params: { sessionToken: token },
            });
            const progressData = progressResponse.data;
            setCompletionPercentage(progressData.completionPercentage || 0);
            return progressData;
        } catch {
            return { status: 'IN_PROGRESS' };
        }
    }, []);

    const initializeSession = useCallback(
        async (forceNew = false) => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Veuillez vous connecter pour passer le test');
                    return null;
                }

                const existingSessionToken = localStorage.getItem(
                    GENERAL_TEST_STORAGE.sessionToken,
                );
                const existingAssessmentId = localStorage.getItem(
                    GENERAL_TEST_STORAGE.assessmentId,
                );

                if (forceNew) {
                    clearGeneralAssessmentStorage();
                }

                if (
                    !forceNew &&
                    existingSessionToken &&
                    existingAssessmentId &&
                    !assessmentCompleted
                ) {
                    return {
                        sessionToken: existingSessionToken,
                        assessmentId: existingAssessmentId,
                    };
                }

                const response = await api.post('/sessions', {
                    testVersionId: 1,
                    initialTestType: TEST_TYPES.GENERALE,
                    depth: 5,
                    profile: {
                        startedAt: new Date().toISOString(),
                        mode: 'category',
                        category: TEST_TYPES.GENERALE,
                        isGeneralTest: true,
                    },
                });

                if (response?.data) {
                    const newSessionToken = response.data.sessionToken;
                    const newAssessmentId = response.data.assessment.id;
                    localStorage.setItem(GENERAL_TEST_STORAGE.sessionToken, newSessionToken);
                    localStorage.setItem(GENERAL_TEST_STORAGE.assessmentId, newAssessmentId);
                    return { sessionToken: newSessionToken, assessmentId: newAssessmentId };
                }
                throw new Error("Erreur lors de l'initialisation");
            } catch (err) {
                console.error('Session error:', err);
                setError(err.response?.data?.message || "Impossible d'initialiser le test");
                return null;
            }
        },
        [assessmentCompleted],
    );

    const completeAssessment = useCallback(
        async (token, assessmentIdParam) => {
            setSubmitting(true);
            try {
                try {
                    await api.post('/results/compute', {
                        sessionToken: token,
                        assessmentId: assessmentIdParam,
                    });
                } catch (computeErr) {
                    console.warn('Compute warning:', computeErr);
                }

                const response = await api.get(`/results/by-assessment/${assessmentIdParam}`);

                const reportData = { ...(response?.data || {}), assessmentId: assessmentIdParam };

                // Sauvegarder les données
                localStorage.setItem('assessment_id', String(assessmentIdParam));
                localStorage.setItem('session_token', String(token));
                localStorage.setItem('general_report_data', JSON.stringify(reportData));

                // Nettoyer les données temporaires
                clearGeneralAssessmentStorage();

                // Rediriger vers le rapport
                navigate('/rapport-general', {
                    state: {
                        assessmentResults: reportData,
                        assessmentId: assessmentIdParam,
                        sessionToken: token,
                    },
                });
            } catch (err) {
                console.error('Error completing assessment:', err);
                setError("Impossible de finaliser le test et d'afficher le rapport");
            } finally {
                setSubmitting(false);
            }
        },
        [navigate],
    );

    const fetchBatch = useCallback(
        async (tokenParam = null, assessmentIdParam = null, options = {}) => {
            setLoadingBatch(true);
            const tokenToUse = tokenParam || sessionToken;
            const assessmentIdToUse = assessmentIdParam || assessmentId;

            try {
                const response = await api.get('/questions/category', {
                    params: {
                        sessionToken: tokenToUse,
                        assessmentId: assessmentIdToUse,
                        currentCategory: TEST_TYPES.GENERALE,
                        lang: 'fr',
                        take: BATCH_SIZE,
                    },
                });

                if (response?.data && response.data.length > 0) {
                    const formatted = formatQuestions(response.data);
                    setCurrentBatch(formatted);
                    setDraftAnswers({});
                    return true;
                }

                await completeAssessment(tokenToUse, assessmentIdToUse);
                return false;
            } catch (err) {
                console.error('Fetch batch error:', err);
                const message = err.response?.data?.message || err.message || '';
                if (
                    String(message).toLowerCase().includes('aucun test actif') ||
                    String(message).toLowerCase().includes('no active')
                ) {
                    await completeAssessment(tokenToUse, assessmentIdToUse);
                    return false;
                }
                if (
                    options.retryOnInvalidCategory !== false &&
                    (String(message).toLowerCase().includes('catégorie courante invalide') ||
                        String(message).toLowerCase().includes('section courante invalide'))
                ) {
                    clearGeneralAssessmentStorage();
                    const newSession = await initializeSession(true);
                    if (newSession) {
                        setSessionToken(newSession.sessionToken);
                        setAssessmentId(newSession.assessmentId);
                        const retryResponse = await api.get('/questions/category', {
                            params: {
                                sessionToken: newSession.sessionToken,
                                assessmentId: newSession.assessmentId,
                                currentCategory: TEST_TYPES.GENERALE,
                                lang: 'fr',
                                take: BATCH_SIZE,
                            },
                        });

                        if (retryResponse?.data && retryResponse.data.length > 0) {
                            const formatted = formatQuestions(retryResponse.data);
                            setCurrentBatch(formatted);
                            setDraftAnswers({});
                            return true;
                        }
                    }
                }
                setError(err.response?.data?.message || 'Impossible de charger les questions');
                return false;
            } finally {
                setLoadingBatch(false);
            }
        },
        [sessionToken, assessmentId, completeAssessment, initializeSession],
    );

    const submitBatch = useCallback(async () => {
        if (Object.keys(draftAnswers).length !== currentBatch.length) {
            alert(
                `Veuillez répondre à toutes les questions (${currentBatch.length - Object.keys(draftAnswers).length} restantes)`,
            );
            return null;
        }

        setSubmitting(true);
        try {
            const payload = {
                sessionToken,
                assessmentId,
                responses: Object.entries(draftAnswers).map(([questionId, answer]) => ({
                    questionId: Number(questionId),
                    responseValue: answer.value,
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
    }, [draftAnswers, currentBatch, sessionToken, assessmentId, resolveProgress]);

    const handleBatchComplete = useCallback(async () => {
        const progressData = await submitBatch();
        if (!progressData) return;

        if (progressData.status === 'COMPLETED') {
            await completeAssessment(sessionToken, assessmentId);
            return;
        }

        // Charger le prochain lot de questions
        await fetchBatch(sessionToken, assessmentId);
    }, [submitBatch, sessionToken, assessmentId, fetchBatch, completeAssessment]);

    const handleAnswer = useCallback((questionId, value) => {
        setDraftAnswers((prev) => ({ ...prev, [questionId]: { value } }));
    }, []);

    // Initialisation
    useEffect(() => {
        const loadAssessment = async () => {
            setLoading(true);
            setError(null);
            const sessionData = await initializeSession();
            if (sessionData) {
                setSessionToken(sessionData.sessionToken);
                setAssessmentId(sessionData.assessmentId);
                await resolveProgress(sessionData.sessionToken, sessionData.assessmentId);
                await fetchBatch(sessionData.sessionToken, sessionData.assessmentId);
            }
            setLoading(false);
        };
        loadAssessment();
    }, [initializeSession, fetchBatch, resolveProgress]);

    // Auto-soumission quand toutes les questions sont répondues
    const allAnswered =
        currentBatch.length > 0 && Object.keys(draftAnswers).length === currentBatch.length;

    useEffect(() => {
        if (
            allAnswered &&
            !submitting &&
            !loadingBatch &&
            !assessmentCompleted &&
            currentBatch.length > 0
        ) {
            const timer = setTimeout(() => {
                handleBatchComplete();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [
        allAnswered,
        submitting,
        loadingBatch,
        assessmentCompleted,
        currentBatch.length,
        handleBatchComplete,
    ]);

    if (loading) {
        return (
            <div className="test-page">
                <div className="test-container">
                    <Spinner />
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>
                        Chargement du général...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="test-page">
                <div className="test-container">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p style={{ color: 'red' }}>Erreur : {error}</p>
                        <button onClick={() => window.location.reload()}>Réessayer</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="test-page">
            <div className="test-container">
                <ProgressHeader
                    completionPercentage={completionPercentage}
                    draftCount={Object.keys(draftAnswers).length}
                    batchSize={currentBatch.length}
                />

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
                        <div className="pagination-nav">
                            <button
                                className="page-nav-btn next-btn"
                                onClick={handleBatchComplete}
                                disabled={!allAnswered || submitting || loadingBatch}
                                style={{ width: '100%' }}
                            >
                                {submitting
                                    ? 'Envoi...'
                                    : allAnswered
                                      ? 'Continuer →'
                                      : 'Page suivante →'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GeneralTest;
