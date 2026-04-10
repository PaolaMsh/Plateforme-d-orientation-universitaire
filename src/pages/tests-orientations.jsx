import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/tests-orientations.css';

const Testsorientations = () => {
  const phases = [
    { id: 1, name: "Phase 1 : Amorçage" },
    { id: 2, name: "Phase 2 : Aptitude" },
    { id: 3, name: "Phase 3 : Compétence" },
    { id: 4, name: "Phase 4 : Personnalité" }
  ];

  return (
    <div className="preambule-container">
      <header className="preambule-header">
        <p>Découvrez vos talents et les métiers qui vous correspondent grâce à notre test</p>
      </header>

      <div className="choice-section">
        <h2>Comment souhaitez-vous passer le test ?</h2>
        <div className="choice-cards">
          <div className="card full-test">
            <h3>📋 Test complet</h3>
            <p>Répondez aux 4 phases du test pour un profil détaillé et des recommandations précises.</p>
            <Link
              to="/tests"
              state={{ mode: 'full', phases: phases.map(p => p.id) }}
              className="btn primary"
            >
              Commencer le test complet
            </Link>
          </div>

          <div className="card single-phase">
            <h3>🎯 Choisir une phase</h3>
            <p>Sélectionnez une étape spécifique du test.</p>
            <div className="phase-buttons">
              {phases.map(phase => (
                <Link
                  key={phase.id}
                  to="/tests"
                  state={{ mode: 'single', phaseId: phase.id }}
                  className="btn secondary"
                >
                  {phase.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>Comment ça marche ?</h3>
        <ul>
          <li><strong>Test complet</strong> : 4 phases successives. Vous pourrez faire une pause et reprendre plus tard.</li>
          <li><strong>Phase unique</strong> : choisissez une étape pour explorer un aspect particulier.</li>
          <li>À la fin, vous obtiendrez votre profil et une liste de métiers adaptés.</li>
          <li>L'IA analyse vos réponses pour affiner les recommandations.</li>
        </ul>
      </div>
    </div>
  );
};

export default Testsorientations;