import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Forbidden from './components/Forbidden';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route: login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin-only */}
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Solo empresa */}
        <Route
          path="/dashboard-company"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        {/* solo Usuario */}
        <Route
          path="/dashboard-user"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Forbidden page route */}
        <Route path="/403" element={<Forbidden />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
