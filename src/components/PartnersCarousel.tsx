// src/components/PartnersCarousel.tsx

import { useState } from 'react';
import { TbSoccerField } from 'react-icons/tb';
import { FaBasketballBall } from 'react-icons/fa';
import { GiTennisBall, GiTennisRacket } from 'react-icons/gi';

const sports = [
  { name: 'Fútbol', icon: <TbSoccerField className="text-6xl text-green-600" /> },
  { name: 'Básquet', icon: <FaBasketballBall className="text-6xl text-red-700" /> },
  { name: 'Tenis', icon: <GiTennisBall className="text-6xl text-green-300" /> },
  { name: 'Pádel', icon: <GiTennisRacket className="text-6xl text-blue-300" /> },
];

export default function PartnersCarousel() {
  const [idx, setIdx] = useState(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto text-center mb-6">
        <h3 className="text-3xl font-semibold text-[#DB864F]">Empresas Aliadas</h3>
        <p className="text-gray-600 mt-2">Conoce las empresas que utilizan playbooker</p>
      </div>
      <div className="overflow-x-auto">
        <div className="flex space-x-6 px-8">
          {sports.map((s, i) => (
            <div
              key={i}
              className={`
                min-w-[200px] h-40
                bg-gray-50 rounded-2xl
                flex items-center justify-center
                ${i === idx ? 'shadow-xl' : 'shadow-lg'}
                transition-shadow
              `}
            >
              {s.icon}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {sports.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`
              w-3 h-3 rounded-full
              ${i === idx ? 'bg-gray-800' : 'bg-gray-300'}
              transition-colors
            `}
          />
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-4 text-2xl text-gray-600">
        <button
          onClick={() => setIdx((idx - 1 + sports.length) % sports.length)}
          className="hover:text-gray-800"
        >
          ‹
        </button>
        <button
          onClick={() => setIdx((idx + 1) % sports.length)}
          className="hover:text-gray-800"
        >
          ›
        </button>
      </div>
    </section>
  );
}
