// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import ManageUsers from './components/ManageUsers';
import UserForm from './components/UserForm';           // ← importa el formulario
import UserDashboard from './components/UserDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Forbidden from './components/Forbidden';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin menu */}
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin → Manage Users */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        {/* Admin → Crear Usuario */}
        <Route
          path="/admin/user"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <UserForm />
            </ProtectedRoute>
          }
        />

        {/* Admin → Editar Usuario */}
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <UserForm />
            </ProtectedRoute>
          }
        />

        {/* Company & User dashboards */}
        <Route
          path="/dashboard-company"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-user"
          element={
            <ProtectedRoute allowedRoles={[3]}>
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
