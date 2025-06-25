// src/components/ReservaStep3.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ReservaStep3: React.FC = () => {
  const { canchaId } = useParams<{ canchaId: string }>();
  const [searchParams] = useSearchParams();
  const [pago, setPago] = useState<any>(null);
  const [form, setForm] = useState({
    email: '',
    cedula_ruc: '',
    direccion: '',
    tarjeta: '',
    vencimiento: '',
    cvc: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ids = searchParams.get('ids');

    axios
      .get(`/api/reservas/${canchaId}/pago?ids=${ids}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPago(res.data))
      .catch(() => setError('Error cargando detalles de pago'));
  }, [canchaId]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ciRucRegex = /^\d{10,13}$/;
    const cardRegex = /^\d{16}$/;

    if (!emailRegex.test(form.email)) newErrors.email = 'Ingrese un email válido.';
    if (!form.direccion.trim()) newErrors.direccion = 'La dirección no puede estar vacía.';
    if (!ciRucRegex.test(form.cedula_ruc)) newErrors.cedula_ruc = 'Debe tener entre 10 y 13 números.';
    if (!cardRegex.test(form.tarjeta.replace(/\s/g, ''))) newErrors.tarjeta = 'Tarjeta inválida. Use 16 dígitos.';
    if (!form.vencimiento.trim()) newErrors.vencimiento = 'Ingrese la fecha de vencimiento.';
    if (!form.cvc.trim()) newErrors.cvc = 'Ingrese el código CVC.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePagar = async () => {
    if (!validateForm()) return;

    const ids = searchParams.get('ids');
    const date = searchParams.get('date');
    if (!ids || !date) {
      setError('No se han proporcionado reservas.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // Obtener cancha y horarios desde reservas_pendientes
      const pendientes = localStorage.getItem('reservas_pendientes');
      if (!pendientes) return setError('No se encontraron datos de reserva previa.');
      const { cancha_id, bloques } = JSON.parse(pendientes);

      // Obtener datos de cancha
      const canchaRes = await axios.get(`/api/reservas-cancha/${cancha_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Marcar como pagado
      await axios.put(
        `/api/reservas/pago_realizado?ReservasIds=${ids}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Guardar en localStorage para mostrar en /reserva_confirmada
      localStorage.setItem('reserva_confirmada', JSON.stringify({
        cancha: canchaRes.data,
        fecha: date,
        horarios: bloques.map((b: any) => `${b.hora_inicio} - ${b.hora_fin}`),
        pago,
        form,
      }));

      navigate('/reserva_confirmada');
    } catch (err) {
      console.error(err);
      setError('Hubo un error procesando el pago.');
    }
  };

  const tomato = 'text-[#F15A29] text-sm mt-1';

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!pago) return <div className="p-8 text-gray-700">Cargando pago…</div>;

  return (
    <>
      <Navbar />
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto pt-32 px-6 md:px-16">
        <div className="bg-white p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Pagar a Playbooker</h2>
          <p className="text-4xl font-bold text-gray-900 mb-4">${pago.total}</p>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between"><span>Tarifa de servicio</span><span>${pago.subtotal}</span></div>
            <div className="flex justify-between"><span>Adicional</span><span>$0.00</span></div>
            <div className="flex justify-between"><span>IVA</span><span>${pago.iva}</span></div>
            <hr className="my-4" />
            <div className="flex justify-between font-semibold"><span>Total</span><span>${pago.total}</span></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Información de compra</h2>
          <div className="space-y-4">
            {['email', 'direccion', 'cedula_ruc', 'tarjeta', 'vencimiento', 'cvc'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace('_', ' ')}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  placeholder={`Ingrese su ${field.replace('_', ' ')}`}
                  value={(form as any)[field]}
                  onChange={handleInput}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
                />
                {errors[field] && <p className={tomato}>{errors[field]}</p>}
              </div>
            ))}
            <button
              onClick={handlePagar}
              className="mt-6 w-full text-white py-3 rounded-lg font-semibold shadow-md transition duration-200 bg-gradient-to-r from-[#00a8e8] to-[#f89e1b] hover:opacity-90"
            >
              Reservar por ${pago.total}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservaStep3;
