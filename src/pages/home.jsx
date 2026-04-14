import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faMapMarkerAlt,
  faArrowRight,
  faStar,
  faBuilding,
  faUsers,
  faChartLine,
  faGlobe,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/home.css";
import { universityService } from "../services/universityService";
import { programService } from "../services/programServices";
import api from "../services/api";


const Home = () => {
  const [universities, setUniversities] = useState([]);
  const [popularPrograms, setPopularPrograms] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les universités (3 premières)
        const uniData = await universityService.getAllUniversities();
        setUniversities(uniData.slice(0, 3));
        
        // Récupérer les programmes populaires
        const programsData = await programService.getPopularPrograms();
        setPopularPrograms(programsData);
        
        // Récupérer les bénéfices depuis l'API
        const benefitsResponse = await api.get('/benefits');
        setBenefits(benefitsResponse.data);
        
        // Récupérer les témoignages depuis l'API
        const testimonialsResponse = await api.get('/testimonials');
        setTestimonials(testimonialsResponse.data);
        
      } catch (error) {
        console.error('Erreur chargement home:', error);
        setError("Impossible de charger les données");
        
        // Données par défaut en cas d'erreur
        setUniversities([
          {
            id: 1,
            name: "Ecole Supérieure de Gestion d'Informatique et des Sciences",
            location: "Cotonou, Bénin",
            rating: 4.8,
            students: 4000,
            programs: 25,
            image: "/ESGIS.jpeg",
          },
          {
            id: 2,
            name: "Faculté des Sciences de la Santé",
            location: "Cotonou, Bénin",
            rating: 4.6,
            students: 6000,
            programs: 15,
            image: "/FSS.jpg",
          },
          {
            id: 3,
            name: "Haute École de Commerce et de Management",
            location: "Cotonou, Bénin",
            rating: 4.7,
            students: 1500,
            programs: 15,
            image: "/HECM.jpg",
          },
        ]);
        
        setPopularPrograms([
          { name: "Informatique", university: "UAC", spots: 120 },
          { name: "Médecine", university: "UAC", spots: 80 },
          { name: "Droit", university: "UP", spots: 150 },
          { name: "Génie Civil", university: "IST", spots: 60 },
          { name: "Économie", university: "UAC", spots: 200 },
          { name: "Agronomie", university: "UP", spots: 100 },
        ]);
        
        setBenefits([
          {
            icon: faChartLine,
            title: "Orientation personnalisée",
            description: "Des tests adaptés pour trouver la filière qui vous correspond",
          },
          {
            icon: faUsers,
            title: "Accompagnement personnalisé", 
            description: "Un suivi individuel pour vous guider dans vos choix d'orientation",
          },
          {
            icon: faGlobe,
            title: "Formations internationales",
            description: "Accès aux meilleures universités à l'étranger",
          },
        ]);
        
        setTestimonials([
          {
            name: "Amira D.",
            role: "Étudiante en Médecine, Cotonou",
            text: "Grâce au test RIASEC, j'ai découvert que j'avais un profil social et investigateur. Les recommandations m'ont orientée vers les sciences de la santé. Aujourd'hui, je suis épanouie dans mes études.",
            avatar: "👩‍⚕️"
          },
          {
            name: "Kevin M.",
            role: "Étudiant en Informatique, Porto-Novo",
            text: "Je ne savais pas quoi faire après mon BAC. Le chatbot m'a rassuré et le test m'a proposé l'informatique. Je suis aujourd'hui en L2 et je ne regrette pas du tout !",
            avatar: "💻"
          },
          {
            name: "Fatima Z.",
            role: "Lycéenne, Parakou",
            text: "J'ai utilisé la cartographie pour trouver une école de gestion près de chez moi. Les filtres m'ont aidée à choisir selon mon budget. Vraiment utile.",
            avatar: "🎓"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="homepage">
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <div className="loader">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <section className="heros">
        <div className="heros-content">
          <h1>
            Choisissez <span>la meilleure voie</span> pour votre avenir
          </h1> 
          <p className="heros-subtitle">
            Découvrez les meilleures universités et formations au Bénin. Obtenez
            un accompagnement personnalisé pour votre parcours académique.
          </p>
          <div className="heros-cta">
            <Link to="/tests-orientations" className="ctas-primary">
              Commencer le test d'orientation
            </Link>
            <Link to="/universites-formations" className="ctas-secondary">
              Explorer les universités
            </Link>
          </div>
          <div className="heros-stats">
            <div className="stats-item">
              <div className="stats-number">50+</div>
              <div className="stats-label">Universités</div>
            </div>
            <div className="stats-item">
              <div className="stats-number">200+</div>
              <div className="stats-label">Formations</div>
            </div>
            <div className="stats-item">
              <div className="stats-number">10k+</div>
              <div className="stats-label">Étudiants accompagnés</div>
            </div>
          </div>
        </div>
        <div className="heros-image">
          <img src="/etudiant.jpg" alt="Illustration étudiants" />
        </div>
      </section>

      <section className="universities-section">
        <div className="section-header">
          <h2>Universités populaires</h2>
          <p>Explorez les établissements les plus prestigieux du Bénin</p>
        </div>
        <div className="universities-grid">
          {universities.map((uni) => (
            <div key={uni.id} className="university-card">
              <div className="university-image">
                <img src={uni.image} alt={uni.name} />
                <div className="university-rating">
                  <FontAwesomeIcon icon={faStar} /> {uni.rating || 4.5}
                </div>
              </div>
              <div className="university-info">
                <h3>{uni.name}</h3>
                <div className="university-location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{uni.location}</span>
                </div>
                <div className="university-stats">
                  <span>{uni.students}+ étudiants</span>
                  <span>{uni.programs || uni.formations?.length || 10} formations</span>
                </div>
                <Link to={`/university/${uni.id}`} className="university-link">
                  En savoir plus <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="programs-section">
        <div className="section-header">
          <h2>Formations prisées</h2>
          <p>Les programmes les plus demandés par les étudiants</p>
        </div>
        <div className="programs-grid">
          {popularPrograms.map((program, index) => (
            <div key={index} className="program-card">
              <div className="program-icon">
                <FontAwesomeIcon icon={faGraduationCap} />
              </div>
              <h3>{program.name}</h3>
              <p>{program.university}</p>
              <span className="program-spots">
                {program.spots} places disponibles
              </span>
              <Link
                to={`/program/${program.name.toLowerCase().replace(/\s/g, "-")}`}
                className="program-link"
              >
                En savoir plus 
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>Comment utiliser Orientation-bj ?</h2>
          <div className="steps">
            <div className="step"><div className="step-number">1</div><h3>Inscription</h3><p>Créez un compte avec votre email ou téléphone. Authentification sécurisée.</p></div>
            <div className="step"><div className="step-number">2</div><h3>Test d'orientation</h3><p>Répondez aux questions. Le test s'adapte à vous pour déterminer votre profil RIASEC.</p></div>
            <div className="step"><div className="step-number">3</div><h3>Recommandations</h3><p>Obtenez une liste de métiers, filières et établissements adaptés à votre profil.</p></div>
            <div className="step"><div className="step-number">4</div><h3>Exploration</h3><p>Consultez les fiches détaillées, sauvegardez vos favoris, générez un rapport PDF.</p></div>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <div className="section-header">
          <h2>Pourquoi nous choisir ?</h2>
          <p>Nous vous aidons à prendre la bonne décision pour votre avenir</p>
        </div>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">
                <FontAwesomeIcon icon={benefit.icon} />
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="testimonials-section">
        <div className="container">
          <h2>Ils nous ont fait confiance</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <FontAwesomeIcon icon={faQuoteLeft} className="testimonial-quote" />
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <span className="testimonial-avatar">{t.avatar}</span>
                  <div>
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Prêt à construire votre avenir ?</h2>
          <p>
            Rejoignez des milliers d'étudiants qui ont trouvé leur voie avec
            nous
          </p>
          <div className="cta-buttons">
            <Link to="/tests-orientations" className="cta-primary">
              Commencer votre orientation
            </Link>
            <Link to="/contact" className="cta-secondary">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;