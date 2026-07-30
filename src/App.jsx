import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { useAuth } from './context/auth';
import Home from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import MetiersPorteurs from './pages/metiers-porteurs';
import Orientations from './pages/orientations';
import Support from './pages/support';
import Test from './pages/tests';
import Testsorientations from './pages/tests-orientations';
import GeneralTest from './pages/generalTest';
import UniversitiesPage from './pages/universites-formations';
import HeaderParent from './components/headerParent';
import Footer from './components/footer';
import ScrollToTop from './components/scrollToTop';
import BoursesAides from './pages/bourses-aides';
import Parcours from './pages/parcours';
import Contact from './pages/contact';
import Guide from './pages/guide-riasec';
import Faq from './pages/faq';
import RapportGeneral from './pages/rapport-general';
import VerifyEmailGuard from './components/VerifyEmailGuard';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    const location = useLocation();
    const isAuth = !!token;

    if (!isAuth) {
        return (
            <Navigate
                to="/auth/login"
                state={{ from: location.pathname + location.search }}
                replace
            />
        );
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />

                <HeaderParent />
                <Routes>
                    <Route path="/" element={<Navigate to="/accueil" replace />} />
                    <Route path="/accueil" element={<Home />} />
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                    <Route path="/auth/check-email" element={<VerifyEmailGuard />} />

                    <Route path="/universites-formations" element={<UniversitiesPage />} />

                    <Route
                        path="/metiers-porteurs"
                        element={
                            <ProtectedRoute>
                                <MetiersPorteurs />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/support"
                        element={
                            <ProtectedRoute>
                                <Support />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/tests-orientations"
                        element={
                            <ProtectedRoute>
                                <Testsorientations />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/tests"
                        element={
                            <ProtectedRoute>
                                <Test />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/test-general"
                        element={
                            <ProtectedRoute>
                                <GeneralTest />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/orientations"
                        element={
                            <ProtectedRoute>
                                <Orientations />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/bourses-aides"
                        element={
                            <ProtectedRoute>
                                <BoursesAides />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/contact"
                        element={
                            <ProtectedRoute>
                                <Contact />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/parcours"
                        element={
                            <ProtectedRoute>
                                <Parcours />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/guide-riasec"
                        element={
                            <ProtectedRoute>
                                <Guide />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/faq"
                        element={
                            <ProtectedRoute>
                                <Faq />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/rapport-general"
                        element={
                            <ProtectedRoute>
                                <RapportGeneral />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
