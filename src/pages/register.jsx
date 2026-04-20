import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import api from "../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isPasswordStrong = (pwd) => {
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const isLongEnough = pwd.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
  };

  const isPasswordValid = () => {
    if (!password) return false;
    return isPasswordStrong(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!firstName.trim()) {
      setError("Veuillez entrer votre prénom");
      return;
    }

    if (!lastName.trim()) {
      setError("Veuillez entrer votre nom");
      return;
    }

    if (!email.trim()) {
      setError("Veuillez entrer votre email");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!isPasswordStrong(password)) {
      setError("Le mot de passe ne respecte pas tous les critères de sécurité");
      return;
    }

    if (!acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation");
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        acceptTerms: true 
      };
      
      console.log("Données envoyées:", userData);
      
      const response = await api.post('/auth/register', userData);
      
      console.log("Réponse:", response.data);
      setSuccess(true);
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      console.error("Erreur:", error.response?.data);
      
      if (error.response?.data?.details) {
        setError(error.response.data.details.join(", "));
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Erreur lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  // Vérifier si au moins un critère n'est pas rempli
  const hasInvalidCriteria = () => {
    if (!password) return false;
    return !passwordStrength.length || 
           !passwordStrength.uppercase || 
           !passwordStrength.lowercase || 
           !passwordStrength.number || 
           !passwordStrength.special;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src="/icone.jpg" alt="logo" className="logo-img" />
          <h2>Créer un compte</h2>
          <p className="subtitle">
            Ou{" "}
            <Link to="/login" className="toggle-link">
              connectez-vous à votre compte
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="firstName">Prénom</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Votre prénom"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Nom</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Votre nom"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Adresse e-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={password && !isPasswordValid() ? "password-invalid" : ""}
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            
            {/* Afficher les critères uniquement si le mot de passe n'est pas valide */}
            {password && !isPasswordValid() && (
              <div className="password-strength">
                <p className="strength-title">Le mot de passe doit contenir :</p>
                <ul className="strength-list">
                  <li className={passwordStrength.length ? "valid" : "invalid"}>
                    {passwordStrength.length ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                    Au moins 8 caractères
                  </li>
                  <li className={passwordStrength.uppercase ? "valid" : "invalid"}>
                    {passwordStrength.uppercase ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                    Une majuscule
                  </li>
                  <li className={passwordStrength.lowercase ? "valid" : "invalid"}>
                    {passwordStrength.lowercase ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                    Une minuscule
                  </li>
                  <li className={passwordStrength.number ? "valid" : "invalid"}>
                    {passwordStrength.number ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                    Un chiffre
                  </li>
                  <li className={passwordStrength.special ? "valid" : "invalid"}>
                    {passwordStrength.special ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                    Un caractère spécial (!@#$%^&*())
                  </li>
                </ul>
              </div>
            )}
            
            {password && isPasswordValid() && (
              <div className="password-valid-message">
                <FontAwesomeIcon icon={faCheck} className="valid-icon" />
                <span>Mot de passe sécurisé !</span>
              </div>
            )}
          </div>

          <div className="form-group password-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </span>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <div className="password-mismatch">
                <FontAwesomeIcon icon={faTimes} />
                <span>Les mots de passe ne correspondent pas</span>
              </div>
            )}
            {confirmPassword && password === confirmPassword && password && (
              <div className="password-match">
                <FontAwesomeIcon icon={faCheck} />
                <span>Les mots de passe correspondent</span>
              </div>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <span>J'accepte les conditions d'utilisation</span>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Inscription réussie ! Redirection vers la connexion...</div>}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;