// Au début de votre fichier bourses-aides.jsx, remplacez tous les imports par :

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Import des icônes solid (gratuites)
import {
    faGraduationCap,
    faGlobeAfrica,
    faPlane,
    faCalendarAlt,
    faMoneyBillWave,
    faClock,
    faSearch,
    faFilter,
    faHeart,
    faShare,
    faBookmark,
    faEuroSign,
    faDollarSign,
    faMapMarkerAlt,
    faUniversity,
    faAward,
    faLanguage,
    faFileAlt,
    faCheckCircle,
    faTimesCircle,
    faExternalLinkAlt,
    faStar,
    faStarHalfAlt,
    faUsers,
    faBriefcase,
    faHome,
    faChartLine,
    faInfoCircle,
    faChevronDown,
    faChevronUp,
    faPassport,
    faPalette,
    faMusic,
    faFilm,
    faBook,
    faLaptopCode,
    faSeedling,
    faHandsHelping,
    faChalkboardTeacher,
    faMask,
    faPaintbrush,
    faCamera,
    faGuitar,
    faDrum,
    faFeather,
    faBrush,
    faMicrophoneAlt,
    faCompactDisc,
    faHandHoldingHeart,
} from '@fortawesome/free-solid-svg-icons';

// Import des icônes de marques
import {
    faFacebook,
    faTwitter,
    faWhatsapp,
    faLinkedin,
    faCcVisa,
} from '@fortawesome/free-brands-svg-icons';

// Import du CSS
import '../styles/bourses-aides.css';

const Scholarships = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);
    const [savedScholarships, setSavedScholarships] = useState([]);
    const [activeTab, setActiveTab] = useState('all');

    // Données des bourses (incluant celles en partenariat avec le Bénin)
    const scholarships = [
        // Bourses spécifiques Bénin - Nouveautés
        {
            id: 1,
            title: "Bourse d'Excellence France-Bénin",
            country: 'France',
            countryCode: 'FR',
            university: 'Campus France & Universités béninoises',
            level: 'Licence, Master, Doctorat',
            type: 'Partenariat bilatéral',
            deadline: '2025-04-30',
            amount: 'Complet',
            duration: '12-60 mois',
            coverage: [
                'Frais de scolarité',
                'Allocation mensuelle (900€)',
                "Billet d'avion aller-retour",
                'Assurance maladie',
                'Visa gratuit',
                'Logement en résidence universitaire',
            ],
            requirements: [
                'Être de nationalité béninoise',
                'Être âgé de moins de 30 ans',
                'Avoir un excellent dossier académique',
                "Projet d'étude clair et motivé",
                'Maîtrise du français (niveau B2 minimum)',
            ],
            description:
                "Un programme d'excellence financé par les gouvernements français et béninois pour former les futurs cadres du Bénin dans les domaines prioritaires du développement.",
            rating: 4.9,
            applications: 450,
            deadlineDays: 42,
            languages: ['Français'],
            fields: [
                'Ingénierie',
                'Sciences',
                'Économie',
                'Droit',
                'Sciences politiques',
                'Médecine',
            ],
            beninPartnership: true,
        },
        {
            id: 2,
            title: 'Bourse Artistique et Culturelle OIF-Bénin',
            country: 'France, Belgique, Canada, Suisse',
            countryCode: 'INT',
            university: "Écoles d'art partenaires",
            level: 'Licence & Master',
            type: 'Artistique',
            deadline: '2025-05-15',
            amount: '15,000€/an',
            duration: '24-48 mois',
            coverage: [
                'Frais de scolarité',
                'Allocation mensuelle (1,000€)',
                'Matériel artistique',
                "Billet d'avion",
                'Expositions et résidences artistiques',
            ],
            requirements: [
                'Artiste ou créateur béninois',
                'Portfolio solide',
                'Projet artistique innovant',
                "Lettres de recommandation d'artistes reconnus",
                'Niveau B2 en français',
            ],
            description:
                "Une bourse unique dédiée aux artistes béninois souhaitant se former dans les meilleures écoles d'art francophones. Soutenue par l'Organisation Internationale de la Francophonie.",
            rating: 4.8,
            applications: 120,
            deadlineDays: 57,
            languages: ['Français'],
            fields: [
                'Arts plastiques',
                'Design',
                'Mode',
                'Photographie',
                'Cinéma',
                'Théâtre',
                'Danse',
                'Musique',
            ],
            beninPartnership: true,
            artistic: true,
        },
        {
            id: 3,
            title: 'Programme de Bourses Chine-Bénin pour les Arts',
            country: 'Chine',
            countryCode: 'CN',
            university: 'Académies des Beaux-Arts de Chine',
            level: 'Licence, Master, Doctorat',
            type: 'Culturel & Artistique',
            deadline: '2025-04-20',
            amount: 'Complet',
            duration: '12-48 mois',
            coverage: [
                'Frais de scolarité',
                'Logement sur campus',
                'Allocation mensuelle (2,500¥)',
                "Billet d'avion",
                'Cours de chinois',
                'Matériel artistique',
            ],
            requirements: [
                'Artiste béninois',
                'Portfolio exceptionnel',
                'Âge maximum: 35 ans',
                'Expérience en expositions',
                'Projet de recherche artistique',
            ],
            description:
                "Le gouvernement chinois offre des bourses spéciales pour les artistes béninois dans le cadre du partenariat culturel sino-béninois. Formation dans les meilleures académies d'art de Chine.",
            rating: 4.7,
            applications: 85,
            deadlineDays: 32,
            languages: ['Chinois', 'Anglais'],
            fields: [
                'Calligraphie',
                'Peinture chinoise',
                'Céramique',
                'Design',
                'Animation',
                'Arts numériques',
            ],
            beninPartnership: true,
            artistic: true,
        },
        {
            id: 4,
            title: 'Bourse de la Francophonie pour Artistes Béninois',
            country: 'Canada (Québec)',
            countryCode: 'CA',
            university: 'Université du Québec à Montréal (UQAM)',
            level: 'Master',
            type: 'Artistique & Culturelle',
            deadline: '2025-06-01',
            amount: '25,000 CAD/an',
            duration: '24 mois',
            coverage: [
                'Frais de scolarité',
                'Allocation de subsistance',
                "Atelier d'artiste",
                "Billet d'avion",
                'Assurance santé',
                'Expositions',
            ],
            requirements: [
                'Artiste professionnel béninois',
                'Diplôme universitaire en arts',
                'Portfolio de qualité',
                'Projet de création',
                'Français courant',
            ],
            description:
                "Programme d'excellence pour les artistes béninois souhaitant développer leur pratique artistique dans un environnement créatif unique à Montréal, capitale culturelle du Québec.",
            rating: 4.9,
            applications: 95,
            deadlineDays: 74,
            languages: ['Français'],
            fields: [
                'Arts visuels',
                'Médias numériques',
                'Design graphique',
                'Scénographie',
                'Arts médiatiques',
            ],
            beninPartnership: true,
            artistic: true,
        },
        {
            id: 5,
            title: 'Bourse Erasmus+ Mobilité Artistique Bénin-Europe',
            country: 'Europe (Multiples pays)',
            countryCode: 'EU',
            university: "Consortium d'écoles d'art européennes",
            level: 'Master & Doctorat',
            type: 'Échanges culturels',
            deadline: '2025-05-30',
            amount: '1,500€/mois',
            duration: '12-24 mois',
            coverage: [
                'Frais de scolarité',
                'Allocation mensuelle',
                'Voyages inter-européens',
                'Résidences artistiques',
                'Expositions internationales',
            ],
            requirements: [
                'Étudiant ou artiste béninois',
                'Projet artistique innovant',
                'Expérience internationale',
                'Anglais ou français B2',
                'Lettres de motivation',
            ],
            description:
                "Un programme unique permettant aux artistes béninois de voyager et d'étudier dans plusieurs pays européens tout en développant leur réseau artistique international.",
            rating: 4.8,
            applications: 150,
            deadlineDays: 72,
            languages: ['Anglais', 'Français'],
            fields: [
                'Arts contemporains',
                'Performance',
                'Installation',
                'Art numérique',
                'Curating',
            ],
            beninPartnership: true,
            artistic: true,
        },
        {
            id: 6,
            title: "Bourse de l'Union Africaine pour Jeunes Talents Béninois",
            country: 'Afrique du Sud, Maroc, Égypte, Sénégal',
            countryCode: 'AF',
            university: "Universités et écoles d'art africaines",
            level: 'Licence & Master',
            type: 'Développement culturel',
            deadline: '2025-07-15',
            amount: 'Variable (50-100%)',
            duration: '12-48 mois',
            coverage: [
                'Frais de scolarité',
                'Logement',
                'Allocation',
                'Transport local',
                'Matériel',
            ],
            requirements: [
                'Jeune talent béninois (18-30 ans)',
                'Projet à impact social',
                'Engagement communautaire',
                'Portfolio ou dossier académique',
                'Lettre de recommandation',
            ],
            description:
                "L'Union Africaine soutient les jeunes talents béninois dans les domaines artistiques, culturels et créatifs pour promouvoir la renaissance culturelle africaine.",
            rating: 4.7,
            applications: 200,
            deadlineDays: 118,
            languages: ['Français', 'Anglais'],
            fields: [
                'Musique traditionnelle',
                'Danse africaine',
                'Théâtre engagé',
                'Cinéma documentaire',
                'Arts textiles',
                'Design produit',
            ],
            beninPartnership: true,
            artistic: true,
        },
        {
            id: 7,
            title: 'Bourse de Coopération Maroc-Bénin',
            country: 'Maroc',
            countryCode: 'MA',
            university: 'Universités marocaines',
            level: 'Licence, Master, Doctorat',
            type: 'Coopération Sud-Sud',
            deadline: '2025-08-31',
            amount: 'Complet',
            duration: '12-60 mois',
            coverage: [
                'Frais de scolarité',
                'Logement',
                'Allocation mensuelle (3,000 MAD)',
                "Billet d'avion",
                'Assurance maladie',
            ],
            requirements: [
                'Nationalité béninoise',
                'Moyenne supérieure à 14/20',
                'Âge maximum: 28 ans',
                'Motivation pour le développement du Bénin',
                'Test de français ou arabe',
            ],
            description:
                'Un programme de coopération entre le Maroc et le Bénin pour former des cadres supérieurs dans les domaines prioritaires du développement.',
            rating: 4.6,
            applications: 310,
            deadlineDays: 165,
            languages: ['Français', 'Arabe'],
            fields: [
                'Agriculture',
                "Gestion de l'eau",
                'Énergies renouvelables',
                'Tourisme',
                'Hôtellerie',
                'Art culinaire',
            ],
            beninPartnership: true,
        },
        {
            id: 8,
            title: "Bourse d'Excellence Eiffel",
            country: 'France',
            countryCode: 'FR',
            university: 'Universités françaises partenaires',
            level: 'Master & Doctorat',
            type: 'Mérite',
            deadline: '2025-01-10',
            amount: '1,181 €/mois',
            duration: '12-36 mois',
            coverage: [
                'Frais de scolarité',
                'Allocation mensuelle',
                'Assurance maladie',
                "Billets d'avion",
            ],
            requirements: [
                'Nationalité étrangère',
                'Âge maximum: 25 ans (Master) / 30 ans (Doctorat)',
                'Excellence académique',
                "Projet d'étude en France",
            ],
            description:
                "La bourse Eiffel est un dispositif d'excellence qui permet de former de futurs décideurs étrangers dans les domaines prioritaires de la France.",
            rating: 4.8,
            applications: 1245,
            deadlineDays: 45,
            languages: ['Français', 'Anglais'],
            fields: ['Ingénierie', 'Sciences politiques', 'Économie', 'Droit'],
            beninPartnership: false,
        },
        {
            id: 9,
            title: 'Bourse Chevening',
            country: 'Royaume-Uni',
            countryCode: 'GB',
            university: 'Universités britanniques',
            level: 'Master',
            type: 'Leadership',
            deadline: '2025-11-05',
            amount: 'Complet',
            duration: '12 mois',
            coverage: ['Frais de scolarité', 'Frais de vie', "Billet d'avion", 'Frais de visa'],
            requirements: [
                "Diplômé d'un bachelor",
                "2 ans d'expérience minimum",
                'Potentiel de leadership',
                "Retour au pays d'origine après les études",
            ],
            description:
                "Le programme Chevening offre aux futurs leaders internationaux la possibilité d'étudier au Royaume-Uni.",
            rating: 4.9,
            applications: 2500,
            deadlineDays: 60,
            languages: ['Anglais'],
            fields: ['Toutes disciplines'],
            beninPartnership: false,
        },
        {
            id: 10,
            title: 'Bourse DAAD',
            country: 'Allemagne',
            countryCode: 'DE',
            university: 'Universités allemandes',
            level: 'Master & Doctorat',
            type: 'Mérite',
            deadline: '2025-10-15',
            amount: '934 €/mois',
            duration: '12-36 mois',
            coverage: [
                'Allocation mensuelle',
                'Assurance maladie',
                'Frais de voyage',
                "Cours d'allemand",
            ],
            requirements: [
                "Diplôme de fin d'études supérieures",
                'Expérience professionnelle (selon programme)',
                'Bonnes connaissances en allemand ou anglais',
                'Lettre de motivation solide',
            ],
            description:
                "Les bourses DAAD soutiennent les étudiants internationaux souhaitant étudier en Allemagne, un pays leader dans la recherche et l'innovation.",
            rating: 4.7,
            applications: 1890,
            deadlineDays: 50,
            languages: ['Allemand', 'Anglais'],
            fields: ['Sciences', 'Ingénierie', 'Arts', 'Développement'],
            beninPartnership: false,
        },
        {
            id: 11,
            title: 'Bourse Mastercard Foundation Scholars Program',
            country: 'Multiple',
            countryCode: 'INT',
            university: 'Universités partenaires (Afrique, Europe, USA)',
            level: 'Licence & Master',
            type: 'Leadership & Impact',
            deadline: '2025-09-30',
            amount: 'Complet',
            duration: "Jusqu'à 48 mois",
            coverage: [
                'Frais académiques complets',
                'Logement',
                'Matériel informatique',
                'Transport',
                'Soutien psychosocial',
            ],
            requirements: [
                'Étudiant africain',
                'Engagement communautaire',
                'Leadership démontré',
                'Besoins financiers',
            ],
            description:
                'Un programme transformateur qui forme la prochaine génération de leaders africains capables de créer un changement social.',
            rating: 4.9,
            applications: 3200,
            deadlineDays: 35,
            languages: ['Anglais', 'Français', 'Portugais'],
            fields: ['Éducation', 'Santé', 'Agriculture', 'Ingénierie'],
            beninPartnership: false,
        },
        {
            id: 12,
            title: 'Bourse du Gouvernement Turc (Türkiye Burslari)',
            country: 'Turquie',
            countryCode: 'TR',
            university: 'Universités turques',
            level: 'Licence, Master, Doctorat',
            type: 'Gouvernementale',
            deadline: '2025-02-20',
            amount: 'Complet',
            duration: '12-48 mois',
            coverage: [
                'Frais de scolarité',
                'Logement',
                'Allocation mensuelle (800 TL)',
                "Billet d'avion",
                'Cours de turc',
            ],
            requirements: [
                'Nationalité béninoise',
                'Moyenne minimale 70%',
                'Âge maximum: 21 ans (Licence), 30 ans (Master), 35 ans (Doctorat)',
                'Santé physique et mentale',
            ],
            description:
                'Le gouvernement turc offre des bourses complètes aux étudiants béninois excellents dans tous les domaines, y compris les arts et la culture.',
            rating: 4.5,
            applications: 280,
            deadlineDays: 8,
            languages: ['Turc', 'Anglais'],
            fields: [
                'Toutes disciplines',
                'Arts islamiques',
                'Musique ottomane',
                'Architecture',
                'Cinéma',
            ],
            beninPartnership: true,
        },
        {
            id: 13,
            title: "Bourse de l'Ambassade du Japon pour Artistes",
            country: 'Japon',
            countryCode: 'JP',
            university: 'Universités des Arts de Tokyo',
            level: 'Master & Doctorat',
            type: 'Artistique & Culturel',
            deadline: '2025-04-25',
            amount: '147,000 ¥/mois',
            duration: '24-36 mois',
            coverage: [
                'Allocation mensuelle',
                'Frais de scolarité',
                "Billet d'avion",
                'Cours de japonais',
                'Matériel artistique',
            ],
            requirements: [
                'Artiste béninois',
                'Portfolio exceptionnel',
                'Âge maximum: 35 ans',
                'Expérience en expositions',
                'Projet de recherche artistique',
            ],
            description:
                "Le gouvernement japonais offre des bourses aux artistes béninois talentueux pour étudier dans les meilleures écoles d'art du Japon.",
            rating: 4.9,
            applications: 60,
            deadlineDays: 37,
            languages: ['Japonais', 'Anglais'],
            fields: [
                'Arts traditionnels japonais',
                'Manga',
                'Anime',
                'Design',
                'Photographie',
                'Céramique',
            ],
            beninPartnership: true,
            artistic: true,
        },
        {
            id: 14,
            title: "Bourse de l'Organisation des États Américains",
            country: 'Amérique Latine',
            countryCode: 'INT',
            university: 'Universités latino-américaines',
            level: 'Master & Doctorat',
            type: 'Échanges académiques',
            deadline: '2025-06-15',
            amount: 'Variable',
            duration: '12-24 mois',
            coverage: ['Frais de scolarité partiels', 'Allocation', 'Assurance maladie'],
            requirements: [
                'Diplôme universitaire',
                'Expérience professionnelle',
                'Projet de coopération',
                'Espagnol ou portugais',
                'Lettres de recommandation',
            ],
            description:
                "Programme d'échanges pour les professionnels béninois souhaitant étudier en Amérique latine dans les domaines du développement et de la culture.",
            rating: 4.4,
            applications: 95,
            deadlineDays: 88,
            languages: ['Espagnol', 'Portugais', 'Anglais'],
            fields: [
                'Développement social',
                'Culture latino-américaine',
                'Musique',
                'Danse',
                'Cinéma',
                'Littérature',
            ],
            beninPartnership: true,
        },
        {
            id: 15,
            title: 'Bourse Voices of African Artists',
            country: 'Afrique du Sud',
            countryCode: 'ZA',
            university: 'University of Cape Town',
            level: 'Master',
            type: 'Artistique',
            deadline: '2025-07-30',
            amount: 'Complet',
            duration: '24 mois',
            coverage: [
                'Frais de scolarité',
                'Logement',
                'Allocation',
                "Studio d'artiste",
                'Expositions',
                'Réseautage',
            ],
            requirements: [
                'Artiste béninois émergent',
                'Portfolio innovant',
                "Engagement pour l'art africain",
                'Anglais B2',
                'Projet artistique',
            ],
            description:
                'Un programme prestigieux pour les artistes africains émergents, avec un focus sur la scène artistique contemporaine africaine.',
            rating: 4.8,
            applications: 110,
            deadlineDays: 133,
            languages: ['Anglais'],
            fields: [
                'Art contemporain africain',
                'Performance',
                'Installation',
                'Photographie documentaire',
                'Artivisme',
            ],
            beninPartnership: true,
            artistic: true,
        },
    ];

    // Statistiques
    const stats = [
        { icon: faGraduationCap, value: '5000+', label: 'Bourses disponibles' },
        { icon: faGlobeAfrica, value: '50+', label: "Pays d'accueil" },
        { icon: faUsers, value: '10000+', label: 'Étudiants aidés' },
        { icon: faEuroSign, value: '€50M+', label: 'Financements' },
        { icon: faPalette, value: '200+', label: 'Bourses artistiques' },
        { icon: faHandsHelping, value: '15', label: 'Partenaires Bénin' },
    ];

    // Conseils pour les candidatures
    const tips = [
        {
            title: 'Préparez votre dossier tôt',
            description: 'Commencez au moins 6 mois avant la date limite',
            icon: faClock,
        },
        {
            title: 'Soignez votre lettre de motivation',
            description: 'Personnalisez-la pour chaque bourse',
            icon: faFileAlt,
        },
        {
            title: 'Obtenez de bonnes recommandations',
            description: 'Choisissez des professeurs qui vous connaissent bien',
            icon: faUsers,
        },
        {
            title: 'Préparez les tests de langue',
            description: 'TOEFL, IELTS, DELF/DALF, etc.',
            icon: faLanguage,
        },
        {
            title: 'Pour les artistes : un portfolio percutant',
            description: 'Votre portfolio est votre carte de visite',
            icon: faPalette,
        },
        {
            title: 'Mettez en valeur votre identité culturelle',
            description: 'Les bourses recherchent la diversité',
            icon: faGlobeAfrica,
        },
    ];

    // Filtrer les bourses
    const filteredScholarships = scholarships.filter((scholarship) => {
        const matchesSearch =
            scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scholarship.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scholarship.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scholarship.fields.some((field) =>
                field.toLowerCase().includes(searchTerm.toLowerCase()),
            );

        const matchesCountry = selectedCountry === 'all' || scholarship.country === selectedCountry;
        const matchesLevel = selectedLevel === 'all' || scholarship.level === selectedLevel;
        const matchesType = selectedType === 'all' || scholarship.type === selectedType;
        const matchesTab =
            activeTab === 'all' ||
            (activeTab === 'deadline' && scholarship.deadlineDays <= 30) ||
            (activeTab === 'full' && scholarship.amount === 'Complet') ||
            (activeTab === 'benin' && scholarship.beninPartnership === true) ||
            (activeTab === 'artistic' && scholarship.artistic === true);

        return matchesSearch && matchesCountry && matchesLevel && matchesType && matchesTab;
    });

    // Sauvegarder une bourse
    const toggleSave = (id) => {
        if (savedScholarships.includes(id)) {
            setSavedScholarships(savedScholarships.filter((s) => s !== id));
        } else {
            setSavedScholarships([...savedScholarships, id]);
        }
    };

    // Partager une bourse
    const shareScholarship = (scholarship) => {
        const text = `Découvrez ${scholarship.title} en ${scholarship.country} ! ${scholarship.description.substring(0, 100)}...`;
        if (navigator.share) {
            navigator.share({
                title: scholarship.title,
                text: text,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(text);
            alert('Lien copié dans le presse-papier !');
        }
    };

    // Formater la date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    // Calculer les jours restants
    const getDaysLeft = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Obtenir les pays uniques pour le filtre
    const countries = ['all', ...new Set(scholarships.map((s) => s.country))];
    const levels = ['all', ...new Set(scholarships.map((s) => s.level))];
    const types = ['all', ...new Set(scholarships.map((s) => s.type))];

    return (
        <div className="scholarships-page">
            {/* Hero Section */}
            <section className="scholarships-hero">
                <div className="hero-bg-pattern"></div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <FontAwesomeIcon icon={faAward} />
                            <span>Opportunités internationales</span>
                        </div>
                        <h1>Bourses & Aides Financières</h1>
                        <p>
                            Découvrez les meilleures opportunités de bourses pour étudier à
                            l'étranger. Financez vos études universitaires et réalisez votre rêve de
                            mobilité internationale.
                            <strong className="benin-highlight">
                                {' '}
                                Nombreuses bourses en partenariat avec le Bénin !
                            </strong>
                        </p>
                        <div className="hero-stats">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-card">
                                    <div className="stat-icon">
                                        <FontAwesomeIcon icon={stat.icon} />
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{stat.value}</span>
                                        <span className="stat-label">{stat.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="hero-wave">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
                        <path
                            fill="#f8f9fc"
                            fillOpacity="1"
                            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* Search & Filters */}
            <div className="search-section">
                <div className="container">
                    <div className="search-container">
                        <div className="search-bar">
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Rechercher une bourse, un pays, une université, un domaine ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            className={`filter-toggle ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FontAwesomeIcon icon={faFilter} />
                            <span>Filtres</span>
                            <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} />
                        </button>
                    </div>

                    {showFilters && (
                        <div className="filters-panel slide-down">
                            <div className="filter-group">
                                <label>Pays</label>
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                >
                                    {countries.map((country) => (
                                        <option key={country} value={country}>
                                            {country === 'all' ? 'Tous les pays' : country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Niveau d'études</label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                >
                                    {levels.map((level) => (
                                        <option key={level} value={level}>
                                            {level === 'all' ? 'Tous les niveaux' : level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Type de bourse</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    {types.map((type) => (
                                        <option key={type} value={type}>
                                            {type === 'all' ? 'Tous les types' : type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            Toutes les bourses
                        </button>
                        <button
                            className={`tab ${activeTab === 'benin' ? 'active' : ''}`}
                            onClick={() => setActiveTab('benin')}
                        >
                            <FontAwesomeIcon icon={faGlobeAfrica} />
                            Partenariat Bénin
                        </button>
                        <button
                            className={`tab ${activeTab === 'artistic' ? 'active' : ''}`}
                            onClick={() => setActiveTab('artistic')}
                        >
                            <FontAwesomeIcon icon={faPalette} />
                            Bourses Artistiques
                        </button>
                        <button
                            className={`tab ${activeTab === 'deadline' ? 'active' : ''}`}
                            onClick={() => setActiveTab('deadline')}
                        >
                            <FontAwesomeIcon icon={faClock} />
                            Délai imminent (30j)
                        </button>
                        <button
                            className={`tab ${activeTab === 'full' ? 'active' : ''}`}
                            onClick={() => setActiveTab('full')}
                        >
                            <FontAwesomeIcon icon={faMoneyBillWave} />
                            Bourses complètes
                        </button>
                    </div>
                </div>
            </div>

            {/* Scholarships Grid */}
            <div className="scholarships-section">
                <div className="container">
                    <div className="results-info">
                        <span>{filteredScholarships.length} bourses trouvées</span>
                        {savedScholarships.length > 0 && (
                            <span className="saved-info">
                                <FontAwesomeIcon icon={faBookmark} />
                                {savedScholarships.length} sauvegardée(s)
                            </span>
                        )}
                    </div>

                    <div className="scholarships-grid">
                        {filteredScholarships.map((scholarship) => (
                            <div
                                key={scholarship.id}
                                className={`scholarship-card ${expandedCard === scholarship.id ? 'expanded' : ''} ${scholarship.beninPartnership ? 'benin-partnership' : ''} ${scholarship.artistic ? 'artistic-card' : ''}`}
                            >
                                <div className="card-header">
                                    <div className="card-badge">
                                        <FontAwesomeIcon
                                            icon={scholarship.artistic ? faPalette : faAward}
                                        />
                                        <span>{scholarship.type}</span>
                                    </div>
                                    {scholarship.beninPartnership && (
                                        <div className="benin-badge">
                                            <FontAwesomeIcon icon={faHandsHelping} />
                                            <span>Partenariat Bénin</span>
                                        </div>
                                    )}
                                    <div className="card-actions">
                                        <button
                                            className={`save-btn ${savedScholarships.includes(scholarship.id) ? 'saved' : ''}`}
                                            onClick={() => toggleSave(scholarship.id)}
                                        >
                                            <FontAwesomeIcon icon={faBookmark} />
                                        </button>
                                        <button
                                            className="share-btn"
                                            onClick={() => shareScholarship(scholarship)}
                                        >
                                            <FontAwesomeIcon icon={faShare} />
                                        </button>
                                    </div>
                                </div>

                                <div className="card-content">
                                    <h3>{scholarship.title}</h3>
                                    <div className="location">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        <span>{scholarship.country}</span>
                                        <span className="university">{scholarship.university}</span>
                                    </div>

                                    <div className="card-stats">
                                        <div className="stat">
                                            <FontAwesomeIcon icon={faGraduationCap} />
                                            <span>{scholarship.level}</span>
                                        </div>
                                        <div className="stat">
                                            <FontAwesomeIcon icon={faMoneyBillWave} />
                                            <span>{scholarship.amount}</span>
                                        </div>
                                        <div className="stat">
                                            <FontAwesomeIcon icon={faClock} />
                                            <span>{scholarship.duration}</span>
                                        </div>
                                    </div>

                                    <div className="rating">
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <FontAwesomeIcon
                                                    key={i}
                                                    icon={
                                                        i < Math.floor(scholarship.rating)
                                                            ? faStar
                                                            : i < scholarship.rating
                                                              ? faStarHalfAlt
                                                              : faStar
                                                    }
                                                    className="star"
                                                />
                                            ))}
                                            <span className="rating-value">
                                                {scholarship.rating}
                                            </span>
                                        </div>
                                        <span className="applications">
                                            <FontAwesomeIcon icon={faUsers} />
                                            {scholarship.applications} candidatures
                                        </span>
                                    </div>

                                    <p className="description">{scholarship.description}</p>

                                    <div className="fields-preview">
                                        {scholarship.fields.slice(0, 3).map((field, i) => (
                                            <span key={i} className="field-preview-tag">
                                                {field}
                                            </span>
                                        ))}
                                        {scholarship.fields.length > 3 && (
                                            <span className="field-preview-tag more">
                                                +{scholarship.fields.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <div className="deadline">
                                        <div
                                            className={`deadline-badge ${getDaysLeft(scholarship.deadline) <= 30 ? 'urgent' : ''}`}
                                        >
                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                            <span>
                                                Date limite: {formatDate(scholarship.deadline)}
                                            </span>
                                        </div>
                                        <div className="days-left">
                                            <span
                                                className={`days ${getDaysLeft(scholarship.deadline) <= 30 ? 'urgent' : ''}`}
                                            >
                                                {getDaysLeft(scholarship.deadline)} jours restants
                                            </span>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <button
                                            className="details-btn"
                                            onClick={() =>
                                                setExpandedCard(
                                                    expandedCard === scholarship.id
                                                        ? null
                                                        : scholarship.id,
                                                )
                                            }
                                        >
                                            {expandedCard === scholarship.id
                                                ? 'Voir moins'
                                                : 'Voir les détails'}
                                            <FontAwesomeIcon
                                                icon={
                                                    expandedCard === scholarship.id
                                                        ? faChevronUp
                                                        : faChevronDown
                                                }
                                            />
                                        </button>
                                        <button className="apply-btn">
                                            Postuler
                                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                                        </button>
                                    </div>
                                </div>

                                {expandedCard === scholarship.id && (
                                    <div className="card-expanded slide-down">
                                        <div className="expanded-section">
                                            <h4>
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                                Couverture de la bourse
                                            </h4>
                                            <ul>
                                                {scholarship.coverage.map((item, i) => (
                                                    <li key={i}>
                                                        <FontAwesomeIcon
                                                            icon={faCheckCircle}
                                                            className="check-icon"
                                                        />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="expanded-section">
                                            <h4>
                                                <FontAwesomeIcon icon={faFileAlt} />
                                                Conditions d'éligibilité
                                            </h4>
                                            <ul>
                                                {scholarship.requirements.map((req, i) => (
                                                    <li key={i}>
                                                        <FontAwesomeIcon
                                                            icon={faCheckCircle}
                                                            className="check-icon"
                                                        />
                                                        {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="expanded-section">
                                            <h4>
                                                <FontAwesomeIcon icon={faLanguage} />
                                                Langues requises
                                            </h4>
                                            <div className="languages">
                                                {scholarship.languages.map((lang, i) => (
                                                    <span key={i} className="language-tag">
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="expanded-section">
                                            <h4>
                                                <FontAwesomeIcon icon={faUniversity} />
                                                Domaines d'études
                                            </h4>
                                            <div className="fields">
                                                {scholarship.fields.map((field, i) => (
                                                    <span key={i} className="field-tag">
                                                        {field}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="expanded-actions">
                                            <button className="btn-primary">
                                                <FontAwesomeIcon icon={faFileAlt} />
                                                Site officiel
                                            </button>
                                            <button className="btn-secondary">
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                Guide de candidature
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredScholarships.length === 0 && (
                        <div className="no-results">
                            <FontAwesomeIcon icon={faSearch} />
                            <h3>Aucune bourse trouvée</h3>
                            <p>Essayez de modifier vos critères de recherche</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Benin Special Section */}
            <div className="benin-special-section">
                <div className="container">
                    <div className="benin-special-content">
                        <div className="benin-flag">
                            <span className="flag-stripe green"></span>
                            <span className="flag-stripe yellow"></span>
                            <span className="flag-stripe red"></span>
                        </div>
                        <h2>Opportunités spéciales pour les étudiants béninois</h2>
                        <p>
                            Le Bénin a développé des partenariats stratégiques avec plusieurs pays
                            pour offrir des bourses d'excellence à ses étudiants. Profitez de ces
                            opportunités uniques pour étudier à l'étranger dans des conditions
                            optimales.
                        </p>
                        <div className="benin-stats">
                            <div className="benin-stat">
                                <span className="stat-number">15+</span>
                                <span className="stat-label">Pays partenaires</span>
                            </div>
                            <div className="benin-stat">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Bourses/an</span>
                            </div>
                            <div className="benin-stat">
                                <span className="stat-number">50+</span>
                                <span className="stat-label">Domaine artistiques</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tips Section */}
            <div className="tips-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Conseils pour réussir votre candidature</h2>
                        <p>Maximisez vos chances d'obtenir une bourse</p>
                    </div>
                    <div className="tips-grid">
                        {tips.map((tip, index) => (
                            <div key={index} className="tip-card">
                                <div className="tip-icon">
                                    <FontAwesomeIcon icon={tip.icon} />
                                </div>
                                <h3>{tip.title}</h3>
                                <p>{tip.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Prêt à commencer votre voyage académique ?</h2>
                        <p>
                            Inscrivez-vous pour recevoir les dernières opportunités de bourses
                            directement dans votre boîte mail
                        </p>
                        <div className="cta-form">
                            <input type="email" placeholder="Votre adresse email" />
                            <button>S'abonner aux alertes</button>
                        </div>
                        <div className="cta-note">
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <span>Recevez des alertes personnalisées selon votre profil</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button className="fab" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <FontAwesomeIcon icon={faChevronUp} />
            </button>
        </div>
    );
};

export default Scholarships;
