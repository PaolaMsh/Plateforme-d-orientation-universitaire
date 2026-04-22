import React, { useState } from 'react';
import '../styles/profil.css';

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // overview, tests, recommendations, analytics
    const [user, setUser] = useState({
        // ===== IDENTITÉ =====
        id: 'POPI-2024-001',
        firstName: 'Koffi',
        lastName: 'ADJOVI',
        email: 'koffi.adjovi@etudiant.bj',
        phone: '+229 97 12 34 56',
        birthDate: '2006-05-14',
        location: 'Cotonou, Bénin',
        commune: 'Cotonou 3ème Arrondissement',

        // ===== PARCOURS SCOLAIRE =====
        currentLevel: 'Terminale D',
        institution: 'Lycée Béhanzin',
        cityInstitution: 'Porto-Novo',
        previousDegree: 'BEPC - 2022 (Mention Assez Bien)',
        nextExam: 'BAC - Juin 2025',
        academicPerformance: 14.5, // moyenne /20

        // ===== PROFIL RIASEC (résultats du test) =====
        riasecProfile: {
            Realiste: 72,
            Investigateur: 88,
            Artistique: 65,
            Social: 78,
            Entreprenant: 45,
            Conventionnel: 38,
        },
        riasecCode: 'IES', // Investigateur - Entreprenant - Social
        riasecDescription:
            'Vous êtes curieux, aimez analyser et aider les autres. Idéal pour les métiers scientifiques et relationnels.',

        // ===== HISTORIQUE DES TESTS =====
        testHistory: [
            { date: '2024-10-15', riasecCode: 'IES', confidence: 0.92 },
            { date: '2024-09-20', riasecCode: 'IEC', confidence: 0.78 },
            { date: '2024-08-10', riasecCode: 'ISA', confidence: 0.65 },
        ],

        // ===== MÉTIERS RECOMMANDÉS =====
        recommendedCareers: [
            {
                id: 1,
                name: 'Data Scientist',
                match: 94,
                domain: 'Informatique',
                avgSalary: '600k-1.2M FCFA',
                schools: ['ESGIS', 'EPAC'],
            },
            {
                id: 2,
                name: 'Ingénieur Logiciel',
                match: 89,
                domain: 'Informatique',
                avgSalary: '500k-900k FCFA',
                schools: ['ENEAM', 'IST'],
            },
            {
                id: 3,
                name: 'Bio-informaticien',
                match: 85,
                domain: 'Sciences',
                avgSalary: '550k-1M FCFA',
                schools: ['UAC', 'IRSP'],
            },
        ],

        // ===== PARCOURS DE FORMATION RECOMMANDÉS =====
        recommendedPaths: [
            {
                id: 1,
                name: 'Licence Informatique → Master IA',
                duration: '5 ans',
                schools: ['UAC', 'EPAC', 'ENEAM'],
                prerequisites: 'BAC C ou D',
                employability: '92%',
            },
            {
                id: 2,
                name: 'BTS SIO → Licence Pro Data',
                duration: '3 ans',
                schools: ['ESGIS', 'IST', 'IFRI'],
                prerequisites: 'BAC Toutes séries',
                employability: '87%',
            },
        ],

        // ===== ÉCOLES FAVORIS =====
        favoriteSchools: [
            {
                id: 1,
                name: 'EPAC - UAC',
                location: 'Abomey-Calavi',
                programs: ['Génie Logiciel', 'IA'],
                distance: '12 km',
            },
            {
                id: 2,
                name: 'ENEAM',
                location: 'Cotonou',
                programs: ['Informatique de Gestion'],
                distance: '5 km',
            },
        ],

        // ===== PROJETS & EXPÉRIENCES =====
        projects: [
            {
                id: 1,
                title: 'Application de gestion des notes',
                description: 'Application mobile pour lycéens',
                skills: ['React Native', 'Firebase'],
                date: '2024',
            },
        ],

        skills: ['Python', 'JavaScript', 'HTML/CSS', 'Résolution de problèmes', "Travail d'équipe"],

        // ===== PRÉFÉRENCES D'ORIENTATION =====
        orientationPreferences: {
            preferredDomains: ['Informatique', 'Mathématiques', "Sciences de l'ingénieur"],
            mobility: 'Région sud (Cotonou, Porto-Novo, Abomey-Calavi)',
            budget: '1-2 millions FCFA/an',
            scholarship: true,
            housing: 'Logement familial',
            preferredSchoolType: 'Université publique',
            internshipDesired: true,
        },

        // ===== STATISTIQUES PERSONNELLES =====
        stats: {
            testsCompleted: 3,
            recommendationsViewed: 24,
            favoritesSaved: 8,
            chatInteractions: 156,
            pdfReportsDownloaded: 4,
            lastActive: '2024-12-15',
        },

        // ===== NOTIFICATIONS & PRÉFÉRENCES =====
        preferences: {
            emailNotifications: true,
            smsNotifications: false,
            newsletterSubscribe: true,
            language: 'Français',
            theme: 'light',
        },

        // ===== CERTIFICATIONS =====
        certifications: [{ name: 'Certificat Python - OpenClassrooms', date: '2024-09' }],
    });

    const [formData, setFormData] = useState({ ...user });

    const handleEditToggle = () => {
        if (isEditing) {
            setUser({ ...formData });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e, section, field) => {
        const { value, checked, type } = e.target;
        if (section) {
            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: type === 'checkbox' ? checked : value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: type === 'checkbox' ? checked : value }));
        }
    };

    return (
        <div className="popi-profile-page">
            {/* En-tête avec bannière */}
            <div className="profile-banner">
                <div className="banner-bg">
                    <div className="banner-overlay"></div>
                    <div className="banner-content">
                        <div className="school-badge">
                            🎓 POPI - Plateforme d'Orientation Professionnelle Intelligente
                        </div>
                        <div className="user-level-badge">
                            {user.currentLevel} • {user.nextExam}
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-container">
                {/* Section avatar et identité */}
                <div className="profile-identity-card">
                    <div className="avatar-section">
                        <div className="avatar-wrapper">
                            <img
                                src={`https://ui-avatars.com/api/?background=1E3A5F&color=fff&size=120&name=${user.firstName}+${user.lastName}&bold=true&length=2`}
                                alt="Avatar"
                                className="avatar"
                            />
                            <button className="edit-avatar-btn">
                                <i className="fas fa-camera"></i>
                            </button>
                        </div>
                        <div className="identity-info">
                            <h1>
                                {user.firstName} {user.lastName}
                            </h1>
                            <div className="identity-details">
                                <span className="id-badge">
                                    <i className="fas fa-id-card"></i> {user.id}
                                </span>
                                <span className="location-badge">
                                    <i className="fas fa-map-marker-alt"></i> {user.location}
                                </span>
                                <span className="school-badge">
                                    <i className="fas fa-school"></i> {user.institution}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button
                            className={`edit-btn ${isEditing ? 'save' : ''}`}
                            onClick={handleEditToggle}
                        >
                            <i className={`fas ${isEditing ? 'fa-save' : 'fa-edit'}`}></i>
                            {isEditing ? 'Enregistrer' : 'Modifier mon profil'}
                        </button>
                        <button className="download-pdf-btn">
                            <i className="fas fa-download"></i> Rapport PDF
                        </button>
                    </div>
                </div>

                {/* Navigation par onglets */}
                <div className="profile-tabs">
                    <button
                        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <i className="fas fa-chart-line"></i> Vue d'ensemble
                    </button>
                    <button
                        className={`tab ${activeTab === 'riasec' ? 'active' : ''}`}
                        onClick={() => setActiveTab('riasec')}
                    >
                        <i className="fas fa-chart-pie"></i> Profil RIASEC
                    </button>
                    <button
                        className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recommendations')}
                    >
                        <i className="fas fa-graduation-cap"></i> Recommandations
                    </button>
                    <button
                        className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
                        onClick={() => setActiveTab('favorites')}
                    >
                        <i className="fas fa-heart"></i> Favoris
                    </button>
                    <button
                        className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <i className="fas fa-history"></i> Historique
                    </button>
                    <button
                        className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <i className="fas fa-cog"></i> Paramètres
                    </button>
                </div>

                {/* Contenu principal */}
                <div className="profile-content">
                    {/* ===== ONGLET VUE D'ENSEMBLE ===== */}
                    {activeTab === 'overview' && (
                        <>
                            {/* Statistiques rapides */}
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <i className="fas fa-test-tube"></i>
                                    <div className="stat-info">
                                        <span className="stat-value">
                                            {user.stats.testsCompleted}
                                        </span>
                                        <span className="stat-label">Tests complétés</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <i className="fas fa-eye"></i>
                                    <div className="stat-info">
                                        <span className="stat-value">
                                            {user.stats.recommendationsViewed}
                                        </span>
                                        <span className="stat-label">Recommandations vues</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <i className="fas fa-bookmark"></i>
                                    <div className="stat-info">
                                        <span className="stat-value">
                                            {user.stats.favoritesSaved}
                                        </span>
                                        <span className="stat-label">Favoris</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <i className="fas fa-robot"></i>
                                    <div className="stat-info">
                                        <span className="stat-value">
                                            {user.stats.chatInteractions}
                                        </span>
                                        <span className="stat-label">Messages avec POPI Bot</span>
                                    </div>
                                </div>
                            </div>

                            <div className="two-columns">
                                {/* Colonne gauche */}
                                <div className="left-column">
                                    {/* Profil RIASEC */}
                                    <div className="info-card riasec-card">
                                        <h3>
                                            <i className="fas fa-chart-radar"></i> Votre Profil
                                            RIASEC
                                        </h3>
                                        <div className="riasec-code-large">
                                            <span className="code-letter I">I</span>
                                            <span className="code-letter E">E</span>
                                            <span className="code-letter S">S</span>
                                        </div>
                                        <p className="riasec-desc">{user.riasecDescription}</p>
                                        <div className="riasec-scores">
                                            {Object.entries(user.riasecProfile).map(
                                                ([type, score]) => (
                                                    <div key={type} className="score-bar">
                                                        <span className="score-label">{type}</span>
                                                        <div className="bar-bg">
                                                            <div
                                                                className="bar-fill"
                                                                style={{ width: `${score}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="score-value">
                                                            {score}%
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Informations personnelles */}
                                    <div className="info-card">
                                        <h3>
                                            <i className="fas fa-user"></i> Informations
                                            personnelles
                                        </h3>
                                        <div className="info-grid">
                                            <div className="info-item">
                                                <i className="fas fa-envelope"></i>
                                                <span className="info-label">Email</span>
                                                <p>{user.email}</p>
                                            </div>
                                            <div className="info-item">
                                                <i className="fas fa-phone"></i>
                                                <span className="info-label">Téléphone</span>
                                                <p>{user.phone}</p>
                                            </div>
                                            <div className="info-item">
                                                <i className="fas fa-calendar"></i>
                                                <span className="info-label">
                                                    Date de naissance
                                                </span>
                                                <p>
                                                    {new Date(user.birthDate).toLocaleDateString(
                                                        'fr-FR',
                                                    )}
                                                </p>
                                            </div>
                                            <div className="info-item">
                                                <i className="fas fa-map-marker-alt"></i>
                                                <span className="info-label">Commune</span>
                                                <p>{user.commune}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Préférences d'orientation */}
                                    <div className="info-card">
                                        <h3>
                                            <i className="fas fa-compass"></i> Mes préférences
                                            d'orientation
                                        </h3>
                                        <div className="preferences-list">
                                            <div className="pref-item">
                                                <i className="fas fa-chart-line"></i>
                                                <span>Domaines préférés</span>
                                                <div className="pref-tags">
                                                    {user.orientationPreferences.preferredDomains.map(
                                                        (domain) => (
                                                            <span key={domain} className="pref-tag">
                                                                {domain}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            <div className="pref-item">
                                                <i className="fas fa-map-marked-alt"></i>
                                                <span>Mobilité</span>
                                                <p>{user.orientationPreferences.mobility}</p>
                                            </div>
                                            <div className="pref-item">
                                                <i className="fas fa-money-bill"></i>
                                                <span>Budget</span>
                                                <p>{user.orientationPreferences.budget}</p>
                                            </div>
                                            <div className="pref-item">
                                                <i className="fas fa-graduation-cap"></i>
                                                <span>Type d'établissement</span>
                                                <p>
                                                    {
                                                        user.orientationPreferences
                                                            .preferredSchoolType
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Colonne droite */}
                                <div className="right-column">
                                    {/* Top métiers recommandés */}
                                    <div className="info-card">
                                        <h3>
                                            <i className="fas fa-briefcase"></i> Top métiers pour
                                            vous
                                        </h3>
                                        {user.recommendedCareers.map((career) => (
                                            <div key={career.id} className="career-card">
                                                <div className="career-header">
                                                    <h4>{career.name}</h4>
                                                    <span className="match-badge">
                                                        {career.match}% match
                                                    </span>
                                                </div>
                                                <p className="career-domain">
                                                    <i className="fas fa-tag"></i> {career.domain}
                                                </p>
                                                <p className="career-salary">
                                                    <i className="fas fa-money-bill"></i>{' '}
                                                    {career.avgSalary}
                                                </p>
                                                <div className="career-schools">
                                                    <span>Écoles:</span>
                                                    {career.schools.map((school) => (
                                                        <span key={school} className="school-tag">
                                                            {school}
                                                        </span>
                                                    ))}
                                                </div>
                                                <button className="save-career-btn">
                                                    <i className="far fa-heart"></i> Sauvegarder
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Progression du parcours */}
                                    <div className="info-card">
                                        <h3>
                                            <i className="fas fa-chart-simple"></i> Mon parcours
                                            d'orientation
                                        </h3>
                                        <div className="timeline">
                                            <div className="timeline-item completed">
                                                <div className="timeline-icon">
                                                    <i className="fas fa-check"></i>
                                                </div>
                                                <div className="timeline-content">
                                                    <h4>BEPC obtenu</h4>
                                                    <p>2022 - Mention Assez Bien</p>
                                                </div>
                                            </div>
                                            <div className="timeline-item active">
                                                <div className="timeline-icon">
                                                    <i className="fas fa-spinner"></i>
                                                </div>
                                                <div className="timeline-content">
                                                    <h4>Préparation BAC</h4>
                                                    <p>Juin 2025 - Série D</p>
                                                </div>
                                            </div>
                                            <div className="timeline-item pending">
                                                <div className="timeline-icon">
                                                    <i className="far fa-circle"></i>
                                                </div>
                                                <div className="timeline-content">
                                                    <h4>Choix de la filière universitaire</h4>
                                                    <p>Basé sur votre profil IES</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compétences */}
                                    <div className="info-card">
                                        <h3>
                                            <i className="fas fa-code"></i> Mes compétences
                                        </h3>
                                        <div className="skills-container">
                                            {user.skills.map((skill) => (
                                                <span key={skill} className="skill-tag">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ===== ONGLET PROFIL RIASEC ===== */}
                    {activeTab === 'riasec' && (
                        <div className="riasec-detailed">
                            <div className="info-card full-width">
                                <h3>
                                    <i className="fas fa-chart-radar"></i> Analyse détaillée de
                                    votre profil RIASEC
                                </h3>
                                <div className="riasec-description-detailed">
                                    <div className="riasec-type I">
                                        <h4>Investigateur (I) - 88%</h4>
                                        <p>
                                            Vous aimez observer, apprendre, analyser et résoudre des
                                            problèmes complexes. Vous êtes curieux
                                            intellectuellement et appréciez le travail indépendant.
                                        </p>
                                        <div className="careers-example">
                                            Métiers associés : Chercheur, Data Scientist, Médecin,
                                            Analyste
                                        </div>
                                    </div>
                                    <div className="riasec-type E">
                                        <h4>Entreprenant (E) - 45%</h4>
                                        <p>
                                            Vous aimez diriger, persuader et atteindre des
                                            objectifs. Vous avez un bon sens des affaires.
                                        </p>
                                        <div className="careers-example">
                                            Métiers associés : Entrepreneur, Manager, Commercial
                                        </div>
                                    </div>
                                    <div className="riasec-type S">
                                        <h4>Social (S) - 78%</h4>
                                        <p>
                                            Vous aimez aider, former et conseiller les autres. Vous
                                            avez de l'empathie et aimez le travail en équipe.
                                        </p>
                                        <div className="careers-example">
                                            Métiers associés : Enseignant, Psychologue, Médecin,
                                            Conseiller
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card">
                                <h3>
                                    <i className="fas fa-chart-line"></i> Évolution de votre profil
                                </h3>
                                <div className="evolution-chart">
                                    {user.testHistory.map((test, idx) => (
                                        <div key={idx} className="evolution-item">
                                            <span className="evolution-date">{test.date}</span>
                                            <span className="evolution-code">
                                                {test.riasecCode}
                                            </span>
                                            <div className="evolution-confidence">
                                                <div
                                                    className="confidence-bar"
                                                    style={{ width: `${test.confidence * 100}%` }}
                                                ></div>
                                                <span>{Math.round(test.confidence * 100)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== ONGLET RECOMMANDATIONS ===== */}
                    {activeTab === 'recommendations' && (
                        <div>
                            <div className="info-card">
                                <h3>
                                    <i className="fas fa-road"></i> Parcours de formation
                                    recommandés
                                </h3>
                                {user.recommendedPaths.map((path) => (
                                    <div key={path.id} className="path-card">
                                        <h4>{path.name}</h4>
                                        <div className="path-details">
                                            <span>
                                                <i className="fas fa-clock"></i> Durée:{' '}
                                                {path.duration}
                                            </span>
                                            <span>
                                                <i className="fas fa-school"></i>{' '}
                                                {path.schools.join(', ')}
                                            </span>
                                            <span>
                                                <i className="fas fa-check-circle"></i> Prérequis:{' '}
                                                {path.prerequisites}
                                            </span>
                                            <span>
                                                <i className="fas fa-chart-line"></i> Employabilité:{' '}
                                                {path.employability}
                                            </span>
                                        </div>
                                        <button className="explore-btn">
                                            Explorer ce parcours
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ===== ONGLET FAVORIS ===== */}
                    {activeTab === 'favorites' && (
                        <div className="favorites-grid">
                            <div className="info-card">
                                <h3>
                                    <i className="fas fa-university"></i> Établissements favoris
                                </h3>
                                {user.favoriteSchools.map((school) => (
                                    <div key={school.id} className="school-favorite-card">
                                        <h4>{school.name}</h4>
                                        <p>
                                            <i className="fas fa-map-marker-alt"></i>{' '}
                                            {school.location} • Distance: {school.distance}
                                        </p>
                                        <p>
                                            <i className="fas fa-book"></i> Programmes:{' '}
                                            {school.programs.join(', ')}
                                        </p>
                                        <button className="remove-fav-btn">
                                            <i className="fas fa-trash"></i> Retirer
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ===== ONGLET HISTORIQUE ===== */}
                    {activeTab === 'history' && (
                        <div className="info-card">
                            <h3>
                                <i className="fas fa-history"></i> Mon activité sur POPI
                            </h3>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <i className="fas fa-test-tube"></i>
                                    <div>
                                        <p>
                                            <strong>Test d'orientation complété</strong>
                                        </p>
                                        <span className="activity-date">
                                            15 décembre 2024 - Profil IES (92% confiance)
                                        </span>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <i className="fas fa-download"></i>
                                    <div>
                                        <p>
                                            <strong>Rapport PDF téléchargé</strong>
                                        </p>
                                        <span className="activity-date">
                                            10 décembre 2024 - Rapport complet orientation
                                        </span>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <i className="fas fa-robot"></i>
                                    <div>
                                        <p>
                                            <strong>Chatbot POPI consulté</strong>
                                        </p>
                                        <span className="activity-date">
                                            5 décembre 2024 - Questions sur les métiers de l'IA
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== ONGLET PARAMÈTRES ===== */}
                    {activeTab === 'settings' && (
                        <div className="settings-section">
                            <div className="info-card">
                                <h3>
                                    <i className="fas fa-bell"></i> Notifications
                                </h3>
                                <div className="setting-item">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={user.preferences.emailNotifications}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    'preferences',
                                                    'emailNotifications',
                                                )
                                            }
                                        />
                                        Recevoir des recommandations par email
                                    </label>
                                </div>
                                <div className="setting-item">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={user.preferences.smsNotifications}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    'preferences',
                                                    'smsNotifications',
                                                )
                                            }
                                        />
                                        Recevoir des alertes par SMS
                                    </label>
                                </div>
                                <div className="setting-item">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={user.preferences.newsletterSubscribe}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    'preferences',
                                                    'newsletterSubscribe',
                                                )
                                            }
                                        />
                                        Newsletter POPI
                                    </label>
                                </div>
                            </div>

                            <div className="info-card">
                                <h3>
                                    <i className="fas fa-shield-alt"></i> Confidentialité
                                </h3>
                                <div className="privacy-actions">
                                    <button className="danger-btn">
                                        <i className="fas fa-download"></i> Exporter mes données
                                    </button>
                                    <button className="danger-btn delete">
                                        <i className="fas fa-trash-alt"></i> Supprimer mon compte
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section d'aide - Chatbot flottant */}
                <div className="chatbot-floating">
                    <button className="chatbot-btn">
                        <i className="fas fa-robot"></i>
                        <span>POPI Bot</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
