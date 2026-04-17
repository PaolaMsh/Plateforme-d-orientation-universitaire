import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';

import Home from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import MetiersPorteurs from './pages/metiers-porteurs';
import Orientations from './pages/orientations';
import Support from './pages/support';
import Test from './pages/tests';
import Testsorientations from './pages/tests-orientations';
import UniversitiesPage from './pages/universites-formations';
import HeaderParent from './components/headerParent';
import Footer from './components/footer';
import ScrollToTop from './components/ScrollToTop';
import BoursesAides from './pages/bourses-aides';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const isAuth = isAuthenticated || token;
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
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

                    
          <Route path="/universites-formations" element={
            <ProtectedRoute>
              <UniversitiesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/metiers-porteurs" element={
            <ProtectedRoute>
              <MetiersPorteurs />
            </ProtectedRoute>
          } />
          
          <Route path="/support" element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          } />
          
          <Route path="/tests-orientations" element={
            <ProtectedRoute>
              <Testsorientations />
            </ProtectedRoute>
          } />
          
          <Route path="/tests" element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          } />
          
          <Route path="/orientations" element={
            <ProtectedRoute>
              <Orientations />
            </ProtectedRoute>
          } />

          <Route path="/bourses-aides" element={
            <ProtectedRoute>
              <BoursesAides />
            </ProtectedRoute>
          } />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;