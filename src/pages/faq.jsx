import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faChevronDown,
    faChevronUp,
    faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/faq.css';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "Comment fonctionne le test d'orientation ?",
            answer: "Le test d'orientation est basé sur le modèle RIASEC qui évalue vos intérêts et préférences pour différents types d'activités professionnelles. Il se compose de deux phases : un questionnaire de base de 15 questions, puis un test adaptatif où les questions s'ajustent à vos réponses. Le test s'arrête automatiquement lorsque le profil est suffisamment fiable (généralement 15-20 minutes).",
        },
        {
            question: 'Combien de temps faut-il pour obtenir mes résultats ?',
            answer: 'Les résultats sont disponibles immédiatement après la fin du test. Vous obtiendrez votre profil RIASEC (code à 3 lettres), une liste de métiers recommandés, des filières adaptées et des établissements correspondants.',
        },
        {
            question: 'Puis-je refaire le test plusieurs fois ?',
            answer: "Oui, vous pouvez refaire le test à tout moment depuis votre espace personnel. Cela vous permet de suivre l'évolution de vos intérêts au fil du temps. Nous recommandons de le refaire une fois par an.",
        },
        {
            question: 'Mes données personnelles sont-elles protégées ?',
            answer: 'Absolument. Toutes vos données sont cryptées (bcrypt pour les mots de passe, HTTPS pour les échanges). Nous respectons le RGPD et vous pouvez supprimer votre compte à tout moment.',
        },
        {
            question: 'La plateforme est-elle vraiment gratuite ?',
            answer: "Oui, Orientation-bj est entièrement gratuite pour tous les élèves et étudiants béninois. Seules certaines fonctionnalités avancées destinées aux établissements pourraient être payantes à l'avenir.",
        },
        {
            question: 'Comment sont générées les recommandations ?',
            answer: "Nos recommandations combinent votre profil RIASEC, les données historiques d'autres utilisateurs similaires (filtrage collaboratif) et des indicateurs locaux (débouchés, insertion professionnelle, localisation, budget).",
        },
        {
            question: 'Puis-je exporter mes résultats ?',
            answer: 'Oui, depuis votre espace personnel, vous pouvez générer un rapport détaillé au format PDF contenant votre profil, les métiers recommandés et les formations associées.',
        },
        {
            question: "Que faire si j'ai un problème technique ?",
            answer: "Vous pouvez nous contacter via le formulaire de contact, par email à support@orientation-bj.bj, ou utiliser le chatbot en bas à droite de l'écran. Notre équipe vous répondra dans les 24h.",
        },
        {
            question: 'Les recommandations sont-elles fiables ?',
            answer: "Nos recommandations combinent votre profil RIASEC, les données historiques d'autres utilisateurs similaires (filtrage collaboratif) et des indicateurs locaux (débouchés, insertion professionnelle). La précision s'améliore avec le nombre d'utilisateurs.",
        },
        {
            question: 'Comment accéder à mon espace personnel ?',
            answer: 'Après vous être inscrit et connecté, vous accédez à votre tableau de bord où vous retrouvez vos résultats, favoris, historique et possibilité de générer un rapport PDF.',
        },
        {
            question: 'Quelle est la différence entre Bourse, FPP et FEP ?',
            answer: "Au Bénin, il existe trois types de financement universitaire. La Bourse : l'État finance entièrement tes études (places limitées, attribuées aux meilleurs dossiers). Le FPP (Formation Partiellement Payante) : l'État finance une partie et tu paies le reste. Le FEP (Formation Entièrement Payante) : tu paies la totalité des frais de scolarité. Le type de financement dépend de ta filière, tes notes et le nombre de places disponibles.",
        },
        {
            question: 'Comment accéder à mon espace personnel ?',
            answer: 'Après vous être inscrit et connecté, vous accédez à votre tableau de bord où vous retrouvez vos résultats, favoris, historique et possibilité de générer un rapport PDF.',
        },
    ];

    return (
        <div className="faq-page">
            <div className="faq-header">
                <Link to="/support" className="back-link">
                    <FontAwesomeIcon icon={faArrowLeft} /> Retour au support
                </Link>
                <h1>Foire aux questions (FAQ)</h1>
                <p>Les réponses aux questions les plus fréquentes sur Orientation-bj</p>
            </div>

            <div className="faq-container">
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <button className="faq-question" onClick={() => toggleFaq(index)}>
                                <span>
                                    <FontAwesomeIcon icon={faQuestionCircle} className="faq-icon" />
                                    {faq.question}
                                </span>
                                <FontAwesomeIcon
                                    icon={openIndex === index ? faChevronUp : faChevronDown}
                                />
                            </button>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="faq-footer">
                    <p>Vous n'avez pas trouvé votre réponse ?</p>
                    <Link to="/contact" className="contact-btn">
                        Contactez-nous
                    </Link>

                    <Link to="/support" className="contact-btn">
                        Retour
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
