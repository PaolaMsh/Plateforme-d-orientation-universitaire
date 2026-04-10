import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faLightbulb,
  faChartLine,
  faRobot,
  faMapMarkedAlt,
  faUserGraduate,
  faFileAlt,
  faEnvelope,
  faPhone,
  faChevronDown,
  faChevronUp,
  faCheckCircle,
  faHeadset,
  faComments,
  faTimes,
  faQuoteLeft,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/support.css";

const Support = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { from: "bot", text: "Bonjour ! Je suis le conseiller virtuel d'Orientation-bj. Posez-moi vos questions sur l'orientation, les métiers ou les formations." }
  ]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const userMsg = { from: "user", text: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setTimeout(() => {
      let botReply = "Merci pour votre message. Un conseiller vous répondra bientôt. En attendant, n'hésitez pas à consulter notre FAQ ou à passer le test d'orientation.";
      if (chatMessage.toLowerCase().includes("test")) {
        botReply = "Le test d'orientation se compose de deux phases : 15 questions de base puis des questions adaptatives. Il dure environ 15-20 minutes. Voulez-vous le commencer ?";
      } else if (chatMessage.toLowerCase().includes("riasec")) {
        botReply = "Le modèle RIASEC classe les personnalités en 6 types : Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel. Chaque utilisateur reçoit un code à 3 lettres (ex: SAE).";
      }
      setChatHistory(prev => [...prev, { from: "bot", text: botReply }]);
    }, 500);
    setChatMessage("");
  };

  const faqs = [
    {
      question: "Qu'est-ce que le test RIASEC ?",
      answer: "Le test RIASEC est un outil psychométrique qui évalue vos intérêts professionnels selon 6 types : Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel. Il permet d'identifier les métiers et formations les plus adaptés à votre personnalité."
    },
    {
      question: "Comment se déroule le test d'orientation ?",
      answer: "Le test comporte deux phases : un questionnaire de base de 15 questions, puis un test adaptatif où les questions s'ajustent à vos réponses. Le test s'arrête automatiquement lorsque le profil est suffisamment fiable (généralement 15-20 minutes)."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Oui, toutes vos données sont cryptées (bcrypt pour les mots de passe, HTTPS pour les échanges). Nous respectons le RGPD et vous pouvez supprimer votre compte à tout moment."
    },
    {
      question: "Puis-je refaire le test plus tard ?",
      answer: "Oui, votre espace personnel conserve l'historique de vos tests. Vous pouvez refaire le test pour suivre l'évolution de vos intérêts, idéalement une fois par an."
    },
        
      {
      question: "Que faire si je n'arrive pas à me connecter ?",
      answer: "Vérifiez vos identifiants, utilisez la fonction 'Mot de passe oublié'. Si le problème persiste, contactez-nous à support@orientation-bj.bj."
    }
  ];

 
  return (
    <div className="support-page">
      <section className="support-hero">
        <div className="support-hero-content">
          <h1>Centre d'aide & support</h1>
          <p>Tout ce que vous devez savoir pour réussir votre orientation avec Orientation-bj</p>
          <div className="support-hero-buttons">
            <Link to="/tests-orientations" className="btn-primary">Commencer le test</Link>
            <Link to="/contact" className="btn-secondary">Contacter l'équipe</Link>
          </div>
        </div>
      </section>

      <section className="presentation-section">
        <div className="container">
          <h2>Qu'est-ce que Orientation-bj ?</h2>
          <div className="presentation-description">
            <p className="presentation-intro">
              <strong>Orientation-bj</strong> est une plateforme béninoise innovante qui aide les élèves et étudiants 
              à faire les bons choix d’orientation académique et professionnelle.
            </p>
            <div className="presentation-text-block">
              <p>
                Chaque année, des milliers de jeunes se retrouvent dans des filières qui ne correspondent ni à leurs 
                intérêts ni aux réalités du marché de l’emploi. <strong>Orientation-bj</strong> répond à ce problème 
                en combinant <strong>psychométrie (test RIASEC)</strong>, <strong>intelligence artificielle</strong> 
                et <strong>données locales</strong> (écoles, débouchés, insertion).
              </p>
              <p>
                Notre mission : vous offrir un accompagnement personnalisé, gratuit et accessible à tous, pour que 
                chaque étudiant puisse construire un projet d’avenir réaliste et épanouissant.
              </p>
            </div>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <FontAwesomeIcon icon={faChartLine} className="feature-icon" />
              <h3>Test adaptatif</h3>
              <p>Questionnaire intelligent qui s'ajuste à vos réponses pour un profil précis en 15-20 minutes.</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faRobot} className="feature-icon" />
              <h3>Chatbot conseiller</h3>
              <p>Un assistant interactif pour répondre à vos questions sur les filières et métiers.</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faMapMarkedAlt} className="feature-icon" />
              <h3>Cartographie des écoles</h3>
              <p>Visualisez les établissements près de chez vous avec filtres (coût, type, distance).</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faUserGraduate} className="feature-icon" />
              <h3>Espace personnel</h3>
              <p>Historique des tests, favoris, rapport PDF et suivi de votre évolution.</p>
            </div>
          </div>
        </div>
      </section>

     

      <section className="riasec-explained">
        <div className="container">
          <h2>Comprendre le modèle RIASEC</h2>
          <p>Le test identifie vos types dominants parmi les 6 suivants :</p>
          <div className="riasec-grid">
            <div className="riasec-type" style={{ borderTopColor: "#FF6B6B" }}><h3>Réaliste (R)</h3><p>Pratique, manuel, aime travailler avec des outils, machines, extérieur.</p></div>
            <div className="riasec-type" style={{ borderTopColor: "#4ECDC4" }}><h3>Investigateur (I)</h3><p>Curieux, analytique, aime résoudre des problèmes, sciences, recherche.</p></div>
            <div className="riasec-type" style={{ borderTopColor: "#FFE66D" }}><h3>Artistique (A)</h3><p>Créatif, expressif, aime l'art, la musique, l'écriture, le design.</p></div>
            <div className="riasec-type" style={{ borderTopColor: "#A8E6CF" }}><h3>Social (S)</h3><p>Aidant, empathique, aime enseigner, soigner, conseiller, travailler en équipe.</p></div>
            <div className="riasec-type" style={{ borderTopColor: "#FFB347" }}><h3>Entreprenant (E)</h3><p>Persuasif, ambitieux, aime diriger, vendre, influencer, prendre des risques.</p></div>
            <div className="riasec-type" style={{ borderTopColor: "#A2B9E2" }}><h3>Conventionnel (C)</h3><p>Organisé, méthodique, aime les données, l'ordre, les tâches administratives.</p></div>
          </div>
          <p className="riasec-note">Votre code à 3 lettres (ex: SAE) représente vos trois types les plus marqués.</p>
        </div>
      </section>

      

     <section className="faq-section">
        <div className="container">
          <h2>Foire aux questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.question}</span>
                  <FontAwesomeIcon icon={openFaq === index ? faChevronUp : faChevronDown} />
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="view">
            <Link to="/faq" className="view-all">Voir toutes les questions</Link>

          </div>
        </div>
      </section>

      <section className="contact-support">
        <div className="container">
          <h2>Besoin d'aide supplémentaire ?</h2>
          <div className="contact-cards">
            <div className="contact-card">
              <FontAwesomeIcon icon={faEnvelope} />
              <h3>Email</h3>
              <p>support@orientation-bj.bj</p>
              <p>Réponse sous 24h</p>
            </div>
            <div className="contact-card">
              <FontAwesomeIcon icon={faPhone} />
              <h3>Téléphone</h3>
              <p>+229 01 23 45 67</p>
              <p>Lun-Ven, 9h-17h</p>
            </div>
            <div className="contact-card">
              <FontAwesomeIcon icon={faHeadset} />
              <h3>Chat en ligne</h3>
              <p>Utilisez le chatbot en bas à droite</p>
              <button className="contact-link" onClick={() => setChatOpen(true)}>Ouvrir le chat</button>
            </div>
          </div>
        </div>
      </section>

      <section className="resources-section">
        <div className="container">
          <h2>Ressources disponibles</h2>
          <div className="resources-grid">
            <Link to="/guide-riasec" className="resource-card">
              <FontAwesomeIcon icon={faDownload} />
              <span>Guide complet RIASEC </span>
            </Link>
            <Link to="/faq" className="resource-card">
              <FontAwesomeIcon icon={faDownload} />
              <span>FAQ détaillée </span>
            </Link>
            
          </div>
        </div>
      </section>

      <div className="chatbot-widget">
        {!chatOpen && (
          <button className="chatbot-toggle" onClick={() => setChatOpen(true)}>
            <FontAwesomeIcon icon={faComments} /> Chat en ligne
          </button>
        )}
        {chatOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <span><FontAwesomeIcon icon={faRobot} /> Conseil orientation</span>
              <button className="chatbot-close" onClick={() => setChatOpen(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="chatbot-messages">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.from}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Posez votre question..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Envoyer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;