import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/orientations.css';
import api from '../services/api';

const Orientations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('radar');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Données provenant UNIQUEMENT de l'API
  const [resultData, setResultData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [careers, setCareers] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [trainingPaths, setTrainingPaths] = useState([]);

  const types = [
    { type: 'R', name: 'Réaliste', icon: '🛠️', color: '#EF4444', bgColor: '#FEF2F2', desc: 'Pratique, aime travailler avec des outils', details: 'Métiers manuels, techniques, concrets. Aime les activités physiques et les résultats tangibles.' },
    { type: 'I', name: 'Investigateur', icon: '🔬', color: '#3B82F6', bgColor: '#EFF6FF', desc: 'Curieux, aime résoudre des problèmes', details: 'Métiers scientifiques, analytiques, de recherche. Aime observer, apprendre et résoudre des problèmes complexes.' },
    { type: 'A', name: 'Artistique', icon: '🎨', color: '#8B5CF6', bgColor: '#F5F3FF', desc: 'Créatif, aime s\'exprimer', details: 'Métiers créatifs, artistiques, d\'expression. Aime l\'innovation, l\'originalité et la liberté d\'expression.' },
    { type: 'S', name: 'Social', icon: '🤝', color: '#10B981', bgColor: '#ECFDF5', desc: 'Aime aider les autres', details: 'Métiers relationnels, éducatifs, de soin. Aime collaborer, enseigner et aider les autres à se développer.' },
    { type: 'E', name: 'Entreprenant', icon: '🚀', color: '#F59E0B', bgColor: '#FFFBEB', desc: 'Leader, prend des initiatives', details: 'Métiers commerciaux, managériaux, de leadership. Aime convaincre, diriger et atteindre des objectifs.' },
    { type: 'C', name: 'Conventionnel', icon: '📊', color: '#6366F1', bgColor: '#EEF2FF', desc: 'Organisé, méthodique', details: 'Métiers administratifs, de gestion, de données. Aime l\'ordre, la précision et les tâches structurées.' }
  ];

  // Appels API (identiques à avant)
  const fetchResults = async (assessmentId) => {
    try {
      const response = await api.get(`/results/assessment/${assessmentId}`);
      if (response.data.success && response.data.data) {
        setResultData(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      console.error("Erreur récupération résultats:", err);
    }
  };

  const fetchAssessment = async (assessmentId, sessionToken) => {
    try {
      const response = await api.get(`/assessments/${assessmentId}`, {
        params: { sessionToken }
      });
      if (response.data.success && response.data.data) {
        setAssessmentData(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      console.error("Erreur récupération assessment:", err);
    }
  };

  const fetchProgress = async (assessmentId, sessionToken) => {
    try {
      const response = await api.get(`/assessments/${assessmentId}/progress`, {
        params: { sessionToken }
      });
      if (response.data.success && response.data.data) {
        setProgressData(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      console.error("Erreur récupération progression:", err);
    }
  };

  const fetchCareers = async () => {
    try {
      const response = await api.get('/careers', {
        params: { activeOnly: true, limit: 50 }
      });
      if (response.data.success && response.data.data) {
        setCareers(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      console.error("Erreur récupération carrières:", err);
    }
  };

  const fetchTrainingCenters = async () => {
    try {
      const response = await api.get('/training-centers', {
        params: { activeOnly: true, limit: 20 }
      });
      if (response.data.success && response.data.data) {
        setTrainingCenters(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      console.error("Erreur récupération centres formation:", err);
    }
  };

  const fetchTrainingPaths = async () => {
    try {
      const response = await api.get('/training-paths', {
        params: { activeOnly: true, limit: 20 }
      });
      if (response.data.success && response.data.data) {
        setTrainingPaths(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      console.error("Erreur récupération parcours formation:", err);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      
      const sessionToken = location.state?.sessionToken || localStorage.getItem('session_token');
      const assessmentId = location.state?.assessmentId || localStorage.getItem('assessment_id');
      
      if (!sessionToken || !assessmentId) {
        setError("Session introuvable. Veuillez recommencer le test.");
        setLoading(false);
        return;
      }
      
      try {
        await Promise.all([
          fetchResults(assessmentId),
          fetchAssessment(assessmentId, sessionToken),
          fetchProgress(assessmentId, sessionToken),
          fetchCareers(),
          fetchTrainingCenters(),
          fetchTrainingPaths()
        ]);
      } catch (err) {
        setError("Impossible de charger vos résultats.");
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, [location]);

  const getScores = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    if (resultData?.riasecProfile?.scores) {
      const apiScores = resultData.riasecProfile.scores;
      Object.keys(scores).forEach(key => {
        scores[key] = apiScores[key] ? Math.round(apiScores[key] * 100) : 0;
      });
    } else if (resultData?.phase2_code) {
      const code = resultData.phase2_code;
      if (code[0]) scores[code[0]] = 90;
      if (code[1]) scores[code[1]] = 70;
      if (code[2]) scores[code[2]] = 50;
    } else if (resultData?.phase1_code) {
      const code = resultData.phase1_code;
      if (code[0]) scores[code[0]] = 90;
      if (code[1]) scores[code[1]] = 70;
      if (code[2]) scores[code[2]] = 50;
    }
    
    return scores;
  };

  const getCode = () => {
    return resultData?.phase2_code || resultData?.phase1_code || '---';
  };

  const getRecommendedCareers = () => {
    const code = getCode();
    if (!code || code === '---') return [];
    
    const recommended = careers.filter(career => {
      if (!career.riasec_codes) return false;
      return career.riasec_codes.some(riasecCode => code.includes(riasecCode));
    });
    
    return recommended.slice(0, 12);
  };

  const getRecommendedTrainings = () => {
    const recommendedCareers = getRecommendedCareers();
    const careerIds = recommendedCareers.map(c => c.id);
    
    const recommended = trainingPaths.filter(path => 
      careerIds.includes(path.career_id)
    );
    
    return recommended.slice(0, 6);
  };

  const riasec = getScores();
  const code = getCode();

  const sortedTypes = [...types].sort((a, b) => (riasec[b.type] || 0) - (riasec[a.type] || 0));
  const dominantTypes = sortedTypes.slice(0, 3);
  const topType = dominantTypes[0];
  const secondType = dominantTypes[1];
  const thirdType = dominantTypes[2];
  
  const completionPercentage = progressData?.completionPercentage || assessmentData?.completion_percentage || 0;
  const status = assessmentData?.status || progressData?.status || 'IN_PROGRESS';
  
  const getInterpretation = () => {
    if (!code || code === '---') return '';
    const firstCode = code[0];
    const interpretations = {
      'R': 'Vous êtes un "faiseur pragmatique" : vous aimez passer à l\'action et obtenir des résultats tangibles. Vous excellez dans les environnements concrets et pratiques.',
      'I': 'Vous êtes un "penseur-acteur" : vous avez une grande capacité à conceptualiser puis à concrétiser vos idées. La recherche et l\'analyse vous stimulent.',
      'A': 'Vous êtes un "créatif expressif" : vous avez besoin d\'espace pour innover et vous exprimer. L\'originalité est votre moteur.',
      'S': 'Vous êtes un "aidant relationnel" : votre épanouissement passe par l\'aide aux autres et les interactions humaines.',
      'E': 'Vous êtes un "leader stratège" : vous aimez convaincre, diriger et atteindre des objectifs ambitieux.',
      'C': 'Vous êtes un "organisateur méthodique" : vous excellez dans les tâches structurées et l\'analyse de données.'
    };
    return interpretations[firstCode] || 'Profil équilibré avec des intérêts variés.';
  };

  const getProfilDescription = () => {
    if (!code || code === '---') return '';
    
    const descriptions = {
      'R': 'Votre profil Réaliste montre une préférence pour les activités concrètes, manuelles et techniques. Vous aimez travailler avec vos mains, utiliser des outils et obtenir des résultats tangibles.',
      'I': 'Votre profil Investigateur révèle une forte curiosité intellectuelle. Vous aimez analyser, comprendre et résoudre des problèmes complexes par l\'observation et l\'expérimentation.',
      'A': 'Votre profil Artistique indique une sensibilité créative prononcée. Vous recherchez l\'originalité, l\'expression personnelle et l\'innovation dans ce que vous faites.',
      'S': 'Votre profil Social démontre un grand intérêt pour les relations humaines. Vous aimez aider, enseigner, conseiller et collaborer avec les autres.',
      'E': 'Votre profil Entreprenant montre un fort potentiel de leadership. Vous aimez convaincre, diriger, prendre des risques calculés et atteindre des objectifs.',
      'C': 'Votre profil Conventionnel révèle une préférence pour l\'organisation et la précision. Vous aimez les tâches structurées, la gestion de données et le travail méthodique.'
    };
    
    const firstCode = code[0];
    let description = descriptions[firstCode] || '';
    
    if (code.length >= 2) {
      const secondCode = code[1];
      const combinations = {
        'RI': ' La combinaison Réaliste-Investigateur est idéale pour les métiers d\'ingénierie et de recherche appliquée.',
        'IR': ' La combinaison Investigateur-Réaliste est parfaite pour la R&D et les sciences appliquées.',
        'AS': ' La combinaison Artistique-Social est excellente pour les métiers créatifs liés à l\'humain (design pédagogique, art-thérapie).',
        'SE': ' La combinaison Social-Entreprenant est idéale pour le management, les RH et le conseil.',
        'EC': ' La combinaison Entreprenant-Conventionnel est parfaite pour la gestion d\'entreprise et l\'administration.',
        'CR': ' La combinaison Conventionnel-Réaliste est excellente pour les métiers techniques organisés (qualité, logistique).'
      };
      description += combinations[firstCode + secondCode] || combinations[secondCode + firstCode] || '';
    }
    
    return description;
  };

  const recommendedCareers = getRecommendedCareers();
  const recommendedTrainings = getRecommendedTrainings();

  const getHexagonPoints = () => {
    const centerX = 120;
    const centerY = 120;
    const radius = 100;
    const angles = [90, 30, 330, 270, 210, 150];
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
      const score = Math.min((riasec[order[idx]] || 0) / 100, 1);
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

  if (loading) {
    return (
      <div className="orientations-container">
        <div className="loader" style={{ textAlign: 'center', padding: '50px' }}>
          <div className="spinner"></div>
          <p>Analyse de votre profil RIASEC...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orientations-container">
        <div className="error" style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={() => navigate('/tests')} className="btn-primary">
            Retour au test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orientations-page">
      <div className="orientations-wrapper">
        {/* Header amélioré */}
        <div className="orientations-header">
          <h1>🎯 Mon rapport d'orientation RIASEC</h1>
          <p className="report-date">Test effectué le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <div className="report-badge">
            <span className="badge-code">Code RIASEC: <strong>{code}</strong></span>
            <span className="badge-status">Statut: {status === 'COMPLETED' ? '✅ Terminé' : status === 'IN_PROGRESS' ? '🔄 En cours' : '⏸️ Abandonné'}</span>
          </div>
        </div>

        {/* Carte de synthèse améliorée */}
        <div className="summary-card">
          <div className="summary-header">
            <h2>📋 Synthèse de votre évaluation</h2>
          </div>
          <div className="summary-content">
            <div className="summary-text">
              <p>Basé sur la typologie de Holland, votre code RIASEC est <strong className="highlight-code">{code}</strong>. Ce code représente vos intérêts professionnels dominants et vous guide vers des métiers et formations adaptés à votre personnalité.</p>
            </div>
            <div className="stats-grid-enhanced">
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <span className="stat-label">Code RIASEC</span>
                  <strong className="stat-value-large">{code}</strong>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <span className="stat-label">Type dominant</span>
                  <strong className="stat-value">{topType?.name}</strong>
                  <span className="stat-percent">{riasec[topType?.type] || 0}%</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <span className="stat-label">Progression</span>
                  <strong className="stat-value">{completionPercentage}%</strong>
                  <div className="mini-progress">
                    <div className="mini-progress-fill" style={{ width: `${completionPercentage}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hexagramme avec meilleure présentation */}
        <div className="hexagramme-card">
          <div className="card-header">
            <h2>📊 Profil RIASEC - Hexagramme</h2>
            <p>Visualisation de vos scores par type de personnalité</p>
          </div>
          <div className="hexagramme-content">
            <div className="hexagramme-visual">
              <svg width="300" height="300" viewBox="0 0 280 280">
                <polygon
                  points={hexagonPoints.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
                {hexagonPoints.map((point, idx) => (
                  <line
                    key={idx}
                    x1="120"
                    y1="120"
                    x2={point.x}
                    y2={point.y}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                ))}
                <polygon
                  points={dataPointsString}
                  fill="rgba(59, 130, 246, 0.25)"
                  stroke="#3B82F6"
                  strokeWidth="3"
                />
                {dataPoints.map((point, idx) => (
                  <circle
                    key={idx}
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    fill="#3B82F6"
                    stroke="white"
                    strokeWidth="2"
                  />
                ))}
                <text x="120" y="12" textAnchor="middle" fontSize="13" fill="#EF4444" fontWeight="bold">R</text>
                <text x="205" y="38" textAnchor="middle" fontSize="13" fill="#3B82F6" fontWeight="bold">I</text>
                <text x="218" y="122" textAnchor="start" fontSize="13" fill="#8B5CF6" fontWeight="bold">A</text>
                <text x="120" y="255" textAnchor="middle" fontSize="13" fill="#10B981" fontWeight="bold">S</text>
                <text x="32" y="122" textAnchor="end" fontSize="13" fill="#F59E0B" fontWeight="bold">E</text>
                <text x="25" y="38" textAnchor="middle" fontSize="13" fill="#6366F1" fontWeight="bold">C</text>
                <circle cx="120" cy="120" r="4" fill="#94a3b8" />
              </svg>
            </div>
            <div className="hexagramme-legend">
              {types.map(type => (
                <div key={type.type} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: type.color }}></span>
                  <span className="legend-type">{type.type}</span>
                  <span className="legend-name">{type.name}</span>
                  <span className="legend-score">{riasec[type.type] || 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section profil améliorée */}
        <div className="profile-card">
          <div className="card-header">
            <h2>🗺️ Analyse détaillée de votre profil</h2>
          </div>
          
          <div className="dominant-types">
            <h3>✨ Vos types dominants</h3>
            <div className="dominant-cards">
              {dominantTypes.map((type, idx) => (
                <div key={type.type} className="dominant-card-enhanced" style={{ borderTopColor: type.color }}>
                  <div className="dominant-rank">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                  <div className="dominant-icon" style={{ backgroundColor: type.color + '20' }}>
                    <span style={{ fontSize: '32px' }}>{type.icon}</span>
                  </div>
                  <div className="dominant-info">
                    <div className="dominant-name">{type.name}</div>
                    <div className="dominant-score">{riasec[type.type] || 0}%</div>
                    <div className="dominant-bar">
                      <div className="dominant-bar-fill" style={{ width: `${riasec[type.type] || 0}%`, backgroundColor: type.color }}></div>
                    </div>
                    <div className="dominant-desc">{type.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="profil-description-enhanced">
            <h3>📖 Interprétation de votre profil</h3>
            <p>{getProfilDescription()}</p>
            <div className="interpretation-highlight">
              <strong>💡 À retenir :</strong> {getInterpretation()}
            </div>
          </div>
        </div>

        {/* Tabs améliorés */}
        <div className="tabs-enhanced">
          <button 
            className={`tab-enhanced ${activeTab === 'radar' ? 'active' : ''}`}
            onClick={() => setActiveTab('radar')}
          >
            <span className="tab-icon">📊</span>
            <span>Scores détaillés</span>
          </button>
          <button 
            className={`tab-enhanced ${activeTab === 'careers' ? 'active' : ''}`}
            onClick={() => setActiveTab('careers')}
          >
            <span className="tab-icon">💼</span>
            <span>Métiers recommandés</span>
          </button>
          <button 
            className={`tab-enhanced ${activeTab === 'formations' ? 'active' : ''}`}
            onClick={() => setActiveTab('formations')}
          >
            <span className="tab-icon">🎓</span>
            <span>Formations</span>
          </button>
        </div>

        {activeTab === 'radar' && (
          <div className="tab-content-enhanced">
            <h3>📈 Vos scores par type RIASEC</h3>
            <div className="scores-list-enhanced">
              {types.map(type => (
                <div key={type.type} className="score-card">
                  <div className="score-card-header">
                    <div className="score-icon" style={{ backgroundColor: type.bgColor }}>
                      <span style={{ fontSize: '24px' }}>{type.icon}</span>
                    </div>
                    <div className="score-info">
                      <div className="score-name">{type.name} ({type.type})</div>
                      <div className="score-percent">{riasec[type.type] || 0}%</div>
                    </div>
                  </div>
                  <div className="score-bar-container">
                    <div className="score-bar" style={{ width: `${riasec[type.type] || 0}%`, backgroundColor: type.color }}></div>
                  </div>
                  <p className="score-desc-enhanced">{type.desc}</p>
                  <details className="score-details">
                    <summary>En savoir plus</summary>
                    <p>{type.details}</p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'careers' && (
          <div className="tab-content-enhanced">
            <h3>💼 Métiers recommandés pour le profil <span className="code-highlight">{code}</span></h3>
            <div className="careers-grid">
              {recommendedCareers.length > 0 ? (
                recommendedCareers.map((career, idx) => (
                  <div key={idx} className="career-card">
                    <div className="career-rank">{idx + 1}</div>
                    <div className="career-info">
                      <div className="career-name">{career.name}</div>
                      {career.category && <div className="career-category">{career.category}</div>}
                      {career.riasec_codes && (
                        <div className="career-codes">
                          {career.riasec_codes.map(c => (
                            <span key={c} className="code-tag">{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Aucune recommandation disponible pour le moment.</p>
                  <p>Les métiers seront bientôt disponibles selon votre profil.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'formations' && (
          <div className="tab-content-enhanced">
            <h3>🎓 Parcours de formation recommandés</h3>
            <div className="formations-list">
              {recommendedTrainings.length > 0 ? (
                recommendedTrainings.map((training, idx) => (
                  <div key={idx} className="formation-card">
                    <div className="formation-icon">📖</div>
                    <div className="formation-info">
                      <div className="formation-name">{training.name}</div>
                      {training.institution_id && (
                        <div className="formation-institution">
                          {trainingCenters.find(c => c.id === training.institution_id)?.name || 'Établissement partenaire'}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Explorez nos partenaires formations pour découvrir les parcours adaptés à votre profil.</p>
                </div>
              )}
            </div>

            {trainingCenters.length > 0 && (
              <>
                <h3>🏫 Centres de formation partenaires</h3>
                <div className="centers-grid">
                  {trainingCenters.slice(0, 6).map((center, idx) => (
                    <div key={idx} className="center-card">
                      <div className="center-icon">🏛️</div>
                      <div className="center-info">
                        <div className="center-name">{center.name}</div>
                        <div className="center-location">{center.city}{center.department ? ` - ${center.department}` : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="action-buttons-enhanced">
              <button className="btn-print" onClick={() => window.print()}>
                🖨️ Imprimer le rapport
              </button>
              <button className="btn-retest" onClick={() => {
                localStorage.removeItem('session_token');
                localStorage.removeItem('assessment_id');
                navigate('/tests');
              }}>
                🔄 Refaire le test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orientations;