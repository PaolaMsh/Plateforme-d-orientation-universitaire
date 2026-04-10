import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMapMarkerAlt,
  faGraduationCap,
  faUsers,
  faChevronDown,
  faChevronUp,
  faUniversity,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/universites-formations.css";

const allUniversities = [
  {
    id: 1,
    name: "Université d'Abomey-Calavi (UAC)",
    location: "Abomey-Calavi, Bénin",
    students: 80000,
    formations: ["Informatique", "Droit", "Médecine", "Économie", "Génie civil"],
    description: "La plus grande université publique du Bénin, offrant une large gamme de formations.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=250&fit=crop",
    website: "https://www.uac.bj",
  },
  {
    id: 2,
    name: "Université de Parakou (UP)",
    location: "Parakou, Bénin",
    students: 35000,
    formations: ["Agronomie", "Médecine vétérinaire", "Droit", "Gestion"],
    description: "Deuxième grande université publique, réputée pour les sciences agronomiques.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    name: "ESGIS - École Supérieure de Gestion d'Informatique et des Sciences",
    location: "Cotonou, Bénin",
    students: 4000,
    formations: ["Informatique de gestion", "Réseaux", "Marketing", "Finance"],
    description: "École privée de référence dans les métiers du numérique et de la gestion.",
    image: "/ESGIS.jpeg",
    website: "https://www.esgis.bj/",
  },
  {
    id: 4,
    name: "Faculté des Sciences de la Santé (FSS)",
    location: "Cotonou, Bénin",
    students: 6000,
    formations: ["Médecine générale", "Pharmacie", "Odontostomatologie"],
    description: "Formation des professionnels de santé du Bénin.",
    image: "/FSS.jpg",
    website: "https://www.fss.bj",
  },
  {
    id: 5,
    name: "Haute École de Commerce et de Management (HECM)",
    location: "Cotonou, Bénin",
    students: 1500,
    formations: ["Commerce international", "Marketing digital", "RH"],
    description: "École spécialisée en commerce et management.",
    image: "/HECM.jpg",
    website: "https://www.hecm.bj",

  },
  {
    id: 6,
    name: "Institut National des Métiers d'Art (INMA)",
    location: "Porto-Novo, Bénin",
    students: 800,
    formations: ["Design", "Arts plastiques", "Patrimoine culturel"],
    description: "Unique institut dédié aux métiers d'art et à la création.",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=250&fit=crop",
    website: "https://www.inma.bj",
  },
  {
    id: 7,
    name: "Université Nationale d'Agriculture (UNA)",
    location: "Kétou, Bénin",
    students: 3000,
    formations: ["Agroéconomie", "Production végétale", "Élevage"],
    description: "Pôle d'excellence pour les formations agricoles.",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f972?w=400&h=250&fit=crop",
    website: "https://www.una.bj",
  },
  {
    id: 8,
    name: "Institut de Formation et de Recherche en Informatique (IFRI)",
    location: "Abomey-Calavi, Bénin",
    students: 1200,
    formations: ["Génie logiciel", "Intelligence artificielle", "Cybersécurité"],
    description: "Spécialiste des nouvelles technologies.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
    website: "https://www.ifri.bj",
  },
  {
    id: 9,
    name: "École Polytechnique d'Abomey-Calavi (EPAC)",
    location: "Abomey-Calavi, Bénin",
    students: 2500,
    formations: ["Génie électrique", "Génie mécanique", "Génie civil"],
    description: "Formation d'ingénieurs de haut niveau.",
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=250&fit=crop",
    website: "https://www.epac.bj",
  },
  {
    id: 10,
    name: "Université des Sciences et Technologies du Bénin (USTB)",
    location: "Cotonou, Bénin",
    students: 1800,
    formations: ["Biotechnologies", "Mathématiques appliquées", "Physique"],
    description: "Université privée à vocation scientifique.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop",
    website: "https://www.ustb.bj",
  },
  {
    id: 11,
    name: "Institut Supérieur de Formation Sociale (ISFS)",
    location: "Porto-Novo, Bénin",
    students: 900,
    formations: ["Travail social", "Psychologie", "Sociologie"],
    description: "Référence dans les métiers du social.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=250&fit=crop",
    website: "https://www.isfs.bj",
  },
  {
    id: 12,
    name: "École de Journalisme et de Communication (EJC)",
    location: "Cotonou, Bénin",
    students: 600,
    formations: ["Journalisme", "Communication digitale", "Relations publiques"],
    description: "Formation aux métiers des médias.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop",
    website: "https://www.ejc.bj",
  },
  {
    id: 13,
    name: "Institut de Droit et d'Économie (IDE)",
    location: "Cotonou, Bénin",
    students: 1100,
    formations: ["Droit des affaires", "Économie bancaire", "Fiscalité"],
    description: "Spécialiste des carrières juridiques et financières.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop",
    website: "https://www.ide.bj",  
  },
  {
    id: 14,
    name: "Université Protestante du Bénin (UPROB)",
    location: "Abomey-Calavi, Bénin",
    students: 2000,
    formations: ["Théologie", "Droit", "Gestion de projet"],
    description: "Établissement d'enseignement supérieur privé d'inspiration protestante.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=250&fit=crop",
    website: "https://www.uprob.bj",
  },
  {
    id: 15,
    name: "Institut Panafricain de Développement (IPD)",
    location: "Cotonou, Bénin",
    students: 750,
    formations: ["Développement durable", "Leadership", "Entrepreneuriat"],
    description: "Formation axée sur les défis du continent africain.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop",
    website: "https://www.ipd.bj",
  },
  {
    id: 16,
    name: "École Supérieure d'Administration et de Gestion (ESAG)",
    location: "Parakou, Bénin",
    students: 850,
    formations: ["Administration publique", "Logistique", "Comptabilité"],
    description: "Filières administratives et managériales.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    website: "https://www.esag.bj",
  },
  {
    id: 17,
    name: "Institut de Formation aux Métiers de la Mer (IFMM)",
    location: "Cotonou, Bénin",
    students: 400,
    formations: ["Navigation", "Logistique portuaire", "Pêche industrielle"],
    description: "Unique institut dédié aux métiers maritimes.",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=250&fit=crop",
    website: "https://www.ifmm.bj",
  },
  {
    id: 18,
    name: "Université Internationale de Cotonou (UIC)",
    location: "Cotonou, Bénin",
    students: 1200,
    formations: ["Informatique", "Commerce", "Tourisme"],
    description: "Université privée aux programmes internationaux.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=250&fit=crop",
    website: "https://www.uic.bj",
  },
  {
    id: 19,
    name: "Institut de Génie Rural (IGR)",
    location: "Kétou, Bénin",
    students: 550,
    formations: ["Génie rural", "Hydraulique agricole", "Aménagement"],
    description: "Spécialiste des infrastructures rurales.",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f972?w=400&h=250&fit=crop",
    website: "https://www.igr.bj",
  },
  {
    id: 20,
    name: "École Nationale d'Administration et de Magistrature (ENAM)",
    location: "Porto-Novo, Bénin",
    students: 500,
    formations: ["Administration publique", "Magistrature", "Douanes"],
    description: "Formation des cadres de la fonction publique et de la justice.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop",
    website: "https://www.enam.bj",

  },
  {
    id: 21,
    name: "Institut Supérieur de Management (ISM)",
    location: "Cotonou, Bénin",
    students: 950,
    formations: ["Management", "RH", "Marketing"],
    description: "École privée de management.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop",
    website: "https://www.ism.bj",

  },
  {
    id: 22,
    name: "Université Virtuelle du Bénin (UVB)",
    location: "Cotonou (en ligne), Bénin",
    students: 3000,
    formations: ["E-learning", "Digital Learning", "TICE"],
    description: "Première université entièrement en ligne du Bénin.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
    website: "https://www.uvb.bj",  
  },
  {
    id: 23,
    name: "Institut des Sciences Biomédicales (ISB)",
    location: "Cotonou, Bénin",
    students: 700,
    formations: ["Biologie médicale", "Analyses biomédicales"],
    description: "Formation aux métiers de laboratoire.",
    image: "https://images.unsplash.com/photo-1576081149789-d3c1b1f6e2df?w=400&h=250&fit=crop",
    website: "https://www.isb.bj",

  },
  {
    id: 24,
    name: "École de Commerce de Parakou (ECP)",
    location: "Parakou, Bénin",
    students: 620,
    formations: ["Commerce", "Négociation", "Vente"],
    description: "Spécialiste des métiers commerciaux.",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=250&fit=crop",
    website: "https://www.ecp.bj",

  },
  {
    id: 25,
    name: "Institut Universitaire de Technologie (IUT - Lokossa)",
    location: "Lokossa, Bénin",
    students: 1100,
    formations: ["Maintenance industrielle", "Génie électrique", "Informatique"],
    description: "Formation technologique courte.",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=250&fit=crop",
    website: "https://www.iutloko.bj",

  },
];

const UniversitiesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUniversities, setFilteredUniversities] = useState(allUniversities);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (term === "") {
      setFilteredUniversities(allUniversities);
    } else {
      const filtered = allUniversities.filter(
        (uni) =>
          uni.name.toLowerCase().includes(term) ||
          uni.location.toLowerCase().includes(term) ||
          uni.formations.some((f) => f.toLowerCase().includes(term))
      );
      setFilteredUniversities(filtered);
    }
    setShowAll(false);
  }, [searchTerm]);

  const visibleCount = showAll ? filteredUniversities.length : 15;
  const visibleUniversities = filteredUniversities.slice(0, visibleCount);
  const hasMore = filteredUniversities.length > 15 && !showAll;

  return (
    <div className="universities-page">
      <div className="container">
        <div className="search-header">
          <h1>Métiers et formations au Bénin</h1>
          <p>Découvrez plus de 25 établissements d'enseignement supérieur</p>
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom, localisation ou filière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="results-count">
            {filteredUniversities.length} résultat{filteredUniversities.length > 1 ? "s" : ""} trouvé{filteredUniversities.length > 1 ? "s" : ""}
          </div>
        </div>

        <div className="universities-grid">
          {visibleUniversities.map((uni) => (
            <div key={uni.id} className="uni-card">
              <div className="uni-image">
                <img src={uni.image} alt={uni.name} />
              </div>
              <div className="uni-content">
                <h3>{uni.name}</h3>
                <div className="uni-location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{uni.location}</span>
                </div>
                <div className="uni-students">
                  <FontAwesomeIcon icon={faUsers} />
                  <span>{uni.students.toLocaleString()} étudiants</span>
                </div>
                <div className="uni-formations">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <span>
                    {uni.formations.slice(0, 3).join(", ")}
                    {uni.formations.length > 3 && "..."}
                  </span>
                </div>

                <a
                  href={uni.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more-link"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} /> Lire plus
                </a>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="see-more-container">
            <button className="see-more-btn" onClick={() => setShowAll(true)}>
              Voir plus ({filteredUniversities.length - 15} universités supplémentaires)
            </button>
          </div>
        )}

        {filteredUniversities.length === 0 && (
          <div className="no-results">
            <FontAwesomeIcon icon={faUniversity} />
            <p>Aucune université ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversitiesPage;