import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebookF,
    faTwitter,
    faInstagram,
    faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import '../styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section logo-section">
                    <Link to="/accueil" className="footer-logo">
                        <img src="/icone.jpg" alt="Orientation BJ" />
                    </Link>
                    <p className="footer-motto">
                        Trouvez votre voie académique en quelques minutes, prenez le contrôle de
                        votre avenir.
                    </p>
                </div>

                <div className="footer-section">
                    <h3>Orientation & Métiers</h3>
                    <ul className="footer-links">
                        <li>
                            <Link to="/tests-orientations">Tests d'orientation</Link>
                        </li>
                        <li>
                            <Link to="/metiers-porteurs">Métiers porteurs</Link>
                        </li>
                        
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Ressources</h3>
                    <ul className="footer-links">
                        <li>
                            <Link to="/bourses-aides">Bourses d'études</Link>
                        </li>
                        <li>
                            <a
                                href="https://apresmonbac.bj/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Plateforme Après Bac
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Universités & Écoles</h3>
                    <ul className="footer-links">
                        <li>
                            <Link to="/universites-formations">Universités du Bénin</Link>
                        </li>
                        <li>
                            <Link to="/ecoles-privees">Écoles privées</Link>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Aide & Contact</h3>
                    <ul className="footer-links">
                        <li>
                            <Link to="/support">À propos</Link>
                        </li>
                        <li>
                            <Link to="/contact">Nous contacter</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom-section">
                <div className="footer-bottom-content">
                    <div className="social-copyright">
                        <div className="social-links">
                            <a href="#" className="social-icon">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            <a href="#" className="social-icon">
                                <FontAwesomeIcon icon={faTwitter} />
                            </a>
                            <a href="#" className="social-icon">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a href="#" className="social-icon">
                                <FontAwesomeIcon icon={faLinkedinIn} />
                            </a>
                        </div>
                        <p className="copyright">Tous droits réservés @orientation.bj</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
