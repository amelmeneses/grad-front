// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage        from './components/LoginPage';
import RegisterPage     from './components/RegisterPage';
import ProtectedRoute   from './components/ProtectedRoute';
import Forbidden        from './components/Forbidden';
import ActivatePage     from './components/ActivatePage';
import MiCuentaPage     from './components/MiCuentaPage';

import AdminDashboard     from './components/AdminDashboard';
import DashboardUser      from './components/DashboardUser';
import ManageUsers        from './components/ManageUsers';
import UserForm           from './components/UserForm';
import ManageCompanies    from './components/ManageCompanies';
import CompanyForm        from './components/CompanyForm';
import ManageCourts       from './components/ManageCourts';
import CourtForm          from './components/courts/CourtForm';
import CompanyDashboard   from './components/CompanyDashboard';
import UserDashboard      from './components/UserDashboard';
import ManageUserCompanies from './components/ManageUserCompanies';

import LandingPage        from './pages/LandingPage';
import AboutAs            from './pages/AboutAs';
import ServicesSection    from './pages/ServicesSection';
import HelpSection        from './pages/HelpSection';
import TermsPage          from './pages/TermsAndConditions';
import PrivacyPolicy      from './pages/PrivacyPolicy';

import TariffList         from './components/TariffList';
import TariffForm         from './components/TariffForm';
import OpenHoursList      from './components/OpenHoursList';
import OpenHoursForm      from './components/OpenHoursForm';
import CourtsList         from './components/CourtsList';
import CompanyCourtsList  from './components/CompanyCourtsList';

import ReservasPage       from './components/ReservasPage';
import CanchasPorDeporte  from './components/CanchasPorDeporte';
import CanchaDetalle      from './components/CanchaDetalle';
import ReservaStep1       from './components/ReservaStep1';
import ReservasList       from './components/ReservasList';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/activate/user/:token" element={<ActivatePage />} />
        <Route path="/about-as" element={<AboutAs />} />
        <Route path="/servicios" element={<ServicesSection />} />
        <Route path="/ayuda" element={<HelpSection />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/politica" element={<PrivacyPolicy />} />

        {/* Footer redirects */}
        <Route path="/reservas" element={<ReservasPage />} />
        <Route path="/perfil"  element={<Navigate to="/login" replace />} />
        <Route path="/contacto" element={<Navigate to="/ayuda" replace />} />

        {/* Protected — Reservas Usuario */}
        <Route
          path="/canchas/:deporte"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <CanchasPorDeporte />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cancha/:id"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <CanchaDetalle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservar/:canchaId"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <ReservaStep1 />
            </ProtectedRoute>
          }
        />

        {/* Protected — User */}
        <Route
          path="/dashboard-user"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <DashboardUser />
            </ProtectedRoute>
          }
        />

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

        {/* Empresas */}
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
            <ProtectedRoute allowedRoles={[1, 3]}>
              <CompanyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/empresa/:id"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <CompanyForm />
            </ProtectedRoute>
          }
        />

        {/* Canchas */}
        <Route
          path="/admin/canchas"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <CourtsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/canchas/:empresaId"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <ManageCourts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/canchas/:empresaId/new"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <CourtForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/canchas/:empresaId/:id"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <CourtForm />
            </ProtectedRoute>
          }
        />

        {/* Tarifas */}
        <Route
          path="/admin/canchas/:empresaId/:canchaId/tarifas"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <TariffList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/canchas/:empresaId/:canchaId/tarifas/new"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <TariffForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/canchas/:empresaId/:canchaId/tarifas/:tariffId"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <TariffForm />
            </ProtectedRoute>
          }
        />

        {/* Horarios */}
        <Route
          path="/admin/canchas/:empresaId/:canchaId/horarios"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <OpenHoursList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/canchas/:empresaId/:canchaId/horarios/new"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <OpenHoursForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/canchas/:empresaId/:canchaId/horarios/:scheduleId"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <OpenHoursForm />
            </ProtectedRoute>
          }
        />

        {/* Lista de reservas para admin */}
        <Route
          path="/admin/reservas"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <ReservasList />
            </ProtectedRoute>
          }
        />

        {/* Protected — Company & User */}
        <Route
          path="/mi-cuenta"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <MiCuentaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-company"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/empresas"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <ManageUserCompanies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/canchas"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <CompanyCourtsList />
            </ProtectedRoute>
          }
        />
          <Route
              path="/company/reservas"
              element={
                <ProtectedRoute allowedRoles={[3]}>
                  <ReservasList />
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
