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

  const riasecData = {
    R: {
      strengths: ['Sens pratique et concret', 'Dextérité manuelle et technique', 'Orientation vers les résultats tangibles'],
      improvements: ['Développer la communication verbale', 'Travailler l\'abstraction et la conceptualisation']
    },
    I: {
      strengths: ['Curiosité intellectuelle très développée', 'Esprit critique et analytique', 'Capacité à résoudre des problèmes complexes'],
      improvements: ['Développer les compétences relationnelles', 'Apprendre à vulgariser des idées complexes']
    },
    A: {
      strengths: ['Imagination et créativité débordante', 'Sensibilité artistique développée', 'Originalité et innovation'],
      improvements: ['Structurer et organiser ses projets', 'Respecter des délais et contraintes']
    },
    S: {
      strengths: ['Empathie et écoute active', 'Capacité à travailler en équipe', 'Sens du relationnel développé'],
      improvements: ['Apprendre à dire non et poser des limites', 'Développer l\'autonomie et le travail solo']
    },
    E: {
      strengths: ['Leadership naturel et charisme', 'Capacité à prendre des initiatives', 'Persuasion et influence'],
      improvements: ['Apprendre à déléguer et faire confiance', 'Développer l\'écoute active']
    },
    C: {
      strengths: ['Organisation et méthode irréprochables', 'Rigueur et précision', 'Fiabilité et sens des responsabilités'],
      improvements: ['Développer la flexibilité et l\'adaptabilité', 'Apprendre à sortir des cadres établis']
    }
  };

  const sortedTypes = [...types].sort((a, b) => riasec[b.type] - riasec[a.type]);
  const dominantTypes = sortedTypes.slice(0, 3);
  const topType = dominantTypes[0];

  return (
    <div className="orientations-page">
      <div className="orientations-wrapper">
        <div className="orientations-header">
          <h1>Mon rapport d'orientation</h1>
          <p>Test effectué le {new Date().toLocaleDateString()} - Version complète RIASEC</p>
          {saving && <p style={{ color: 'green' }}>Sauvegarde en cours...</p>}
        </div>

        <div className="resum-card">
          <div className="resum-section">
            <h2 className="resum-label">Résumé du test</h2>
          </div>
          <div className="textresum-section">
            <h3 className="text-label">Synthèse de l'évaluation</h3>
            <p>Test d'intérêts professionnels et de personnalité basé sur la typologie de Holland (RIASEC).</p>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">🎯 Code RIASEC</span>
                <span className="stat-value">{code}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">📊 Type dominant</span>
                <span className="stat-value">{topType.name} ({riasec[topType.type]}%)</span>
              </div>
            </div>
          </div>
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
                <div key={type.type} className="dominant-card" style={{ borderColor: type.color, backgroundColor: `${type.color}10` }}>
                  <div className="dominant-rank">#{idx + 1}</div>
                  <div className="dominant-icon">{type.icon}</div>
                  <div className="dominant-name">{type.name}</div>
                  <div className="dominant-score" style={{ color: type.color }}>{riasec[type.type]}%</div>
                </div>
              ))}
            </div>
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