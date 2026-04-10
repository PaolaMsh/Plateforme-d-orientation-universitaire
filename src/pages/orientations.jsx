import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/orientations.css';

const Orientations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('radar');

  useEffect(() => {
    const stateResults = location.state?.results;
    const storedResults = localStorage.getItem('riasec_results');
    
    if (stateResults) {
      setResults(stateResults);
    } else if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      navigate('/tests');
    }
  }, [location, navigate]);

  if (!results) {
    return (
      <div className="orientations-container">
        <div className="loader">Chargement de vos résultats...</div>
      </div>
    );
  }

  const { riasec, code } = results;

  const types = [
    { type: 'R', name: 'Réaliste', icon: '🛠️', color: '#FF6B6B', desc: 'Pratique, aime travailler avec des outils' },
    { type: 'I', name: 'Investigateur', icon: '🔬', color: '#4ECDC4', desc: 'Curieux, aime résoudre des problèmes' },
    { type: 'A', name: 'Artistique', icon: '🎨', color: '#FFE66D', desc: 'Créatif, aime s\'exprimer' },
    { type: 'S', name: 'Social', icon: '🤝', color: '#95E77E', desc: 'Aime aider les autres' },
    { type: 'E', name: 'Entreprenant', icon: '📈', color: '#FF9F4A', desc: 'Leader, prend des initiatives' },
    { type: 'C', name: 'Conventionnel', icon: '📊', color: '#A78BFA', desc: 'Organisé, méthodique' }
  ];

  const careersByType = {
    R: ['Mécanicien', 'Électricien', 'Ingénieur civil', 'Technicien', 'Agriculteur'],
    I: ['Médecin', 'Chercheur', 'Biologiste', 'Data Scientist', 'Pharmacien'],
    A: ['Designer', 'Architecte', 'Musicien', 'Écrivain', 'Photographe'],
    S: ['Enseignant', 'Psychologue', 'Infirmier', 'Travailleur social', 'Coach'],
    E: ['Entrepreneur', 'Manager', 'Commercial', 'Avocat', 'Consultant'],
    C: ['Comptable', 'Analyste financier', 'Secrétaire', 'Administrateur']
  };

  const formationsByType = {
    R: ['BTS Maintenance', 'Licence Génie civil', 'DUT Génie industriel'],
    I: ['Doctorat', 'Master Sciences', 'École de médecine', 'Master Data Science'],
    A: ['École des Beaux-Arts', 'Master Design', 'Licence Arts'],
    S: ['Master Psychologie', 'École normale', 'Licence Sociologie'],
    E: ['École de commerce', 'Master Management', 'Licence Économie'],
    C: ['BTS Comptabilité', 'Licence Gestion', 'Master Finance']
  };

  const sortedTypes = [...types].sort((a, b) => riasec[b.type] - riasec[a.type]);
  const dominantTypes = sortedTypes.slice(0, 3);

  return (
    <div className="orientations-page">
      <div className="orientations-wrapper">
        {/* En-tête */}
        <div className="orientations-header">
          <h1>🎉 Votre Profil RIASEC</h1>
          <p>Découvrez les métiers et formations qui vous correspondent</p>
        </div>

        <div className="code-card">
          <span className="code-label">Votre code</span>
          <span className="code-value">{code}</span>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === 'radar' ? 'active' : ''}`} onClick={() => setActiveTab('radar')}>
            📊 Profil
          </button>
          <button className={`tab ${activeTab === 'careers' ? 'active' : ''}`} onClick={() => setActiveTab('careers')}>
            💼 Métiers
          </button>
          <button className={`tab ${activeTab === 'formations' ? 'active' : ''}`} onClick={() => setActiveTab('formations')}>
            🎓 Formations
          </button>
        </div>

        {activeTab === 'radar' && (
          <div className="tab-content">
            <h3>Vos scores par type</h3>
            <div className="scores-list">
              {types.map(type => (
                <div key={type.type} className="score-item">
                  <div className="score-header">
                    <span className="score-icon">{type.icon}</span>
                    <span className="score-name">{type.name}</span>
                    <span className="score-percent">{riasec[type.type]}%</span>
                  </div>
                  <div className="score-bar-bg">
                    <div className="score-bar-fill" style={{ width: `${riasec[type.type]}%`, backgroundColor: type.color }}></div>
                  </div>
                  <p className="score-desc">{type.desc}</p>
                </div>
              ))}
            </div>

            <h3>✨ Vos types dominants</h3>
            <div className="dominants">
              {dominantTypes.map((type, idx) => (
                <div key={type.type} className="dominant-card" style={{ borderColor: type.color }}>
                  <div className="dominant-rank">#{idx + 1}</div>
                  <div className="dominant-icon">{type.icon}</div>
                  <div className="dominant-name">{type.name}</div>
                  <div className="dominant-score">{riasec[type.type]}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'careers' && (
          <div className="tab-content">
            <h3>Métiers recommandés</h3>
            {dominantTypes.map(type => (
              <div key={type.type} className="career-group">
                <div className="career-group-header" style={{ backgroundColor: `${type.color}15`, borderColor: type.color }}>
                  <span>{type.icon}</span> Type {type.name}
                </div>
                <div className="career-list">
                  {careersByType[type.type].map((career, idx) => (
                    <div key={idx} className="career-item">▹ {career}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'formations' && (
          <div className="tab-content">
            <h3>Formations recommandées</h3>
            {dominantTypes.map(type => (
              <div key={type.type} className="formation-group">
                <div className="formation-group-header" style={{ backgroundColor: `${type.color}15`, borderColor: type.color }}>
                  <span>{type.icon}</span> Type {type.name}
                </div>
                <div className="formation-list">
                  {formationsByType[type.type].map((formation, idx) => (
                    <div key={idx} className="formation-item">📖 {formation}</div>
                  ))}
                </div>
              </div>
            ))}

            <h3>🏫 Établissements au Bénin</h3>
            <div className="schools-grid">
              <div className="school-card">
                <h4>UAC - Abomey-Calavi</h4>
                <p>Sciences, Lettres, Droit, Economie</p>
              </div>
              <div className="school-card">
                <h4>ESGIS - Cotonou</h4>
                <p>Informatique, Gestion, Marketing</p>
              </div>
              <div className="school-card">
                <h4>IST - Porto-Novo</h4>
                <p>Génie civil, Informatique</p>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-print" onClick={() => window.print()}>🖨️ Imprimer</button>
              <button className="btn-retest" onClick={() => navigate('/tests')}>🔄 Refaire le test</button>
              <button className="btn-schools" onClick={() => navigate('/universites-formations')}>🏫 Voir les écoles</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orientations;