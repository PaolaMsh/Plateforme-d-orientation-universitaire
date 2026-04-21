import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tests.css";
import api from "../services/api";

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
      <path
        d="M8 15 Q12 11 16 15"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
      />
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
      <line
        x1="8"
        y1="15"
        x2="16"
        y2="15"
        stroke="currentColor"
        strokeLinecap="round"
      />
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
      <path
        d="M8 14 Q12 18 16 14"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const PHASE2_SECTIONS = [
  {
    name: "OCCUPATIONS",
    label: "Réaliste",
    icon: "🔧",
    description: "Travail pratique et technique",
  },
  {
    name: "APTITUDES",
    label: "Investigateur",
    icon: "🔬",
    description: "Exploration et analyse",
  },
  {
    name: "PERSONNALITY",
    label: "Artistique",
    icon: "🎨",
    description: "Créativité et expression",
  }
];

const BATCH_SIZE = 6;

const Test = () => {
  const navigate = useNavigate();

  const [_status, _setStatus] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [_currentStepIndex, _setCurrentStepIndex] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const [sessionToken, setSessionToken] = useState(null);
  const [assessmentId, setAssessmentId] = useState(null);

  // Batch state (always exactly 6 or fewer)
  const [currentBatch, setCurrentBatch] = useState([]);
  const [draftAnswers, setDraftAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingBatch, setLoadingBatch] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [phase2SectionsCompleted, setPhase2SectionsCompleted] = useState({});
  const [showConfirmPhase1, setShowConfirmPhase1] = useState(false);
  const [showConfirmPhase2Complete, setShowConfirmPhase2Complete] =
    useState(false);

  // ============ Step 1: Initialize Session ============
  const initializeSession = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Veuillez vous connecter pour passer le test");
        return null;
      }

      let existingSessionToken = localStorage.getItem("session_token");
      let existingAssessmentId = localStorage.getItem("assessment_id");

      if (existingSessionToken && existingAssessmentId) {
        return {
          sessionToken: existingSessionToken,
          assessmentId: existingAssessmentId,
        };
      }
          console.log("🔄 Création d'une nouvelle session...");


      const response = await api.post("/sessions", {
        testVersionId: 1,
        initialAssessmentType: "FULL",
        depth: 5,
        profile: {
          startedAt: new Date().toISOString(),
          mode: "full",
        },
      });

      if ( response.data) {
        const newSessionToken = response.data.sessionToken;
        const newAssessmentId = response.data.assessment.id;

        localStorage.setItem("session_token", newSessionToken);
        localStorage.setItem("assessment_id", newAssessmentId);

        return {
          sessionToken: newSessionToken,
          assessmentId: newAssessmentId,
        };
      }
      throw new Error("Erreur lors de l'initialisation");
    } catch (err) {
      console.error("Erreur initialisation:", err);
      setError(
        err.response?.data?.message || "Impossible d'initialiser le test",
      );
      return null;
    }
  };

  const resolveProgress = async (token, assessmentIdParam) => {
    try {
      if (!token || token === "null") {
        console.log("⏳ Pas de token valide");
        return { status: "IN_PROGRESS", currentPhase: "PHASE1", currentSection: null };
      }

      // Récupérer la progression
      const progressResponse = await api.get(`/assessments/${assessmentIdParam}/progress`, {
        params: { sessionToken: token }
      });

      const progressData = progressResponse.data;
      
      setCurrentPhase(progressData.currentPhase);
      setCurrentSection(progressData.currentSection);
      setCompletionPercentage(progressData.completionPercentage || 0);

      return progressData;
    } catch (err) {
      console.error("Erreur résolution progression:", err);
      // Si erreur, on commence par défaut
      return { status: "IN_PROGRESS", currentPhase: "PHASE1", currentSection: null };
    }
  };

  // ============ Fetch Batch (6 questions) ============
const fetchBatch = async (phase, section = null) => {
  try {
    setLoadingBatch(true);
    let response;

    // Cache buster : timestamp pour éviter le cache
    const cacheBuster = Date.now();

    console.log(`🔍 Fetching ${phase} questions...`, { sessionToken, assessmentId, section });

    if (phase === "PHASE1") {
      response = await api.get("/questions/phase1", {
        params: {
          sessionToken,
           assessmentId,
          lang: "fr",
          take: BATCH_SIZE,
        },
      });
    } else if (phase === "PHASE2" && section) {
        response = await api.get("/questions/phase2", {
        params: {
          sessionToken,
          assessmentId,
          section,
          lang: "fr",
          take: BATCH_SIZE,
          cacheBuster, // empêche le cache côté client/serveur en rendant l'URL unique
        },
      });
    } else {
      throw new Error("Phase ou section invalide");
    }

    console.log("📦 Réponse brute API:", response.data);
    console.log("📦 Type de réponse:", typeof response.data);
    console.log("📦 Est-ce un tableau?", Array.isArray(response.data));
    console.log("📦 Longueur:", response.data?.length);

    if (response.data && response.data.length > 0) {
      const formattedQuestions = response.data.map((q) => {
        const baseQuestion = {
          id: q.id,
          text: q.text,
          riasecType: q.riasecType,
          subtext: q.subtext || null,
          pointsValue: q.pointsValue || 1,
          phase,
        };

        if (phase === "PHASE1") {
          return {
            ...baseQuestion,
            minValue: q.minValue || 1,
            maxValue: q.maxValue || 3,
            valueLabels: q.valueLabels || ["Non", "Oui"],
          };
        } else {
          return {
            ...baseQuestion,
            section,
            sectionType: q.sectionType,
            minValue: q.minValue || 1,
            maxValue: q.maxValue || 5,
            valueLabels: q.valueLabels || ["Pas du tout", "Un peu", "Moyennement", "Assez", "Tout à fait"],
          };
        }
      });

      console.log("✅ Questions formatées:", formattedQuestions.length);
      setCurrentBatch(formattedQuestions);
      setDraftAnswers({});
      return true;
    } else {
      console.error("⚠️ Aucune donnée dans la réponse:", response.data);
      return false;
    }
  } catch (err) {
    console.error(`❌ Erreur chargement ${phase}:`, err);
    console.error("Détails erreur:", err.response?.data);
    setError(
      err.response?.data?.message || `Impossible de charger les questions`,
    );
    return false;
  } finally {
    setLoadingBatch(false);
  }
};

  // ============ Step 2: Handle Answers (Draft) ============
  const handleAnswer = (questionId, value, question) => {
    setDraftAnswers((prev) => ({
      ...prev,
      [questionId]: {
        value,
        riasecType: question.riasecType,
      },
    }));
  };

  // ============ Step 4: Submit Batch ============
  const submitBatch = async () => {
    // Validate all questions answered
    if (Object.keys(draftAnswers).length !== currentBatch.length) {
      const remaining = currentBatch.length - Object.keys(draftAnswers).length;
      alert(
        `Veuillez répondre à toutes les questions (${remaining} restantes)`,
      );
      return null;
    }

    setSubmitting(true);
    try {
      const responses = Object.entries(draftAnswers).map(
        ([questionId, answer]) => ({
          questionId,
          responseValue: answer.value,

        }),
      );

      const endpoint =
        currentPhase === "PHASE1" ? "/responses/phase1" : "/responses/phase2";

      await api.post(endpoint, {
        sessionToken,
        assessmentId,
        responses,
      });

      // Clear draft answers after successful submission
      setDraftAnswers({});

      // Refetch progress immediately (backend is source of truth)
      const updatedProgress = await resolveProgress(sessionToken, assessmentId);
      return updatedProgress;
    } catch (err) {
      console.error("Erreur soumission réponses:", err);
      setError(
        err.response?.data?.message || "Impossible de soumettre les réponses",
      );
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  // ============ Step 5: Decision Logic (Backend-Driven) ============
  // ============ Step 5: Decision Logic (Backend-Driven) ============
const handleBatchComplete = async () => {
  // Soumettre le lot actuel
  const progressData = await submitBatch();
  if (!progressData) return;

  // Le backend nous donne le nouvel état
  if (progressData.status === "COMPLETED") {
    handleAssessmentCompletion();
    return;
  }

  // Si on est ici, l'évaluation est toujours IN_PROGRESS
  const previousPhase = currentPhase;
  const newPhase = progressData.currentPhase;

  if (newPhase === "PHASE1" && previousPhase === "PHASE1") {
    // Même phase, charger le prochain lot
    const success = await fetchBatch("PHASE1");
    if (!success) {
      setError("Impossible de charger la prochaine batch");
    }
  } else if (newPhase === "PHASE2" && previousPhase === "PHASE1") {
    // Transition Phase 1 → Phase 2
    // NE PAS calculer les résultats ici - le backend le fait automatiquement
    // quand toutes les questions de la Phase 1 sont soumises
    
    // Mettre à jour l'UI pour montrer la transition
    setCurrentPhase("PHASE2");
    setCurrentSection(PHASE2_SECTIONS[0].name);
    
    // Charger le premier lot de la Phase 2
    const success = await fetchBatch("PHASE2", PHASE2_SECTIONS[0].name);
    if (!success) {
      setError("Impossible de charger la Phase 2");
    }
  } else if (newPhase === "PHASE2" && previousPhase === "PHASE2") {
    // Toujours en Phase 2, vérifier si la section a changé
    if (progressData.currentSection !== currentSection) {
      // Section changée, marquer la précédente comme complétée
      setPhase2SectionsCompleted((prev) => ({
        ...prev,
        [currentSection]: true,
      }));
      
      setCurrentSection(progressData.currentSection);

      // Charger le premier lot de la nouvelle section
      const success = await fetchBatch("PHASE2", progressData.currentSection);
      if (!success) {
        setError("Impossible de charger la prochaine section");
      }
    } else {
      // Même section, charger le prochain lot
      const success = await fetchBatch("PHASE2", currentSection);
      if (!success) {
        setError("Impossible de charger la prochaine batch");
      }
    }
  }
};

  // ============ Step 7: Completion Flow ============
const handleAssessmentCompletion = async () => {
  try {
    // Calculer les résultats finaux (maintenant que tout le test est complété)
    await api.post("/results/compute", {
      sessionToken,
      assessmentId,
    });

    // Naviguer vers les résultats
    navigate("/orientations", { state: { assessmentId, sessionToken } });
  } catch (err) {
    console.error("Erreur finalisation:", err);
    // Si l'erreur persiste, essayer de récupérer les résultats existants
    if (err.response?.status === 400) {
      // Peut-être que les résultats existent déjà
      navigate("/orientations", { state: { assessmentId, sessionToken } });
    } else {
      setError("Impossible de finaliser le test");
    }
  }
};
  // ============ Step 6: Resume Logic ============
  useEffect(() => {
    const loadAssessment = async () => {
      setLoading(true);
      setError(null);

      localStorage.removeItem("session_token");
    localStorage.removeItem("assessment_id");

      try {
        // Initialize or resume session
        const sessionData = await initializeSession();
        if (!sessionData) {
          setLoading(false);
          return;
        }

        setSessionToken(sessionData.sessionToken);
        setAssessmentId(sessionData.assessmentId);

        // Resolve current progress from backend
        const progressData = await resolveProgress(
          sessionData.sessionToken,
          sessionData.assessmentId,
        );

        // If already completed, redirect to results
        if (progressData.status === "COMPLETED") {
          navigate("/orientations", {
            state: {
              assessmentId: sessionData.assessmentId,
              sessionToken: sessionData.sessionToken,
            },
          });
          return;
        }

        // Load initial batch based on current phase
        const phase = progressData.currentPhase || "PHASE1";
        const section =
          progressData.currentSection ||
          (phase === "PHASE2" ? PHASE2_SECTIONS[0].name : null);

        // Fetch first batch
        setLoadingBatch(true);
        try {
          let response;

          if (phase === "PHASE1") {
            response = await api.get("/questions/phase1", {
              params: {
                sessionToken: sessionData.sessionToken,
                lang: "fr",
                take: BATCH_SIZE,
              },
            });
          } else if (phase === "PHASE2" && section) {
            response = await api.get("/questions/phase2", {
              params: {
                sessionToken: sessionData.sessionToken,
                assessmentId: sessionData.assessmentId,
                section,
                lang: "fr",
                take: BATCH_SIZE,
              },
            });
          }

          if (
            response?.data &&
            response?.data.length > 0
          ) {
            const formattedQuestions = response.data.map((q) => {
              const baseQuestion = {
                id: q.id,
                text: q.text,
                riasecType: q.riasecType,
                subtext: q.subtext || null,
                pointsValue: q.pointsValue || 1,
                phase,
              };

              if (phase === "PHASE1") {
                return {
                  ...baseQuestion,
                  minValue: q.minValue || 1,
                  maxValue: q.maxValue || 3,
                  valueLabels: q.valueLabels || ["Non", "Oui"],
                };
              } else {
                return {
                  ...baseQuestion,
                  section,
                  sectionType: q.sectionType,
                  minValue: q.minValue || 1,
                  maxValue: q.maxValue || 5,
                  valueLabels: q.valueLabels || ["Non", "Pas trop", "Oui"],
                };
              }
            });

            setCurrentBatch(formattedQuestions);
          }
        } catch (err) {
          console.error(`Erreur chargement ${phase}:`, err);
          setError(
            err.response?.data?.message ||
            `Impossible de charger les questions`,
          );
        } finally {
          setLoadingBatch(false);
        }
      } catch (err) {
        console.error("Erreur chargement évaluation:", err);
        setError(err.message || "Impossible de charger l'évaluation");
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [navigate]);

  // ============ UI Helpers ============
  const allAnswered = Object.keys(draftAnswers).length === currentBatch.length;

  const renderOptions = (question) => {
    if (question.phase === "PHASE2") {
      options.push({
        value: 2,
        label: "Pas trop",
        emoji: EmotionSvgs.neutral,
        order: 1,
      });
      option.sort((a, b) => a.order - b.order);
      return (
        <div className="slider-options scale-options">
          {options.map((val) => (
            <button
              key={val}
              className={`scale-btn ${draftAnswers[question.id]?.value === val ? "active" : ""
                }`}
              onClick={() => handleAnswer(question.id, val, question)}
            >
              <span className="scale-value">{val}</span>
              {question.valueLabels && question.valueLabels[val - 1] && (
                <span className="scale-label">
                  {question.valueLabels[val - 1]}
                </span>
              )}
            </button>
          ))}
        </div>
      );
    }

    let options = [
      { value: 0, label: "Oui", emoji: EmotionSvgs.happy, order: 0 },
      { value: 1, label: "Non", emoji: EmotionSvgs.sad, order: 2 },
    ];

    return (
      <div className="slider-options">
        {options.map((option) => (
          <button
            key={option.value}
            className={`emotion-btn ${draftAnswers[question.id]?.value === option.value ? "active" : ""
              }`}
            onClick={() => handleAnswer(question.id, option.value, question)}
          >
            <div className="emotion-svg">{option.emoji}</div>
            <span className="emotion-label">{option.label}</span>
            {draftAnswers[question.id]?.value === option.value && (
              <span className="check-mark">✓</span>
            )}
          </button>
        ))}
      </div>
    );
  };

  // ============ Render ============
  if (loading) {
    return (
      <div className="test-page">
        <div className="test-container">
          <div
            className="loader"
            style={{ textAlign: "center", padding: "50px" }}
          >
            <div className="spinner"></div>
            <p style={{ marginTop: "20px" }}>
              {currentPhase === "PHASE1"
                ? "Chargement de la Phase 1..."
                : `Chargement de la section ${currentSection}...`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-page">
        <div className="test-container">
          <div
            className="error-container"
            style={{ textAlign: "center", padding: "50px" }}
          >
            <div
              className="error-message"
              style={{ color: "red", marginBottom: "20px" }}
            >
              <strong>Erreur :</strong> {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#6246E5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentBatch.length === 0) {
    return (
      <div className="test-page">
        <div className="test-container">
          <div
            className="error-container"
            style={{ textAlign: "center", padding: "50px" }}
          >
            <p>Aucune question disponible</p>
            <button
              onClick={() => window.location.reload()}
              className="submit-btn"
            >
              Recharger
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSectionData =
    currentPhase === "PHASE2"
      ? PHASE2_SECTIONS.find((s) => s.name === currentSection)
      : null;

  return (
    <div className="test-page">
      <div className="test-container">
        <div className="test-header">
          <div className="logo-section">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">RIASEC Profiler</span>
          </div>
          <div className="progress-section">
            <div className="phase-indicator">
              <span className="phase-name">
                {currentPhase === "PHASE1"
                  ? "Phase 1 - Intérêts"
                  : `Phase 2 - ${currentSectionData?.label || currentSection}`}
              </span>
              <span className="phase-desc">
                {currentPhase === "PHASE1"
                  ? "Évaluation de vos intérêts professionnels"
                  : currentSectionData?.description || "Évaluation approfondie"}
              </span>
            </div>
            <div className="progress-stats">
              <span>
                {Object.keys(draftAnswers).length}/{currentBatch.length}{" "}
                questions
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

        {currentPhase === "PHASE2" && (
          <div className="phase2-sections-indicator">
            {PHASE2_SECTIONS.map((section) => (
              <div
                key={section.name}
                className={`section-badge ${section.name === currentSection ? "active" : ""
                  } ${phase2SectionsCompleted[section.name] ? "completed" : ""}`}
              >
                <span className="section-icon">{section.icon}</span>
                <span className="section-name">{section.label}</span>
                {phase2SectionsCompleted[section.name] && (
                  <span className="section-check">✓</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="page-indicator-header">
          <span>Batch - {currentBatch.length} questions</span>
          {allAnswered && (
            <span className="page-complete-badge">✓ Batch complète !</span>
          )}
        </div>

        {loadingBatch && (
          <div
            className="loading-batch"
            style={{ textAlign: "center", padding: "30px" }}
          >
            <div className="spinner"></div>
            <p>Chargement de la prochaine batch...</p>
          </div>
        )}

        {!loadingBatch && (
          <>
            <div className="questions-grid">
              {currentBatch.map((question) => (
                <div
                  key={question.id}
                  className={`question-card ${draftAnswers[question.id] ? "answered" : ""
                    }`}
                >
                  <h3 className="question-text">{question.text}</h3>
                  {question.subtext && (
                    <p className="question-subtext">{question.subtext}</p>
                  )}
                  <div className="emotion-slider">
                    {renderOptions(question)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination-nav">
              <button
                className="page-nav-btn next-btn"
                onClick={handleBatchComplete}
                disabled={!allAnswered || submitting || loadingBatch}
              >
                {submitting ? "Envoi..." : "Soumettre cette batch →"}
              </button>
            </div>
          </>
        )}

        {showConfirmPhase1 && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-icon">🎉</div>
              <h3>Phase 1 terminée !</h3>
              <p>Vous avez répondu à toutes les questions de la Phase 1.</p>
              <div className="modal-buttons">
                <button
                  onClick={() => setShowConfirmPhase1(false)}
                  className="modal-cancel"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setShowConfirmPhase1(false);
                  }}
                  className="modal-confirm"
                  disabled={loading}
                >
                  {loading ? "Chargement..." : "Passer à la Phase 2 →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmPhase2Complete && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-icon">🏆</div>
              <h3>Félicitations !</h3>
              <p>Vous avez terminé toutes les phases du test.</p>
              <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                Vos résultats vont maintenant être analysés.
              </p>
              <div className="modal-buttons">
                <button
                  onClick={() => {
                    setShowConfirmPhase2Complete(false);
                  }}
                  className="modal-confirm"
                  disabled={loading}
                >
                  {loading ? "Chargement..." : "Voir mes résultats →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
