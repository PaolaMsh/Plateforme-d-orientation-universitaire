import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/orientations.css";

const schoolsDatabase = [
  {
    name: "Université d'Abomey-Calavi (UAC)",
    location: "Abomey-Calavi",
    region: "Sud",
    annualCost: 150000,
    domains: ["Informatique", "Gestion", "Droit", "Sciences"],
  },
  {
    name: "EPAC (École Polytechnique d'Abomey-Calavi)",
    location: "Abomey-Calavi",
    region: "Sud",
    annualCost: 250000,
    domains: ["Ingénierie", "Informatique", "Génie civil"],
  },
  {
    name: "Université de Parakou",
    location: "Parakou",
    region: "Nord",
    annualCost: 120000,
    domains: ["Agronomie", "Santé", "Lettres"],
  },
  {
    name: "Institut Supérieur de Management (ISM)",
    location: "Cotonou",
    region: "Sud",
    annualCost: 600000,
    domains: ["Commerce", "Marketing", "Finance"],
  },
  {
    name: "ENAM (École Nationale d'Administration et de Magistrature)",
    location: "Cotonou",
    region: "Sud",
    annualCost: 180000,
    domains: ["Administration", "Droit", "Sciences politiques"],
  },
  {
    name: "ESTC (École Supérieure de Technologie et de Construction)",
    location: "Cotonou",
    region: "Sud",
    annualCost: 350000,
    domains: ["BTP", "Génie électrique", "Maintenance"],
  },
  {
    name: "Université Nationale des Sciences (UNSTIM)",
    location: "Abomey",
    region: "Sud",
    annualCost: 200000,
    domains: ["Sciences de l'ingénieur", "Mathématiques", "Physique"],
  },
  {
    name: "IRGIB Africa",
    location: "Cotonou",
    region: "Sud",
    annualCost: 800000,
    domains: ["Informatique", "Réseaux", "Télécoms"],
  },
  {
    name: "Université de Kara",
    location: "Kara",
    region: "Nord",
    annualCost: 100000,
    domains: ["Lettres", "Sciences sociales"],
  },
];

const domainMapping = {
  R: ["Génie civil", "Mécanique", "Agriculture", "Électricité"],
  I: ["Informatique", "Biologie", "Mathématiques", "Physique-Chimie"],
  A: ["Design graphique", "Arts plastiques", "Communication", "Architecture"],
  S: ["Psychologie", "Sciences de l'éducation", "Travail social", "Médecine"],
  E: ["Commerce", "Marketing", "Gestion d'entreprise", "Économie"],
  C: [
    "Comptabilité",
    "Gestion administrative",
    "Informatique de gestion",
    "Secrétariat",
  ],
};

const personalityDescriptions = {
  R: "Vous êtes une personne pragmatique, concrète, qui aime travailler avec ses mains et résoudre des problèmes techniques. Vous êtes souvent indépendant et préférez les activités physiques ou en extérieur.",
  I: "Vous êtes curieux, analytique et méthodique. Vous aimez la recherche, l'exploration de nouvelles idées et la résolution de problèmes complexes. Vous appréciez le travail en laboratoire ou la réflexion théorique.",
  A: "Vous êtes créatif, imaginatif et expressif. Vous avez besoin de liberté pour créer et vous exprimer. Les activités artistiques (écriture, dessin, musique, design) sont vos points forts.",
  S: "Vous êtes empathique, patient et à l'écoute. Vous aimez aider, conseiller, enseigner ou soigner les autres. Les métiers du social, de l'éducation ou de la santé vous correspondent.",
  E: "Vous êtes ambitieux, charismatique et persuasif. Vous aimez prendre des risques, diriger, convaincre et atteindre des objectifs. Les métiers de la vente, du management ou de l'entrepreneuriat sont faits pour vous.",
  C: "Vous êtes organisé, minutieux et fiable. Vous préférez les tâches structurées, les procédures claires et les environnements stables. La comptabilité, l'administration ou l'informatique de gestion vous attirent.",
};

const aptitudeDescriptions = {
  R: "Habileté manuelle, coordination, résolution de problèmes techniques.",
  I: "Raisonnement logique, analyse de données, curiosité scientifique.",
  A: "Créativité, expression artistique, sens esthétique.",
  S: "Empathie, communication, pédagogie, écoute active.",
  E: "Leadership, persuasion, prise de décision, gestion de projet.",
  C: "Organisation, rigueur, gestion des chiffres, respect des procédures.",
};

const competenceDescriptions = {
  R: "Utilisation d'outils, montage/démontage, maintenance, travail en extérieur.",
  I: "Recherche documentaire, expérimentation, programmation, analyse statistique.",
  A: "Dessin, écriture, composition musicale, conception graphique.",
  S: "Conseil, enseignement, médiation, soins de base.",
  E: "Négociation, vente, planification stratégique, gestion d'équipe.",
  C: "Saisie de données, tenue de comptes, archivage, utilisation de logiciels bureautiques.",
};

const Orientation = () => {
  const location = useLocation();
  const { scores, userInfo } = location.state || {
    scores: null,
    userInfo: { location: "", budget: 0 },
  };
  const [filteredSchools, setFilteredSchools] = useState([]);

  const getDominantTypes = (scoresObj) => {
    return Object.entries(scoresObj)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0]);
  };

  const dominantTypes = scores ? getDominantTypes(scores) : [];
  const primaryType = dominantTypes[0] || "S";
  const secondaryType = dominantTypes[1] || "I";

  const getRecommendedDomains = () => {
    const primaryDomains = domainMapping[primaryType] || domainMapping.S;
    const secondaryDomains = domainMapping[secondaryType] || domainMapping.I;
    const combined = [
      ...primaryDomains.slice(0, 2),
      ...secondaryDomains.slice(0, 2),
    ];
    return combined.slice(0, 4);
  };

  const recommendedDomains = getRecommendedDomains();

  useEffect(() => {
    if (!userInfo.location || !scores) return;
    const userLocationLower = userInfo.location.toLowerCase();
    const userBudget = Number(userInfo.budget);
    const filtered = schoolsDatabase.filter((school) => {
      const matchesLocation =
        school.location.toLowerCase().includes(userLocationLower) ||
        school.region.toLowerCase().includes(userLocationLower) ||
        userLocationLower.includes(school.location.toLowerCase());
      const matchesBudget = school.annualCost <= userBudget;
      return matchesLocation && matchesBudget;
    });
    setFilteredSchools(filtered);
  }, [userInfo, scores]);

  if (!scores) {
    return (
      <div className="orientation-container">
        Aucun résultat trouvé. Veuillez d'abord passer le test.
      </div>
    );
  }

  return (
    <div className="orientation-wrapper">
      <h1 className="orientation-title">Vos résultats d'orientation</h1>

      <div className="scores-section">
        <h2>Profils RIASEC</h2>
        <div className="scores-bars">
          {Object.entries(scores).map(([type, value]) => (
            <div key={type} className="score-bar-item">
              <span className="score-label">
                {type === "R"
                  ? "Réaliste"
                  : type === "I"
                    ? "Investigateur"
                    : type === "A"
                      ? "Artistique"
                      : type === "S"
                        ? "Social"
                        : type === "E"
                          ? "Entreprenant"
                          : "Conventionnel"}
              </span>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{
                    width: `${value}%`,
                    backgroundColor: `hsl(${value * 1.2}, 70%, 50%)`,
                  }}
                ></div>
                <span className="bar-value">{value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dominant-type">
        <h2>
          Votre profil dominant :{" "}
          <span>
            {primaryType === "R"
              ? "Réaliste"
              : primaryType === "I"
                ? "Investigateur"
                : primaryType === "A"
                  ? "Artistique"
                  : primaryType === "S"
                    ? "Social"
                    : primaryType === "E"
                      ? "Entreprenant"
                      : "Conventionnel"}
          </span>
        </h2>
      </div>

      <div className="analysis-grid">
        <div className="analysis-card">
          <h3>🎭 Personnalité</h3>
          <p>{personalityDescriptions[primaryType]}</p>
        </div>
        <div className="analysis-card">
          <h3>⚙️ Aptitudes</h3>
          <p>{aptitudeDescriptions[primaryType]}</p>
        </div>
        <div className="analysis-card">
          <h3>📚 Compétences clés</h3>
          <p>{competenceDescriptions[primaryType]}</p>
        </div>
      </div>

      <div className="domains-section">
        <h2>🎓 Domaines d'études recommandés</h2>
        <div className="domains-list">
          {recommendedDomains.map((domain, idx) => (
            <div key={idx} className="domain-item">
              <span className="domain-rank">{idx + 1}</span>
              <span className="domain-name">{domain}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="schools-section">
        <h2>
          🏫 Établissements correspondants (localisation : {userInfo.location},
          budget max : {userInfo.budget} FCFA)
        </h2>
        {filteredSchools.length === 0 ? (
          <p>
            Aucune école trouvée dans votre région avec ce budget. Élargissez
            vos critères ou consultez notre conseiller.
          </p>
        ) : (
          <div className="schools-list">
            {filteredSchools.map((school, idx) => (
              <div key={idx} className="school-card">
                <h3>{school.name}</h3>
                <p>
                  <strong>📍 Localisation :</strong> {school.location}
                </p>
                <p>
                  <strong>💰 Coût annuel :</strong>{" "}
                  {school.annualCost.toLocaleString()} FCFA
                </p>
                <p>
                  <strong>📖 Domaines :</strong> {school.domains.join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button onClick={() => window.print()} className="print-btn">
          🖨️ Exporter en PDF
        </button>
        <button onClick={() => window.history.back()} className="retest-btn">
          🔁 Refaire le test
        </button>
      </div>
    </div>
  );
};

export default Orientation;
