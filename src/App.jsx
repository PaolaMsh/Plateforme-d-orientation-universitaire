import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, ProtectedRoute, PublicRoute } from "./context/authContext";
import Home from "./pages/home";
import Layout from "./layouts/Defaultlayout";
import Testsorientations from "./pages/tests-orientations";
import Formationsetmétiers from "./pages/universites-formations";
import Test from "./pages/tests";
import Orientations from "./pages/orientations";
import Support from "./pages/support";
import Guideriasec from "./pages/guide-riasec";
import Contact from "./pages/contact";
import FAQ from "./pages/faq";
import MetiersPorteurs from "./pages/metiers-porteurs";
import AuthLogin from "./pages/login";
import AuthRegister from "./pages/register";
import Bourses from "./pages/bourses-aides";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/accueil" replace />} />
      
      <Route
        path="/accueil"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Layout>
              <AuthLogin />
            </Layout>
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Layout>
              <AuthRegister />
            </Layout>
          </PublicRoute>
        }
      />

      <Route
        path="/tests-orientations"
        element={
          <ProtectedRoute>
            <Layout>
              <Testsorientations />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests"
        element={
          <ProtectedRoute>
            <Layout>
              <Test />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orientations"
        element={
          <ProtectedRoute>
            <Layout>
              <Orientations />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/universites-formations"
        element={
          <ProtectedRoute>
            <Layout>
              <Formationsetmétiers />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <Layout>
              <Support />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/guide-riasec"
        element={
          <ProtectedRoute>
            <Layout>
              <Guideriasec />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Layout>
              <Contact />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/faq"
        element={
          <ProtectedRoute>
            <Layout>
              <FAQ />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/metiers-porteurs"
        element={
          <ProtectedRoute>
            <Layout>
              <MetiersPorteurs />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bourses-aides"
        element={
          <ProtectedRoute>
            <Layout>
              <Bourses />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/accueil" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;