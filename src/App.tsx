import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

const App = () => {
  const [refresh, setRefresh] = useState(false);
  const reload = () => setRefresh(!refresh);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Otras rutas de tu aplicación */}
      </Routes>
     </Router>
  );
};

export default App;