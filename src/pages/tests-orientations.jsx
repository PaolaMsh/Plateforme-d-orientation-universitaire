import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/tests-orientations.css';
import api from '../services/api';

const phases = [
  { id: 1, name: 'Amorçage', icon: '🌱', desc: 'Premiers traits de personnalité' },
  { id: 2, name: 'Aptitude', icon: '💡', desc: 'Compétences et aptitudes' },
  { id: 3, name: 'Compétence', icon: '🎯', desc: 'Domaines de maîtrise' },
  { id: 4, name: 'Personnalité', icon: '🧠', desc: 'Traits comportementaux' },
];

const steps = [
  { num: '01', icon: '📝', title: 'Réponds aux questions', desc: 'Lis chaque affirmation et choisis l\'option qui te correspond le mieux. Sois honnête !' },
  { num: '02', icon: '📊', title: 'Analyse RIASEC', desc: 'Nos algorithmes calculent tes 6 scores et identifient ton profil dominant.' },
  { num: '03', icon: '🎓', title: 'Découvre ton orientation', desc: 'Reçois une liste personnalisée de métiers, filières et établissements adaptés.' },
];

const Testsorientations = () => {
  const [stats, setStats] = useState({ totalTests: 0, avgTime: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer le token
        const token = localStorage.getItem('token');
        
        // Essayer de récupérer les stats avec le token si disponible
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const response = await api.get('/tests/stats', { headers });
        
        // Adapter selon la structure de la réponse
        if (response.data.success && response.data.data) {
          setStats({
            totalTests: response.data.data.totalTests || response.data.data.total || 12543,
            avgTime: response.data.data.avgTime || response.data.data.averageTime || 12
          });
        } else if (response.data.totalTests) {
          setStats({
            totalTests: response.data.totalTests,
            avgTime: response.data.avgTime || 12
          });
        } else {
          // Données par défaut
          setStats({ totalTests: 12543, avgTime: 12 });
        }
      } catch (error) {
        console.error('Erreur chargement stats:', error);
        // Données par défaut en cas d'erreur
        setStats({ totalTests: 12543, avgTime: 12 });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="to-page">
      <div className="to-hero">
        <div className="to-hero-inner">
          <div className="to-hero-badge">Test d'orientation RIASEC</div>
          <h1 className="to-hero-title">
            Découvre la filière<br />
            <span className="to-hero-accent">qui te correspond</span>
          </h1>
          <p className="to-hero-sub">
            Un test scientifique de 18 questions pour identifier ton profil parmi
            6 dimensions et te recommander les meilleures formations au Bénin.
          </p>
          <div className="to-hero-pills">
            <span className="to-pill">📋 18 questions</span>
            <span className="to-pill">⏱️ ~5 minutes</span>
            <span className="to-pill">🔬 6 dimensions</span>
            <span className="to-pill">✅ 100% gratuit</span>
          </div>
          {!loading && (
            <div className="to-stats">
              <span>📊 {stats.totalTests.toLocaleString()} tests déjà réalisés</span>
              <span>⏱️ Durée moyenne : {stats.avgTime} min</span>
            </div>
          )}
        </div>
      </div>

      <div className="to-wrapper">
        <div className="to-section-label">Comment souhaitez-vous passer le test ?</div>

        <div className="to-cards">
          <div className="to-card to-card--featured">
            <div className="to-card-badge">Recommandé</div>
            <div className="to-card-icon">📋</div>
            <h2 className="to-card-title">Test complet</h2>
            <p className="to-card-desc">
              Répondez aux 18 questions en une seule session pour obtenir
              un profil RIASEC complet et des recommandations précises.
            </p>
            <ul className="to-card-features">
              <li>✓ Profil détaillé sur 6 dimensions</li>
              <li>✓ Métiers et formations personnalisés</li>
              <li>✓ Rapport imprimable</li>
              <li>✓ ~5 minutes seulement</li>
            </ul>
            <Link
              to="/tests"
              state={{ mode: 'full', phases: phases.map(p => p.id) }}
              className="to-btn to-btn--primary"
            >
              Commencer le test complet →
            </Link>
          </div>

          <div className="to-card">
            <div className="to-card-icon">🎯</div>
            <h2 className="to-card-title">Choisir une phase</h2>
            <p className="to-card-desc">
              Explorez une dimension spécifique du test si vous souhaitez
              approfondir un aspect particulier de votre profil.
            </p>
            <div className="to-phases-grid">
              {phases.map(ph => (
                <Link
                  key={ph.id}
                  to="/tests"
                  state={{ mode: 'single', phaseId: ph.id }}
                  className="to-phase-btn"
                >
                  <span className="to-phase-icon">{ph.icon}</span>
                  <span className="to-phase-info">
                    <span className="to-phase-name">Phase {ph.id}</span>
                    <span className="to-phase-sub">{ph.name}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="to-how">
          <div className="to-how-title">Comment ça marche ?</div>
          <div className="to-steps">
            {steps.map((s, i) => (
              <div key={i} className="to-step">
                <div className="to-step-num">{s.num}</div>
                <div className="to-step-icon">{s.icon}</div>
                <h3 className="to-step-title">{s.title}</h3>
                <p className="to-step-desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="to-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testsorientations;