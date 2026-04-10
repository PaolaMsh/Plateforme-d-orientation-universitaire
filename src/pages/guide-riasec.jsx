import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faChartLine,
  faBriefcase,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/guide-riasec.css";

const GuideRIASEC = () => {
  const types = [
    { 
      code: "R", 
      name: "Réaliste", 
      color: "#FF6B6B",
      traits: "Pratique, manuel, concret, aime les outils, les machines, le travail en extérieur.",
      metiers: "Mécanicien, électricien, agriculteur, ingénieur civil, architecte, technicien.",
      filieres: "Génie civil, mécanique, agriculture, BTP, maintenance industrielle."
    },
    { 
      code: "I", 
      name: "Investigateur", 
      color: "#4ECDC4",
      traits: "Curieux, analytique, scientifique, aime résoudre des problèmes, observer, chercher.",
      metiers: "Chercheur, médecin, biologiste, data scientist, informaticien, pharmacien.",
      filieres: "Médecine, biologie, informatique, mathématiques, physique-chimie."
    },
    { 
      code: "A", 
      name: "Artistique", 
      color: "#FFE66D",
      traits: "Créatif, expressif, intuitif, aime l'art, la musique, l'écriture, le design.",
      metiers: "Designer graphique, musicien, écrivain, architecte d'intérieur, photographe.",
      filieres: "Arts plastiques, design, communication, cinéma, théâtre."
    },
    { 
      code: "S", 
      name: "Social", 
      color: "#A8E6CF",
      traits: "Aidant, empathique, généreux, aime enseigner, soigner, conseiller.",
      metiers: "Enseignant, infirmier, psychologue, assistant social, éducateur.",
      filieres: "Sciences de l'éducation, psychologie, travail social, soins infirmiers."
    },
    { 
      code: "E", 
      name: "Entreprenant", 
      color: "#FFB347",
      traits: "Persuasif, ambitieux, dynamique, aime diriger, vendre, influencer.",
      metiers: "Chef d'entreprise, manager, commercial, avocat, politicien.",
      filieres: "Commerce, marketing, gestion, droit, entrepreneuriat."
    },
    { 
      code: "C", 
      name: "Conventionnel", 
      color: "#A2B9E2",
      traits: "Organisé, méthodique, précis, aime les données, l'ordre, les tâches administratives.",
      metiers: "Comptable, secrétaire, archiviste, contrôleur de gestion, analyste financier.",
      filieres: "Comptabilité, gestion administrative, finance, bureautique."
    }
  ];

  return (
    <div className="guide-riasec">
      <div className="guide-header">
        <Link to="/support" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} /> Retour au support
        </Link>
        <h1>Guide complet du modèle RIASEC</h1>
        <p>Comprendre votre personnalité pour mieux choisir votre avenir professionnel</p>
      </div>

      <div className="guide-container">
        <section className="intro-section">
          <h2>Qu'est-ce que le RIASEC ?</h2>
          <p>
            Le RIASEC est un modèle développé par le psychologue américain John Holland. Il classe les personnalités 
            en <strong>6 grands types</strong> : Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel.
            Chaque personne possède une combinaison unique de ces types, avec un code à 3 lettres (ex: SAE) qui représente 
            ses trois dominantes.
          </p>
          <p>
            Ce modèle est utilisé dans le monde entier pour l'orientation scolaire et professionnelle. Il permet de 
            <strong>mettre en correspondance votre personnalité avec des métiers et des formations</strong> adaptés.
          </p>
        </section>

        <section className="types-section">
          <h2>Les 6 types RIASEC en détail</h2>
          <div className="types-grid">
            {types.map((type) => (
              <div key={type.code} className="type-card" style={{ borderTopColor: type.color }}>
                <h3 style={{ color: type.color }}>{type.code} - {type.name}</h3>
                <p><strong>Caractéristiques :</strong> {type.traits}</p>
                <p><strong>Métiers typiques :</strong> {type.metiers}</p>
                <p><strong>Filières associées :</strong> {type.filieres}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="how-to-use">
          <h2>Comment utiliser votre profil RIASEC ?</h2>
          <div className="steps-guide">
            <div className="step-guide">
              <div className="step-icon">1</div>
              <div>
                <h3>Passez le test sur Orientation-bj</h3>
                <p>Répondez aux questions adaptatives pour obtenir votre code à 3 lettres (ex: SAI, REC...).</p>
              </div>
            </div>
            <div className="step-guide">
              <div className="step-icon">2</div>
              <div>
                <h3>Identifiez vos types dominants</h3>
                <p>Les deux premières lettres sont les plus importantes. Exemple : SAE = Social, Artistique, Entreprenant.</p>
              </div>
            </div>
            <div className="step-guide">
              <div className="step-icon">3</div>
              <div>
                <h3>Explorez les métiers correspondants</h3>
                <p>Consultez notre moteur de recommandation pour voir la liste des métiers, filières et écoles adaptés.</p>
              </div>
            </div>
            <div className="step-guide">
              <div className="step-icon">4</div>
              <div>
                <h3>Affinez avec les filtres locaux</h3>
                <p>Ajoutez vos contraintes : budget, localisation, type d'établissement (public/privé).</p>
              </div>
            </div>
          </div>
        </section>

        <section className="examples">
          <h2>Exemples de codes RIASEC</h2>
          <div className="examples-grid">
            <div className="example-card"><strong>SAE</strong> (Social, Artistique, Entreprenant) → Communication, marketing, événementiel.</div>
            <div className="example-card"><strong>IRC</strong> (Investigateur, Réaliste, Conventionnel) → Ingénierie, informatique, recherche.</div>
            <div className="example-card"><strong>SEC</strong> (Social, Entreprenant, Conventionnel) → Gestion des ressources humaines, enseignement, conseil.</div>
            <div className="example-card"><strong>RAI</strong> (Réaliste, Artistique, Investigateur) → Architecture, design produit, urbanisme.</div>
          </div>
        </section>

        <section className="advice">
          <h2>Conseils pour bien utiliser votre profil</h2>
          <ul>
            <li><FontAwesomeIcon icon={faCheckCircle} /> Ne vous limitez pas aux métiers « typiques » : la plupart des métiers combinent plusieurs types.</li>
            <li><FontAwesomeIcon icon={faCheckCircle} /> Votre profil peut évoluer avec le temps et les expériences. Refaites le test chaque année.</li>
            <li><FontAwesomeIcon icon={faCheckCircle} /> Utilisez les recommandations comme point de départ, puis explorez par vous-même.</li>
            <li><FontAwesomeIcon icon={faCheckCircle} /> Discutez avec des professionnels des métiers qui vous intéressent.</li>
          </ul>
        </section>

        <div className="guide-cta">
          <Link to="/tests-orientations" className="btn-test">
            <FontAwesomeIcon icon={faChartLine} /> Passer le test maintenant
          </Link>
          <Link to="/support" className="btn-back">Retour au centre d'aide</Link>
        </div>
      </div>
    </div>
  );
};

export default GuideRIASEC;