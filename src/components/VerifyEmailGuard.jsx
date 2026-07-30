import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../services/authService';

const VerifyEmailGuard = () => {
    const [status, setStatus] = useState('verifying');
    const [errorMessage, setErrorMessage] = useState('');
    const [countdown, setCountdown] = useState(3);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hasRun = useRef(false);

    // ⚠️ IMPORTANT : Vérifie comment le token est récupéré
    const token = searchParams.get('token');

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const verifyAndRedirect = async () => {
            console.log('🔍 Token récupéré:', token); // ← AJOUTE CETTE LIGNE

            if (!token) {
                setStatus('error');
                setErrorMessage("Token de vérification manquant dans l'URL.");
                return;
            }

            try {
                console.log("📤 Envoi du token à l'API...");
                const response = await verifyEmail(token);
                console.log('✅ Réponse API:', response);

                setStatus('success');
                setTimeout(() => {
                    navigate('/auth/login', {
                        state: { message: 'Email vérifié avec succès !' },
                    });
                }, 2000);
            } catch (error) {
                console.error('❌ Erreur:', error);
                setStatus('error');
                setErrorMessage(error.message || 'Token invalide ou expiré.');
            }
        };

        verifyAndRedirect();
    }, [token, navigate]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                padding: '2rem',
                flexDirection: 'column',
                textAlign: 'center',
                gap: '1rem',
            }}
        >
            {status === 'verifying' && (
                <>
                    <h2>⏳ Vérification de votre email…</h2>
                    <p>Nous activons votre compte, veuillez patienter.</p>
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>
                        Token: {token ? token.substring(0, 15) + '...' : 'Aucun token'}
                    </p>
                </>
            )}

            {status === 'success' && (
                <>
                    <h2 style={{ color: '#1f7a1f' }}>✅ Email vérifié !</h2>
                    <p>Redirection vers la connexion…</p>
                </>
            )}

            {status === 'error' && (
                <>
                    <h2 style={{ color: '#b42318' }}>❌ Vérification échouée</h2>
                    <p>{errorMessage}</p>
                    <Link to="/auth/login" className="toggle-link">
                        Retour à la connexion
                    </Link>
                </>
            )}
        </div>
    );
};

export default VerifyEmailGuard;
