import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tests.css";
import api from "../services/api";

const EmotionSvgs = {
  sad: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
      <circle cx="8" cy="9" r="1" fill="currentColor" />
      <circle cx="16" cy="9" r="1" fill="currentColor" />
      <path d="M8 15 Q12 11 16 15" stroke="currentColor" fill="none" strokeLinecap="round" />
    </svg>
  ),
  neutral: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
      <circle cx="8" cy="9" r="1" fill="currentColor" />
      <circle cx="16" cy="9" r="1" fill="currentColor" />
      <line x1="8" y1="15" x2="16" y2="15" stroke="currentColor" strokeLinecap="round" />
    </svg>
  ),
  happy: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
      <circle cx="8" cy="9" r="1" fill="currentColor" />
      <circle cx="16" cy="9" r="1" fill="currentColor" />
      <path d="M8 14 Q12 18 16 14" stroke="currentColor" fill="none" strokeLinecap="round" />
    </svg>
  ),
};

const PHASE2_SECTIONS = [
  { name: "OCCUPATIONS", label: "Réaliste", icon: "🔧", description: "Travail pratique et technique" },
  { name: "APTITUDES", label: "Investigateur", icon: "🔬", description: "Exploration et analyse" },
  { name: "PERSONALITY", label: "Artistique", icon: "🎨", description: "Créativité et expression" }
];

const BATCH_SIZE = 6;

const Test = () => {
  const navigate = useNavigate();

  const [currentPhase, setCurrentPhase] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [sessionToken, setSessionToken] = useState(null);
  const [assessmentId, setAssessmentId] = useState(null);
  const [currentBatch, setCurrentBatch] = useState([]);
  const [draftAnswers, setDraftAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingBatch, setLoadingBatch] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phase2SectionsCompleted, setPhase2SectionsCompleted] = useState({});

  // ============ INITIALISATION SESSION (CORRIGÉE) ============
  const initializeSession = async () => {
  try {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      setError("Veuillez vous connecter");
      return null;
    }

    // NETTOYAGE FORCÉ - Ajoute ces 2 lignes
    localStorage.removeItem("session_token");
    localStorage.removeItem("assessment_id");

    // Création session
    const response = await api.post("/sessions", {
      testVersionId: 1,
      initialAssessmentType: "PHASE1",
      depth: 5,
      profile: { startedAt: new Date().toISOString(), mode: "full" },
    });

    console.log("REPONSE BRUTE:", response.data);  // ← Ajoute cette ligne

    // ADAPTE SELON CE QUE TU VOIS DANS LA CONSOLE
    const newSessionToken = response.data.sessionToken;
    const newAssessmentId = response.data.assessment?.id;

    if (newSessionToken && newAssessmentId) {
      localStorage.setItem("session_token", newSessionToken);
      localStorage.setItem("assessment_id", newAssessmentId);
      return { sessionToken: newSessionToken, assessmentId: newAssessmentId };
    }

    throw new Error("Session non créée");
  } catch (err) {
    console.error(err);
    return null;
  }
};

  // ============ RÉCUPÉRATION DE LA PROGRESSION (CORRIGÉE) ============
  const resolveProgress = async (token, assessmentIdParam) => {
  if (!token || !assessmentIdParam) {
    console.log("⏳ Pas encore de progression");
    return { status: "IN_PROGRESS", currentPhase: "PHASE1", currentSection: null };
  }

  try {
    const response = await api.get(`/assessments/${assessmentIdParam}/progress`, {
      params: { sessionToken: token }
    });
    console.log("📊 Progression:", response.data);
    
    setCurrentPhase(response.data.currentPhase);
    setCurrentSection(response.data.currentSection);
    setCompletionPercentage(response.data.completionPercentage || 0);
    return response.data;
  } catch (err) {
    console.log("ℹ️ Progression non trouvée, phase par défaut");
    return { status: "IN_PROGRESS", currentPhase: "PHASE1", currentSection: null };
  }
};

  // ============ CHARGEMENT DES QUESTIONS (CORRIGÉ) ============
  const fetchQuestions = async (phase, section = null) => {
  if (!sessionToken) {
    console.error("❌ Pas de sessionToken");
    return false;
  }

  try {
    setLoadingBatch(true);
    let response;

    console.log(`🔍 Fetch ${phase} - section: ${section}`);

    if (phase === "PHASE1") {
      response = await api.get("/questions/phase1", {
        params: { sessionToken, lang: "fr", take: BATCH_SIZE }
      });
    } else if (phase === "PHASE2" && section) {
      response = await api.get("/questions/phase2", {
        params: { sessionToken, assessmentId, section, lang: "fr", take: BATCH_SIZE }
      });
    }

    console.log("📦 Réponse questions:", response.data);

    if (response.data && response.data.length > 0) {
      const formatted = response.data.map(q => ({
        id: q.id,
        text: q.text,
        riasecType: q.riasecType,
        phase: phase,
        minValue: phase === "PHASE1" ? 1 : 1,
        maxValue: phase === "PHASE1" ? 2 : 5,
        valueLabels: phase === "PHASE1" ? ["Non", "Oui"] : ["Pas du tout", "Un peu", "Moyennement", "Assez", "Tout à fait"]
      }));
      setCurrentBatch(formatted);
      setDraftAnswers({});
      return true;
    }
    return false;
  } catch (err) {
    console.error("❌ Erreur fetchQuestions:", err);
    setError(err.response?.data?.message || "Erreur chargement questions");
    return false;
  } finally {
    setLoadingBatch(false);
  }
};

  // ============ SOUMISSION DES RÉPONSES ============
  const submitBatch = async () => {
    if (Object.keys(draftAnswers).length !== currentBatch.length) {
      const remaining = currentBatch.length - Object.keys(draftAnswers).length;
      alert(`Veuillez répondre à toutes les questions (${remaining} restantes)`);
      return null;
    }

    setSubmitting(true);
    try {
      const responses = Object.entries(draftAnswers).map(([questionId, responseValue]) => ({
        questionId: parseInt(questionId),
        responseValue: responseValue,
      }));

      const endpoint = currentPhase === "PHASE1" ? "/responses/phase1" : "/responses/phase2";

      console.log(`📤 Soumission ${endpoint}...`);
      
      await api.post(endpoint, {
        sessionToken: sessionToken,
        assessmentId: assessmentId,
        responses: responses,
      });

      setDraftAnswers({});
      const updatedProgress = await resolveProgress(sessionToken, assessmentId);
      return updatedProgress;
    } catch (err) {
      console.error("❌ Erreur soumission:", err);
      setError(err.response?.data?.message || "Impossible de soumettre les réponses");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const calculateResults = async () => {
    try {
      console.log("📊 Calcul des résultats...");
      await api.post("/results/compute", {
        sessionToken: sessionToken,
        assessmentId: assessmentId,
        force: true,
      });
    } catch (err) {
      console.error("❌ Erreur calcul résultats:", err);
    }
  };

  const handleAnswer = (questionId, value) => {
    setDraftAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleBatchComplete = async () => {
    const progressData = await submitBatch();
    if (!progressData) return;

    if (progressData.status === "COMPLETED") {
      await calculateResults();
      navigate("/orientations", { state: { assessmentId, sessionToken } });
      return;
    }

    const newPhase = progressData.currentPhase;
    const newSection = progressData.currentSection;

    if (newPhase === "PHASE1") {
      await fetchQuestions("PHASE1");
    } else if (newPhase === "PHASE2") {
      if (newSection && newSection !== currentSection) {
        setPhase2SectionsCompleted(prev => ({ ...prev, [currentSection]: true }));
        setCurrentSection(newSection);
        await fetchQuestions("PHASE2", newSection);
      } else if (currentPhase === "PHASE1" && newPhase === "PHASE2") {
        await calculateResults();
        setCurrentPhase("PHASE2");
        const firstSection = PHASE2_SECTIONS[0].name;
        setCurrentSection(firstSection);
        await fetchQuestions("PHASE2", firstSection);
      } else {
        await fetchQuestions("PHASE2", currentSection);
      }
    }
  };

  const renderOptions = (question) => {
    if (question.phase === "PHASE2") {
      const options = [];
      for (let i = question.minValue; i <= question.maxValue; i++) {
        let label = question.valueLabels?.[i - 1] || String(i);
        options.push({ value: i, label });
      }
      
      return (
        <div className="slider-options scale-options">
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`scale-btn ${draftAnswers[question.id] === opt.value ? "active" : ""}`}
              onClick={() => handleAnswer(question.id, opt.value)}
            >
              <span className="scale-value">{opt.value}</span>
              <span className="scale-label">{opt.label}</span>
            </button>
          ))}
        </div>
      );
    }

    const options = [
      { value: 1, label: "Non" },
      { value: 2, label: "Oui" },
    ];

    return (
      <div className="slider-options">
        {options.map((option) => (
          <button
            key={option.value}
            className={`emotion-btn ${draftAnswers[question.id] === option.value ? "active" : ""}`}
            onClick={() => handleAnswer(question.id, option.value)}
          >
            <span className="emotion-label">{option.label}</span>
            {draftAnswers[question.id] === option.value && <span className="check-mark">✓</span>}
          </button>
        ))}
      </div>
    );
  };

  // ============ CHARGEMENT INITIAL ============
  useEffect(() => {
    const loadAssessment = async () => {
      setLoading(true);
      setError(null);

      try {
        // Nettoyer les anciennes valeurs si nécessaire
        const oldToken = localStorage.getItem("session_token");
        if (oldToken === "null" || oldToken === "undefined") {
          localStorage.removeItem("session_token");
          localStorage.removeItem("assessment_id");
        }

        const sessionData = await initializeSession();
        if (!sessionData) {
          setLoading(false);
          return;
        }

        console.log("✅ Session data:", sessionData);
        setSessionToken(sessionData.sessionToken);
        setAssessmentId(sessionData.assessmentId);

        const progressData = await resolveProgress(sessionData.sessionToken, sessionData.assessmentId);

        if (progressData.status === "COMPLETED") {
          navigate("/orientations", { state: { assessmentId: sessionData.assessmentId, sessionToken: sessionData.sessionToken } });
          return;
        }

        const phase = progressData.currentPhase || "PHASE1";
        const section = progressData.currentSection || (phase === "PHASE2" ? PHASE2_SECTIONS[0].name : null);
        
        setCurrentPhase(phase);
        setCurrentSection(section);
        
        await fetchQuestions(phase, section);
      } catch (err) {
        console.error("❌ Erreur chargement évaluation:", err);
        setError(err.message || "Impossible de charger l'évaluation");
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [navigate]);

  const allAnswered = Object.keys(draftAnswers).length === currentBatch.length;
  const currentSectionData = currentPhase === "PHASE2" ? PHASE2_SECTIONS.find(s => s.name === currentSection) : null;

  // Rendu JSX (simplifié mais fonctionnel)
  if (loading) {
    return (
      <div className="test-page">
        <div className="test-container">
          <div className="loader" style={{ textAlign: "center", padding: "50px" }}>
            <div className="spinner"></div>
            <p>Chargement du test...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-page">
        <div className="test-container">
          <div className="error-container" style={{ textAlign: "center", padding: "50px" }}>
            <div className="error-message" style={{ color: "red", marginBottom: "20px" }}>
              <strong>Erreur :</strong> {error}
            </div>
            <button onClick={() => window.location.reload()} className="submit-btn">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                {currentPhase === "PHASE1" ? "Phase 1 - Intérêts" : `Phase 2 - ${currentSectionData?.label || currentSection}`}
              </span>
            </div>
            <div className="progress-stats">
              <span>{Object.keys(draftAnswers).length}/{currentBatch.length} questions</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }} />
            </div>
          </div>
        </div>

        {currentPhase === "PHASE2" && (
          <div className="phase2-sections-indicator">
            {PHASE2_SECTIONS.map((section) => (
              <div key={section.name} className={`section-badge ${section.name === currentSection ? "active" : ""}`}>
                <span className="section-icon">{section.icon}</span>
                <span className="section-name">{section.label}</span>
              </div>
            ))}
          </div>
        )}

        {loadingBatch && (
          <div className="loading-batch" style={{ textAlign: "center", padding: "30px" }}>
            <div className="spinner"></div>
            <p>Chargement des questions...</p>
          </div>
        )}

        {!loadingBatch && (
          <>
            <div className="questions-grid">
              {currentBatch.map((question) => (
                <div key={question.id} className={`question-card ${draftAnswers[question.id] ? "answered" : ""}`}>
                  <h3 className="question-text">{question.text}</h3>
                  {question.subtext && <p className="question-subtext">{question.subtext}</p>}
                  <div className="emotion-slider">{renderOptions(question)}</div>
                </div>
              ))}
            </div>

            <div className="pagination-nav">
              <button className="page-nav-btn next-btn" onClick={handleBatchComplete} disabled={!allAnswered || submitting || loadingBatch}>
                {submitting ? "Envoi..." : "Soumettre cette batch →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Test;