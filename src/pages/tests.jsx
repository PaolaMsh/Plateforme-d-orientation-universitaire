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

const questionsData = [
  { id: 1, type: "R", text: "Je préfère travailler avec des outils et des machines." },
  { id: 2, type: "R", text: "J'aime construire ou réparer des objets." },
  { id: 3, type: "R", text: "Je préfère les activités physiques plutôt que de rester assis." },
  { id: 4, type: "I", text: "J'aime résoudre des problèmes complexes." },
  { id: 5, type: "I", text: "Je suis curieux(se) et j'aime apprendre de nouvelles choses." },
  { id: 6, type: "I", text: "J'aime analyser des données et tirer des conclusions." },
  { id: 7, type: "A", text: "J'aime créer des œuvres originales (dessin, musique, écriture)." },
  { id: 8, type: "A", text: "Je suis attiré(e) par les activités créatives et artistiques." },
  { id: 9, type: "A", text: "J'aime m'exprimer à travers l'art." },
  { id: 10, type: "S", text: "J'aime aider les autres à résoudre leurs problèmes." },
  { id: 11, type: "S", text: "Je préfère travailler en équipe plutôt que seul(e)." },
  { id: 12, type: "S", text: "J'aime enseigner ou former des personnes." },
  { id: 13, type: "E", text: "J'aime prendre des initiatives et diriger des projets." },
  { id: 14, type: "E", text: "Je suis persuasif(ve) et j'aime convaincre les autres." },
  { id: 15, type: "E", text: "J'aime les défis et la compétition." },
  { id: 16, type: "C", text: "Je suis organisé(e) et j'aime suivre des procédures." },
  { id: 17, type: "C", text: "Je préfère travailler avec des données et des chiffres." },
  { id: 18, type: "C", text: "J'aime avoir un environnement de travail structuré." },
];

const scoreMapping = { Non: 1, "Pas trop": 2, Oui: 3 };

const Test = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const autoAdvanceRef = useRef(null);
  const questionsPerPage = 6;
  const totalPages = Math.ceil(questionsData.length / questionsPerPage);
  const currentQuestions = questionsData.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);
  const total = questionsData.length;
  const answered = Object.keys(answers).length;
  const progress = (answered / total) * 100;

  const isCurrentPageComplete = () => currentQuestions.every((q) => answers[q.id]);

  useEffect(() => {
    if (isCurrentPageComplete()) {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      
      if (currentPage + 1 < totalPages) {
        autoAdvanceRef.current = setTimeout(() => {
          setCurrentPage((prev) => prev + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 600); 
      } else if (answered === total) {
        autoAdvanceRef.current = setTimeout(() => setShowConfirm(true), 600);
      }
    }
  }, [answers, currentPage]);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const calculateResults = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    Object.entries(answers).forEach(([qId, answer]) => {
      const question = questionsData.find((q) => q.id === parseInt(qId));
      if (question) {
        scores[question.type] += scoreMapping[answer];
        counts[question.type]++;
      }
    });
    Object.keys(scores).forEach((type) => {
      if (counts[type] > 0) scores[type] = Math.round((scores[type] / (counts[type] * 3)) * 100);
    });
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
        await api.post('/orientation/save', results, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Erreur sauvegarde résultats:', error);
      } finally {
        setSaving(false);
      }
    }
    
    navigate("/orientations", { state: { results } });
  };

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
              <span>{answered}/{total} questions</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="page-indicator-header">
          <span>Page {currentPage + 1} / {totalPages}</span>
        </div>

        <div className="questions-grid">
          {currentQuestions.map((question) => (
            <div key={question.id} className={`question-card ${answers[question.id] ? "answered" : ""}`}>
              <h3 className="question-text">{question.text}</h3>
              <div className="emotion-slider">
                <div className="slider-options">
                  {[
                    { value: "Non", emoji: EmotionSvgs.sad, label: "Non" },
                    { value: "Pas trop", emoji: EmotionSvgs.neutral, label: "Pas trop" },
                    { value: "Oui", emoji: EmotionSvgs.happy, label: "Oui" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`emotion-btn ${answers[question.id] === option.value ? "active" : ""}`}
                      onClick={() => handleAnswer(question.id, option.value)}
                    >
                      <div className="emotion-svg">{option.emoji}</div>
                      <span className="emotion-label">{option.label}</span>
                      {/* Coche verte sur l'option sélectionnée */}
                      {answers[question.id] === option.value && (
                        <span className="check-mark">✓</span>
                      )}
                    </button>
                  ))}
                </div>
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
            {Array.from({ length: totalPages }).map((_, idx) => (
              <div
                key={idx}
                className={`page-dot ${currentPage === idx ? "active" : ""}`}
              />
            ))}
          </div>

          <div className="page-nav-placeholder" style={{ width: '120px' }} />
        </div>

        {showConfirm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-icon">🎉</div>
              <h3>Terminer le test ?</h3>
              <p>Vous avez répondu à {answered} questions sur {total}</p>
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