import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/tests.css';

const questionsData = [
  // Réaliste (R)
  { id: 1, type: 'R', text: "Je préfère travailler avec des outils et des machines.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  { id: 2, type: 'R', text: "J'aime construire ou réparer des objets.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  { id: 3, type: 'R', text: "Je préfère les activités physiques plutôt que de rester assis.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  // Investigateur (I)
  { id: 4, type: 'I', text: "J'aime résoudre des problèmes complexes.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  { id: 5, type: 'I', text: "Je suis curieux(se) et j'aime apprendre de nouvelles choses.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  { id: 6, type: 'I', text: "J'aime analyser des données et tirer des conclusions.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  // Artistique (A)
  { id: 7, type: 'A', text: "J'aime créer des œuvres originales (dessin, musique, écriture).", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  { id: 8, type: 'A', text: "Je suis attiré(e) par les activités créatives et artistiques.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  { id: 9, type: 'A', text: "J'aime m'exprimer à travers l'art.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  // Social (S)
  { id: 10, type: 'S', text: "J'aime aider les autres à résoudre leurs problèmes.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  { id: 11, type: 'S', text: "Je préfère travailler en équipe plutôt que seul(e).", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  { id: 12, type: 'S', text: "J'aime enseigner ou former des personnes.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  // Entreprenant (E)
  { id: 13, type: 'E', text: "J'aime prendre des initiatives et diriger des projets.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  { id: 14, type: 'E', text: "Je suis persuasif(ve) et j'aime convaincre les autres.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  { id: 15, type: 'E', text: "J'aime les défis et la compétition.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  // Conventionnel (C)
  { id: 16, type: 'C', text: "Je suis organisé(e) et j'aime suivre des procédures.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  { id: 17, type: 'C', text: "Je préfère travailler avec des données et des chiffres.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] },
  { id: 18, type: 'C', text: "J'aime avoir un environnement de travail structuré.", options: ["Pas du tout", "Peu", "Moyennement", "Beaucoup", "Tout à fait"] }
];

const scoreMapping = {
  "Pas du tout": 1,
  "Peu": 2,
  "Moyennement": 3,
  "Beaucoup": 4,
  "Tout à fait": 5
};

const Test = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const currentQuestion = questionsData[currentIndex];
  const total = questionsData.length;
  const answered = Object.keys(answers).length;
  const progress = (answered / total) * 100;

  const handleAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      alert("Veuillez sélectionner une réponse");
      return;
    }
    if (currentIndex + 1 < total) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowConfirm(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const calculateResults = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    Object.entries(answers).forEach(([qId, answer]) => {
      const question = questionsData.find(q => q.id === parseInt(qId));
      if (question) {
        scores[question.type] += scoreMapping[answer];
        counts[question.type]++;
      }
    });

    Object.keys(scores).forEach(type => {
      if (counts[type] > 0) {
        scores[type] = Math.round((scores[type] / (counts[type] * 5)) * 100);
      }
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const code = sorted.slice(0, 3).map(([t]) => t).join('');

    return { riasec: scores, code };
  };

  const handleSubmit = () => {
    const results = calculateResults();
    localStorage.setItem('riasec_results', JSON.stringify(results));
    navigate('/orientations', { state: { results } });
  };

  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="test-page">
      <div className="test-wrapper">
        {/* Header */}
        <div className="test-header">
          <div className="test-logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">RIASEC Profiler</span>
          </div>
          <div className="test-progress">{Math.round(progress)}%</div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="question-card">
          <div className="question-counter">
            Question {currentIndex + 1} / {total}
          </div>
          <h2 className="question-text">{currentQuestion.text}</h2>

          <div className="options-container">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                className={`option-btn ${currentAnswer === opt ? 'selected' : ''}`}
                onClick={() => handleAnswer(opt)}
              >
                <span className="option-marker">{idx + 1}</span>
                <span className="option-text">{opt}</span>
                {currentAnswer === opt && <span className="check-icon">✓</span>}
              </button>
            ))}
          </div>

          <div className="nav-buttons">
            <button className="nav-btn prev" onClick={handlePrev} disabled={currentIndex === 0}>
              ← Précédent
            </button>
            <button className="nav-btn next" onClick={handleNext}>
              {currentIndex + 1 === total ? "Terminer" : "Suivant →"}
            </button>
          </div>
        </div>

        {showConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-icon">🎉</div>
              <h3>Terminer le test ?</h3>
              <p>Vous avez répondu à {answered} questions sur {total}</p>
              <div className="modal-buttons">
                <button onClick={() => setShowConfirm(false)} className="cancel">Continuer</button>
                <button onClick={handleSubmit} className="confirm">Voir mes résultats</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;