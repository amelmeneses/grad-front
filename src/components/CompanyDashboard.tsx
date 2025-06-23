import Navbar from './Navbar';
import AdminNav from './AdminNav';

export default function CompanyDashboard() {
  return (
    <>
      {/* Navbar fijo en la parte superior */}
      <Navbar />

      {/* Layout principal con margen para el Navbar */}
      <div className="flex min-h-screen bg-white mt-19">
        <AdminNav />
        
        {/* Contenido principal */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Empresarial</h1>
          <p className="text-gray-600">Bienvenido al panel de administración.</p>
        </main>
      </div>
    </>
  );
}
