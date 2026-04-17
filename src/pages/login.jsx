import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import api from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      console.log("Réponse complète:", response.data);
      
      // Extraction des données selon ton format
      const { accessToken, refreshToken, data: userData } = response.data;
      
      // Format de l'utilisateur pour ton contexte
      const user = {
        id: userData.sub,
        email: userData.email,
        role: userData.role
      };
      
      // Appel de la fonction login avec user et token
      login(user, accessToken);
      
      // Redirection vers l'accueil
      navigate("/accueil");
      
    } catch (error) {
      console.error("Erreur:", error.response?.data);
      setError(error.response?.data?.message || "Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src="/icone.jpg" alt="logo" className="logo-img" />
          <h2>Connexion à votre compte</h2>
          <p className="subtitle">
            Ou{" "}
            <Link to="/register" className="toggle-link">
              créer un compte
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;