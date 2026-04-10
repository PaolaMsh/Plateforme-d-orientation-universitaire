import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/tests.css';

const questionsData = {
  1: [ 
    { id: 1, text: "Je préfère travailler en extérieur plutôt qu'en bureau.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
    { id: 2, text: "Les métiers artistiques m'attirent.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
    { id: 3, text: "J'aime aider les autres dans leur travail.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] }
  ],
  2: [ 
    { id: 4, text: "Résoudre des problèmes logiques me stimule.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
    { id: 5, text: "Je comprends rapidement des instructions complexes.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] }
  ],
  3: [ 
    { id: 6, text: "Je maîtrise les outils bureautiques (Excel, Word, etc.).", options: ["Non", "Bases", "Intermédiaire", "Avancé", "Expert"] },
    { id: 7, text: "J'ai des compétences en programmation.", options: ["Non", "Bases", "Intermédiaire", "Avancé", "Expert"] }
  ],
  4: [ 
    { id: 8, text: "Je suis plutôt organisé(e) et planificateur(trice).", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
    { id: 9, text: "Je m'adapte facilement aux changements.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] }
  ]
};

const totalQuestions = Object.values(questionsData).flat().length;

// Mapping des options vers des scores RIASEC
const optionScores = {
  "Pas du tout": { R: 1, I: 1, A: 1, S: 1, E: 1, C: 1 },
  "Peu": { R: 2, I: 2, A: 2, S: 2, E: 2, C: 2 },
  "Moyennement": { R: 3, I: 3, A: 3, S: 3, E: 3, C: 3 },
  "Beaucoup": { R: 4, I: 4, A: 4, S: 4, E: 4, C: 4 },
  "Tout à fait": { R: 5, I: 5, A: 5, S: 5, E: 5, C: 5 },
  "Non": { R: 1, I: 1, A: 1, S: 1, E: 1, C: 1 },
  "Bases": { R: 2, I: 2, A: 2, S: 2, E: 2, C: 2 },
  "Intermédiaire": { R: 3, I: 3, A: 3, S: 3, E: 3, C: 3 },
  "Avancé": { R: 4, I: 4, A: 4, S: 4, E: 4, C: 4 },
  "Expert": { R: 5, I: 5, A: 5, S: 5, E: 5, C: 5 }
};

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, phaseId, phases } = location.state || {};

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  let phaseList = [];
  if (mode === 'full' && phases) {
    phaseList = phases; 
  } else if (mode === 'single' && phaseId) {
    phaseList = [phaseId];
  } else if (mode === 'resume' && phaseId) {
    phaseList = [phaseId, ...(phases?.filter(p => p > phaseId) || [])];
  } else {
    phaseList = [1, 2, 3, 4];
  }

  const currentPhaseId = phaseList[currentPhaseIndex];
  const currentQuestions = questionsData[currentPhaseId] || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalPhases = phaseList.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  const currentSelectedValue = answers[currentQuestion?.id] || null;

  // Thèmes des phases
  const phaseThemes = {
    1: { name: "Préférences personnelles", icon: "🎯", color: "#6246E5", desc: "Découvrez ce qui vous motive vraiment" },
    2: { name: "Capacités cognitives", icon: "🧠", color: "#10B981", desc: "Évaluez votre façon de penser" },
    3: { name: "Compétences techniques", icon: "💻", color: "#F59E0B", desc: "Identifiez vos savoir-faire" },
    4: { name: "Traits de personnalité", icon: "⭐", color: "#EF4444", desc: "Comprenez votre caractère" }
  };

  const currentTheme = phaseThemes[currentPhaseId] || phaseThemes[1];

  useEffect(() => {
    const saved = localStorage.getItem('testProgress');
    if (saved && mode === 'resume') {
      const { answers: savedAnswers, lastPhase, lastQuestion } = JSON.parse(saved);
      setAnswers(savedAnswers || {});
      const phaseIdx = phaseList.findIndex(p => p === lastPhase);
      if (phaseIdx !== -1) {
        setCurrentPhaseIndex(phaseIdx);
        setCurrentQuestionIndex(lastQuestion || 0);
      }
    }
    setLoading(false);
  }, [mode, phaseList]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('testProgress', JSON.stringify({
        answers,
        lastPhase: currentPhaseId,
        lastQuestion: currentQuestionIndex,
        timestamp: Date.now(),
        mode,
        phases: phaseList
      }));
    }
  }, [answers, currentPhaseId, currentQuestionIndex, loading, mode, phaseList]);

  const handleOptionSelect = (optionValue) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionValue
    }));
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleNext = () => {
    if (!currentSelectedValue) {
      alert("Veuillez sélectionner une réponse.");
      return;
    }

    if (currentQuestionIndex + 1 < currentQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      if (currentPhaseIndex + 1 < totalPhases) {
        setCurrentPhaseIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        setShowConfirmSubmit(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentPhaseIndex > 0) {
      const prevPhaseId = phaseList[currentPhaseIndex - 1];
      const prevQuestions = questionsData[prevPhaseId];
      setCurrentPhaseIndex(prev => prev - 1);
      setCurrentQuestionIndex(prevQuestions.length - 1);
    }
  };

  const calculateRIASEC = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    let count = 0;
    
    Object.values(answers).forEach(answer => {
      if (optionScores[answer]) {
        Object.keys(scores).forEach(type => {
          scores[type] += optionScores[answer][type];
        });
        count++;
      }
    });
    
    if (count > 0) {
      Object.keys(scores).forEach(type => {
        scores[type] = Math.round((scores[type] / count) * 20);
      });
    }
    
    return scores;
  };

  const submitTest = () => {
    const riasecScores = calculateRIASEC();
    const sortedTypes = Object.entries(riasecScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type]) => type);
    
    const results = {
      riasec: riasecScores,
      code: sortedTypes.join(''),
      answers: answers,
      timestamp: Date.now()
    };

    localStorage.setItem('testResults', JSON.stringify(results));
    localStorage.removeItem('testProgress');
    navigate('/orientations', { state: { results } });
  };

  if (loading) {
    return (
      <div className="test-container">
        <div className="loader-wrapper">
          <div className="loader-spinner"></div>
          <p>Chargement de votre test...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="test-container">Erreur : aucune question trouvée.</div>;
  }

  const isLastQuestion = (currentPhaseIndex === totalPhases - 1) && (currentQuestionIndex === currentQuestions.length - 1);

  return (
    <div className="test-wrapper">
      {/* Header avec logo et progression */}
      <div className="test-header">
        <div className="test-header-content">
          <div className="test-logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">RIASEC Profiler</span>
          </div>
          <div className="test-stats">
            <div className="stat-badge">
              <span className="stat-icon">📊</span>
              <span>{Math.round((answeredCount / totalQuestions) * 100)}% complété</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de progression principale */}
      <div className="main-progress-container">
        <div className="main-progress-bar">
          <div className="main-progress-fill" style={{ width: `${progressPercent}%`, backgroundColor: currentTheme.color }}></div>
        </div>
        <div className="main-progress-stats">
          <span>✅ {answeredCount} questions répondues</span>
          <span>📝 {totalQuestions - answeredCount} restantes</span>
        </div>
      </div>

      {/* Phase indicator */}
      <div className="phase-indicator-container">
        <div className="phase-badge" style={{ backgroundColor: currentTheme.color }}>
          <span className="phase-icon">{currentTheme.icon}</span>
          <span>Phase {currentPhaseId} — {currentTheme.name}</span>
        </div>
        <p className="phase-description">{currentTheme.desc}</p>
        <div className="phase-steps">
          {phaseList.map((phase, idx) => (
            <div 
              key={phase}
              className={`phase-step ${idx < currentPhaseIndex ? 'completed' : ''} ${idx === currentPhaseIndex ? 'active' : ''}`}
              style={{ borderColor: idx === currentPhaseIndex ? currentTheme.color : '#e2e8f0' }}
            >
              <span className="phase-step-number">{phase}</span>
              <span className="phase-step-label">Phase {phase}</span>
              {idx < currentPhaseIndex && <span className="phase-check">✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className={`question-card ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        <div className="question-progress">
          <div className="question-progress-header">
            <span className="question-counter">
              Question {currentQuestionIndex + 1} / {currentQuestions.length}
            </span>
            <span className="question-phase-badge" style={{ backgroundColor: `${currentTheme.color}20`, color: currentTheme.color }}>
              {currentTheme.icon} Phase {currentPhaseId}
            </span>
          </div>
          <div className="question-progress-bar">
            <div 
              className="question-progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`, backgroundColor: currentTheme.color }}
            ></div>
          </div>
        </div>

        <h2 className="question-text">{currentQuestion.text}</h2>
        
        <div className="options-grid">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = currentSelectedValue === opt;
            return (
              <button
                key={idx}
                className={`option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(opt)}
                style={{
                  borderColor: isSelected ? currentTheme.color : '#e2e8f0',
                  backgroundColor: isSelected ? `${currentTheme.color}10` : 'white'
                }}
              >
                <span className="option-marker">
                  {isSelected && <span className="check-mark" style={{ color: currentTheme.color }}>✓</span>}
                </span>
                <span className="option-text">{opt}</span>
              </button>
            );
          })}
        </div>

        <div className="navigation-buttons">
          <button 
            onClick={handlePrevious} 
            disabled={currentPhaseIndex === 0 && currentQuestionIndex === 0}
            className="nav-btn prev-btn"
          >
            ← Précédent
          </button>
          <button onClick={handleNext} className="nav-btn next-btn" style={{ backgroundColor: currentTheme.color }}>
            {isLastQuestion ? "🎉 Terminer" : "Suivant →"}
          </button>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showConfirmSubmit && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">🎯</div>
            <h3>Prêt à découvrir votre profil ?</h3>
            <p>Vous avez répondu à <strong>{answeredCount}</strong> questions sur <strong>{totalQuestions}</strong>.</p>
            <p className="modal-warning">Vos réponses seront analysées pour déterminer votre profil RIASEC.</p>
            <div className="modal-buttons">
              <button onClick={() => setShowConfirmSubmit(false)} className="cancel-btn">
                Continuer le test
              </button>
              <button onClick={submitTest} className="confirm-btn">
                Voir mes résultats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;