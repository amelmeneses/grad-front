import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage      from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Forbidden      from './components/Forbidden';

import AdminDashboard  from './components/AdminDashboard';
import ManageUsers     from './components/ManageUsers';
import UserForm        from './components/UserForm';

import ManageCompanies from './components/ManageCompanies';
import CompanyForm     from './components/CompanyForm';
import ManageCourts    from './components/ManageCourts';
import CourtForm       from './components/courts/CourtForm';
import SelectCompanyForCourts from './components/SelectCompanyForCourts';

import CompanyDashboard from './components/CompanyDashboard';
import UserDashboard    from './components/UserDashboard';

import LandingPage from './pages/LandingPage';





function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin → Usuarios */}
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

        {/* Admin → Empresas */}
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

        {/* Admin → Canchas */}
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
              <CourtForm onCourtAdded={() => { /* refrescar lista si quieres */ }} />
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

        {/* Company & User Dashboards */}
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

        {/* 403 Forbidden & fallback */}
        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
