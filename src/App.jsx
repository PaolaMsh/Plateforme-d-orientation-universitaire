import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';

// Pages
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
import BoursesAides from './pages/bourses-aides';
import Contact from './pages/contact';
import Faq from './pages/faq';
import GuideRiasec from './pages/guide-riasec';


const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <HeaderParent />
        <Routes>
          <Route path="/" element={<Navigate to="/accueil" replace />} />
          <Route path="/accueil" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/metiers-porteurs" element={<MetiersPorteurs />} />
          <Route path="/orientations" element={<Orientations />} />
          <Route path="/support" element={<Support />} />
          <Route path="/tests" element={<Test />} />
          <Route path="/tests-orientations" element={<Testsorientations />} />
          <Route path="/universites-formations" element={<UniversitiesPage />} />
          <Route path="/bourses-aides" element={<BoursesAides />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/guide-riasec" element={<GuideRiasec />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;