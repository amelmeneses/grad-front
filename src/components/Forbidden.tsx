import { Link } from 'react-router-dom';
export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-xl mb-6">No tienes permiso para acceder a esta página.</p>
      <Link to="/" className="text-blue-500 underline">Volver al inicio</Link>
    </div>
  );
}
