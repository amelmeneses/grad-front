// src/components/ReservaStep3.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiDiscover,
} from 'react-icons/si';

const cardPatterns: Record<string, RegExp> = {
  Visa: /^4/,
  Mastercard: /^5[1-5]/,
  Amex: /^3[47]/,
  Discover: /^6(?:011|5)/,
};

const detectCardType = (number: string): string => {
  for (const [type, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(number)) return type;
  }
  return '';
};

const luhnCheck = (num: string): boolean => {
  let sum = 0;
  let shouldDouble = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

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
  const [cardType, setCardType] = useState('');
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
      .then(res => setPago(res.data))
      .catch(() => setError('Error cargando detalles de pago'));
  }, [canchaId, searchParams]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'tarjeta') {
      const raw = value.replace(/\D/g, '').slice(0, 16);
      const groups = raw.match(/.{1,4}/g);
      newValue = groups ? groups.join(' ') : raw;
      setCardType(detectCardType(raw));
    }

    if (name === 'vencimiento') {
      const raw = value.replace(/\D/g, '').slice(0, 4);
      newValue = raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
    }

    setForm(f => ({ ...f, [name]: newValue }));
    setErrors(e => ({ ...e, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ciRucRegex = /^\d{10,13}$/;
    const yearMonthRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const rawCard = form.tarjeta.replace(/\s/g, '');

    if (!emailRegex.test(form.email)) newErrors.email = 'Ingrese un email válido.';
    if (!form.direccion.trim()) newErrors.direccion = 'La dirección no puede estar vacía.';
    if (!ciRucRegex.test(form.cedula_ruc)) newErrors.cedula_ruc = 'Debe tener entre 10 y 13 números.';
    if (rawCard.length !== 16 || !luhnCheck(rawCard)) {
      newErrors.tarjeta = 'Número de tarjeta inválido.';
    }
    if (!yearMonthRegex.test(form.vencimiento)) {
      newErrors.vencimiento = 'Formato inválido, use MM/YY.';
    }
    if (!/^\d{3,4}$/.test(form.cvc)) newErrors.cvc = 'CVC inválido.';
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
      const pendientes = localStorage.getItem('reservas_pendientes');
      if (!pendientes) return setError('No se encontraron datos de reserva previa.');
      const { cancha_id, bloques } = JSON.parse(pendientes);
      const canchaRes = await axios.get(`/api/reservas-cancha/${cancha_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await axios.put(
        `/api/reservas/pago_realizado?ReservasIds=${ids}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('reserva_confirmada', JSON.stringify({
        cancha: canchaRes.data,
        fecha: date,
        horarios: bloques.map((b: any) => `${b.hora_inicio} - ${b.hora_fin}`),
        pago,
        form,
        cardType,
      }));
      navigate('/reserva_confirmada');
    } catch {
      setError('Hubo un error procesando el pago.');
    }
  };

  const tomato = 'text-[#F15A29] text-sm mt-1';

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!pago) return <div className="p-8 text-gray-700">Cargando pago…</div>;

  const rawCard = form.tarjeta.replace(/\s/g, '');

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
            {['email', 'direccion', 'cedula_ruc'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace('_',' ')}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  autoComplete={field === 'email' ? 'email' : 'street-address'}
                  placeholder={`Ingrese su ${field.replace('_',' ')}`}
                  value={(form as any)[field]}
                  onChange={handleInput}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
                />
                {errors[field] && <p className={tomato}>{errors[field]}</p>}
              </div>
            ))}

            {/* Tarjeta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarjeta</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="tarjeta"
                  autoComplete="cc-number"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={form.tarjeta}
                  onChange={handleInput}
                  className="flex-1 border border-gray-200 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
                />
              </div>
              {/* Mostrar tipo e ícono */}
              {rawCard.length > 0 && cardType && (
                <div className="mt-2 flex items-center space-x-2 text-black">
                  {cardType === 'Visa' && <SiVisa className="w-6 h-6" />}
                  {cardType === 'Mastercard' && <SiMastercard className="w-6 h-6" />}
                  {cardType === 'Amex' && <SiAmericanexpress className="w-6 h-6" />}
                  {cardType === 'Discover' && <SiDiscover className="w-6 h-6" />}
                  <span className="text-sm font-medium">{cardType}</span>
                </div>
              )}
              {errors.tarjeta && <p className={tomato}>{errors.tarjeta}</p>}
            </div>

            {/* Vencimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento (MM/YY)</label>
              <input
                type="text"
                name="vencimiento"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={form.vencimiento}
                onChange={handleInput}
                className="w-1/2 border border-gray-200 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
              />
              {errors.vencimiento && <p className={tomato}>{errors.vencimiento}</p>}
            </div>

            {/* CVC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <input
                type="text"
                name="cvc"
                autoComplete="cc-csc"
                inputMode="numeric"
                placeholder="000"
                value={form.cvc}
                onChange={handleInput}
                className="w-1/3 border border-gray-200 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
              />
              {errors.cvc && <p className={tomato}>{errors.cvc}</p>}
            </div>

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
