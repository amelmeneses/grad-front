// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage      from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Forbidden      from './components/Forbidden';

import AdminDashboard  from './components/AdminDashboard';
import ManageUsers     from './components/ManageUsers';
import UserForm        from './components/UserForm';

import ManageCompanies from './components/ManageCompanies';
import CompanyForm     from './components/CompanyForm';
import SelectCompanyForCourts from './components/SelectCompanyForCourts';
import ManageCourts    from './components/ManageCourts';
import CourtForm       from './components/courts/CourtForm';

import CompanyDashboard from './components/CompanyDashboard';
import UserDashboard    from './components/UserDashboard';

import LandingPage     from './pages/LandingPage';
import AboutAs         from './pages/AboutAs';
import ServicesSection from './pages/ServicesSection';
import HelpSection     from './pages/HelpSection';
import TermsPage       from './pages/TermsAndConditions';
import PrivacyPolicy   from './pages/PrivacyPolicy';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about-as" element={<AboutAs />} />
        <Route path="/servicios" element={<ServicesSection />} />
        <Route path="/ayuda" element={<HelpSection />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/politica" element={<PrivacyPolicy />} />

        {/* Footer redirects */}
        <Route path="/reservas" element={<Navigate to="/login" replace />} />
        <Route path="/perfil"  element={<Navigate to="/login" replace />} />
        <Route path="/contacto" element={<Navigate to="/ayuda" replace />} />

        {/* Protected — Admin */}
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <UserForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/empresas"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <ManageCompanies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/empresa"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <CompanyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/empresa/:id"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <CompanyForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/canchas"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <SelectCompanyForCourts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/canchas/:empresaId"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <ManageCourts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/canchas/:empresaId/new"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <CourtForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/canchas/:empresaId/:id"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <CourtForm />
            </ProtectedRoute>
          }
        />

        {/* Protected — Company & User */}
        <Route
          path="/dashboard-company"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-user"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* 403 & fallback */}
        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
