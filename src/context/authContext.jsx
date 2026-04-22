import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            setUser(null);
            delete api.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = (userData, authToken) => {
        console.log('🔐 Login appelé avec:', { userData, authToken });

        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);
        localStorage.setItem('token', authToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

        console.log('✅ État après login - isAuthenticated:', true);
        console.log('✅ Token stocké:', authToken);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Erreur logout:', error);
        } finally {
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            console.log('✅ Utilisateur déconnecté');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
