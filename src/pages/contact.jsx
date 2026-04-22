import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faClock,
    faPaperPlane,
    faCheckCircle,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setFormData({ nom: '', email: '', telephone: '', sujet: '', message: '' });
            setTimeout(() => setSubmitSuccess(false), 5000);
        }, 1500);
    };

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1>Nous contacter</h1>
                    <p>Une question ? Une suggestion ? Notre équipe est là pour vous répondre.</p>
                </div>
            </section>

            <div className="contact-container">
                <div className="contact-info">
                    <h2>Coordonnées</h2>
                    <div className="info-card">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <div>
                            <h3>Adresse</h3>
                            <p>
                                Cotonou, Bénin
                                <br />
                                Quartier Jéricho, 01 BP 1234
                            </p>
                        </div>
                    </div>
                    <div className="info-card">
                        <FontAwesomeIcon icon={faPhone} />
                        <div>
                            <h3>Téléphone</h3>
                            <p>
                                +229 01 23 45 67
                                <br />
                                +229 98 76 54 32
                            </p>
                        </div>
                    </div>
                    <div className="info-card">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <div>
                            <h3>Email</h3>
                            <p>
                                contact@orientation-bj.bj
                                <br />
                                support@orientation-bj.bj
                            </p>
                        </div>
                    </div>
                    <div className="info-card">
                        <FontAwesomeIcon icon={faClock} />
                        <div>
                            <h3>Horaires</h3>
                            <p>
                                Lundi - Vendredi : 9h - 17h
                                <br />
                                Samedi : 9h - 13h
                            </p>
                        </div>
                    </div>
                </div>

                <div className="contact-form-container">
                    <h2>Envoyez-nous un message</h2>
                    {submitSuccess && (
                        <div className="alert success">
                            <FontAwesomeIcon icon={faCheckCircle} /> Votre message a été envoyé avec
                            succès. Nous vous répondrons dans les plus brefs délais.
                        </div>
                    )}
                    {submitError && <div className="alert error">{submitError}</div>}
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nom complet *</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Téléphone</label>
                                <input
                                    type="tel"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Sujet *</label>
                                <input
                                    type="text"
                                    name="sujet"
                                    value={formData.sujet}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Message *</label>
                            <textarea
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                            ) : (
                                <FontAwesomeIcon icon={faPaperPlane} />
                            )}
                            {isSubmitting ? ' Envoi en cours...' : ' Envoyer le message'}
                        </button>
                    </form>
                </div>
            </div>

            <section className="map-section">
                <div className="container">
                    <h2>Retrouvez-nous</h2>
                    <div className="map-container">
                        <iframe
                            title="Carte Orientation-bj"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126889.7059623967!2d2.366999!3d6.439172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e9e9e9e9e9e9%3A0x0!2sCotonou%2C%20Benin!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
                            width="100%"
                            height="350"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>

            <section className="faq-redirect">
                <div className="container">
                    <h2>Vous avez une question fréquente ?</h2>
                    <p>
                        Consultez notre centre d'aide et la FAQ pour obtenir rapidement une réponse.
                    </p>
                    <Link to="/support" className="btn-faq">
                        Aller à la FAQ
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Contact;
