import React, { useState, useEffect, useRef } from "react";
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

const Test = () => {
  const navigate = useNavigate();
  
  // États pour les questions
  const [currentPhase, setCurrentPhase] = useState("PHASE1");
  const [currentSection, setCurrentSection] = useState(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showConfirmPhase1, setShowConfirmPhase1] = useState(false);
  const [showConfirmPhase2Complete, setShowConfirmPhase2Complete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [assessmentId, setAssessmentId] = useState(null);
  
  // Progression
  const [phase2SectionsCompleted, setPhase2SectionsCompleted] = useState({
    OCCUPATIONS: false,
    APTITUDES: false,
    PERSONALITY: false
  });
  
  // Pagination
  const [isManualNavigation, setIsManualNavigation] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const autoAdvanceRef = useRef(null);
  const questionsPerPage = 5;

  const phase2Sections = [
    { name: "OCCUPATIONS", label: "Occupations", icon: "💼", description: "Évaluez votre intérêt pour différentes professions", order: 0 },
    { name: "APTITUDES", label: "Aptitudes", icon: "🧠", description: "Évaluez vos compétences et capacités", order: 1 },
    { name: "PERSONALITY", label: "Personnalité", icon: "🌟", description: "Évaluez vos traits de personnalité", order: 2 }
  ];

  // Initialisation de la session
  const initializeSession = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Veuillez vous connecter pour passer le test");
        return false;
      }

      let existingSessionToken = localStorage.getItem('session_token');
      let existingAssessmentId = localStorage.getItem('assessment_id');

      if (existingSessionToken && existingAssessmentId) {
        setSessionToken(existingSessionToken);
        setAssessmentId(existingAssessmentId);
        return { sessionToken: existingSessionToken, assessmentId: existingAssessmentId };
      }

      const response = await api.post('/sessions', {
        testVersionId: 1,
        initialAssessmentType: "PHASE1",
        depth: 5,
        profile: {
          startedAt: new Date().toISOString(),
          mode: 'full'
        }
      });

      console.log("Session créée:", response.data);

      if (response.data.success && response.data.data) {
        const newSessionToken = response.data.data.sessionToken;
        const newAssessmentId = response.data.data.assessment.id;
        
        setSessionToken(newSessionToken);
        setAssessmentId(newAssessmentId);
        localStorage.setItem('session_token', newSessionToken);
        localStorage.setItem('assessment_id', newAssessmentId);
        
        return { sessionToken: newSessionToken, assessmentId: newAssessmentId };
      }
      throw new Error("Erreur lors de l'initialisation");
    } catch (err) {
      console.error("Erreur initialisation:", err);
      setError(err.response?.data?.message || "Impossible d'initialiser le test");
      return false;
    }
  };

  // Récupérer les questions Phase 1
  const fetchPhase1Questions = async (token) => {
    try {
      console.log("Fetch Phase 1 avec token:", token);
      
      const response = await api.get('/questions/phase1', {
        params: { 
          sessionToken: token,
          lang: 'fr' 
        }
      });
      
      console.log("Réponse Phase 1:", response.data);
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const formattedQuestions = response.data.data.map(q => ({
          id: q.id,
          text: q.text,
          riasecType: q.riasecType,
          short: q.short || null,
          subtext: q.subtext || null,
          minValue: q.minValue || 1,
          maxValue: q.maxValue || 3,
          valueLabels: q.valueLabels || ["Non", "Pas trop", "Oui"],
          pointsValue: q.pointsValue || 1,
          phase: "PHASE1"
        }));
        
        setCurrentQuestions(formattedQuestions);
        console.log(`✅ Phase 1: ${formattedQuestions.length} questions chargées`);
        return true;
      } else {
        console.error("Aucune donnée dans la réponse:", response.data);
        setError("Aucune question trouvée dans la base de données");
        return false;
      }
    } catch (err) {
      console.error("Erreur chargement Phase 1:", err);
      setError(err.response?.data?.message || "Impossible de charger les questions Phase 1");
      return false;
    }
  };

  // Récupérer les questions Phase 2 par section
  const fetchPhase2Questions = async (section) => {
    try {
      console.log(`Fetch Phase 2 - ${section} avec token:`, sessionToken);
      
      const response = await api.get('/questions/phase2', {
        params: {
          sessionToken: sessionToken,
          assessmentId: assessmentId,
          section: section,
          lang: 'fr',
          take: 60
        }
      });
      
      console.log(`Réponse Phase 2 - ${section}:`, response.data);
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const formattedQuestions = response.data.data.map(q => ({
          id: q.id,
          text: q.text,
          riasecType: q.riasecType,
          sectionType: q.sectionType,
          subtext: q.subtext || null,
          minValue: q.minValue || 1,
          maxValue: q.maxValue || 5,
          valueLabels: q.valueLabels || ["Très faible", "Faible", "Moyen", "Fort", "Très fort"],
          pointsValue: q.pointsValue || 1,
          phase: "PHASE2",
          section: section
        }));
        
        setCurrentQuestions(formattedQuestions);
        setCurrentSection(section);
        console.log(`✅ Phase 2 - ${section}: ${formattedQuestions.length} questions chargées`);
        return true;
      } else {
        console.error(`Aucune donnée pour la section ${section}:`, response.data);
        return false;
      }
    } catch (err) {
      console.error(`Erreur chargement Phase 2 - ${section}:`, err);
      return false;
    }
  };

  // Sauvegarder les réponses Phase 1
  const savePhase1Responses = async (questionId, value, timeMs = 1000) => {
    try {
      await api.post('/responses/phase1', {
        sessionToken,
        assessmentId,
        responses: [{
          questionId,
          responseValue: value,
          timeTakenMs: timeMs,
          changeCount: 0
        }]
      });
    } catch (err) {
      console.error("Erreur sauvegarde réponse Phase 1:", err);
    }
  };

  // Sauvegarder les réponses Phase 2
  const savePhase2Responses = async (questionId, value) => {
    try {
      await api.post('/responses/phase2', {
        sessionToken,
        assessmentId,
        responses: [{
          questionId,
          responseValue: value
        }]
      });
    } catch (err) {
      console.error("Erreur sauvegarde réponse Phase 2:", err);
    }
  };

  // Calculer les résultats Phase 1
  const calculatePhase1Results = async () => {
    try {
      const response = await api.post('/results/calculate', {
        sessionToken,
        assessmentId,
        force: true
      });
      console.log("✅ Résultats Phase 1 calculés:", response.data);
      return true;
    } catch (err) {
      console.error("Erreur calcul résultats Phase 1:", err);
      return false;
    }
  };

  // Calculer les résultats finaux
  const calculateFinalResults = async () => {
    try {
      const response = await api.post('/results/calculate', {
        sessionToken,
        assessmentId,
        force: true,
        subjectiveRanking: {}
      });
      console.log("✅ Résultats finaux calculés:", response.data);
      return true;
    } catch (err) {
      console.error("Erreur calcul résultats finaux:", err);
      return false;
    }
  };

  // Finaliser le test et aller aux résultats
  const finalizeTest = async () => {
    setLoading(true);
    await calculateFinalResults();
    navigate("/orientations", { state: { assessmentId, sessionToken } });
    setLoading(false);
  };

  // Passer à la Phase 2
  const goToPhase2 = async () => {
    setCurrentPhase("PHASE2");
    setCurrentPage(0);
    setAnswers({});
    setSectionIndex(0);
    await fetchPhase2Questions(phase2Sections[0].name);
  };

  // Passer à la section suivante de Phase 2
  const goToNextSection = async () => {
    // Marquer la section actuelle comme complétée
    setPhase2SectionsCompleted(prev => ({
      ...prev,
      [currentSection]: true
    }));
    
    const currentIdx = phase2Sections.findIndex(s => s.name === currentSection);
    
    if (currentIdx + 1 < phase2Sections.length) {
      // Passer à la section suivante
      const nextSection = phase2Sections[currentIdx + 1].name;
      setSectionIndex(currentIdx + 1);
      setCurrentPage(0);
      setAnswers({});
      await fetchPhase2Questions(nextSection);
    } else {
      // Toutes les sections sont terminées, montrer la confirmation
      setShowConfirmPhase2Complete(true);
    }
  };

  // Chargement initial
  useEffect(() => {
    const loadTest = async () => {
      setLoading(true);
      setError(null);
      
      const sessionData = await initializeSession();
      
      if (sessionData && sessionData.sessionToken) {
        await fetchPhase1Questions(sessionData.sessionToken);
      }
      
      setLoading(false);
    };
    
    loadTest();
  }, []);

  // Pagination
  const totalPages = Math.ceil(currentQuestions.length / questionsPerPage);
  const paginatedQuestions = currentQuestions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);
  const total = currentQuestions.length;
  const answered = Object.keys(answers).length;
  const progress = total > 0 ? (answered / total) * 100 : 0;

  // Calculer la progression globale
  const getGlobalProgress = () => {
    if (currentPhase === "PHASE1") {
      return {
        phase: "Phase 1 - Intérêts",
        percentage: progress,
        description: "Évaluation de vos intérêts professionnels"
      };
    } else {
      const totalSections = phase2Sections.length;
      let completedCount = 0;
      phase2Sections.forEach(section => {
        if (phase2SectionsCompleted[section.name]) completedCount++;
      });
      
      let globalProgress = (completedCount * 100) / totalSections;
      if (currentSection) {
        globalProgress += (progress / totalSections);
      }
      
      const currentSectionData = phase2Sections.find(s => s.name === currentSection);
      
      return {
        phase: `Phase 2 - ${currentSectionData?.label || currentSection}`,
        percentage: Math.min(globalProgress, 100),
        description: currentSectionData?.description || "Évaluation approfondie"
      };
    }
  };

  const isPageComplete = (pageIndex) => {
    const start = pageIndex * questionsPerPage;
    const end = Math.min(start + questionsPerPage, currentQuestions.length);
    const pageQuestions = currentQuestions.slice(start, end);
    return pageQuestions.every((q) => answers[q.id]);
  };

  const isCurrentPageComplete = () => paginatedQuestions.every((q) => answers[q.id]);

  // Défilement automatique
  useEffect(() => {
    if (isManualNavigation) return;
    
    if (isCurrentPageComplete() && currentPage < totalPages - 1 && totalPages > 0) {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 800);
    }
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, [answers, currentPage, totalPages, isManualNavigation, isCurrentPageComplete]);

  const handleAnswer = async (questionId, value, question) => {
    const answerData = {
      value: value,
      riasecType: question.riasecType,
    };
    
    const newAnswers = { ...answers, [questionId]: answerData };
    setAnswers(newAnswers);
    
    if (currentPhase === "PHASE1") {
      await savePhase1Responses(questionId, value);
    } else {
      await savePhase2Responses(questionId, value);
    }
  };

  const handleNextPage = () => {
    if (!isCurrentPageComplete()) {
      const remaining = paginatedQuestions.filter(q => !answers[q.id]).length;
      alert(`Veuillez répondre à toutes les questions (${remaining} restantes sur cette page)`);
      return;
    }
    
    setIsManualNavigation(true);
    if (currentPage + 1 < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setIsManualNavigation(false), 2000);
    } else {
      // Dernière page de la section/phase
      if (currentPhase === "PHASE1") {
        // Fin de la Phase 1
        setShowConfirmPhase1(true);
      } else {
        // Fin de la section Phase 2 actuelle
        goToNextSection();
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setIsManualNavigation(true);
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setIsManualNavigation(false), 2000);
    }
  };

  const handleDotClick = (idx) => {
    if (isPageComplete(idx) || idx < currentPage) {
      setIsManualNavigation(true);
      setCurrentPage(idx);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setIsManualNavigation(false), 2000);
    } else {
      alert("Veuillez répondre à toutes les questions de cette page avant de continuer");
    }
  };

  const handlePhase1Complete = async () => {
    setShowConfirmPhase1(false);
    setLoading(true);
    await calculatePhase1Results();
    await goToPhase2();
    setLoading(false);
  };

  const handlePhase2Complete = async () => {
    setShowConfirmPhase2Complete(false);
    await finalizeTest();
  };

  // Rendu des options
  const renderOptions = (question) => {
    if (question.phase === "PHASE2") {
      const options = [1, 2, 3, 4, 5];
      return (
        <div className="slider-options scale-options">
          {options.map((val) => (
            <button
              key={val}
              className={`scale-btn ${answers[question.id]?.value === val ? "active" : ""}`}
              onClick={() => handleAnswer(question.id, val, question)}
            >
              <span className="scale-value">{val}</span>
              {question.valueLabels && question.valueLabels[val - 1] && (
                <span className="scale-label">{question.valueLabels[val - 1]}</span>
              )}
            </button>
          ))}
        </div>
      );
    }
    
    const options = [
      { value: 1, label: "Non", emoji: EmotionSvgs.sad },
      { value: 2, label: "Pas trop", emoji: EmotionSvgs.neutral },
      { value: 3, label: "Oui", emoji: EmotionSvgs.happy }
    ];
    
    return (
      <div className="slider-options">
        {options.map((option) => (
          <button
            key={option.value}
            className={`emotion-btn ${answers[question.id]?.value === option.value ? "active" : ""}`}
            onClick={() => handleAnswer(question.id, option.value, question)}
          >
            <div className="emotion-svg">{option.emoji}</div>
            <span className="emotion-label">{option.label}</span>
            {answers[question.id]?.value === option.value && (
              <span className="check-mark">✓</span>
            )}
          </button>
        ))}
      </div>
    );
  };

  const globalProgress = getGlobalProgress();

  if (loading) {
    return (
      <div className="test-page">
        <div className="test-container">
          <div className="loader" style={{ textAlign: 'center', padding: '50px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px' }}>
              {currentPhase === "PHASE1" 
                ? "Chargement des questions Phase 1..." 
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
          <div className="error-container" style={{ textAlign: 'center', padding: '50px' }}>
            <div className="error-message" style={{ color: 'red', marginBottom: '20px' }}>
              <strong>Erreur :</strong> {error}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#6246E5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentQuestions.length === 0) {
    return (
      <div className="test-page">
        <div className="test-container">
          <div className="error-container" style={{ textAlign: 'center', padding: '50px' }}>
            <p>Aucune question disponible</p>
            <button onClick={() => window.location.reload()} className="submit-btn">Recharger</button>
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
              <span className="phase-name">{globalProgress.phase}</span>
              <span className="phase-desc">{globalProgress.description}</span>
            </div>
            <div className="progress-stats">
              <span>{answered}/{total} questions</span>
              <span>{Math.round(globalProgress.percentage)}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${globalProgress.percentage}%` }} />
            </div>
          </div>
        </div>

        {/* Indicateur de section pour Phase 2 */}
        {currentPhase === "PHASE2" && (
          <div className="phase2-sections-indicator">
            {phase2Sections.map((section) => (
              <div 
                key={section.name}
                className={`section-badge ${section.name === currentSection ? "active" : ""} ${phase2SectionsCompleted[section.name] ? "completed" : ""}`}
              >
                <span className="section-icon">{section.icon}</span>
                <span className="section-name">{section.label}</span>
                {phase2SectionsCompleted[section.name] && <span className="section-check">✓</span>}
              </div>
            ))}
          </div>
        )}

        <div className="page-indicator-header">
          <span>Page {currentPage + 1} / {totalPages}</span>
          {isCurrentPageComplete() && (
            <span className="page-complete-badge">✓ Page complète !</span>
          )}
        </div>

        <div className="questions-grid">
          {paginatedQuestions.map((question) => (
            <div key={question.id} className={`question-card ${answers[question.id] ? "answered" : ""}`}>
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
            className="page-nav-btn prev-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            ← Page précédente
          </button>

          <div className="page-indicator">
            {Array.from({ length: Math.min(totalPages, 8) }).map((_, idx) => (
              <div
                key={idx}
                className={`page-dot ${currentPage === idx ? "active" : ""} ${isPageComplete(idx) ? "complete" : ""}`}
                onClick={() => handleDotClick(idx)}
              />
            ))}
            {totalPages > 8 && <span className="page-dots">...</span>}
          </div>

          <button className="page-nav-btn next-btn" onClick={handleNextPage}>
            {currentPage + 1 === totalPages 
              ? (currentPhase === "PHASE1" 
                  ? "Terminer Phase 1 →" 
                  : "Terminer cette section →")
              : "Page suivante →"}
          </button>
        </div>

        {/* Modal fin Phase 1 */}
        {showConfirmPhase1 && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-icon">🎉</div>
              <h3>Phase 1 terminée !</h3>
              <p>Vous avez répondu à toutes les questions de la Phase 1.</p>
              <div className="phase2-preview">
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  La Phase 2 contient 3 sections :
                </p>
                <ul style={{ textAlign: 'left', marginTop: '10px' }}>
                  <li>💼 Occupations (intérêt pour les métiers)</li>
                  <li>🧠 Aptitudes (vos compétences)</li>
                  <li>🌟 Personnalité (vos traits)</li>
                </ul>
              </div>
              <div className="modal-buttons">
                <button onClick={() => setShowConfirmPhase1(false)} className="modal-cancel">
                  Annuler
                </button>
                <button onClick={handlePhase1Complete} className="modal-confirm">
                  Passer à la Phase 2 →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal fin Phase 2 */}
        {showConfirmPhase2Complete && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-icon">🏆</div>
              <h3>Félicitations !</h3>
              <p>Vous avez terminé toutes les phases du test.</p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Vos résultats vont maintenant être analysés.
              </p>
              <div className="modal-buttons">
                <button onClick={handlePhase2Complete} className="modal-confirm">
                  Voir mes résultats →
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