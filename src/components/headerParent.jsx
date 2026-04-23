import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faSignOutAlt,
    faChevronDown,
    faUserCircle,
    faGraduationCap,
    faArrowRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/authContext';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const [showMenu, setShowMenu] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        logout();
        setShowMenu(false);
        setShowLogoutConfirm(false);
        navigate('/accueil');
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
        setShowLogoutConfirm(false);
    };

    const handleAccessProfile = () => {
        navigate('/profil');
        setShowMenu(false);
    };

    const handleAccessParcours = () => {
        navigate('/parcours');
        setShowMenu(false);
    };

    const handleLoginClick = () => {
        navigate('/login');
        setShowMenu(false);
    };

    const handleRegisterClick = () => {
        navigate('/register');
        setShowMenu(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
                setShowLogoutConfirm(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="header-container">
            <div className="header-content">
                <Link to="/accueil" className="logo-container">
                    <img src="/icone.jpg" alt="Orientation BJ" className="logo" />
                    <div className="text">
                        <span className="logo-text">Orientation</span>
                        <span className="logo-text2">bj</span>
                    </div>
                </Link>

                <nav className="nav-menu">
                    <Link
                        to="/accueil"
                        className={`nav-link ${location.pathname === '/accueil' ? 'active' : ''}`}
                    >
                        Accueil
                    </Link>
                    <Link
                        to="/tests-orientations"
                        className={`nav-link ${location.pathname === '/tests-orientations' ? 'active' : ''}`}
                    >
                        Tests et Orientations
                    </Link>
                    <Link
                        to="/universites-formations"
                        className={`nav-link ${location.pathname === '/universites-formations' ? 'active' : ''}`}
                    >
                        Universités et Formations
                    </Link>
                    <Link
                        to="/bourses-aides"
                        className={`nav-link ${location.pathname === '/bourses-aides' ? 'active' : ''}`}
                    >
                        Bourses et Aides
                    </Link>
                    <Link
                        to="/metiers-porteurs"
                        className={`nav-link ${location.pathname === '/metiers-porteurs' ? 'active' : ''}`}
                    >
                        Métiers porteurs
                    </Link>
                </nav>

                <div className="user-menu-container" ref={menuRef}>
                    <button className="user-menu-trigger" onClick={toggleMenu}>
                        <div className="user-avatar">
                            <FontAwesomeIcon icon={faUserCircle} className="default-avatar" />
                        </div>
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`dropdown-icon ${showMenu ? 'open' : ''}`}
                        />
                    </button>

                    {showMenu && (
                        <div className="user-menu-dropdown">
                            {isAuthenticated ? (
                                !showLogoutConfirm ? (
                                    <>
                                        <button onClick={handleAccessProfile} className="menu-item">
                                            <FontAwesomeIcon icon={faUser} />
                                            <span>Mon profil</span>
                                        </button>
                                        <button
                                            onClick={handleAccessParcours}
                                            className="menu-item"
                                        >
                                            <FontAwesomeIcon icon={faGraduationCap} />
                                            <span>Mon parcours</span>
                                        </button>
                                        <button
                                            onClick={() => setShowLogoutConfirm(true)}
                                            className="menu-item logout-item"
                                        >
                                            <FontAwesomeIcon icon={faSignOutAlt} />
                                            <span>Se déconnecter</span>
                                        </button>
                                    </>
                                ) : (
                                    <div className="logout-confirmation">
                                        <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                                        <div className="confirmation-buttons">
                                            <button
                                                onClick={handleLogout}
                                                className="confirm-button"
                                            >
                                                Confirmer
                                            </button>
                                            <button
                                                onClick={() => setShowLogoutConfirm(false)}
                                                className="cancel-button"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <>
                                    <button
                                        onClick={handleLoginClick}
                                        className="menu-item login-item"
                                    >
                                        <FontAwesomeIcon icon={faArrowRightToBracket} />
                                        <span>Se connecter</span>
                                    </button>
                                    <button
                                        onClick={handleRegisterClick}
                                        className="menu-item register-item"
                                    >
                                        <FontAwesomeIcon icon={faUser} />
                                        <span>S'inscrire</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
