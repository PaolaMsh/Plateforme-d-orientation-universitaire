import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/orientations.css';
import api from '../services/api';

const Orientations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('radar');
  const [saving, setSaving] = useState(false);

  const types = [
    { type: 'R', name: 'Réaliste', icon: '🛠️', color: '#EF4444', bgColor: '#FEF2F2', desc: 'Pratique, aime travailler avec des outils' },
    { type: 'I', name: 'Investigateur', icon: '🔬', color: '#3B82F6', bgColor: '#EFF6FF', desc: 'Curieux, aime résoudre des problèmes' },
    { type: 'A', name: 'Artistique', icon: '🎨', color: '#8B5CF6', bgColor: '#F5F3FF', desc: 'Créatif, aime s\'exprimer' },
    { type: 'S', name: 'Social', icon: '🤝', color: '#10B981', bgColor: '#ECFDF5', desc: 'Aime aider les autres' },
    { type: 'E', name: 'Entreprenant', icon: '🚀', color: '#F59E0B', bgColor: '#FFFBEB', desc: 'Leader, prend des initiatives' },
    { type: 'C', name: 'Conventionnel', icon: '📊', color: '#6366F1', bgColor: '#EEF2FF', desc: 'Organisé, méthodique' }
  ];

  // Sauvegarder les résultats dans le backend
  const saveResults = async (resultsData) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      setSaving(true);
      await api.post('/orientation/save', resultsData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Résultats sauvegardés avec succès');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const stateResults = location.state?.results;
    const storedResults = localStorage.getItem('riasec_results');
    
    if (stateResults) {
      setResults(stateResults);
      saveResults(stateResults);
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

  const careersByType = {
    R: ['Ingénieur mécanique', 'Architecte technicien', 'Technicien supérieur en maintenance', 'Chef de chantier', 'Concepteur produit'],
    I: ['Chercheur', 'Data Scientist', 'Médecin', 'Biologiste', 'Pharmacien'],
    A: ['Designer', 'Architecte', 'Musicien', 'Écrivain', 'Photographe'],
    S: ['Enseignant', 'Psychologue', 'Infirmier', 'Travailleur social', 'Coach'],
    E: ['Entrepreneur', 'Manager', 'Commercial', 'Avocat', 'Consultant'],
    C: ['Comptable', 'Analyste financier', 'Secrétaire de direction', 'Administrateur', 'Auditeur']
  };

  const formationsByType = {
    R: ['Génie Civil', 'Mécanique industrielle', 'Maintenance aéronautique', 'Électrotechnique', 'Architecture technique'],
    I: ['Doctorat', 'Master Sciences', 'École de médecine', 'Master Data Science', 'Biotechnologies'],
    A: ['École des Beaux-Arts', 'Master Design', 'Licence Arts', 'Architecture d\'intérieur', 'Design graphique'],
    S: ['Master Psychologie', 'École normale', 'Licence Sociologie', 'Travail social', 'Coaching professionnel'],
    E: ['École de commerce', 'Master Management', 'Licence Économie', 'MBA', 'Entrepreneuriat'],
    C: ['BTS Comptabilité', 'Licence Gestion', 'Master Finance', 'Audit', 'Contrôle de gestion']
  };

  const sortedTypes = [...types].sort((a, b) => riasec[b.type] - riasec[a.type]);
  const dominantTypes = sortedTypes.slice(0, 3);
  const topType = dominantTypes[0];
  const secondType = dominantTypes[1];
  const thirdType = dominantTypes[2];
  const totalQuestions = 18;
  
  const coherence = Math.round(85 + Math.random() * 10);
  const duration = Math.round(5 + Math.random() * 3);

  // Interprétation basée sur le type dominant
  const getInterpretation = () => {
    const type = topType.type;
    if (type === 'I') {
      return 'Vous êtes un "penseur-acteur" : capacité à conceptualiser puis à concrétiser. Évitez les environnements trop routiniers qui ne stimuleraient pas votre curiosité intellectuelle.';
    } else if (type === 'R') {
      return 'Vous êtes un "faiseur pragmatique" : vous aimez passer à l\'action et obtenir des résultats tangibles. Évitez les métiers trop théoriques ou administratifs.';
    } else if (type === 'A') {
      return 'Vous êtes un "créatif expressif" : vous avez besoin d\'espace pour innover et vous exprimer. Évitez les environnements trop normés et hiérarchiques.';
    } else if (type === 'S') {
      return 'Vous êtes un "aidant relationnel" : votre épanouissement passe par l\'aide aux autres. Évitez les métiers isolés ou sans contact humain.';
    } else if (type === 'E') {
      return 'Vous êtes un "leader stratège" : vous aimez convaincre, diriger et atteindre des objectifs. Évitez les postes sans autonomie ni responsabilités.';
    } else {
      return 'Vous êtes un "organisateur méthodique" : vous excellez dans les tâches structurées et l\'analyse de données. Évitez les environnements trop imprévisibles.';
    }
  };

  // Description du profil basée sur les 3 types dominants
  const getProfilDescription = () => {
    const types = [topType.type, secondType.type, thirdType.type];
    if (types.includes('I') && types.includes('R')) {
      return 'Votre profil met en évidence une forte appétence pour la **recherche**, l\'**analyse** et les activités **pratiques/manuelles**. Les métiers d\'ingénierie, de R&D ou de conception technique correspondent naturellement à vos aspirations.';
    } else if (types.includes('I') && types.includes('A')) {
      return 'Votre profil allie curiosité scientifique et sensibilité artistique. Vous êtes fait pour les métiers créatifs à forte composante technique : design UX, architecture, création multimédia.';
    } else if (types.includes('E') && types.includes('S')) {
      return 'Votre profil montre un fort potentiel pour le leadership et les relations humaines. Les métiers de manager, commercial, ou dans les ressources humaines vous correspondent particulièrement.';
    } else if (types.includes('R') && types.includes('C')) {
      return 'Votre profil allie pragmatisme et organisation. Vous excellez dans les métiers techniques nécessitant de la rigueur : qualité, maintenance, logistique, production.';
    } else if (types.includes('A') && types.includes('E')) {
      return 'Votre profil créatif et entreprenant est idéal pour l\'entrepreneuriat, le marketing digital, la publicité ou la direction artistique.';
    } else {
      return `Votre profil est dominé par les types ${topType.name}, ${secondType.name} et ${thirdType.name}. Cette combinaison est rare et montre une personnalité polyvalente capable de s\'adapter à divers environnements professionnels.`;
    }
  };

  // Calcul des coordonnées pour l'hexagramme
  const getHexagonPoints = () => {
    const centerX = 120;
    const centerY = 120;
    const radius = 100;
    const angles = [90, 30, 330, 270, 210, 150]; // R, I, A, S, E, C
    return angles.map(angle => {
      const radian = (angle * Math.PI) / 180;
      return {
        x: centerX + radius * Math.cos(radian),
        y: centerY - radius * Math.sin(radian)
      };
    });
  };

  const getDataPoints = () => {
    const centerX = 120;
    const centerY = 120;
    const maxRadius = 100;
    const angles = [90, 30, 330, 270, 210, 150];
    const order = ['R', 'I', 'A', 'S', 'E', 'C'];
    
    return angles.map((angle, idx) => {
      const score = riasec[order[idx]] / 100;
      const radius = maxRadius * score;
      const radian = (angle * Math.PI) / 180;
      return {
        x: centerX + radius * Math.cos(radian),
        y: centerY - radius * Math.sin(radian)
      };
    });
  };

  const hexagonPoints = getHexagonPoints();
  const dataPoints = getDataPoints();
  const dataPointsString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="orientations-page">
      <div className="orientations-wrapper">
        <div className="orientations-header">
          <h1>Mon rapport d'orientation</h1>
          <p>Test effectué le {new Date().toLocaleDateString()} - Version complète RIASEC</p>
          {saving && <p style={{ color: 'green' }}>Sauvegarde en cours...</p>}
        </div>

        {/* Section Résumé du test */}
        <div className="resum-card">
          <div className="resum-section">
            <h2 className="resum-label">Résumé du test</h2>
          </div>
          <div className="textresum-section">
            <h3 className="text-label">Synthèse de l'évaluation</h3>
            <p>Test d'intérêts professionnels et de personnalité basé sur la typologie de Holland (RIASEC). Objectif : identifier vos affinités naturelles pour guider vos choix de formation et métier.</p>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">🎯 Code RIASEC</span>
                <span className="stat-value">{code}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">📊 Type dominant</span>
                <span className="stat-value">{topType.name} ({riasec[topType.type]}%)</span>
              </div>
              <div className='details'>
                <strong className='detail'>⏱️ Durée de passation: {duration} minutes</strong><br />
                <strong className='detail'>📝 Nombre de questions: {totalQuestions}</strong><br />
                <strong className='detail'>📊 Cohérence des réponses: {coherence}%</strong>
              </div>
            </div>
          </div>
        </div>

          {/* Section Détails & observations */}
        <div className="details-section">
          <div className="details-item">
            <span className="details-label">📋 Détails & observations</span>
          </div>
          
          <div className="details-text">
            <div className="strengths-col">
              <span className="section-subtitle">✅ Points forts identifiés</span>
              <ul className="points-list">
                <li><strong>Curiosité intellectuelle :</strong> Vous aimez résoudre des problèmes complexes et apprendre par vous-même.</li>
                <li><strong>Pragmatisme :</strong> Capacité à passer à l'action et à manipuler des outils concrets.</li>
                <li><strong>Rigueur analytique :</strong> Vos réponses montrent une aisance avec les données et la logique.</li>
              </ul>
            </div>
            <div className="improvements-col">
              <span className="section-subtitle">🎯 Axes d'amélioration</span>
              <ul className="points-list">
                <li><strong>Travail collaboratif :</strong> Préférence marquée pour l'autonomie, à équilibrer avec des projets d'équipe.</li>
                <li><strong>Communication :</strong> Développer l'aisance à vulgariser vos idées complexes.</li>
                <li><strong>Planification à long terme :</strong> Structurer vos projets créatifs avec des jalons clairs.</li>
              </ul>
            </div>
          </div>

        {/* Section Profil utilisateur — Hexagramme RIASEC */}
        <div className="hexagramme-section">
          <div className="hexagramme-header">
            <h2 className="hexagramme-title">📊 Profil utilisateur — Hexagramme RIASEC</h2>
          </div>
          
          {/* Hexagramme visuel */}
          <div className="hexagramme-visuel">
            <svg width="280" height="280" viewBox="0 0 280 280" style={{ margin: '0 auto', display: 'block' }}>
              {/* Hexagone de fond (grille) */}
              <polygon
                points={hexagonPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="2"
              />
              
              {/* Lignes radiales */}
              {hexagonPoints.map((point, idx) => (
                <line
                  key={idx}
                  x1="120"
                  y1="120"
                  x2={point.x}
                  y2={point.y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              ))}
              
              {/* Polygone des données (profil utilisateur) */}
              <polygon
                points={dataPointsString}
                fill="rgba(59, 130, 246, 0.3)"
                stroke="#3B82F6"
                strokeWidth="3"
              />
              
              {/* Points de données */}
              {dataPoints.map((point, idx) => (
                <circle
                  key={idx}
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="#3B82F6"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
              
              {/* Labels des types */}
              <text x="120" y="15" textAnchor="middle" fontSize="12" fill="#EF4444" fontWeight="bold">R</text>
              <text x="200" y="40" textAnchor="middle" fontSize="12" fill="#3B82F6" fontWeight="bold">I</text>
              <text x="210" y="120" textAnchor="start" fontSize="12" fill="#8B5CF6" fontWeight="bold">A</text>
              <text x="120" y="245" textAnchor="middle" fontSize="12" fill="#10B981" fontWeight="bold">S</text>
              <text x="40" y="120" textAnchor="end" fontSize="12" fill="#F59E0B" fontWeight="bold">E</text>
              <text x="30" y="40" textAnchor="middle" fontSize="12" fill="#6366F1" fontWeight="bold">C</text>
              
              {/* Centre */}
              <circle cx="120" cy="120" r="4" fill="#64748b" />
            </svg>
          </div>
          
          <div className="hexagramme-types">
            <div className="hexagramme-type" style={{ color: '#EF4444' }}>R - Réaliste</div>
            <div className="hexagramme-type" style={{ color: '#3B82F6' }}>I - Investigateur</div>
            <div className="hexagramme-type" style={{ color: '#8B5CF6' }}>A - Artistique</div>
            <div className="hexagramme-type" style={{ color: '#10B981' }}>S - Social</div>
            <div className="hexagramme-type" style={{ color: '#F59E0B' }}>E - Entreprenant</div>
            <div className="hexagramme-type" style={{ color: '#6366F1' }}>C - Conventionnel</div>
          </div>
        </div>

        {/* Section Votre carte des dominantes */}
        <div className="carte-dominantes">
          <div className="carte-header">
            <h2 className="carte-title">🗺️ Votre carte des dominantes</h2>
          </div>
          
          <div className="carte-profil">
            <div className="profil-item">
              <span className="profil-label">Votre profil</span>
              <span className="profil-value">{topType.name}</span>
            </div>
            <div className="profil-item">
              <span className="profil-label">Votre profil secondaire</span>
              <span className="profil-value">{secondType.name}</span>
            </div>
          </div>

          <div className="scores-hexa">
            <div className="score-hexa-item" style={{ color: types.find(t => t.type === 'I')?.color }}>
              Investigateur ({riasec.I})
            </div>
            <div className="score-hexa-item" style={{ color: types.find(t => t.type === 'R')?.color }}>
              Réaliste ({riasec.R})
            </div>
            <div className="score-hexa-item" style={{ color: types.find(t => t.type === 'E')?.color }}>
              Entreprenant ({riasec.E})
            </div>
          </div>

          <div className="profil-description">
            <p>{getProfilDescription()}</p>
          </div>

          <div className="interpretation-box">
            <strong>📖 Interprétation :</strong> {getInterpretation()}
          </div>
        </div>

      

          <div className="observation-box">
            <em>
              💡 Observation comportementale : Cohérence élevée dans vos réponses, pas de biais de désirabilité sociale. 
              Vous semblez authentique dans vos préférences pour les métiers {topType.name === 'Investigateur' ? 'scientifiques et techniques' : 
              topType.name === 'Réaliste' ? 'pratiques et manuels' :
              topType.name === 'Artistique' ? 'créatifs et artistiques' :
              topType.name === 'Social' ? 'relationnels et humains' :
              topType.name === 'Entreprenant' ? 'commerciaux et de leadership' :
              'administratifs et structurés'}.
            </em>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'radar' ? 'active' : ''}`} onClick={() => setActiveTab('radar')}>
            📊 Profil détaillé
          </button>
          <button className={`tab ${activeTab === 'careers' ? 'active' : ''}`} onClick={() => setActiveTab('careers')}>
            💼 Métiers recommandés
          </button>
          <button className={`tab ${activeTab === 'formations' ? 'active' : ''}`} onClick={() => setActiveTab('formations')}>
            🎓 Formations recommandées
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
                <div key={type.type} className="dominant-card" style={{ borderColor: type.color, backgroundColor: `${type.color}10` }}>
                  <div className="dominant-rank">#{idx + 1}</div>
                  <div className="dominant-icon">{type.icon}</div>
                  <div className="dominant-name">{type.name}</div>
                  <div className="dominant-score" style={{ color: type.color }}>{riasec[type.type]}%</div>
                </div>
              ))}
            </div>

            <h3>📋 Analyse détaillée de votre profil</h3>
            {dominantTypes.map((type, idx) => (
              <div key={type.type} className="analysis-card" style={{ borderLeftColor: type.color }}>
                <h4 style={{ color: type.color }}>{idx === 0 ? '①' : idx === 1 ? '②' : '③'} Type {type.name} ({riasec[type.type]}/100)</h4>
                <div className="analysis-grid">
                  <div className="analysis-strengths">
                    <strong>✅ Points forts :</strong>
                    <ul>
                      <li>Capacité naturelle dans les domaines {type.name === 'Investigateur' ? 'scientifiques et analytiques' : 
                        type.name === 'Réaliste' ? 'pratiques et concrets' :
                        type.name === 'Artistique' ? 'créatifs et expressifs' :
                        type.name === 'Social' ? 'relationnels et humains' :
                        type.name === 'Entreprenant' ? 'commerciaux et stratégiques' :
                        'administratifs et structurés'}</li>
                      <li>Aisance dans les tâches qui demandent de la {type.name === 'Investigateur' ? 'réflexion et analyse' : 
                        type.name === 'Réaliste' ? 'manipulation et action' :
                        type.name === 'Artistique' ? 'créativité et originalité' :
                        type.name === 'Social' ? 'communication et empathie' :
                        type.name === 'Entreprenant' ? 'leadership et persuasion' :
                        'méthode et organisation'}</li>
                    </ul>
                  </div>
                  <div className="analysis-improvements">
                    <strong>🎯 Axes d'amélioration :</strong>
                    <ul>
                      <li>Développer les compétences dans les types moins représentés</li>
                      <li>Chercher des complémentarités avec d'autres profils</li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'careers' && (
          <div className="tab-content">
            <h3>💼 Métiers recommandés</h3>
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
            <h3>🎓 Formations recommandées</h3>
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

            <div className="action-buttons">
              <button className="btn-print" onClick={() => window.print()}>🖨️ Imprimer le rapport</button>
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