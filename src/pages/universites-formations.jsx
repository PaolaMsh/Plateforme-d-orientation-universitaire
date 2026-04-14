import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMapMarkerAlt,
  faGraduationCap,
  faUsers,
  faUniversity,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/universites-formations.css";
import { universityService } from "../services/universityService";

const UniversitiesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les universités depuis l'API
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const data = await universityService.getAllUniversities();
        setUniversities(data);
        setFilteredUniversities(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError("Impossible de charger les universités");
        
        // Données par défaut en cas d'erreur
        const defaultUniversities = [
          {
            id: 1,
            name: "Université d'Abomey-Calavi (UAC)",
            location: "Abomey-Calavi, Bénin",
            students: 80000,
            formations: ["Informatique", "Droit", "Médecine", "Économie", "Génie civil"],
            description: "La plus grande université publique du Bénin",
            image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=250&fit=crop",
            website: "https://www.uac.bj",
          },
          {
            id: 2,
            name: "Université de Parakou (UP)",
            location: "Parakou, Bénin",
            students: 35000,
            formations: ["Agronomie", "Médecine vétérinaire", "Droit", "Gestion"],
            description: "Deuxième grande université publique",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop",
            website: "https://www.up.bj",
          },
          {
            id: 3,
            name: "ESGIS - École Supérieure de Gestion d'Informatique et des Sciences",
            location: "Cotonou, Bénin",
            students: 4000,
            formations: ["Informatique de gestion", "Réseaux", "Marketing", "Finance"],
            description: "École privée de référence dans les métiers du numérique",
            image: "/ESGIS.jpeg",
            website: "https://www.esgis.bj/",
          }
        ];
        setUniversities(defaultUniversities);
        setFilteredUniversities(defaultUniversities);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Filtrer les universités
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (term === "") {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter(
        (uni) =>
          uni.name.toLowerCase().includes(term) ||
          uni.location.toLowerCase().includes(term) ||
          uni.formations?.some((f) => f.toLowerCase().includes(term))
      );
      setFilteredUniversities(filtered);
    }
    setShowAll(false);
  }, [searchTerm, universities]);

  const visibleCount = showAll ? filteredUniversities.length : 15;
  const visibleUniversities = filteredUniversities.slice(0, visibleCount);
  const hasMore = filteredUniversities.length > 15 && !showAll;

  if (loading) {
    return (
      <div className="universities-page">
        <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
          <div className="loader">Chargement des universités...</div>
        </div>
      </div>
    );
  }

  if (error && universities.length === 0) {
    return (
      <div className="universities-page">
        <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
          <div className="error-message">{error}</div>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="universities-page">
      <div className="container">
        <div className="search-header">
          <h1>Métiers et formations au Bénin</h1>
          <p>Découvrez plus de {universities.length} établissements d'enseignement supérieur</p>
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
                  <span>{uni.students?.toLocaleString()} étudiants</span>
                </div>
                <div className="uni-formations">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <span>
                    {uni.formations?.slice(0, 3).join(", ")}
                    {uni.formations?.length > 3 && "..."}
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