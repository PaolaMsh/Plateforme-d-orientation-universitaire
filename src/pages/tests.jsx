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

const Test = () => {
  const navigate = useNavigate();
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  // Récupérer les questions depuis l'API
  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      
      console.log("🟡 Récupération des questions...");
      
      const response = await api.get('/questions/phase1', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("📦 Réponse API:", response.data);
      
      if (response.data.success && response.data.data) {
        const questionsData = response.data.data;
        
        // Transformer les données selon la structure reçue
        const formattedQuestions = questionsData.map(q => ({
          id: q.id,
          text: q.text,
          riasecType: q.riasecType,
          short: q.short || null,
          subtext: q.subtext || null,
          minValue: q.minValue || 1,
          maxValue: q.maxValue || 3,
          valueLabels: q.valueLabels || ["Non", "Pas trop", "Oui"],
          pointsValue: q.pointsValue || 1,
          profiles: q.profiles || null,
          sectionType: q.sectionType || null
        }));
        
        setCurrentQuestions(formattedQuestions);
        console.log(`✅ ${formattedQuestions.length} questions chargées`);
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (err) {
      console.error("❌ Erreur chargement questions:", err);
      setError(err.response?.data?.message || "Impossible de charger les questions");
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      await fetchQuestions();
      setLoading(false);
    };
    
    loadQuestions();
  }, []);

  const handleAnswer = (questionId, value, question) => {
    // Calculer le score normalisé (0-1)
    let normalizedScore;
    if (question.minValue && question.maxValue) {
      normalizedScore = (value - question.minValue) / (question.maxValue - question.minValue);
    } else {
      normalizedScore = value / 3;
    }
    
    // Gérer les poids si présents (pour les questions avec plusieurs profils)
    let answerData = {
      value: value,
      score: normalizedScore,
      riasecType: question.riasecType,
      pointsValue: question.pointsValue || 1
    };
    
    // Si la question a des profiles (plusieurs types RIASEC avec poids)
    if (question.profiles && question.profiles.length > 0) {
      answerData.profiles = question.profiles;
    }
    
    const newAnswers = { ...answers, [questionId]: answerData };
    setAnswers(newAnswers);
    
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowConfirm(true);
    }
  };

  const calculateResults = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    Object.values(answers).forEach((answer) => {
      // Si la question a des profiles multiples
      if (answer.profiles && answer.profiles.length > 0) {
        answer.profiles.forEach(profile => {
          const type = profile.riasecType;
          const weight = profile.weight || 1;
          if (scores[type] !== undefined) {
            scores[type] += answer.score * weight;
            counts[type] += weight;
          }
        });
      } 
      // Sinon, utiliser le riasecType simple
      else if (answer.riasecType) {
        const type = answer.riasecType;
        const weight = answer.pointsValue || 1;
        if (scores[type] !== undefined) {
          scores[type] += answer.score * weight;
          counts[type] += weight;
        }
      }
    });
    
    // Calculer les pourcentages
    Object.keys(scores).forEach((type) => {
      if (counts[type] > 0) {
        scores[type] = Math.round((scores[type] / counts[type]) * 100);
      } else {
        scores[type] = 0;
      }
    });
    
    // Trier pour obtenir le code RIASEC
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const code = sorted.slice(0, 3).map(([t]) => t).join("");
    
    return { riasec: scores, code };
  };

  const handleSubmit = async () => {
    const results = calculateResults();
    localStorage.setItem("riasec_results", JSON.stringify(results));
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setSaving(true);
        await api.post('/orientation/save', {
          results: results,
          answers: answers,
          completedAt: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Résultats sauvegardés');
      } catch (error) {
        console.error('❌ Erreur sauvegarde:', error);
      } finally {
        setSaving(false);
      }
    }
    
    navigate("/orientations", { state: { results } });
  };

  const currentQuestion = currentQuestions[currentIndex];
  const progress = currentQuestions.length > 0 ? ((currentIndex + 1) / currentQuestions.length) * 100 : 0;

  // Rendu des options selon le type de question
  const renderOptions = (question) => {
    if (!question) return null;
    
    // Cas des questions avec valueLabels personnalisés (échelle 1-5 par exemple)
    if (question.valueLabels && question.valueLabels.length > 0) {
      const totalSteps = question.valueLabels.length;
      const step = (question.maxValue - question.minValue) / (totalSteps - 1);
      
      return (
        <div className="slider-options">
          {question.valueLabels.map((label, idx) => {
            const value = question.minValue + (idx * step);
            let emoji = EmotionSvgs.neutral;
            
            // Assigner l'émotion selon la position
            if (idx === 0) emoji = EmotionSvgs.sad;
            if (idx === totalSteps - 1) emoji = EmotionSvgs.happy;
            
            return (
              <button
                key={idx}
                className={`emotion-btn ${answers[question.id]?.value === value ? "active" : ""}`}
                onClick={() => handleAnswer(question.id, value, question)}
              >
                <div className="emotion-svg">{emoji}</div>
                <span className="emotion-label">{label}</span>
                {answers[question.id]?.value === value && (
                  <span className="check-mark">✓</span>
                )}
              </button>
            );
          })}
        </div>
      );
    }
    
    // Format par défaut (Non, Pas trop, Oui)
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

  if (loading) {
    return (
      <div className="test-page">
        <div className="test-container">
          <div className="loader" style={{ textAlign: 'center', padding: '50px' }}>
            Chargement des questions...
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
              {error}
            </div>
            <button 
              onClick={() => {
                setCurrentIndex(0);
                setAnswers({});
                window.location.reload();
              }} 
              style={{
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

  return (
    <div className="test-page">
      <div className="test-container">
        <div className="test-header">
          <div className="logo-section">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">RIASEC Profiler</span>
          </div>
          <div className="progress-section">
            <div className="progress-stats">
              <span>Question {currentIndex + 1}/{currentQuestions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {currentQuestion && (
          <div className="questions-grid">
            <div className={`question-card ${answers[currentQuestion.id] ? "answered" : ""}`}>
              <h3 className="question-text">{currentQuestion.text}</h3>
              {currentQuestion.subtext && (
                <p className="question-subtext" style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                  {currentQuestion.subtext}
                </p>
              )}
              {currentQuestion.short && !currentQuestion.subtext && (
                <p className="question-short" style={{ color: '#6246E5', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {currentQuestion.short}
                </p>
              )}
              <div className="emotion-slider">
                {renderOptions(currentQuestion)}
              </div>
            </div>
          </div>
        )}

        {showConfirm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-icon">🎉</div>
              <h3>Terminer le test ?</h3>
              <p>Vous avez répondu à toutes les questions</p>
              {saving && <p>Sauvegarde en cours...</p>}
              <div className="modal-buttons">
                <button onClick={() => setShowConfirm(false)} className="modal-cancel">Continuer</button>
                <button onClick={handleSubmit} className="modal-confirm" disabled={saving}>
                  {saving ? "Sauvegarde..." : "Voir mes résultats"}
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