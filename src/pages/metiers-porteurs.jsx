import React, { useState } from 'react';
import '../styles/metiers-porteurs.css';
// Import des icônes SVG
import { 
  FaClipboardList, FaTractor, FaHardHat, FaHome, FaCode, 
  FaShieldAlt, FaSolarPanel, FaHotel, FaMapMarkedAlt, 
  FaTruck, FaPills, FaRecycle, FaIndustry, FaSnowplow,
  FaBriefcase, FaUniversity, FaLaptopCode, FaSyncAlt, 
  FaBook, FaChartLine, FaUsers, FaGlobe, FaQuoteLeft,
  FaGraduationCap, FaBuilding, FaArrowRight, FaStar,
  FaSeedling, FaHammer, FaMicrochip, FaWind, FaPlane, FaHeartbeat
} from 'react-icons/fa';
import { GiFarmer, GiFruitTree, GiFrozenBlock, GiBarn } from 'react-icons/gi';
import { MdConstruction, MdSecurity, MdHotel, MdLocalHospital } from 'react-icons/md';

const MetiersPorteurs = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [expandedCard, setExpandedCard] = useState(null);

    const categories = [
        { id: 'all', name: 'Tous les métiers', icon: <FaClipboardList /> },
        { id: 'agro', name: 'Agro-industrie', icon: <FaSeedling /> },
        { id: 'btp', name: 'BTP & Immobilier', icon: <FaHammer /> },
        { id: 'digital', name: 'Numérique', icon: <FaMicrochip /> },
        { id: 'energie', name: 'Énergie & Environnement', icon: <FaWind /> },
        { id: 'tourisme', name: 'Tourisme & Hôtellerie', icon: <FaPlane /> },
        { id: 'logistique', name: 'Logistique & Transport', icon: <FaTruck /> },
        { id: 'sante', name: 'Santé', icon: <FaHeartbeat /> }
    ];

    const jobs = [
        {
            id: 1,
            category: 'agro',
            title: 'Technicien agro-industriel',
            icon: <FaIndustry />,
            description: "Gère les unités de transformation des produits agricoles (anacarde, ananas, soja) et optimise les chaînes de production.",
            importance: [
                "Le Bénin transforme localement ses matières premières agricoles",
                "Création de nombreuses usines dans la zone industrielle de Glo-Djigbé (GDIZ)",
                "Maîtrise des normes internationales (ISO, HACCP) indispensable",
                "Bonne connaissance des filières anacarde, ananas, soja et coton"
            ],
            formation: "BTS Agro-industrie, Licence en Génie alimentaire",
            demand: "Très élevée 🔥",
            opportunities: "Usines de transformation, coopératives agricoles, exportateurs"
        },
        {
            id: 2,
            category: 'agro',
            title: 'Responsable chaîne du froid',
            icon: <GiFrozenBlock />,
            description: "Met en place et gère les systèmes de conservation des produits périssables pour réduire les pertes post-récolte.",
            importance: [
                "Pertes post-récolte jusqu'à 30% sur certains produits",
                "Développement des plateformes logistiques avec chambres froides",
                "Nécessite des compétences en maintenance des équipements",
                "Connaissance des normes sanitaires de conservation"
            ],
            formation: "Licence Logistique, BTS Froid et climatisation",
            demand: "Élevée 📈",
            opportunities: "Sociétés d'export, grandes surfaces, plateformes logistiques"
        },
        {
            id: 3,
            category: 'agro',
            title: 'Chef d\'exploitation agricole moderne',
            icon: <FaTractor />,
            description: "Dirige une exploitation agricole en utilisant des techniques modernes (irrigation, mécanisation, agriculture de précision).",
            importance: [
                "Modernisation du secteur agricole encouragée par l'État",
                "Accès facilité aux subventions et équipements",
                "Gestion d'équipe et compétences entrepreneuriales requises",
                "Importance de la diversification des cultures"
            ],
            formation: "Licence en Agriculture, Formation en management agricole",
            demand: "Forte 💪",
            opportunities: "Exploitations privées, fermes modernes, agri-business"
        },
        {
            id: 4,
            category: 'btp',
            title: 'Conducteur de travaux',
            icon: <MdConstruction />,
            description: "Supervise et coordonne les chantiers de construction, gère les équipes et le respect des délais.",
            importance: [
                "Boom immobilier à Cotonou et dans les grandes villes",
                "Projets d'infrastructures publiques (routes, bâtiments administratifs)",
                "Maîtrise des normes de sécurité sur les chantiers",
                "Gestion de budget et de planning essentielle"
            ],
            formation: "BTS Bâtiment, Licence Génie civil",
            demand: "Très élevée 🔥",
            opportunities: "Entreprises de BTP, promoteurs immobiliers, bureaux d'études"
        },
        {
            id: 5,
            category: 'btp',
            title: 'Promoteur immobilier',
            icon: <FaHome />,
            description: "Identifie des terrains, monte des projets de construction et commercialise des logements.",
            importance: [
                "Demande croissante de logements modernes et sécurisés",
                "Sécurisation foncière : un défi majeur à maîtriser",
                "Connaissance du marché et des quartiers porteurs",
                "Réseau d'architectes, notaires et banques indispensable"
            ],
            formation: "Formation en immobilier, Droit foncier, Gestion de projets",
            demand: "Forte 💪",
            opportunities: "Indépendant, agences immobilières, investisseurs"
        },
        {
            id: 6,
            category: 'digital',
            title: 'Développeur Full-Stack',
            icon: <FaCode />,
            description: "Crée des applications web et mobiles complètes (front-end et back-end) pour entreprises et start-ups.",
            importance: [
                "Digitalisation accélérée des services publics et privés",
                "Écosystème start-up en pleine ébullition",
                "Formations disponibles (Epitech, EMN, Le Wagon)",
                "Travail à distance possible pour des clients internationaux"
            ],
            formation: "Bootcamp développement, Licence informatique, Autodidacte",
            demand: "Très élevée 🔥",
            opportunities: "Start-ups, agences web, freelances, entreprises internationales"
        },
        {
            id: 7,
            category: 'digital',
            title: 'Expert en cybersécurité',
            icon: <FaShieldAlt />,
            description: "Protège les systèmes informatiques et les données sensibles des entreprises contre les cyberattaques.",
            importance: [
                "Hausse des cyberattaques et des tentatives de fraude en ligne",
                "Banques, assurances et fintechs très demandeuses",
                "Nécessite des certifications reconnues (CEH, CISSP, CompTIA Security+)",
                "Veille technologique permanente indispensable"
            ],
            formation: "Licence en Sécurité informatique, Certifications professionnelles",
            demand: "Très élevée 🔥",
            opportunities: "Banques, institutions financières, sociétés de services, gouvernement"
        },
        {
            id: 8,
            category: 'energie',
            title: 'Ingénieur en énergies renouvelables',
            icon: <FaSolarPanel />,
            description: "Conçoit et installe des solutions solaires (panneaux, pompes à eau) pour les particuliers et entreprises.",
            importance: [
                "Objectif d'électrification rurale par le solaire",
                "Réduction de la dépendance aux groupes électrogènes",
                "Maintenance et suivi des installations cruciales",
                "Potentiel énorme dans les zones non connectées au réseau"
            ],
            formation: "Licence/ Master Énergies renouvelables, Formation technique solaire",
            demand: "Forte 💪",
            opportunities: "Entreprises solaires, ONG, projets gouvernementaux, indépendant"
        },
        {
            id: 9,
            category: 'tourisme',
            title: 'Manager d\'hôtel / Lodge',
            icon: <FaHotel />,
            description: "Dirige un établissement hôtelier, gère les équipes, les réservations et la satisfaction client.",
            importance: [
                "Pénurie d'infrastructures d'accueil haut de gamme",
                "Développement du tourisme autour des sites classés (Pendjari, Ganvié)",
                "Service client et gestion RH essentiels",
                "Connaissance des standards internationaux d'hôtellerie"
            ],
            formation: "BTS Hôtellerie, Licence Management hôtelier",
            demand: "Forte 💪",
            opportunities: "Hôtels, lodges, écolodges, résidences touristiques"
        },
        {
            id: 10,
            category: 'tourisme',
            title: 'Guide touristique spécialisé',
            icon: <FaMapMarkedAlt />,
            description: "Fait découvrir les sites historiques et naturels du Bénin en offrant une expérience immersive aux visiteurs.",
            importance: [
                "Patrimoine riche : palais d'Abomey, Ouidah, Ganvié, Pendjari",
                "Langues étrangères (anglais, espagnol) très valorisées",
                "Connaissance approfondie de l'histoire et des cultures locales",
                "Certification et agrément nécessaires"
            ],
            formation: "Formation en tourisme, Certificat de guide",
            demand: "Moyenne à forte 📈",
            opportunities: "Agences de voyage, ONG, indépendant"
        },
        {
            id: 11,
            category: 'logistique',
            title: 'Transitaire / Courtier en douane',
            icon: <FaTruck />,
            description: "Gère le dédouanement des marchandises importées et exportées via le Port Autonome de Cotonou.",
            importance: [
                "Port de Cotonou : plateforme majeure pour le Nigeria et le Sahel",
                "Connaissance du code des douanes indispensable",
                "Relation avec les agents de douane et les transitaires internationaux",
                "Agrément obligatoire pour exercer"
            ],
            formation: "Licence Transport Logistique, Formation en douane",
            demand: "Très élevée 🔥",
            opportunities: "Sociétés de transit, cabinets de courtage, indépendant"
        },
        {
            id: 12,
            category: 'sante',
            title: 'Pharmacien spécialisé approvisionnement',
            icon: <FaPills />,
            description: "Gère la chaîne d'approvisionnement des médicaments et dispositifs médicaux dans les structures de santé.",
            importance: [
                "Renforcement du système de santé post-COVID",
                "Lutte contre les médicaments falsifiés",
                "Connaissance des procédures d'achat public",
                "Gestion de stock et logistique pharmaceutique"
            ],
            formation: "Doctorat Pharmacie, Spécialisation",
            demand: "Forte 💪",
            opportunities: "Hôpitaux publics, ONG, grossistes répartiteurs"
        },
        {
            id: 13,
            category: 'energie',
            title: 'Gestionnaire de déchets / Recyclage',
            icon: <FaRecycle />,
            description: "Met en place des systèmes de collecte, tri et valorisation des déchets (plastique, biodéchets).",
            importance: [
                "Problème majeur d'insalubrité dans les grandes villes",
                "Valorisation des déchets en énergie ou matériaux recyclés",
                "Partenariats avec les communes et les entreprises",
                "Créneaux porteurs : plastique, déchets électroniques, biodéchets"
            ],
            formation: "Licence Environnement, Formation en gestion des déchets",
            demand: "Élevée 📈",
            opportunities: "ONG, entreprises de recyclage, collectivités locales"
        }
    ];

    const filteredJobs = activeFilter === 'all' 
        ? jobs 
        : jobs.filter(job => job.category === activeFilter);

    const toggleExpand = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    return (
        <div className="metiers-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="hero-highlight">Métiers porteurs</span> au Bénin
                    </h1>
                    <p className="hero-subtitle">
                        Découvrez les carrières d'avenir qui recrutent au Bénin et les formations pour y accéder
                    </p>
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">7%</span>
                            <span className="stat-label">Croissance PIB 2026</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">8+</span>
                            <span className="stat-label">Secteurs porteurs</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">13</span>
                            <span className="stat-label">Métiers en demande</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="filter-section">
                <div className="filter-container">
                    <h2 className="filter-title">Explorez par secteur</h2>
                    <div className="filter-buttons">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveFilter(cat.id)}
                            >
                                <span className="filter-icon">{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Jobs Grid */}
            <section className="jobs-section">
                <div className="jobs-container">
                    <div className="jobs-grid">
                        {filteredJobs.map(job => (
                            <div 
                                key={job.id} 
                                className={`job-card ${expandedCard === job.id ? 'expanded' : ''}`}
                            >
                                <div className="card-header">
                                    <div className="card-icon">{job.icon}</div>
                                    <div className="card-title-section">
                                        <h3 className="job-title">{job.title}</h3>
                                        <span className="demand-badge">{job.demand}</span>
                                    </div>
                                </div>
                                
                                <p className="job-description">{job.description}</p>
                                
                                <div className={`card-details ${expandedCard === job.id ? 'visible' : ''}`}>
                                    <div className="details-section">
                                        <h4>📌 Ce qu'il faut savoir</h4>
                                        <ul className="importance-list">
                                            {job.importance.map((point, idx) => (
                                                <li key={idx}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">🎓 Formations</span>
                                            <span className="info-value">{job.formation}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">🏢 Débouchés</span>
                                            <span className="info-value">{job.opportunities}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    className="expand-btn"
                                    onClick={() => toggleExpand(job.id)}
                                >
                                    {expandedCard === job.id ? 'Voir moins ▲' : 'Voir plus ▼'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="formation-section">
                <div className="formation-container">
                    <h2 className="formation-title">🎯 Comment se former ?</h2>
                    <div className="formation-grid">
                        <div className="formation-card">
                            <div className="formation-icon"><FaUniversity /></div>
                            <h3>Lycées Techniques Agricoles</h3>
                            <p>10 nouvelles filières DTM en agriculture (aviculture, pisciculture, horticulture, etc.)</p>
                        </div>
                        <div className="formation-card">
                            <div className="formation-icon"><FaLaptopCode /></div>
                            <h3>Écoles du Numérique</h3>
                            <p>Epitech Bénin, EMN, Le Wagon - Formations aux métiers du digital</p>
                        </div>
                        <div className="formation-card">
                            <div className="formation-icon"><FaSyncAlt /></div>
                            <h3>Programme FORCE</h3>
                            <p>Formation en alternance dans l'artisanat et l'agriculture (Swisscontact)</p>
                        </div>
                        <div className="formation-card">
                            <div className="formation-icon"><FaBook /></div>
                            <h3>Universités et BTS</h3>
                            <p>Licences professionnelles et BTS dans les secteurs porteurs</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="conseil-section">
                <div className="conseil-container">
                    <div className="conseil-content">
                        <span className="conseil-badge">💡 Conseil pratique</span>
                        <h2>Privilégiez l'alternance</h2>
                        <p>
                            Les recruteurs recherchent avant tout des candidats <strong>opérationnels</strong>.
                            Les formations qui intègrent des périodes en entreprise (alternance, stages)
                            sont les plus valorisées sur le marché du travail béninois.
                        </p>
                        <div className="conseil-tips">
                            <div className="tip">
                                <span className="tip-icon">🎯</span>
                                <span>Choisissez une filière en phase avec les besoins du marché</span>
                            </div>
                            <div className="tip">
                                <span className="tip-icon">🌐</span>
                                <span>Développez votre réseau professionnel dès la formation</span>
                            </div>
                            <div className="tip">
                                <span className="tip-icon">📜</span>
                                <span>Obtenez des certifications reconnues (ISO, langues, sécurité)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MetiersPorteurs;